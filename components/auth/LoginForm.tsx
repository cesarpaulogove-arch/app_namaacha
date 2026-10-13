
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="mt-6 space-y-5 sm:mt-8 sm:space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        // Integrar com a API de autenticação posteriormente.
      }}
    >
      {/* Email ou telefone */}
      <div className="min-w-0">
        <label
          htmlFor="login"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email ou número de telefone
        </label>

        <div className="relative">
          <Mail
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4"
          />

          <input
            id="login"
            name="login"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="exemplo@email.com"
            required
            className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 sm:pl-11 sm:pr-4"
          />
        </div>
      </div>

      {/* Palavra-passe */}
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-700"
          >
            Palavra-passe
          </label>

          <Link
            href="/recuperar-senha"
            className="text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:text-sm"
          >
            Esqueceu-se?
          </Link>
        </div>

        <div className="relative">
          <LockKeyhole
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4"
          />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Introduza a sua palavra-passe"
            required
            className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-10 pr-12 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 sm:pl-11 sm:pr-12"
          />

          <button
            type="button"
            aria-label={
              showPassword
                ? "Ocultar palavra-passe"
                : "Mostrar palavra-passe"
            }
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Botão de entrada */}
      <button
        type="submit"
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/20 active:bg-emerald-900"
      >
        Entrar na minha conta
      </button>

      {/* Registo */}
      <p className="text-center text-sm leading-6 text-slate-500">
        Ainda não tem conta?{" "}
        <Link
          href="/criar-conta"
          className="font-bold text-emerald-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          Criar conta
        </Link>
      </p>
    </form>
  );
}

