"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface ScheduledMessage {
  id: string
  content: string
  username: string
  webhookUrl: string
  scheduledFor: Date
  embed?: any
}

interface ScheduledMessagesProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScheduleMessage: (message: Omit<ScheduledMessage, "id">) => void
}

export function ScheduledMessages({ open, onOpenChange, onScheduleMessage }: ScheduledMessagesProps) {
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([])
  const { user } = useAuth()

  const { register, handleSubmit, reset } = useForm<{
    date: string
    time: string
  }>()

  useEffect(() => {
    if (user && open) {
      loadScheduledMessages()
    }
  }, [user, open])

  const loadScheduledMessages = () => {
    const stored = localStorage.getItem(`scheduled-messages-${user?.id}`)
    if (stored) {
      const parsed = JSON.parse(stored).map((msg: any) => ({
        ...msg,
        scheduledFor: new Date(msg.scheduledFor),
      }))
      setScheduledMessages(
        parsed.sort((a: ScheduledMessage, b: ScheduledMessage) => a.scheduledFor.getTime() - b.scheduledFor.getTime()),
      )
    }
  }

  const deleteScheduledMessage = (id: string) => {
    const updated = scheduledMessages.filter((msg) => msg.id !== id)
    setScheduledMessages(updated)
    localStorage.setItem(`scheduled-messages-${user?.id}`, JSON.stringify(updated))
  }

  const onSubmit = (data: { date: string; time: string }) => {
    const scheduledFor = new Date(`${data.date}T${data.time}`)

    if (scheduledFor <= new Date()) {
      alert("Scheduled time must be in the future")
      return
    }

    // This would be called from the parent component with the message data
    onScheduleMessage({
      content: "",
      username: "",
      webhookUrl: "",
      scheduledFor,
    })

    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Scheduled Messages</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule New Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">Date</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("date", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Time</Label>
                    <Input id="schedule-time" type="time" {...register("time", { required: true })} />
                  </div>
                </div>
                <Button type="submit">
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Current Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="font-medium">Upcoming Messages</h3>
            {scheduledMessages.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No scheduled messages</p>
            ) : (
              scheduledMessages.map((message) => (
                <Card key={message.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {message.scheduledFor.toLocaleString()}
                        </div>
                        <p className="font-medium">@{message.username}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{message.content}</p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => deleteScheduledMessage(message.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function saveScheduledMessage(message: ScheduledMessage, userId: string) {
  const stored = localStorage.getItem(`scheduled-messages-${userId}`)
  const scheduled = stored ? JSON.parse(stored) : []

  scheduled.push({
    ...message,
    id: Date.now().toString(),
  })

  localStorage.setItem(`scheduled-messages-${userId}`, JSON.stringify(scheduled))
}