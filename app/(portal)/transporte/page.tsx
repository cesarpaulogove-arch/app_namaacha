
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
  Bus,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  Truck,
  UserRound,
  X,
  LoaderCircle,
} from "lucide-react";
import {
  obterContaAtual,
  type ContaLocal,
} from "@/lib/auth-local";

type ServicoTransporte = {
  id: string;
  titulo: string;
  descricao: string;
  detalhe: string;
  passos: string[];
  icon: typeof Bus;
  cor: string;
  fundo: string;
};

const servicos: ServicoTransporte[] = [
  {
    id: "licenca",
    titulo: "Licença de Transporte",
    descricao: "Prepare um pedido de licença de transporte.",
    detalhe:
      "Organize os dados necessários para solicitar uma licença de transporte, sujeito à validação dos serviços competentes.",
    passos: [
      "Confirme os dados do requerente ou da empresa.",
      "Indique a actividade de transporte pretendida.",
      "Identifique os veículos envolvidos, quando aplicável.",
      "Confirme os documentos e requisitos oficiais.",
    ],
    icon: Bus,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
  },
  {
    id: "renovacao",
    titulo: "Renovação de Licença",
    descricao: "Prepare um pedido de renovação.",
    detalhe:
      "Registe os dados da licença existente e solicite orientação sobre a sua renovação.",
    passos: [
      "Identifique a licença a renovar.",
      "Indique a referência da licença actual.",
      "Confirme os dados do requerente e do veículo.",
      "Verifique os requisitos e prazos aplicáveis.",
    ],
    icon: CalendarDays,
    cor: "text-amber-700",
    fundo: "bg-amber-50",
  },
  {
    id: "autorizacoes",
    titulo: "Consultar Autorizações",
    descricao: "Registe um pedido de informação sobre um processo.",
    detalhe:
      "Prepare uma solicitação de informação sobre uma autorização ou processo de transporte.",
    passos: [
      "Indique a referência do processo, se existir.",
      "Descreva a informação pretendida.",
      "Confirme os dados de contacto.",
      "Solicite a confirmação oficial junto dos serviços competentes.",
    ],
    icon: ClipboardList,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
  },
  {
    id: "veiculos",
    titulo: "Registo de Veículos",
    descricao: "Organize os dados de um veículo.",
    detalhe:
      "Registe os dados básicos de um veículo para preparar um pedido relacionado com a actividade de transporte.",
    passos: [
      "Indique a matrícula do veículo.",
      "Identifique o proprietário ou responsável.",
      "Indique o tipo e a utilização do veículo.",
      "Confirme a documentação necessária.",
    ],
    icon: Truck,
    cor: "text-violet-700",
    fundo: "bg-violet-50",
  },
  {
    id: "operadores",
    titulo: "Registo de Operadores",
    descricao: "Prepare os dados do operador de transporte.",
    detalhe:
      "Organize a identificação e os contactos do operador ou da empresa que exerce ou pretende exercer uma actividade de transporte.",
    passos: [
      "Confirme o nome do operador ou da empresa.",
      "Indique os contactos de comunicação.",
      "Descreva a actividade desenvolvida.",
      "Confirme os requisitos oficiais de registo.",
    ],
    icon: UserRound,
    cor: "text-cyan-700",
    fundo: "bg-cyan-50",
  },
  {
    id: "fiscalizacao",
    titulo: "Requisitos e Fiscalização",
    descricao: "Registe dúvidas sobre requisitos de transporte.",
    detalhe:
      "Prepare um pedido de esclarecimento sobre documentação, requisitos ou condições aplicáveis à actividade de transporte.",
    passos: [
      "Identifique a actividade de transporte.",
      "Descreva a dúvida ou questão.",
      "Indique a localidade de operação.",
      "Confirme os requisitos com os serviços responsáveis.",
    ],
    icon: ShieldCheck,
    cor: "text-rose-700",
    fundo: "bg-rose-50",
  },
];

type EstadoPedido =
  | "AGUARDA_VALIDACAO"
  | "EM_ANALISE"
  | "CONCLUIDO";

type PedidoTransporte = {
  id: string;
  contaId: string;
  requerente: string;
  email: string;
  contacto: string;
  nuit: string;
  tipoTitular: string;
  entidade: string;
  tipoPedido: string;
  actividade: string;
  matricula: string;
  referenciaLicenca: string;
  tipoVeiculo: string;
  localidade: string;
  descricao: string;
  estado: EstadoPedido;
  criadoEm: string;
};

