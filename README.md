# .butteredtoast CTF Hub

Jekyll site for security projects, CTF write-ups, and notes. The design is a recolor of snowbird's.

## Structure

| Path                             | Purpose                                                   |
| -------------------------------- | --------------------------------------------------------- |
| `pages/`                         | Top-level static pages (home, about, blog, etc.)          |
| `write-ups/<slug>/`              | One folder per write-up with its Markdown + assets        |
| `blog/`                          | Placeholder for future general blog posts                 |
| `assets/`                        | CSS/JS/theme assets (icons, scripts, shared styles)       |

## Local Development

```bash
bundle install
bundle exec jekyll serve
```

Visit `http://127.0.0.1:4000/ctf/` by default (adjust for your `baseurl`).

## Customizing

- Edit `_data/author.yml` for bio, social links, and quote.
- Update `pages/` markdown files for site sections.
- Drop posts into `all_collections/_posts/` (e.g., `2024-05-10-challenge.md`).
- Add assets or tweak styles in `assets/css` and `assets/js`.

## Deployment

Designed for GitHub Pages: the repository builds with `baseurl: /ctf`. You can deploy anywhere Jekyll runs (Netlify, Cloudflare Pages, etc.).
