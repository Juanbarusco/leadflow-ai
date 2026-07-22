"use client";

import {
  ArrowUpRight,
  Building2,
  Clock3,
  Globe2,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MissionCompany = Mission["companies"][number];

type CompanyFooterProps = {
  company: MissionCompany;
  onOpenMaps?: (company: MissionCompany) => void;
};

export function CompanyFooter({
  company,
  onOpenMaps,
}: CompanyFooterProps) {
  return (
    <footer className="border-t bg-muted/20 p-5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">Empresa</p>

              <p className="text-sm font-medium">{company.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">Cidade</p>

              <p className="text-sm font-medium">{company.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Star className="h-4 w-4 text-amber-500" />

            <div>
              <p className="text-xs text-muted-foreground">Google</p>

              <p className="text-sm font-medium">
                {company.rating.toFixed(1)} ★ ({company.reviews})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock3 className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">Status</p>

              <Badge variant="secondary">
                Missão concluída
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
              >
                <Globe2 className="mr-2 h-4 w-4" />
                Website
              </Button>
            </a>
          )}

          {company.phone && (
            <a href={`tel:${company.phone}`}>
              <Button
                variant="outline"
                size="sm"
              >
                <Phone className="mr-2 h-4 w-4" />
                Ligar
              </Button>
            </a>
          )}

          <Button
            size="sm"
            onClick={() => onOpenMaps?.(company)}
          >
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Abrir no Maps
          </Button>
        </div>
      </div>
    </footer>
  );
}