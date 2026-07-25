import { CompanyReportLoader } from "@/components/companies/company-report-loader"
import { getCompanyByExternalId } from "@/lib/repositories/mission.repository"

export default async function CompanyReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const company = await getCompanyByExternalId(id)

  return <CompanyReportLoader id={id} initialCompany={company} />
}
