import {
  HeadContent,
  Scripts,
  Link,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Is Open Next 16 Yet?',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl">
        <div className="border-4 border-black p-8 mb-6 bg-red-100">
          <div className="text-center">
            <h1 className="text-9xl font-black mb-4 text-black">404</h1>
            <p className="text-2xl font-bold text-black mb-2">Page Not Found</p>
            <p className="text-lg font-semibold text-black">
              The page you're looking for doesn't exist
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block border-4 border-black px-6 py-3 bg-white font-bold text-black hover:bg-black hover:text-white transition-none"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl">
        <div className="border-4 border-black p-8 mb-6 bg-red-100">
          <div className="text-center">
            <h1 className="text-9xl font-black mb-4 text-black">ERROR</h1>
            <p className="text-2xl font-bold text-black mb-2">
              Something went wrong
            </p>
            <p className="text-lg font-semibold text-black mb-4">
              {error.message}
            </p>
          </div>
        </div>

        <div className="border-4 border-black p-6 bg-white mb-6">
          <p className="text-sm font-bold text-black mb-2">Error Details:</p>
          <pre className="text-xs text-black overflow-auto bg-gray-50 p-4 border-2 border-black">
            {error.stack || error.toString()}
          </pre>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="border-4 border-black px-6 py-3 bg-white font-bold text-black hover:bg-black hover:text-white transition-none"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="inline-block border-4 border-black px-6 py-3 bg-white font-bold text-black hover:bg-black hover:text-white transition-none"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
