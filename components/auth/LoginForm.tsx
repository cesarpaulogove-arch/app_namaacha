
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { iniciarSessao } from "@/lib/auth-local";

const campoClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 disabled:opacity-60";

export function LoginForm() {
  const router = useRouter();

  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [aEntrar, setAEntrar] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (aEntrar) return;

    if (!identificador.trim() || !password) {
      setErro("Introduza o email ou número de telefone e a palavra-passe.");
      return;
    }

    setErro("");
    setAEntrar(true);

    try {
      await iniciarSessao(identificador.trim(), password);
      router.push("/inicio");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar sessão."
      );
    } finally {
      setAEntrar(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="identificador"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email ou número de telefone
        </label>

        <input
          id="identificador"
          name="identificador"
          type="text"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
          autoComplete="username"
          placeholder="Email ou +258 84 123 4567"
          required
          disabled={aEntrar}
          className={campoClass}
        />

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Pode utilizar o email ou o número de telefone associado à sua conta municipal.
        </p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Palavra-passe
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="Introduza a sua palavra-passe"
          required
          disabled={aEntrar}
          className={campoClass}
        />
      </div>

      {erro && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={aEntrar}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 p-3 font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {aEntrar ? "A entrar..." : "Entrar"}
      </button>
    </form>
  );
}
