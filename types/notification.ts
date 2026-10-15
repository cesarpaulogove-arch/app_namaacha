
export type TipoNotificacao =
  | "processo"
  | "pagamento"
  | "licenca"
  | "municipal"
  | "sistema";

export type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  data: string;
  lida: boolean;
  link?: string;
};
