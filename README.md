# DevPilot

Developer tools and AI productivity guides.

## Development

```bash
npm install
npm run serve    # Local dev server at localhost:8080
npm run build    # Build to _site/
```

## Deploy to GitHub Pages

```bash
# One-time setup
gh repo create devpilot-site --public --source=. --push
gh api repos/{owner}/devpilot-site/pages -X POST -f source.branch=main -f source.path=/_site

# After that, just push to main and GitHub Pages auto-deploys
git push
```

## Deploy to Cloudflare Pages

Connect your GitHub repo at https://dash.cloudflare.com → Pages → Create project.

Build command: `npm run build`
Output directory: `_site`
