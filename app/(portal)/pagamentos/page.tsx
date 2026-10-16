
"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  History,
  Search,
  ShieldCheck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

type EstadoPagamento = "Pago" | "Pendente" | "Falhado";

type Pagamento = {
  id: string;
  referencia: string;
  servico: string;
  descricao: string;
  valor: number;
  data: string;
  estado: EstadoPagamento;
  metodo: string;
};

const pagamentosExemplo: Pagamento[] = [
  {
    id: "1",
    referencia: "PAY-2026-001",
    servico: "Imposto Predial",
    descricao: "Pagamento demonstrativo de imposto predial",
    valor: 850,
    data: "2026-10-12",
    estado: "Pago",
    metodo: "Carteira móvel",
  },
  {
    id: "2",
    referencia: "PAY-2026-002",
    servico: "Taxa de Mercado",
    descricao: "Taxa de ocupação de banca",
    valor: 350,
    data: "2026-10-10",
    estado: "Pendente",
    metodo: "Não definido",
  },
  {
    id: "3",
    referencia: "PAY-2026-003",
    servico: "Licença de Funcionamento",
    descricao: "Taxa associada à licença",
    valor: 1200,
    data: "2026-10-08",
    estado: "Falhado",
    metodo: "Carteira móvel",
  },
];

const opcoesFiltro = ["Todos", "Pago", "Pendente", "Falhado"];

function moeda(valor: number) {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 2,
  }).format(valor);
}

function dataLegivel(data: string) {
  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${data}T12:00:00`));
}

function EstadoBadge({ estado }: { estado: EstadoPagamento }) {
  const estilos = {
    Pago: "bg-emerald-50 text-emerald-700",
    Pendente: "bg-amber-50 text-amber-700",
    Falhado: "bg-red-50 text-red-700",
  };

  const Icone =
    estado === "Pago"
      ? CheckCircle2
      : estado === "Pendente"
        ? Clock3
        : XCircle;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${estilos[estado]}`}
    >
      <Icone size={14} />
      {estado}
    </span>
  );
}

