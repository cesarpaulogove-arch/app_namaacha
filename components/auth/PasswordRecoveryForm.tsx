
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

export function PasswordRecoveryForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          data?.message ??
            "Não foi possível processar o pedido. Tente novamente."
        );
        return;
      }

      // A API deve apresentar uma resposta genérica,
      // sem revelar se o email está registado.
      setSuccess(
        data?.message ??
          "Se existir uma conta associada a este email, receberá instruções para recuperar a palavra-passe."
      );
    } catch {
      setError(
        "Não foi possível estabelecer ligação ao servidor. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="mt-6 space-y-5 sm:mt-8 sm:space-y-6"
      onSubmit={handleSubmit}
    >
      {/* Ícone informativo */}
      <div className="flex justify-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <ShieldCheck size={28} aria-hidden="true" />
        </div>
      </div>

      {/* Descrição */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Recuperar palavra-passe
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Introduza o email associado à sua conta. Se existir uma
          conta correspondente, enviaremos instruções para recuperar
          o acesso.
        </p>
      </div>

      {/* Email */}
      <div className="min-w-0">
        <label
          htmlFor="recovery-email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Endereço de email
        </label>

        <div className="relative">
          <Mail
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4"
          />

          <input
            id="recovery-email"
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            inputMode="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={loading}
            className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 disabled:opacity-60 sm:pl-11 sm:pr-4"
          />
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Mensagem de sucesso */}
      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-100 bg-emerald-50 p-4"
        >
          <p className="text-sm leading-6 text-emerald-800">
            {success}
          </p>
        </div>
      )}

      {/* Enviar pedido */}
      <button
        type="submit"
        disabled={loading}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/20 active:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "A processar pedido..." : "Recuperar palavra-passe"}
      </button>

      {/* Voltar ao login */}
      <Link
        href="/entrar"
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar à página de entrada
      </Link>
    </form>
  );
}

