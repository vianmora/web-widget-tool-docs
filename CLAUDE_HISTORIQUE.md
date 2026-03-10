# Historique des sessions

| Date | Demande résumée | Action effectuée |
|---|---|---|
| 2026-03-10 | Créer le repo de doc, CLAUDE.md avec plan, initialiser Docusaurus P0 | Création du repo, CLAUDE.md avec plan complet, init Docusaurus v3, configuration branding (logo, couleurs violettes), sidebars, toutes les pages P0 (self-hosting : introduction, requirements, quick-start, configuration ; contributing : introduction, architecture, local-setup, pr-guidelines) |
| 2026-03-10 | Fix : ERR_EMPTY_RESPONSE sur le container de dev | Volume nommé pour node_modules, passage à `npx docusaurus start` avec `--host 0.0.0.0` |
| 2026-03-10 | Fix : erreurs SVG undraw_docusaurus dans HomepageFeatures | Suppression des composants par défaut inutilisés (HomepageFeatures, index.tsx, index.module.css, markdown-page.md) |
| 2026-03-10 | Fix : Page Not Found sur `/` | Ajout de `slug: /` sur `docs/self-hosting/introduction.md` |
| 2026-03-10 | Fix : hot reload non fonctionnel depuis Windows | Ajout de `--poll 1000`, `CHOKIDAR_USEPOLLING=true`, `WATCHPACK_POLLING=true` dans le compose dev |
