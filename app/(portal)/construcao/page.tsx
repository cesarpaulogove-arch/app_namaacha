
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  HardHat,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

type ServicoConstrucao = {
  id: string;
  titulo: string;
  descricao: string;
  detalhe: string;
  requisitos: string[];
  icon: typeof Building2;
  cor: string;
  fundo: string;
};

const servicos: ServicoConstrucao[] = [
  {
    id: "licenca",
    titulo: "Licença de Construção",
    descricao: "Solicite a sua licença",
    detalhe:
      "Prepare o pedido de licenciamento para construção, ampliação ou alteração de uma edificação.",
    requisitos: [
      "Identificação do requerente",
      "Localização e identificação do terreno",
      "Projecto e documentação técnica aplicável",
    ],
    icon: Building2,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
  },
  {
    id: "processos",
    titulo: "Acompanhamento de Processos",
    descricao: "Verifique o estado do seu processo",
    detalhe:
      "Consulte as informações e acompanhe as etapas de um processo de construção submetido ao Município.",
    requisitos: [
      "Número de referência do processo",
      "Identificação do requerente, quando solicitada",
      "Consulta do estado actualizado pelos serviços municipais",
    ],
    icon: ClipboardList,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
  },
  {
    id: "vistoria",
    titulo: "Taxa de Vistoria",
    descricao: "Agende a sua vistoria",
    detalhe:
      "Prepare um pedido de vistoria para verificação de obras ou edificações, de acordo com os procedimentos municipais.",
    requisitos: [
      "Identificação do requerente",
      "Localização da obra",
      "Tipo de vistoria pretendida",
    ],
    icon: FileText,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
  },
];

