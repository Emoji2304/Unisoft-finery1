# UniSoft Finery — Static Website

This repository contains a responsive static website for UniSoft Finery.

Pages
- Home: `index.html`
- About: `about.html`
- Jewelries: `jewelries.html`
- Collections: `collections.html`
- Contact: `contact.html`

Files of note
- Shared CSS: `unisoft.css`, `collections.css`, `jewelries.css`
- Page CSS: `about.css`, `contact.css`
- Shared JS: `main.js` — responsive nav toggle, nav highlighting (defaults to `index.html`), contact form validation, footer year

Quick notes
- The contact form currently uses a mailto fallback. For reliable message delivery use a form backend (Formspree, Netlify Forms, or a small server).
- Images are loaded from external sources (Unsplash). For production, optimize and serve via a CDN or host optimized images locally.
- `sitemap.xml` references `index.html` as the home page.

How to test locally
1. Put all files in one folder.
2. Open `index.html` in your browser (or any of the other HTML files).
3. Test at different widths (desktop, tablet, mobile) or use the device toolbar in DevTools.

Recommended deployment (static hosting)
- GitHub Pages: Push to a repository and enable GitHub Pages. Rename or use `index.html` as the site root.
- Netlify / Vercel: Drag-and-drop or connect your Git repo. They provide free HTTPS and global CDN.
- S3 + CloudFront: Good for higher traffic and full control.

Optional next steps I can help with
- Wire the contact form to Formspree, Netlify Forms, or a custom endpoint so messages are stored and emailed.
- Optimize images and add `loading="lazy"` to large images.
- Add analytics (Plausible, Google Analytics).
- Add accessibility improvements (focus styles, ARIA attributes).
- Add CI/CD: auto-deploy from GitHub to Netlify/Vercel.

If you'd like, I can:
- Push a ready-to-deploy Netlify/Vercel config (redirects, form settings).
- Convert `collections.html` filename to `collections.html` for lowercase consistency across systems.
- Run a quick checklist for accessibility and SEO before you deploy.