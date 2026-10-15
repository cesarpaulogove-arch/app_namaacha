
"use client";

import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { obterSessao } from "@/lib/auth-local";

type SessaoUtilizador = {
  id: string;
  nome: string;
  email: string;
};

export function AppHeader() {
  const [utilizador, setUtilizador] =
    useState<SessaoUtilizador | null>(null);

 useEffect(() => {
  const sessao = obterSessao();

  if (
    sessao &&
    typeof sessao.nome === "string" &&
    typeof sessao.email === "string"
  ) {
    setUtilizador({
      id: sessao.id,
      nome: sessao.nome,
      email: sessao.email,
    });
  } else {
    setUtilizador(null);
  }
}, []);

  const iniciais = utilizador?.nome
    ? utilizador.nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex min-h-16 w-full max-w-screen-2xl items-center justify-between gap-3 px-4 py-3 sm:min-h-[72px] sm:px-6 lg:px-8">

        {/* Identidade municipal */}
        <Link
          href="/inicio"
          aria-label="Município de Namaacha - Início"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:gap-3"
        >
          <Image
            src="/logo_municipio.jpg"
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

        {/* Perfil dinâmico do utilizador */}
        <Link
          href="/perfil"
          aria-label={
            utilizador
              ? `Perfil de ${utilizador.nome}`
              : "Entrar ou consultar perfil"
          }
          title="Meu perfil"
          className="flex min-w-0 max-w-[65%] items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:gap-3 sm:p-2"
        >
          {/* Avatar ou iniciais */}
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-800 sm:size-11">
            {iniciais || (
              <UserRound size={21} aria-hidden="true" />
            )}
          </span>

          {/* Nome e email */}
          <span className="flex min-w-0 flex-col">
            <strong className="truncate text-xs font-bold text-slate-900 sm:text-sm">
              {utilizador?.nome || "Meu perfil"}
            </strong>

            <span className="max-w-full truncate text-[10px] text-slate-500 sm:text-xs">
              {utilizador?.email || "Inicie sessão"}
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
