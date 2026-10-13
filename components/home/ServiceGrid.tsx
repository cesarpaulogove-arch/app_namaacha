
import Link from "next/link";
import { municipalServices } from "@/data/services";
import { ServiceCard } from "@/components/services/ServiceCard";

export function ServiceGrid() {
  return (
    <section className="w-full min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            Serviços em destaque
          </h2>

          <p className="mt-1 text-xs text-muted sm:text-sm">
            O município mais perto de si
          </p>
        </div>

        <Link
          href="/servicos"
          className="shrink-0 rounded-md text-xs font-bold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:text-sm"
        >
          Ver todos
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {municipalServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            variant="grid"
          />
        ))}
      </div>
    </section>
  );
}

