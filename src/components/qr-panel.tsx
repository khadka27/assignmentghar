"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface QRPanelProps {
  onPaymentProofUpload?: (file: File) => void
}

export function QRPanel({ onPaymentProofUpload }: QRPanelProps) {
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onPaymentProofUpload?.(file)
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-1">Payment Required</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Work begins after QR payment is confirmed.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* QR Code */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 font-medium">Scan QR Code to Pay</p>
          <div className="bg-slate-100 dark:bg-slate-800 w-full aspect-square rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-slate-600 dark:text-slate-300 text-sm">QR Code</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sample QR Placeholder</p>
            </div>
          </div>
        </div>

        {/* Payment Proof Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Payment Proof</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm cursor-pointer"
          />
          {proofFile && (
            <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <p className="text-sm text-emerald-900 dark:text-emerald-100">✓ {proofFile.name} uploaded</p>
              {previewUrl && (
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Payment proof preview"
                  className="mt-2 max-h-32 rounded-lg"
                />
              )}
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant="warning">Awaiting Payment</Badge>
        </div>
      </div>
    </div>
  )
}
