# MD Fitness Gym — Landing Page

High-performance, dependency-free landing page for **MD Fitness Gym**, Meerut.
Features a scroll-driven canvas frame-sequence hero on desktop, highly optimized mobile layouts, neon-blue/black/silver branding, and "Ignite The Shakti Within" theme.

## Recent Optimizations
- **GSAP Mobile Viewport Fix:** Switched to Dynamic Viewport Height (`100dvh`) and absolute/relative pinning rules for the Hero canvas, combined with a `resize` listener in `main.js` to ensure GSAP ScrollTrigger accurately recalculates math despite mobile URL bar resizing.
- **Strict Layout Fixes:** Added aggressive mobile-only `@media (max-width: 768px)` CSS overrides to restructure the Pricing grid to a strict single-column flex layout (fixing overlap), and enforce infinite auto-scrolling on the gallery marquee without breaking desktop styles.
- **Responsive Architecture:** Auto-scrolling marquees and dedicated native HTML `<dialog>` modals implemented for bug-free, script-light mobile viewing. 
- **Modular Codebase:** Separated HTML, CSS, and JS for better maintainability and cleaner code structure.

## Structure
```
index.html          → The core HTML structure
style.css           → Styling with advanced media queries for mobile-first optimizations
main.js             → JavaScript logic (GSAP ScrollTrigger, native dialog handling, etc.)
assets/             → Contains gym logo, gallery videos, and other media
frames/             → Drop your desktop hero frame sequence here (frame_001.webp … frame_100.webp)
```

## Run locally
Just open `index.html` in a browser, or serve it:
```bash
npx serve .
```

## Deploy
Works on any static host — GitHub Pages, Vercel, Netlify — no build step needed.

### GitHub Pages (free, simplest)
1. Push this repo to GitHub.
2. Repo → **Settings → Pages** → Source: `main` branch, `/ (root)` → Save.
3. Site goes live at `https://<your-username>.github.io/<repo-name>/`.

## Tech
- Vanilla HTML/CSS/JS — zero build step
- GSAP 3 + ScrollTrigger (CDN) for the scroll-linked frame animation
- Google Fonts: Oswald + Teko
- Native HTML `<dialog>` for lightweight modals

---
**Contact:** +91 6396436526 · Ganganagar, Meerut (opp. RPG Galleria) · www.mdfitnessgym.in
