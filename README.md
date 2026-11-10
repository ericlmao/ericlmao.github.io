# ericlmao.github.io

Personal portfolio site, served by GitHub Pages at https://ericlmao.github.io.

Plain HTML, CSS and JavaScript. No build step.

## Files

- `index.html`: page content (hero, featured work, about, contact)
- `style.css`: styles, with automatic light and dark themes
- `script.js`: loads recently updated repositories and stats from the GitHub API
- `favicon.svg`: site icon
- `.nojekyll`: tells GitHub Pages to serve files as-is

## Editing

- Featured projects are hardcoded cards in `index.html` under `#work`.
- Repositories listed in `FEATURED` in `script.js` are hidden from the live "Recently updated" list so they don't appear twice.

## Local preview

Open `index.html` in a browser, or run:

```sh
python3 -m http.server 8000
```

## Deploy

Push to `main`. GitHub Pages publishes from the root of the `main` branch.
