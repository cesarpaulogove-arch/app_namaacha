
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CarFront,
  CheckCircle2,
  Clock3,
  FileText,
  Landmark,
  LoaderCircle,
  Receipt,
  Search,
  ShieldCheck,
  Wallet,
  Waves,
  X,
} from "lucide-react";
import {
  obterContaAtual,
  type ContaLocal,
  type OperadorCarteira,
} from "@/lib/auth-local";

type IconeServico = typeof Landmark;

type ServicoImposto = {
  id: string;
  titulo: string;
  descricao: string;
  detalhe: string;
  finalidade: string;
  icon: IconeServico;
  cor: string;
  fundo: string;
};

type EstadoPedido =
  | "AGUARDA_VALIDACAO"
  | "EM_ANALISE"
  | "CONCLUIDO";

type PedidoImposto = {
  id: string;
  titular: string;
  email: string;
  nuit: string;
  tipoTitular: string;
  servicoId: string;
  servicoTitulo: string;
  mensagem: string;
  operador: OperadorCarteira | "";
  telefoneCarteira: string;
  estado: EstadoPedido;
  criadoEm: string;
};

const CHAVE_PEDIDOS = "namaacha_pedidos_impostos";

const servicos: ServicoImposto[] = [
  {
    id: "predial",
    titulo: "Imposto Predial",
    descricao:
      "Pedidos de consulta relacionados a imóveis e propriedades.",
    detalhe:
      "Permite solicitar orientação sobre obrigações fiscais relacionadas a imóveis.",
    finalidade:
      "Identificar a situação do imóvel e os procedimentos necessários para a consulta fiscal.",
    icon: Landmark,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
  },
  {
    id: "actividade-economica",
    titulo: "Imposto de Actividade Económica",
    descricao:
      "Informações sobre obrigações fiscais associadas à actividade económica.",
    detalhe:
      "Destina-se a cidadãos empresariais e outros titulares que necessitem de orientação fiscal.",
    finalidade:
      "Solicitar esclarecimentos sobre o enquadramento fiscal da actividade económica.",
    icon: Building2,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
  },
  {
    id: "saneamento",
    titulo: "Taxa de Saneamento",
    descricao:
      "Pedidos de esclarecimento sobre taxas e serviços de saneamento.",
    detalhe:
      "Permite solicitar informações sobre a taxa de saneamento e os procedimentos aplicáveis.",
    finalidade:
      "Registar um pedido de esclarecimento relativo ao serviço de saneamento.",
    icon: Waves,
    cor: "text-cyan-700",
    fundo: "bg-cyan-50",
  },
  {
    id: "licenca-funcionamento",
    titulo: "Taxa de Licença de Funcionamento",
    descricao:
      "Orientação sobre licenças e obrigações relacionadas com estabelecimentos.",
    detalhe:
      "Permite solicitar orientação sobre os procedimentos relacionados com a licença de funcionamento.",
    finalidade:
      "Obter informação sobre os documentos e os passos necessários para tratar da licença.",
    icon: FileText,
    cor: "text-amber-700",
    fundo: "bg-amber-50",
  },
  {
    id: "veiculos",
    titulo: "Imposto sobre Veículos",
    descricao:
      "Pedidos de informação sobre obrigações fiscais relacionadas com veículos.",
    detalhe:
      "Permite solicitar orientação sobre os procedimentos fiscais aplicáveis a veículos.",
    finalidade:
      "Registar um pedido de esclarecimento sobre a situação fiscal de um veículo.",
    icon: CarFront,
    cor: "text-violet-700",
    fundo: "bg-violet-50",
  },
];

const operadores: {
  id: OperadorCarteira;
  nome: string;
  cor: string;
}[] = [
  {
    id: "mpesa",
    nome: "M-Pesa",
    cor: "bg-red-50 text-red-700 border-red-100",
  },
  {
    id: "emola",
    nome: "e-Mola",
    cor: "bg-orange-50 text-orange-700 border-orange-100",
  },
  {
    id: "mkesh",
    nome: "mKesh",
    cor: "bg-blue-50 text-blue-700 border-blue-100",
  },
];

function lerPedidos(): PedidoImposto[] {
  if (typeof window === "undefined") return [];

  try {
    const dados = localStorage.getItem(CHAVE_PEDIDOS);
    if (!dados) return [];

    const resultado: unknown = JSON.parse(dados);
    return Array.isArray(resultado)
      ? (resultado as PedidoImposto[])
      : [];
  } catch {
    return [];
  }
}

