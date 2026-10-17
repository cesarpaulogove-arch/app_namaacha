
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  FileText,
  MapPin,
  ShieldCheck,
  Smartphone,
  Store,
} from "lucide-react";
import {
  obterContaAtual,
  type ContaLocal,
} from "@/lib/auth-local";

type TipoServico = "taxa" | "bancas" | "ocupacao";

type EstadoPedido =
  | "PENDENTE_DE_TAXA"
  | "PENDENTE_DE_PAGAMENTO"
  | "PENDENTE_DE_CONFIRMACAO"
  | "PENDENTE_DE_ANALISE"
  | "AUTORIZADO"
  | "REJEITADO"
  | "CONSULTA_REGISTADA";

type ServicoMercado = {
  id: TipoServico;
  titulo: string;
  descricao: string;
  detalhe: string;
  passos: string[];
  icon: typeof Store;
  cor: string;
  fundo: string;
  exigePagamento: boolean;
};

type PedidoMercado = {
  id: string;
  titularId: string;
  titularNome: string;
  titularEmail: string;
  titularTelefone: string;
  tipoTitular: string;
  nuit: string;
  documentoIdentificacao: string;
  numeroRegisto: string;
  tipoInstituicao: string;
  endereco: string;
  servicoId: TipoServico;
  servico: string;
  mercado: string;
  actividade: string;
  periodo: string;
  metodoPagamento: string;
  telefonePagamento: string;
  valorTaxa: string;
  referenciaMunicipal: string;
  referenciaTransacao: string;
  estado: EstadoPedido;
  criadoEm: string;
};

const CHAVE_PEDIDOS = "namaacha_pedidos_mercados";

const servicos: ServicoMercado[] = [
  {
    id: "taxa",
    titulo: "Pagamento de Taxa",
    descricao: "Consultar taxas",
    detalhe:
      "Consulte as taxas de ocupação e utilização dos mercados municipais. O valor e a referência devem ser emitidos ou confirmados pelos serviços municipais.",
    passos: [
      "Identifique o mercado e a banca.",
      "Indique o período da taxa.",
      "Aguarde a determinação do valor oficial, se ainda não estiver disponível.",
      "Utilize os dados oficiais para efectuar o pagamento.",
      "Aguarde a confirmação da transacção.",
    ],
    icon: CalendarDays,
    cor: "text-amber-700",
    fundo: "bg-amber-50",
    exigePagamento: true,
  },
  {
    id: "bancas",
    titulo: "Autorização de Bancas",
    descricao: "Solicitar uma banca",
    detalhe:
      "Registe um pedido para atribuição ou utilização de uma banca. O Município deverá validar a disponibilidade, os requisitos e eventuais taxas aplicáveis.",
    passos: [
      "Seleccione o mercado pretendido.",
      "Indique a actividade comercial.",
      "Submeta os dados e documentos exigidos.",
      "Aguarde a análise dos serviços municipais.",
      "Pague a taxa, caso seja aplicável, utilizando os dados oficiais.",
      "Aguarde a confirmação do pagamento e a decisão final.",
    ],
    icon: ClipboardList,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
    exigePagamento: true,
  },
  {
    id: "ocupacao",
    titulo: "Consultar Ocupação",
    descricao: "Ver disponibilidade",
    detalhe:
      "Registe uma consulta sobre a disponibilidade de espaços comerciais. A informação depende dos registos actualizados do Município.",
    passos: [
      "Indique o mercado pretendido.",
      "Descreva o tipo de espaço ou actividade.",
      "Registe a consulta.",
      "Aguarde a resposta dos serviços municipais.",
    ],
    icon: Store,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
    exigePagamento: false,
  },
];

const operadores = [
  {
    id: "mpesa",
    nome: "M-Pesa",
    fundo: "bg-red-50",
    cor: "text-red-700",
  },
  {
    id: "emola",
    nome: "e-Mola",
    fundo: "bg-orange-50",
    cor: "text-orange-700",
  },
  {
    id: "mkesh",
    nome: "mKesh",
    fundo: "bg-blue-50",
    cor: "text-blue-700",
  },
];

