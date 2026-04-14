"use client"

import { useState } from "react"
import { IconCheck, IconLayoutGrid, IconLayoutList, IconPlus, IconTrash } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SubjectEntry {
  id: string
  level: string
  subject: string
  rateRaw: string   // numeric string, e.g. "45.00"
  currency: string  // e.g. "SGD"
}

const DEFAULT_ENTRIES: SubjectEntry[] = [
  { id: "1", level: "Sec 1", subject: "Math", rateRaw: "45", currency: "SGD" },
  { id: "2", level: "Sec 1", subject: "Science", rateRaw: "45", currency: "SGD" },
  { id: "3", level: "Sec 2", subject: "Math", rateRaw: "50", currency: "SGD" },
  { id: "4", level: "Sec 2", subject: "English", rateRaw: "50", currency: "SGD" },
]

function uid() {
  return Math.random().toString(36).slice(2)
}

const CURRENCIES = ["SGD", "USD", "MYR", "AUD", "GBP"]

function formatRate(raw: string, currency: string) {
  const n = parseFloat(raw)
  if (isNaN(n)) return "—"
  return `${currency} $${n.toFixed(2)}/hr`
}

function sanitiseRate(val: string) {
  // allow digits and at most one decimal point, max 2 decimal places
  const cleaned = val.replace(/[^0-9.]/g, "")
  const parts = cleaned.split(".")
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("")
  if (parts[1] !== undefined) return parts[0] + "." + parts[1].slice(0, 2)
  return cleaned
}

// Reusable rate input with currency selector prefix
function RateInput({
  value,
  currency,
  onValueChange,
  onCurrencyChange,
}: {
  value: string
  currency: string
  onValueChange: (v: string) => void
  onCurrencyChange: (c: string) => void
}) {
  return (
    <div className="flex items-center rounded-md border bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="h-auto w-auto gap-1 border-0 bg-transparent px-3 py-2 text-sm shadow-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="w-px self-stretch bg-border" />
      <span className="select-none pl-3 text-muted-foreground">$</span>
      <input
        className="w-full min-w-0 bg-transparent py-2 pl-1 pr-1 text-sm outline-none placeholder:text-muted-foreground"
        inputMode="decimal"
        placeholder="0.00"
        value={value}
        onChange={(e) => onValueChange(sanitiseRate(e.target.value))}
      />
      <span className="select-none pr-3 text-muted-foreground">/hr</span>
    </div>
  )
}

interface SelectedSubject {
  id: string
  level: string
  subject: string
  rateRaw: string
  currency: string
}

