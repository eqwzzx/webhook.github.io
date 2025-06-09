"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface WebhookValidatorProps {
  webhookUrl: string
  onValidationResult: (isValid: boolean, channelInfo?: any) => void
}

export function WebhookValidator({ webhookUrl, onValidationResult }: WebhookValidatorProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    channelInfo?: any
    error?: string
  } | null>(null)

  const validateWebhook = async () => {
    if (!webhookUrl) return

    setIsValidating(true)
    setValidationResult(null)

    try {
      const response = await fetch("/api/validate-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      })

      const result = await response.json()

      if (response.ok) {
        setValidationResult({
          isValid: true,
          channelInfo: result.channelInfo,
        })
        onValidationResult(true, result.channelInfo)
      } else {
        setValidationResult({
          isValid: false,
          error: result.error,
        })
        onValidationResult(false)
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: "Failed to validate webhook",
      })
      onValidationResult(false)
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={validateWebhook}
          disabled={!webhookUrl || isValidating}
        >
          {isValidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Validate"}
        </Button>
      </div>

      {validationResult && (
        <div className="flex items-center gap-2 text-sm">
          {validationResult.isValid ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                Valid webhook
                {validationResult.channelInfo && <span className="ml-1">(#{validationResult.channelInfo.name})</span>}
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-600 dark:text-red-400">{validationResult.error}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}