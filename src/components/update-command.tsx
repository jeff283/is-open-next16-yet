import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import type { PackageManager } from '@/lib/package-managers'
import { PACKAGE_MANAGERS, buildUpdateCommand } from '@/lib/package-managers'
import { cn } from '@/lib/utils'

export function UpdateCommand({
  dependencies,
  devDependencies,
}: {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}) {
  const [manager, setManager] = useState<PackageManager>('pnpm')
  const [copied, setCopied] = useState(false)

  const command = buildUpdateCommand(manager, dependencies, devDependencies)

  if (!command) return null

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard may be unavailable in some environments
    }
  }

  return (
    <div className="border-4 border-black mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <Terminal className="size-3.5 shrink-0 text-zinc-500" aria-hidden />

        <div
          className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto"
          role="tablist"
          aria-label="Package manager"
        >
          {PACKAGE_MANAGERS.map((pm) => (
            <button
              key={pm}
              type="button"
              role="tab"
              aria-selected={manager === pm}
              onClick={() => setManager(pm)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                manager === pm
                  ? 'bg-zinc-800 text-zinc-50'
                  : 'text-zinc-400 hover:text-zinc-200',
              )}
            >
              {pm}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          aria-label={copied ? 'Copied' : 'Copy command'}
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-zinc-100 whitespace-pre-wrap break-all">
          {command}
        </code>
      </pre>
    </div>
  )
}
