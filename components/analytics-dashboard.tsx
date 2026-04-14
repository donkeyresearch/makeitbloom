"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { getLast7Days, getSubjectBreakdown, getTotals, type DayStats } from "@/lib/analytics"

function getDayLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-SG", { weekday: "short" })
}

const chartConfig = {
  pageviews: { label: "Visitors", color: "hsl(187 92% 69%)" },
  whatsappTaps: { label: "WhatsApp taps", color: "hsl(188 86% 43%)" },
}

export function AnalyticsDashboard() {
  const [days, setDays] = useState<DayStats[]>([])
  const [subjects, setSubjects] = useState<{ subject: string; taps: number }[]>([])
  const [totals, setTotals] = useState({ pageviews: 0, whatsappTaps: 0 })

  useEffect(() => {
    setDays(getLast7Days())
    setSubjects(getSubjectBreakdown())
    setTotals(getTotals())
  }, [])

  const chartData = days.map((d) => ({
    day: getDayLabel(d.date),
    pageviews: d.pageviews,
    whatsappTaps: d.whatsappTaps,
  }))

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
      <p className="text-sm font-semibold">Analytics <span className="text-xs font-normal text-muted-foreground">(last 7 days)</span></p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="shadow-none">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Visitors</p>
            <p className="text-2xl font-semibold">{totals.pageviews}</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">WhatsApp taps</p>
            <p className="text-2xl font-semibold">{totals.whatsappTaps}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bar chart */}
      <ChartContainer config={chartConfig} className="h-40 w-full">
        <BarChart data={chartData} barGap={2}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={24} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="pageviews" fill="var(--color-pageviews)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="whatsappTaps" fill="var(--color-whatsappTaps)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>

      {/* Subject breakdown */}
      {subjects.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-muted-foreground">Most enquired subjects</p>
          {subjects.map((s) => (
            <div key={s.subject} className="flex items-center justify-between text-xs">
              <span>{s.subject}</span>
              <span className="font-medium">{s.taps} tap{s.taps !== 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      )}

      {totals.pageviews === 0 && totals.whatsappTaps === 0 && subjects.length === 0 && (
        <p className="py-2 text-center text-xs text-muted-foreground">No data yet. Switch to Parent view to simulate visits.</p>
      )}
    </div>
  )
}
