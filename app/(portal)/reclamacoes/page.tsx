
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquareText,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type EstadoReclamacao = "Em análise" | "Em tratamento" | "Resolvida";

type Reclamacao = {
  id: string;
  referencia: string;
  assunto: string;
  servico: string;
  descricao: string;
  nome: string;
  contacto: string;
  data: string;
  estado: EstadoReclamacao;
};

const CHAVE_RECLAMACOES = "namaacha_reclamacoes";

const servicosMunicipais = [
  "Impostos e Taxas",
  "Pagamentos",
  "Licenças",
  "Mercados",
  "Construção",
  "Publicidade",
  "Transporte",
  "Multas",
  "Limpeza e Saneamento",
  "Abastecimento de Água",
  "Atendimento Municipal",
  "Outro serviço",
];

function gerarReferencia() {
  const ano = new Date().getFullYear();
  const numero = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `REC-${ano}-${numero}`;
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data));
}

function obterEstadoVisual(estado: EstadoReclamacao) {
  switch (estado) {
    case "Resolvida":
      return {
        classe: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        icone: CheckCircle2,
      };
    case "Em tratamento":
      return {
        classe: "bg-blue-50 text-blue-700 ring-blue-200",
        icone: Clock,
      };
    default:
      return {
        classe: "bg-amber-50 text-amber-700 ring-amber-200",
        icone: Clock,
      };
  }
}

