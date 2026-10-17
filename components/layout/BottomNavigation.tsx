
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  BriefcaseBusiness,
  Bell,
} from "lucide-react";

const items = [
  { label: "Início", href: "/inicio", Icon: House },
  { label: "Serviços", href: "/servicos", Icon: BriefcaseBusiness },
  { label: "Notificações", href: "/notificacoes", Icon: Bell },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="
        fixed inset-x-0 bottom-0 z-40
        grid grid-cols-3 items-stretch
        border-t border-border
        bg-white/95 px-3
        pb-[max(8px,env(safe-area-inset-bottom))]
        pt-2 backdrop-blur-md
        md:static md:mx-auto md:flex
        md:min-h-0 md:max-w-screen-2xl
        md:items-center md:justify-center
        md:gap-3 md:border-t-0
        md:bg-transparent md:px-6 md:py-3
        lg:gap-6 lg:px-8
      "
    >
      {items.map(({ label, href, Icon }) => {
        const active =
          pathname === href ||
          pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`
              flex min-w-0 flex-col items-center
              justify-center gap-1.5
              rounded-xl px-2 py-2.5
              transition-all duration-200
              md:flex-row md:gap-2 md:px-5 md:py-2.5
              ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }
            `}
          >
            <span
              className={`
                flex h-8 w-8 shrink-0 items-center
                justify-center rounded-xl transition-colors
                md:h-auto md:w-auto md:rounded-none
                ${
                  active
                    ? "bg-primary/10 md:bg-transparent"
                    : ""
                }
              `}
            >
              <Icon
                size={21}
                strokeWidth={active ? 2.5 : 1.8}
                aria-hidden="true"
              />
            </span>

            <span
              className={`
                max-w-full truncate text-[11px]
                font-semibold leading-tight
                sm:text-xs md:text-sm
                ${active ? "font-bold" : ""}
              `}
            >
              {label}
            </span>

            {active && (
              <span
                className="
                  hidden h-1 w-1 rounded-full
                  bg-primary md:hidden
                "
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
