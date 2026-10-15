"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { iniciarSessao } from "@/lib/auth-local";


export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [aEntrar, setAEntrar] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setAEntrar(true);

    try {
      await iniciarSessao(email, password);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Palavra-passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full rounded-lg border p-3"
        />
      </div>

      {erro && (
        <p role="alert" className="text-sm text-red-600">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={aEntrar}
        className="w-full rounded-lg bg-emerald-700 p-3 font-semibold text-white disabled:opacity-50"
      >
        {aEntrar ? "A entrar..." : "Entrar"}
      </button>
    </form>
  );
}