export default function PagamentosPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [selecionado, setSelecionado] = useState<Pagamento | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [servico, setServico] = useState("Imposto Predial");
  const [referencia, setReferencia] = useState("");
  const [mensagem, setMensagem] = useState("");

  const pagamentos = useMemo(() => {
    return pagamentosExemplo.filter((pagamento) => {
      const correspondePesquisa = [
        pagamento.referencia,
        pagamento.servico,
        pagamento.descricao,
        pagamento.estado,
      ]
        .join(" ")
        .toLowerCase()
        .includes(pesquisa.toLowerCase());

      const correspondeFiltro =
        filtro === "Todos" || pagamento.estado === filtro;

      return correspondePesquisa && correspondeFiltro;
    });
  }, [pesquisa, filtro]);

  const totalPago = pagamentosExemplo
    .filter((pagamento) => pagamento.estado === "Pago")
    .reduce((total, pagamento) => total + pagamento.valor, 0);

  const totalPendente = pagamentosExemplo
    .filter((pagamento) => pagamento.estado === "Pendente")
    .reduce((total, pagamento) => total + pagamento.valor, 0);

  function consultarPagamento(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem(
      "Consulta preparada. Para verificar pagamentos reais, é necessário integrar o sistema municipal.",
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <Wallet size={25} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Pagamentos</h1>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Consulte as suas taxas municipais e acompanhe o estado dos
            pagamentos.
          </p>
        </header>

        <section className="rounded-2xl bg-emerald-900 p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 text-sm text-emerald-100">
            <Wallet size={18} />
            Total de pagamentos concluídos
          </div>

          <p className="mt-2 text-3xl font-bold">{moeda(totalPago)}</p>

          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
            <div>
              <p className="text-xs text-emerald-100">Por regularizar</p>
              <p className="mt-1 font-semibold">{moeda(totalPendente)}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <CreditCard size={23} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setMostrarFormulario(true);
              setMensagem("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-3 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
          >
            <CreditCard size={18} />
            Consultar pagamento
          </button>

          <button
            type="button"
            onClick={() => {
              setFiltro("Todos");
              setPesquisa("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <History size={18} />
            Ver histórico
          </button>
        </section>

        <section className="space-y-3">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <Search size={19} className="shrink-0 text-slate-400" />
            <input
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar por serviço ou referência..."
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            {pesquisa && (
              <button
                type="button"
                onClick={() => setPesquisa("")}
                aria-label="Limpar pesquisa"
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            )}
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {opcoesFiltro.map((opcao) => (
              <button
                key={opcao}
                type="button"
                onClick={() => setFiltro(opcao)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  filtro === opcao
                    ? "bg-emerald-800 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {opcao}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              Registos de pagamentos
            </h2>
            <span className="text-xs text-slate-500">
              {pagamentos.length} registo(s)
            </span>
          </div>

          {pagamentos.length > 0 ? (
            <div className="space-y-3">
              {pagamentos.map((pagamento) => (
                <button
                  key={pagamento.id}
                  type="button"
                  onClick={() => setSelecionado(pagamento)}
                  className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                      <FileText size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {pagamento.servico}
                        </h3>
                        <EstadoBadge estado={pagamento.estado} />
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Ref.: {pagamento.referencia}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">
                          {dataLegivel(pagamento.data)}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {moeda(pagamento.valor)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-end gap-1 text-xs font-medium text-emerald-800">
                        Ver detalhes
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <History size={32} className="mx-auto text-slate-300" />
              <p className="mt-3 font-medium text-slate-700">
                Nenhum pagamento encontrado
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Experimente alterar a pesquisa ou o filtro.
              </p>
            </div>
          )}
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-blue-700"
          />
          <p className="text-xs leading-5 text-blue-800">
            Por segurança, confirme sempre a referência e o valor antes de
            efectuar qualquer pagamento. Os registos desta página são
            demonstrativos e não comprovam pagamentos reais.
          </p>
        </div>
      </div>

      {mostrarFormulario && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4"
          onClick={() => setMostrarFormulario(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultar-pagamento-titulo"
            className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2
                  id="consultar-pagamento-titulo"
                  className="text-xl font-bold text-slate-900"
                >
                  Consultar pagamento
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Introduza os dados para preparar a consulta.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                aria-label="Fechar formulário"
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={consultarPagamento} className="space-y-4">
              <div>
                <label
                  htmlFor="servico"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Serviço municipal
                </label>
                <select
                  id="servico"
                  value={servico}
                  onChange={(event) => setServico(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600"
                >
                  <option>Imposto Predial</option>
                  <option>Taxa de Mercado</option>
                  <option>Licença de Funcionamento</option>
                  <option>Taxa de Saneamento</option>
                  <option>Imposto sobre Veículos</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="referencia"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Referência do pagamento
                </label>
                <input
                  id="referencia"
                  value={referencia}
                  onChange={(event) => setReferencia(event.target.value)}
                  placeholder="Ex.: PAY-2026-001"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              {mensagem && (
                <p
                  role="status"
                  className="rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-800"
                >
                  {mensagem}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900"
              >
                Consultar
              </button>
            </form>
          </section>
        </div>
      )}

      {selecionado && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4"
          onClick={() => setSelecionado(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="pagamento-detalhe-titulo"
            className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Detalhes da transacção
                </p>
                <h2
                  id="pagamento-detalhe-titulo"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {selecionado.servico}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelecionado(null)}
                aria-label="Fechar detalhes"
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">Valor</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {moeda(selecionado.valor)}
              </p>
              <div className="mt-3">
                <EstadoBadge estado={selecionado.estado} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Referência</span>
                <span className="text-right font-medium text-slate-800">
                  {selecionado.referencia}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Data</span>
                <span className="font-medium text-slate-800">
                  {dataLegivel(selecionado.data)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Método</span>
                <span className="text-right font-medium text-slate-800">
                  {selecionado.metodo}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
                {selecionado.descricao}
              </div>
            </div>

            {selecionado.estado === "Pago" && (
              <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                Este é um registo demonstrativo. O comprovativo oficial só
                poderá ser disponibilizado após integração com o sistema
                municipal de pagamentos.
              </p>
            )}

            <button
              type="button"
              onClick={() => setSelecionado(null)}
              className="mt-6 w-full rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900"
            >
              Fechar
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
