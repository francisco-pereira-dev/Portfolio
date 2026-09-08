# franciscopereira.dev

My personal portfolio. Static site built with Astro, bilingual (PT/EN), deployed to
GitHub Pages on every push to `main`.

**Live:** https://franciscopereira.dev

<!-- TODO: screenshot -->

## The part worth reading

Astro does not fail loudly when a project image is missing, and it ships the original
of every collection image even when only the optimised variants get used. So the build
config carries three hooks of my own:

| Hook | When | What it does |
|---|---|---|
| `verificarImagensDosProjetos` | `astro:config:setup` | Lists *every* missing project image at once and fails the build. Astro alone stops at the first one. |
| `podarAssetsNaoReferenciados` | `astro:build:done` | Scans the emitted HTML/CSS/JS/JSON/XML/TXT and deletes anything in `dist/_astro/` that nothing references. |
| `garantirQueAsTTFnaoSaem` | `astro:build:done` | Fails the build if a `.ttf`, `.otf` or `.eot` reaches `dist/`. Only WOFF2 is allowed to ship. |

The project content model is validated with Zod, and five `superRefine` rules make
invalid states unbuildable: a `live` project without a demo URL fails, an `in-development`
one *with* a demo URL fails, and an image without alt text fails.

## Stack

- **Astro 7.2.10**, static output, no adapter. Requires Node >= 22.12.
- **TypeScript** in Astro's `strict` config. Every component has a typed `Props` interface.
- **One CSS file**, 1317 lines, 31 custom properties. No Tailwind, no CSS framework.
- Two runtime dependencies: `astro` and `@astrojs/sitemap`.

## Structure
