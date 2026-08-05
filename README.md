# m2mx-portfolio

Personal site for Max Murphy. Eleventy → static HTML → GitHub Pages.

Design is modelled on the layout and typography of [kenny-kane.com](https://kenny-kane.com/):
Crimson Text over Inter Tight, `#2463EB` blue, full-bleed bands with chevron
edges. All copy is original.

## Running it

```bash
npm install
npm start          # dev server with live reload, http://localhost:8080
npm run build      # production build into _site/
```

## Where the content lives

You should rarely need to touch markup. Almost everything is data:

| File | Holds |
|---|---|
| `src/_data/site.json` | Name, domain, email, socials, address, AI-crawler toggle |
| `src/_data/profile.json` | Bio, lede, experience entries, skills, education |
| `src/_data/projects.json` | Selected work |
| `src/_data/testimonials.json` | Quotes |
| `src/_data/areas.json` | "Areas of Work" pages — add an entry, get a page |
| `src/_data/nav.json` | Header and footer navigation |
| `src/blog/*.md` | Posts. Front matter: `title`, `description`, `date`, `tags` |

Everything currently reads `TODO:`. Search the repo for `TODO` to find every
slot that still needs your words.

**Start with `site.json`.** The domain in `url` feeds every canonical URL, the
sitemap, both feeds, and all structured data. While it says `TODO-your-domain.com`,
all of that is pointing at nothing.

Images go in `src/assets/img/`: `portrait.jpg`, `og-default.jpg` (1200×630),
and `project-1.jpg` … `project-3.jpg`.

## SEO

- JSON-LD `Person` + `WebSite` on every page, `BlogPosting` on posts, wired
  together by `@id` so they form one graph rather than three loose objects.
- `sameAs` links your profiles to this site — this is what lets a search engine
  or model resolve "Max Murphy" to *you*. It stays empty until you replace the
  `TODO` URLs in `site.json`; placeholder URLs are filtered out deliberately,
  because a `sameAs` pointing somewhere you don't control is worse than none.
- Canonical URLs, OpenGraph, Twitter cards, `sitemap.xml`, Atom + JSON feeds.
- `/who-is-max-murphy/` — name disambiguation. Borrowed from Kenny's "Verify"
  footer column, which is the smartest thing on his site. "Max Murphy" isn't
  unique; this page states which one you are and lists corroborating profiles.

## Built for agents

Static HTML is the foundation — most AI crawlers execute JavaScript poorly or
not at all, so a client-rendered site can look empty to them. Everything here is
in the initial HTML response.

On top of that, the same content is served in machine-readable form:

| Endpoint | What it is | Standard? |
|---|---|---|
| `/resume.json` | Career history, [JSON Resume](https://jsonresume.org) schema | Established |
| `/feed.json` | Blog as JSON Feed | Established |
| `/feed.xml` | Blog as Atom | Established |
| `/api/profile.json` | Everything about you, flat, plus links to the other formats | Custom |
| `/llms.txt` | Site index for language models | Emerging |
| `/llms-full.txt` | Entire site as one plain-text document | Emerging |

The reasoning: an agent asked "what does Max Murphy do?" shouldn't have to scrape
prose out of HTML. `/api/profile.json` answers in one request, and every response
points at the others, so an agent that finds any one of them can discover the rest.

Be aware the bottom two rows are conventions, not standards. No major AI vendor
has committed to `llms.txt`. It costs one generated file, so it's cheap insurance
rather than a sure thing — worth knowing so you don't over-rely on it.

`robots.txt` currently **allows** AI crawlers. Flip `allowAiCrawlers` to `false`
in `site.json` to block them. This is a genuine trade-off: allowing them is how
you get cited in AI answers, and also how your writing enters training data.

## Deploying

1. Push to GitHub as `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and deploys on every push.

### Custom domain

1. Create `src/static/CNAME` containing just your domain, e.g. `maxmurphy.com`.
   (`src/static/` is copied to the site root, so it lands as `/CNAME`.)
2. At your DNS provider, for an apex domain add `A` records to `185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. For a `www`
   subdomain, add a `CNAME` to `<username>.github.io`.
3. Settings → Pages → Custom domain, then tick **Enforce HTTPS** once the cert
   is issued.
4. Set `url` in `src/_data/site.json` to the same domain.

## Gotchas

- Nunjucks `loop.last` refers to the whole loop, not the filtered subset. If you
  emit JSON inside a conditional loop you'll get a trailing comma and silently
  invalid structured data. Build the filtered array first, then loop it — see
  `worksFor` in `src/_includes/partials/seo.njk`.
- After editing any template that emits JSON, verify it parses. Browsers won't
  tell you when JSON-LD is malformed; it just stops working.
- `description` in post front matter is load-bearing: meta description, blog
  index excerpt, both feeds, and the line an AI is most likely to quote.
