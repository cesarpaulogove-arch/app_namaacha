
"use client";

export type FiltroNotificacao = "todas" | "nao-lidas" | "lidas";

type Props = {
  filtro: FiltroNotificacao;
  onChange: (filtro: FiltroNotificacao) => void;
  totalTodas: number;
  totalNaoLidas: number;
  totalLidas: number;
};

export function NotificationFilters({
  filtro,
  onChange,
  totalTodas,
  totalNaoLidas,
  totalLidas,
}: Props) {
  const filtros: {
    id: FiltroNotificacao;
    titulo: string;
    total: number;
  }[] = [
    { id: "todas", titulo: "Todas", total: totalTodas },
    {
      id: "nao-lidas",
      titulo: "Não lidas",
      total: totalNaoLidas,
    },
    { id: "lidas", titulo: "Lidas", total: totalLidas },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {filtros.map((item) => {
        const ativo = filtro === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={ativo}
            className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${
              ativo
                ? "border-emerald-800 bg-emerald-800 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item.titulo}

            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                ativo
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.total}
            </span>
          </button>
        );
      })}
    </div>
  );
}
