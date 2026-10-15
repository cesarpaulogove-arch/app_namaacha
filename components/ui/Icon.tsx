
import {
  Landmark,
  Wallet,
  FileCheck,
  Store,
  HardHat,
  Megaphone,
  Bus,
  TriangleAlert,
  MessageSquare,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

const icons = {
  landmark: Landmark,
  wallet: Wallet,
  "file-check": FileCheck,
  store: Store,
  "hard-hat": HardHat,
  megaphone: Megaphone,
  bus: Bus,
  "triangle-alert": TriangleAlert,
  "message-square": MessageSquare,
  "chevron-right": ChevronRight,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  className,
}: IconProps) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.error(`Ícone não encontrado: ${name}`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      focusable="false"
    />
  );
}