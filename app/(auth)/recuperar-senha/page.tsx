
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";

export default function RecuperarSenhaPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    // Posteriormente, enviar pedido à API de recuperação.
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center md:max-w-lg">
        <AuthHeader />

        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:mt-8 sm:rounded-3xl sm:p-7 md:p-8 lg:p-10">
          <div className="mb-5 grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700 sm:size-14">
            <MailCheck size={24} aria-hidden="true" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Recuperar palavra-passe
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Introduza o seu email para iniciar a recuperação da conta.
          </p>

          {submitted ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
            >
              Pedido registado nesta demonstração. A recuperação real
              será ativada quando ligarmos o serviço de autenticação.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4 sm:mt-8"
            >
              <div>
                <label
                  htmlFor="recovery-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <input
                  id="recovery-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="exemplo@email.com"
                  required
                  className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />
              </div>

              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/20 active:bg-emerald-900"
              >
                Recuperar acesso
              </button>
            </form>
          )}

          <Link
            href="/entrar"
            className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao login
          </Link>
        </section>

        <footer className="mt-6 pb-2 text-center text-xs leading-5 text-slate-400 sm:mt-8 sm:text-sm">
          © {new Date().getFullYear()} Município de Namaacha
        </footer>
      </div>
    </main>
  );
}

