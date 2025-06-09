import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { webhookUrl, payload } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL is required" }, { status: 400 })
    }

    if (!webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
      return NextResponse.json({ error: "Invalid Discord webhook URL" }, { status: 400 })
    }

    // Send the message to Discord
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `Discord API error: ${response.status}`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Failed to send webhook message" }, { status: 500 })
  }
}