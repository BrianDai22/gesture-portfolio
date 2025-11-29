# Code Quality Review – Gesture Portfolio

<!-- markdownlint-disable MD013 -->

## Executive Summary

- Overall code quality rating: **7/10** (secure foundation, some maintainability/perf gaps)
- Critical issues: Security 0, Maintainability 0, Performance 0 (no crash-level defects found)
- Top 3 priority recommendations:
  1) Harden CSP by removing `unsafe-inline/unsafe-eval` and using nonces/hashes for required inline blocks.
  2) Guard all `localStorage` access to avoid crashes in storage-restricted contexts; provide safe fallbacks.
  3) Centralize section configuration and clean up lifecycle listeners/resources to prevent drift and leaks.

## Security Analysis

### Critical Issues

- None observed.

### High Priority Issues

- **Overly permissive CSP allows inline/eval execution** — `index.html:8` and `security-headers.conf:4` include `unsafe-inline`, `unsafe-eval`, and `wasm-unsafe-eval`, undermining XSS protections. Impact: attackers can inject/execute arbitrary code if any injection vector appears. **Recommendation:** Replace `unsafe-*` with script nonces/hashes for the import map block; move other inline code to external modules; keep only required origins.

### Medium Priority Issues

- **Unprotected localStorage access at module load** — `src/js/state/handState.js:6-23` reads/writes `localStorage` outside `try/catch`. In Safari private mode or storage-disabled contexts this throws during module evaluation, preventing the app from loading. **Recommendation:** Wrap storage access in `try/catch`, fall back to in-memory defaults when storage is unavailable.
- **Import map / Three.js CDN lacks integrity** — `index.html:17-25` and `importmap.json` load Three.js modules from jsDelivr without SRI. While HTTPS reduces risk, tampering at CDN edge would run unchecked. **Recommendation:** pin version (already done) and consider self-hosting or using an integrity-checked bundling step; if staying CDN-only, add SRI once supported for import maps or document the risk.

### Best Practices Compliance

- DOM updates rely on `textContent` and element creation (good against XSS).
- Permissions-Policy and other headers are provided via `security-headers.conf` (good), but rely on deploy-time enforcement; local dev still lax (expected).

## Maintainability Analysis

### Code Organization Assessment

- Clear modular separation across `core`, `scene`, `state`, `gestures`, and `ui`. ES modules used consistently.

### Technical Debt Identified

- **Duplicated section count config** — `navigationState.js:6-20` hard-codes `TOTAL_SECTIONS = 8` while `sectionPanels.js:12-22` is the real source of truth. Adding/removing panels will desync navigation bounds. **Recommendation:** Derive totals from `SECTIONS.length` exported from a single module.
- **Lifecycle cleanup gaps** — `sceneManager.js:52-90` adds a window `resize` listener but never removes it on destroy; `navigation.js:23-35` registers `onSectionChange` callbacks without unregistering; `app.js:216-235` attaches hand-selector click handlers on each init without teardown. Re-init or hot reload will stack listeners. **Recommendation:** Add dispose functions that remove listeners or guard against double-registration.
- **Gesture indicator timeouts unmanaged** — `gestureIndicator.js:84-99` and `142-144` schedule `setTimeout` without tracking IDs; after `destroyGestureIndicator` nulls refs, late timeouts can throw. **Recommendation:** store timeout IDs and clear them on destroy, or guard with null checks inside callbacks.

### Refactoring Recommendations

- Extract section configuration to a single module; have navigation/state consume it to avoid drift.
- Introduce a lightweight lifecycle registry (or simple boolean guards) to prevent duplicate listener registration across `sceneManager`, `navigation`, and `app` UI initializers.
- Add small helper wrappers for storage access (get/set with fallback) to centralize error handling.

### Documentation Gaps

- No CONTRIBUTING or coding-standard doc (CLAUDE.md absent). Consider adding conventions for event cleanup, Three.js disposal, and gesture tuning parameters.

## Performance Analysis

### Memory Management Issues

- **Renderer and assets not disposed** — `sceneManager.js` stops the RAF loop but never calls `renderer.dispose()` or removes resize listener; panel meshes/textures are left in memory. Impact: memory grows on re-init and GPU resources stay allocated. **Recommendation:** on destroy, dispose renderer, geometries/materials/textures, and remove the resize handler.
- **Hand overlay sizing mismatch** — `handOverlay.js:31-40` sizes the overlay to `window.innerWidth/Height` instead of the video’s intrinsic size; on devices with different video aspect ratios this forces canvas re-allocations and can misalign overlay. **Recommendation:** use video dimensions when available, fall back to window size only when video metadata is missing.

### Render Performance Issues

