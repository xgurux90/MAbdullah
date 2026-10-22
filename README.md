# Mohammad Abdullah — personal site

Published with GitHub Pages at https://xgurux90.github.io/MAbdullah/

| File | What it is |
| --- | --- |
| `index.html` | Main page (English) |
| `ar.html` | Arabic page |
| `portfolio.html` | Redirect to `index.html#projects`, kept so old links work |
| `Mohammad_Abdullah_CV.pdf` | CV offered by the "Download CV" buttons |
| `mohammad-abdullah.vcf` | Contact card offered by "Save Contact" |
| `sitemap.xml` | For Google Search Console |

## Editing

Edit the HTML directly. Styles come from Tailwind classes compiled into `css/index.css`, and icons are
referenced as `<use href="img/icons.svg#solid-…">` from Font Awesome Free.

After a change is pushed to `main`, the **Build CSS** GitHub Action recompiles `css/` and `img/icons.svg`
automatically. To build locally instead:

```sh
npm install
npm run build
```

To update the CV, replace `Mohammad_Abdullah_CV.pdf` with a file of the same name.

## Optional setup

- **Visitor statistics:** create a free account at https://www.goatcounter.com, then add this line
  before `</body>` in `index.html` and `ar.html`, using your own code:
  `<script data-goatcounter="https://YOURCODE.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`
- **Google:** add the site in Google Search Console and submit `sitemap.xml`.
- **Custom domain:** buy a domain, then set it under the repository's Settings → Pages → Custom domain.
  Update the `canonical`, `og:url`, `hreflang` and JSON-LD URLs in both pages, and `sitemap.xml`, to match.
