"use client"

import { useState } from "react"
import { IconMapPin } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Mode = "student-comes" | "tutor-travels" | "both"

interface LocationData {
  mode: Mode
  tutorArea: string
  travelAreas: string[]
  travelNotes: string
}

const DEFAULT_DATA: LocationData = {
  mode: "both",
  tutorArea: "",
  travelAreas: [],
  travelNotes: "",
}

const SG_AREAS = [
  "Ang Mo Kio", "Bedok", "Bishan", "Bukit Batok", "Bukit Merah",
  "Bukit Panjang", "Bukit Timah", "Central", "Choa Chu Kang", "Clementi",
  "Geylang", "Hougang", "Jurong East", "Jurong West", "Kallang",
  "Marine Parade", "Novena", "Orchard", "Outram", "Pasir Ris",
  "Punggol", "Queenstown", "Sembawang", "Sengkang", "Serangoon",
  "Tampines", "Toa Payoh", "Woodlands", "Yishun",
]

const MODE_LABELS: Record<Mode, string> = {
  "student-comes": "Student comes to me",
  "tutor-travels": "I travel to student",
  "both": "Both",
}

export function LocationTravel({ isTutor }: { isTutor: boolean }) {
  const [data, setData] = useState<LocationData>(DEFAULT_DATA)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<LocationData>(DEFAULT_DATA)

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

  function toggleArea(area: string) {
    setDraft((d) => ({
      ...d,
      travelAreas: d.travelAreas.includes(area)
        ? d.travelAreas.filter((a) => a !== area)
        : [...d.travelAreas, area],
    }))
  }

  const showTutorArea = draft.mode === "student-comes" || draft.mode === "both"
  const showTravel = draft.mode === "tutor-travels" || draft.mode === "both"
  const viewShowTutorArea = data.mode === "student-comes" || data.mode === "both"
  const viewShowTravel = data.mode === "tutor-travels" || data.mode === "both"

  // ── EDIT MODE ────────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
        <p className="text-sm font-semibold">Location &amp; Travel</p>

        {/* Mode toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Tuition arrangement</label>
          <Tabs value={draft.mode} onValueChange={(v) => setDraft((d) => ({ ...d, mode: v as Mode }))}>
            <TabsList>
              <TabsTrigger value="student-comes">Student comes to me</TabsTrigger>
              <TabsTrigger value="tutor-travels">I travel</TabsTrigger>
              <TabsTrigger value="both">Both</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tutor's general area */}
        {showTutorArea && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Your general area</label>
            <Input
              placeholder="e.g. Tampines"
              value={draft.tutorArea}
              onChange={(e) => setDraft((d) => ({ ...d, tutorArea: e.target.value }))}
            />
          </div>
        )}

        {/* Travel areas */}
        {showTravel && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Areas willing to travel to</label>
            <div className="flex flex-wrap gap-1.5">
              {SG_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    draft.travelAreas.includes(area)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Additional notes <span className="text-muted-foreground/50">(optional)</span></label>
              <Input
                placeholder="e.g. Within 30 min by MRT"
                value={draft.travelNotes}
                onChange={(e) => setDraft((d) => ({ ...d, travelNotes: e.target.value }))}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1" onClick={save}>Save</Button>
          <Button variant="outline" className="flex-1" onClick={cancel}>Cancel</Button>
        </div>
      </div>
    )
  }

  // ── VIEW MODE ────────────────────────────────────────────────────────────────
  const isEmpty = !data.tutorArea && data.travelAreas.length === 0 && !data.travelNotes

  return (
    <div className="relative flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Location &amp; Travel</p>
        {isTutor && <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={startEdit}>
          Edit
        </Button>}
      </div>

      <Badge variant="secondary" className="w-fit">{MODE_LABELS[data.mode]}</Badge>

      {isEmpty ? (
        <p className="text-xs text-muted-foreground">No location details yet. Tap Edit to add.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {viewShowTutorArea && data.tutorArea && (
            <div className="flex items-start gap-1.5">
              <IconMapPin size={13} className="mt-0.5 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Based in <span className="font-medium text-foreground">{data.tutorArea}</span></p>
            </div>
          )}
          {viewShowTravel && data.travelAreas.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground">Willing to travel to:</p>
              <div className="flex flex-wrap gap-1">
                {data.travelAreas.map((area) => (
                  <Badge key={area} variant="outline" className="text-xs">{area}</Badge>
                ))}
              </div>
            </div>
          )}
          {viewShowTravel && data.travelNotes && (
            <p className="text-xs text-muted-foreground">{data.travelNotes}</p>
          )}
        </div>
      )}
    </div>
  )
}
