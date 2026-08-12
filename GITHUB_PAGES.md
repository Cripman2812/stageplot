# GitHub Pages Deployment

`vite.config.ts` uses `base: './'` so assets resolve correctly from any sub-path or root.

1. Build: `npm run build`
2. Push `dist/` contents to `gh-pages` branch, or use GitHub Actions:

```yaml
# .github/workflows/deploy.yml example
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Enable Pages on the repository (branch `gh-pages` or `/docs`).
