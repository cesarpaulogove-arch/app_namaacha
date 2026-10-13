import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";

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
icon: IconName;
color: ServiceColor;
};

const iconColors: Record<ServiceColor, string> = {
green: "bg-primary",
blue: "bg-info",
orange: "bg-warning",
purple: "bg-purple-600",
red: "bg-danger",
};

export function ServiceCard({
service,
variant = "grid",
}: {
service: MunicipalService;
variant?: "grid" | "list";
}) {
const isGrid = variant === "grid";

return (
<Link
href={service.href}
className={`         group flex min-w-0 rounded-card border border-border
        bg-white shadow-card transition duration-200
        hover:-translate-y-0.5 hover:shadow-md
        active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          isGrid
            ? "min-h-[120px] flex-col items-center justify-center gap-3 p-3 text-center sm:min-h-[140px] sm:p-4 lg:min-h-[160px]"
            : "min-h-[76px] items-center gap-3 p-3 sm:gap-4 sm:p-4"
        }
      `}
>
<span
className={`           grid size-10 shrink-0 place-items-center rounded-xl
          text-white sm:size-11
          ${iconColors[service.color]}
        `}
> <Icon
       name={service.icon}
       size={22}
       className="shrink-0"
     /> </span>

  <span
    className={`
      flex min-w-0 flex-col gap-1
      ${isGrid ? "w-full items-center" : "flex-1"}
    `}
  >
    <strong
      className={`
        break-words font-bold leading-snug
        ${
          isGrid
            ? "text-xs sm:text-sm lg:text-base"
            : "text-sm sm:text-base"
        }
      `}
    >
      {service.title}
    </strong>

    {!isGrid && (
      <span className="text-xs leading-relaxed text-muted sm:text-sm">
        {service.description}
      </span>
    )}

    {isGrid && (
      <span className="line-clamp-2 text-xs leading-relaxed text-muted">
        {service.description}
      </span>
    )}
  </span>

  {!isGrid && (
    <Icon
      name="chevron-right"
      size={20}
      className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
    />
  )}
</Link>

);
}
