# Migration notes

This ZIP is designed to be extracted directly into the existing `Palimpsest` repository root.

It intentionally:
- replaces the old static `index.html`
- adds `package.json` and `vite.config.js`
- adds `src/`
- leaves `assets/cards/` untouched
- leaves existing `data/`, `docs/`, and legacy `css/` / `js/` files untouched

Vite is configured with:

```js
publicDir: 'assets'
base: '/Palimpsest/'
```

Therefore the current repository's `assets/cards/` directory is copied into the production build without moving the tarot files.

After extraction:

```powershell
cd "C:\Users\hasan\Downloads\TAROT_DECK_COMPLETE_REVISED\Palimpsest"
npm install
npm run dev
```

Production check:

```powershell
npm run build
npm run preview
```