function gerarId(): string {
  return `MRC-${Date.now().toString(36).toUpperCase()}`;
}

function lerPedidos(): PedidoMercado[] {
  if (typeof window === "undefined") return [];

  try {
    const dados = localStorage.getItem(CHAVE_PEDIDOS);
    if (!dados) return [];

    const resultado: unknown = JSON.parse(dados);

    return Array.isArray(resultado)
      ? (resultado as PedidoMercado[])
      : [];
  } catch {
    return [];
  }
}

function guardarPedido(pedido: PedidoMercado): void {
  const pedidos = lerPedidos();

  localStorage.setItem(
    CHAVE_PEDIDOS,
    JSON.stringify([pedido, ...pedidos]),
  );
}

function textoTipoTitular(tipo: ContaLocal["perfil"]["tipo"]): string {
  switch (tipo) {
    case "empresa":
      return "Empresa";
    case "instituicao":
      return "Instituição";
    default:
      return "Cidadão";
  }
}

function textoEstado(estado: EstadoPedido): string {
  const estados: Record<EstadoPedido, string> = {
    PENDENTE_DE_TAXA: "A aguardar determinação da taxa",
    PENDENTE_DE_PAGAMENTO: "Pendente de pagamento",
    PENDENTE_DE_CONFIRMACAO: "A aguardar confirmação do pagamento",
    PENDENTE_DE_ANALISE: "Em análise municipal",
    AUTORIZADO: "Autorizado pelo Município",
    REJEITADO: "Pedido rejeitado",
    CONSULTA_REGISTADA: "Consulta registada",
  };

  return estados[estado];
}

