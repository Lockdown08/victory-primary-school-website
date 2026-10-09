# Victory Primary School website

Static site for Victory Primary School, Ngcobo, Eastern Cape. Served by GitHub
Pages from `main` at https://victoryprimaryschool.co.za (see `CNAME`). No build
step: plain HTML, CSS and a little JS. Pages live in folders (`/about/index.html`)
so URLs have no `.html`.

## How Lockdown wants to work

- `main` is the live site. Never push to `main` until Lockdown says he's happy.
- Work happens on the `redesign` branch. Lockdown previews it with VS Code
  Live Server on his PC and on his phone over Wi-Fi (`.vscode/settings.json`
  binds Live Server to 0.0.0.0:5500).
- Commit in small steps; ask before pushing.
- He dislikes anything that looks generic or AI-generated. The design should
  feel built for this school specifically.

## Redesign status (October 2026)

Done:
- Favicon fix (live on `main`): small pre-rounded icons, `/favicon.ico`,
  apple-touch-icon, `site.webmanifest`. The old 6.5 MB PNG + JS rounding was why
  Google didn't show the icon.
- New design system in `css/victory.css`, plus `js/site.js` (phone menu).
- Homepage `index.html` rebuilt on the new system.

Still to do:
- Move `about`, `academics`, `admissions`, `events`, `gallery`, `contact` onto
  `css/victory.css` + `js/site.js`, using the same header/footer markup as
  `index.html`. Those pages still use the old `styles.css`; delete it once none
  use it.
- Gallery: use optimised copies of the photos (see below), not the originals.
- Admissions: add `id="fees"` to the School Fees section (footer links to
  `/admissions#fees`).
- Check every page at 390px and 1280px wide; no sideways scrolling.
- Lockdown to confirm the homepage "Recently at Victory" captions (written from
  the photos) and that admissions are for 2027.

## Design system (built from the crest)

- Colours sampled from the badge: maroon `#5f2230`, deep maroon `#3a1119`,
  shield `#22090e`, gold `#b39557`, light gold `#dcc794`, gold text on light
  backgrounds `#6f5321`, paper `#f8f4ec` / `#efe7d7`. Tokens are in `:root`.
- Fonts are self-hosted in `/fonts`: Fraunces (headings) and Public Sans (body).
  Don't add Google Fonts, Font Awesome or other CDNs; the site must load fast
  on mobile data.
- Motifs: `.ribbon` section labels (the "In God We Trust" banner shape),
  `.rim` gold rules (the coin edge), `.shield-frame` photo frame, Roman-numeral
  numbered lists. Avoid icon-in-a-gradient-box cards, emoji placeholders,
  gradient divider bars and centred title+divider+subtitle sections.
- Mobile-first: base CSS is for phones, `min-width: 40em` and `64em` add
  larger layouts. Tap targets at least 44px.
- Copy: plain, specific, warm. No "where every child can thrive" filler.

## Images

- Originals are in `_images/` (WhatsApp photos, 1–2 MB each; logo PNGs are
  6 MB). Don't link to them directly from new pages.
- Optimised copies go in `_images/web/` as `name-WIDTH.webp` + `.jpg`, used with
  `<picture>` + `srcset`, explicit `width`/`height`, `loading="lazy"` below the
  fold. The crest is `_images/web/crest-{96,192,320}.webp/png`.
- Teacher photos: use `_images/teachersupdate1.1/` (the newer set).

## Contact details used on the site

- Phone 069 936 1866 (`tel:+27699361866`)
- Email victoryprimaryec@gmail.com
