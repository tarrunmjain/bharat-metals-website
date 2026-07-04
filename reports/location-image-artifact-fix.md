# Location Image Artifact Fix

Checked: 2026-07-04T07:42:18.485Z

Issue: the shared Renigunta / South India logistics image showed a small bottom-edge source artifact in the visual audit.

Fix applied: targeted CSS crop for only `.page-hero-media img[src$="south-india-logistics.webp"]`, using a tiny `scale(1.018)` inside the existing overflow-hidden image frame.

Scope: no other location image files were replaced and no broad page layout change was made.

Result: PASS - artifact is hidden by a safe page-hero crop adjustment.
