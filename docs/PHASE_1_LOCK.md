# Phase 1 Lock — The Portal

Status: **LOCKED**

Phase 1 establishes the public entrance experience for Palimpsest. It is now treated as an accepted baseline and should not be changed during later phases except to fix a verified regression, accessibility issue, performance defect, or browser compatibility bug.

## Locked experience

- One-screen portal built around `100svh`.
- Palimpsest wordmark, tagline, card-back focal point, Enter CTA.
- Purple / gold / ivory visual language.
- Dither atmosphere as the dominant environmental texture.
- Localized Molten Metal violet-gold core behind the card.
- Subtle radial depth scaffolding, particles, aura, card sheen, and desktop parallax.
- Mobile-specific visual simplification and focus treatment.
- Desktop pointer interaction and card tilt.
- Mobile autonomous motion without pointer tracking.
- Enter transition that passes through the card into the internal interface.
- Dedicated lightweight mobile transition path.
- Reduced-motion behavior.
- Return-to-portal behavior from the internal landing state.

## Visual hierarchy

The intended layer order is:

```text
Dither atmosphere
      ↓
subtle radial depth
      ↓
molten violet-gold core
      ↓
glowing card focal point
```

## Regression rule

Later work must not casually restyle or recompose the portal. Changes are permitted only when one of these is true:

1. A reproducible bug is found.
2. A target browser/device exhibits a real layout or performance failure.
3. Accessibility requires a correction.
4. A later architecture change would otherwise break Phase 1 behavior.

Any such change should preserve the accepted composition, palette, hierarchy, and entrance metaphor.

## Locked files / responsibilities

The portal currently depends primarily on:

- `src/pages/Home.jsx`
- `src/styles/home.css`
- `src/styles/motion.css`
- `src/styles/portal-visuals.css`
- `src/vendor/react-bits/Dither/`
- `src/vendor/react-bits/MoltenMetal/`

These may still be refactored internally later, but visible Phase 1 behavior is considered a regression boundary.

## Phase 1 acceptance

Phase 1 is accepted as the visual and interaction baseline for Palimpsest. The project now moves to **Phase 2 — The Palimpsest Shell**.
