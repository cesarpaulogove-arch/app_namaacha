
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  FileText,
  Search,
  CreditCard,
  ReceiptText,
  Clock,
  ShieldCheck,
  CircleDollarSign,
  X,
} from "lucide-react";

type EstadoMulta = "Pendente" | "Paga" | "Em reclamação";

type Multa = {
  id: string;
  referencia: string;
  tipo: string;
  descricao: string;
  data: string;
  valor: number;
  estado: EstadoMulta;
  entidade: string;
};

type ServicoMulta = {
  id: string;
  titulo: string;
  descricao: string;
  detalhe: string;
  passos: string[];
  icon: typeof AlertTriangle;
  cor: string;
  fundo: string;
};

const multasIniciais: Multa[] = [
  {
    id: "1",
    referencia: "DEMO-2026-001",
    tipo: "Trânsito",
    descricao: "Infração de trânsito demonstrativa",
    data: "10/09/2026",
    valor: 1500,
    estado: "Pendente",
    entidade: "Serviços de fiscalização",
  },
  {
    id: "2",
    referencia: "DEMO-2026-002",
    tipo: "Postura municipal",
    descricao: "Infração de postura municipal demonstrativa",
    data: "22/08/2026",
    valor: 800,
    estado: "Paga",
    entidade: "Fiscalização municipal",
  },
  {
    id: "3",
    referencia: "DEMO-2026-003",
    tipo: "Actividade económica",
    descricao: "Pendência administrativa demonstrativa",
    data: "05/08/2026",
    valor: 2500,
    estado: "Em reclamação",
    entidade: "Fiscalização municipal",
  },
];

const servicos: ServicoMulta[] = [
  {
    id: "consultar",
    titulo: "Consultar Multas",
    descricao: "Verifique multas e pendências",
    detalhe:
      "Consulte os registos de multas associados ao seu perfil. Os dados de demonstração não representam notificações oficiais.",
    passos: [
      "Consulte a referência da multa.",
      "Verifique a descrição e a data registada.",
      "Confirme o valor e o estado do processo.",
      "Contacte a entidade responsável caso existam divergências.",
    ],
    icon: Search,
    cor: "text-rose-700",
    fundo: "bg-rose-50",
  },
  {
    id: "referencia",
    titulo: "Emitir Referência",
    descricao: "Prepare os dados para pagamento",
    detalhe:
      "Consulte os dados necessários para solicitar uma referência oficial de pagamento à entidade responsável.",
    passos: [
      "Seleccione a multa que pretende regularizar.",
      "Confirme a referência e o valor junto da entidade emissora.",
      "Solicite a emissão da referência oficial.",
      "Pague apenas pelos canais oficialmente autorizados.",
    ],
    icon: ReceiptText,
    cor: "text-amber-700",
    fundo: "bg-amber-50",
  },
  {
    id: "historico",
    titulo: "Histórico de Pagamentos",
    descricao: "Consulte os pagamentos registados",
    detalhe:
      "Consulte os registos demonstrativos de multas pagas e acompanhe a situação dos respectivos processos.",
    passos: [
      "Consulte os registos de pagamentos.",
      "Verifique a referência associada.",
      "Confirme a data e o valor do pagamento.",
      "Guarde o comprovativo oficial para futuras consultas.",
    ],
    icon: ClipboardList,
    cor: "text-violet-700",
    fundo: "bg-violet-50",
  },
  {
    id: "reclamacao",
    titulo: "Reclamar uma Multa",
    descricao: "Solicite a revisão de uma ocorrência",
    detalhe:
      "Prepare os dados de uma reclamação para apreciação pela entidade competente, seguindo os procedimentos e prazos aplicáveis.",
    passos: [
      "Identifique a multa ou a notificação.",
      "Descreva os motivos da reclamação.",
      "Reúna os documentos comprovativos necessários.",
      "Submeta a reclamação através do canal oficial competente.",
    ],
    icon: FileText,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
  },
];

