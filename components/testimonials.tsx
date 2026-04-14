"use client"

import { useState, useRef } from "react"
import { IconLayoutGrid, IconLayoutList, IconPhoto, IconPlus, IconTrash, IconX } from "@tabler/icons-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Testimonial {
  id: string
  parentName: string
  level: string
  quote: string
  images: string[]
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    parentName: "Mrs Lim",
    level: "Sec 2",
    quote: "My son's Math results improved from a D7 to a B3 in just two months. Very patient and structured teacher.",
    images: ["/testimonial-1.png"],
  },
  {
    id: "2",
    parentName: "Mr Tan",
    level: "Sec 1",
    quote: "Highly recommended. She explains concepts clearly and my daughter actually looks forward to lessons now.",
    images: ["/testimonial-2.jpg"],
  },
  {
    id: "3",
    parentName: "Mrs Ng",
    level: "Sec 2",
    quote: "Very committed tutor. Always follows up after sessions to make sure my child understood the material.",
    images: ["/testimonial-3.jpg"],
  },
]

function uid() {
  return Math.random().toString(36).slice(2)
}

function ImageStrip({
  images,
  onRemove,
  onPreview,
}: {
  images: string[]
  onRemove?: (index: number) => void
  onPreview?: (src: string) => void
}) {
  if (images.length === 0) return null
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 pb-1 pt-1.5 pr-1">
        {images.map((src, i) => (
          <div key={i} className="relative shrink-0 w-20">
            <AspectRatio ratio={1}>
              <img
                src={src}
                alt=""
                className="h-full w-full rounded-md object-cover cursor-pointer"
                onClick={() => onPreview?.(src)}
              />
            </AspectRatio>
            {onRemove && (
              <button
                onClick={() => onRemove(i)}
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border"
              >
                <IconX size={10} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ImageUploader({ onAdd }: { onAdd: (urls: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const urls = files.map((f) => URL.createObjectURL(f))
    onAdd(urls)
    e.target.value = ""
  }
  return (
    <>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
      <Button size="sm" variant="outline" className="w-full gap-1 text-xs" onClick={() => ref.current?.click()}>
        <IconPhoto size={13} /> Add photos
      </Button>
    </>
  )
}

export function Testimonials({ isTutor }: { isTutor: boolean }) {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS)
  const [view, setView] = useState<"list" | "grid">("list")
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  const [newParentName, setNewParentName] = useState("")
  const [newLevel, setNewLevel] = useState("")
  const [newQuote, setNewQuote] = useState("")
  const [newImages, setNewImages] = useState<string[]>([])

  function startEdit() {
    setDraft(items)
    setEditing(true)
  }

  function save() {
    setItems(draft)
    setEditing(false)
    setNewParentName(""); setNewLevel(""); setNewQuote(""); setNewImages([])
  }

  function cancel() {
    setEditing(false)
    setNewParentName(""); setNewLevel(""); setNewQuote(""); setNewImages([])
  }

  function deleteDraft(id: string) {
    setDraft((d) => d.filter((t) => t.id !== id))
  }

  function updateDraft(id: string, field: keyof Testimonial, value: string) {
    setDraft((d) => d.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  function addImagesToEntry(id: string, urls: string[]) {
    setDraft((d) => d.map((t) => (t.id === id ? { ...t, images: [...t.images, ...urls] } : t)))
  }

  function removeImageFromEntry(id: string, index: number) {
    setDraft((d) => d.map((t) => (t.id === id ? { ...t, images: t.images.filter((_, i) => i !== index) } : t)))
  }

  function addEntry() {
    if (!newParentName.trim() || !newQuote.trim()) return
    setDraft((d) => [
      ...d,
      { id: uid(), parentName: newParentName.trim(), level: newLevel.trim(), quote: newQuote.trim(), images: newImages },
    ])
    setNewParentName(""); setNewLevel(""); setNewQuote(""); setNewImages([])
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
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Photos</label>
                  <ImageStrip images={t.images} onRemove={(i) => removeImageFromEntry(t.id, i)} />
                  <ImageUploader onAdd={(urls) => addImagesToEntry(t.id, urls)} />
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
              <Input placeholder="e.g. Mrs Lim" value={newParentName} onChange={(e) => setNewParentName(e.target.value)} />
            </div>
            <div className="flex w-24 flex-col gap-1">
              <label className="text-xs text-muted-foreground">Level</label>
              <Input placeholder="Sec 2" value={newLevel} onChange={(e) => setNewLevel(e.target.value)} />
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
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Photos</label>
            <ImageStrip images={newImages} onRemove={(i) => setNewImages((imgs) => imgs.filter((_, idx) => idx !== i))} />
            <ImageUploader onAdd={(urls) => setNewImages((imgs) => [...imgs, ...urls])} />
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
    <>
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Testimonies by Parents</p>
          <div className="flex items-center gap-1">
            <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setView("list")}>
              <IconLayoutList size={14} />
            </Button>
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setView("grid")}>
              <IconLayoutGrid size={14} />
            </Button>
            {isTutor && <Button variant="ghost" size="sm" className="ml-1 text-xs text-muted-foreground" onClick={startEdit}>
              Edit
            </Button>}
          </div>
        </div>

        {items.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">No testimonials yet. Tap Edit to add.</p>
        ) : (
          <ScrollArea className="w-full">
            <div className={view === "grid" ? "grid grid-cols-2 gap-2 p-0.5" : "flex flex-col gap-2 p-0.5"}>
              {items.map((t) => (
                <Card key={t.id} className="shadow-none">
                  <CardContent className="flex flex-col gap-1.5 p-3">
                    <p className="text-sm font-semibold">{t.parentName}</p>
                    {t.level && <p className="text-xs text-muted-foreground">{t.level}</p>}
                    <p className="text-sm leading-relaxed">"{t.quote}"</p>
                    <ImageStrip images={t.images} onPreview={setPreviewSrc} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Image preview modal */}
      <Dialog open={!!previewSrc} onOpenChange={(open) => { if (!open) setPreviewSrc(null) }}>
        <DialogContent className="flex items-center justify-center border-0 bg-transparent p-0 shadow-none max-w-sm">
          {previewSrc && (
            <img src={previewSrc} alt="" className="w-full rounded-xl object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
