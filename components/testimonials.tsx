"use client"

import { useState } from "react"
import { IconLayoutGrid, IconLayoutList, IconPlus, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Testimonial {
  id: string
  parentName: string
  level: string
  quote: string
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    parentName: "Mrs Lim",
    level: "Sec 2",
    quote: "My son's Math results improved from a D7 to a B3 in just two months. Very patient and structured teacher.",
  },
  {
    id: "2",
    parentName: "Mr Tan",
    level: "Sec 1",
    quote: "Highly recommended. She explains concepts clearly and my daughter actually looks forward to lessons now.",
  },
  {
    id: "3",
    parentName: "Mrs Ng",
    level: "Sec 2",
    quote: "Very committed tutor. Always follows up after sessions to make sure my child understood the material.",
  },
]

function uid() {
  return Math.random().toString(36).slice(2)
}

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS)
  const [view, setView] = useState<"list" | "grid">("grid")

  const [newParentName, setNewParentName] = useState("")
  const [newLevel, setNewLevel] = useState("")
  const [newQuote, setNewQuote] = useState("")

  function startEdit() {
    setDraft(items)
    setEditing(true)
  }

  function save() {
    setItems(draft)
    setEditing(false)
    setNewParentName(""); setNewLevel(""); setNewQuote("")
  }

  function cancel() {
    setEditing(false)
    setNewParentName(""); setNewLevel(""); setNewQuote("")
  }

  function deleteDraft(id: string) {
    setDraft((d) => d.filter((t) => t.id !== id))
  }

  function updateDraft(id: string, field: keyof Testimonial, value: string) {
    setDraft((d) => d.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  function addEntry() {
    if (!newParentName.trim() || !newQuote.trim()) return
    setDraft((d) => [
      ...d,
      { id: uid(), parentName: newParentName.trim(), level: newLevel.trim(), quote: newQuote.trim() },
    ])
    setNewParentName(""); setNewLevel(""); setNewQuote("")
  }

  // ── EDIT MODE ────────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
        <p className="text-sm font-semibold">Testimonies by Parents</p>

        <div className="flex flex-col gap-3">
          {draft.map((t) => (
            <div key={t.id} className="flex items-start gap-2">
              <div className="flex flex-1 flex-col gap-2 rounded-lg border p-3">
                <div className="flex gap-2">
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Parent name</label>
                    <Input
                      value={t.parentName}
                      placeholder="e.g. Mrs Lim"
                      onChange={(e) => updateDraft(t.id, "parentName", e.target.value)}
                    />
                  </div>
                  <div className="flex w-24 flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Level</label>
                    <Input
                      value={t.level}
                      placeholder="Sec 2"
                      onChange={(e) => updateDraft(t.id, "level", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Quote</label>
                  <textarea
                    rows={3}
                    value={t.quote}
                    placeholder="What did the parent say?"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onChange={(e) => updateDraft(t.id, "quote", e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="mt-1 h-8 w-8 shrink-0 text-destructive"
                onClick={() => deleteDraft(t.id)}
              >
                <IconTrash size={14} />
              </Button>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="flex flex-col gap-3 rounded-lg border border-dashed p-3">
          <p className="text-xs font-medium text-muted-foreground">Add testimonial</p>
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs text-muted-foreground">Parent name</label>
              <Input
                placeholder="e.g. Mrs Lim"
                value={newParentName}
                onChange={(e) => setNewParentName(e.target.value)}
              />
            </div>
            <div className="flex w-24 flex-col gap-1">
              <label className="text-xs text-muted-foreground">Level</label>
              <Input
                placeholder="Sec 2"
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Quote</label>
            <textarea
              rows={3}
              placeholder="What did the parent say?"
              value={newQuote}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onChange={(e) => setNewQuote(e.target.value)}
            />
          </div>
          <Button size="sm" variant="outline" onClick={addEntry} className="w-full gap-1">
            <IconPlus size={12} /> Add
          </Button>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={save}>Save</Button>
          <Button variant="outline" className="flex-1" onClick={cancel}>Cancel</Button>
        </div>
      </div>
    )
  }

  // ── VIEW MODE ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Testimonies by Parents</p>
        <div className="flex items-center gap-1">
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("list")}
          >
            <IconLayoutList size={14} />
          </Button>
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("grid")}
          >
            <IconLayoutGrid size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="ml-1 text-xs text-muted-foreground" onClick={startEdit}>
            Edit
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">No testimonials yet. Tap Edit to add.</p>
      ) : (
        <ScrollArea className="w-full">
          <div className={view === "grid" ? "grid grid-cols-2 gap-2 p-0.5" : "flex flex-col gap-2 p-0.5"}>
            {items.map((t) => (
              <Card key={t.id} className="shadow-none">
                <CardContent className="flex flex-col gap-1 p-3">
                  <p className="text-xs font-medium">{t.parentName}</p>
                  {t.level && (
                    <p className="text-xs text-muted-foreground">{t.level}</p>
                  )}
                  <p className="text-xs leading-relaxed text-muted-foreground">"{t.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
