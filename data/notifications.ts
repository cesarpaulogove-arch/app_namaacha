
import type { Notificacao } from "@/types/notification";

export const notificacoesIniciais: Notificacao[] = [
  {
    id: "NOT-001",
    titulo: "Atualização de processo",
    mensagem:
      "O estado do seu processo foi atualizado. Consulte os detalhes na área de processos.",
    tipo: "processo",
    data: "2026-10-15T09:30:00+02:00",
    lida: false,
    link: "/processos",
  },
  {
    id: "NOT-002",
    titulo: "Lembrete de pagamento",
    mensagem:
      "Consulte as suas obrigações municipais e verifique se existem pagamentos pendentes.",
    tipo: "pagamento",
    data: "2026-10-14T14:00:00+02:00",
    lida: false,
    link: "/pagamentos",
  },
  {
    id: "NOT-003",
    titulo: "Licença em análise",
    mensagem:
      "O seu pedido de licença encontra-se em análise. Acompanhe o respetivo processo.",
    tipo: "licenca",
    data: "2026-10-13T10:15:00+02:00",
    lida: false,
    link: "/licencas",
  },
  {
    id: "NOT-004",
    titulo: "Aviso municipal",
    mensagem:
      "Consulte os canais oficiais do Município para obter informações sobre serviços e comunicados.",
    tipo: "municipal",
    data: "2026-10-12T08:00:00+02:00",
    lida: true,
    link: "/inicio",
  },
  {
    id: "NOT-005",
    titulo: "Bem-vindo ao portal digital",
    mensagem:
      "Utilize o portal para acompanhar os seus pedidos e consultar os serviços municipais disponíveis.",
    tipo: "sistema",
    data: "2026-10-10T12:00:00+02:00",
    lida: true,
    link: "/inicio",
  },
];
