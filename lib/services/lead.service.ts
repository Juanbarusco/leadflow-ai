import type { MissionCompany } from "@/lib/engines/mission-engine"

export class LeadService {
  rank(companies: MissionCompany[]): MissionCompany[] {
    return [...companies].sort((a, b) => b.leadScore.score - a.leadScore.score)
  }

  getQualified(companies: MissionCompany[], minimumScore = 70): MissionCompany[] {
    return this.rank(companies.filter((company) => company.leadScore.score >= minimumScore))
  }

  getEstimatedPipeline(companies: MissionCompany[]): number {
    return companies.reduce((total, company) => total + company.websiteAnalysis.estimatedSaleMax, 0)
  }
}

export const leadService = new LeadService()
