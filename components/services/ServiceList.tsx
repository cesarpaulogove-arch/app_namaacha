
"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";

import { municipalServices } from "@/data/services";
import { ServiceCard } from "./ServiceCard";

type ViewMode = "grid" | "list";

export function ServiceList() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredServices = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt");

    return municipalServices.filter((service) =>
      [service.title, service.description].some((value) =>
        value.toLocaleLowerCase("pt").includes(term)
      )
    );
  }, [search]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Todos os serviços
          </h2>

          <p className="mt-1 text-sm text-muted">
            Encontre rapidamente o serviço municipal pretendido.
          </p>
        </div>

        <span className="text-sm text-muted">
          {filteredServices.length} serviços
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted"
          >
            ⌕
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar serviços..."
            aria-label="Pesquisar serviços municipais"
            className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <div
          className="flex shrink-0 items-center gap-1 self-end rounded-xl border border-border bg-white p-1 sm:self-auto"
          aria-label="Modo de apresentação"
        >
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Ver serviços em grelha"
            aria-pressed={viewMode === "grid"}
            className={`grid size-9 place-items-center rounded-lg ${
              viewMode === "grid"
                ? "bg-primary text-white"
                : "text-muted hover:bg-slate-50"
            }`}
          >
            <span aria-hidden="true">▦</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="Ver serviços em lista"
            aria-pressed={viewMode === "list"}
            className={`grid size-9 place-items-center rounded-lg ${
              viewMode === "list"
                ? "bg-primary text-white"
                : "text-muted hover:bg-slate-50"
            }`}
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
              : "flex flex-col gap-3"
          }
        >
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              variant={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-border bg-white px-5 py-10 text-center">
          <p aria-hidden="true" className="text-3xl text-muted">
            ⌕
          </p>

          <h3 className="mt-3 font-bold text-foreground">
            Nenhum serviço encontrado
          </h3>

          <p className="mt-1 text-sm text-muted">
            Tente pesquisar por outro nome.
          </p>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Limpar pesquisa
          </button>
        </div>
      )}
    </section>
  );
}
