"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface EmbedField {
  name: string
  value: string
  inline: boolean
}

interface EmbedData {
  title: string
  description: string
  color: string
  author: string
  footer: string
  thumbnail: string
  image: string
  fields: EmbedField[]
}

interface EmbedBuilderProps {
  onEmbedChange: (embed: any) => void
}

export function EmbedBuilder({ onEmbedChange }: EmbedBuilderProps) {
  const [fields, setFields] = useState<EmbedField[]>([])

  const { register, watch, setValue } = useForm<EmbedData>({
    defaultValues: {
      title: "",
      description: "",
      color: "#5865F2",
      author: "",
      footer: "",
      thumbnail: "",
      image: "",
      fields: [],
    },
  })

  const formData = watch()

  const addField = () => {
    const newFields = [...fields, { name: "", value: "", inline: false }]
    setFields(newFields)
    updateEmbed({ ...formData, fields: newFields })
  }

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
    updateEmbed({ ...formData, fields: newFields })
  }

  const updateField = (index: number, field: Partial<EmbedField>) => {
    const newFields = fields.map((f, i) => (i === index ? { ...f, ...field } : f))
    setFields(newFields)
    updateEmbed({ ...formData, fields: newFields })
  }

  const updateEmbed = (data: EmbedData) => {
    const embed: any = {}

    if (data.title) embed.title = data.title
    if (data.description) embed.description = data.description
    if (data.color) embed.color = Number.parseInt(data.color.replace("#", ""), 16)
    if (data.author) embed.author = { name: data.author }
    if (data.footer) embed.footer = { text: data.footer }
    if (data.thumbnail) embed.thumbnail = { url: data.thumbnail }
    if (data.image) embed.image = { url: data.image }
    if (data.fields.length > 0) {
      embed.fields = data.fields.filter((f) => f.name && f.value)
    }

    onEmbedChange(Object.keys(embed).length > 0 ? embed : null)
  }

  // Watch for changes and update embed
  useState(() => {
    const subscription = watch((data) => {
      updateEmbed({ ...data, fields } as EmbedData)
    })
    return () => subscription.unsubscribe()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord Embed Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="embed-title">Title</Label>
            <Input id="embed-title" placeholder="Embed title" {...register("title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="embed-color">Color</Label>
            <Input id="embed-color" type="color" {...register("color")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="embed-description">Description</Label>
          <Textarea id="embed-description" placeholder="Embed description" {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="embed-author">Author</Label>
            <Input id="embed-author" placeholder="Author name" {...register("author")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="embed-footer">Footer</Label>
            <Input id="embed-footer" placeholder="Footer text" {...register("footer")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="embed-thumbnail">Thumbnail URL</Label>
            <Input id="embed-thumbnail" placeholder="https://example.com/image.png" {...register("thumbnail")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="embed-image">Image URL</Label>
            <Input id="embed-image" placeholder="https://example.com/image.png" {...register("image")} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Fields</Label>
            <Button type="button" size="sm" onClick={addField}>
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Field {index + 1}</span>
                <Button type="button" size="sm" variant="destructive" onClick={() => removeField(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Field name"
                  value={field.name}
                  onChange={(e) => updateField(index, { name: e.target.value })}
                />
                <Input
                  placeholder="Field value"
                  value={field.value}
                  onChange={(e) => updateField(index, { value: e.target.value })}
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.inline}
                  onChange={(e) => updateField(index, { inline: e.target.checked })}
                />
                <span className="text-sm">Inline</span>
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}