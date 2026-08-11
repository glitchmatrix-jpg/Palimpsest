# Phase 8 — Gold QA Matrix

Gold is a release certification, not a claim that CI can emulate every browser. Automated checks live in `scripts/audit_phase_8.mjs`; the matrix below must be completed on real browser engines/devices before Gold is locked.

## Release rule

A Gold blocker is any crash, inaccessible primary action, unreadable/overlapping content, lost Journal data, broken route refresh, missing card asset, unusable fallback, or sustained animation/GPU behavior that makes the experience visibly janky.

Cosmetic differences caused by font rasterization, browser chrome, or a tiny non-blocking spacing difference are not Gold blockers unless they harm readability or interaction.

## Desktop viewport matrix

- [ ] 1920×1080 — Chromium
- [ ] 1600×900 — Chromium
- [ ] 1440×900 — Chromium
- [ ] 1366×768 — Chromium
- [ ] Ultrawide (≥2560×1080) — Chromium
- [ ] Desktop Safari/WebKit if available
- [ ] Firefox current

For each viewport: Portal → Learn → Journey → Cards modal → Read setup/deal/result → save → Journal detail. Check horizontal overflow, clipped fixed controls, modal reachability, readable line lengths, and card image integrity.

## Tablet

- [ ] portrait (~768×1024)
- [ ] landscape (~1024×768)
- [ ] rotate while a card modal is open
- [ ] rotate while Read picker is open
- [ ] rotate on a long Read result

## Mobile

- [ ] 360×800
- [ ] 375×812
- [ ] 390×844
- [ ] 412×915
- [ ] iPhone Safari, real device
- [ ] Android Chrome, real device

For every mobile target: bottom navigation never covers the active control; dialogs remain closable; touch targets are comfortable; no accidental horizontal scroll; card flips do not shift layout; reversed cards remain legible; keyboard opening for search/question/note does not trap controls below the viewport.

## Graphics / performance

Production defaults to automatic capability detection.

Reproducible Gold URLs:

- Normal: `https://glitchmatrix-jpg.github.io/Palimpsest/`
- No WebGL: `https://glitchmatrix-jpg.github.io/Palimpsest/?graphics=off`
- Weak-GPU simulation: `https://glitchmatrix-jpg.github.io/Palimpsest/?graphics=low`

Expected effect budget:

| Surface | Gold budget |
|---|---|
| Home | Full: Dither + localized Molten. Low: Dither only. Off: CSS atmosphere only. |
| Learn | lightweight CSS/SVG/course motion |
| Fool’s Journey | CSS atmosphere; hidden Threads must not allocate GPU work |
| Cards | almost static; tilt only where appropriate |
| Read | CSS/semantic SVG; no competing full-screen GPU stack |
| Journal | static |

- [ ] `graphics=off` reaches every route and every primary action
- [ ] `graphics=low` is smooth on a constrained/older device
- [ ] background tabs stop/pause active render loops
- [ ] rapid route changes do not leave canvases running
- [ ] no screen shows three full-screen GPU effects simultaneously
- [ ] portal remains designed when all WebGL is absent

## Reduced motion

Enable OS/browser `prefers-reduced-motion: reduce` and repeat:

- [ ] Portal enter
- [ ] Journey scroll
- [ ] Cards open/close
- [ ] Read deal/reveal/result
- [ ] Journal navigation

No essential information may depend on animation. No continuous decorative motion should remain necessary to understand state.

## Keyboard

Run the application without a mouse:

- [ ] enter Portal
- [ ] navigate top/bottom nav
- [ ] operate Learn course controls
- [ ] open and close Cards detail
- [ ] change orientation
- [ ] open Journey focus and close with Escape
- [ ] choose spread/method/reversal setting
- [ ] operate physical card picker
- [ ] reveal cards and interpret
- [ ] save a reading
- [ ] search Journal, edit note, export/restore controls

Focus must always remain visible and no modal may leave the user stranded behind it.

## Screen reader / accessible naming

With VoiceOver, TalkBack, NVDA or equivalent where available:

- [ ] page/section headings form a sensible hierarchy
- [ ] primary nav names are announced
- [ ] card buttons announce card names
- [ ] reversed orientation is conveyed in text, not only by rotation
- [ ] modal/dialog names are announced
- [ ] close buttons have useful accessible names
- [ ] decorative images/SVGs do not create noise
- [ ] status messages for Journal save/restore are perceivable

## Routing / refresh

The app intentionally uses hash routing for GitHub Pages. Test direct loads and refreshes at:

- [ ] `/#/learn`
- [ ] `/#/journey`
- [ ] `/#/cards`
- [ ] `/#/read`
- [ ] `/#/journal`

Also test browser Back/Forward between all routes. A direct path such as `/Palimpsest/read` is not a supported route; the canonical direct URL is `/Palimpsest/#/read`.

## Storage / backup failure tests

- [ ] IndexedDB normal: save survives hard refresh
- [ ] IndexedDB unavailable/blocked: Read remains usable and save gives a readable local-storage error
- [ ] Journal opening with storage unavailable does not crash the shell
- [ ] export valid JSON
- [ ] merge valid JSON
- [ ] replace with valid JSON
- [ ] malformed JSON is rejected
- [ ] valid JSON with wrong `schema` is rejected
- [ ] unsupported backup version is rejected
- [ ] reading with missing cards/positions is rejected
- [ ] delete then restore works as expected

## Read abuse tests

- [ ] empty question
- [ ] 1-character question
- [ ] question at 280-character limit
- [ ] paste beyond 280 characters is constrained
- [ ] physical deck, reversals on
- [ ] physical deck, upright-only
- [ ] digital deck, reversals on
- [ ] digital deck, upright-only
- [ ] same cards tested across all four presets
- [ ] weak Thread correctly refuses a forced link
- [ ] meaningful Layers appear
- [ ] ordinary mixed spread omits Layers
- [ ] relationship spread never claims hidden private thoughts as fact
- [ ] future position stays directional rather than guaranteed

## Deck certification

Automated gate requires exactly 78 unique front references plus one card back in the shipping tree.

Manual image sweep:

- [ ] all 22 Major Arcana upright
- [ ] all 22 Major Arcana reversed
- [ ] all Cups upright/reversed
- [ ] all Swords upright/reversed
- [ ] all Wands upright/reversed
- [ ] all Pentacles upright/reversed
- [ ] card back consistent in Portal and Read
- [ ] The World still fits its canvas/border

## Deployment hygiene

`vite.config.js` uses `assets/` as the production public directory. QA images under `docs/asset-qa/` must never be copied into `dist`.

The automated Gold audit fails on obvious contact/full/deck-sheet filenames inside the shipping asset tree, requires 79 shipping card PNGs, reports their total size, and blocks gross size regressions.

Optimization target after visual verification: convert card fronts/back to visually lossless/high-quality WebP or AVIF only if an image-by-image comparison confirms no meaningful degradation to borders, type, thin gold lines, or reversed rendering.

## Gold sign-off

- Automated Gold QA: [ ] PASS
- Production build: [ ] PASS
- GitHub Pages deploy: [ ] PASS
- Desktop matrix: [ ] PASS
- Tablet matrix: [ ] PASS
- Mobile matrix: [ ] PASS
- iPhone Safari: [ ] PASS
- Android Chrome: [ ] PASS
- Keyboard: [ ] PASS
- Screen reader naming: [ ] PASS
- WebGL off / weak GPU: [ ] PASS
- Storage/backup abuse: [ ] PASS
- 78-card visual sweep: [ ] PASS

Phase 8 is locked only when every required Gold sign-off above is either passed or explicitly documented as unavailable with a release decision.
