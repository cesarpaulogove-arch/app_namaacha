
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  MapPin,
  Megaphone,
  Search,
  Store,
  X,
  CalendarDays,
  Building2,
  Image as ImageIcon,
  Monitor,
} from "lucide-react";

type ServicoPublicidade = {
  id: string;
  titulo: string;
  descricao: string;
  detalhe: string;
  passos: string[];
  icon: typeof Megaphone;
  cor: string;
  fundo: string;
};

const servicos: ServicoPublicidade[] = [
  {
    id: "licenca",
    titulo: "Licença de Publicidade",
    descricao: "Solicite a sua licença",
    detalhe:
      "Prepare o pedido de autorização para instalação ou divulgação de publicidade no Município de Namaacha.",
    passos: [
      "Identifique o requerente ou a empresa responsável.",
      "Indique o tipo e a localização da publicidade.",
      "Prepare os documentos e imagens exigidos pelos serviços municipais.",
      "Aguarde a análise e a decisão do Município.",
    ],
    icon: Megaphone,
    cor: "text-violet-700",
    fundo: "bg-violet-50",
  },
  {
    id: "taxa",
    titulo: "Pagamento de Taxa",
    descricao: "Consulte as taxas de publicidade",
    detalhe:
      "Consulte informações relativas às taxas aplicáveis à instalação e exploração de publicidade.",
    passos: [
      "Identifique o tipo de publicidade.",
      "Indique a localização e as dimensões do anúncio.",
      "Solicite a confirmação do valor aplicável.",
      "Utilize uma referência e um meio de pagamento autorizado pelo Município.",
    ],
    icon: CalendarDays,
    cor: "text-amber-700",
    fundo: "bg-amber-50",
  },
  {
    id: "consulta",
    titulo: "Consultar Licenças",
    descricao: "Acompanhe o estado da solicitação",
    detalhe:
      "Consulte os dados dos pedidos de publicidade e acompanhe a sua tramitação.",
    passos: [
      "Tenha consigo a referência do pedido.",
      "Consulte o estado do processo.",
      "Verifique se existem documentos ou informações em falta.",
      "Contacte os serviços municipais caso necessite de esclarecimentos.",
    ],
    icon: ClipboardList,
    cor: "text-emerald-700",
    fundo: "bg-emerald-50",
  },
  {
    id: "painel",
    titulo: "Painéis e Outdoors",
    descricao: "Publicidade exterior e comercial",
    detalhe:
      "Prepare uma solicitação para instalação de painéis, outdoors e outros suportes publicitários exteriores.",
    passos: [
      "Identifique o tipo de painel ou outdoor.",
      "Indique as dimensões previstas.",
      "Informe a localização exacta da instalação.",
      "Confirme os requisitos técnicos e as autorizações necessárias.",
    ],
    icon: ImageIcon,
    cor: "text-blue-700",
    fundo: "bg-blue-50",
  },
  {
    id: "fachada",
    titulo: "Publicidade em Fachadas",
    descricao: "Anúncios em estabelecimentos",
    detalhe:
      "Consulte os procedimentos para publicidade colocada nas fachadas de lojas, escritórios e outros estabelecimentos.",
    passos: [
      "Identifique o estabelecimento.",
      "Descreva o letreiro ou anúncio.",
      "Indique as dimensões e a localização na fachada.",
      "Confirme as condições de autorização junto do Município.",
    ],
    icon: Store,
    cor: "text-green-700",
    fundo: "bg-green-50",
  },
  {
    id: "digital",
    titulo: "Publicidade Digital",
    descricao: "Ecrãs e painéis electrónicos",
    detalhe:
      "Prepare uma consulta sobre os requisitos aplicáveis à instalação de ecrãs e outros meios electrónicos de publicidade.",
    passos: [
      "Identifique o suporte electrónico.",
      "Indique o local de instalação.",
      "Descreva o conteúdo e a finalidade da publicidade.",
      "Confirme os requisitos técnicos e municipais aplicáveis.",
    ],
    icon: Monitor,
    cor: "text-cyan-700",
    fundo: "bg-cyan-50",
  },
];

type PedidoPublicidade = {
  requerente: string;
  contacto: string;
  entidade: string;
  tipo: string;
  localizacao: string;
  dimensoes: string;
  descricao: string;
  dataPretendida: string;
};

