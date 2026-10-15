

"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  Leaf,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

type Licenca = {
  id: string;
  titulo: string;
  descricao: string;
  detalhe: string;
  requisitos: string[];
  cor: string;
  fundo: string;
  icon: typeof Building2;
};

const licencas: Licenca[] = [
  {
    id: "funcionamento",
    titulo: "Licença de Funcionamento",
    descricao: "Estabelecimentos comerciais",
    detalhe:
      "Consulte os procedimentos para solicitar ou renovar a licença de funcionamento do seu estabelecimento.",
    requisitos: [
      "Identificação do requerente",
      "Identificação do estabelecimento",
      "Documentação exigida para a actividade",
    ],
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
    icon: FileText,
  },
  {
    id: "construcao",
    titulo: "Licença de Construção",
    descricao: "Obras e edificações",
    detalhe:
      "Consulte os procedimentos de licenciamento para construção, ampliação ou alteração de edificações.",
    requisitos: [
      "Identificação do requerente",
      "Identificação e localização do terreno",
      "Projecto e documentos técnicos exigidos",
    ],
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
    icon: Building2,
  },
  {
    id: "publicidade",
    titulo: "Licença de Publicidade",
    descricao: "Painéis e outdoors",
    detalhe:
      "Consulte os procedimentos para instalação de painéis publicitários, outdoors e outros suportes de publicidade.",
    requisitos: [
      "Identificação do requerente",
      "Localização do suporte publicitário",
      "Características e dimensões da publicidade",
    ],
    cor: "text-blue-700",
    fundo: "bg-blue-50",
    icon: ClipboardList,
  },
  {
    id: "ambiental",
    titulo: "Licença Ambiental",
    descricao: "Actividades com impacto ambiental",
    detalhe:
      "Consulte os procedimentos e requisitos ambientais aplicáveis à actividade que pretende desenvolver.",
    requisitos: [
      "Identificação do requerente",
      "Descrição da actividade e localização",
      "Documentação ambiental aplicável",
    ],
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
    icon: Leaf,
  },
];

