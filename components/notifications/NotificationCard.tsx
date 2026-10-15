
"use client";

import Link from "next/link";
import {
  Bell,
  FileText,
  CreditCard,
  FileCheck,
  Building2,
  Settings,
  Check,
  ChevronRight,
  Circle,
} from "lucide-react";

import type { Notificacao } from "@/types/notification";

type Props = {
  notificacao: Notificacao;
  onAlternarLeitura: (id: string) => void;
};

const estilos = {
  processo: {
    Icon: FileText,
    cor: "bg-blue-50 text-blue-700",
    etiqueta: "Processos",
  },
  pagamento: {
    Icon: CreditCard,
    cor: "bg-amber-50 text-amber-700",
    etiqueta: "Pagamentos",
  },
  licenca: {
    Icon: FileCheck,
    cor: "bg-violet-50 text-violet-700",
    etiqueta: "Licenças",
  },
  municipal: {
    Icon: Building2,
    cor: "bg-emerald-50 text-emerald-700",
    etiqueta: "Avisos municipais",
  },
  sistema: {
    Icon: Settings,
    cor: "bg-slate-100 text-slate-700",
    etiqueta: "Sistema",
  },
};

function formatarData(data: string) {
  const dataNotificacao = new Date(data);

  if (Number.isNaN(dataNotificacao.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Maputo",
  }).format(dataNotificacao);
}

export function NotificationCard({
  notificacao,
  onAlternarLeitura,
}: Props) {
  const estilo = estilos[notificacao.tipo];
  const Icon = estilo.Icon;

  return (
    <article
      className={`rounded-2xl border p-4 transition sm:p-5 ${
        notificacao.lida
          ? "border-slate-100 bg-white"
          : "border-emerald-100 bg-emerald-50/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${estilo.cor}`}
        >
          <Icon size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              {estilo.etiqueta}
            </span>

            {!notificacao.lida && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                NOVA
              </span>
            )}
          </div>

          <h3 className="mt-1 text-sm font-bold text-slate-900">
            {notificacao.titulo}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {notificacao.mensagem}
          </p>

          <p className="mt-3 text-xs text-slate-400">
            {formatarData(notificacao.data)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        {notificacao.link ? (
          <Link
            href={notificacao.link}
            onClick={() => {
              if (!notificacao.lida) {
                onAlternarLeitura(notificacao.id);
              }
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Consultar detalhes
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={() => onAlternarLeitura(notificacao.id)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
          aria-label={
            notificacao.lida
              ? "Marcar como não lida"
              : "Marcar como lida"
          }
        >
          {notificacao.lida ? (
            <>
              <Circle size={15} />
              Não lida
            </>
          ) : (
            <>
              <Check size={16} />
              Marcar como lida
            </>
          )}
        </button>
      </div>
    </article>
  );
}
