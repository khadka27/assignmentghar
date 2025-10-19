"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

type Status = "Awaiting Payment" | "In Progress" | "Completed"

const statusOrder: Status[] = ["Awaiting Payment", "In Progress", "Completed"]

export function StatusChips() {
  const [currentStatus, setCurrentStatus] = useState<Status>("Awaiting Payment")

  const handleCycleStatus = () => {
    const currentIndex = statusOrder.indexOf(currentStatus)
    const nextIndex = (currentIndex + 1) % statusOrder.length
    setCurrentStatus(statusOrder[nextIndex])
  }

  const getVariant = (status: Status) => {
    if (status === currentStatus) {
      return status === "Completed" ? "success" : status === "In Progress" ? "warning" : "default"
    }
    return "default"
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Assignment Status</p>
      <div className="flex flex-wrap gap-2">
        {statusOrder.map((status) => (
          <button
            key={status}
            onClick={handleCycleStatus}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          >
            <Badge variant={getVariant(status)}>{status}</Badge>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Click to cycle through statuses</p>
    </div>
  )
}
