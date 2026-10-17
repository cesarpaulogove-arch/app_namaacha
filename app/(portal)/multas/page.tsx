
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  History,
  LoaderCircle,
  MapPin,
  MessageSquareWarning,
  Search,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { obterContaAtual } from "@/lib/auth-local";

type EstadoMulta = "Pendente" | "Paga" | "Em reclamação";

type Multa = {
  id: string;
  referencia: string;
  tipo: string;
  descricao: string;
  local: string;
  data: string;
  valor: number;
  estado: EstadoMulta;
};

type MetodoPagamento =
  | "M-Pesa"
  | "e-Mola"
  | "mKesh"
  | "Pagamento presencial";

type PedidoPagamento = {
  id: string;
  referenciaMulta: string;
  metodo: MetodoPagamento;
  numeroPagamento?: string;
  valor: number;
  data: string;
  estado: "Pedido registado" | "Pagamento confirmado";
};

type Reclamacao = {
  id: string;
  referenciaMulta: string;
  motivo: string;
  descricao: string;
  data: string;
  estado: "Submetida" | "Em análise" | "Respondida";
};

type Separador = "consultar" | "pagamento" | "historico" | "reclamacao";

const CHAVE_MULTAS = "namaacha_multas";
const CHAVE_PEDIDOS = "namaacha_pedidos_pagamento_multas";
const CHAVE_RECLAMACOES = "namaacha_reclamacoes_multas";

const METODOS: {
  nome: MetodoPagamento;
  descricao: string;
  icon: typeof Smartphone;
}[] = [
  {
    nome: "M-Pesa",
    descricao: "Pagamento através da carteira M-Pesa",
    icon: Smartphone,
  },
  {
    nome: "e-Mola",
    descricao: "Pagamento através da carteira e-Mola",
    icon: Wallet,
  },
  {
    nome: "mKesh",
    descricao: "Pagamento através da carteira mKesh",
    icon: CreditCard,
  },
  {
    nome: "Pagamento presencial",
    descricao: "Regularização presencial nos serviços municipais",
    icon: Banknote,
  },
];

const MULTAS_INICIAIS: Multa[] = [
  {
    id: "1",
    referencia: "DEMO-2026-001",
    tipo: "Estacionamento",
    descricao: "Estacionamento em local não autorizado",
    local: "Namaacha, zona central",
    data: "2026-09-12",
    valor: 1500,
    estado: "Pendente",
  },
  {
    id: "2",
    referencia: "DEMO-2026-002",
    tipo: "Publicidade",
    descricao: "Publicidade sem licença municipal válida",
    local: "Namaacha, avenida principal",
    data: "2026-09-25",
    valor: 2500,
    estado: "Pendente",
  },
  {
    id: "3",
    referencia: "DEMO-2026-003",
    tipo: "Ocupação de espaço",
    descricao: "Ocupação de espaço público sem autorização",
    local: "Namaacha, zona do mercado",
    data: "2026-10-02",
    valor: 1000,
    estado: "Pendente",
  },
];

function lerLocalStorage<T>(chave: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;

  try {
    const dados = localStorage.getItem(chave);
    return dados ? (JSON.parse(dados) as T) : padrao;
  } catch {
    return padrao;
  }
}

function guardarLocalStorage<T>(chave: string, dados: T) {
  if (typeof window === "undefined") return;

  localStorage.setItem(chave, JSON.stringify(dados));
}

function formatarValor(valor: number) {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    maximumFractionDigits: 2,
  }).format(valor);
}

function formatarData(data: string) {
  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) return data;

  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(dataConvertida);
}

