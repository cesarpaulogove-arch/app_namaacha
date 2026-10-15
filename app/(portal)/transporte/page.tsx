
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bus,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  Truck,
  UserRound,
  X,
} from "lucide-react";

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
    descricao: "Solicite autorização para transportar",
    detalhe:
      "Prepare um pedido de licença para o exercício de actividades de transporte, sujeito aos requisitos aplicáveis e à competência dos serviços responsáveis.",
    passos: [
      "Identifique o requerente ou a empresa transportadora.",
      "Indique a actividade de transporte pretendida.",
      "Apresente os dados dos veículos envolvidos.",
      "Confirme os documentos e as taxas exigidos pelos serviços competentes.",
    ],
    icon: Bus,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
  },
  {
    id: "renovacao",
    titulo: "Renovação de Licença",
    descricao: "Actualize a sua licença de transporte",
    detalhe:
      "Prepare a solicitação de renovação de uma licença existente e consulte os requisitos necessários para dar continuidade à actividade.",
    passos: [
      "Identifique a licença que pretende renovar.",
      "Indique a referência e a validade da licença actual.",
      "Actualize os dados do requerente e do veículo.",
      "Confirme os requisitos e os prazos de renovação.",
    ],
    icon: CalendarDays,
    cor: "text-amber-700",
    fundo: "bg-amber-50",
  },
  {
    id: "autorizacoes",
    titulo: "Consultar Autorizações",
    descricao: "Verifique o estado do processo",
    detalhe:
      "Consulte informações relativas aos pedidos e às autorizações de transporte associados ao seu requerimento.",
    passos: [
      "Tenha consigo a referência do processo.",
      "Consulte o estado da solicitação.",
      "Verifique se existem documentos ou informações em falta.",
      "Contacte os serviços competentes para confirmar os dados oficiais.",
    ],
    icon: ClipboardList,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
  },
  {
    id: "veiculos",
    titulo: "Registo de Veículos",
    descricao: "Identifique os veículos da actividade",
    detalhe:
      "Organize os dados dos veículos associados à actividade de transporte para preparar a consulta ou o pedido de autorização aplicável.",
    passos: [
      "Indique a matrícula do veículo.",
      "Identifique o proprietário ou a empresa responsável.",
      "Indique o tipo de veículo e a sua utilização.",
      "Confirme os documentos exigidos para o procedimento pretendido.",
    ],
    icon: Truck,
    cor: "text-violet-700",
    fundo: "bg-violet-50",
  },
  {
    id: "operadores",
    titulo: "Registo de Operadores",
    descricao: "Dados de transportadores e operadores",
    detalhe:
      "Prepare os dados de identificação do operador ou da empresa que pretende exercer uma actividade de transporte.",
    passos: [
      "Indique o nome do operador ou da empresa.",
      "Forneça os contactos para comunicação.",
      "Descreva a actividade de transporte.",
      "Confirme os requisitos de registo junto dos serviços competentes.",
    ],
    icon: UserRound,
    cor: "text-cyan-700",
    fundo: "bg-cyan-50",
  },
  {
    id: "fiscalizacao",
    titulo: "Requisitos e Fiscalização",
    descricao: "Consulte as condições aplicáveis",
    detalhe:
      "Consulte informações sobre os requisitos documentais e as condições que devem ser observadas no exercício da actividade de transporte.",
    passos: [
      "Identifique a categoria da actividade.",
      "Confirme os documentos obrigatórios.",
      "Verifique os requisitos aplicáveis aos veículos e operadores.",
      "Solicite esclarecimentos aos serviços responsáveis.",
    ],
    icon: ShieldCheck,
    cor: "text-rose-700",
    fundo: "bg-rose-50",
  },
];

type PedidoTransporte = {
  requerente: string;
  contacto: string;
  entidade: string;
  tipoPedido: string;
  actividade: string;
  matricula: string;
  localidade: string;
  descricao: string;
};

