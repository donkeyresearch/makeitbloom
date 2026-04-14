"use client"

import { useEffect, useState } from "react"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ContactSocials } from "@/components/contact-socials"
import { LocationTravel } from "@/components/location-travel"
import { ProfileHero } from "@/components/profile-hero"
import { SubjectsRates } from "@/components/subjects-rates"
import { Testimonials } from "@/components/testimonials"
import { track } from "@/lib/analytics"

export interface SelectedSubject {
  id: string
  level: string
  subject: string
  rateRaw: string
  currency: string
}

type Role = "tutor" | "parent"

export function PageClient() {
  const [role, setRole] = useState<Role>("parent")
  const [selected, setSelected] = useState<SelectedSubject[]>([])

  const isTutor = role === "tutor"

  // Track page view once on mount (only in parent/visitor mode would fire in real use,
  // but we track regardless so the tutor can test it by switching roles)
  useEffect(() => {
    track("pageview")
  }, [])

  function toggleSubject(entry: SelectedSubject) {
    const isSelecting = !selected.some((s) => s.id === entry.id)
    if (isSelecting) track("subject_tap", `${entry.level} ${entry.subject}`)
    setSelected((prev) =>
      prev.some((s) => s.id === entry.id)
        ? prev.filter((s) => s.id !== entry.id)
        : [...prev, entry]
    )
  }

  // Clear selection when switching to tutor mode
  function setRoleAndReset(r: Role) {
    setRole(r)
    if (r === "tutor") setSelected([])
  }

  return (
    <>
      <main className="mx-auto max-w-sm px-4 py-8 pb-28">
        <div className="flex flex-col gap-4">

          {/* Role switcher — demo only */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1 rounded-full border bg-muted p-1 text-xs">
              <button
                onClick={() => setRoleAndReset("parent")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  role === "parent" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Parent / Student
              </button>
              <button
                onClick={() => setRoleAndReset("tutor")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  role === "tutor" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Tutor
              </button>
            </div>
          </div>

          <ProfileHero isTutor={isTutor} />
          {isTutor && <AnalyticsDashboard />}
          <SubjectsRates selected={selected} onToggle={toggleSubject} isTutor={isTutor} />
          <Testimonials isTutor={isTutor} />
          <LocationTravel isTutor={isTutor} />
        </div>
      </main>
      <ContactSocials selected={selected} isTutor={isTutor} onWhatsAppTap={() => track("whatsapp_tap")} />
    </>
  )
}
