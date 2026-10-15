
"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  Headphones,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";

type EstadoReclamacao =
  | "Recebida"
  | "Em análise"
  | "Resolvida"
  | "Rejeitada";

type Reclamacao = {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  local: string;
  data: string;
  estado: EstadoReclamacao;
  protocolo: string;
  resposta?: string;
};

const reclamacoesIniciais: Reclamacao[] = [
  {
    id: "1",
    titulo: "Acumulação de lixo na via pública",
    categoria: "Saneamento",
    descricao:
      "Existe acumulação de resíduos junto à estrada, causando mau cheiro e dificultando a circulação dos peões.",
    local: "Centro de Namaacha",
    data: "12/10/2026",
    estado: "Em análise",
    protocolo: "REC-2026-001",
    resposta:
      "A reclamação foi encaminhada para análise do setor responsável.",
  },
  {
    id: "2",
    titulo: "Iluminação pública avariada",
    categoria: "Iluminação pública",
    descricao:
      "Os candeeiros da rua encontram-se apagados durante a noite.",
    local: "Bairro da Vila",
    data: "09/10/2026",
    estado: "Recebida",
    protocolo: "REC-2026-002",
  },
  {
    id: "3",
    titulo: "Problema no escoamento de águas",
    categoria: "Infraestruturas",
    descricao:
      "A água acumula-se na via sempre que chove, dificultando a passagem de pessoas e veículos.",
    local: "Zona residencial",
    data: "05/10/2026",
    estado: "Resolvida",
    protocolo: "REC-2026-003",
    resposta:
      "O caso foi marcado como resolvido no registo demonstrativo.",
  },
];

const estados: EstadoReclamacao[] = [
  "Recebida",
  "Em análise",
  "Resolvida",
  "Rejeitada",
];

const categorias = [
  "Saneamento",
  "Iluminação pública",
  "Infraestruturas",
  "Abastecimento de água",
  "Espaços públicos",
  "Atendimento municipal",
  "Outra",
];

function estiloEstado(estado: EstadoReclamacao) {
  switch (estado) {
    case "Recebida":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Em análise":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Resolvida":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Rejeitada":
      return "bg-red-50 text-red-700 border-red-100";
  }
}

function IconeEstado({ estado }: { estado: EstadoReclamacao }) {
  if (estado === "Resolvida") {
    return <CheckCircle2 size={15} />;
  }

  if (estado === "Em análise") {
    return <Clock3 size={15} />;
  }

  if (estado === "Rejeitada") {
    return <AlertCircle size={15} />;
  }

  return <FileText size={15} />;
}

