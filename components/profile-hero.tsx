"use client"

import { useState, useRef } from "react"
import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProfileData {
  name: string
  studentCount: number
  avatarUrl: string
}

interface DraftData {
  name: string
  studentCountRaw: string
  avatarUrl: string
}

const DEFAULT_DATA: ProfileData = {
  name: "Ms Sarah Tan",
  studentCount: 50,
  avatarUrl: "",
}

export function ProfileHero() {
  const { theme, setTheme } = useTheme()
  const [data, setData] = useState<ProfileData>(DEFAULT_DATA)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<DraftData>({ name: DEFAULT_DATA.name, studentCountRaw: String(DEFAULT_DATA.studentCount), avatarUrl: DEFAULT_DATA.avatarUrl })
  const fileRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setDraft({ name: data.name, studentCountRaw: String(data.studentCount), avatarUrl: data.avatarUrl })
    setEditing(true)
  }

  function save() {
    setData({ name: draft.name, studentCount: Math.max(0, parseInt(draft.studentCountRaw, 10) || 0), avatarUrl: draft.avatarUrl })
    setEditing(false)
  }

  function cancel() {
    setEditing(false)
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setDraft((d) => ({ ...d, avatarUrl: url }))
  }

  const initials = data.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const draftInitials = draft.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const ThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      className="absolute left-3 top-3 h-7 w-7 text-muted-foreground"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <IconSun size={15} /> : <IconMoon size={15} />}
    </Button>
  )

  if (editing) {
    return (
      <div className="relative flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <ThemeToggle />
        {/* Avatar upload */}
        <div
          className="cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <Avatar className="h-20 w-20">
            <AvatarImage src={draft.avatarUrl} />
            <AvatarFallback>{draftInitials || "?"}</AvatarFallback>
          </Avatar>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatar}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Tap avatar to upload photo (optional)
        </p>

        {/* Name */}
        <div className="w-full">
          <label className="mb-1 block text-xs text-muted-foreground">
            Name
          </label>
          <Input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="Your name"
          />
        </div>

        {/* Student count */}
        <div className="w-full">
          <label className="mb-1 block text-xs text-muted-foreground">
            Students taught
          </label>
          <Input
            inputMode="numeric"
            placeholder="e.g. 50"
            value={draft.studentCountRaw}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                studentCountRaw: e.target.value.replace(/[^0-9]/g, ""),
              }))
            }
          />
        </div>

        {/* Actions */}
        <div className="flex w-full gap-2">
          <Button className="flex-1" onClick={save}>
            Save
          </Button>
          <Button variant="outline" className="flex-1" onClick={cancel}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <ThemeToggle />
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-3 top-3 text-xs text-muted-foreground"
        onClick={startEdit}
      >
        Edit
      </Button>

      <Avatar className="h-20 w-20">
        <AvatarImage src={data.avatarUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <p className="text-lg font-semibold">{data.name}</p>

      <Badge variant="secondary">
        Trusted by {data.studentCount} students
      </Badge>
    </div>
  )
}
