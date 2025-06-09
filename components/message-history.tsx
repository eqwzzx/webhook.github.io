"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Copy, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface HistoryMessage {
  id: string
  content: string
  username: string
  webhookUrl: string
  timestamp: Date
  embed?: any
}

interface MessageHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadMessage: (message: HistoryMessage) => void
}

export function MessageHistory({ open, onOpenChange, onLoadMessage }: MessageHistoryProps) {
  const [messages, setMessages] = useState<HistoryMessage[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user && open) {
      loadHistory()
    }
  }, [user, open])

  const loadHistory = () => {
    const stored = localStorage.getItem(`message-history-${user?.id}`)
    if (stored) {
      const parsed = JSON.parse(stored).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
      setMessages(parsed.sort((a: HistoryMessage, b: HistoryMessage) => b.timestamp.getTime() - a.timestamp.getTime()))
    }
  }

  const deleteMessage = (id: string) => {
    const updated = messages.filter((msg) => msg.id !== id)
    setMessages(updated)
    localStorage.setItem(`message-history-${user?.id}`, JSON.stringify(updated))
  }

  const copyMessage = (message: HistoryMessage) => {
    onLoadMessage(message)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Message History</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No messages in history</p>
            ) : (
              messages.map((message) => (
                <Card key={message.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{message.timestamp.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => copyMessage(message)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteMessage(message.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">@{message.username}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{message.content}</p>
                      {message.embed && <div className="text-xs text-blue-600 dark:text-blue-400">Contains embed</div>}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function saveMessageToHistory(message: HistoryMessage, userId: string) {
  const stored = localStorage.getItem(`message-history-${userId}`)
  const history = stored ? JSON.parse(stored) : []

  history.unshift({
    ...message,
    id: Date.now().toString(),
    timestamp: new Date(),
  })

  // Keep only last 50 messages
  const trimmed = history.slice(0, 50)
  localStorage.setItem(`message-history-${userId}`, JSON.stringify(trimmed))
}