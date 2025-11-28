# Gesture-Controlled Portfolio

A camera-based, gesture-controlled portfolio website that lets visitors navigate through resume, projects, and skills using hand movements.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **3D Graphics**: Three.js
- **Hand Tracking**: MediaPipe Hands
- **Hosting**: AWS S3 + CloudFront

## Features

- Hand gesture navigation through portfolio sections
- 3D interactive environment
- Minimalist dark theme
- Fallback keyboard/mouse navigation

## Security headers (deploy-time)

- Runtime protections are delivered via HTTP response headers, not meta tags, because `Permissions-Policy` and `frame-ancestors` are header-only.
- See `security-headers.conf` for the recommended set (CSP, frame-ancestors, Permissions-Policy, HSTS, XFO, XCTO, Referrer-Policy).
- Apply by creating a CloudFront Response Headers Policy (override) and attaching it to your distribution that fronts the S3 bucket.
- CSP allowlist: `self` and `https://cdn.jsdelivr.net` (MediaPipe + Three.js). Update if you add new CDNs/APIs.
- Dev note: the meta CSP in `index.html` includes `unsafe-inline` to keep `live-server` autoreload working; production headers in `security-headers.conf` remain stricter (no `unsafe-inline`).

---

*Work in progress*

## Quickstart

```bash
npm install
npm run dev   # serves at http://localhost:3000
```

> Camera access requires HTTPS in production (or localhost during development).

## Phase I Hardening (current status)

- Pinned CDN dependencies (Three.js via import map; MediaPipe 0.4.1675469240) with SRI + `crossorigin`.
- CSP and Permissions-Policy meta headers to limit script origins and camera usage.
- MediaPipe scripts deferred; main module loaded at end of body; preconnect to jsDelivr.
- Accessibility scaffolding: aria labels/hidden for non-text media, live region for status, noscript fallback banner.
- CSS improvements: visible focus styles, responsive typography, reduced-motion support, overlay status card.
- JS structure: `src/js/core/app.js` as Phase I orchestrator; additional folders for scene/gestures/ui/state.

## Project Structure

- `index.html` — entry point, CSP/permissions policy, import map, deferred scripts
- `styles/main.css` — reset, tokens, full-viewport layout, overlay and focus styles
- `src/js/main.js` — ES module entry; initializes `core/app`
- `src/js/core/app.js` — placeholder orchestrator; ready for Phase II wiring
- `assets/` — static assets (empty placeholder)

## Security Notes

- Subresource Integrity (SRI) protects all CDN scripts; update hashes if versions change.
- CSP restricts scripts to `self` and jsDelivr; adjust if adding new CDNs/APIs.
- Permissions-Policy limits camera use to this origin.

## Next (Phase II preview)

- Implement camera lifecycle and MediaPipe Hands integration.
- Add Three.js scene setup and render loop with pause on tab hide.
- Wire keyboard/mouse fallbacks to match gesture controls.
