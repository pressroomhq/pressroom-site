# Pressroom HQ

> AI-Powered Content Operations for Developer Teams

[![Deploy with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   ├── robots.txt          ← crawl directives for search engines & AI bots
│   ├── sitemap.xml         ← sitemap for indexing
│   └── llms.txt            ← AI engine site manifest
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
│       ├── index.astro     ← homepage
│       ├── blog/
│       │   └── index.astro
│       └── docs/
│           └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

---

## ⚙️ Installation

```sh
# 1. Clone the repository
git clone https://github.com/your-org/pressroomhq.git
cd pressroomhq

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The dev server starts at **`http://localhost:4321`** by default.

---

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

---

## 🔍 SEO & Discoverability Checklist

This project requires several SEO and AI-discoverability assets to be correctly configured before deploying to production. Use this checklist to stay on track.

### `public/robots.txt`

Create `public/robots.txt` with explicit crawl directives:

```text
User-agent: *
Allow: /

# AI crawlers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://pressroomhq.com/sitemap.xml
```

> ⚠️ Without `robots.txt`, search engines and AI crawlers lack guidance on crawl budget and permissions.

---

### `public/sitemap.xml`

Generate or maintain a `sitemap.xml` at `https://pressroomhq.com/sitemap.xml`. Use the [Astro sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/):

```sh
npx astro add sitemap
```

Then add your site URL to `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pressroomhq.com',
  integrations: [sitemap()],
});
```

---

### `public/llms.txt`

Create `public/llms.txt` so AI engines can understand your site's structure and purpose:

```text
# Pressroom HQ
> AI-Powered Content Operations for Developer Teams

Pressroom HQ helps developer teams automate and streamline content operations
using AI — from release notes to changelogs, docs, and blog posts.

## Pages
- [Home](https://pressroomhq.com/): Product overview and key features.
- [Blog](https://pressroomhq.com/blog): Articles on AI content ops, developer tools, and release workflows.
- [Docs](https://pressroomhq.com/docs): Technical documentation and integration guides.
```

> 💡 `llms.txt` is an emerging convention that allows AI engines (ChatGPT, Claude, Perplexity, etc.) to quickly understand your site's content and purpose.

---

### Schema.org Structured Data (JSON-LD)

Add JSON-LD structured data to every page for E-A-T (Expertise, Authoritativeness, Trustworthiness) signals and AI citation eligibility.

**Homepage (`src/pages/index.astro`):**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Pressroom HQ",
  "url": "https://pressroomhq.com",
  "description": "AI-powered content operations for developer teams.",
  "publisher": {
    "@type": "Organization",
    "name": "Pressroom HQ",
    "url": "https://pressroomhq.com"
  }
}
</script>
```

**Blog index (`src/pages/blog/index.astro`):**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Pressroom HQ Blog",
  "url": "https://pressroomhq.com/blog",
  "description": "Articles on AI content operations, developer tools, and release workflows.",
  "publisher": {
    "@type": "Organization",
    "name": "Pressroom HQ"
  }
}
</script>
```

**Individual blog posts:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Your Post Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20",
  "publisher": {
    "@type": "Organization",
    "name": "Pressroom HQ",
    "url": "https://pressroomhq.com"
  }
}
</script>
```

**Docs section (`src/pages/docs/index.astro`):**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "name": "Pressroom HQ Documentation",
  "url": "https://pressroomhq.com/docs",
  "publisher": {
    "@type": "Organization",
    "name": "Pressroom HQ"
  }
}
</script>
```

---

### Page Title & Meta Description Guidelines

| Page       | Target Length | Current Status | Recommended Value |
| :--------- | :------------ | :------------- | :---------------- |
| Homepage   | 50–55 chars   | ⚠️ 64 chars    | `Pressroom HQ: AI Content Operations for Developers` |
| Blog       | 50–60 chars   | ✅ Check        | `Pressroom HQ Blog: AI, Dev Tools & Release Workflows` |
| Docs       | 50–60 chars   | ✅ Check        | `Pressroom HQ Docs: Guides & Integrations` |

- **Meta descriptions** should be **120–160 characters** max.
- Homepage meta description is currently **228 chars** — trim to a single, punchy value under 160 chars.

Example homepage meta description (158 chars):
```
Pressroom HQ helps developer teams ship faster with AI-powered content operations — automate release notes, changelogs, docs, and blog posts.
```

---

### Blog Page Content Requirements

The blog index page (`/blog`) is currently thin (~131 words). It should include **800+ words** and the following elements to pass E-E-A-T checks and rank for target queries:

- [ ] **Featured articles section** — 3–5 posts with title, author, date, and excerpt preview
- [ ] **Category filters** — e.g., "Release Notes," "Developer Tools," "AI Trends," "Changelogs"
- [ ] **Author bylines and publish dates** on every post card (required for E-E-A-T and AI citation eligibility)
- [ ] **Internal links** to `/docs` and the homepage
- [ ] **Section intro copy** (150–200 words) explaining what the blog covers and who it's for

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature-name`
5. Open a Pull Request

Please ensure all SEO assets (`robots.txt`, `sitemap.xml`, `llms.txt`) and structured data are updated if you add new pages.

---

## 👀 Want to learn more?

- 📖 [Astro Documentation](https://docs.astro.build)
- 💬 [Astro Discord Server](https://astro.build/chat)
- 🗺️ [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- 🤖 [llms.txt specification](https://llmstxt.org)
- 📐 [Schema.org reference](https://schema.org)