- **Per-frame object churn in pointer detection** — `navigation.js:63-109` allocates new `Vector2/Vector3` objects for every panel each frame. At 60fps this creates avoidable GC pressure. **Recommendation:** reuse preallocated vectors and `set`/`copy` in the loop.
- **Animation timing via `Date.now`** — `navigation.js:42-58` uses wall-clock time; system clock changes or background throttling can cause uneven motion. **Recommendation:** switch to `performance.now()` inside the render loop for monotonic timing.
- **Resize handler unthrottled** — `sceneManager.js:81-90` calls `setSize` on every resize event; rapid resize can trigger dozens of expensive recalculations. **Recommendation:** debounce with `requestAnimationFrame` or a small timeout.

### Optimization Opportunities

- Track and cancel gesture-indicator timeouts (see above) to avoid late DOM work.
- Consider lazily creating panel title textures only when first viewed to reduce upfront texture work (currently minimal but scales with more panels).

## Detailed Findings

1. **Over-permissive CSP** — `index.html:8`, `security-headers.conf:4` — **Severity:** High — Allows `unsafe-inline`/`unsafe-eval`, weakening XSS protections. **Impact:** Any injection vector enables arbitrary JS. **Recommendation:** Replace with nonce/hash-based policy; move inline blocks to external files; drop `unsafe-*` directives.
2. **localStorage access not guarded** — `src/js/state/handState.js:6-23` — **Severity:** Medium — Throws in storage-restricted contexts, preventing app load. **Impact:** App fails to start for affected users. **Recommendation:** Wrap in `try/catch`, default to memory, and gate writes when storage unavailable.
3. **CDN modules lack integrity** — `index.html:17-25`, `importmap.json` — **Severity:** Low — No SRI on Three.js import map. **Impact:** CDN tampering would go undetected. **Recommendation:** Self-host or bundle; if staying CDN, add SRI when supported or document risk.
4. **Resize listener leak** — `src/js/scene/sceneManager.js:52-90` — **Severity:** Medium — Listener persists after destroy; multiple inits stack calls. **Impact:** Extra work per resize; potential memory leak. **Recommendation:** Remove listener on destroy or guard against duplicate registration.
5. **Three.js resources not disposed** — `sceneManager.js` (no dispose in destroy path) — **Severity:** Medium — GPU/CPU resources retained after teardown. **Impact:** Memory/GPU leaks on re-init. **Recommendation:** Add `renderer.dispose()`, `scene.traverse` disposal, and clear update callbacks.
6. **Hand-selector click handlers accumulate** — `src/js/core/app.js:216-235` — **Severity:** Low — Re-init adds duplicate listeners. **Impact:** Multiple `setDominantHand` calls per click. **Recommendation:** Track handlers and remove on destroy or guard with a setup flag.
7. **Section count duplication** — `navigationState.js:6-20` vs `sectionPanels.js:12-22` — **Severity:** Medium — Hard-coded total can desync from actual panels. **Impact:** Navigation bounds, wrap logic, and indicators can break when sections change. **Recommendation:** Derive count from a single exported config.
8. **Pointer detection allocates per frame** — `navigation.js:63-109` — **Severity:** Low — New vectors every frame increase GC churn. **Impact:** Minor FPS jitter on low-end devices. **Recommendation:** Reuse preallocated vectors.
9. **Gesture indicator timeouts unchecked** — `gestureIndicator.js:84-99, 142-144, 150-157` — **Severity:** Low — Timeouts may fire after destroy when refs are null. **Impact:** Potential console errors; stray DOM class toggles. **Recommendation:** Store timeout IDs and clear on destroy; guard inside callbacks.
10. **Overlay sizing may misalign landmarks** — `handOverlay.js:31-40` — **Severity:** Low — Canvas uses window size instead of video dimensions. **Impact:** Skeleton overlay drifts on aspect-ratio changes; extra canvas reallocations. **Recommendation:** When `video.videoWidth/Height` are available, size canvas to those values.
11. **Animation timing uses wall-clock** — `navigation.js:42-58` — **Severity:** Low — `Date.now()` sensitive to system clock changes/background throttling. **Impact:** Janky animations in some conditions. **Recommendation:** Use `performance.now()` within RAF loop.
12. **Unthrottled resize work** — `sceneManager.js:81-90` — **Severity:** Low — Frequent resize events cause repeated `setSize`/projection updates. **Impact:** Minor perf hit during window drags. **Recommendation:** Debounce via RAF or timeout.

## Action Items

1) Tighten CSP and remove `unsafe-*` directives; adopt nonce/hash for inline import map (Effort: medium, Impact: high).
2) Add safe storage wrapper around dominant-hand preference (Effort: small, Impact: medium).
3) Centralize section config and derive totals from a single source (Effort: medium, Impact: medium).
4) Add destroy/teardown paths: remove resize listener, dispose renderer/resources, clear update callbacks (Effort: medium, Impact: medium).
5) Guard or clean up UI/event listeners (hand selector, onSectionChange callbacks, gesture timeouts) to prevent accumulation (Effort: small, Impact: medium).
6) Optimize per-frame allocations in `updatePointer` by reusing vectors and switch to `performance.now()` for animation timing (Effort: small, Impact: low).
7) Resize hand overlay to video dimensions when available to keep skeleton aligned (Effort: small, Impact: low).
