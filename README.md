# Palimpsest

**Learn the symbols. Read the layers.**

Palimpsest is a lightweight, visual tarot learning and reading companion designed for GitHub Pages.

## Core pillars

- **Learn** — Fool's Journey, four suits, numbers, courts, reversals, and practice
- **Read** — position-aware card meanings plus holistic spread synthesis
- **Journal** — save readings, notes, and learning progress locally in the browser

## Architecture

Palimpsest is intentionally static and lightweight:

- HTML
- CSS
- JavaScript
- JSON
- browser-local persistence
- GitHub Pages hosting

No server, no account system, no cloud database, and no bundled AI model.

## Asset layout

Card artwork lives under:

```text
assets/cards/
├── Major_Arcana/
└── Minor_Arcana/
    ├── Cups/
    ├── Pentacles/
    ├── Swords/
    └── Wands/
```

The normalized tarot card back is:

```text
assets/cards/tarot_card_back.png
```

## Local run

Any local static server will work. For example:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## GitHub Pages

This repository is intended to publish directly from the `main` branch root.

---

Palimpsest is a personal learning and reflection project.
