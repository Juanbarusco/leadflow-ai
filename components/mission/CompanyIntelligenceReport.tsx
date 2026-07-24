"use client";

import {
  ArrowLeft,
  BarChart3,
  Bot,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  ExternalLink,
  Globe2,
  Lightbulb,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { MissionCompany } from "@/lib/engines/mission-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CompanyIntelligenceReportProps {
  company: MissionCompany;
}

type ReportArea = {
  id: string;
  label: string;
  icon: typeof Globe2;
  score: number;
  status: string;
  summary: string;
  impact: string;
  problems: string[];
  opportunities: string[];
};

function currency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function scoreTone(score: number) {
  if (score >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function scoreBar(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function priorityLabel(priority: MissionCompany["leadScore"]["priority"]) {
  if (priority === "high") return "Alta";
  if (priority === "medium") return "Média";
  return "Baixa";
}

function closingChance(company: MissionCompany) {
  return Math.min(96, Math.max(35, Math.round((company.leadScore.score + company.leadScore.confidence) / 2)));
}

function buildExecutiveSummary(company: MissionCompany) {
  const strongestGap = company.leadScore.reasons[0] ?? "há espaço relevante para melhorar a presença digital";
  const secondGap = company.leadScore.reasons[1] ?? "a jornada de conversão ainda pode ser otimizada";
  const opportunity = company.websiteAnalysis.recommendedServices[0] ?? "uma estratégia digital orientada à conversão";
  return `${company.name} demonstra capacidade comercial pela reputação de ${company.rating.toFixed(1)} estrelas e ${company.reviews} avaliações, mas ${strongestGap.toLowerCase()} e ${secondGap.toLowerCase()}. A prioridade recomendada é ${opportunity.toLowerCase()}, com potencial estimado entre ${currency(company.websiteAnalysis.estimatedSaleMin)} e ${currency(company.websiteAnalysis.estimatedSaleMax)}.`;
}

function buildAreas(company: MissionCompany): ReportArea[] {
  const website = company.websiteAnalysis;
  const instagram = company.instagramAnalysis;
  const seo = company.seoAnalysis;
  const reputationScore = Math.min(100, Math.round(company.rating * 16 + Math.min(company.reviews, 300) / 8));
  return [
    { id: "website", label: "Website", icon: Globe2, score: website.score, status: website.scoreLabel, summary: website.commercialDiagnosis, impact: website.hasWebsite ? "A estrutura atual gera confiança, mas ainda deixa oportunidades de contato e conversão escaparem." : "Sem um site próprio, a empresa depende de plataformas de terceiros e perde autoridade, dados e controle da conversão.", problems: website.commercialProblems, opportunities: website.recommendedServices },
    { id: "seo", label: "SEO local", icon: Search, score: seo.score, status: seo.scoreLabel, summary: `Posição local estimada: ${seo.estimatedLocalPosition}ª. ${seo.hasLocalPresence ? "Há sinais de presença local consolidada." : "A presença local ainda precisa ser fortalecida."}`, impact: "Baixa visibilidade nas buscas reduz a entrada de clientes com intenção imediata de compra na região.", problems: seo.problems, opportunities: seo.opportunities },
    { id: "instagram", label: "Instagram", icon: Camera, score: instagram.score, status: instagram.scoreLabel, summary: instagram.commercialDiagnosis, impact: instagram.profileFound ? `A última publicação foi há ${instagram.daysSinceLastPost} dias; a irregularidade reduz lembrança de marca, autoridade e geração recorrente de contatos.` : "A ausência de uma presença social profissional elimina um canal importante de prova, relacionamento e descoberta.", problems: instagram.commercialProblems, opportunities: instagram.recommendedServices },
    { id: "google", label: "Reputação local", icon: Star, score: reputationScore, status: reputationScore >= 75 ? "Forte" : reputationScore >= 50 ? "Regular" : "Fraca", summary: `${company.rating.toFixed(1)} estrelas em ${company.reviews} avaliações públicas.`, impact: "Avaliações influenciam diretamente confiança, taxa de clique no Google e decisão de contato.", problems: company.reviews < 50 ? ["Volume de avaliações ainda baixo para dominar a busca local"] : ["Reputação positiva ainda pode ser melhor aproveitada nas páginas de conversão"], opportunities: ["Campanha contínua de avaliações", "Prova social no site", "Respostas estratégicas no Google Business"] },
  ];
}

function AreaSection({ area }: { area: ReportArea }) {
  const Icon = area.icon;
  return (
    <section id={area.id} className="scroll-mt-32 border-t pt-12 sm:pt-16">
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border bg-background p-3"><Icon className="h-5 w-5 text-violet-500" /></div>
            <div><h2 className="text-xl font-semibold">{area.label}</h2><p className="text-sm text-muted-foreground">Diagnóstico comercial</p></div>
          </div>
          <div className="mt-6 flex items-end gap-3"><span className={`text-5xl font-semibold ${scoreTone(area.score)}`}>{area.score}</span><span className="pb-1 text-sm text-muted-foreground">/100 · {area.status}</span></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${scoreBar(area.score)}`} style={{ width: `${area.score}%` }} /></div>
        </div>

        <div className="space-y-6">
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">{area.summary}</p>
          <Card className="rounded-2xl border-amber-500/20 bg-amber-500/5 p-5 shadow-none">
            <div className="flex gap-3"><TrendingUp className="mt-1 h-5 w-5 shrink-0 text-amber-600" /><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">Impacto no negócio</p><p className="mt-2 leading-7">{area.impact}</p></div></div>
          </Card>
          <div className="grid gap-8 md:grid-cols-2">
            <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Problemas prioritários</p><div className="space-y-3">{area.problems.slice(0,3).map((problem) => <div key={problem} className="flex gap-3 text-sm leading-6"><TriangleAlert className="mt-1 h-4 w-4 shrink-0 text-red-500" /><span>{problem}</span></div>)}</div></div>
            <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Oportunidades</p><div className="space-y-3">{area.opportunities.slice(0,3).map((item) => <div key={item} className="flex gap-3 text-sm leading-6"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" /><span>{item}</span></div>)}</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CompanyIntelligenceReport({ company }: CompanyIntelligenceReportProps) {
  const router = useRouter();
  const areas = buildAreas(company);
  const topServices = Array.from(new Set([...company.websiteAnalysis.recommendedServices, ...company.instagramAnalysis.recommendedServices, ...company.seoAnalysis.opportunities])).slice(0,5);

  const openUrl = (url?: string) => url && window.open(url, "_blank", "noopener,noreferrer");
  const copyMessage = async (text: string) => { try { await navigator.clipboard.writeText(text); } catch { window.alert(text); } };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" onClick={() => router.push("/mission")}><ArrowLeft className="mr-2 h-4 w-4" />Missão</Button>
          <div className="h-5 w-px shrink-0 bg-border" />
          {[['summary','Resumo'],['website','Website'],['seo','SEO'],['instagram','Instagram'],['google','Google'],['opportunities','Oportunidades'],['plan','Plano'],['outreach','Abordagem']].map(([id,label]) => <a key={id} href={`#${id}`} className="shrink-0 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{label}</a>)}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="py-10 sm:py-14">
          <div className="rounded-[28px] border border-zinc-800 bg-zinc-950 p-6 text-white shadow-lg sm:p-9">
            <div className="flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <Badge className="border-violet-400/20 bg-violet-400/10 text-violet-200"><Sparkles className="mr-1.5 h-3.5 w-3.5" />Company Intelligence Report</Badge>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">{company.name}</h1>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{company.city}</span><span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{company.rating.toFixed(1)} ({company.reviews})</span><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" />Confiança {company.leadScore.confidence}%</span></div>
                <div className="mt-7 flex flex-wrap gap-2"><Button onClick={() => document.querySelector('#outreach')?.scrollIntoView({ behavior: 'smooth' })}><MessageSquareText className="mr-2 h-4 w-4" />Ver abordagem</Button>{company.website && <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={() => openUrl(company.website)}><Globe2 className="mr-2 h-4 w-4" />Site</Button>}{company.instagramAnalysis.profileUrl && <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={() => openUrl(company.instagramAnalysis.profileUrl)}><Camera className="mr-2 h-4 w-4" />Instagram</Button>}</div>
              </div>
              <div className="grid min-w-[320px] grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-4 lg:grid-cols-2">
                {[
                  ["Lead score", String(company.leadScore.score)],
                  ["Potencial", currency(company.websiteAnalysis.estimatedSaleMax)],
                  ["Chance de fechar", `${closingChance(company)}%`],
                  ["Prioridade", priorityLabel(company.leadScore.priority)],
                ].map(([label, value]) => (
                  <div key={label} className="bg-zinc-950/95 p-5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="summary" className="scroll-mt-32 py-8 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Resumo executivo</p>
              <h2 className="mt-2 text-2xl font-semibold">O que importa primeiro</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Leitura comercial rápida para decidir se vale abordar, o que oferecer e por qual canal começar.</p>
            </div>
            <div className="space-y-5">
              <Card className="rounded-3xl border-violet-500/20 bg-violet-500/5 p-6 shadow-none sm:p-8">
                <div className="flex gap-4"><Bot className="mt-1 h-6 w-6 shrink-0 text-violet-500" /><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Recomendação da IA</p><p className="mt-3 text-lg leading-8">{buildExecutiveSummary(company)}</p></div></div>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="rounded-3xl p-6 shadow-none">
                  <div className="flex items-center gap-3"><Target className="h-5 w-5 text-violet-500" /><p className="font-semibold">Estratégia de venda</p></div>
                  <div className="mt-5 space-y-4 text-sm">
                    {[
                      ["Dor principal", company.leadScore.reasons[0] ?? "Conversão digital abaixo do potencial"],
                      ["Oferta de entrada", topServices[0] ?? "Diagnóstico e otimização digital"],
                      ["Melhor canal", company.instagramAnalysis.profileFound ? "Instagram + WhatsApp" : "Ligação + WhatsApp"],
                      ["Ticket sugerido", `${currency(company.websiteAnalysis.estimatedSaleMin)} – ${currency(company.websiteAnalysis.estimatedSaleMax)}`],
                    ].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-5 border-b pb-3 last:border-0 last:pb-0"><span className="text-muted-foreground">{label}</span><span className="max-w-[60%] text-right font-medium">{value}</span></div>)}
                  </div>
                </Card>
                <Card className="rounded-3xl p-6 shadow-none">
                  <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-emerald-500" /><p className="font-semibold">Sinais detectados</p></div>
                  <div className="mt-5 space-y-3">
                    {[
                      company.websiteAnalysis.hasWebsite ? "Website encontrado e analisado" : "Website inexistente: oportunidade imediata",
                      company.instagramAnalysis.profileFound ? "Instagram disponível para abordagem" : "Presença social ausente",
                      company.rating >= 4.5 ? "Reputação local forte" : "Reputação com espaço para evolução",
                      `${company.leadScore.confidence}% de confiança na qualificação`,
                    ].map((signal) => <div key={signal} className="flex gap-3 text-sm leading-6"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" /><span>{signal}</span></div>)}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {areas.map((area) => <AreaSection key={area.id} area={area} />)}

        <section id="opportunities" className="scroll-mt-32 border-t pt-12 sm:pt-16">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14"><div><CircleDollarSign className="h-6 w-6 text-emerald-600" /><h2 className="mt-4 text-2xl font-semibold">Oportunidades</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Ordem sugerida para iniciar a conversa comercial.</p></div><div className="space-y-3">{topServices.map((service,index) => <Card key={service} className="flex items-center gap-4 rounded-2xl p-5 shadow-none"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-foreground font-semibold text-background">{index+1}</div><div><p className="font-medium">{service}</p><p className="mt-1 text-sm text-muted-foreground">{index===0 ? 'Maior impacto e melhor abertura comercial' : 'Complementa a solução principal'}</p></div></Card>)}</div></div>
        </section>

        <section id="plan" className="scroll-mt-32 border-t pt-12 sm:pt-16">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
            <div><BarChart3 className="h-6 w-6 text-sky-600" /><h2 className="mt-4 text-2xl font-semibold">Plano comercial</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Do primeiro contato até a entrega e expansão da conta.</p></div>
            <div className="space-y-5">
              <Card className="rounded-3xl p-6 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Cadência de fechamento</p>
                <div className="mt-6 grid gap-3 md:grid-cols-4">
                  {[
                    ["Hoje", "Contato inicial", "Abrir com o diagnóstico principal"],
                    ["D+2", "Prova de valor", "Enviar insight e oportunidade"],
                    ["D+5", "Reunião", "Apresentar solução e escopo"],
                    ["D+8", "Follow-up", "Tratar objeções e fechar"],
                  ].map(([period, title, description], index) => <div key={period} className="relative rounded-2xl border bg-muted/15 p-4"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">{period}</span>{index < 3 ? <ChevronRight className="hidden h-4 w-4 text-muted-foreground md:block" /> : null}</div><p className="mt-3 font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></div>)}
                </div>
              </Card>
              <div className="grid gap-4 md:grid-cols-3">{[["30 dias","Correções críticas","Estruturar conversão, WhatsApp e presença local."],["60 dias","Aquisição e conteúdo","Publicar conteúdo recorrente e fortalecer SEO local."],["90 dias","Escala comercial","Otimizar campanhas, métricas e follow-up."]].map(([period,title,description]) => <Card key={period} className="rounded-2xl p-5 shadow-none"><Clock3 className="h-5 w-5 text-violet-500" /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">{period}</p><p className="mt-2 font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></Card>)}</div>
            </div>
          </div>
        </section>

        <section id="outreach" className="scroll-mt-32 border-t pt-12 sm:pt-16">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14"><div><Target className="h-6 w-6 text-violet-600" /><h2 className="mt-4 text-2xl font-semibold">Kit comercial</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Materiais prontos para iniciar a abordagem.</p></div><div className="grid gap-4 lg:grid-cols-3"><Card className="rounded-2xl p-5 shadow-none"><MessageSquareText className="h-5 w-5 text-emerald-600" /><h3 className="mt-4 font-semibold">WhatsApp</h3><p className="mt-3 line-clamp-5 text-sm leading-6 text-muted-foreground">{company.outreach.message}</p><Button className="mt-5 w-full" variant="outline" onClick={() => copyMessage(company.outreach.message)}><Copy className="mr-2 h-4 w-4" />Copiar</Button></Card><Card className="rounded-2xl p-5 shadow-none"><ExternalLink className="h-5 w-5 text-sky-600" /><h3 className="mt-4 font-semibold">E-mail</h3><p className="mt-3 text-sm font-medium">{company.outreach.subject}</p><p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">{company.outreach.message}</p><Button className="mt-5 w-full" variant="outline" onClick={() => copyMessage(`Assunto: ${company.outreach.subject}\n\n${company.outreach.message}`)}><Copy className="mr-2 h-4 w-4" />Copiar</Button></Card><Card className="rounded-2xl p-5 shadow-none"><Phone className="h-5 w-5 text-violet-600" /><h3 className="mt-4 font-semibold">Ligação</h3><p className="mt-3 line-clamp-5 text-sm leading-6 text-muted-foreground">{company.outreach.callOpening}</p><Button className="mt-5 w-full" variant="outline" onClick={() => copyMessage(company.outreach.callOpening)}><Copy className="mr-2 h-4 w-4" />Copiar</Button></Card></div></div>
        </section>

        <Card className="mt-16 rounded-3xl border-zinc-800 bg-zinc-950 p-7 text-white shadow-none"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-4"><Lightbulb className="mt-1 h-6 w-6 text-amber-300" /><div><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Recomendação final</p><h2 className="mt-2 text-xl font-semibold">Comece oferecendo {topServices[0]?.toLowerCase() ?? 'uma solução orientada à conversão'}.</h2></div></div><Button onClick={() => document.querySelector('#outreach')?.scrollIntoView({ behavior: 'smooth' })}>Abrir kit comercial</Button></div></Card>
      </main>
    </div>
  );
}
