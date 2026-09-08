# franciscopereira.dev
 
Source of my personal site. One page, two languages, fully static. Everything is
generated at build time and served from GitHub Pages.
 
**Live:** https://franciscopereira.dev
 
## Stack
 
Astro 7, TypeScript, plain CSS. No framework, no UI library, two runtime dependencies.
 
## How it works
 
Each project is a JSON file validated with a Zod schema. A project marked as live without
a demo URL, or an image without alt text, breaks the build instead of reaching the page.
 
Portuguese sits at the root, English at `/en/`. Interface text is in two dictionaries;
project text lives inside each project's JSON as `pt`/`en` pairs, so a project cannot
exist in only one language.
 
Icons are SVG files inlined at build time. That replaced Devicon, which cost 11.7 MB of
font files to draw fifteen glyphs. Poppins is self hosted in WOFF2, subset by
`unicode-range`, around 52 KB in total.
 
The build config carries three hooks I wrote: one lists every missing project image at
once instead of stopping at the first, one prunes unreferenced files from the output, and
one fails the build if any font format other than WOFF2 reaches `dist/`.
 
## Running it
 
```bash
npm install
npm run dev      # localhost:4321
npm run build    # static output in dist/
```
 
Node 22.12 or newer.
 
## Known gaps
 
No 404 page, no `prefers-reduced-motion`, and no tests or linter in the pipeline.
 
## Contact
 
- Email: franciscojrp1004@gmail.com
- LinkedIn: [francisco-pereira-dev](https://www.linkedin.com/in/francisco-pereira-dev)
 
