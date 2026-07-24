"use client";

import { use, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { CompanyIntelligenceReport } from "@/components/mission/CompanyIntelligenceReport";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MissionCompany } from "@/lib/engines/mission-engine";

const storageListeners = new Set<() => void>();
const emptySubscribe = () => () => undefined;

function subscribeToCompanyStorage(listener: () => void) {
  storageListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    storageListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getStoredCompany(id: string) {
  return window.sessionStorage.getItem(`leadflow-company:${id}`);
}

export default function CompanyReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const storedCompany = useSyncExternalStore(
    subscribeToCompanyStorage,
    () => getStoredCompany(id),
    () => null,
  );

  const company = useMemo(() => {
    if (!storedCompany) return null;
    try {
      return JSON.parse(storedCompany) as MissionCompany;
    } catch {
      return null;
    }
  }, [storedCompany]);

  if (!hydrated) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <LoaderCircle className="h-7 w-7 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-xl py-20">
        <Card className="rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-semibold">Relatório não encontrado</h1>
          <p className="mt-3 text-muted-foreground">
            Volte para a missão e abra novamente a empresa. Os dados do relatório são mantidos nesta sessão.
          </p>
          <Link href="/mission" className={buttonVariants({ className: "mt-6" })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para missão
          </Link>
        </Card>
      </div>
    );
  }

  return <CompanyIntelligenceReport company={company} />;
}
