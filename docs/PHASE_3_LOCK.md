# Phase 3 Lock — The Living Card Library

Status: **LOCKED**

Accepted baseline for Phase 3:

- All 78 tarot card assets are available in the library.
- Search works across card names, suits and keywords.
- Filters: All, Major, Cups, Swords, Wands, Pentacles.
- Desktop card tiles use restrained physical tilt/glint treatment.
- Mobile card tiles remain touch-friendly and static.
- Card detail opens as a true viewport layer via React portal.
- Desktop detail view is stable, centered and scrollable.
- Mobile detail view is full-screen, continuous and scrollable.
- Shell navigation is hidden while a mobile card detail is open.
- Upright/Reversed toggle, keywords, Meaning, Symbols, Guidance and Reflection are present.
- ESC/backdrop/close controls work as applicable.
- Reduced-motion behavior remains supported.

Regression boundary:

Do not redesign or alter the Phase 3 card library interaction model, grid, filters, tilt behavior, card-detail modal architecture, or responsive behavior in later phases unless fixing a confirmed bug or implementing a user-approved cross-phase requirement.

Phase 3 may be extended later with richer content or integrations, but the accepted interaction and layout baseline above should remain intact.
