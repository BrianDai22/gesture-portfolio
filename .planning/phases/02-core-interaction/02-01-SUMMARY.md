# Phase 2 Plan 1: Camera & MediaPipe Setup Summary

**Full-screen AR camera background with live hand tracking and skeleton overlay - right hand appears on right side with smooth cyan/white skeleton rendering**

## Accomplishments
- Camera access module with graceful permission handling (retry with privacy message, then fallback)
- MediaPipe Hands initialization with dominant hand preference (persisted to localStorage)
- Hand skeleton overlay with cyan connection lines and white landmark dots with glow effects
- Video properly oriented (right hand on right side) with matching hand overlay
- Full app orchestration with cleanup on page unload

## Files Created
- `src/js/core/camera.js` - Camera access with getUserMedia, permission retry flow, fallback handling
- `src/js/core/handTracking.js` - MediaPipe Hands initialization, frame processing, handedness detection
- `src/js/state/handState.js` - Hand landmark storage, dominant hand preference with localStorage
- `src/js/ui/handOverlay.js` - Canvas-based hand skeleton rendering with custom drawing

## Files Modified
- `index.html` - Added `<canvas id="hand-overlay">` element
- `styles/main.css` - Camera feed and hand overlay styling with `scaleX(-1)` flip
- `src/js/core/app.js` - Full orchestration importing all modules, lifecycle management
- `src/js/main.js` - Error handling, cleanup on beforeunload

## Decisions Made
- Used CSS `transform: scaleX(-1)` on both video and canvas to show natural orientation (right hand on right)
- Inverted MediaPipe handedness detection to match user perspective (camera reports mirrored)
- Implemented manual canvas drawing instead of MediaPipe drawing_utils for reliability
- Default dominant hand: Right (stored in localStorage key `gesturePortfolio_dominantHand`)

## Issues Encountered
- Initial skeleton not rendering: MediaPipe `drawConnectors`/`drawLandmarks` not properly exported from CDN
  - Resolution: Implemented manual canvas drawing with defined HAND_CONNECTIONS array
- Handedness detection inverted: MediaPipe reports from camera's perspective
  - Resolution: Swapped Left↔Right in handTracking.js for front-facing camera
- Video mirrored incorrectly: Right hand appeared on left side
  - Resolution: Added CSS `transform: scaleX(-1)` to both video and canvas

## Next Step
Ready for 02-02-PLAN.md (Gesture Detection)

---
*Phase: 02-core-interaction*
*Plan: 01*
*Completed: 2025-11-28*
