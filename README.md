# franciscopereira.dev

This is the source of my personal site. It is a single page in two languages that says
who I am, shows what I have built, and gives a way to contact me. Nothing on it is
dynamic. Everything is generated at build time and served as static files from GitHub Pages.

Built with Astro 7 and TypeScript. No CSS framework, no UI library, two runtime dependencies.

**Live:** https://franciscopereira.dev

<!-- TODO: screenshot -->

## Why I rewrote it

The first version was hand written HTML, CSS and JavaScript with no build step. It still
exists in the `pre-astro` branch. It worked fine, but adding a second language meant
duplicating the entire page, and every new project meant editing markup by hand in two
places. That was going to get worse, not better, so I moved it to Astro.

I kept the output static. There is no adapter and no server. The build produces plain
HTML and the browser gets exactly that.

## The projects are data, not markup

Each project is a JSON file in `src/content/projects`. Astro reads them as a content
collection and I validate them with a Zod schema, so a mistake breaks the build instead
of reaching the page.

The schema does more than check types. Five rules catch states that would be wrong on
screen: a project marked `live` has to have a demo URL, a project marked `in-development`
must not have one, and an image without alt text is an error. I would rather the build
fail on my machine than ship a card that links nowhere.

There are nine projects right now. Seven in the main grid, and two in a separate group
for the ones where the interface came out of Figma Make and my own work was the data
modelling and the components. I keep that distinction visible on the page because it is
the truth.

## Two languages

Portuguese is the default and lives at the root. English lives at `/en/`. I used Astro's
own i18n routing with `prefixDefaultLocale` set to false so the Portuguese URLs stay clean.

Interface text sits in two dictionaries, `pt.json` and `en.json`, 49 keys each. Project
text sits inside each project's own JSON as `{ pt, en }` pairs, which means a project
cannot exist with only one language filled in. `npm run check:i18n` compares the two
dictionaries and exits with an error if a key is missing on either side. I run it by hand.
It is not wired into CI yet.

The language switcher is a plain link to the other version. A small script appends the
section you are currently reading to that link, so if you switch language halfway down
the projects you land on the projects, not back at the top.

## Three things I had to add to the build

Astro is good but it does not do everything I wanted, so `astro.config.mjs` carries three
small hooks I wrote.

The first checks project images before the build starts. Astro stops at the first missing
file, which means you fix one, rebuild, and find the next. Mine collects all of them and
fails once with the full list.

The second runs after the build and prunes `dist/_astro/`. Astro emits the original of
every collection image even when only the optimised WebP versions end up being used, and
those originals were sitting in the deployed output doing nothing. The hook reads every
generated HTML, CSS, JS, JSON, XML and TXT file, then deletes anything whose filename does
not appear in any of them.

The third one is paranoia with a reason. I self host the fonts, and I only want WOFF2 to
ship. If a `.ttf`, `.otf` or `.eot` ever reaches `dist/`, the build fails.

## Fonts and icons

The old version used Devicon for the technology icons. It pulled in 126 KB of CSS and
around 11.7 MB of font files so I could draw fifteen glyphs. I replaced it with plain SVG
files that get inlined at build time through `import.meta.glob`, which costs no extra
request at all.

Poppins is self hosted in WOFF2, four weights, each split into `latin` and `latin-ext`
subsets with `unicode-range` so the browser only downloads what the page actually needs.
That is about 52 KB in total and zero requests to Google Fonts.

Images go through `astro:assets` and come out as WebP, requested at 900px in the card and
1400px in the modal, never scaled up past the original.

## Dark and light mode

The theme class goes on `<html>`, not on `<body>`, so an inline script in `<head>` can
apply it before the first paint and there is no flash of the wrong theme. The choice is
kept in `localStorage`, read inside a `try/catch` because private browsing can block it,
and falls back to `prefers-color-scheme` when there is nothing stored.

The whole site is one CSS file, 1317 lines, built on 31 custom properties. Switching
theme swaps those variables and nothing else.

## Deploy

Every push to `main` triggers a GitHub Action that builds the site and publishes it to
Pages. The custom domain comes from `public/CNAME`.

The first deploy failed after thirteen seconds because the Astro action defaults to Node 20
and Astro 7 needs 22.12 or newer. I pinned Node 24 and left a comment in the workflow
explaining why, so I do not lose another afternoon to it.

## Running it locally

```bash
npm install
npm run dev        # localhost:4321
npm run build      # static output in dist/
npm run check:i18n # verify PT/EN key parity
npm run og         # regenerate the Open Graph image
```

Node 22.12 or newer is required.

## What is still missing

Things I know are not done, rather than pretending otherwise:

- There is no 404 page.
- There is no `prefers-reduced-motion` handling, even though the page animates on scroll.
- `check:i18n` only runs when I remember to run it.
- No tests, no linter, no `astro check` in the pipeline.
- 13 of the 15 SVGs in `src/icons/` are leftovers that nothing uses.

## Branches

`main` is the Astro site. `pre-astro` is the original hand written version from May 2026,
frozen and kept for reference.

## Contact

- Email: franciscojrp1004@gmail.com
- LinkedIn: [francisco-pereira-dev](https://www.linkedin.com/in/francisco-pereira-dev)
