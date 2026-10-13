
"use client";

import Link from "next/link";

export function RegisterForm() {
  return (
    <form
      className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        // Ligar ao endpoint de registo posteriormente.
      }}
    >
      {/* Nome completo */}
      <div className="min-w-0">
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Nome completo
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          placeholder="O seu nome completo"
          required
          className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
        />
      </div>

      {/* Email */}
      <div className="min-w-0">
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          inputMode="email"
          placeholder="exemplo@email.com"
          required
          className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
        />
      </div>

      {/* Número de telefone */}
      <div className="min-w-0">
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Número de telefone
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+258 8X XXX XXXX"
          required
          className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
        />
      </div>

      {/* Palavra-passe */}
      <div className="min-w-0">
        <label
          htmlFor="register-password"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Palavra-passe
        </label>

        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="Mínimo de 8 caracteres"
          required
          aria-describedby="password-hint"
          className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
        />

        <p
          id="password-hint"
          className="mt-2 text-xs leading-5 text-slate-500"
        >
          Utilize pelo menos 8 caracteres.
        </p>
      </div>

      {/* Termos de utilização */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl py-2 text-xs leading-5 text-slate-600 sm:text-sm">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        />

        <span>
          Aceito os termos de utilização e a política de privacidade.
        </span>
      </label>

      {/* Criar conta */}
      <button
        type="submit"
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/20 active:bg-emerald-900"
      >
        Criar a minha conta
      </button>

      {/* Acesso à conta existente */}
      <p className="text-center text-sm leading-6 text-slate-500">
        Já tem conta?{" "}
        <Link
          href="/entrar"
          className="font-bold text-emerald-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}

