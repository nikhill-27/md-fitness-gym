# MD Fitness Gym — Landing Page

Single-file, dependency-free landing page (HTML/CSS/JS + GSAP CDN) for **MD Fitness Gym**, Meerut.
Scroll-driven canvas frame-sequence hero, neon-blue/black/silver branding, "Ignite The Shakti Within".

## Structure
```
index.html          → the whole site (HTML + CSS + JS in one file)
assets/logo.png      → gym logo (navbar, favicon, footer)
frames/               → drop your hero frame sequence here (frame_001.webp … frame_100.webp)
tunnel-frames/         → optional second scroll sequence (projects/gallery section)
```

## Run locally
Just open `index.html` in a browser, or serve it:
```bash
npx serve .
```

## Add your frame sequence
1. Export your 3D/AE animation as `frame_001.webp` … `frame_100.webp`.
2. Drop them in `/frames`.
3. In `index.html`, adjust `FRAME_COUNT` and `FRAME_PATH` inside the `<script>` block if your count/extension differs.

## Deploy
Works on any static host — GitHub Pages, Vercel, Netlify — no build step needed.

### GitHub Pages (free, simplest)
1. Push this repo to GitHub (see commands below).
2. Repo → **Settings → Pages** → Source: `main` branch, `/ (root)` → Save.
3. Site goes live at `https://<your-username>.github.io/<repo-name>/`.

## Tech
- Vanilla HTML/CSS/JS — zero build step
- GSAP 3 + ScrollTrigger (CDN) for the scroll-linked frame animation
- Google Fonts: Oswald + Teko

---
**Contact:** +91 6396436526 · Ganganagar, Meerut (opp. RPG Galleria) · www.mdfitnessgym.in
