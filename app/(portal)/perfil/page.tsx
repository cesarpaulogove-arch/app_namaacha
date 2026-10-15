
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, UserRound } from "lucide-react";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import {
  obterSessao,
  terminarSessao,
} from "@/lib/auth-local";

type SessaoPerfil = {
  id: string;
  nome: string;
  email: string;
};

export default function PerfilPage() {
  const router = useRouter();

  const [sessao, setSessao] = useState<SessaoPerfil | null>(null);
  const [aCarregar, setACarregar] = useState(true);

  useEffect(() => {
    const sessaoAtual = obterSessao();

    if (!sessaoAtual) {
      router.replace("/entrar");
      return;
    }

    setSessao(sessaoAtual);
    setACarregar(false);
  }, [router]);

  function sair() {
    terminarSessao();
    router.replace("/entrar");
  }

  if (aCarregar || !sessao) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded-lg bg-slate-200" />
          <div className="h-52 rounded-2xl bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-5 pb-10 sm:py-8">
      <header className="flex items-center gap-3">
        <Link
          href="/inicio"
          aria-label="Voltar ao início"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-emerald-700">
            Município da Namaacha
          </p>
          <h1 className="text-xl font-bold text-slate-900">
            O meu perfil
          </h1>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <UserRound size={21} />
        </div>
      </header>

      <ProfileHeader
        nome={sessao.nome}
        email={sessao.email}
      />

      <section
        id="dados-pessoais"
        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Informações da conta
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Dados associados à sua sessão.
            </p>
          </div>

          <UserRound
            size={22}
            className="shrink-0 text-emerald-700"
          />
        </div>

        <div className="mt-5 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs font-medium text-slate-500">
              Nome completo
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
              {sessao.nome}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">
              Email
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-slate-800">
              {sessao.email}
            </p>
          </div>
        </div>

        <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          A edição dos dados pessoais será ligada ao registo
          completo da conta na próxima etapa.
        </p>
      </section>

      <ProfileMenu />

      <section
        id="seguranca"
        className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
      >
        <div>
          <h2 className="font-bold text-slate-900">
            Sessão e segurança
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Termine a sessão quando utilizar um dispositivo
            partilhado.
          </p>
        </div>

        <button
          type="button"
          onClick={sair}
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          <LogOut size={18} />
          Terminar sessão
        </button>
      </section>

      <footer className="pb-4 text-center text-xs text-slate-400">
        Município da Namaacha · Serviços Digitais
      </footer>
    </main>
  );
}
