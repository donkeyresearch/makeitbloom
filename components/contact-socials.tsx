"use client"

import { useState } from "react"
import { IconBrandFacebook, IconBrandTiktok, IconBrandWhatsapp, IconPencil, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ContactData {
  whatsapp: string   // digits only, e.g. "91234567"
  tiktok: string     // handle without @, optional
  facebook: string   // handle or URL, optional
}

const DEFAULT_DATA: ContactData = {
  whatsapp: "",
  tiktok: "",
  facebook: "",
}

function sanitisePhone(val: string) {
  return val.replace(/[^0-9]/g, "").slice(0, 15)
}

function buildWhatsAppUrl(number: string) {
  const msg = encodeURIComponent("Hi, I saw your profile and I'm interested in your tuition services.")
  // Prepend +65 if 8-digit SG number
  const full = number.length === 8 ? `65${number}` : number
  return `https://wa.me/${full}?text=${msg}`
}

function buildTikTokUrl(handle: string) {
  return `https://tiktok.com/@${handle}`
}

function buildFacebookUrl(handle: string) {
  if (handle.startsWith("http")) return handle
  return `https://facebook.com/${handle}`
}

export function ContactSocials() {
  const [data, setData] = useState<ContactData>(DEFAULT_DATA)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ContactData>(DEFAULT_DATA)

  function startEdit() {
    setDraft(data)
    setEditing(true)
  }

  function save() {
    setData(draft)
    setEditing(false)
  }

  function cancel() {
    setEditing(false)
  }

  const hasTiktok = data.tiktok.trim().length > 0
  const hasFacebook = data.facebook.trim().length > 0
  const hasWhatsapp = data.whatsapp.trim().length > 0

  return (
    <>
      {/* Edit panel — slides in above the sticky bar */}
      {editing && (
        <div className="fixed bottom-20 left-0 right-0 z-40 mx-auto max-w-sm px-4">
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Contact &amp; Socials</p>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancel}>
                <IconX size={14} />
              </Button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">WhatsApp number</label>
              <div className="flex items-center rounded-md border bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <span className="select-none whitespace-nowrap pl-3 text-sm text-muted-foreground">+65</span>
                <span className="w-px self-stretch bg-border mx-2" />
                <input
                  className="w-full bg-transparent py-2 pr-3 text-sm outline-none placeholder:text-muted-foreground"
                  inputMode="numeric"
                  placeholder="91234567"
                  value={draft.whatsapp}
                  onChange={(e) => setDraft((d) => ({ ...d, whatsapp: sanitisePhone(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">TikTok handle <span className="text-muted-foreground/50">(optional)</span></label>
              <div className="flex items-center rounded-md border bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <span className="select-none pl-3 text-sm text-muted-foreground">@</span>
                <input
                  className="w-full bg-transparent py-2 pr-3 text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="yourtiktok"
                  value={draft.tiktok}
                  onChange={(e) => setDraft((d) => ({ ...d, tiktok: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Facebook <span className="text-muted-foreground/50">(optional)</span></label>
              <Input
                placeholder="handle or URL"
                value={draft.facebook}
                onChange={(e) => setDraft((d) => ({ ...d, facebook: e.target.value }))}
              />
            </div>

            <Button className="w-full" onClick={save}>Save</Button>
          </div>
        </div>
      )}

      {/* Sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-sm items-center gap-2 px-4 py-3">
          {/* WhatsApp CTA */}
          {hasWhatsapp ? (
            <a href={buildWhatsAppUrl(data.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                <IconBrandWhatsapp size={18} />
                Chat on WhatsApp
              </Button>
            </a>
          ) : (
            <Button className="flex-1 gap-2" disabled>
              <IconBrandWhatsapp size={18} />
              Chat on WhatsApp
            </Button>
          )}

          {/* Social icons */}
          {hasTiktok && (
            <a href={buildTikTokUrl(data.tiktok)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon">
                <IconBrandTiktok size={18} />
              </Button>
            </a>
          )}
          {hasFacebook && (
            <a href={buildFacebookUrl(data.facebook)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon">
                <IconBrandFacebook size={18} />
              </Button>
            </a>
          )}

          {/* Edit trigger */}
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground" onClick={startEdit}>
            <IconPencil size={16} />
          </Button>
        </div>
      </div>
    </>
  )
}
