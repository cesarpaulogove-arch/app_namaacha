
"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  Receipt,
  Search,
  XCircle,
} from "lucide-react";

type Estado = "Concluído" | "Pendente" | "Em análise";

type Registo = {
  id: string;
  titulo: string;
  categoria: string;
  referencia: string;
  data: string;
  valor?: number;
  estado: Estado;
};

const historicoInicial: Registo[] = [
  {
    id: "1",
    titulo: "Pagamento de taxa municipal",
    categoria: "Pagamento",
    referencia: "PAG-2026-001",
    data: "2026-10-12",
    valor: 850,
    estado: "Concluído",
  },
  {
    id: "2",
    titulo: "Pedido de licença de funcionamento",
    categoria: "Licença",
    referencia: "LIC-2026-014",
    data: "2026-10-10",
    estado: "Em análise",
  },
  {
    id: "3",
    titulo: "Consulta de imposto predial",
    categoria: "Impostos",
    referencia: "IMP-2026-008",
    data: "2026-10-08",
    estado: "Concluído",
  },
  {
    id: "4",
    titulo: "Pedido de autorização de banca",
    categoria: "Mercados",
    referencia: "MER-2026-004",
    data: "2026-10-05",
    estado: "Pendente",
  },
];

const filtros = ["Todos", "Pagamentos", "Impostos", "Licenças", "Mercados"];

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${data}T12:00:00`));
}

function formatarValor(valor?: number) {
  if (valor === undefined) return null;

  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 2,
  }).format(valor);
}

function IconeCategoria({ categoria }: { categoria: string }) {
  if (categoria === "Pagamento") return <Receipt size={20} />;
  if (categoria === "Impostos") return <FileText size={20} />;
  return <History size={20} />;
}

function IconeEstado({ estado }: { estado: Estado }) {
  if (estado === "Concluído") return <CheckCircle2 size={16} />;
  if (estado === "Pendente") return <Clock3 size={16} />;
  return <Clock3 size={16} />;
}

export default function HistoricoPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [registoSelecionado, setRegistoSelecionado] =
    useState<Registo | null>(null);

  const historico = useMemo(() => {
    return historicoInicial.filter((registo) => {
      const correspondePesquisa = [
        registo.titulo,
        registo.categoria,
        registo.referencia,
        registo.estado,
      ]
        .join(" ")
        .toLowerCase()
        .includes(pesquisa.toLowerCase());

      const correspondeFiltro =
        filtro === "Todos" ||
        registo.categoria.toLowerCase() ===
          filtro.replace(/s$/, "").toLowerCase() ||
        (filtro === "Pagamentos" && registo.categoria === "Pagamento");

      return correspondePesquisa && correspondeFiltro;
    });
  }, [pesquisa, filtro]);

  const totalConcluidos = historicoInicial.filter(
    (registo) => registo.estado === "Concluído",
  ).length;

  const totalPendentes = historicoInicial.filter(
    (registo) => registo.estado !== "Concluído",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <History size={25} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Histórico</h1>

          <p className="mt-1 text-sm text-slate-500">
            Consulte os seus pagamentos, pedidos e actividades municipais.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 size={17} className="text-emerald-600" />
              Concluídos
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totalConcluidos}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock3 size={17} className="text-amber-600" />
              Em aberto
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totalPendentes}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <Search size={19} className="shrink-0 text-slate-400" />
            <input
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar no histórico..."
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            {pesquisa && (
              <button
                type="button"
                onClick={() => setPesquisa("")}
                aria-label="Limpar pesquisa"
                className="text-slate-400 hover:text-slate-700"
              >
                <XCircle size={18} />
              </button>
            )}
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filtros.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFiltro(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  filtro === item
                    ? "bg-emerald-800 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              Actividades recentes
            </h2>
            <span className="text-xs text-slate-500">
              {historico.length} registo(s)
            </span>
          </div>

          {historico.length > 0 ? (
            <div className="space-y-3">
              {historico.map((registo) => (
                <button
                  key={registo.id}
                  type="button"
                  onClick={() => setRegistoSelecionado(registo)}
                  className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                      <IconeCategoria categoria={registo.categoria} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {registo.titulo}
                        </h3>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                            registo.estado === "Concluído"
                              ? "bg-emerald-50 text-emerald-700"
                              : registo.estado === "Pendente"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          <IconeEstado estado={registo.estado} />
                          {registo.estado}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Ref.: {registo.referencia}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <CalendarDays size={14} />
                          {formatarData(registo.data)}
                        </span>

                        {registo.valor !== undefined && (
                          <span className="text-sm font-semibold text-slate-800">
                            {formatarValor(registo.valor)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <History
                size={32}
                className="mx-auto text-slate-300"
              />
              <p className="mt-3 font-medium text-slate-700">
                Nenhum registo encontrado
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Experimente outra pesquisa ou seleccione um filtro diferente.
              </p>
            </div>
          )}
        </section>

        <p className="text-center text-xs leading-5 text-slate-400">
          Os registos apresentados são demonstrativos. O histórico oficial
          deverá ser ligado ao sistema municipal.
        </p>
      </div>

      {registoSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4"
          onClick={() => setRegistoSelecionado(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="historico-detalhe-titulo"
            className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Detalhes do registo
                </p>
                <h2
                  id="historico-detalhe-titulo"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {registoSelecionado.titulo}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setRegistoSelecionado(null)}
                aria-label="Fechar detalhes"
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                <span className="text-slate-500">Referência</span>
                <span className="text-right font-medium text-slate-800">
                  {registoSelecionado.referencia}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                <span className="text-slate-500">Categoria</span>
                <span className="font-medium text-slate-800">
                  {registoSelecionado.categoria}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                <span className="text-slate-500">Data</span>
                <span className="font-medium text-slate-800">
                  {formatarData(registoSelecionado.data)}
                </span>
              </div>

              {registoSelecionado.valor !== undefined && (
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
                  <span className="text-slate-500">Valor</span>
                  <span className="font-semibold text-slate-900">
                    {formatarValor(registoSelecionado.valor)}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Estado</span>
                <span className="font-semibold text-slate-800">
                  {registoSelecionado.estado}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRegistoSelecionado(null)}
              className="mt-6 w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Fechar
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