export default function TransportePage() {
  const [pesquisa, setPesquisa] = useState("");
  const [seleccionado, setSeleccionado] =
    useState<ServicoTransporte | null>(null);
  const [mostrarPedido, setMostrarPedido] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [requerente, setRequerente] = useState("");
  const [contacto, setContacto] = useState("");
  const [entidade, setEntidade] = useState("");
  const [tipoPedido, setTipoPedido] = useState("");
  const [actividade, setActividade] = useState("");
  const [matricula, setMatricula] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [descricao, setDescricao] = useState("");

  const filtrados = servicos.filter((servico) => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt");

    return (
      servico.titulo.toLocaleLowerCase("pt").includes(termo) ||
      servico.descricao.toLocaleLowerCase("pt").includes(termo) ||
      servico.detalhe.toLocaleLowerCase("pt").includes(termo)
    );
  });

  function voltar() {
    if (mostrarPedido) {
      setMostrarPedido(false);
      setMensagem("");
    } else if (seleccionado) {
      setSeleccionado(null);
      setMensagem("");
    } else {
      window.history.back();
    }
  }

  function abrirPedido() {
    setMensagem("");
    setMostrarPedido(true);

    if (seleccionado?.id === "renovacao") {
      setTipoPedido("Renovação de licença");
    } else if (seleccionado?.id === "veiculos") {
      setTipoPedido("Registo de veículo");
    } else if (seleccionado?.id === "operadores") {
      setTipoPedido("Registo de operador");
    } else {
      setTipoPedido("Nova licença de transporte");
    }
  }

  function validarPedido(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pedido: PedidoTransporte = {
      requerente: requerente.trim(),
      contacto: contacto.trim(),
      entidade: entidade.trim(),
      tipoPedido,
      actividade: actividade.trim(),
      matricula: matricula.trim(),
      localidade: localidade.trim(),
      descricao: descricao.trim(),
    };

    if (
      !pedido.requerente ||
      !pedido.contacto ||
      !pedido.tipoPedido ||
      !pedido.actividade ||
      !pedido.localidade ||
      !pedido.descricao
    ) {
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    setMensagem(
      "Os dados foram validados com sucesso. O pedido ainda não foi registado oficialmente. Para concluir o registo, é necessária a integração com o sistema municipal."
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
              Transporte
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Município de Namaacha
            </p>
          </div>

          <div className="h-10 w-10 shrink-0" />
        </header>

        {mostrarPedido ? (
          <section>
            <div className="mb-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                <Bus size={25} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Pedido de transporte
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preencha os dados para preparar a sua solicitação
                de licença ou autorização.
              </p>
            </div>

            <form
              onSubmit={validarPedido}
              className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div>
                <label
                  htmlFor="requerente"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Nome do requerente *
                </label>
                <input
                  id="requerente"
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={requerente}
                  onChange={(e) => {
                    setRequerente(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Nome completo"
                  className={campo}
                />
              </div>

              <div>
                <label
                  htmlFor="contacto"
                  className="mb-2 block text-sm font-medium text-slate-800"
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
                  onChange={(e) => {
                    setContacto(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Número de telefone"
                  className={campo}
                />
              </div>

              <div>
                <label
                  htmlFor="entidade"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Empresa ou operador
                </label>
                <input
                  id="entidade"
                  maxLength={150}
                  value={entidade}
                  onChange={(e) => {
                    setEntidade(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Nome da empresa, se aplicável"
                  className={campo}
                />
              </div>

              <div>
                <label
                  htmlFor="tipoPedido"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Tipo de pedido *
                </label>
                <select
                  id="tipoPedido"
                  required
                  value={tipoPedido}
                  onChange={(e) => {
                    setTipoPedido(e.target.value);
                    setMensagem("");
                  }}
                  className={campo}
                >
                  <option value="">Seleccione o pedido</option>
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
                </select>
              </div>

              <div>
                <label
                  htmlFor="actividade"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Actividade de transporte *
                </label>
                <select
                  id="actividade"
                  required
                  value={actividade}
                  onChange={(e) => {
                    setActividade(e.target.value);
                    setMensagem("");
                  }}
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
                  <option value="Transporte de passageiros em táxi">
                    Transporte de passageiros em táxi
                  </option>
                  <option value="Outra actividade">
                    Outra actividade
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="matricula"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Matrícula do veículo
                </label>
                <input
                  id="matricula"
                  maxLength={30}
                  value={matricula}
                  onChange={(e) => {
                    setMatricula(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Ex.: ABC-123-MC"
                  className={campo}
                />
              </div>

              <div>
                <label
                  htmlFor="localidade"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Localidade ou zona de operação *
                </label>
                <input
                  id="localidade"
                  required
                  maxLength={200}
                  value={localidade}
                  onChange={(e) => {
                    setLocalidade(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Ex.: Vila de Namaacha"
                  className={campo}
                />
              </div>

              <div>
                <label
                  htmlFor="descricao"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Descrição do pedido *
                </label>
                <textarea
                  id="descricao"
                  required
                  maxLength={2000}
                  rows={4}
                  value={descricao}
                  onChange={(e) => {
                    setDescricao(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Descreva o pedido e indique informações adicionais relevantes."
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
                className="w-full rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Validar dados do pedido
              </button>

              <p className="text-xs leading-5 text-slate-500">
                A validação não constitui uma licença de transporte
                nem substitui a autorização dos serviços competentes.
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

              {[
                "licenca",
                "renovacao",
                "veiculos",
                "operadores",
              ].includes(seleccionado.id) && (
                <button
                  type="button"
                  onClick={abrirPedido}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  {seleccionado.id === "renovacao"
                    ? "Preparar renovação"
                    : seleccionado.id === "veiculos"
                      ? "Registar veículo"
                      : seleccionado.id === "operadores"
                        ? "Registar operador"
                        : "Solicitar licença"}
                  <ArrowRight size={18} />
                </button>
              )}

              {(seleccionado.id === "autorizacoes" ||
                seleccionado.id === "fiscalizacao") && (
                <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm leading-6 text-emerald-900">
                    A consulta de processos e a confirmação dos
                    requisitos oficiais dependem da integração com
                    os registos dos serviços competentes.
                  </p>
                </div>
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
              Voltar aos transportes
            </button>
          </section>
        ) : (
          <>
            <section className="mb-5 overflow-hidden rounded-2xl bg-blue-950 p-5 text-white">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                <Bus size={27} />
              </div>

              <h2 className="text-lg font-bold">
                Mobilidade segura para todos!
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Consulte os serviços de transporte, prepare pedidos
                de licença e acompanhe os procedimentos municipais.
              </p>
            </section>

            <section className="mb-5">
              <h2 className="text-base font-bold text-slate-900">
                Serviços de transporte
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Consulte licenças, renovações, registos e informações
                para operadores de transporte.
              </p>
            </section>

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

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Serviços disponíveis
              </h3>
              <span className="text-xs text-slate-500">
                {filtrados.length} serviços
              </span>
            </div>

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
                    className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${servico.fundo} ${servico.cor}`}
                    >
                      <Icon size={23} />
                    </span>

                    <span className="min-w-0 flex-1 py-1">
                      <span className="block text-sm font-semibold leading-5 text-slate-900">
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
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
                  <Search
                    size={28}
                    className="mx-auto text-slate-400"
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    Nenhum serviço encontrado
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Experimente outro termo de pesquisa.
                  </p>
                </div>
              )}
            </section>

            <section className="relative mt-6 overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileText size={23} />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Transporte organizado, mobilidade responsável!
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Antes de iniciar uma actividade de transporte,
                confirme os requisitos de licenciamento, a
                documentação necessária e as condições aplicáveis.
              </p>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />
                <p className="text-xs leading-5 text-slate-600">
                  Município de Namaacha — consulte os serviços
                  competentes para confirmar os procedimentos
                  aplicáveis à sua actividade.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