function formatarValor(valor: number) {
  return new Intl.NumberFormat("pt-MZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor) + " MT";
}

function corEstado(estado: EstadoMulta) {
  switch (estado) {
    case "Paga":
      return "bg-emerald-100 text-emerald-800";
    case "Em reclamação":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-rose-100 text-rose-800";
  }
}

export default function MultasPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const [seleccionado, setSeleccionado] =
    useState<ServicoMulta | null>(null);
  const [multaSeleccionada, setMultaSeleccionada] =
    useState<Multa | null>(null);
  const [mostrarReclamacao, setMostrarReclamacao] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [multas] = useState<Multa[]>(multasIniciais);

  const multasFiltradas = multas.filter((multa) => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt");

    const correspondePesquisa =
      multa.referencia.toLocaleLowerCase("pt").includes(termo) ||
      multa.tipo.toLocaleLowerCase("pt").includes(termo) ||
      multa.descricao.toLocaleLowerCase("pt").includes(termo);

    const correspondeEstado =
      filtro === "Todas" || multa.estado === filtro;

    return correspondePesquisa && correspondeEstado;
  });

  const totalPendente = multas
    .filter((multa) => multa.estado === "Pendente")
    .reduce((total, multa) => total + multa.valor, 0);

  const totalPago = multas
    .filter((multa) => multa.estado === "Paga")
    .reduce((total, multa) => total + multa.valor, 0);

  const quantidadePendente = multas.filter(
    (multa) => multa.estado === "Pendente"
  ).length;

  function voltar() {
    if (mostrarReclamacao) {
      setMostrarReclamacao(false);
      setMensagem("");
    } else if (multaSeleccionada) {
      setMultaSeleccionada(null);
      setMensagem("");
    } else if (seleccionado) {
      setSeleccionado(null);
      setMensagem("");
    } else {
      window.history.back();
    }
  }

  function abrirServico(servico: ServicoMulta) {
    setSeleccionado(servico);
    setMultaSeleccionada(null);
    setMensagem("");
    setMostrarReclamacao(false);
  }

  function abrirReclamacao(multa: Multa) {
    setMultaSeleccionada(multa);
    setMotivo("");
    setMensagem("");
    setMostrarReclamacao(true);
  }

  function validarReclamacao(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!motivo.trim()) {
      setMensagem("Descreva os motivos da reclamação.");
      return;
    }

    setMensagem(
      "Os dados da reclamação foram validados localmente. A reclamação ainda não foi submetida oficialmente. É necessária a integração com o sistema da entidade responsável."
    );
  }

  const campo =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={voltar}
            aria-label="Voltar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft size={21} />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-lg font-bold text-slate-900">
              Multas
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Município de Namaacha
            </p>
          </div>

          <div className="h-10 w-10 shrink-0" />
        </header>

        {mostrarReclamacao && multaSeleccionada ? (
          <section>
            <div className="mb-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                <FileText size={25} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Reclamar uma multa
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Referência: {multaSeleccionada.referencia}
              </p>
            </div>

            <form
              onSubmit={validarReclamacao}
              className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Tipo de ocorrência
                </label>
                <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  {multaSeleccionada.tipo}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">
                  Valor registado
                </label>
                <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-900">
                  {formatarValor(multaSeleccionada.valor)}
                </div>
              </div>

              <div>
                <label
                  htmlFor="motivo"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Motivos da reclamação *
                </label>
                <textarea
                  id="motivo"
                  required
                  maxLength={2000}
                  rows={5}
                  value={motivo}
                  onChange={(e) => {
                    setMotivo(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Explique os motivos pelos quais solicita a revisão."
                  className={campo}
                />
              </div>

              {mensagem && (
                <div
                  role="status"
                  className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900"
                >
                  {mensagem}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Validar reclamação
              </button>

              <p className="text-xs leading-5 text-slate-500">
                A validação local não suspende prazos nem substitui
                a apresentação da reclamação à entidade competente.
              </p>
            </form>
          </section>
        ) : multaSeleccionada ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                <AlertTriangle size={25} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Detalhes da multa
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Referência: {multaSeleccionada.referencia}
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Descrição</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {multaSeleccionada.descricao}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Categoria</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {multaSeleccionada.tipo}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Data</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {multaSeleccionada.data}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Entidade</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {multaSeleccionada.entidade}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Valor</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatarValor(multaSeleccionada.valor)}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-slate-500">Estado</p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${corEstado(
                      multaSeleccionada.estado
                    )}`}
                  >
                    {multaSeleccionada.estado}
                  </span>
                </div>
              </div>

              {multaSeleccionada.estado === "Pendente" && (
                <div className="mt-6 rounded-xl bg-amber-50 p-4">
                  <p className="text-sm leading-6 text-amber-900">
                    Confirme a validade da multa e solicite a
                    referência oficial de pagamento junto da
                    entidade emissora antes de efectuar qualquer
                    pagamento.
                  </p>
                </div>
              )}

              {multaSeleccionada.estado !== "Paga" && (
                <button
                  type="button"
                  onClick={() =>
                    abrirReclamacao(multaSeleccionada)
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Apresentar reclamação
                  <ArrowRight size={18} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setMultaSeleccionada(null);
                setMensagem("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Voltar às multas
            </button>
          </section>
        ) : seleccionado ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${seleccionado.fundo} ${seleccionado.cor}`}
              >
                {(() => {
                  const Icon = seleccionado.icon;
                  return <Icon size={28} />;
                })()}
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {seleccionado.titulo}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {seleccionado.detalhe}
              </p>

              <h3 className="mt-6 font-semibold text-slate-900">
                Como proceder
              </h3>

              <ul className="mt-3 space-y-3">
                {seleccionado.passos.map((passo) => (
                  <li
                    key={passo}
                    className="flex gap-3 text-sm leading-5 text-slate-600"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-700"
                    />
                    {passo}
                  </li>
                ))}
              </ul>

              {(seleccionado.id === "consultar" ||
                seleccionado.id === "historico") && (
                <button
                  type="button"
                  onClick={() => {
                    setSeleccionado(null);
                    setPesquisa("");
                    setFiltro(
                      seleccionado.id === "historico"
                        ? "Paga"
                        : "Todas"
                    );
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  {seleccionado.id === "historico"
                    ? "Ver histórico de pagamentos"
                    : "Consultar registos"}
                  <ArrowRight size={18} />
                </button>
              )}

              {seleccionado.id === "referencia" && (
                <div className="mt-6 rounded-xl bg-amber-50 p-4">
                  <p className="text-sm leading-6 text-amber-900">
                    A emissão de uma referência válida depende
                    do sistema oficial da entidade responsável.
                    Esta demonstração não gera referências de
                    pagamento reais.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSeleccionado(null);
                      setFiltro("Pendente");
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Consultar multas pendentes
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {seleccionado.id === "reclamacao" && (
                <button
                  type="button"
                  onClick={() => {
                    setSeleccionado(null);
                    setFiltro("Todas");
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Seleccionar multa
                  <ArrowRight size={18} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSeleccionado(null);
                setMensagem("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Voltar aos serviços
            </button>
          </section>
        ) : (
          <>
            <section className="mb-5 overflow-hidden rounded-2xl bg-rose-950 p-5 text-white">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-rose-200">
                <ShieldCheck size={27} />
              </div>

              <h2 className="text-lg font-bold">
                Regularize as suas pendências
              </h2>

              <p className="mt-2 text-sm leading-6 text-rose-100">
                Consulte multas, verifique os seus registos e
                obtenha informações sobre os procedimentos de
                pagamento e reclamação.
              </p>
            </section>

            <section className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertTriangle size={18} />
                  <span className="text-xs font-medium">
                    Em dívida
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold text-slate-900">
                  {formatarValor(totalPendente)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {quantidadePendente} pendente(s)
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 size={18} />
                  <span className="text-xs font-medium">
                    Total pago
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold text-slate-900">
                  {formatarValor(totalPago)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Multas demonstrativas
                </p>
              </div>
            </section>

            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs leading-5 text-amber-900">
                <strong>Modo de demonstração:</strong> as multas
                e os valores abaixo são fictícios. Não representam
                dívidas reais nem referências oficiais.
              </p>
            </div>

            <section className="mb-5">
              <h2 className="text-base font-bold text-slate-900">
                Serviços disponíveis
              </h2>

              <div className="mt-3 space-y-3">
                {servicos.map((servico) => {
                  const Icon = servico.icon;

                  return (
                    <button
                      key={servico.id}
                      type="button"
                      onClick={() => abrirServico(servico)}
                      className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${servico.fundo} ${servico.cor}`}
                      >
                        <Icon size={23} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">
                          {servico.titulo}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {servico.descricao}
                        </span>
                      </span>

                      <ArrowRight
                        size={18}
                        className="shrink-0 text-slate-400 group-hover:text-emerald-700"
                      />
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Últimas multas
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Registos ilustrativos
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {multasFiltradas.length} registos
                </span>
              </div>

              <label className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 focus-within:border-emerald-600">
                <Search size={18} className="text-slate-400" />
                <input
                  type="search"
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  placeholder="Pesquisar referência ou multa"
                  aria-label="Pesquisar multas"
                  className="w-full bg-transparent text-sm outline-none"
                />
                {pesquisa && (
                  <button
                    type="button"
                    onClick={() => setPesquisa("")}
                    aria-label="Limpar pesquisa"
                    className="text-slate-400"
                  >
                    <X size={17} />
                  </button>
                )}
              </label>

              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {["Todas", "Pendente", "Paga", "Em reclamação"].map(
                  (estado) => (
                    <button
                      key={estado}
                      type="button"
                      onClick={() => setFiltro(estado)}
                      className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium transition ${
                        filtro === estado
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {estado}
                    </button>
                  )
                )}
              </div>

              <div className="space-y-3">
                {multasFiltradas.map((multa) => (
                  <button
                    key={multa.id}
                    type="button"
                    onClick={() => {
                      setMultaSeleccionada(multa);
                      setSeleccionado(null);
                      setMostrarReclamacao(false);
                      setMensagem("");
                    }}
                    className="w-full rounded-xl border border-slate-100 p-3 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {multa.tipo}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {multa.referencia}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${corEstado(
                          multa.estado
                        )}`}
                      >
                        {multa.estado}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">
                        {multa.data}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatarValor(multa.valor)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-1 text-xs font-semibold text-emerald-700">
                      Ver detalhes
                      <ArrowRight size={14} />
                    </div>
                  </button>
                ))}

                {multasFiltradas.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center">
                    <Search
                      size={26}
                      className="mx-auto text-slate-400"
                    />
                    <p className="mt-3 text-sm font-semibold text-slate-800">
                      Nenhuma multa encontrada
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Altere a pesquisa ou o filtro seleccionado.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <CircleDollarSign size={23} />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Pague com segurança
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Confirme sempre a autenticidade da notificação,
                a entidade emissora, o valor e a referência antes
                de efectuar um pagamento.
              </p>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                <Clock
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />
                <p className="text-xs leading-5 text-slate-600">
                  Os prazos e os procedimentos variam consoante
                  a natureza da multa e a entidade competente.
                </p>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                <CreditCard
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />
                <p className="text-xs leading-5 text-slate-600">
                  A aplicação ainda não processa pagamentos nem
                  emite referências reais.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
