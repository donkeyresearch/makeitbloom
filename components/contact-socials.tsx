"use client"

import { useState } from "react"
import { IconBrandFacebook, IconBrandTiktok, IconBrandWhatsapp, IconPencil, IconShare } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { ShareDialog } from "@/components/share-dialog"

interface ContactData {
  whatsapp: string
  tiktok: string
  facebook: string
}

const DEFAULT_DATA: ContactData = {
  whatsapp: "97933331",
  tiktok: "",
  facebook: "",
}

function sanitisePhone(val: string) {
  return val.replace(/[^0-9]/g, "").slice(0, 15)
}

interface SelectedSubject {
  id: string
  level: string
  subject: string
  rateRaw: string
  currency: string
}

function buildWhatsAppUrl(number: string, selected: SelectedSubject[]) {
  let msg: string
  if (selected.length === 0) {
    msg = "Hi, I saw your profile and I'm interested in your tuition services. Could we arrange a call?"
  } else {
    const lines = selected.map((s) => {
      const rate = parseFloat(s.rateRaw)
      const rateStr = isNaN(rate) ? "" : ` (${s.currency} $${rate.toFixed(2)}/hr)`
      return `• ${s.level} ${s.subject}${rateStr}`
    }).join("\n")
    msg = `Hi, I saw your profile and I'm interested in the following:\n${lines}\n\nCould we arrange a trial lesson?`
  }
  const full = number.length === 8 ? `65${number}` : number
  return `https://wa.me/${full}?text=${encodeURIComponent(msg)}`
}

function buildTikTokUrl(handle: string) {
  return `https://tiktok.com/@${handle}`
}

function buildFacebookUrl(handle: string) {
  if (handle.startsWith("http")) return handle
  return `https://facebook.com/${handle}`
}

export function ContactSocials({
  selected = [],
  isTutor,
  onWhatsAppTap,
}: {
  selected?: SelectedSubject[]
  isTutor: boolean
  onWhatsAppTap?: () => void
}) {
  const [data, setData] = useState<ContactData>(DEFAULT_DATA)
  const [open, setOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [draft, setDraft] = useState<ContactData>(DEFAULT_DATA)

  function startEdit() {
    setDraft(data)
    setOpen(true)
  }

  function save() {
    setData(draft)
    setOpen(false)
  }

  const hasTiktok = data.tiktok.trim().length > 0
  const hasFacebook = data.facebook.trim().length > 0
  const hasWhatsapp = data.whatsapp.trim().length > 0

  return (
    <>
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />

      {/* Drawer for tutor edit */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Contact &amp; Socials</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 pb-8">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">WhatsApp number</label>
              <div className="flex items-center rounded-md border bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <span className="select-none whitespace-nowrap pl-3 text-sm text-muted-foreground">+65</span>
                <span className="mx-2 w-px self-stretch bg-border" />
                <input
                  className="w-full bg-transparent py-2 pr-3 text-base outline-none placeholder:text-muted-foreground"
                  inputMode="numeric"
                  placeholder="91234567"
                  value={draft.whatsapp}
                  onChange={(e) => setDraft((d) => ({ ...d, whatsapp: sanitisePhone(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                TikTok handle <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <div className="flex items-center rounded-md border bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <span className="select-none pl-3 text-sm text-muted-foreground">@</span>
                <input
                  className="w-full bg-transparent py-2 pr-3 text-base outline-none placeholder:text-muted-foreground"
                  placeholder="yourtiktok"
                  value={draft.tiktok}
                  onChange={(e) => setDraft((d) => ({ ...d, tiktok: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                Facebook <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <Input
                placeholder="handle or URL"
                value={draft.facebook}
                onChange={(e) => setDraft((d) => ({ ...d, facebook: e.target.value }))}
              />
            </div>

            <Button className="w-full" onClick={save}>Save</Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-sm items-center gap-2 px-4 py-3">
          {/* WhatsApp CTA */}
          {hasWhatsapp ? (
            <a href={buildWhatsAppUrl(data.whatsapp, selected)} target="_blank" rel="noopener noreferrer" className="flex-1" onClick={onWhatsAppTap}>
              <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                <IconBrandWhatsapp size={18} />
                {selected.length === 0
                  ? "Enquire via WhatsApp"
                  : selected.length === 1
                  ? `Enquire about ${selected[0].subject}`
                  : `Enquire about ${selected.length} subjects`}
              </Button>
            </a>
          ) : (
            <Button className="flex-1 gap-2" disabled>
              <IconBrandWhatsapp size={18} />
              Enquire via WhatsApp
            </Button>
          )}

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

          {isTutor && (
            <>
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground" onClick={() => setShareOpen(true)}>
                <IconShare size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground" onClick={startEdit}>
                <IconPencil size={16} />
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
