# Phase 2 — The Palimpsest Shell

Status: **READY TO BUILD**

Phase 2 turns the post-portal screen from a temporary landing state into the permanent application shell used by Learn, Cards, Read, and Journal.

## Goal

After entering through the Phase 1 portal, Palimpsest should become calmer without becoming generic. The internal interface should feel like the same symbolic object viewed from inside: editorial, tactile, elegant, responsive, and unmistakably connected to the deck.

The shell must work cleanly on laptop and mobile before Phase 3 begins.

## Core navigation

Primary destinations are locked as:

```text
Learn · Cards · Read · Journal
```

Home is the portal/entry state, not a fifth conceptual pillar.

### Desktop

Use a restrained persistent top navigation or compact floating shell. It should include:

- Palimpsest wordmark / home affordance.
- Learn.
- Cards.
- Read.
- Journal.
- Settings affordance.
- Clear active state.

The shell must not resemble a generic SaaS navbar.

### Mobile

Use a persistent bottom navigation for the four primary destinations, with Settings available separately.

Requirements:

- large touch targets;
- safe-area support;
- no hamburger menu for the four primary destinations;
- labels remain readable at 360 px width;
- content never sits underneath the browser or navigation chrome.

## Routing

Implement client-side routes for:

- `/learn`
- `/cards`
- `/read`
- `/journal`
- `/settings` or equivalent settings surface

GitHub Pages direct-route behavior must be accounted for before Phase 2 is accepted.

## Shell visual system

The interior should use a quieter version of the Phase 1 palette:

- deep violet / near-black navigation and structural surfaces;
- ivory / warm paper content fields;
- restrained gold for focus, active states, edges, and important actions;
- purple as the principal interactive accent.

The transition from portal darkness to interior ivory should feel intentional, like illuminated paper emerging from the dark, not a hard switch into an unrelated website.

## Responsive layout system

Establish reusable primitives rather than page-specific hacks:

- global max-width container;
- mobile / tablet / laptop / wide-desktop gutters;
- typography scale;
- vertical rhythm;
- reusable section header;
- cards/panels;
- modal / drawer behavior;
- focus and hover treatment;
- empty/loading/error states;
- safe-area tokens;
- motion tokens.

Target QA widths include at minimum:

- 360 × 800
- 390 × 844
- 412 × 915
- tablet portrait and landscape
- 1366 × 768
- 1440 × 900
- 1920 × 1080

## Motion policy

Phase 1 remains the most cinematic screen.

Inside Palimpsest:

- navigation transitions should be fast and subtle;
- no full-screen shader on every route;
- page changes should use restrained fades / directional movement;
- motion should reinforce hierarchy rather than decorate everything;
- `prefers-reduced-motion` must remain supported.

## Phase 2 implementation order

1. Add routing foundation.
2. Build desktop shell.
3. Build mobile bottom navigation.
4. Replace the temporary `Choose a layer` landing with the real post-portal home/shell state.
5. Create shared layout primitives and design tokens.
6. Add section placeholders for Learn, Cards, Read, Journal.
7. Implement active navigation and back/home behavior.
8. Test direct URLs under GitHub Pages.
9. Perform laptop/mobile responsive QA.
10. Accessibility pass for keyboard, focus, semantic navigation and reduced motion.

## Out of scope for Phase 2

Do not build the full content/functionality of:

- the 78-card library;
- Learn curriculum;
- Fool's Journey;
- reading engine;
- spread synthesis;
- Journal persistence.

Those belong to later phases. Phase 2 should provide the polished shell they will plug into.

## Acceptance gate

Phase 2 is complete only when:

- navigation works across all four destinations;
- desktop and mobile each feel intentionally designed;
- no text overlap or clipped controls exist at target sizes;
- direct/reloaded GitHub Pages routes work;
- the shell feels visually continuous with the Phase 1 portal;
- keyboard/focus behavior works;
- reduced-motion mode works;
- later pages can be built without creating another navigation/layout system.

Once accepted, the project proceeds to **Phase 3 — The Living Card Library**.
