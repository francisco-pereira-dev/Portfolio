# franciscopereira.dev

Source of my personal portfolio — a bilingual static site with project case studies
and a CV page that generates its own PDF.

**Live:** https://franciscopereira.dev

## How it works

- **One source of truth for text.** Every visible string lives in
  `content/texto-canonico.json`. `npm run check:texto` compares it, string by string,
  against the generated HTML in both languages and fails on any difference.
- **The CV PDF comes from the CV page.** `npm run cv` renders `/cv/` and `/en/cv/`
  with headless Chromium and refuses to write a PDF that isn't exactly one page, isn't
  extractable text, or doesn't match the approved text. Same text, same bytes.
- **The build guards itself.** Three small Astro integrations fail the build on a
  missing project image, remove anything the site doesn't reference, and block any
  font that isn't WOFF2.
- **Deploys are gated.** Every push to `main` runs the build and the text checks
  first; the deploy only starts if they pass.
- **No third-party requests at runtime.** Self-hosted font, inline SVG icons, no CDNs,
  no analytics.
- **Works without JavaScript.** All content is in the HTML. Without a script, only the
  overlay menu, the manual theme toggle, the back-to-top button and two project modals
  are lost.

## Content

- Portuguese at the root, English under `/en/`, with `hreflang` between them.
- 9 projects; 7 have a case study page, 2 open in a modal.
- The CV as a page in each language, with the generated PDF to download.
- 18 pages, all in the sitemap.

## Stack

Astro 7 (static output), TypeScript, plain CSS. Content in JSON, validated by a Zod
schema. Two runtime dependencies: `astro` and `@astrojs/sitemap`. Playwright and
axe-core as dev dependencies only, for the audits and the PDF. Deployed to GitHub
Pages by GitHub Actions.

## Running it

Node 22.12 or newer (the build uses 24).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static build to dist/
npm run preview   # serve dist/
```

## Checks

```bash
npm run check:i18n     # key parity between pt.json and en.json
npm run check:texto    # approved text vs generated HTML (after build)
npm run cv             # the two CV PDFs, with the one-page and text guards
npm run audit:a11y     # axe, landmarks, contrast, and the no-JavaScript version
npm run audit:teclado  # keyboard navigation on every page
```

## Accessibility

Zero axe violations on all 18 pages, in both languages and both themes; landmarks, a
skip link, a visible focus indicator, and all text at 4.5:1 contrast or better.

## Licences

Icons from [Devicon](https://devicon.dev) (MIT); Poppins under the SIL Open Font
License 1.1. Attribution in [docs/LICENCAS.md](docs/LICENCAS.md). The site's own code
and content are not licensed for reuse.

## Contact

franciscojrp1004@gmail.com · [LinkedIn](https://www.linkedin.com/in/francisco-pereira-dev/)

