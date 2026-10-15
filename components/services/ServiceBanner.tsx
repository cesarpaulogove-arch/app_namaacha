
import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";

export function ServiceBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 px-5 py-7 text-white sm:px-8 sm:py-9">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border-[24px] border-white/5" />

      <div className="relative max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50">
          <Landmark size={15} />
          Município da Namaacha
        </div>

        <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
          Serviços municipais num só lugar
        </h2>

        <p className="mt-3 max-w-lg text-sm leading-6 text-emerald-50 sm:text-base">
          Consulte os serviços disponíveis, acompanhe os seus pedidos
          e encontre os canais de atendimento de forma simples.
        </p>

        <Link
          href="/processos"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50"
        >
          Acompanhar processos
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