export default function ReclamacoesPage() {
  const [reclamacoes, setReclamacoes] =
    useState<Reclamacao[]>(reclamacoesIniciais);

  const [vista, setVista] = useState<"lista" | "nova" | "detalhe">(
    "lista",
  );

  const [reclamacaoSelecionada, setReclamacaoSelecionada] =
    useState<Reclamacao | null>(null);

  const [pesquisa, setPesquisa] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Saneamento");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const totalRecebidas = reclamacoes.filter(
    (r) => r.estado === "Recebida",
  ).length;

  const totalEmAnalise = reclamacoes.filter(
    (r) => r.estado === "Em análise",
  ).length;

  const totalResolvidas = reclamacoes.filter(
    (r) => r.estado === "Resolvida",
  ).length;

  const reclamacoesFiltradas = useMemo(() => {
    const termo = pesquisa.toLowerCase().trim();

    return reclamacoes.filter((r) => {
      const correspondePesquisa =
        !termo ||
        r.titulo.toLowerCase().includes(termo) ||
        r.protocolo.toLowerCase().includes(termo) ||
        r.categoria.toLowerCase().includes(termo) ||
        r.local.toLowerCase().includes(termo);

      const correspondeEstado =
        filtroEstado === "Todas" || r.estado === filtroEstado;

      return correspondePesquisa && correspondeEstado;
    });
  }, [reclamacoes, pesquisa, filtroEstado]);

  function abrirDetalhe(reclamacao: Reclamacao) {
    setReclamacaoSelecionada(reclamacao);
    setVista("detalhe");
    setMensagem("");
  }

  function voltarLista() {
    setVista("lista");
    setReclamacaoSelecionada(null);
    setMensagem("");
  }

  function submeterReclamacao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!titulo.trim() || !descricao.trim() || !local.trim()) {
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    const novaReclamacao: Reclamacao = {
      id: String(Date.now()),
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      local: local.trim(),
      data: new Date().toLocaleDateString("pt-PT"),
      estado: "Recebida",
      protocolo: `REC-DEMO-${Date.now().toString().slice(-6)}`,
    };

    setReclamacoes((atuais) => [novaReclamacao, ...atuais]);
    setReclamacaoSelecionada(novaReclamacao);
    setTitulo("");
    setCategoria("Saneamento");
    setDescricao("");
    setLocal("");
    setContacto("");
    setMensagem("");
    setVista("detalhe");
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-10 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
        {/* Cabeçalho */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {vista !== "lista" && (
              <button
                type="button"
                onClick={voltarLista}
                aria-label="Voltar à lista"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
              >
                <ArrowLeft size={19} />
              </button>
            )}

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <MessageSquare size={25} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">
                Município de Namaacha
              </p>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Reclamações
              </h1>
            </div>
          </div>

          {vista === "lista" && (
            <button
              type="button"
              onClick={() => {
                setVista("nova");
                setMensagem("");
              }}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:px-4"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova reclamação</span>
              <span className="sm:hidden">Nova</span>
            </button>
          )}
        </header>

        {/* Aviso demonstrativo */}
        <div className="mb-6 flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <ShieldCheck className="mt-0.5 shrink-0 text-orange-700" size={21} />
          <div>
            <p className="text-sm font-semibold text-orange-900">
              Portal de atendimento municipal
            </p>
            <p className="mt-1 text-sm leading-5 text-orange-800">
              Esta é uma demonstração. As reclamações registadas nesta página
              ficam apenas no estado local da aplicação e não são enviadas ao
              Município.
            </p>
          </div>
        </div>

        {/* Lista */}
        {vista === "lista" && (
          <>
            <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Recebidas</span>
                  <span className="rounded-xl bg-blue-50 p-2 text-blue-700">
                    <FileText size={19} />
                  </span>
                </div>
                <p className="text-3xl font-bold">{totalRecebidas}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Aguardam encaminhamento
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Em análise</span>
                  <span className="rounded-xl bg-amber-50 p-2 text-amber-700">
                    <Clock3 size={19} />
                  </span>
                </div>
                <p className="text-3xl font-bold">{totalEmAnalise}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Em acompanhamento
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Resolvidas</span>
                  <span className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                    <CheckCircle2 size={19} />
                  </span>
                </div>
                <p className="text-3xl font-bold">{totalResolvidas}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Marcadas como concluídas
                </p>
              </div>
            </section>

            {/* Pesquisa e filtros */}
            <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar por título, protocolo ou local..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setMostrarFiltros((atual) => !atual)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Filter size={17} />
                  Filtrar
                </button>
              </div>

              {mostrarFiltros && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <label
                    htmlFor="filtro-estado"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Estado da reclamação
                  </label>
                  <select
                    id="filtro-estado"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-orange-400 sm:max-w-xs"
                  >
                    <option value="Todas">Todos os estados</option>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </section>

            {/* Registos */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">
                  Minhas reclamações
                </h2>
                <span className="text-sm text-slate-500">
                  {reclamacoesFiltradas.length} registo(s)
                </span>
              </div>

              {reclamacoesFiltradas.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                  <Search className="mx-auto mb-3 text-slate-400" size={32} />
                  <p className="font-semibold text-slate-800">
                    Nenhuma reclamação encontrada
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Experimente alterar a pesquisa ou o filtro.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reclamacoesFiltradas.map((reclamacao) => (
                    <button
                      type="button"
                      key={reclamacao.id}
                      onClick={() => abrirDetalhe(reclamacao)}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <FileText size={21} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold leading-5 text-slate-900">
                              {reclamacao.titulo}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {reclamacao.protocolo}
                            </p>
                          </div>
                        </div>

                        <ChevronRight
                          size={20}
                          className="mt-1 shrink-0 text-slate-400"
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${estiloEstado(
                            reclamacao.estado,
                          )}`}
                        >
                          <IconeEstado estado={reclamacao.estado} />
                          {reclamacao.estado}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                          {reclamacao.categoria}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {reclamacao.data}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {reclamacao.local}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Formulário de nova reclamação */}
        {vista === "nova" && (
          <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Registar reclamação
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Descreva o problema e indique o local onde ocorre.
              </p>
            </div>

            <form onSubmit={submeterReclamacao} className="space-y-5">
              <div>
                <label
                  htmlFor="titulo"
                  className="mb-2 block text-sm font-semibold"
                >
                  Assunto <span className="text-red-500">*</span>
                </label>
                <input
                  id="titulo"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  maxLength={100}
                  placeholder="Ex.: Lixo acumulado na rua"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="categoria"
                  className="mb-2 block text-sm font-semibold"
                >
                  Categoria <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoria"
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-orange-400"
                >
                  {categorias.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="local"
                  className="mb-2 block text-sm font-semibold"
                >
                  Local da ocorrência{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="local"
                    required
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    maxLength={150}
                    placeholder="Bairro, rua ou ponto de referência"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="descricao"
                  className="mb-2 block text-sm font-semibold"
                >
                  Descrição detalhada{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="descricao"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  minLength={10}
                  maxLength={1500}
                  rows={5}
                  placeholder="Explique o problema, quando começou e como afeta a comunidade..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {descricao.length}/1500 caracteres
                </p>
              </div>

              <div>
                <label
                  htmlFor="contacto"
                  className="mb-2 block text-sm font-semibold"
                >
                  Contacto telefónico (opcional)
                </label>
                <input
                  id="contacto"
                  type="tel"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  maxLength={30}
                  placeholder="Ex.: 84 000 0000"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-orange-400"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Nesta demonstração, o contacto não é enviado nem guardado
                  num servidor.
                </p>
              </div>

              {mensagem && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700"
                >
                  {mensagem}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={voltarLista}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  <Send size={17} />
                  Registar reclamação
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Detalhes da reclamação */}
        {vista === "detalhe" && reclamacaoSelecionada && (
          <section className="mx-auto max-w-3xl space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Protocolo de acompanhamento
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${estiloEstado(
                    reclamacaoSelecionada.estado,
                  )}`}
                >
                  <IconeEstado estado={reclamacaoSelecionada.estado} />
                  {reclamacaoSelecionada.estado}
                </span>
              </div>

              <p className="mt-2 break-all text-sm font-bold text-orange-700">
                {reclamacaoSelecionada.protocolo}
              </p>

              <h2 className="mt-4 text-xl font-bold leading-7 text-slate-900 sm:text-2xl">
                {reclamacaoSelecionada.titulo}
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {reclamacaoSelecionada.categoria}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                  <CalendarDays size={14} />
                  {reclamacaoSelecionada.data}
                </span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Descrição
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {reclamacaoSelecionada.descricao}
                </p>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <MapPin className="mt-0.5 shrink-0 text-orange-600" size={19} />
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Local da ocorrência
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {reclamacaoSelecionada.local}
                  </p>
                </div>
              </div>

              {reclamacaoSelecionada.resposta && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <Headphones size={18} />
                    Informação de acompanhamento
                  </div>
                  <p className="mt-2 text-sm leading-6 text-blue-800">
                    {reclamacaoSelecionada.resposta}
                  </p>
                </div>
              )}
            </div>

            {/* Etapas ilustrativas */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h3 className="font-bold text-slate-900">
                Acompanhamento do processo
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Etapas ilustrativas do tratamento da reclamação.
              </p>

              <div className="mt-6 space-y-5">
                {[
                  {
                    titulo: "Reclamação registada",
                    descricao: "O registo foi criado na aplicação.",
                    concluido: true,
                  },
                  {
                    titulo: "Análise pelo setor responsável",
                    descricao: "Verificação e encaminhamento da ocorrência.",
                    concluido: [
                      "Em análise",
                      "Resolvida",
                    ].includes(reclamacaoSelecionada.estado),
                  },
                  {
                    titulo: "Resolução da ocorrência",
                    descricao: "Conclusão do tratamento do caso.",
                    concluido:
                      reclamacaoSelecionada.estado === "Resolvida",
                  },
                ].map((etapa, index) => (
                  <div key={etapa.titulo} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          etapa.concluido
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {etapa.concluido ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <span className="text-xs font-bold">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      {index < 2 && (
                        <div className="mt-1 h-7 w-0.5 bg-slate-200" />
                      )}
                    </div>

                    <div className="pt-1">
                      <p
                        className={`text-sm font-semibold ${
                          etapa.concluido
                            ? "text-slate-900"
                            : "text-slate-500"
                        }`}
                      >
                        {etapa.titulo}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {etapa.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={voltarLista}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Voltar às reclamações
            </button>
          </section>
        )}

        <footer className="mt-10 border-t border-slate-200 pt-5 text-center text-xs leading-5 text-slate-400">
          Namaacha • Portal de Serviços Municipais
          <br />
          Demonstração de interface — sem ligação a um sistema oficial.
        </footer>
      </div>
    </main>
  );
}
