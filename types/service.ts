export type ServiceIconName =
  | "landmark"
  | "wallet"
  | "file-check"
  | "store"
  | "hard-hat"
  | "megaphone"
  | "bus"
  | "triangle-alert"
  | "message-square"
  | "chevron-right";

export type ServiceColor =
  | "green"
  | "blue"
  | "orange"
  | "purple"
  | "red";

export type MunicipalService = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ServiceIconName;
  color: ServiceColor;
  image?: string;
};