# Zimplicz

Website for **Zimplicz**, a creative & digital advertising group, and its studios:

- **VK Studio**: photography & videography
- **View Clickz Productions**: film, TV & media production
- **Pawura Digital Media & Publications**: digital publishing & media network

Plain static site (HTML/CSS/JS, GSAP from CDN). No build step.

## Run locally

```bash
node serve.js
```

Then open http://localhost:5177.

## Brand files

`brand/` holds the Zimplicz logo (SVG + transparent PNG). To regenerate:

```bash
cd brand
node make-logo.js   # writes the SVGs
py render.py        # renders PNGs (needs PyMuPDF)
```
