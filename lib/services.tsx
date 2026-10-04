import {
  BusFront,
  Building2,
  Coins,
  Landmark,
  Store,
  Trash2,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  shortDescription: string;
  color: string;
  icon: LucideIcon;
  actions: { title: string; description: string }[];
};

export const services: Service[] = [
  {
    slug: "obras",
    title: "Licenciamento de obras e actividades",
    shortTitle: "Licenciamento",
    description: "Solicite e acompanhe licenças para obras, actividades e outros processos municipais.",
    shortDescription: "Licenças e autorizações",
    color: "green",
    icon: Building2,
    actions: [
      { title: "Solicitar licença", description: "Submeta o seu pedido online." },
      { title: "Acompanhar processo", description: "Verifique o andamento do seu pedido." },
      { title: "Consultar requisitos", description: "Saiba quais documentos são necessários." },
      { title: "Taxas e emolumentos", description: "Consulte os valores aplicáveis." }
    ]
  },
  {
    slug: "taxas",
    title: "Cobrança de taxas e impostos autárquicos",
    shortTitle: "Taxas e impostos",
    description: "Consulte débitos, efetue pagamentos e emita comprovativos.",
    shortDescription: "Consultar e pagar",
    color: "orange",
    icon: Coins,
    actions: [
      { title: "Consultar débitos", description: "Veja o seu histórico e valores em aberto." },
      { title: "Efetuar pagamento", description: "Pague por referência ou via móvel." },
      { title: "Emitir comprovativo", description: "Obtenha o seu comprovativo de pagamento." },
      { title: "Tabela de taxas", description: "Consulte os valores em vigor." }
    ]
  },
  {
    slug: "residuos",
    title: "Recolha de resíduos sólidos",
    shortTitle: "Recolha de resíduos",
    description: "Consulte horários, solicite recolhas e reporte problemas de limpeza.",
    shortDescription: "Agendar e reportar",
    color: "blue",
    icon: Trash2,
    actions: [
      { title: "Agendar recolha", description: "Escolha o dia e o local." },
      { title: "Reportar ocorrência", description: "Comunique pontos de lixo ou irregularidades." },
      { title: "Acompanhar solicitação", description: "Verifique o estado do seu pedido." },
      { title: "Informações", description: "Horários, dias e orientações de descarte." }
    ]
  },
  {
    slug: "mercados",
    title: "Mercados e feiras municipais",
    shortTitle: "Mercados e feiras",
    description: "Consulte espaços, licencie bancas e acompanhe os serviços comerciais.",
    shortDescription: "Espaços e licenças",
    color: "purple",
    icon: Store,
    actions: [
      { title: "Licenciar banca / espaço", description: "Solicite o seu alvará de funcionamento." },
      { title: "Consultar espaços disponíveis", description: "Veja mercados, feiras e espaços livres." },
      { title: "Ver regulamento", description: "Conheça as normas e orientações." },
      { title: "Pagamentos e taxas", description: "Consulte valores e efetue o pagamento." }
    ]
  },
  {
    slug: "atendimento",
    title: "Registo civil e atendimento ao munícipe",
    shortTitle: "Registo e atendimento",
    description: "Agende atendimento e consulte requisitos para os serviços municipais.",
    shortDescription: "Agendar e consultar",
    color: "pink",
    icon: UsersRound,
    actions: [
      { title: "Agendar atendimento", description: "Escolha o serviço, dia e horário." },
      { title: "Consultar requisitos", description: "Saiba o que precisa levar." },
      { title: "Acompanhar pedido", description: "Consulte o estado da sua solicitação." },
      { title: "Contactar o Município", description: "Encontre os canais oficiais de atendimento." }
    ]
  },
  {
    slug: "transporte",
    title: "Transporte e vias urbanas",
    shortTitle: "Transporte e vias",
    description: "Consulte informações de mobilidade e reporte problemas nas vias urbanas.",
    shortDescription: "Mobilidade e ocorrências",
    color: "teal",
    icon: BusFront,
    actions: [
      { title: "Consultar transporte", description: "Veja informações de mobilidade." },
      { title: "Reportar problema na via", description: "Comunique buracos, iluminação ou sinalização." },
      { title: "Acompanhar ocorrência", description: "Consulte o andamento da intervenção." },
      { title: "Obras e intervenções", description: "Veja intervenções municipais em curso." }
    ]
  }
];
