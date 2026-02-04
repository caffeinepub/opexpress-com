# Specification

## Summary
**Goal:** Update the site header logo image to use a new 90s-inspired retro neon OPExpress wordmark while keeping the header layout and behavior unchanged.

**Planned changes:**
- Add a new retro neon wordmark image asset under `frontend/public/assets/generated`.
- Update only the selected header `<img>` in `frontend/src/components/layout/SiteHeader.tsx` (its `src` and any styling directly on the `<img>`) to use the new asset while preserving the existing `h-10 w-auto` constraints.

**User-visible outcome:** The header displays the updated 90s-style neon OPExpress wordmark logo, remaining legible and fitting within the current header height without any other header changes.