export default function LicencasPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [seleccionada, setSeleccionada] =
    useState<Licenca | null>(null);
  const [novoPedido, setNovoPedido] = useState(false);
  const [nomeRequerente, setNomeRequerente] = useState("");
  const [contacto, setContacto] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoLicenca, setTipoLicenca] = useState("");
  const [mensagem, setMensagem] = useState("");

  const listaFiltrada = licencas.filter((licenca) => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt");

    return (
      licenca.titulo.toLocaleLowerCase("pt").includes(termo) ||
      licenca.descricao.toLocaleLowerCase("pt").includes(termo)
    );
  });

  function voltar() {
    if (novoPedido) {
      setNovoPedido(false);
      setMensagem("");
      return;
    }

    if (seleccionada) {
      setSeleccionada(null);
      return;
    }

    window.history.back();
  }

  function submeterPedido(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Ainda não existe integração com o sistema municipal.
    setMensagem(
      "O formulário está validado, mas o pedido ainda não foi registado. A submissão será disponibilizada após a integração com o sistema municipal."
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
            className="flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft size={21} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-center text-lg font-bold text-slate-900">
              Licenças
            </h1>
            <p className="mt-1 text-center text-xs text-slate-500">
              Município da Namaacha
            </p>
          </div>

          <div className="h-10 w-10 shrink-0" />
        </header>

        {novoPedido ? (
          /* Formulário de novo pedido */
          <section>
            <div className="mb-5">
              <div className="mb-3 flex h-12 w-12 items-center
                justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <Plus size={25} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Solicitar nova licença
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preencha os dados para preparar o seu pedido.
              </p>
            </div>

            <form
              onSubmit={submeterPedido}
              className="space-y-4 rounded-2xl border border-slate-100
                bg-white p-5 shadow-sm"
            >
              <div>
                <label htmlFor="tipo" className="mb-2 block text-sm font-medium">
                  Tipo de licença
                </label>

                <select
                  id="tipo"
                  required
                  value={tipoLicenca}
                  onChange={(e) => {
                    setTipoLicenca(e.target.value);
                    setMensagem("");
                  }}
                  className="w-full rounded-xl border border-slate-200
                    bg-white px-3 py-3 text-sm outline-none
                    focus:border-emerald-600"
                >
                  <option value="">Seleccione uma licença</option>
                  {licencas.map((licenca) => (
                    <option key={licenca.id} value={licenca.id}>
                      {licenca.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="requerente" className="mb-2 block text-sm font-medium">
                  Nome do requerente
                </label>
                <input
                  id="requerente"
                  required
                  value={nomeRequerente}
                  onChange={(e) => {
                    setNomeRequerente(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Nome completo ou denominação da empresa"
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
                  Localização da actividade ou imóvel
                </label>
                <input
                  id="localizacao"
                  required
                  value={localizacao}
                  onChange={(e) => {
                    setLocalizacao(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Bairro, rua ou referência local"
                  className="w-full rounded-xl border border-slate-200
                    px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label htmlFor="descricao" className="mb-2 block text-sm font-medium">
                  Descrição do pedido
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
                  placeholder="Descreva brevemente a licença pretendida..."
                  className="w-full resize-y rounded-xl border border-slate-200
                    px-3 py-3 text-sm outline-none focus:border-emerald-600"
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
                className="flex w-full items-center justify-center gap-2
                  rounded-xl bg-emerald-700 px-4 py-3.5 text-sm
                  font-semibold text-white transition hover:bg-emerald-800"
              >
                <FileText size={18} />
                Validar dados do pedido
              </button>

              <p className="text-xs leading-5 text-slate-500">
                O preenchimento não constitui uma submissão oficial.
                O pedido deverá ser registado no sistema municipal.
              </p>
            </form>
          </section>
        ) : seleccionada ? (
          /* Detalhes da licença */
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-100
              bg-white p-5 shadow-sm">
              <div className={`mb-4 flex h-14 w-14 items-center
                justify-center rounded-2xl ${seleccionada.fundo}
                ${seleccionada.cor}`}>
                <seleccionada.icon size={28} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {seleccionada.titulo}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {seleccionada.detalhe}
              </p>

              <div className="mt-6">
                <h3 className="font-semibold text-slate-900">
                  Documentação a preparar
                </h3>

                <ul className="mt-3 space-y-3">
                  {seleccionada.requisitos.map((requisito) => (
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

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  A lista é indicativa. Os requisitos oficiais devem
                  ser confirmados junto do Município, conforme o tipo
                  de actividade e a legislação aplicável.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTipoLicenca(seleccionada.id);
                  setSeleccionada(null);
                  setNovoPedido(true);
                }}
                className="mt-6 flex w-full items-center justify-center
                  gap-2 rounded-xl bg-emerald-700 px-4 py-3
                  text-sm font-semibold text-white hover:bg-emerald-800"
              >
                <Plus size={18} />
                Iniciar pedido
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSeleccionada(null)}
              className="w-full rounded-xl border border-slate-200
                bg-white px-4 py-3 text-sm font-semibold text-slate-700
                hover:bg-slate-100"
            >
              Voltar às licenças
            </button>
          </section>
        ) : (
          /* Página principal */
          <>
            <section className="mb-5">
              <h2 className="text-base font-bold text-slate-900">
                As suas licenças
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Solicite, consulte e acompanhe as suas licenças municipais.
              </p>

              <button
                type="button"
                onClick={() => setNovoPedido(true)}
                className="mt-4 flex w-full items-center justify-center
                  gap-2 rounded-xl bg-emerald-700 px-4 py-3.5
                  text-sm font-semibold text-white shadow-sm
                  transition hover:bg-emerald-800"
              >
                <Plus size={19} />
                Solicitar Nova Licença
              </button>
            </section>

            <div className="mb-4 flex items-center gap-3 rounded-xl
              border border-slate-200 bg-white px-4 py-3
              focus-within:border-emerald-600">
              <Search size={19} className="shrink-0 text-slate-400" />
              <input
                type="search"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Pesquisar licença..."
                aria-label="Pesquisar licença"
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
            </div>

            <section aria-label="Tipos de licença">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">
                  Tipos de licença
                </h3>
                <span className="text-xs text-slate-500">
                  {listaFiltrada.length} serviços
                </span>
              </div>

              <div className="space-y-3">
                {listaFiltrada.map((licenca) => {
                  const Icon = licenca.icon;

                  return (
                    <button
                      key={licenca.id}
                      type="button"
                      onClick={() => setSeleccionada(licenca)}
                      className="group flex w-full items-center gap-3
                        rounded-2xl border border-slate-100 bg-white
                        p-3 text-left shadow-sm transition
                        hover:border-emerald-200 hover:shadow-md"
                    >
                      <span className={`flex h-12 w-12 shrink-0
                        items-center justify-center rounded-xl
                        ${licenca.fundo} ${licenca.cor}`}>
                        <Icon size={23} strokeWidth={2.2} />
                      </span>

                      <span className="min-w-0 flex-1 py-1">
                        <span className="block text-sm font-semibold
                          leading-5 text-slate-900">
                          {licenca.titulo}
                        </span>
                        <span className="mt-1 block text-xs
                          leading-5 text-slate-500">
                          {licenca.descricao}
                        </span>
                      </span>

                      <ArrowRight
                        size={18}
                        className="shrink-0 text-slate-400
                          transition group-hover:translate-x-0.5
                          group-hover:text-emerald-700"
                      />
                    </button>
                  );
                })}
              </div>

              {listaFiltrada.length === 0 && (
                <div className="rounded-2xl border border-dashed
                  border-slate-300 bg-white px-5 py-10 text-center">
                  <Search size={28} className="mx-auto text-slate-400" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    Nenhuma licença encontrada
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Tente pesquisar com outro termo.
                  </p>
                </div>
              )}
            </section>

            <div className="mt-6 flex items-start gap-3 rounded-xl
              border border-emerald-100 bg-emerald-50 p-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-emerald-700"
              />
              <p className="text-xs leading-5 text-emerald-900">
                A emissão e a renovação de licenças dependem da
                verificação dos requisitos e da aprovação pelos
                serviços municipais competentes.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
