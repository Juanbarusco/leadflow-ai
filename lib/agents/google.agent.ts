export interface GoogleBusiness {
  id: string

  name: string

  city: string

  address: string

  phone?: string

  website?: string

  rating: number

  reviews: number
}

export class GoogleAgent {
  async search(query: string): Promise<GoogleBusiness[]> {
    console.log(`🔎 Google Agent pesquisando: ${query}`)

    return [
      {
        id: crypto.randomUUID(),

        name: "Clínica Sorriso Prime",

        city: "São Carlos",

        address: "Av. São Carlos, 1520",

        phone: "(16) 99999-9999",

        website: "https://sorrisoprime.com.br",

        rating: 4.9,

        reviews: 327,
      },
      {
        id: crypto.randomUUID(),

        name: "Odonto Life",

        city: "São Carlos",

        address: "Rua Episcopal, 550",

        rating: 4.8,

        reviews: 201,
      },
    ]
  }
}

export const googleAgent = new GoogleAgent()