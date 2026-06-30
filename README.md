# Is Open Next 16 Yet

[![wakatime](https://wakatime.com/badge/user/f09b39ba-bf5c-41c6-a7a2-7d45bd7661ff/project/a51ee6ab-b463-46ab-be0f-197a11fb8772.svg)](https://wakatime.com/badge/user/f09b39ba-bf5c-41c6-a7a2-7d45bd7661ff/project/a51ee6ab-b463-46ab-be0f-197a11fb8772)

A personal utility that answers one question: does the Next.js version that [OpenNextJS Cloudflare](https://github.com/opennextjs/opennextjs-cloudflare) supports match the latest stable release from Vercel?

Useful for developers who deploy Next.js apps to Cloudflare and want to know whether they can use a given Next.js feature without manually cross-referencing both repositories.

## What It Shows

- **Full version comparison** - exact version strings side by side (e.g. `16.2.9` vs `16.2.6`)
- **Version history table** - all Vercel Next.js releases from latest down to OpenNextJS's current version, truncated if there are many
- **Match status** - one of three states:
  - **Exact match** (green) - both are on the identical version
  - **Close** (orange) - same major version, different patch
  - **Behind** (red) - different major versions

## Data Sources

Both fetched live on every request:

- **OpenNextJS CF version** - the `next` dependency in [`create-cloudflare/next/package.json`](https://raw.githubusercontent.com/opennextjs/opennextjs-cloudflare/refs/heads/main/create-cloudflare/next/package.json) on the `main` branch
- **Vercel Next.js latest** - the npm registry packument for `next` (`registry.npmjs.org/next`)

## Tech Stack

- **[TanStack Start](https://tanstack.com/start/latest)** - full-stack React framework with SSR
- **[TanStack Router](https://tanstack.com/router)** - file-based routing
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Zod](https://zod.dev/)** - schema validation
- **[semver](https://github.com/npm/node-semver)** - version comparison
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - deployment target

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm dev
```

## Scripts

```bash
pnpm dev          # development server
pnpm build        # production build
pnpm preview      # preview production build locally
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint
pnpm check        # format + lint
pnpm test         # Vitest
```

## Project Structure

```
src/
├── lib/
│   ├── api.ts        # data fetching (npm registry + GitHub)
│   ├── lib.ts        # npm packument utility
│   ├── constants.ts  # URLs and config
│   ├── schemas.ts    # Zod + semver validation
│   ├── seo.ts        # meta tag generation
│   └── types.ts      # shared TypeScript types
└── routes/
    ├── __root.tsx    # root layout
    ├── index.tsx     # home page
    └── about.tsx     # about page
```

## Deployment

Targets Cloudflare Workers via Wrangler.

```bash
# Authenticate
npx wrangler login

# Build and deploy
pnpm deploy:build

# Or upload a new version without promoting
pnpm upload:build
```

Update `BASE_URL` in `src/lib/constants.ts` to your production domain before deploying.

## Design

Neo-brutalist: thick black borders, high-contrast colours, bold monospace type, hard drop shadows.

## Links

- **Live site**: [is-open-next16-yet.jgichuki-njoroge.workers.dev](https://is-open-next16-yet.jgichuki-njoroge.workers.dev)
- **OpenNextJS Cloudflare**: [github.com/opennextjs/opennextjs-cloudflare](https://github.com/opennextjs/opennextjs-cloudflare)
- **Next.js on npm**: [npmjs.com/package/next](https://www.npmjs.com/package/next)