function gerarReferencia(prefixo: string) {
  return `${prefixo}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export default function MultasPage() {
  const router = useRouter();

  const [carregado, setCarregado] = useState(false);
  const [separador, setSeparador] = useState<Separador>("consultar");

  const [multas, setMultas] = useState<Multa[]>([]);
  const [pedidos, setPedidos] = useState<PedidoPagamento[]>([]);
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);

  const [pesquisa, setPesquisa] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todas");
  const [multaSelecionada, setMultaSelecionada] = useState("");

  const [metodoSelecionado, setMetodoSelecionado] =
    useState<MetodoPagamento>("M-Pesa");
  const [numeroPagamento, setNumeroPagamento] = useState("");
  const [aRegistarPagamento, setARegistarPagamento] = useState(false);

  const [motivoReclamacao, setMotivoReclamacao] = useState("");
  const [descricaoReclamacao, setDescricaoReclamacao] = useState("");
  const [aSubmeterReclamacao, setASubmeterReclamacao] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro">(
    "sucesso"
  );

  useEffect(() => {
    const conta = obterContaAtual();

    if (!conta) {
      router.replace("/entrar");
      return;
    }

    const multasGuardadas = lerLocalStorage<Multa[] | null>(
      CHAVE_MULTAS,
      null
    );

    const pedidosGuardados = lerLocalStorage<PedidoPagamento[]>(
      CHAVE_PEDIDOS,
      []
    );

    const reclamacoesGuardadas = lerLocalStorage<Reclamacao[]>(
      CHAVE_RECLAMACOES,
      []
    );

    if (multasGuardadas) {
      setMultas(multasGuardadas);
    } else {
      setMultas(MULTAS_INICIAIS);
      guardarLocalStorage(CHAVE_MULTAS, MULTAS_INICIAIS);
    }

    setPedidos(pedidosGuardados);
    setReclamacoes(reclamacoesGuardadas);
    setCarregado(true);
  }, [router]);

  function mostrarMensagem(
    texto: string,
    tipo: "sucesso" | "erro" = "sucesso"
  ) {
    setMensagem(texto);
    setTipoMensagem(tipo);
  }

  const multasFiltradas = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    return multas.filter((multa) => {
      const correspondePesquisa =
        !termo ||
        multa.referencia.toLowerCase().includes(termo) ||
        multa.tipo.toLowerCase().includes(termo) ||
        multa.descricao.toLowerCase().includes(termo);

      const correspondeEstado =
        estadoFiltro === "Todas" || multa.estado === estadoFiltro;

      return correspondePesquisa && correspondeEstado;
    });
  }, [multas, pesquisa, estadoFiltro]);

  const multaParaPagamento = multas.find(
    (multa) => multa.referencia === multaSelecionada
  );

  const multasPendentes = multas.filter(
    (multa) => multa.estado === "Pendente"
  );

  const valorPendente = multasPendentes.reduce(
    (total, multa) => total + multa.valor,
    0
  );

  function selecionarMultaParaPagamento(multa: Multa) {
    setMultaSelecionada(multa.referencia);
    setSeparador("pagamento");
    setMensagem("");
  }

  function criarPedidoPagamento() {
    if (!multaParaPagamento) {
      mostrarMensagem(
        "Seleccione uma multa pendente antes de continuar.",
        "erro"
      );
      return;
    }

    if (multaParaPagamento.estado !== "Pendente") {
      mostrarMensagem(
        "Esta multa não está disponível para pagamento.",
        "erro"
      );
      return;
    }

    if (
      metodoSelecionado !== "Pagamento presencial" &&
      !/^\d{9}$/.test(numeroPagamento)
    ) {
      mostrarMensagem(
        "Introduza um número de telefone válido com 9 dígitos.",
        "erro"
      );
      return;
    }

    setARegistarPagamento(true);
    setMensagem("");

    try {
      const pedido: PedidoPagamento = {
        id: gerarReferencia("PAG"),
        referenciaMulta: multaParaPagamento.referencia,
        metodo: metodoSelecionado,
        numeroPagamento:
          metodoSelecionado === "Pagamento presencial"
            ? undefined
            : `+258${numeroPagamento}`,
        valor: multaParaPagamento.valor,
        data: new Date().toISOString(),
        estado: "Pedido registado",
      };

      const novosPedidos = [pedido, ...pedidos];

      setPedidos(novosPedidos);
      guardarLocalStorage(CHAVE_PEDIDOS, novosPedidos);

      setNumeroPagamento("");
      setSeparador("historico");

      mostrarMensagem(
        "Pedido registado. Consulte o histórico para acompanhar o estado."
      );
    } catch {
      mostrarMensagem(
        "Não foi possível registar o pedido. Tente novamente.",
        "erro"
      );
    } finally {
      setARegistarPagamento(false);
    }
  }

  function submeterReclamacao() {
    const multa = multas.find(
      (item) => item.referencia === multaSelecionada
    );

    if (!multa) {
      mostrarMensagem(
        "Seleccione a multa que pretende contestar.",
        "erro"
      );
      return;
    }

    if (!motivoReclamacao) {
      mostrarMensagem(
        "Seleccione o motivo da reclamação.",
        "erro"
      );
      return;
    }

    if (descricaoReclamacao.trim().length < 10) {
      mostrarMensagem(
        "Descreva o motivo da reclamação com pelo menos 10 caracteres.",
        "erro"
      );
      return;
    }

    setASubmeterReclamacao(true);
    setMensagem("");

    try {
      const novaReclamacao: Reclamacao = {
        id: gerarReferencia("REC"),
        referenciaMulta: multa.referencia,
        motivo: motivoReclamacao,
        descricao: descricaoReclamacao.trim(),
        data: new Date().toISOString(),
        estado: "Submetida",
      };

      const novasReclamacoes = [novaReclamacao, ...reclamacoes];

      setReclamacoes(novasReclamacoes);
      guardarLocalStorage(CHAVE_RECLAMACOES, novasReclamacoes);

      const multasActualizadas = multas.map((item) =>
        item.referencia === multa.referencia
          ? { ...item, estado: "Em reclamação" as const }
          : item
      );

      setMultas(multasActualizadas);
      guardarLocalStorage(CHAVE_MULTAS, multasActualizadas);

      setDescricaoReclamacao("");
      setMotivoReclamacao("");
      setSeparador("historico");

      mostrarMensagem(
        "Reclamação registada com sucesso. Guarde a referência para acompanhamento."
      );
    } catch {
      mostrarMensagem(
        "Não foi possível registar a reclamação.",
        "erro"
      );
    } finally {
      setASubmeterReclamacao(false);
    }
  }

  function abrirReclamacao(multa: Multa) {
    setMultaSelecionada(multa.referencia);
    setSeparador("reclamacao");
    setMensagem("");
  }

  function mudarSeparador(novoSeparador: Separador) {
    setSeparador(novoSeparador);
    setMensagem("");
  }

  if (!carregado) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span>A carregar multas e taxas...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-800 p-6 text-white shadow-sm sm:p-8">
          <button
            type="button"
            onClick={() => router.push("/inicio")}
            className="mb-5 inline-flex items-center gap-2 text-sm text-emerald-100 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </button>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <FileText className="h-6 w-6" />
              </div>

              <p className="text-sm font-medium text-emerald-200">
                Município da Namaacha
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Multas e Taxas
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
                Consulte as suas multas, registe pedidos de pagamento e
                acompanhe as reclamações através do portal municipal.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 md:min-w-56">
              <p className="text-sm text-emerald-100">
                Total de multas pendentes
              </p>
              <p className="mt-2 text-2xl font-bold">
                {formatarValor(valorPendente)}
              </p>
              <p className="mt-1 text-xs text-emerald-100">
                {multasPendentes.length} multa(s) por regularizar
              </p>
            </div>
          </div>
        </header>

        {mensagem && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-2xl border p-4 ${
              tipoMensagem === "erro"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {tipoMensagem === "erro" ? (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            )}

            <p className="flex-1 text-sm leading-6">{mensagem}</p>

            <button
              type="button"
              aria-label="Fechar mensagem"
              onClick={() => setMensagem("")}
              className="rounded-lg p-1 transition hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Multas registadas</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {multas.length}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pendentes</p>
                <p className="mt-2 text-2xl font-bold text-amber-700">
                  {multasPendentes.length}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Reclamações</p>
                <p className="mt-2 text-2xl font-bold text-purple-700">
                  {reclamacoes.length}
                </p>
              </div>
              <div className="rounded-xl bg-purple-50 p-3 text-purple-700">
                <MessageSquareWarning className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        <nav className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-4">
          {[
            {
              id: "consultar",
              nome: "Consultar multas",
              icon: Search,
            },
            {
              id: "pagamento",
              nome: "Pagamento",
              icon: Wallet,
            },
            {
              id: "historico",
              nome: "Histórico",
              icon: History,
            },
            {
              id: "reclamacao",
              nome: "Reclamação",
              icon: MessageSquareWarning,
            },
          ].map((item) => {
            const Icone = item.icon;
            const activo = separador === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  mudarSeparador(item.id as Separador)
                }
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  activo
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icone className="h-4 w-4" />
                <span>{item.nome}</span>
              </button>
            );
          })}
        </nav>

        {separador === "consultar" && (
          <section className="space-y-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  As minhas multas
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Pesquise pela referência, tipo ou descrição da multa.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={pesquisa}
                    onChange={(event) => setPesquisa(event.target.value)}
                    placeholder="Pesquisar multa..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-700 sm:w-64"
                  />
                </div>

                <select
                  value={estadoFiltro}
                  onChange={(event) => setEstadoFiltro(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-700"
                >
                  <option value="Todas">Todos os estados</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Paga">Paga</option>
                  <option value="Em reclamação">Em reclamação</option>
                </select>
              </div>
            </div>

            {multasFiltradas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-3 font-semibold text-slate-800">
                  Nenhuma multa encontrada
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Experimente alterar os termos da pesquisa ou o filtro.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {multasFiltradas.map((multa) => (
                  <article
                    key={multa.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                          {multa.tipo}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                          {multa.descricao}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Referência:{" "}
                          <span className="font-semibold text-slate-700">
                            {multa.referencia}
                          </span>
                        </p>
                      </div>

                      <EstadoBadge estado={multa.estado} />
                    </div>

                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                        {multa.local}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                        {formatarData(multa.data)}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-end">
                      <div>
                        <p className="text-xs text-slate-500">
                          Valor da multa
                        </p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {formatarValor(multa.valor)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {multa.estado === "Pendente" && (
                          <button
                            type="button"
                            onClick={() =>
                              selecionarMultaParaPagamento(multa)
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                          >
                            Pagar multa
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}

                        {multa.estado !== "Paga" && (
                          <button
                            type="button"
                            onClick={() => abrirReclamacao(multa)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Reclamar
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {separador === "pagamento" && (
          <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Registar pagamento
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Seleccione a multa e o método que pretende utilizar.
                </p>
              </div>

              <div className="mt-6 space-y-2">
                <label
                  htmlFor="multa-pagamento"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Multa a regularizar
                </label>

                <select
                  id="multa-pagamento"
                  value={multaSelecionada}
                  onChange={(event) => {
                    setMultaSelecionada(event.target.value);
                    setMensagem("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700"
                >
                  <option value="">Seleccione uma multa</option>
                  {multas
                    .filter((multa) => multa.estado === "Pendente")
                    .map((multa) => (
                      <option
                        key={multa.id}
                        value={multa.referencia}
                      >
                        {multa.referencia} — {multa.tipo} —{" "}
                        {formatarValor(multa.valor)}
                      </option>
                    ))}
                </select>
              </div>

              {multaParaPagamento && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-900">
                    {multaParaPagamento.descricao}
                  </p>
                  <p className="mt-1 text-xs text-emerald-800">
                    Referência: {multaParaPagamento.referencia}
                  </p>
                  <p className="mt-3 text-xl font-bold text-emerald-950">
                    {formatarValor(multaParaPagamento.valor)}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700">
                  Forma de pagamento
                </h3>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {METODOS.map((metodo) => {
                    const Icone = metodo.icon;
                    const seleccionado =
                      metodoSelecionado === metodo.nome;

                    return (
                      <button
                        key={metodo.nome}
                        type="button"
                        onClick={() => {
                          setMetodoSelecionado(metodo.nome);
                          setNumeroPagamento("");
                          setMensagem("");
                        }}
                        aria-pressed={seleccionado}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                          seleccionado
                            ? "border-emerald-700 bg-emerald-50 ring-2 ring-emerald-100"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            seleccionado
                              ? "bg-emerald-800 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icone className="h-5 w-5" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-slate-900">
                            {metodo.nome}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            {metodo.descricao}
                          </span>
                        </span>

                        {seleccionado && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {metodoSelecionado !== "Pagamento presencial" && (
                <div className="mt-5 space-y-2">
                  <label
                    htmlFor="numero-pagamento"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Número de telefone associado ao {metodoSelecionado}
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-100">
                    <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600">
                      +258
                    </span>

                    <input
                      id="numero-pagamento"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="84 123 4567"
                      value={numeroPagamento}
                      onChange={(event) => {
                        setNumeroPagamento(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 9)
                        );
                        setMensagem("");
                      }}
                      className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                      aria-describedby="numero-pagamento-ajuda"
                      maxLength={9}
                    />
                  </div>

                  <p
                    id="numero-pagamento-ajuda"
                    className="text-xs leading-5 text-slate-500"
                  >
                    Introduza os 9 dígitos do número associado à carteira
                    móvel, sem incluir o indicativo +258.
                  </p>
                </div>
              )}

              {metodoSelecionado === "Pagamento presencial" && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        Pagamento presencial
                      </p>
                      <p className="mt-1 text-sm leading-6 text-blue-800">
                        Dirija-se aos serviços municipais competentes para
                        confirmar os procedimentos e os dados oficiais
                        necessários para regularizar a multa.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={criarPedidoPagamento}
                disabled={aRegistarPagamento}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aRegistarPagamento ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    A registar pedido...
                  </>
                ) : (
                  <>
                    Registar pedido de pagamento
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                O registo guarda o pedido no portal. A confirmação e a
                integração com a carteira móvel dependem dos serviços de
                pagamento e do sistema municipal.
              </p>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Resumo do pedido
                  </h3>
                  <p className="text-sm text-slate-500">
                    Confirme os dados seleccionados.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <LinhaResumo
                  titulo="Referência"
                  valor={multaParaPagamento?.referencia ?? "Não seleccionada"}
                />
                <LinhaResumo
                  titulo="Tipo de multa"
                  valor={multaParaPagamento?.tipo ?? "—"}
                />
                <LinhaResumo
                  titulo="Método"
                  valor={metodoSelecionado}
                />

                {metodoSelecionado !== "Pagamento presencial" && (
                  <LinhaResumo
                    titulo="Número"
                    valor={
                      numeroPagamento
                        ? `+258 ${numeroPagamento}`
                        : "Por preencher"
                    }
                  />
                )}

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-500">Total a regularizar</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatarValor(multaParaPagamento?.valor ?? 0)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  <p className="text-xs leading-5 text-slate-600">
                    O pedido ficará registado como pendente até que o
                    pagamento seja confirmado pelo sistema municipal.
                  </p>
                </div>
              </div>
            </aside>
          </section>
        )}

        {separador === "historico" && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Histórico e acompanhamento
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Consulte os pedidos de pagamento e as reclamações submetidas.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h3 className="font-bold text-slate-900">
                  Pedidos de pagamento
                </h3>
              </div>

              {pedidos.length === 0 ? (
                <EstadoVazio
                  titulo="Ainda não existem pedidos"
                  descricao="Os seus pedidos de pagamento aparecerão aqui."
                  icon="pagamento"
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {pedidos.map((pedido) => (
                    <article
                      key={pedido.id}
                      className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <p className="break-all text-sm font-semibold text-slate-900">
                          {pedido.referenciaMulta}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {pedido.metodo}
                          {pedido.numeroPagamento
                            ? ` · ${pedido.numeroPagamento}`
                            : ""}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Registado em {formatarData(pedido.data)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Pedido: {pedido.id}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="font-bold text-slate-900">
                          {formatarValor(pedido.valor)}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                          {pedido.estado}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h3 className="font-bold text-slate-900">Reclamações</h3>
              </div>

              {reclamacoes.length === 0 ? (
                <EstadoVazio
                  titulo="Ainda não existem reclamações"
                  descricao="As reclamações submetidas serão apresentadas nesta secção."
                  icon="reclamacao"
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {reclamacoes.map((reclamacao) => (
                    <article key={reclamacao.id} className="p-5">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {reclamacao.referenciaMulta}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {reclamacao.motivo}
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                            {reclamacao.descricao}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            Submetida em {formatarData(reclamacao.data)}
                          </p>
                          <p className="mt-1 break-all text-xs text-slate-500">
                            Referência da reclamação: {reclamacao.id}
                          </p>
                        </div>

                        <span className="h-fit w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800">
                          {reclamacao.estado}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {separador === "reclamacao" && (
          <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <MessageSquareWarning className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Apresentar reclamação
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Indique a multa e explique o motivo da contestação.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="multa-reclamacao"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Multa a contestar
                  </label>

                  <select
                    id="multa-reclamacao"
                    value={multaSelecionada}
                    onChange={(event) => {
                      setMultaSelecionada(event.target.value);
                      setMensagem("");
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-700"
                  >
                    <option value="">Seleccione uma multa</option>
                    {multas
                      .filter((multa) => multa.estado !== "Paga")
                      .map((multa) => (
                        <option
                          key={multa.id}
                          value={multa.referencia}
                        >
                          {multa.referencia} — {multa.tipo}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="motivo-reclamacao"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Motivo da reclamação
                  </label>

                  <select
                    id="motivo-reclamacao"
                    value={motivoReclamacao}
                    onChange={(event) =>
                      setMotivoReclamacao(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-700"
                  >
                    <option value="">Seleccione o motivo</option>
                    <option value="Multa indevida">Multa indevida</option>
                    <option value="Erro nos dados">
                      Erro nos dados da multa
                    </option>
                    <option value="Pagamento já efectuado">
                      Pagamento já efectuado
                    </option>
                    <option value="Duplicação da multa">
                      Duplicação da multa
                    </option>
                    <option value="Outro motivo">Outro motivo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="descricao-reclamacao"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Descrição
                  </label>

                  <textarea
                    id="descricao-reclamacao"
                    value={descricaoReclamacao}
                    onChange={(event) =>
                      setDescricaoReclamacao(event.target.value)
                    }
                    rows={5}
                    maxLength={1500}
                    placeholder="Explique detalhadamente por que motivo pretende contestar esta multa..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="text-right text-xs text-slate-400">
                    {descricaoReclamacao.length}/1500 caracteres
                  </p>
                </div>

                <button
                  type="button"
                  onClick={submeterReclamacao}
                  disabled={aSubmeterReclamacao}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {aSubmeterReclamacao ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      A submeter...
                    </>
                  ) : (
                    <>
                      Submeter reclamação
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h3 className="font-bold text-slate-900">
                Acompanhamento
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Depois de submeter a reclamação, poderá consultar o registo
                na secção de histórico.
              </p>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Estado inicial
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      A reclamação será registada como submetida. A análise
                      e a resposta dependem dos serviços municipais.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => mudarSeparador("historico")}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
              >
                Consultar histórico
                <ArrowRight className="h-4 w-4" />
              </button>
            </aside>
          </section>
        )}

        <footer className="flex flex-col justify-between gap-3 border-t border-slate-200 py-5 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center">
          <p>Município da Namaacha Digital</p>
          <p>Portal de serviços municipais</p>
        </footer>
      </div>
    </main>
  );
}

function EstadoBadge({ estado }: { estado: EstadoMulta }) {
  const classes: Record<EstadoMulta, string> = {
    Pendente: "bg-amber-50 text-amber-800",
    Paga: "bg-emerald-50 text-emerald-800",
    "Em reclamação": "bg-purple-50 text-purple-800",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${classes[estado]}`}
    >
      {estado}
    </span>
  );
}

function LinhaResumo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-slate-500">{titulo}</span>
      <span className="max-w-[60%] break-words text-right text-sm font-semibold text-slate-800">
        {valor}
      </span>
    </div>
  );
}

function EstadoVazio({
  titulo,
  descricao,
  icon,
}: {
  titulo: string;
  descricao: string;
  icon: "pagamento" | "reclamacao";
}) {
  const Icone = icon === "pagamento" ? History : MessageSquareWarning;

  return (
    <div className="p-8 text-center sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Icone className="h-6 w-6" />
      </div>
      <h4 className="mt-3 font-semibold text-slate-900">{titulo}</h4>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
        {descricao}
      </p>
    </div>
  );
}
