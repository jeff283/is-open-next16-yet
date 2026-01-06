# Is Open Next 16 Yet

[![wakatime](https://wakatime.com/badge/user/f09b39ba-bf5c-41c6-a7a2-7d45bd7661ff/project/a51ee6ab-b463-46ab-be0f-197a11fb8772.svg)](https://wakatime.com/badge/user/f09b39ba-bf5c-41c6-a7a2-7d45bd7661ff/project/a51ee6ab-b463-46ab-be0f-197a11fb8772)

A simple, clean web application that tracks whether [OpenNextJS Cloudflare](https://github.com/opennextjs/opennextjs-cloudflare) has added support for Next.js 16 yet.

## Purpose

Next.js 16 was released with groundbreaking new features including Cache Components, improved performance, and enhanced developer experience. However, developers using OpenNextJS Cloudflare have been waiting months for Next.js 16 support.

This app was created to provide a clear, simple answer to the question: **"Is OpenNextJS Cloudflare using Next.js 16 yet?"**

It automatically checks the latest version from their repository and displays the current status, along with how long the community has been waiting for this support.

**Related Issue:** [GitHub Issue #972](https://github.com/opennextjs/opennextjs-cloudflare/issues/972)

## Features

- **Real-time Status Check** - Automatically fetches the latest Next.js version from OpenNextJS Cloudflare's repository
- **Issue Tracking** - Shows how many days since the GitHub issue was created and last updated
- **Clean Neo-Brutalist Design** - Minimal, bold, high-contrast UI
- **SEO Optimized** - Full Open Graph and Twitter Card support
- **Error Handling** - Graceful fallbacks when API calls fail
- **Type-Safe** - Built with TypeScript and Zod validation

## Tech Stack

- **[TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview)** - Full-stack React framework with SSR, streaming, and server functions
- **[TanStack Router](https://tanstack.com/router)** - File-based routing with SSR
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Zod](https://zod.dev/)** - Schema validation
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/is-open-next16-yet.git
cd is-open-next16-yet

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:3000
```

### Building

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── lib/
│   ├── api.ts          # API functions for fetching data
│   ├── constants.ts    # Configuration constants
│   ├── schemas.ts      # Zod validation schemas
│   ├── seo.ts          # SEO meta tag generation
│   └── types.ts        # TypeScript type definitions
├── routes/
│   ├── __root.tsx      # Root layout with error/404 handlers
│   ├── index.tsx        # Home page
│   └── about.tsx        # About page
└── integrations/       # TanStack Query setup
```

## Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

## Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Run both lint and format
pnpm check
```

## Deployment

This app is designed to be deployed on Cloudflare Workers.

### Prerequisites

1. Install Wrangler CLI:
   ```bash
   pnpm add -D wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```

### Deploy

```bash
# Build and deploy
pnpm deploy:build

# Or deploy without building first (if already built)
pnpm deploy
```

### Environment Variables

Update `BASE_URL` in `src/lib/constants.ts` with your production domain before deploying.

## Data Sources

The app fetches data from:

1. **Package.json** - Checks Next.js version from OpenNextJS Cloudflare repository:
   ```
   https://raw.githubusercontent.com/opennextjs/opennextjs-cloudflare/refs/heads/main/create-cloudflare/next/package.json
   ```

2. **GitHub Issue API** - Fetches issue metadata (updates, closure status):
   ```
   https://api.github.com/repos/opennextjs/opennextjs-cloudflare/issues/972
   ```

## Design Philosophy

This app uses a **neo-brutalist** design style:
- Thick black borders (`border-4`)
- High contrast colors (black, white, red, green)
- Bold typography
- Minimal shadows and effects
- Clean, geometric layouts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [OpenNextJS Cloudflare](https://github.com/opennextjs/opennextjs-cloudflare) - The project we're tracking
- [TanStack](https://tanstack.com/) - Amazing React ecosystem
- The community waiting for Next.js 16 support

## Links

- **Live Site**: [Coming soon]
- **GitHub Issue**: [Issue #972](https://github.com/opennextjs/opennextjs-cloudflare/issues/972)
- **OpenNextJS Cloudflare**: [Repository](https://github.com/opennextjs/opennextjs-cloudflare)
- **Next.js 16**: [Release Notes](https://nextjs.org/blog/next-16)

---

Made with love (and a bit of frustration) by the community