export default function ReclamacoesPage() {
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [aEnviar, setAEnviar] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro">(
    "sucesso"
  );

  const [formulario, setFormulario] = useState({
    nome: "",
    contacto: "",
    assunto: "",
    servico: "",
    descricao: "",
  });

  useEffect(() => {
    try {
      const dados = localStorage.getItem(CHAVE_RECLAMACOES);

      if (dados) {
        const lista: unknown = JSON.parse(dados);

        if (Array.isArray(lista)) {
          setReclamacoes(lista as Reclamacao[]);
        }
      }
    } catch {
      setReclamacoes([]);
    } finally {
      setCarregado(true);
    }
  }, []);

  function atualizarCampo(
    campo: keyof typeof formulario,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function mostrarMensagem(
    texto: string,
    tipo: "sucesso" | "erro"
  ) {
    setMensagem(texto);
    setTipoMensagem(tipo);
  }

  function submeterReclamacao(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem("");

    const nome = formulario.nome.trim();
    const contacto = formulario.contacto.trim();
    const assunto = formulario.assunto.trim();
    const descricao = formulario.descricao.trim();

    if (
      !nome ||
      !contacto ||
      !assunto ||
      !formulario.servico ||
      !descricao
    ) {
      mostrarMensagem(
        "Preencha todos os campos obrigatórios antes de submeter.",
        "erro"
      );
      return;
    }

    if (nome.length < 3) {
      mostrarMensagem("Introduza o seu nome completo.", "erro");
      return;
    }

    if (descricao.length < 15) {
      mostrarMensagem(
        "A descrição deve conter pelo menos 15 caracteres.",
        "erro"
      );
      return;
    }

    setAEnviar(true);

    try {
      const novaReclamacao: Reclamacao = {
        id: crypto.randomUUID(),
        referencia: gerarReferencia(),
        assunto,
        servico: formulario.servico,
        descricao,
        nome,
        contacto,
        data: new Date().toISOString(),
        estado: "Em análise",
      };

      const atualizadas = [novaReclamacao, ...reclamacoes];

      localStorage.setItem(
        CHAVE_RECLAMACOES,
        JSON.stringify(atualizadas)
      );

      setReclamacoes(atualizadas);

      setFormulario({
        nome: "",
        contacto: "",
        assunto: "",
        servico: "",
        descricao: "",
      });

      mostrarMensagem(
        `Reclamação submetida com sucesso. Referência: ${novaReclamacao.referencia}`,
        "sucesso"
      );
    } catch {
      mostrarMensagem(
        "Não foi possível guardar a reclamação neste navegador. Tente novamente.",
        "erro"
      );
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50/80 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Cabeçalho */}
        <section className="relative overflow-hidden rounded-3xl bg-emerald-950 px-6 py-8 text-white shadow-sm sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-700/30 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
                <MessageSquareText size={15} />
                Atendimento ao munícipe
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Reclamações e Sugestões
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50/80 sm:text-base">
                Partilhe a sua preocupação ou sugestão. A sua participação
                contribui para melhorar os serviços do Município da Namaacha.
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 md:self-center">
              <MessageSquareText size={38} strokeWidth={1.5} />
            </div>
          </div>
        </section>

        {/* Formulário e orientação */}
        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Send size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Apresentar reclamação
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Preencha os dados abaixo para registar a sua participação.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={submeterReclamacao}
              className="space-y-5 px-6 py-6 sm:px-8"
            >
              {mensagem && (
                <div
                  role="alert"
                  className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                    tipoMensagem === "sucesso"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {tipoMensagem === "sucesso" ? (
                    <CheckCircle2
                      className="mt-0.5 shrink-0"
                      size={19}
                    />
                  ) : (
                    <AlertCircle
                      className="mt-0.5 shrink-0"
                      size={19}
                    />
                  )}
                  <p>{mensagem}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="nome"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nome"
                    type="text"
                    autoComplete="name"
                    value={formulario.nome}
                    onChange={(e) => atualizarCampo("nome", e.target.value)}
                    placeholder="Introduza o seu nome"
                    maxLength={120}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contacto"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Contacto telefónico{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contacto"
                    type="tel"
                    autoComplete="tel"
                    value={formulario.contacto}
                    onChange={(e) =>
                      atualizarCampo("contacto", e.target.value)
                    }
                    placeholder="Ex.: 84 123 4567"
                    maxLength={30}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="servico"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Serviço municipal{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="servico"
                  value={formulario.servico}
                  onChange={(e) =>
                    atualizarCampo("servico", e.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                >
                  <option value="">Seleccione o serviço relacionado</option>
                  {servicosMunicipais.map((servico) => (
                    <option key={servico} value={servico}>
                      {servico}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="assunto"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Assunto <span className="text-red-500">*</span>
                </label>
                <input
                  id="assunto"
                  type="text"
                  value={formulario.assunto}
                  onChange={(e) =>
                    atualizarCampo("assunto", e.target.value)
                  }
                  placeholder="Resuma o motivo da reclamação"
                  maxLength={150}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="descricao"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Descrição detalhada{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400">
                    {formulario.descricao.length}/2000
                  </span>
                </div>

                <textarea
                  id="descricao"
                  value={formulario.descricao}
                  onChange={(e) =>
                    atualizarCampo("descricao", e.target.value)
                  }
                  placeholder="Descreva a situação e os detalhes relevantes para a análise da sua reclamação..."
                  rows={6}
                  maxLength={2000}
                  minLength={15}
                  required
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                />

                <p className="text-xs leading-5 text-slate-500">
                  Inclua informações que ajudem o Município a compreender a
                  situação.
                </p>
              </div>

              <button
                type="submit"
                disabled={aEnviar}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aEnviar ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    A submeter...
                  </>
                ) : (
                  <>
                    Submeter reclamação
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-slate-500">
                Os campos assinalados com{" "}
                <span className="font-semibold text-red-500">*</span> são
                obrigatórios.
              </p>
            </form>
          </div>

          {/* Orientação */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <ShieldCheck size={23} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Como funciona?
                </h2>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Registe a reclamação
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Preencha o formulário com os seus dados e descreva a
                      situação.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Receba uma referência
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Será gerada uma referência para identificar o registo
                      guardado.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Consulte o histórico
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Os registos submetidos neste navegador aparecem no
                      histórico abaixo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <UserRound
                  className="mt-0.5 shrink-0 text-emerald-700"
                  size={22}
                />
                <div>
                  <h2 className="font-bold text-emerald-950">
                    A sua participação importa
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                    As reclamações e sugestões ajudam a identificar problemas
                    e a melhorar a qualidade dos serviços municipais.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Histórico */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Histórico de reclamações
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Consulte os registos submetidos neste navegador.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
              <FileText size={16} />
              {reclamacoes.length}{" "}
              {reclamacoes.length === 1 ? "registo" : "registos"}
            </div>
          </div>

          {!carregado ? (
            <div className="p-10 text-center text-sm text-slate-500">
              A carregar histórico...
            </div>
          ) : reclamacoes.length === 0 ? (
            <div className="px-6 py-14 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <MessageSquareText size={30} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">
                Ainda não existem reclamações
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Quando submeter uma reclamação, o registo será apresentado
                aqui para consulta.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reclamacoes.map((reclamacao) => {
                const visual = obterEstadoVisual(reclamacao.estado);
                const IconeEstado = visual.icone;

                return (
                  <article
                    key={reclamacao.id}
                    className="px-6 py-5 transition hover:bg-slate-50/70 sm:px-8"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600">
                            {reclamacao.referencia}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatarData(reclamacao.data)}
                          </span>
                        </div>

                        <h3 className="mt-3 break-words font-semibold text-slate-900">
                          {reclamacao.assunto}
                        </h3>

                        <p className="mt-1 text-sm text-emerald-700">
                          {reclamacao.servico}
                        </p>

                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                          {reclamacao.descricao}
                        </p>

                        <p className="mt-3 text-xs text-slate-400">
                          Submetida por {reclamacao.nome}
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${visual.classe}`}
                      >
                        <IconeEstado size={14} />
                        {reclamacao.estado}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="pb-4 text-center text-xs leading-5 text-slate-400">
          Município da Namaacha Digital · Plataforma de serviços municipais
        </p>
      </div>
    </main>
  );
}