export default function PublicidadePage() {
  const [pesquisa, setPesquisa] = useState("");
  const [seleccionado, setSeleccionado] =
    useState<ServicoPublicidade | null>(null);
  const [mostrarPedido, setMostrarPedido] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [requerente, setRequerente] = useState("");
  const [contacto, setContacto] = useState("");
  const [entidade, setEntidade] = useState("");
  const [tipoPublicidade, setTipoPublicidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [dimensoes, setDimensoes] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataPretendida, setDataPretendida] = useState("");

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

    if (seleccionado?.id === "painel") {
      setTipoPublicidade("Painel publicitário / Outdoor");
    } else if (seleccionado?.id === "fachada") {
      setTipoPublicidade("Publicidade em fachada");
    } else if (seleccionado?.id === "digital") {
      setTipoPublicidade("Publicidade digital");
    } else {
      setTipoPublicidade("");
    }
  }

  function validarPedido(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pedido: PedidoPublicidade = {
      requerente: requerente.trim(),
      contacto: contacto.trim(),
      entidade: entidade.trim(),
      tipo: tipoPublicidade,
      localizacao: localizacao.trim(),
      dimensoes: dimensoes.trim(),
      descricao: descricao.trim(),
      dataPretendida,
    };

    if (
      !pedido.requerente ||
      !pedido.contacto ||
      !pedido.tipo ||
      !pedido.localizacao ||
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
              Publicidade
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
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-800">
                <Megaphone size={25} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Solicitar licença de publicidade
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preencha os dados do anúncio para preparar o seu
                pedido de autorização municipal.
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
                  Empresa ou estabelecimento
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
                  htmlFor="tipoPublicidade"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Tipo de publicidade *
                </label>
                <select
                  id="tipoPublicidade"
                  required
                  value={tipoPublicidade}
                  onChange={(e) => {
                    setTipoPublicidade(e.target.value);
                    setMensagem("");
                  }}
                  className={campo}
                >
                  <option value="">Seleccione o tipo</option>
                  <option value="Painel publicitário / Outdoor">
                    Painel publicitário / Outdoor
                  </option>
                  <option value="Publicidade em fachada">
                    Publicidade em fachada
                  </option>
                  <option value="Publicidade móvel">
                    Publicidade móvel
                  </option>
                  <option value="Cartaz ou faixa">
                    Cartaz ou faixa
                  </option>
                  <option value="Publicidade digital">
                    Publicidade digital
                  </option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="localizacao"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Localização da publicidade *
                </label>
                <input
                  id="localizacao"
                  required
                  maxLength={200}
                  value={localizacao}
                  onChange={(e) => {
                    setLocalizacao(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Bairro, rua ou ponto de referência"
                  className={campo}
                />
              </div>

              <div>
                <label
                  htmlFor="dimensoes"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Dimensões do anúncio
                </label>
                <input
                  id="dimensoes"
                  maxLength={100}
                  value={dimensoes}
                  onChange={(e) => {
                    setDimensoes(e.target.value);
                    setMensagem("");
                  }}
                  placeholder="Ex.: 3 m × 2 m"
                  className={campo}
                />
              </div>

              <div>
                <label
                  htmlFor="dataPretendida"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Data prevista para instalação
                </label>
                <input
                  id="dataPretendida"
                  type="date"
                  value={dataPretendida}
                  onChange={(e) => {
                    setDataPretendida(e.target.value);
                    setMensagem("");
                  }}
                  className={campo}
                />
              </div>

              <div>
                <label
                  htmlFor="descricao"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Descrição do anúncio *
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
                  placeholder="Descreva o conteúdo e a finalidade da publicidade."
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
                A validação não constitui uma licença, não confirma
                o pagamento de taxas e não substitui a aprovação
                oficial do Município.
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

              {seleccionado.id === "licenca" && (
                <button
                  type="button"
                  onClick={abrirPedido}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Solicitar licença
                  <ArrowRight size={18} />
                </button>
              )}

              {seleccionado.id === "painel" && (
                <button
                  type="button"
                  onClick={abrirPedido}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Registar painel ou outdoor
                  <ArrowRight size={18} />
                </button>
              )}

              {seleccionado.id === "fachada" && (
                <button
                  type="button"
                  onClick={abrirPedido}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Solicitar autorização
                  <ArrowRight size={18} />
                </button>
              )}

              {seleccionado.id === "digital" && (
                <button
                  type="button"
                  onClick={abrirPedido}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Solicitar autorização
                  <ArrowRight size={18} />
                </button>
              )}

              {(seleccionado.id === "taxa" ||
                seleccionado.id === "consulta") && (
                <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm leading-6 text-emerald-900">
                    Para consultar taxas oficiais, emitir referências
                    de pagamento ou verificar processos existentes,
                    será necessária a integração com os registos
                    municipais.
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
              Voltar aos serviços
            </button>
          </section>
        ) : (
          <>
            <section className="mb-5 overflow-hidden rounded-2xl bg-emerald-950 p-5 text-white">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                <Megaphone size={27} />
              </div>

              <h2 className="text-lg font-bold">
                Dê mais visibilidade ao seu negócio!
              </h2>

              <p className="mt-2 text-sm leading-6 text-emerald-100">
                Consulte os serviços de publicidade, prepare os seus
                pedidos de licença e conheça os procedimentos
                aplicáveis no Município de Namaacha.
              </p>
            </section>

            <section className="mb-5">
              <h2 className="text-base font-bold text-slate-900">
                Serviços de publicidade
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Solicite licenças, consulte taxas e acompanhe os
                procedimentos relativos à publicidade.
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
                aria-label="Pesquisar serviços de publicidade"
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
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Building2 size={23} />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Publicidade com responsabilidade
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Antes de instalar um anúncio, confirme as condições
                de licenciamento, as taxas aplicáveis e os requisitos
                definidos pelos serviços municipais.
              </p>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />
                <p className="text-xs leading-5 text-slate-600">
                  Município de Namaacha — serviços de licenciamento
                  e fiscalização de publicidade.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
