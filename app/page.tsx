import { Webhook } from "@/components/webhook"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-2">
            Discord Webhook Messenger
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Send beautifully formatted messages to Discord channels through webhooks
          </p>
        </header>

        <main>
          <Webhook />
        </main>

        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Discord Webhook Messenger. All rights reserved.</p>
          <p className="mt-1">
            by{" "}
            <a
              href="https://eqwzzx.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              eqwzzx
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}