function formatarData(data: string): string {
  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return "Data indisponível";
  }

  return valor.toLocaleString("pt-MZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatarValor(valor: string): string {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) return valor;

  return numero.toLocaleString("pt-MZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function MercadosPage() {
  const [contaAtual, setContaAtual] = useState<ContaLocal | null>(null);
  const [carregouConta, setCarregouConta] = useState(false);

  const [seleccionado, setSeleccionado] =
    useState<ServicoMercado | null>(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarPedidos, setMostrarPedidos] = useState(false);

  const [mercado, setMercado] = useState("");
  const [actividade, setActividade] = useState("");
  const [periodo, setPeriodo] = useState("");

  const [operadorPagamento, setOperadorPagamento] = useState("");
  const [telefonePagamento, setTelefonePagamento] = useState("");
  const [valorTaxa, setValorTaxa] = useState("");
  const [referenciaMunicipal, setReferenciaMunicipal] = useState("");
  const [referenciaTransacao, setReferenciaTransacao] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro">(
    "sucesso",
  );

  const [ultimoPedido, setUltimoPedido] =
    useState<PedidoMercado | null>(null);

  const [pedidos, setPedidos] = useState<PedidoMercado[]>([]);

  useEffect(() => {
    setContaAtual(obterContaAtual());
    setCarregouConta(true);
  }, []);

  const carteiras = contaAtual?.carteiras ?? [];

  function limparFormulario() {
    setMercado("");
    setActividade("");
    setPeriodo("");
    setOperadorPagamento("");
    setTelefonePagamento("");
    setValorTaxa("");
    setReferenciaMunicipal("");
    setReferenciaTransacao("");
    setMensagem("");
    setUltimoPedido(null);
  }

  function voltar() {
    if (ultimoPedido) {
      setUltimoPedido(null);
      setMensagem("");
    } else if (mostrarFormulario) {
      setMostrarFormulario(false);
      setMensagem("");
    } else if (mostrarPedidos) {
      setMostrarPedidos(false);
    } else if (seleccionado) {
      setSeleccionado(null);
    } else {
      window.history.back();
    }
  }

  function abrirServico(servico: ServicoMercado) {
    setSeleccionado(servico);
    setMostrarFormulario(false);
    setMostrarPedidos(false);
    limparFormulario();
  }

  function seleccionarOperador(operador: string) {
    setOperadorPagamento(operador);

    const carteira = carteiras.find(
      (item) => item.operador === operador,
    );

    setTelefonePagamento(carteira?.telefone ?? "");
  }

  function submeterPedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");

    if (!contaAtual) {
      setTipoMensagem("erro");
      setMensagem("Inicie sessão para registar o pedido.");
      return;
    }

    if (!seleccionado) return;

    if (!mercado.trim() || !actividade.trim()) {
      setTipoMensagem("erro");
      setMensagem("Preencha o mercado e os detalhes do serviço.");
      return;
    }

    if (seleccionado.id === "taxa" && !periodo.trim()) {
      setTipoMensagem("erro");
      setMensagem("Indique o período a que a taxa diz respeito.");
      return;
    }

    if (
      seleccionado.exigePagamento &&
      (valorTaxa.trim() || referenciaMunicipal.trim()) &&
      !(valorTaxa.trim() && referenciaMunicipal.trim())
    ) {
      setTipoMensagem("erro");
      setMensagem(
        "Para indicar uma taxa, preencha o valor e a referência oficial. Se ainda não os recebeu, deixe ambos os campos vazios.",
      );
      return;
    }

    if (
      valorTaxa.trim() &&
      (!Number.isFinite(Number(valorTaxa)) || Number(valorTaxa) <= 0)
    ) {
      setTipoMensagem("erro");
      setMensagem("Introduza um valor de taxa válido.");
      return;
    }

    if (
      seleccionado.exigePagamento &&
      (operadorPagamento || telefonePagamento || referenciaTransacao) &&
      !operadorPagamento
    ) {
      setTipoMensagem("erro");
      setMensagem("Seleccione uma carteira móvel registada.");
      return;
    }

    if (
      operadorPagamento &&
      !carteiras.some((carteira) => carteira.operador === operadorPagamento)
    ) {
      setTipoMensagem("erro");
      setMensagem(
        "A carteira seleccionada já não está associada ao cadastro actual.",
      );
      return;
    }

    let estado: EstadoPedido;

    if (seleccionado.id === "ocupacao") {
      estado = "CONSULTA_REGISTADA";
    } else if (referenciaTransacao.trim()) {
      estado = "PENDENTE_DE_CONFIRMACAO";
    } else if (valorTaxa.trim() && referenciaMunicipal.trim()) {
      estado = "PENDENTE_DE_PAGAMENTO";
    } else {
      estado = "PENDENTE_DE_TAXA";
    }

    const pedido: PedidoMercado = {
      id: gerarId(),
      titularId: contaAtual.id,
      titularNome: contaAtual.perfil.nome || contaAtual.nome,
      titularEmail: contaAtual.email,
      titularTelefone: contaAtual.telefone,
      tipoTitular: textoTipoTitular(contaAtual.perfil.tipo),
      nuit: contaAtual.perfil.nuit,
      documentoIdentificacao:
        contaAtual.perfil.documentoIdentificacao,
      numeroRegisto: contaAtual.perfil.numeroRegisto,
      tipoInstituicao: contaAtual.perfil.tipoInstituicao,
      endereco: contaAtual.perfil.endereco,
      servicoId: seleccionado.id,
      servico: seleccionado.titulo,
      mercado: mercado.trim(),
      actividade: actividade.trim(),
      periodo: periodo.trim(),
      metodoPagamento: operadorPagamento,
      telefonePagamento,
      valorTaxa: valorTaxa.trim(),
      referenciaMunicipal: referenciaMunicipal.trim(),
      referenciaTransacao: referenciaTransacao.trim(),
      estado,
      criadoEm: new Date().toISOString(),
    };

    try {
      guardarPedido(pedido);
      setUltimoPedido(pedido);
      setPedidos(
        lerPedidos().filter(
          (item) => item.titularId === contaAtual.id,
        ),
      );
      setTipoMensagem("sucesso");

      if (estado === "CONSULTA_REGISTADA") {
        setMensagem(
          "A consulta foi guardada neste dispositivo. Ainda não foi enviada aos serviços municipais.",
        );
      } else if (estado === "PENDENTE_DE_CONFIRMACAO") {
        setMensagem(
          "A referência da transacção foi registada. O pagamento ainda precisa de ser confirmado pelo sistema financeiro ou pelos serviços autorizados.",
        );
      } else if (estado === "PENDENTE_DE_PAGAMENTO") {
        setMensagem(
          "O pedido foi guardado. Efectue o pagamento usando a referência oficial e aguarde a confirmação.",
        );
      } else {
        setMensagem(
          "O pedido foi guardado e aguarda a determinação da taxa e a emissão dos dados oficiais de pagamento.",
        );
      }
    } catch {
      setTipoMensagem("erro");
      setMensagem(
        "Não foi possível guardar o pedido neste dispositivo. Verifique o espaço disponível no navegador.",
      );
    }
  }

  function abrirListaPedidos() {
    if (!contaAtual) return;

    setPedidos(
      lerPedidos().filter(
        (pedido) => pedido.titularId === contaAtual.id,
      ),
    );

    setMostrarPedidos(true);
    setMostrarFormulario(false);
    setSeleccionado(null);
    setUltimoPedido(null);
  }

  if (!carregouConta) {
    return (
      <main className="flex min-h-64 items-center justify-center bg-slate-50 p-6">
        <p className="text-sm text-slate-500">
          A carregar os dados do titular...
        </p>
      </main>
    );
  }

  if (!contaAtual) {
    return (
      <main className="flex min-h-64 flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <ShieldCheck size={28} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Inicie sessão
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Para solicitar serviços dos mercados, precisamos de identificar
          o titular através da conta registada.
        </p>

        <Link
          href="/entrar"
          className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Entrar na conta
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={voltar}
            aria-label="Voltar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-200"
          >
            <ArrowLeft size={21} />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-lg font-bold text-slate-900">
              Mercados
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Município da Namaacha
            </p>
          </div>

          <div className="h-10 w-10 shrink-0" />
        </header>

        {ultimoPedido ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={29} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Pedido registado
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {mensagem}
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Número do pedido</p>
                <p className="mt-1 break-all text-lg font-bold text-slate-900">
                  {ultimoPedido.id}
                </p>

                <div className="mt-4 flex items-start gap-3">
                  <Clock3
                    size={19}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {textoEstado(ultimoPedido.estado)}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Registado em {formatarData(ultimoPedido.criadoEm)}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Titular do pedido</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {ultimoPedido.titularNome}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {ultimoPedido.titularEmail}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {ultimoPedido.titularTelefone}
                </p>

                <p className="mt-4 text-xs text-slate-500">Serviço</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {ultimoPedido.servico}
                </p>

                <p className="mt-3 text-xs text-slate-500">Mercado</p>
                <p className="mt-1 text-sm text-slate-800">
                  {ultimoPedido.mercado}
                </p>
              </div>

              {ultimoPedido.valorTaxa && (
                <div className="mt-4 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Valor indicado</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {formatarValor(ultimoPedido.valorTaxa)} MT
                  </p>

                  {ultimoPedido.referenciaMunicipal && (
                    <p className="mt-3 break-all text-xs text-slate-600">
                      Referência municipal: {ultimoPedido.referenciaMunicipal}
                    </p>
                  )}

                  {ultimoPedido.metodoPagamento && (
                    <p className="mt-2 text-xs text-slate-600">
                      Método: {ultimoPedido.metodoPagamento}
                    </p>
                  )}

                  {ultimoPedido.telefonePagamento && (
                    <p className="mt-1 text-xs text-slate-600">
                      Carteira: {ultimoPedido.telefonePagamento}
                    </p>
                  )}

                  {ultimoPedido.referenciaTransacao && (
                    <p className="mt-2 break-all text-xs text-slate-600">
                      Referência da transacção:{" "}
                      {ultimoPedido.referenciaTransacao}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 rounded-xl bg-amber-50 p-4">
                <ShieldCheck
                  size={20}
                  className="mb-2 text-amber-800"
                />
                <p className="text-sm font-semibold text-amber-950">
                  Pagamento e autorização
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-900">
                  Este registo local não confirma o pagamento nem constitui
                  uma autorização municipal. A confirmação financeira e a
                  decisão administrativa exigem integração com os sistemas
                  oficiais.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setUltimoPedido(null);
                setSeleccionado(null);
                setMostrarFormulario(false);
                setMensagem("");
              }}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Voltar aos serviços
            </button>
          </section>
        ) : mostrarPedidos ? (
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Os meus pedidos
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Registos associados à conta actualmente autenticada neste
                dispositivo.
              </p>
            </div>

            {pedidos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <FileText size={30} className="mx-auto text-slate-400" />
                <p className="mt-3 text-sm font-semibold text-slate-800">
                  Ainda não existem pedidos
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Os seus pedidos registados neste dispositivo aparecerão
                  aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pedidos.map((pedido) => (
                  <article
                    key={pedido.id}
                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900">
                          {pedido.servico}
                        </h3>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {pedido.id}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800">
                        {textoEstado(pedido.estado)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      <p>Mercado: {pedido.mercado}</p>
                      <p>Requerente: {pedido.titularNome}</p>
                      <p>Data: {formatarData(pedido.criadoEm)}</p>
                    </div>

                    {pedido.valorTaxa && (
                      <p className="mt-3 text-sm font-semibold text-slate-900">
                        Taxa: {formatarValor(pedido.valorTaxa)} MT
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setMostrarPedidos(false)}
              className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Voltar aos serviços
            </button>
          </section>
        ) : mostrarFormulario && seleccionado ? (
          <section>
            <div className="mb-5">
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${seleccionado.fundo} ${seleccionado.cor}`}
              >
                {(() => {
                  const Icon = seleccionado.icon;
                  return <Icon size={25} />;
                })()}
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {seleccionado.id === "taxa"
                  ? "Consulta e pagamento de taxa"
                  : seleccionado.id === "bancas"
                    ? "Pedido de autorização de banca"
                    : "Consulta de ocupação"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Os dados pessoais são obtidos do cadastro da sua conta.
                Preencha apenas os detalhes específicos deste serviço.
              </p>
            </div>

            <form
              onSubmit={submeterPedido}
              className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck size={19} className="text-emerald-700" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Dados do titular registado
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Tipo de titular
                    </label>
                    <input
                      readOnly
                      value={textoTipoTitular(contaAtual.perfil.tipo)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Nome do titular
                    </label>
                    <input
                      readOnly
                      value={contaAtual.perfil.nome || contaAtual.nome}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Email registado
                    </label>
                    <input
                      readOnly
                      value={contaAtual.email}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Telefone registado
                    </label>
                    <input
                      readOnly
                      value={contaAtual.telefone || "Não indicado"}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                    />
                  </div>

                  {contaAtual.perfil.tipo === "cidadao" ? (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Documento de identificação
                      </label>
                      <input
                        readOnly
                        value={
                          contaAtual.perfil.documentoIdentificacao ||
                          "Não indicado no cadastro"
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        NUIT
                      </label>
                      <input
                        readOnly
                        value={
                          contaAtual.perfil.nuit ||
                          "Não indicado no cadastro"
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                      />
                    </div>
                  )}

                  {contaAtual.perfil.tipo === "empresa" && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Número de registo da empresa
                      </label>
                      <input
                        readOnly
                        value={
                          contaAtual.perfil.numeroRegisto ||
                          "Não indicado no cadastro"
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                      />
                    </div>
                  )}

                  {contaAtual.perfil.tipo === "instituicao" && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Tipo de instituição
                      </label>
                      <input
                        readOnly
                        value={
                          contaAtual.perfil.tipoInstituicao ||
                          "Não indicado no cadastro"
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Endereço registado
                    </label>
                    <input
                      readOnly
                      value={
                        contaAtual.perfil.endereco ||
                        "Não indicado no cadastro"
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                    />
                  </div>
                </div>

                <Link
                  href="/perfil"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 underline"
                >
                  Actualizar dados no perfil
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div>
                <label
                  htmlFor="mercado"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mercado pretendido
                </label>
                <input
                  id="mercado"
                  required
                  value={mercado}
                  onChange={(event) => setMercado(event.target.value)}
                  placeholder="Nome ou localização do mercado"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label
                  htmlFor="actividade"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {seleccionado.id === "taxa"
                    ? "Identificação da banca ou espaço"
                    : seleccionado.id === "bancas"
                      ? "Actividade comercial"
                      : "Espaço ou actividade a consultar"}
                </label>
                <textarea
                  id="actividade"
                  required
                  rows={3}
                  value={actividade}
                  onChange={(event) => setActividade(event.target.value)}
                  placeholder={
                    seleccionado.id === "taxa"
                      ? "Número da banca, localização ou identificação do ocupante"
                      : seleccionado.id === "bancas"
                        ? "Produtos ou serviços que pretende comercializar"
                        : "Indique o tipo de espaço ou actividade pretendida"
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              {seleccionado.id === "taxa" && (
                <div>
                  <label
                    htmlFor="periodo"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Período da taxa
                  </label>
                  <input
                    id="periodo"
                    required
                    value={periodo}
                    onChange={(event) => setPeriodo(event.target.value)}
                    placeholder="Ex.: Outubro de 2026"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                  />
                </div>
              )}

              {seleccionado.exigePagamento && (
                <>
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <ReceiptIcon />
                      Dados oficiais da taxa
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Preencha apenas se já recebeu o valor e a referência
                      oficiais do Município. Não estime taxas.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="valorTaxa"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Valor da taxa (MT)
                    </label>
                    <input
                      id="valorTaxa"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={valorTaxa}
                      onChange={(event) => setValorTaxa(event.target.value)}
                      placeholder="Valor comunicado pelo Município"
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="referenciaMunicipal"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Referência municipal
                    </label>
                    <input
                      id="referenciaMunicipal"
                      value={referenciaMunicipal}
                      onChange={(event) =>
                        setReferenciaMunicipal(event.target.value)
                      }
                      placeholder="Referência emitida pelo Município"
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                    Se ainda não recebeu o valor ou a referência oficial,
                    deixe os dois campos vazios. O pedido ficará a aguardar
                    a determinação da taxa.
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <CreditCard size={18} className="text-emerald-700" />
                      Carteiras móveis do cadastro
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Seleccione um dos números associados à sua conta.
                    </p>
                  </div>

                  {carteiras.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {carteiras.map((carteira) => {
                        const operador = operadores.find(
                          (item) => item.id === carteira.operador,
                        );

                        if (!operador) return null;

                        const seleccionadoActual =
                          operadorPagamento === carteira.operador;

                        return (
                          <button
                            key={carteira.id}
                            type="button"
                            onClick={() =>
                              seleccionarOperador(carteira.operador)
                            }
                            aria-pressed={seleccionadoActual}
                            className={`flex min-w-0 flex-col items-center rounded-xl border p-3 text-center transition ${
                              seleccionadoActual
                                ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <span
                              className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${operador.fundo} ${operador.cor}`}
                            >
                              <Smartphone size={19} />
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {operador.nome}
                            </span>
                            <span className="mt-2 break-all text-[10px] leading-4 text-slate-600">
                              {carteira.telefone}
                            </span>
                            {carteira.principal && (
                              <span className="mt-2 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-semibold text-emerald-800">
                                Principal
                              </span>
                            )}
                            {seleccionadoActual && (
                              <CheckCircle2
                                size={15}
                                className="mt-2 text-emerald-700"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-amber-900">
                        Sem carteiras móveis registadas
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        Não existem números de pagamento associados à sua
                        conta. Pode preparar o pedido, mas não seleccione
                        nem invente números de carteira.
                      </p>
                      <Link
                        href="/perfil"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 underline"
                      >
                        Gerir perfil e pagamentos
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="referenciaTransacao"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Referência da transacção
                    </label>
                    <input
                      id="referenciaTransacao"
                      value={referenciaTransacao}
                      onChange={(event) =>
                        setReferenciaTransacao(event.target.value)
                      }
                      placeholder="Referência recebida após pagar"
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-600"
                    />
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Só introduza uma referência real. Preencher este campo
                      não confirma que o pagamento foi recebido.
                    </p>
                  </div>
                </>
              )}

              {mensagem && (
                <div
                  role="status"
                  className={`rounded-xl p-4 text-sm leading-6 ${
                    tipoMensagem === "erro"
                      ? "bg-red-50 text-red-800"
                      : "bg-amber-50 text-amber-900"
                  }`}
                >
                  {mensagem}
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                {seleccionado.id === "ocupacao"
                  ? "Registar consulta"
                  : "Registar pedido"}
                <ArrowRight size={17} />
              </button>

              <p className="text-xs leading-5 text-slate-500">
                Os dados pessoais são copiados do cadastro. Este protótipo
                guarda os pedidos no navegador; não os envia ao Município,
                não confirma pagamentos e não emite autorizações oficiais.
              </p>
            </form>
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
                Procedimentos
              </h3>

              <ol className="mt-3 space-y-3">
                {seleccionado.passos.map((passo, indice) => (
                  <li
                    key={passo}
                    className="flex gap-3 text-sm leading-5 text-slate-600"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">
                      {indice + 1}
                    </span>
                    <span className="pt-0.5">{passo}</span>
                  </li>
                ))}
              </ol>

              {seleccionado.exigePagamento && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-amber-800"
                    />
                    <div>
                      <p className="text-sm font-semibold text-amber-950">
                        Confirmação obrigatória
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-900">
                        Quando existir uma taxa, o pagamento deverá ser
                        confirmado e os requisitos analisados antes da
                        autorização municipal.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  limparFormulario();
                  setMostrarFormulario(true);
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                {seleccionado.id === "taxa"
                  ? "Consultar ou registar taxa"
                  : seleccionado.id === "bancas"
                    ? "Iniciar pedido de banca"
                    : "Registar consulta de ocupação"}
                <ArrowRight size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSeleccionado(null)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Voltar aos mercados
            </button>
          </section>
        ) : (
          <>
            <section className="mb-5">
              <h2 className="text-base font-bold text-slate-900">
                Serviços dos mercados
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Consulte taxas, solicite bancas e acompanhe os procedimentos
                dos mercados municipais.
              </p>
            </section>

            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={21} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {contaAtual.perfil.nome || contaAtual.nome}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {contaAtual.email}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-emerald-800">
                    {textoTipoTitular(contaAtual.perfil.tipo)} · Dados do cadastro
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={abrirListaPedidos}
              className="mb-5 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-emerald-300"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <FileText size={19} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    Os meus pedidos
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Consultar os registos desta conta neste dispositivo
                  </span>
                </span>
              </span>
              <ArrowRight size={18} className="text-slate-400" />
            </button>

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Serviços disponíveis
              </h3>
              <span className="text-xs text-slate-500">
                {servicos.length} serviços
              </span>
            </div>

            <section className="grid grid-cols-3 gap-2 sm:gap-3">
              {servicos.map((servico) => {
                const Icon = servico.icon;

                return (
                  <button
                    key={servico.id}
                    type="button"
                    onClick={() => abrirServico(servico)}
                    className="group flex min-w-0 flex-col items-center rounded-xl border border-slate-100 bg-white p-2 text-center shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:rounded-2xl sm:p-4"
                  >
                    <span
                      className={`mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:mb-3 sm:h-11 sm:w-11 sm:rounded-xl ${servico.fundo} ${servico.cor}`}
                    >
                      <Icon size={20} />
                    </span>

                    <span className="line-clamp-2 min-h-8 w-full text-xs font-semibold leading-4 text-slate-900 sm:min-h-10 sm:text-sm sm:leading-5">
                      {servico.titulo}
                    </span>

                    <span className="mt-1 hidden text-xs leading-4 text-slate-500 sm:block">
                      {servico.descricao}
                    </span>

                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 sm:text-xs">
                      Consultar
                      <ArrowRight size={12} />
                    </span>
                  </button>
                );
              })}
            </section>

            <section className="relative mt-6 overflow-hidden rounded-2xl bg-emerald-950 p-5 text-white">
              <MapPin size={22} className="mb-3 text-emerald-300" />
              <h3 className="text-base font-bold">
                Mercados organizados, comércio mais forte!
              </h3>
              <p className="mt-2 text-sm leading-6 text-emerald-100">
                Utilize os serviços municipais e acompanhe as etapas
                necessárias para regularizar a sua actividade comercial.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function ReceiptIcon() {
  return <FileText size={18} className="text-emerald-700" />;
}