function formatarData(data: string): string {
  const dataValida = new Date(data);

  if (Number.isNaN(dataValida.getTime())) {
    return data;
  }

  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Maputo",
  }).format(dataValida);
}

function nomeTipoTitular(tipo?: string): string {
  switch (tipo) {
    case "cidadao":
      return "Cidadão";
    case "empresa":
      return "Empresa";
    case "instituicao":
      return "Instituição";
    default:
      return "Titular";
  }
}

function nomeOperador(
  operador: OperadorCarteira | "",
): string {
  return (
    operadores.find((item) => item.id === operador)?.nome ??
    "Não seleccionado"
  );
}

function nomeEstado(estado: EstadoPedido): string {
  switch (estado) {
    case "AGUARDA_VALIDACAO":
      return "A aguardar validação";
    case "EM_ANALISE":
      return "Em análise";
    case "CONCLUIDO":
      return "Concluído";
  }
}

export default function ImpostosPage() {
  const router = useRouter();

  const [conta, setConta] = useState<ContaLocal | null>(null);
  const [aCarregar, setACarregar] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [servicoSelecionado, setServicoSelecionado] =
    useState<ServicoImposto | null>(null);
  const [pedidos, setPedidos] = useState<PedidoImposto[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [operador, setOperador] =
    useState<OperadorCarteira | "">("");
  const [telefoneCarteira, setTelefoneCarteira] = useState("");
  const [observacao, setObservacao] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const [separador, setSeparador] = useState<"servicos" | "historico">(
    "servicos",
  );

  useEffect(() => {
    const contaAtual = obterContaAtual();

    if (!contaAtual) {
      router.replace("/entrar");
      return;
    }

    setConta(contaAtual);
    setPedidos(lerPedidos());
    setACarregar(false);
  }, [router]);

  const servicosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt");

    if (!termo) return servicos;

    return servicos.filter((servico) =>
      [
        servico.titulo,
        servico.descricao,
        servico.detalhe,
      ].some((campo) =>
        campo.toLocaleLowerCase("pt").includes(termo),
      ),
    );
  }, [pesquisa]);

  const carteiras = conta?.carteiras ?? [];

  const perfil = conta?.perfil;

  const pedidosOrdenados = useMemo(
    () =>
      [...pedidos].sort(
        (a, b) =>
          new Date(b.criadoEm).getTime() -
          new Date(a.criadoEm).getTime(),
      ),
    [pedidos],
  );

  const guardarPedidos = useCallback(
    (novosPedidos: PedidoImposto[]) => {
      try {
        localStorage.setItem(
          CHAVE_PEDIDOS,
          JSON.stringify(novosPedidos),
        );
        setPedidos(novosPedidos);
        return true;
      } catch {
        setMensagem(
          "Não foi possível guardar o pedido neste navegador.",
        );
        return false;
      }
    },
    [],
  );

  function seleccionarServico(servico: ServicoImposto) {
    setServicoSelecionado(servico);
    setMostrarFormulario(false);
    setObservacao("");
    setMensagem("");
    setSeparador("servicos");
  }

  function seleccionarCarteira(
    carteira: (typeof carteiras)[number],
  ) {
    setOperador(carteira.operador);
    setTelefoneCarteira(carteira.telefone);
    setMensagem("");
  }

  function voltarLista() {
    setServicoSelecionado(null);
    setMostrarFormulario(false);
    setMensagem("");
    setObservacao("");
  }

  function submeterPedido(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem("");

    if (!conta || !servicoSelecionado) {
      setMensagem(
        "Não foi possível identificar a conta ou o serviço seleccionado.",
      );
      return;
    }

    if (observacao.trim().length < 5) {
      setMensagem(
        "Descreva brevemente o motivo do seu pedido.",
      );
      return;
    }

    if (operador && !telefoneCarteira.trim()) {
      setMensagem(
        "Indique o número associado à carteira móvel seleccionada.",
      );
      return;
    }

    setAGuardar(true);

    try {
      const novoPedido: PedidoImposto = {
        id: `IMP-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase()}`,
        titular: conta.perfil?.nome || conta.nome,
        email: conta.email,
        nuit: conta.perfil?.nuit || "",
        tipoTitular: conta.perfil?.tipo || "cidadao",
        servicoId: servicoSelecionado.id,
        servicoTitulo: servicoSelecionado.titulo,
        mensagem: observacao.trim(),
        operador,
        telefoneCarteira: telefoneCarteira.trim(),
        estado: "AGUARDA_VALIDACAO",
        criadoEm: new Date().toISOString(),
      };

      const actualizados = [novoPedido, ...lerPedidos()];
      const guardado = guardarPedidos(actualizados);

      if (!guardado) return;

      setMensagem(
        `Pedido registado localmente. Referência interna: ${novoPedido.id}. Este registo ainda não foi enviado ao Município.`,
      );
      setObservacao("");
      setMostrarFormulario(false);
      setSeparador("historico");
    } catch {
      setMensagem(
        "Ocorreu um erro ao registar o pedido. Tente novamente.",
      );
    } finally {
      setAGuardar(false);
    }
  }

  if (aCarregar) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <LoaderCircle className="h-5 w-5 animate-spin text-emerald-700" />
          A carregar os seus dados...
        </div>
      </main>
    );
  }

  if (!conta) return null;

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <header className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Receipt className="h-6 w-6" />
              </div>

              <p className="mb-2 text-sm font-medium text-emerald-200">
                Município da Namaacha
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Impostos e Taxas
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/90 sm:text-base">
                Consulte os serviços fiscais disponíveis e registe
                pedidos de esclarecimento de forma organizada.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 md:min-w-64">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-emerald-100">
                    Conta autenticada
                  </p>
                  <p className="truncate font-semibold">
                    {conta.perfil?.nome || conta.nome}
                  </p>
                  <p className="text-xs text-emerald-100">
                    {nomeTipoTitular(conta.perfil?.tipo)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dados do titular */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Dados do titular
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Informações carregadas a partir do seu cadastro.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CampoInformacao
              rotulo="Nome do titular"
              valor={perfil?.nome || conta.nome}
            />
            <CampoInformacao
              rotulo="Tipo de titular"
              valor={nomeTipoTitular(perfil?.tipo)}
            />
            <CampoInformacao
              rotulo="E-mail"
              valor={conta.email}
            />
            <CampoInformacao
              rotulo="Telefone de contacto"
              valor={conta.telefone || "Não indicado"}
            />
            <CampoInformacao
              rotulo="NUIT"
              valor={perfil?.nuit || "Não indicado"}
            />
            <CampoInformacao
              rotulo="Endereço"
              valor={perfil?.endereco || "Não indicado"}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Estes dados são apresentados a partir do cadastro local.
            Confirme a sua exactidão antes de tratar de assuntos fiscais.
          </p>
        </section>

        {/* Carteiras móveis */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Carteiras móveis registadas
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pode seleccionar uma carteira ao preparar o seu pedido.
                A selecção não inicia um pagamento.
              </p>
            </div>
          </div>

          {carteiras.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {carteiras.map((carteira) => {
                const seleccionado =
                  operador === carteira.operador &&
                  telefoneCarteira === carteira.telefone;

                const estilo =
                  operadores.find(
                    (item) => item.id === carteira.operador,
                  )?.cor ?? "border-slate-200 bg-slate-50 text-slate-700";

                return (
                  <button
                    key={carteira.id}
                    type="button"
                    onClick={() => seleccionarCarteira(carteira)}
                    className={`rounded-xl border p-4 text-left transition ${
                      seleccionado
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                        : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${estilo}`}
                      >
                        {nomeOperador(carteira.operador)}
                      </span>

                      {carteira.principal && (
                        <span className="text-xs font-medium text-slate-500">
                          Principal
                        </span>
                      )}

                      {seleccionado && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                      )}
                    </div>

                    <p className="font-semibold text-slate-900">
                      {carteira.telefone}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Seleccionar esta carteira
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700">
                Não existem carteiras móveis registadas.
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Pode registar um pedido sem seleccionar uma carteira.
                Não é necessário indicar dados de pagamento para solicitar
                esclarecimentos fiscais.
              </p>
            </div>
          )}
        </section>

        {/* Navegação */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSeparador("servicos");
              setServicoSelecionado(null);
              setMensagem("");
            }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              separador === "servicos"
                ? "bg-emerald-800 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Serviços fiscais
          </button>

          <button
            type="button"
            onClick={() => {
              setSeparador("historico");
              setServicoSelecionado(null);
              setMensagem("");
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              separador === "historico"
                ? "bg-emerald-800 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Clock3 className="h-4 w-4" />
            Meus pedidos
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
              {pedidos.length}
            </span>
          </button>
        </div>

        {/* Mensagens */}
        {mensagem && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="min-w-0 break-words">{mensagem}</p>
            <button
              type="button"
              onClick={() => setMensagem("")}
              className="ml-auto rounded-lg p-1 hover:bg-emerald-100"
              aria-label="Fechar mensagem"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Serviços fiscais */}
        {separador === "servicos" && !servicoSelecionado && (
          <section>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Serviços disponíveis
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Seleccione um serviço para consultar os detalhes e
                  registar um pedido.
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={pesquisa}
                  onChange={(evento) =>
                    setPesquisa(evento.target.value)
                  }
                  placeholder="Pesquisar impostos e taxas..."
                  aria-label="Pesquisar impostos e taxas"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            {servicosFiltrados.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {servicosFiltrados.map((servico) => {
                  const Icon = servico.icon;

                  return (
                    <button
                      key={servico.id}
                      type="button"
                      onClick={() => seleccionarServico(servico)}
                      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:p-6"
                    >
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${servico.fundo} ${servico.cor}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {servico.titulo}
                      </h3>

                      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                        {servico.descricao}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-emerald-800">
                        Consultar detalhes
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 font-semibold text-slate-800">
                  Nenhum serviço encontrado
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Experimente pesquisar por outro termo.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Detalhes do serviço */}
        {separador === "servicos" && servicoSelecionado && (
          <section>
            <button
              type="button"
              onClick={voltarLista}
              className="mb-5 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-slate-600 hover:text-emerald-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar aos serviços
            </button>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${servicoSelecionado.fundo} ${servicoSelecionado.cor}`}
                  >
                    {(() => {
                      const Icon = servicoSelecionado.icon;
                      return <Icon className="h-7 w-7" />;
                    })()}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      Serviço fiscal
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                      {servicoSelecionado.titulo}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {servicoSelecionado.descricao}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Sobre este serviço
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {servicoSelecionado.detalhe}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Finalidade do pedido
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {servicoSelecionado.finalidade}
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" />
                      <div>
                        <p className="text-sm font-semibold text-amber-950">
                          Informação importante
                        </p>
                        <p className="mt-1 text-sm leading-6 text-amber-900">
                          Esta funcionalidade regista pedidos no navegador.
                          Não consulta ainda a base de dados tributária
                          municipal, não calcula dívidas e não confirma
                          pagamentos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {!mostrarFormulario ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarFormulario(true);
                        setMensagem("");
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-900 sm:w-auto"
                    >
                      Registar pedido de consulta
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <form
                      onSubmit={submeterPedido}
                      className="space-y-5 border-t border-slate-200 pt-6"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Novo pedido
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Explique o que pretende esclarecer.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <CampoInformacao
                          rotulo="Titular"
                          valor={perfil?.nome || conta.nome}
                        />
                        <CampoInformacao
                          rotulo="Serviço"
                          valor={servicoSelecionado.titulo}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="observacao-imposto"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Descrição do pedido
                        </label>
                        <textarea
                          id="observacao-imposto"
                          value={observacao}
                          onChange={(evento) =>
                            setObservacao(evento.target.value)
                          }
                          rows={4}
                          maxLength={1500}
                          required
                          minLength={5}
                          placeholder="Descreva a informação ou o esclarecimento de que necessita..."
                          className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        />
                        <p className="mt-1 text-right text-xs text-slate-400">
                          {observacao.length}/1500
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="operador-imposto"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Carteira móvel (opcional)
                        </label>
                        <select
                          id="operador-imposto"
                          value={operador}
                          onChange={(evento) => {
                            const valor = evento.target.value as
                              | OperadorCarteira
                              | "";

                            setOperador(valor);

                            const carteira = carteiras.find(
                              (item) => item.operador === valor,
                            );

                            if (carteira) {
                              setTelefoneCarteira(carteira.telefone);
                            } else if (!valor) {
                              setTelefoneCarteira("");
                            }
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        >
                          <option value="">
                            Não seleccionar carteira
                          </option>
                          {operadores.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.nome}
                            </option>
                          ))}
                        </select>
                      </div>

                      {operador && (
                        <div>
                          <label
                            htmlFor="telefone-carteira"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Número da carteira
                          </label>
                          <input
                            id="telefone-carteira"
                            type="tel"
                            value={telefoneCarteira}
                            onChange={(evento) =>
                              setTelefoneCarteira(evento.target.value)
                            }
                            required
                            maxLength={30}
                            placeholder="Número associado à carteira"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                          />
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Este número será incluído no pedido. Não será
                            iniciado qualquer pagamento.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => {
                            setMostrarFormulario(false);
                            setMensagem("");
                          }}
                          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Cancelar
                        </button>

                        <button
                          type="submit"
                          disabled={aGuardar}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {aGuardar && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          )}
                          {aGuardar
                            ? "A registar..."
                            : "Registar pedido"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-900">
                  Resumo do pedido
                </h3>

                <div className="mt-5 space-y-4">
                  <LinhaResumo
                    rotulo="Titular"
                    valor={perfil?.nome || conta.nome}
                  />
                  <LinhaResumo
                    rotulo="Tipo de titular"
                    valor={nomeTipoTitular(perfil?.tipo)}
                  />
                  <LinhaResumo
                    rotulo="NUIT"
                    valor={perfil?.nuit || "Não indicado"}
                  />
                  <LinhaResumo
                    rotulo="Carteira seleccionada"
                    valor={
                      operador
                        ? `${nomeOperador(operador)} — ${telefoneCarteira || "Sem número"}`
                        : "Nenhuma"
                    }
                  />
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs leading-5 text-slate-600">
                    Os dados são apresentados para conferência. A submissão
                    neste protótipo não substitui a entrega oficial de
                    documentos ou o atendimento municipal.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* Histórico */}
        {separador === "historico" && (
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Histórico dos meus pedidos
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Consulte os pedidos guardados neste navegador.
              </p>
            </div>

            {pedidosOrdenados.length > 0 ? (
              <div className="space-y-4">
                {pedidosOrdenados.map((pedido) => (
                  <article
                    key={pedido.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                            {nomeEstado(pedido.estado)}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatarData(pedido.criadoEm)}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900">
                          {pedido.servicoTitulo}
                        </h3>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          Referência interna: {pedido.id}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const servico = servicos.find(
                            (item) => item.id === pedido.servicoId,
                          );

                          if (servico) {
                            setServicoSelecionado(servico);
                            setSeparador("servicos");
                            setMostrarFormulario(false);
                            setMensagem("");
                          }
                        }}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Ver serviço
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                      <CampoInformacao
                        rotulo="Titular"
                        valor={pedido.titular}
                      />
                      <CampoInformacao
                        rotulo="NUIT"
                        valor={pedido.nuit || "Não indicado"}
                      />
                      <CampoInformacao
                        rotulo="Carteira móvel"
                        valor={
                          pedido.operador
                            ? `${nomeOperador(pedido.operador)} — ${pedido.telefoneCarteira}`
                            : "Não seleccionada"
                        }
                      />
                      <CampoInformacao
                        rotulo="Estado"
                        valor={nomeEstado(pedido.estado)}
                      />
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Descrição do pedido
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {pedido.mensagem}
                      </p>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-amber-800">
                      Registo local: o estado não representa confirmação
                      de recepção, análise ou conclusão pelo Município.
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Receipt className="h-7 w-7" />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Ainda não existem pedidos
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Quando registar um pedido de esclarecimento fiscal,
                  poderá consultá-lo nesta secção.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSeparador("servicos");
                    setServicoSelecionado(null);
                    setMensagem("");
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                >
                  Explorar serviços
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* Nota institucional */}
        <footer className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Nota sobre os serviços digitais
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Esta versão utiliza o armazenamento local do navegador.
                Os pedidos não são partilhados automaticamente com os
                serviços municipais e podem não estar disponíveis noutro
                dispositivo ou navegador. Para consultas fiscais oficiais,
                será necessária uma integração com o sistema tributário
                municipal e mecanismos adequados de autenticação,
                autorização e protecção dos dados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function CampoInformacao({
  rotulo,
  valor,
}: {
  rotulo: string;
  valor: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{rotulo}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {valor || "Não indicado"}
      </p>
    </div>
  );
}

function LinhaResumo({
  rotulo,
  valor,
}: {
  rotulo: string;
  valor: string;
}) {
  return (
    <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <p className="text-xs text-slate-500">{rotulo}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {valor || "Não indicado"}
      </p>
    </div>
  );
}
