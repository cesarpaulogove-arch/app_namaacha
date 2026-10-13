"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
House,
BriefcaseBusiness,
Files,
Bell,
UserRound,
} from "lucide-react";

const items = [
{ label: "Início", href: "/inicio", Icon: House },
{ label: "Serviços", href: "/servicos", Icon: BriefcaseBusiness },
{ label: "Processos", href: "/processos", Icon: Files },
{ label: "Notificações", href: "/notificacoes", Icon: Bell },
{ label: "Perfil", href: "/perfil", Icon: UserRound },
];

export function BottomNavigation() {
const pathname = usePathname();

return ( <nav
   aria-label="Navegação principal"
   className="
     fixed inset-x-0 bottom-0 z-40
     grid min-h-[68px] w-full grid-cols-5
     border-t border-border
     bg-white/95 px-1
     pb-[max(8px,env(safe-area-inset-bottom))]
     pt-2 backdrop-blur
     md:static md:inset-auto md:z-auto
     md:mx-auto md:max-w-screen-2xl
     md:flex md:min-h-0 md:justify-center
     md:gap-2 md:border-t-0 md:bg-transparent
     md:px-6 md:py-3
     lg:gap-4 lg:px-8
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
          justify-center gap-1 rounded-lg
          px-1 py-1 transition-colors
          md:flex-row md:gap-2 md:px-4 md:py-2
          ${
            active
              ? "text-primary md:bg-primary/10"
              : "text-muted hover:text-primary"
          }
        `}
      >
        <Icon
          size={20}
          strokeWidth={active ? 2.5 : 1.8}
          className="shrink-0"
        />

        <span className="whitespace-nowrap text-[9px] font-semibold sm:text-[10px] md:text-sm">
          {label}
        </span>
      </Link>
    );
  })}
</nav>


);
}
