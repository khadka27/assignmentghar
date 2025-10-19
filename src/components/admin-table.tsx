"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronUp, ChevronDown } from "lucide-react"

interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface TableProps {
  title: string
  columns: Column[]
  data: Record<string, any>[]
  renderCell?: (key: string, value: any) => React.ReactNode
}

export function AdminTable({ title, columns, data, renderCell }: TableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {columns.map((col) => (
                <th key={col.key} className="text-left py-3 px-4 font-medium">
                  <button
                    onClick={() => col.sortable && handleSort(col.key)}
                    className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
                  >
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span>
                        {sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    {renderCell ? renderCell(col.key, row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
