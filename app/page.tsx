import { ContactSocials } from "@/components/contact-socials"
import { LocationTravel } from "@/components/location-travel"
import { ProfileHero } from "@/components/profile-hero"
import { SubjectsRates } from "@/components/subjects-rates"
import { Testimonials } from "@/components/testimonials"

export default function Page() {
  return (
    <>
      <main className="mx-auto max-w-sm px-4 py-8 pb-28">
        <div className="flex flex-col gap-4">
          <ProfileHero />
          <SubjectsRates />
          <Testimonials />
          <LocationTravel />
        </div>
      </main>
      <ContactSocials />
    </>
  )
}
