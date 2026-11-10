# ericlmao.github.io

Personal site, served by GitHub Pages at https://ericlmao.github.io.

Plain HTML, CSS and a little JavaScript. No build step.

## Files

- `index.html`: page content. Projects and Servers are two tab buttons; each opens one panel of rows. While both are closed, a marquee scrolls through every icon.
- `type.js`: the typing intro.
- `explorer.js`: tab and panel switching, marquee captions, and opening a section from a marquee icon.
- `style.css`: styles.
- `icons/`: avatar, project logos and server icons. OG-Network and SuperSMP icons are the server-list icons from their live servers, Skycade is its 2017 site favicon from the Internet Archive, the rest are GitHub organization avatars.
- `.nojekyll`: tells GitHub Pages to serve files as-is.

## Local preview

Open `index.html` in a browser.

## Deploy

When you change `style.css` or a script, bump the `?v=` number on its tag in `index.html`. GitHub Pages lets browsers cache files for 10 minutes, so without the bump a visitor can get the new HTML with the old CSS.


Push to `main`. GitHub Pages publishes from the root of the `main` branch.
