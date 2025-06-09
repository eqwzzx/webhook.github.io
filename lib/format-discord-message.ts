export function formatDiscordMessage(content: string): string {
  if (!content) return ""

  // Escape HTML to prevent XSS
  let formatted = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  // Bold: **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Italic: *text*
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Code: `code`
  formatted = formatted.replace(
    /`([^`]+)`/g,
    "<code class='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm'>$1</code>",
  )

  // Links: [text](url)
  formatted = formatted.replace(
    /\[([^\]]+)\]$$([^)]+)$$/g,
    "<a href='$2' class='text-blue-500 hover:underline' target='_blank' rel='noopener noreferrer'>$1</a>",
  )

  // Line breaks
  formatted = formatted.replace(/\n/g, "<br />")

  return formatted
}