export function SubjectsRates({
  selected,
  onToggle,
  isTutor,
}: {
  selected: SelectedSubject[]
  onToggle: (entry: SelectedSubject) => void
  isTutor: boolean
}) {
  const [entries, setEntries] = useState<SubjectEntry[]>(DEFAULT_ENTRIES)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<SubjectEntry[]>(DEFAULT_ENTRIES)
  const [view, setView] = useState<"list" | "grid">("grid")
  const [selectedLevel, setSelectedLevel] = useState<string>("")

  const [newLevel, setNewLevel] = useState("")
  const [newSubject, setNewSubject] = useState("")
  const [newRate, setNewRate] = useState("")
  const [newCurrency, setNewCurrency] = useState("SGD")

  const levels = Array.from(new Set(entries.map((e) => e.level)))
  const activeLevel = selectedLevel || levels[0] || ""
  const filtered = entries.filter((e) => e.level === activeLevel)
  const draftLevels = Array.from(new Set(draft.map((e) => e.level)))

  function startEdit() {
    setDraft(entries)
    setEditing(true)
  }

  function save() {
    setEntries(draft)
    setEditing(false)
    setNewLevel(""); setNewSubject(""); setNewRate(""); setNewCurrency("SGD")
  }

  function cancel() {
    setEditing(false)
    setNewLevel(""); setNewSubject(""); setNewRate(""); setNewCurrency("SGD")
  }

  function deleteDraftEntry(id: string) {
    setDraft((d) => d.filter((e) => e.id !== id))
  }

  function updateDraftEntry(id: string, field: keyof SubjectEntry, value: string) {
    setDraft((d) => d.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  function addEntry() {
    if (!newLevel.trim() || !newSubject.trim() || !newRate.trim()) return
    setDraft((d) => [
      ...d,
      { id: uid(), level: newLevel.trim(), subject: newSubject.trim(), rateRaw: newRate, currency: newCurrency },
    ])
    setNewSubject("")
    setNewRate("")
  }

  // ── EDIT MODE ────────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
        <p className="text-sm font-semibold">Subjects &amp; Rate</p>

        {/* Existing entries grouped by level */}
        <div className="flex flex-col gap-4">
          {draftLevels.map((level) => (
            <div key={level} className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">{level}</p>
              {draft
                .filter((e) => e.level === level)
                .map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2">
                    <div className="flex flex-1 flex-col gap-2 rounded-lg border p-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Subject</label>
                        <Input
                          value={entry.subject}
                          placeholder="e.g. Math"
                          onChange={(e) => updateDraftEntry(entry.id, "subject", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Rate/hr</label>
                        <RateInput
                          value={entry.rateRaw}
                          currency={entry.currency}
                          onValueChange={(v) => updateDraftEntry(entry.id, "rateRaw", v)}
                          onCurrencyChange={(c) => updateDraftEntry(entry.id, "currency", c)}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-1 h-8 w-8 shrink-0 text-destructive"
                      onClick={() => deleteDraftEntry(entry.id)}
                    >
                      <IconTrash size={14} />
                    </Button>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Add new entry */}
        <div className="flex flex-col gap-3 rounded-lg border border-dashed p-3">
          <p className="text-xs font-medium text-muted-foreground">Add entry</p>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Level</label>
            <Input
              placeholder="e.g. Sec 3"
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Subject</label>
            <Input
              placeholder="e.g. Chemistry"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Rate/hr</label>
            <RateInput
              value={newRate}
              currency={newCurrency}
              onValueChange={setNewRate}
              onCurrencyChange={setNewCurrency}
            />
          </div>

          <Button size="sm" variant="outline" onClick={addEntry} className="w-full gap-1">
            <IconPlus size={12} /> Add
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={save}>Save</Button>
          <Button variant="outline" className="flex-1" onClick={cancel}>Cancel</Button>
        </div>
      </div>
    )
  }

  // ── VIEW MODE ────────────────────────────────────────────────────────────────

  // Parent mode: all entries grouped by level, no tabs
  const parentGroups = levels.map((level) => ({
    level,
    entries: entries.filter((e) => e.level === level),
  }))

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Subjects &amp; Rate</p>
        <div className="flex items-center gap-1">
          {isTutor && (
            <>
              <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setView("list")}>
                <IconLayoutList size={14} />
              </Button>
              <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setView("grid")}>
                <IconLayoutGrid size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="ml-1 text-xs text-muted-foreground" onClick={startEdit}>
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Instructional nudge — parent only */}
      {!isTutor && entries.length > 0 && (
        <p className="text-xs text-muted-foreground">Select the subjects you're interested in, then tap Enquire.</p>
      )}

      {entries.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">No subjects yet. Tap Edit to add.</p>
      ) : isTutor ? (
        <>
          {/* Tutor: tabs + filtered grid/list */}
          {levels.length > 0 && (
            <Tabs value={activeLevel} onValueChange={setSelectedLevel}>
              <TabsList>
                {levels.map((level) => (
                  <TabsTrigger key={level} value={level}>{level}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          <ScrollArea className="w-full">
            <div className={view === "grid" ? "grid grid-cols-2 gap-2 p-0.5" : "flex flex-col gap-2 p-0.5"}>
              {filtered.map((entry) => (
                <Card key={entry.id} className="shadow-none">
                  <CardContent className="p-3">
                    <Badge variant="secondary" className="mb-1 text-xs">{entry.level}</Badge>
                    <p className="text-sm font-medium">{entry.subject}</p>
                    <p className="text-xs text-muted-foreground">{formatRate(entry.rateRaw, entry.currency)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </>
      ) : (
        /* Parent: all levels visible, grouped, checkbox affordance */
        <div className="flex flex-col gap-4 p-0.5">
          {parentGroups.map(({ level, entries: groupEntries }) => (
            <div key={level} className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">{level}</p>
              <div className="grid grid-cols-2 gap-2">
                {groupEntries.map((entry) => {
                  const isSelected = selected.some((s) => s.id === entry.id)
                  return (
                    <Card
                      key={entry.id}
                      onClick={() => onToggle(entry)}
                      className={`cursor-pointer shadow-none transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : "hover:border-muted-foreground/40"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-medium">{entry.subject}</p>
                          {/* Checkbox affordance */}
                          <span className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                            isSelected ? "border-green-500 bg-green-500" : "border-muted-foreground/40"
                          }`}>
                            {isSelected && <IconCheck size={10} className="text-white" />}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatRate(entry.rateRaw, entry.currency)}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
