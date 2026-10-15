
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Search,
  Store,
  Wallet,
  X,
} from "lucide-react";

type ServicoMercado = {
  id: string;
  titulo: string;
  descricao: string;
  detalhe: string;
  passos: string[];
  icon: typeof Store;
  cor: string;
  fundo: string;
};

const servicos: ServicoMercado[] = [
  {
    id: "taxa",
    titulo: "Pagamento de Taxa de Mercado",
    descricao: "Emita a sua referência",
    detalhe:
      "Consulte as informações relativas às taxas de ocupação e utilização dos mercados municipais.",
    passos: [
      "Identifique o mercado e a banca.",
      "Confirme o período a pagar.",
      "Consulte o valor e os meios de pagamento autorizados.",
    ],
    icon: CalendarDays,
    cor: "text-amber-700",
    fundo: "bg-amber-50",
  },
  {
    id: "bancas",
    titulo: "Autorização de Bancas",
    descricao: "Solicite a sua autorização",
    detalhe:
      "Prepare um pedido de atribuição ou autorização de utilização de uma banca num mercado municipal.",
    passos: [
      "Identifique o mercado pretendido.",
      "Indique a actividade comercial.",
      "Apresente os documentos exigidos pelo Município.",
    ],
    icon: ClipboardList,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
  },
  {
    id: "ocupacao",
    titulo: "Consultar Ocupação",
    descricao: "Verifique a disponibilidade",
    detalhe:
      "Consulte informações sobre os espaços comerciais e a disponibilidade de bancas nos mercados municipais.",
    passos: [
      "Seleccione o mercado.",
      "Consulte os espaços disponíveis, se houver dados actualizados.",
      "Contacte os serviços municipais para confirmar a disponibilidade.",
    ],
    icon: Store,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
  },
];

export default function MercadosPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [seleccionado, setSeleccionado] =
    useState<ServicoMercado | null>(null);
  const [mostrarPedido, setMostrarPedido] = useState(false);

  const [requerente, setRequerente] = useState("");
  const [contacto, setContacto] = useState("");
  const [mercado, setMercado] = useState("");
  const [actividade, setActividade] = useState("");
  const [mensagem, setMensagem] = useState("");

  const filtrados = servicos.filter((servico) => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt");

    return (
      servico.titulo.toLocaleLowerCase("pt").includes(termo) ||
      servico.descricao.toLocaleLowerCase("pt").includes(termo)
    );
  });

  function voltar() {
    if (mostrarPedido) {
      setMostrarPedido(false);
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
      "Dados validados no formulário. O pedido ainda não foi registado, pois falta a integração com o sistema municipal."
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
            className="flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full text-slate-700 hover:bg-slate-200"
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

        {mostrarPedido ? (
          <section>
            <div className="mb-5">
              <div className="mb-3 flex h-12 w-12 items-center
                justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <Store size={25} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Pedido de autorização de banca
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preencha os dados para preparar o seu pedido.
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
                <label htmlFor="mercado" className="mb-2 block text-sm font-medium">
                  Mercado pretendido
                </label>
                <input
                  id="mercado"
                  required
                  value={mercado}
                  onChange={(e) => {
                    setMercado(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Nome ou localização do mercado"
                  className="w-full rounded-xl border border-slate-200
                    px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label htmlFor="actividade" className="mb-2 block text-sm font-medium">
                  Actividade comercial
                </label>
                <textarea
                  id="actividade"
                  required
                  rows={3}
                  value={actividade}
                  onChange={(e) => {
                    setActividade(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Indique os produtos ou serviços que pretende comercializar"
                  className="w-full rounded-xl border border-slate-200
                    px-3 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              {mensagem && (
                <div role="status" className="rounded-xl bg-amber-50
                  p-4 text-sm leading-6 text-amber-900">
                  {mensagem}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-700 px-4 py-3.5
                  text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Validar dados do pedido
              </button>

              <p className="text-xs leading-5 text-slate-500">
                A validação do formulário não representa uma autorização
                oficial nem confirma a disponibilidade de uma banca.
              </p>
            </form>
          </section>
        ) : seleccionado ? (
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
                Como proceder
              </h3>

              <ul className="mt-3 space-y-3">
                {seleccionado.passos.map((passo) => (
                  <li key={passo} className="flex gap-3 text-sm
                    leading-5 text-slate-600">
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-emerald-700"
                    />
                    {passo}
                  </li>
                ))}
              </ul>

              {seleccionado.id === "bancas" && (
                <button
                  type="button"
                  onClick={() => setMostrarPedido(true)}
                  className="mt-6 flex w-full items-center justify-center
                    gap-2 rounded-xl bg-emerald-700 px-4 py-3
                    text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Solicitar autorização
                  <ArrowRight size={18} />
                </button>
              )}

              {seleccionado.id !== "bancas" && (
                <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm leading-6 text-emerald-900">
                    Para consultar valores, emitir referências ou verificar
                    a ocupação, será necessária a integração com os registos
                    oficiais do Município.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSeleccionado(null)}
              className="w-full rounded-xl border border-slate-200
                bg-white px-4 py-3 text-sm font-semibold text-slate-700
                hover:bg-slate-100"
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
                Consulte taxas, solicite autorizações e acompanhe
                os procedimentos dos mercados municipais.
              </p>
            </section>

            <label className="mb-4 flex items-center gap-3 rounded-xl
              border border-slate-200 bg-white px-4 py-3
              focus-within:border-emerald-600">
              <Search size={19} className="shrink-0 text-slate-400" />
              <input
                type="search"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Pesquisar serviço..."
                className="w-full bg-transparent text-sm outline-none
                  placeholder:text-slate-400"
                aria-label="Pesquisar serviço dos mercados"
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

            <section className="relative mt-6 overflow-hidden rounded-2xl
              bg-emerald-950 p-5 text-white">
              <MapPin size={22} className="mb-3 text-emerald-300" />
              <h3 className="text-base font-bold">
                Mercados organizados, comércio mais forte!
              </h3>
              <p className="mt-2 text-sm leading-6 text-emerald-100">
                Consulte os serviços municipais e acompanhe os
                procedimentos relativos à sua actividade comercial.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