const CHAVE_PEDIDOS = "namaacha_pedidos_transporte";

const campo =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function lerPedidos(): PedidoTransporte[] {
  if (typeof window === "undefined") return [];

  try {
    const dados = localStorage.getItem(CHAVE_PEDIDOS);
    if (!dados) return [];

    const resultado: unknown = JSON.parse(dados);
    return Array.isArray(resultado)
      ? (resultado as PedidoTransporte[])
      : [];
  } catch {
    return [];
  }
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

function formatarData(valor: string): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return valor;

  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Maputo",
  }).format(data);
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
      <p className="text-xs text-slate-500">{rotulo}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {valor || "Não indicado"}
      </p>
    </div>
  );
}

export default function TransportePage() {
  const router = useRouter();

  const [conta, setConta] = useState<ContaLocal | null>(null);
  const [aCarregar, setACarregar] = useState(true);

  const [pesquisa, setPesquisa] = useState("");
  const [seleccionado, setSeleccionado] =
    useState<ServicoTransporte | null>(null);
  const [mostrarPedido, setMostrarPedido] = useState(false);
  const [separador, setSeparador] = useState<"servicos" | "historico">(
    "servicos",
  );

  const [pedidos, setPedidos] = useState<PedidoTransporte[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  const [requerente, setRequerente] = useState("");
  const [contacto, setContacto] = useState("");
  const [entidade, setEntidade] = useState("");
  const [tipoPedido, setTipoPedido] = useState("");
  const [actividade, setActividade] = useState("");
  const [matricula, setMatricula] = useState("");
  const [referenciaLicenca, setReferenciaLicenca] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    const contaAtual = obterContaAtual();

    if (!contaAtual) {
      router.replace("/entrar");
      return;
    }

    setConta(contaAtual);
    setRequerente(contaAtual.perfil?.nome || contaAtual.nome);
    setContacto(contaAtual.telefone || "");
    setEntidade(
      contaAtual.perfil?.tipo === "empresa" ||
        contaAtual.perfil?.tipo === "instituicao"
        ? contaAtual.perfil.nome
        : "",
    );
    setPedidos(lerPedidos());
    setACarregar(false);
  }, [router]);

  const filtrados = useMemo(() => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt");

    if (!termo) return servicos;

    return servicos.filter((servico) =>
      [
        servico.titulo,
        servico.descricao,
        servico.detalhe,
      ].some((texto) =>
        texto.toLocaleLowerCase("pt").includes(termo),
      ),
    );
  }, [pesquisa]);

  const meusPedidos = useMemo(() => {
    if (!conta) return [];

    return pedidos
      .filter((pedido) => pedido.contaId === conta.id)
      .sort(
        (a, b) =>
          new Date(b.criadoEm).getTime() -
          new Date(a.criadoEm).getTime(),
      );
  }, [pedidos, conta]);

  const guardarPedidos = useCallback(
    (novosPedidos: PedidoTransporte[]) => {
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

  function limparFormulario() {
    setMensagem("");
    setActividade("");
    setMatricula("");
    setReferenciaLicenca("");
    setTipoVeiculo("");
    setLocalidade("");
    setDescricao("");
  }

  function voltar() {
    setMensagem("");

    if (mostrarPedido) {
      setMostrarPedido(false);
      return;
    }

    if (seleccionado) {
      setSeleccionado(null);
      return;
    }

    if (separador === "historico") {
      setSeparador("servicos");
      return;
    }

    router.back();
  }

  function abrirPedido() {
    if (!seleccionado) return;

    limparFormulario();
    setMostrarPedido(true);

    const tipos: Record<string, string> = {
      licenca: "Nova licença de transporte",
      renovacao: "Renovação de licença",
      veiculos: "Registo de veículo",
      operadores: "Registo de operador",
      autorizacoes: "Consulta de autorização",
      fiscalizacao: "Pedido de esclarecimento",
    };

    setTipoPedido(tipos[seleccionado.id] || "");
  }

  function validarPedido(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem("");

    if (!conta || !seleccionado) {
      setMensagem(
        "Não foi possível identificar a conta ou o serviço seleccionado.",
      );
      return;
    }

    if (
      requerente.trim().length < 2 ||
      contacto.trim().length < 5 ||
      !tipoPedido ||
      !actividade ||
      localidade.trim().length < 2 ||
      descricao.trim().length < 5
    ) {
      setMensagem(
        "Verifique os campos obrigatórios e introduza dados válidos.",
      );
      return;
    }

    if (
      ["veiculos", "licenca", "renovacao"].includes(seleccionado.id) &&
      !matricula.trim()
    ) {
      setMensagem(
        "Indique a matrícula do veículo para este tipo de pedido.",
      );
      return;
    }

    if (
      seleccionado.id === "renovacao" &&
      !referenciaLicenca.trim()
    ) {
      setMensagem(
        "Indique a referência da licença que pretende renovar.",
      );
      return;
    }

    setAGuardar(true);

    try {
      const novoPedido: PedidoTransporte = {
        id: `TRP-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase()}`,
        contaId: conta.id,
        requerente: requerente.trim(),
        email: conta.email,
        contacto: contacto.trim(),
        nuit: conta.perfil?.nuit || "",
        tipoTitular: conta.perfil?.tipo || "cidadao",
        entidade: entidade.trim(),
        tipoPedido,
        actividade,
        matricula: matricula.trim(),
        referenciaLicenca: referenciaLicenca.trim(),
        tipoVeiculo,
        localidade: localidade.trim(),
        descricao: descricao.trim(),
        estado: "AGUARDA_VALIDACAO",
        criadoEm: new Date().toISOString(),
      };

      const todos = [novoPedido, ...lerPedidos()];

      if (!guardarPedidos(todos)) return;

      setMensagem(
        `Pedido guardado localmente. Referência interna: ${novoPedido.id}. O pedido ainda não foi enviado aos serviços municipais.`,
      );
      setMostrarPedido(false);
      setSeparador("historico");
    } catch {
      setMensagem(
        "Ocorreu um erro ao guardar o pedido. Tente novamente.",
      );
    } finally {
      setAGuardar(false);
    }
  }

  if (aCarregar) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <LoaderCircle className="h-6 w-6 animate-spin text-emerald-700" />
        <span className="ml-3 text-sm text-slate-600">
          A carregar os seus dados...
        </span>
      </main>
    );
  }

  if (!conta) return null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
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
              Transporte
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Município de Namaacha
            </p>
          </div>

          <div className="h-10 w-10 shrink-0" />
        </header>

        <section className="mb-6 rounded-2xl bg-blue-950 p-5 text-white sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-100">
              <Bus size={26} />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-200">
                Município da Namaacha
              </p>
              <h2 className="mt-1 text-xl font-bold">
                Serviços de Transporte
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-100">
                Prepare pedidos de licença, renovações e registos
                de transporte a partir dos dados do seu cadastro.
              </p>
            </div>
          </div>
        </section>

        {/* Dados do titular autenticado */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Dados do requerente
              </h2>
              <p className="text-xs text-slate-500">
                Carregados automaticamente do seu cadastro.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CampoInformacao
              rotulo="Nome"
              valor={conta.perfil?.nome || conta.nome}
            />
            <CampoInformacao
              rotulo="Tipo de titular"
              valor={nomeTipoTitular(conta.perfil?.tipo)}
            />
            <CampoInformacao
              rotulo="E-mail"
              valor={conta.email}
            />
            <CampoInformacao
              rotulo="Telefone"
              valor={conta.telefone || "Não indicado"}
            />
            <CampoInformacao
              rotulo="NUIT"
              valor={conta.perfil?.nuit || "Não indicado"}
            />
            <CampoInformacao
              rotulo="Endereço"
              valor={conta.perfil?.endereco || "Não indicado"}
            />
          </div>
        </section>

        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSeparador("servicos");
              setSeleccionado(null);
              setMostrarPedido(false);
              setMensagem("");
            }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
              separador === "servicos"
                ? "bg-emerald-800 text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            Serviços disponíveis
          </button>

          <button
            type="button"
            onClick={() => {
              setSeparador("historico");
              setSeleccionado(null);
              setMostrarPedido(false);
              setMensagem("");
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
              separador === "historico"
                ? "bg-emerald-800 text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            <Clock3 size={16} />
            Meus pedidos ({meusPedidos.length})
          </button>
        </div>

        {mensagem && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="min-w-0 flex-1 break-words">{mensagem}</p>
            <button
              type="button"
              onClick={() => setMensagem("")}
              aria-label="Fechar mensagem"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {separador === "historico" ? (
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Histórico de pedidos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pedidos guardados neste navegador.
              </p>
            </div>

            {meusPedidos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <ClipboardList
                  size={32}
                  className="mx-auto text-slate-400"
                />
                <h3 className="mt-3 font-semibold text-slate-900">
                  Ainda não tem pedidos
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Os pedidos registados aparecerão aqui.
                </p>
                <button
                  type="button"
                  onClick={() => setSeparador("servicos")}
                  className="mt-5 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                  Consultar serviços
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {meusPedidos.map((pedido) => (
                  <article
                    key={pedido.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                          {nomeEstado(pedido.estado)}
                        </span>
                        <h3 className="mt-3 font-bold text-slate-900">
                          {pedido.tipoPedido}
                        </h3>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          Referência interna: {pedido.id}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {formatarData(pedido.criadoEm)}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                      <CampoInformacao
                        rotulo="Requerente"
                        valor={pedido.requerente}
                      />
                      <CampoInformacao
                        rotulo="Actividade"
                        valor={pedido.actividade}
                      />
                      <CampoInformacao
                        rotulo="Matrícula"
                        valor={pedido.matricula || "Não indicada"}
                      />
                      <CampoInformacao
                        rotulo="Localidade"
                        valor={pedido.localidade}
                      />
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Descrição
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {pedido.descricao}
                      </p>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-amber-800">
                      Este é um registo local. O estado não confirma
                      recepção nem aprovação pelos serviços municipais.
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : mostrarPedido && seleccionado ? (
          <section>
            <button
              type="button"
              onClick={() => {
                setMostrarPedido(false);
                setMensagem("");
              }}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-800"
            >
              <ArrowLeft size={17} />
              Voltar aos detalhes
            </button>

            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                {tipoPedido}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Confirme os dados e descreva o pedido que pretende
                apresentar aos serviços competentes.
              </p>
            </div>

            <form
              onSubmit={validarPedido}
              className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="requerente"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Nome do requerente *
                  </label>
                  <input
                    id="requerente"
                    required
                    maxLength={120}
                    autoComplete="name"
                    value={requerente}
                    onChange={(e) => setRequerente(e.target.value)}
                    className={campo}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contacto"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Contacto telefónico *
                  </label>
                  <input
                    id="contacto"
                    type="tel"
                    required
                    maxLength={30}
                    autoComplete="tel"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    className={campo}
                  />
                </div>

                <div>
                  <label
                    htmlFor="entidade"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Empresa ou operador
                  </label>
                  <input
                    id="entidade"
                    maxLength={150}
                    value={entidade}
                    onChange={(e) => setEntidade(e.target.value)}
                    placeholder="Nome da empresa, se aplicável"
                    className={campo}
                  />
                </div>

                <div>
                  <label
                    htmlFor="tipoPedido"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Tipo de pedido *
                  </label>
                  <select
                    id="tipoPedido"
                    required
                    value={tipoPedido}
                    onChange={(e) => setTipoPedido(e.target.value)}
                    className={campo}
                  >
                    <option value="">Seleccione</option>
                    <option value="Nova licença de transporte">
                      Nova licença de transporte
                    </option>
                    <option value="Renovação de licença">
                      Renovação de licença
                    </option>
                    <option value="Registo de veículo">
                      Registo de veículo
                    </option>
                    <option value="Registo de operador">
                      Registo de operador
                    </option>
                    <option value="Consulta de autorização">
                      Consulta de autorização
                    </option>
                    <option value="Pedido de esclarecimento">
                      Pedido de esclarecimento
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="actividade"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Actividade de transporte *
                  </label>
                  <select
                    id="actividade"
                    required
                    value={actividade}
                    onChange={(e) => setActividade(e.target.value)}
                    className={campo}
                  >
                    <option value="">Seleccione a actividade</option>
                    <option value="Transporte de passageiros">
                      Transporte de passageiros
                    </option>
                    <option value="Transporte de mercadorias">
                      Transporte de mercadorias
                    </option>
                    <option value="Transporte escolar">
                      Transporte escolar
                    </option>
                    <option value="Transporte de carga">
                      Transporte de carga
                    </option>
                    <option value="Transporte em táxi">
                      Transporte em táxi
                    </option>
                    <option value="Outra actividade">
                      Outra actividade
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="localidade"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Localidade de operação *
                  </label>
                  <input
                    id="localidade"
                    required
                    maxLength={200}
                    value={localidade}
                    onChange={(e) => setLocalidade(e.target.value)}
                    placeholder="Ex.: Vila de Namaacha"
                    className={campo}
                  />
                </div>

                <div>
                  <label
                    htmlFor="matricula"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Matrícula do veículo
                    {["licenca", "renovacao", "veiculos"].includes(
                      seleccionado.id,
                    ) && " *"}
                  </label>
                  <input
                    id="matricula"
                    required={["licenca", "renovacao", "veiculos"].includes(
                      seleccionado.id,
                    )}
                    maxLength={30}
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Matrícula do veículo"
                    className={campo}
                  />
                </div>

                <div>
                  <label
                    htmlFor="referenciaLicenca"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Referência da licença
                    {seleccionado.id === "renovacao" && " *"}
                  </label>
                  <input
                    id="referenciaLicenca"
                    required={seleccionado.id === "renovacao"}
                    maxLength={100}
                    value={referenciaLicenca}
                    onChange={(e) =>
                      setReferenciaLicenca(e.target.value)
                    }
                    placeholder="Referência, se aplicável"
                    className={campo}
                  />
                </div>

                <div>
                  <label
                    htmlFor="tipoVeiculo"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Tipo de veículo
                  </label>
                  <select
                    id="tipoVeiculo"
                    value={tipoVeiculo}
                    onChange={(e) => setTipoVeiculo(e.target.value)}
                    className={campo}
                  >
                    <option value="">Seleccione, se aplicável</option>
                    <option value="Ligeiro">Ligeiro</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Autocarro">Autocarro</option>
                    <option value="Carrinha">Carrinha</option>
                    <option value="Camião">Camião</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="descricao"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Descrição do pedido *
                </label>
                <textarea
                  id="descricao"
                  required
                  minLength={5}
                  maxLength={2000}
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Explique o pedido e indique informações adicionais relevantes."
                  className={campo}
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {descricao.length}/2000
                </p>
              </div>

              {mensagem && (
                <div
                  role="status"
                  className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
                >
                  {mensagem}
                </div>
              )}

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  <p className="text-xs leading-5 text-slate-600">
                    O pedido será guardado localmente no navegador.
                    Não será enviado automaticamente ao Município,
                    nem representa uma licença ou autorização aprovada.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={aGuardar}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aGuardar && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                {aGuardar ? "A guardar..." : "Guardar pedido"}
              </button>
            </form>
          </section>
        ) : seleccionado ? (
          <section>
            <button
              type="button"
              onClick={() => {
                setSeleccionado(null);
                setMensagem("");
              }}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-800"
            >
              <ArrowLeft size={17} />
              Voltar aos serviços
            </button>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
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
                    className="flex gap-3 text-sm leading-6 text-slate-600"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />
                    <span>{passo}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-6 text-amber-950">
                  A aplicação ainda não está ligada ao sistema municipal
                  de transporte. O registo local não confirma a recepção,
                  aprovação ou emissão de licença.
                </p>
              </div>

              <button
                type="button"
                onClick={abrirPedido}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3.5 text-sm font-semibold text-white hover:bg-emerald-900"
              >
                Preparar pedido
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Serviços disponíveis
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Seleccione um serviço para consultar os detalhes e
                preparar o seu pedido.
              </p>
            </div>

            <label className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-emerald-600">
              <Search size={19} className="shrink-0 text-slate-400" />
              <input
                type="search"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Pesquisar serviço..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                aria-label="Pesquisar serviços de transporte"
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

            <section className="space-y-3">
              {filtrados.map((servico) => {
                const Icon = servico.icon;

                return (
                  <button
                    key={servico.id}
                    type="button"
                    onClick={() => {
                      setSeleccionado(servico);
                      setMensagem("");
                    }}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-md"
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

              {filtrados.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <Search
                    size={28}
                    className="mx-auto text-slate-400"
                  />
                  <p className="mt-3 font-semibold text-slate-900">
                    Nenhum serviço encontrado
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Experimente outro termo de pesquisa.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <MapPin
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Informação municipal
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Confirme os requisitos, documentos e taxas junto
                    dos serviços competentes antes de iniciar a
                    actividade de transporte.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
