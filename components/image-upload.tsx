"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2 } from "lucide-react"
import { uploadToBlob } from "@/lib/upload"

interface ImageUploadProps {
  onImageUploaded: (url: string | null) => void
}

export function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Check file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be less than 8MB")
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload the file
      const url = await uploadToBlob(file)
      onImageUploaded(url)
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload image")
      setPreview(null)
      onImageUploaded(null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageUploaded(null)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Attach Image (optional)</Label>

      {!preview ? (
        <div className="flex items-center gap-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="flex-1"
          />
          {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      ) : (
        <div className="relative">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-40 rounded-md object-contain" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}