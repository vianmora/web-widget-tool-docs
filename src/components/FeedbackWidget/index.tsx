import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

// ─── EmailJS config ────────────────────────────────────────────────────────
// 1. Create a free account at https://emailjs.com
// 2. Add an email service (Gmail, Outlook…) → copy the Service ID
// 3. Create two email templates (see docs/contributing/architecture.md)
//    Template variables available: {{page_title}}, {{page_url}}, {{rating}}, {{comment}}
// 4. Copy your Public Key from Account → API Keys
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_RATING_TEMPLATE_ID = 'YOUR_RATING_TEMPLATE_ID';
const EMAILJS_COMMENT_TEMPLATE_ID = 'YOUR_COMMENT_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
// ───────────────────────────────────────────────────────────────────────────

async function sendViaEmailJS(
  templateId: string,
  params: Record<string, string>,
): Promise<void> {
  await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: params,
    }),
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
    await sendViaEmailJS(EMAILJS_RATING_TEMPLATE_ID, {
      page_url: pageUrl,
      page_title: pageTitle,
      rating: `${star}/5`,
    });
  };

  const handleSend = async () => {
    if (comment.trim()) {
      await sendViaEmailJS(EMAILJS_COMMENT_TEMPLATE_ID, {
        page_url: pageUrl,
        page_title: pageTitle,
        rating: `${rating}/5`,
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
