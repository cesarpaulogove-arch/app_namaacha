
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  Leaf,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
  Info,
} from "lucide-react";

import { obterContaAtual, type ContaLocal } from "@/lib/auth-local";

type OperadorPagamento = "mpesa" | "emola" | "mkesh";

type TipoLicenca =
  | "funcionamento"
  | "construcao"
  | "publicidade"
  | "ambiental";

type PedidoLicencaLocal = {
  id: string;
  contaId: string;
  nomeRequerente: string;
  email: string;
  telefone: string;
  tipoTitular: string;
  tipoLicenca: TipoLicenca;
  localizacao: string;
  descricao: string;
  operadorPagamento?: OperadorPagamento;
  telefonePagamento?: string;
  estado: "Rascunho";
  criadoEm: string;
};

const CHAVE_PEDIDOS = "namaacha_pedidos_licencas";

const operadoresPagamento: {
  id: OperadorPagamento;
  nome: string;
  descricao: string;
  cor: string;
  fundo: string;
}[] = [
  {
    id: "mpesa",
    nome: "M-Pesa",
    descricao: "Carteira móvel M-Pesa",
    cor: "text-red-600",
    fundo: "bg-red-50",
  },
  {
    id: "emola",
    nome: "e-Mola",
    descricao: "Carteira móvel e-Mola",
    cor: "text-orange-600",
    fundo: "bg-orange-50",
  },
  {
    id: "mkesh",
    nome: "mKesh",
    descricao: "Carteira móvel mKesh",
    cor: "text-blue-600",
    fundo: "bg-blue-50",
  },
];

const licencas: {
  id: TipoLicenca;
  nome: string;
  descricao: string;
  icon: typeof Building2;
}[] = [
  {
    id: "funcionamento",
    nome: "Licença de funcionamento",
    descricao:
      "Pedido de licença para abertura e funcionamento de estabelecimento.",
    icon: Building2,
  },
  {
    id: "construcao",
    nome: "Licença de construção",
    descricao:
      "Pedido de autorização para construção, ampliação ou alteração de imóvel.",
    icon: FileText,
  },
  {
    id: "publicidade",
    nome: "Licença de publicidade",
    descricao:
      "Autorização para colocação de anúncios, letreiros e outros suportes publicitários.",
    icon: ClipboardList,
  },
  {
    id: "ambiental",
    nome: "Licença ambiental",
    descricao:
      "Pedido relacionado com actividades sujeitas a avaliação ou autorização ambiental.",
    icon: Leaf,
  },
];

