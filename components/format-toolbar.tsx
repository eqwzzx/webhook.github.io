"use client"

import { Button } from "@/components/ui/button"
import { Bold, Italic, Link, Code } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FormatToolbarProps {
  onFormat: (format: string) => void
}

export function FormatToolbar({ onFormat }: FormatToolbarProps) {
  const formatButtons = [
    { id: "bold", icon: Bold, label: "Bold" },
    { id: "italic", icon: Italic, label: "Italic" },
    { id: "link", icon: Link, label: "Link" },
    { id: "code", icon: Code, label: "Code" },
  ]

  return (
    <div className="flex items-center gap-1 mb-2">
      <TooltipProvider>
        {formatButtons.map((button) => (
          <Tooltip key={button.id}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onFormat(button.id)}
              >
                <button.icon className="h-4 w-4" />
                <span className="sr-only">{button.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{button.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}