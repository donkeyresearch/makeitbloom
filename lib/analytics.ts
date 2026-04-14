const KEY = "mib_analytics"

export type EventType = "pageview" | "whatsapp_tap" | "subject_tap"

export interface AnalyticsEvent {
  type: EventType
  ts: number           // unix ms
  subject?: string     // for subject_tap
}

export interface DayStats {
  date: string         // "YYYY-MM-DD"
  pageviews: number
  whatsappTaps: number
}

function load(): AnalyticsEvent[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]")
  } catch {
    return []
  }
}

function save(events: AnalyticsEvent[]) {
  // Keep max 90 days of events to avoid unbounded growth
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000
  localStorage.setItem(KEY, JSON.stringify(events.filter((e) => e.ts > cutoff)))
}

export function track(type: EventType, subject?: string) {
  if (typeof window === "undefined") return
  const events = load()
  events.push({ type, ts: Date.now(), subject })
  save(events)
}

function toDateStr(ts: number) {
  return new Date(ts).toISOString().slice(0, 10)
}

export function getLast7Days(): DayStats[] {
  const events = load()
  const days: DayStats[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const date = toDateStr(d.getTime())
    const dayEvents = events.filter((e) => toDateStr(e.ts) === date)
    days.push({
      date,
      pageviews: dayEvents.filter((e) => e.type === "pageview").length,
      whatsappTaps: dayEvents.filter((e) => e.type === "whatsapp_tap").length,
    })
  }
  return days
}

export function getSubjectBreakdown(): { subject: string; taps: number }[] {
  const events = load().filter((e) => e.type === "subject_tap" && e.subject)
  const counts: Record<string, number> = {}
  for (const e of events) {
    counts[e.subject!] = (counts[e.subject!] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([subject, taps]) => ({ subject, taps }))
    .sort((a, b) => b.taps - a.taps)
    .slice(0, 5)
}

export function getTotals() {
  const events = load()
  const cutoff7 = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recent = events.filter((e) => e.ts > cutoff7)
  return {
    pageviews: recent.filter((e) => e.type === "pageview").length,
    whatsappTaps: recent.filter((e) => e.type === "whatsapp_tap").length,
  }
}
