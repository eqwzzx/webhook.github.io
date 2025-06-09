"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Send, Eye, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MessagePreview } from "@/components/message-preview"
import { ImageUpload } from "@/components/image-upload"
import { FormatToolbar } from "@/components/format-toolbar"
import { AuthDialog } from "@/components/auth-dialog"
import { UserMenu } from "@/components/user-menu"
import { MessageHistory, saveMessageToHistory } from "@/components/message-history"
import { EmbedBuilder } from "@/components/embed-builder"
import { WebhookValidator } from "@/components/webhook-validator"
import { ScheduledMessages, saveScheduledMessage } from "@/components/scheduled-messages"
import { useAuth } from "@/components/auth-provider"
import { EasterEggs } from "@/components/easter-eggs"

type FormData = {
  webhookUrl: string
  username: string
  avatarUrl: string
  content: string
}

export function Webhook() {
  const [activeTab, setActiveTab] = useState("compose")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showScheduled, setShowScheduled] = useState(false)
  const [embed, setEmbed] = useState<any>(null)
  const [isWebhookValid, setIsWebhookValid] = useState(false)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      webhookUrl: "",
      username: "Webhook Messenger",
      avatarUrl: "",
      content: "",
    },
  })

  const formValues = watch()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const payload: any = {
        username: data.username,
        avatar_url: data.avatarUrl,
        content: data.content,
      }

      // Add embed if available
      if (embed) {
        payload.embeds = [embed]
      }

      // Add image if available
      if (imageUrl) {
        payload.content += `\n${imageUrl}`
      }

      const response = await fetch("/api/send-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl: data.webhookUrl,
          payload,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message")
      }

      // Save to history if user is logged in
      if (user) {
        saveMessageToHistory(
          {
            content: data.content,
            username: data.username,
            webhookUrl: data.webhookUrl,
            embed: embed,
          },
          user.id,
        )
      }

      setSuccess("Message sent successfully!")
    } catch (err) {
      setError(err.message || "An error occurred while sending the message")
    } finally {
      setIsSubmitting(false)
    }
  }

  const insertFormat = (format: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    let formattedText = ""
    const selectedText = text.substring(start, end)

    switch (format) {
      case "bold":
        formattedText = `**${selectedText || "bold text"}**`
        break
      case "italic":
        formattedText = `*${selectedText || "italic text"}*`
        break
      case "link":
        formattedText = `[${selectedText || "link text"}](https://example.com)`
        break
      case "code":
        formattedText = `\`${selectedText || "code"}\``
        break
      default:
        return
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end)
    setValue("content", newText)

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + formattedText.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const loadMessageFromHistory = (message: any) => {
    setValue("content", message.content)
    setValue("username", message.username)
    setValue("webhookUrl", message.webhookUrl)
    if (message.embed) {
      setEmbed(message.embed)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Discord Webhook Messenger</CardTitle>
            <div className="flex items-center gap-2">
              {user ? (
                <UserMenu onShowHistory={() => setShowHistory(true)} onShowSettings={() => {}} />
              ) : (
                <AuthDialog />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form id="webhook-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">
                  Discord Webhook URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://discord.com/api/webhooks/..."
                  {...register("webhookUrl", { required: "Webhook URL is required" })}
                  className="font-mono text-sm"
                />
                <WebhookValidator webhookUrl={formValues.webhookUrl} onValidationResult={setIsWebhookValid} />
                {errors.webhookUrl && <p className="text-sm text-red-500">{errors.webhookUrl.message}</p>}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="compose">Compose</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="compose" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="Webhook Messenger" {...register("username")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
                      <Input id="avatarUrl" placeholder="https://example.com/avatar.png" {...register("avatarUrl")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Message Content</Label>
                    <FormatToolbar onFormat={insertFormat} />
                    <Textarea
                      id="content"
                      placeholder="Type your message here..."
                      className="min-h-[150px] font-mono"
                      {...register("content", { required: "Message content is required" })}
                    />
                    {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
                  </div>

                  <EmbedBuilder onEmbedChange={setEmbed} />

                  <ImageUpload onImageUploaded={setImageUrl} />
                </TabsContent>

                <TabsContent value="preview">
                  <MessagePreview
                    username={formValues.username}
                    avatarUrl={formValues.avatarUrl}
                    content={formValues.content}
                    imageUrl={imageUrl}
                  />
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => setActiveTab("preview")} disabled={isSubmitting}>
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button type="submit" form="webhook-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Send Message
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <MessageHistory open={showHistory} onOpenChange={setShowHistory} onLoadMessage={loadMessageFromHistory} />

      <ScheduledMessages
        open={showScheduled}
        onOpenChange={setShowScheduled}
        onScheduleMessage={(message) => {
          if (user) {
            saveScheduledMessage(
              {
                ...message,
                content: formValues.content,
                username: formValues.username,
                webhookUrl: formValues.webhookUrl,
                embed: embed,
              },
              user.id,
            )
          }
        }}
      />

      <EasterEggs />
    </div>
  )
}