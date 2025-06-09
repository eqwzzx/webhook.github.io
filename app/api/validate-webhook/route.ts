import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL is required" }, { status: 400 })
    }

    if (!webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
      return NextResponse.json({ error: "Invalid Discord webhook URL" }, { status: 400 })
    }

    // Get webhook info from Discord
    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Webhook not found" }, { status: 404 })
      }
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 })
    }

    const webhookData = await response.json()

    return NextResponse.json({
      valid: true,
      channelInfo: {
        name: webhookData.channel_id,
        guildId: webhookData.guild_id,
      },
    })
  } catch (error) {
    console.error("Webhook validation error:", error)
    return NextResponse.json({ error: "Failed to validate webhook" }, { status: 500 })
  }
}