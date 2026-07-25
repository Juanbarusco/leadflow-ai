import type { PlaceBusiness } from "@/lib/places/types"

export function digitsOnly(value?: string) {
  return value?.replace(/\D/g, "") ?? ""
}

export function buildWhatsappUrl(phone?: string, internationalPhone?: string) {
  let digits = digitsOnly(internationalPhone || phone)
  if (!digits) return undefined

  if ((digits.length === 10 || digits.length === 11) && !digits.startsWith("55")) {
    digits = `55${digits}`
  }

  return `https://wa.me/${digits}`
}

export function createDataCompleteness(
  business: Pick<PlaceBusiness, "address" | "phone" | "website" | "mapsUrl" | "openingHours">,
) {
  return {
    address: Boolean(business.address),
    phone: Boolean(business.phone),
    website: Boolean(business.website),
    maps: Boolean(business.mapsUrl),
    openingHours: Boolean(business.openingHours?.weekdayDescriptions.length),
  }
}
