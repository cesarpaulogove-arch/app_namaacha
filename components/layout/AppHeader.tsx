
import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex min-h-16 w-full max-w-screen-2xl items-center justify-between gap-3 px-4 py-3 sm:min-h-[72px] sm:px-6 lg:px-8">
        {/* Logótipo e identidade municipal */}
        <Link
          href="/inicio"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:gap-3"
          aria-label="Município de Namaacha - Início"
        >
          <Image
            src="/images/logo-namaacha.png"
            alt="Município de Namaacha"
            width={44}
            height={44}
            priority
            sizes="(max-width: 639px) 36px, 44px"
            className="size-9 shrink-0 object-contain sm:size-11"
          />

          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[10px] leading-tight text-muted sm:text-xs">
              Município de
            </span>

            <strong className="truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
              Namaacha
            </strong>
          </span>
        </Link>

        {/* Notificações */}
        <Link
          href="/notificacoes"
          aria-label="Notificações"
          title="Notificações"
          className="grid size-11 shrink-0 place-items-center rounded-full text-primary transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 active:bg-green-100"
        >
          <Bell size={21} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}