export default function ConstrucaoPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [seleccionado, setSeleccionado] =
    useState<ServicoConstrucao | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [requerente, setRequerente] = useState("");
  const [contacto, setContacto] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [tipoObra, setTipoObra] = useState("Nova construção");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");

  const filtrados = servicos.filter((servico) => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt");

    return (
      servico.titulo.toLocaleLowerCase("pt").includes(termo) ||
      servico.descricao.toLocaleLowerCase("pt").includes(termo)
    );
  });

  function voltar() {
    if (mostrarFormulario) {
      setMostrarFormulario(false);
      setMensagem("");
    } else if (seleccionado) {
      setSeleccionado(null);
    } else {
      window.history.back();
    }
  }

  function validarPedido(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem(
      "Dados preenchidos e validados no formulário. O pedido ainda não foi registado oficialmente. É necessária a integração com o sistema municipal."
    );
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* Cabeçalho */}
        <header className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={voltar}
            aria-label="Voltar"
            className="flex h-10 w-10 shrink-0 items-center
              justify-center rounded-full text-slate-700
              hover:bg-slate-200"
          >
            <ArrowLeft size={21} />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-lg font-bold text-slate-900">
              Construção
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Município da Namaacha
            </p>
          </div>

          <div className="h-10 w-10 shrink-0" />
        </header>

        {mostrarFormulario ? (
          /* Formulário de pedido */
          <section>
            <div className="mb-5">
              <div className="mb-3 flex h-12 w-12 items-center
                justify-center rounded-xl bg-emerald-100
                text-emerald-800">
                <HardHat size={25} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {seleccionado?.id === "vistoria"
                  ? "Solicitar vistoria"
                  : "Pedido de construção"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preencha os dados necessários para preparar o pedido.
              </p>
            </div>

            <form
              onSubmit={validarPedido}
              className="space-y-4 rounded-2xl border border-slate-100
                bg-white p-5 shadow-sm"
            >
              <div>
                <label htmlFor="requerente" className="mb-2 block text-sm font-medium">
                  Nome do requerente
                </label>
                <input
                  id="requerente"
                  required
                  value={requerente}
                  onChange={(e) => {
                    setRequerente(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Nome completo ou empresa"
                  className="w-full rounded-xl border border-slate-200
                    px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label htmlFor="contacto" className="mb-2 block text-sm font-medium">
                  Contacto telefónico
                </label>
                <input
                  id="contacto"
                  type="tel"
                  required
                  value={contacto}
                  onChange={(e) => {
                    setContacto(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Número de telefone"
                  className="w-full rounded-xl border border-slate-200
                    px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label htmlFor="localizacao" className="mb-2 block text-sm font-medium">
                  Localização da obra
                </label>
                <input
                  id="localizacao"
                  required
                  value={localizacao}
                  onChange={(e) => {
                    setLocalizacao(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Bairro, rua ou referência do terreno"
                  className="w-full rounded-xl border border-slate-200
                    px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label htmlFor="tipoObra" className="mb-2 block text-sm font-medium">
                  Tipo de intervenção
                </label>
                <select
                  id="tipoObra"
                  value={tipoObra}
                  onChange={(e) => {
                    setTipoObra(e.target.value);
                    setMensagem("");
                  }}
                  className="w-full rounded-xl border border-slate-200
                    bg-white px-3 py-3 text-sm outline-none
                    focus:border-emerald-600"
                >
                  <option>Nova construção</option>
                  <option>Ampliação</option>
                  <option>Alteração de edificação</option>
                  <option>Reabilitação</option>
                  <option>Vistoria de obra</option>
                </select>
              </div>

              <div>
                <label htmlFor="descricao" className="mb-2 block text-sm font-medium">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  required
                  rows={4}
                  value={descricao}
                  onChange={(e) => {
                    setDescricao(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Descreva a obra ou o serviço pretendido..."
                  className="w-full resize-y rounded-xl border
                    border-slate-200 px-3 py-3 text-sm
                    outline-none focus:border-emerald-600"
                />
              </div>

              {mensagem && (
                <div
                  role="status"
                  className="rounded-xl border border-amber-200
                    bg-amber-50 p-4 text-sm leading-6 text-amber-900"
                >
                  {mensagem}
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center
                  gap-2 rounded-xl bg-emerald-700 px-4 py-3.5
                  text-sm font-semibold text-white hover:bg-emerald-800"
              >
                <FileText size={18} />
                Validar dados do pedido
              </button>

              <p className="text-xs leading-5 text-slate-500">
                Este formulário ainda não regista processos oficiais
                nem agenda vistorias.
              </p>
            </form>
          </section>
        ) : seleccionado ? (
          /* Detalhes do serviço */
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-100
              bg-white p-5 shadow-sm">
              <div className={`mb-4 flex h-14 w-14 items-center
                justify-center rounded-2xl ${seleccionado.fundo}
                ${seleccionado.cor}`}>
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
                Informações necessárias
              </h3>

              <ul className="mt-3 space-y-3">
                {seleccionado.requisitos.map((requisito) => (
                  <li key={requisito} className="flex gap-3 text-sm
                    leading-5 text-slate-600">
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-700"
                    />
                    {requisito}
                  </li>
                ))}
              </ul>

              {seleccionado.id !== "processos" && (
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(true)}
                  className="mt-6 flex w-full items-center
                    justify-center gap-2 rounded-xl bg-emerald-700
                    px-4 py-3 text-sm font-semibold text-white
                    hover:bg-emerald-800"
                >
                  {seleccionado.id === "vistoria"
                    ? "Preparar pedido de vistoria"
                    : "Solicitar licença"}
                  <ArrowRight size={18} />
                </button>
              )}

              {seleccionado.id === "processos" && (
                <div className="mt-6 rounded-xl bg-blue-50 p-4">
                  <p className="text-sm leading-6 text-blue-900">
                    A consulta do estado do processo ficará disponível
                    quando estiver ligada aos registos municipais.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSeleccionado(null)}
              className="w-full rounded-xl border border-slate-200
                bg-white px-4 py-3 text-sm font-semibold
                text-slate-700 hover:bg-slate-100"
            >
              Voltar aos serviços
            </button>
          </section>
        ) : (
          /* Página principal */
          <>
            <section className="mb-5">
              <h2 className="text-base font-bold text-slate-900">
                Licenças e serviços de construção
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Consulte os procedimentos para obras, acompanhe
                processos e prepare pedidos de vistoria.
              </p>
            </section>

            <label className="mb-4 flex items-center gap-3
              rounded-xl border border-slate-200 bg-white px-4 py-3
              focus-within:border-emerald-600">
              <Search size={19} className="shrink-0 text-slate-400" />
              <input
                type="search"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Pesquisar serviço..."
                aria-label="Pesquisar serviço de construção"
                className="w-full bg-transparent text-sm outline-none
                  placeholder:text-slate-400"
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
                    onClick={() => setSeleccionado(servico)}
                    className="group flex w-full items-center gap-3
                      rounded-2xl border border-slate-100 bg-white
                      p-3 text-left shadow-sm transition
                      hover:border-emerald-200 hover:shadow-md"
                  >
                    <span className={`flex h-12 w-12 shrink-0
                      items-center justify-center rounded-xl
                      ${servico.fundo} ${servico.cor}`}>
                      <Icon size={23} />
                    </span>

                    <span className="min-w-0 flex-1 py-1">
                      <span className="block text-sm font-semibold
                        leading-5 text-slate-900">
                        {servico.titulo}
                      </span>
                      <span className="mt-1 block text-xs
                        leading-5 text-slate-500">
                        {servico.descricao}
                      </span>
                    </span>

                    <ArrowRight
                      size={18}
                      className="shrink-0 text-slate-400
                        group-hover:text-emerald-700"
                    />
                  </button>
                );
              })}

              {filtrados.length === 0 && (
                <div className="rounded-2xl border border-dashed
                  border-slate-300 bg-white px-5 py-10 text-center">
                  <Search size={28} className="mx-auto text-slate-400" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    Nenhum serviço encontrado
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Experimente outro termo de pesquisa.
                  </p>
                </div>
              )}
            </section>

            <section className="relative mt-6 overflow-hidden
              rounded-2xl bg-emerald-950 p-5 text-white">
              <HardHat size={24} className="mb-3 text-emerald-300" />
              <h3 className="text-base font-bold">
                Desenvolvimento urbano com responsabilidade.
              </h3>
              <p className="mt-2 text-sm leading-6 text-emerald-100">
                Contribuímos para uma Namaacha organizada, segura
                e preparada para o futuro.
              </p>
            </section>

            <div className="mt-5 flex items-start gap-3 rounded-xl
              border border-emerald-100 bg-emerald-50 p-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-emerald-700"
              />
              <p className="text-xs leading-5 text-emerald-900">
                Os pedidos estão sujeitos à análise e aprovação dos
                serviços municipais competentes.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