function gerarId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `LIC-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function obterPedidos(): PedidoLicencaLocal[] {
  if (typeof window === "undefined") return [];

  try {
    const dados = localStorage.getItem(CHAVE_PEDIDOS);

    if (!dados) return [];

    const pedidos: unknown = JSON.parse(dados);

    return Array.isArray(pedidos)
      ? (pedidos as PedidoLicencaLocal[])
      : [];
  } catch {
    return [];
  }
}

export default function LicencasPage() {
  const [conta, setConta] = useState<ContaLocal | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [vista, setVista] = useState<"novo" | "pedidos">("novo");

  const [tipoLicenca, setTipoLicenca] =
    useState<TipoLicenca | "">("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");

  const [operadorPagamento, setOperadorPagamento] =
    useState<OperadorPagamento | "">("");
  const [telefonePagamento, setTelefonePagamento] = useState("");

  const [pedidos, setPedidos] = useState<PedidoLicencaLocal[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  useEffect(() => {
    setConta(obterContaAtual());
    setPedidos(obterPedidos());
    setCarregado(true);
  }, []);

  const nomeRequerente =
    conta?.perfil?.nome || conta?.nome || "";

  const contacto = conta?.telefone || "";
  const email = conta?.email || "";
  const tipoTitular = conta?.perfil?.tipo || "cidadao";

  const licencaSelecionada = licencas.find(
    (item) => item.id === tipoLicenca
  );

  const operadorSelecionado = operadoresPagamento.find(
    (operador) => operador.id === operadorPagamento
  );

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termo = pesquisa.trim().toLowerCase();

    if (!termo) return true;

    const nomeLicenca =
      licencas.find((item) => item.id === pedido.tipoLicenca)?.nome ||
      pedido.tipoLicenca;

    return (
      nomeLicenca.toLowerCase().includes(termo) ||
      pedido.localizacao.toLowerCase().includes(termo) ||
      pedido.estado.toLowerCase().includes(termo)
    );
  });

  function selecionarOperador(id: OperadorPagamento) {
    setOperadorPagamento((atual) => (atual === id ? "" : id));
    setTelefonePagamento("");
    setErro("");
    setMensagem("");
  }

  function limparFormulario() {
    setTipoLicenca("");
    setLocalizacao("");
    setDescricao("");
    setOperadorPagamento("");
    setTelefonePagamento("");
  }

  function submeterPedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setMensagem("");

    if (!conta) {
      setErro(
        "Não foi encontrada uma conta activa. Entre na sua conta antes de continuar."
      );
      return;
    }

    if (!tipoLicenca) {
      setErro("Seleccione o tipo de licença que pretende solicitar.");
      return;
    }

    if (!localizacao.trim()) {
      setErro("Indique a localização do estabelecimento ou imóvel.");
      return;
    }

    if (!descricao.trim()) {
      setErro("Descreva o motivo e os detalhes do seu pedido.");
      return;
    }

    if (operadorPagamento && !telefonePagamento.trim()) {
      setErro(
        `Introduza o número da carteira ${operadorSelecionado?.nome || ""}.`
      );
      return;
    }

    setAGuardar(true);

    try {
      const novoPedido: PedidoLicencaLocal = {
        id: gerarId(),
        contaId: conta.id,
        nomeRequerente,
        email,
        telefone: contacto,
        tipoTitular,
        tipoLicenca,
        localizacao: localizacao.trim(),
        descricao: descricao.trim(),
        ...(operadorPagamento
          ? {
              operadorPagamento,
              telefonePagamento: telefonePagamento.trim(),
            }
          : {}),
        estado: "Rascunho",
        criadoEm: new Date().toISOString(),
      };

      const pedidosActualizados = [
        novoPedido,
        ...obterPedidos(),
      ];

      localStorage.setItem(
        CHAVE_PEDIDOS,
        JSON.stringify(pedidosActualizados)
      );

      setPedidos(pedidosActualizados);
      setMensagem(
        "Rascunho guardado com sucesso neste dispositivo. O pedido ainda não foi submetido oficialmente e não foi efectuado qualquer pagamento."
      );

      limparFormulario();
    } catch {
      setErro(
        "Não foi possível guardar o rascunho. Verifique o espaço disponível no navegador e tente novamente."
      );
    } finally {
      setAGuardar(false);
    }
  }

  function formatarData(data: string) {
    try {
      return new Intl.DateTimeFormat("pt-MZ", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(data));
    } catch {
      return data;
    }
  }

  if (!carregado) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
          A carregar os seus dados...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/inicio"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Voltar ao início
        </Link>

        <section className="mb-8 overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-sm">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
                <ShieldCheck size={15} />
                Serviços municipais digitais
              </div>

              <h1 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Licenças e autorizações
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100/85 sm:text-base">
                Prepare os seus pedidos de licença municipal de forma
                simples e organizada, a partir da sua conta.
              </p>
            </div>

            <div className="hidden h-24 w-24 items-center justify-center rounded-3xl bg-white/10 lg:flex">
              <ClipboardList size={46} strokeWidth={1.4} />
            </div>
          </div>
        </section>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setVista("novo");
              setErro("");
              setMensagem("");
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              vista === "novo"
                ? "bg-emerald-700 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText size={17} />
            Novo pedido
          </button>

          <button
            type="button"
            onClick={() => {
              setPedidos(obterPedidos());
              setVista("pedidos");
              setErro("");
              setMensagem("");
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              vista === "pedidos"
                ? "bg-emerald-700 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={17} />
            Os meus pedidos
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs">
              {pedidos.length}
            </span>
          </button>
        </div>

        {!conta && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Info
                className="mt-0.5 shrink-0 text-amber-700"
                size={20}
              />
              <div>
                <p className="font-semibold text-amber-900">
                  Precisa de entrar na sua conta
                </p>
                <p className="mt-1 text-sm leading-5 text-amber-800">
                  Entre na sua conta para preparar um pedido de licença.
                </p>
              </div>
            </div>

            <Link
              href="/entrar"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800"
            >
              Entrar
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {vista === "novo" ? (
          <form
            onSubmit={submeterPedido}
            className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
          >
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <UserRound size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Dados do requerente
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Dados associados à sua conta.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Nome do requerente
                    </label>
                    <input
                      type="text"
                      value={nomeRequerente}
                      readOnly
                      placeholder="Nome associado à conta"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Tipo de titular
                    </label>
                    <input
                      type="text"
                      value={tipoTitular}
                      readOnly
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        value={email}
                        readOnly
                        placeholder="Email da conta"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Telefone de contacto
                    </label>
                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="tel"
                        value={contacto}
                        readOnly
                        placeholder="Telefone da conta"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <ClipboardList size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Detalhes do pedido
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Seleccione a licença e descreva o que pretende.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="tipoLicenca"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Tipo de licença <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="tipoLicenca"
                      required
                      value={tipoLicenca}
                      onChange={(event) =>
                        setTipoLicenca(
                          event.target.value as TipoLicenca | ""
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    >
                      <option value="">Seleccione o tipo de licença</option>
                      {licencas.map((licenca) => (
                        <option key={licenca.id} value={licenca.id}>
                          {licenca.nome}
                        </option>
                      ))}
                    </select>

                    {licencaSelecionada && (
                      <p className="mt-2 text-sm leading-5 text-slate-500">
                        {licencaSelecionada.descricao}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="localizacao"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Localização do estabelecimento ou imóvel{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-3 top-3.5 text-slate-400"
                      />
                      <input
                        id="localizacao"
                        type="text"
                        required
                        value={localizacao}
                        onChange={(event) =>
                          setLocalizacao(event.target.value)
                        }
                        placeholder="Ex.: Bairro, rua, parcela ou referência"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="descricao"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Descrição do pedido{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      id="descricao"
                      required
                      rows={5}
                      value={descricao}
                      onChange={(event) =>
                        setDescricao(event.target.value)
                      }
                      placeholder="Explique o motivo do pedido e indique os detalhes relevantes..."
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <Smartphone size={19} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Carteira móvel
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Opcional. Seleccione uma rede para indicar o número da
                      carteira.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                  {operadoresPagamento.map((operador) => {
                    const seleccionado =
                      operadorPagamento === operador.id;

                    return (
                      <button
                        key={operador.id}
                        type="button"
                        aria-pressed={seleccionado}
                        onClick={() =>
                          selecionarOperador(operador.id)
                        }
                        className={`relative flex min-w-0 flex-col items-center rounded-xl border p-2 text-center transition sm:p-3 ${
                          seleccionado
                            ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/15"
                            : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                        }`}
                      >
                        {seleccionado && (
                          <CheckCircle2
                            size={15}
                            className="absolute right-1 top-1 text-emerald-700 sm:right-2 sm:top-2"
                          />
                        )}

                        <div
                          className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${operador.fundo} ${operador.cor}`}
                        >
                          <Smartphone size={18} />
                        </div>

                        <span className="text-xs font-bold text-slate-900 sm:text-sm">
                          {operador.nome}
                        </span>

                        <span className="mt-1 hidden text-center text-[10px] leading-4 text-slate-500 sm:block">
                          {operador.descricao}
                        </span>

                        <span
                          className={`mt-2 text-[10px] font-semibold sm:text-xs ${
                            seleccionado
                              ? "text-emerald-700"
                              : "text-slate-400"
                          }`}
                        >
                          {seleccionado ? "Seleccionado" : "Seleccionar"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {operadorPagamento && (
                  <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 sm:p-4">
                    <label
                      htmlFor="telefonePagamento"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Número da carteira — {operadorSelecionado?.nome}
                    </label>

                    <input
                      id="telefonePagamento"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={telefonePagamento}
                      onChange={(event) =>
                        setTelefonePagamento(event.target.value)
                      }
                      placeholder={
                        operadorPagamento === "mpesa"
                          ? "M-Pesa: ex. 84 123 4567 ou 85 123 4567"
                          : operadorPagamento === "emola"
                            ? "e-Mola: introduza o número da carteira"
                            : "mKesh: introduza o número da carteira"
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    />

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {operadorPagamento === "mpesa"
                        ? "Introduza o número associado à sua carteira M-Pesa."
                        : operadorPagamento === "emola"
                          ? "Introduza o número associado à sua carteira e-Mola."
                          : "Introduza o número associado à sua carteira mKesh."}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setOperadorPagamento("");
                        setTelefonePagamento("");
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-red-600"
                    >
                      <X size={14} />
                      Remover carteira seleccionada
                    </button>
                  </div>
                )}

                {!operadorPagamento && (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Pode continuar sem configurar uma carteira móvel.
                  </p>
                )}
              </section>

              {erro && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                  <Info className="mt-0.5 shrink-0" size={19} />
                  <p>{erro}</p>
                </div>
              )}

              {mensagem && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0"
                    size={19}
                  />
                  <p>{mensagem}</p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    limparFormulario();
                    setErro("");
                    setMensagem("");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Limpar formulário
                </button>

                <button
                  type="submit"
                  disabled={!conta || aGuardar}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {aGuardar ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      A guardar...
                    </>
                  ) : (
                    <>
                      Guardar rascunho
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-slate-900">
                  Resumo do pedido
                </h2>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        Tipo de licença
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {licencaSelecionada?.nome || "Ainda não seleccionado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Localização</p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {localizacao || "Ainda não indicada"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                      <Smartphone size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        Carteira móvel
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {operadorSelecionado?.nome || "Não configurada"}
                      </p>
                      {telefonePagamento && (
                        <p className="mt-1 break-words text-xs text-slate-500">
                          {telefonePagamento}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <Info
                    size={20}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <div>
                    <h3 className="font-semibold text-blue-950">
                      Antes de continuar
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-blue-900/80">
                      Nesta versão, o pedido é guardado localmente no
                      navegador. Ainda não é enviado aos serviços municipais
                      e a selecção da carteira não inicia qualquer pagamento.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </form>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Os meus pedidos
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Consulte os rascunhos guardados neste dispositivo.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={pesquisa}
                  onChange={(event) => setPesquisa(event.target.value)}
                  placeholder="Pesquisar pedidos..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />
              </div>
            </div>

            {pedidosFiltrados.length === 0 ? (
              <div className="py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ClipboardList size={27} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">
                  Nenhum pedido encontrado
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Os pedidos guardados aparecerão aqui.
                </p>
                <button
                  type="button"
                  onClick={() => setVista("novo")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Criar pedido
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {pedidosFiltrados.map((pedido) => {
                  const licenca = licencas.find(
                    (item) => item.id === pedido.tipoLicenca
                  );

                  return (
                    <article
                      key={pedido.id}
                      className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <ClipboardList size={21} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900">
                              {licenca?.nome || pedido.tipoLicenca}
                            </h3>
                            <p className="mt-1 break-words text-sm text-slate-500">
                              <MapPin
                                size={14}
                                className="mr-1 inline-block"
                              />
                              {pedido.localizacao}
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                              Guardado em {formatarData(pedido.criadoEm)}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          {pedido.estado}
                        </span>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {pedido.descricao}
                      </p>

                      {pedido.operadorPagamento && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                          <Smartphone
                            size={17}
                            className="shrink-0 text-slate-400"
                          />
                          <span>
                            {operadoresPagamento.find(
                              (op) => op.id === pedido.operadorPagamento
                            )?.nome || pedido.operadorPagamento}
                            {pedido.telefonePagamento
                              ? ` · ${pedido.telefonePagamento}`
                              : ""}
                          </span>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
