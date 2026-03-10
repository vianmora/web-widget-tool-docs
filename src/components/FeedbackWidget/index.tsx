import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

// ─── Backend endpoint ──────────────────────────────────────────────────────
// Points to the web-widget-tool backend. Update when the domain changes.
const FEEDBACK_ENDPOINT = 'https://webwidgettool.opinoi.fr/api/docs-feedback';
// ───────────────────────────────────────────────────────────────────────────

async function sendFeedback(params: Record<string, string>): Promise<void> {
  await fetch(FEEDBACK_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}

type Step = 'idle' | 'comment' | 'done';

export default function FeedbackWidget(): JSX.Element {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [step, setStep] = useState<Step>('idle');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pageTitle = typeof document !== 'undefined' ? document.title : '';

  const handleStar = async (star: number) => {
    if (step !== 'idle') return;
    setRating(star);
    setStep('comment');
    await sendFeedback({
      page_url: pageUrl,
      page_title: pageTitle,
      rating: String(star),
    });
  };

  const handleSend = async () => {
    if (comment.trim()) {
      await sendFeedback({
        page_url: pageUrl,
        page_title: pageTitle,
        rating: String(rating),
        comment,
      });
    }
    setStep('done');
  };

  return (
    <div ref={ref} className={`${styles.wrapper} ${visible ? styles.visible : ''}`}>
      <p className={styles.title}>Was this page helpful?</p>

      {step === 'done' ? (
        <p className={styles.thanks}>Thank you for your feedback! 🙏</p>
      ) : (
        <>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`${styles.star} ${star <= (hovered || rating) ? styles.filled : ''}`}
                onClick={() => handleStar(star)}
                onMouseEnter={() => step === 'idle' && setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                disabled={step !== 'idle'}
                aria-label={`Rate ${star} out of 5`}
              >
                ★
              </button>
            ))}
          </div>

          {step === 'comment' && (
            <div className={styles.commentBox}>
              <textarea
                className={styles.textarea}
                placeholder="Tell us more... (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <div className={styles.actions}>
                <button className={styles.sendBtn} onClick={handleSend}>
                  Send feedback
                </button>
                <button className={styles.skipBtn} onClick={() => setStep('done')}>
                  Skip
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
