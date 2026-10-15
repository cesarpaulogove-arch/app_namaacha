
"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CarFront,
  CheckCircle2,
  FileText,
  Landmark,
  Search,
  ShieldCheck,
  Wallet,
  Waves,
  X,
} from "lucide-react";

type Imposto = {
  id: string;
  titulo: string;
  descricao: string;
  detalhe: string;
  icon: typeof Building2;
  cor: string;
  fundo: string;
};

const impostos: Imposto[] = [
  {
    id: "predial",
    titulo: "Imposto Predial",
    descricao: "Imóveis urbanos e rurais",
    detalhe:
      "Consulte as obrigações fiscais relacionadas com os seus imóveis e obtenha informações sobre os procedimentos de pagamento.",
    icon: Landmark,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
  },
  {
    id: "actividade-economica",
    titulo: "Imposto de Actividade Económica",
    descricao: "Empresas e comércios",
    detalhe:
      "Consulte informações sobre as obrigações fiscais associadas à sua actividade económica.",
    icon: Building2,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
  },
  {
    id: "saneamento",
    titulo: "Taxa de Saneamento",
    descricao: "Serviços de limpeza e saneamento",
    detalhe:
      "Consulte informações sobre taxas municipais de saneamento e os respectivos procedimentos de regularização.",
    icon: Waves,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
  },
  {
    id: "licenca-funcionamento",
    titulo: "Taxa de Licença de Funcionamento",
    descricao: "Estabelecimentos comerciais",
    detalhe:
      "Consulte os procedimentos e requisitos aplicáveis às taxas de licenciamento de estabelecimentos comerciais.",
    icon: FileText,
    cor: "text-amber-700",
    fundo: "bg-amber-50",
  },
  {
    id: "veiculos",
    titulo: "Imposto sobre Veículos",
    descricao: "Veículos automóveis e similares",
    detalhe:
      "Consulte informações sobre as obrigações relacionadas com veículos, de acordo com as competências e os procedimentos aplicáveis.",
    icon: CarFront,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
  },
];

export default function ImpostosPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [seleccionado, setSeleccionado] =
    useState<Imposto | null>(null);

  const listaFiltrada = useMemo(() => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt");

    if (!termo) return impostos;

    return impostos.filter(
      (imposto) =>
        imposto.titulo.toLocaleLowerCase("pt").includes(termo) ||
        imposto.descricao.toLocaleLowerCase("pt").includes(termo)
    );
  }, [pesquisa]);

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* Cabeçalho */}
        <header className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (seleccionado) setSeleccionado(null);
              else window.history.back();
            }}
            aria-label="Voltar"
            className="flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full text-slate-700 transition hover:bg-slate-200"
          >
            <ArrowLeft size={21} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-center text-lg font-bold text-slate-900">
              Impostos e Taxas
            </h1>
            <p className="mt-1 text-center text-xs text-slate-500">
              Município da Namaacha
            </p>
          </div>

          <div className="h-10 w-10 shrink-0" />
        </header>

        {seleccionado ? (
          /* Detalhes do serviço */
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center
                  rounded-2xl ${seleccionado.fundo} ${seleccionado.cor}`}
              >
                <seleccionado.icon size={28} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {seleccionado.titulo}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {seleccionado.detalhe}
              </p>

              <div className="mt-5 flex gap-3 rounded-xl bg-emerald-50 p-4">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-emerald-700"
                  size={20}
                />
                <p className="text-sm leading-5 text-emerald-900">
                  Utilize os canais oficiais do Município para
                  confirmar os valores, os prazos e os requisitos
                  aplicáveis ao seu caso.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <h3 className="font-semibold text-slate-900">
                Como pretende continuar?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A consulta de dívidas e a emissão de referências
                dependem da integração com o sistema de gestão
                tributária municipal.
              </p>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Este serviço ficará disponível após a integração com o sistema municipal."
                  )
                }
                className="mt-5 flex w-full items-center justify-center
                  gap-2 rounded-xl bg-emerald-700 px-4 py-3
                  text-sm font-semibold text-white transition
                  hover:bg-emerald-800"
              >
                <Wallet size={18} />
                Consultar obrigação fiscal
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSeleccionado(null)}
              className="w-full rounded-xl border border-slate-200
                bg-white px-4 py-3 text-sm font-semibold text-slate-700
                hover:bg-slate-100"
            >
              Voltar aos impostos e taxas
            </button>
          </section>
        ) : (
          <>
            {/* Introdução */}
            <section className="mb-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center
                rounded-xl bg-emerald-100 text-emerald-800">
                <Wallet size={23} />
              </div>

              <h2 className="text-base font-bold text-slate-900">
                Os seus impostos e taxas
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Consulte os serviços fiscais municipais e acompanhe
                as suas obrigações.
              </p>
            </section>

            {/* Pesquisa */}
            <div className="mb-5 flex items-center gap-3 rounded-xl
              border border-slate-200 bg-white px-4 py-3
              focus-within:border-emerald-600">
              <Search size={19} className="shrink-0 text-slate-400" />

              <input
                type="search"
                value={pesquisa}
                onChange={(event) => setPesquisa(event.target.value)}
                placeholder="Pesquisar imposto ou taxa..."
                aria-label="Pesquisar imposto ou taxa"
                className="w-full bg-transparent text-sm text-slate-900
                  outline-none placeholder:text-slate-400"
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

            {/* Lista de serviços */}
            <section aria-label="Lista de impostos e taxas">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">
                  Serviços disponíveis
                </h2>

                <span className="text-xs text-slate-500">
                  {listaFiltrada.length} serviços
                </span>
              </div>

              <div className="space-y-3">
                {listaFiltrada.map((imposto) => {
                  const Icon = imposto.icon;

                  return (
                    <button
                      key={imposto.id}
                      type="button"
                      onClick={() => setSeleccionado(imposto)}
                      className="group flex w-full items-center gap-3
                        rounded-2xl border border-slate-100 bg-white
                        p-3 text-left shadow-sm transition
                        hover:border-emerald-200 hover:shadow-md
                        active:scale-[0.99]"
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0
                          items-center justify-center rounded-xl
                          ${imposto.fundo} ${imposto.cor}`}
                      >
                        <Icon size={23} strokeWidth={2.2} />
                      </span>

                      <span className="min-w-0 flex-1 py-1">
                        <span className="block text-sm font-semibold
                          leading-5 text-slate-900">
                          {imposto.titulo}
                        </span>

                        <span className="mt-1 block text-xs
                          leading-5 text-slate-500">
                          {imposto.descricao}
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
                  <Search
                    size={28}
                    className="mx-auto text-slate-400"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    Nenhum serviço encontrado
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Experimente pesquisar com outro termo.
                  </p>
                </div>
              )}
            </section>

            {/* Nota institucional */}
            <div className="mt-6 flex items-start gap-3 rounded-xl
              border border-emerald-100 bg-emerald-50 p-4">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-emerald-700"
              />

              <p className="text-xs leading-5 text-emerald-900">
                Consulte sempre os canais oficiais do Município
                para confirmar os valores e os prazos de pagamento.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
