"use client"

import { useEffect, useState } from "react"
import { IconCheck, IconCopy, IconShare } from "@tabler/icons-react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="flex w-full items-center justify-between rounded-lg border bg-muted/50 px-3 py-2 text-left text-xs"
    >
      <span className="truncate text-muted-foreground">{url}</span>
      <span className="ml-2 shrink-0 text-muted-foreground">
        {copied ? <IconCheck size={14} className="text-green-600" /> : <IconCopy size={14} />}
      </span>
    </button>
  )
}

export function ShareDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share

  async function nativeShare() {
    try {
      await navigator.share({ title: "My Tuition Profile", url })
    } catch {
      // user dismissed — no action needed
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Share your profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* QR code */}
          {url && (
            <div className="rounded-xl border p-3">
              <QRCodeSVG value={url} size={180} />
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground">
            Print this QR code on your namecard — parents can scan to view your profile instantly.
          </p>

          {/* Copy link */}
          {url && <CopyButton url={url} />}

          {/* Native share (mobile) */}
          {canNativeShare && (
            <Button variant="outline" className="w-full gap-2" onClick={nativeShare}>
              <IconShare size={15} />
              Share via…
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
