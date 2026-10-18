
"use client";

import { useState } from "react";
import { municipalServices } from "@/data/services";
import { ServiceCard } from "./ServiceCard";

type ViewMode = "grid" | "list";

export function ServiceList() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Todos os serviços
          </h2>

          <p className="mt-1 text-sm text-muted">
            Consulte os serviços municipais disponíveis.
          </p>
        </div>

        <span className="text-sm text-muted">
          {municipalServices.length} serviços
        </span>
      </div>

      <div className="flex justify-end">
        <div
          className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-white p-1"
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

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
            : "flex flex-col gap-3"
        }
      >
        {municipalServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            variant={viewMode}
          />
        ))}
      </div>
    </section>
  );
}
