import type React from "react"
import { Card } from "@/components/ui/card"
import { MessageSquare, CreditCard, Clock, CheckCircle } from "lucide-react"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  )
}

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<MessageSquare className="w-6 h-6 text-emerald-600" />} label="Active Chats" value={12} />
      <StatCard icon={<CreditCard className="w-6 h-6 text-emerald-600" />} label="Pending Payments" value={5} />
      <StatCard icon={<Clock className="w-6 h-6 text-emerald-600" />} label="In Progress" value={8} />
      <StatCard icon={<CheckCircle className="w-6 h-6 text-emerald-600" />} label="Completed" value={24} />
    </div>
  )
}
