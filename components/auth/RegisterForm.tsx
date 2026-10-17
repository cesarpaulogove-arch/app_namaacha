
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  registarConta,
  type TipoTitular,
} from "@/lib/auth-local";

const campoClass =
  "h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 disabled:opacity-60";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

export function RegisterForm() {
  const router = useRouter();

  const [tipoTitular, setTipoTitular] =
    useState<TipoTitular>("cidadao");
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

    const formData = new FormData(event.currentTarget);

    const nome = String(formData.get("nome") ?? "").trim();
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const telefone = String(formData.get("telefone") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const termsAccepted = formData.get("terms") === "on";

    const nuit = String(formData.get("nuit") ?? "").trim();
    const documentoIdentificacao = String(
      formData.get("documentoIdentificacao") ?? ""
    ).trim();
    const numeroRegisto = String(
      formData.get("numeroRegisto") ?? ""
    ).trim();
    const tipoInstituicao = String(
      formData.get("tipoInstituicao") ?? ""
    ).trim();
    const endereco = String(formData.get("endereco") ?? "").trim();

    try {
      if (!termsAccepted) {
        throw new Error("Deve aceitar os termos de utilização.");
      }

      if (!nome || !email || !telefone || !password) {
        throw new Error(
          "Preencha todos os campos obrigatórios."
        );
      }

      if (password.length < 8) {
        throw new Error(
          "A palavra-passe deve ter pelo menos 8 caracteres."
        );
      }

      if (tipoTitular === "cidadao" && !documentoIdentificacao) {
        throw new Error(
          "Introduza o número do documento de identificação."
        );
      }

      if (tipoTitular !== "cidadao" && !nuit) {
        throw new Error("Introduza o NUIT da entidade.");
      }

      if (tipoTitular === "empresa" && !numeroRegisto) {
        throw new Error(
          "Introduza o número de registo da empresa."
        );
      }

      if (tipoTitular === "instituicao" && !tipoInstituicao) {
        throw new Error("Indique o tipo de instituição.");
      }

      await registarConta({
        nome,
        email,
        telefone,
        password,
        tipoTitular,
        nuit,
        documentoIdentificacao,
        numeroRegisto,
        tipoInstituicao,
        endereco,
      });

      setSuccess(
        "Conta criada com sucesso! A redireccionar para o login..."
      );

      window.setTimeout(() => {
        router.push("/entrar");
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar a conta. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  const nomeTitular =
    tipoTitular === "empresa"
      ? "Denominação da empresa"
      : tipoTitular === "instituicao"
        ? "Nome da instituição"
        : "Nome completo";

  const placeholderNome =
    tipoTitular === "empresa"
      ? "Ex.: Empresa, Lda."
      : tipoTitular === "instituicao"
        ? "Nome oficial da instituição"
        : "O seu nome completo";

  return (
    <form
      className="mt-6 space-y-5 sm:mt-8"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="tipoTitular" className={labelClass}>
          Tipo de conta
        </label>

        <select
          id="tipoTitular"
          name="tipoTitular"
          value={tipoTitular}
          onChange={(event) =>
            setTipoTitular(event.target.value as TipoTitular)
          }
          disabled={loading}
          className={campoClass}
        >
          <option value="cidadao">Cidadão / Pessoa singular</option>
          <option value="empresa">Empresa</option>
          <option value="instituicao">Instituição</option>
        </select>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Esta escolha determina os dados de identificação
          associados à sua conta municipal.
        </p>
      </div>

      <div>
        <label htmlFor="nome" className={labelClass}>
          {nomeTitular}
        </label>

        <input
          id="nome"
          name="nome"
          type="text"
          autoComplete="name"
          placeholder={placeholderNome}
          required
          disabled={loading}
          className={campoClass}
        />
      </div>

      {tipoTitular === "cidadao" && (
        <div>
          <label
            htmlFor="documentoIdentificacao"
            className={labelClass}
          >
            Documento de identificação
          </label>

          <input
            id="documentoIdentificacao"
            name="documentoIdentificacao"
            type="text"
            placeholder="Número do BI ou documento válido"
            required
            disabled={loading}
            className={campoClass}
          />
        </div>
      )}

      {tipoTitular !== "cidadao" && (
        <div>
          <label htmlFor="nuit" className={labelClass}>
            NUIT da entidade
          </label>

          <input
            id="nuit"
            name="nuit"
            type="text"
            inputMode="numeric"
            placeholder="Número Único de Identificação Tributária"
            required
            disabled={loading}
            className={campoClass}
          />
        </div>
      )}

      {tipoTitular === "empresa" && (
        <div>
          <label htmlFor="numeroRegisto" className={labelClass}>
            Número de registo comercial
          </label>

          <input
            id="numeroRegisto"
            name="numeroRegisto"
            type="text"
            placeholder="Número do registo da empresa"
            required
            disabled={loading}
            className={campoClass}
          />
        </div>
      )}

      {tipoTitular === "instituicao" && (
        <div>
          <label htmlFor="tipoInstituicao" className={labelClass}>
            Tipo de instituição
          </label>

          <select
            id="tipoInstituicao"
            name="tipoInstituicao"
            required
            disabled={loading}
            defaultValue=""
            className={campoClass}
          >
            <option value="" disabled>
              Selecione o tipo de instituição
            </option>
            <option value="publica">Instituição pública</option>
            <option value="privada">Instituição privada</option>
            <option value="ong">ONG / Associação</option>
            <option value="religiosa">Instituição religiosa</option>
            <option value="outra">Outra</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="endereco" className={labelClass}>
          Endereço / Localização
          <span className="font-normal text-slate-400">
            {" "}(opcional)
          </span>
        </label>

        <input
          id="endereco"
          name="endereco"
          type="text"
          autoComplete="street-address"
          placeholder="Bairro, localidade ou endereço"
          disabled={loading}
          className={campoClass}
        />
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-base font-bold text-slate-900">
          Contactos de acesso
        </h3>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          Estes dados serão usados para aceder à conta e
          contactar o titular.
        </p>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="exemplo@email.com"
          required
          disabled={loading}
          className={campoClass}
        />
      </div>

      <div>
        <label htmlFor="telefone" className={labelClass}>
          Número de telefone
        </label>

        <input
          id="telefone"
          name="telefone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+258 84 123 4567"
          required
          disabled={loading}
          className={campoClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Palavra-passe
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="Mínimo de 8 caracteres"
          required
          disabled={loading}
          aria-describedby="password-hint"
          className={campoClass}
        />

        <p
          id="password-hint"
          className="mt-2 text-xs leading-5 text-slate-500"
        >
          Utilize pelo menos 8 caracteres.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl py-2 text-xs leading-5 text-slate-600 sm:text-sm">
        <input
          type="checkbox"
          name="terms"
          required
          disabled={loading}
          className="mt-0.5 size-5 shrink-0 accent-emerald-700"
        />

        <span>
          Aceito os termos de utilização e a política de
          privacidade.
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/20 active:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "A criar conta..." : "Criar a minha conta"}
      </button>

      <p className="text-center text-sm leading-6 text-slate-500">
        Já tem conta?{" "}
        <Link
          href="/entrar"
          className="font-bold text-emerald-700 underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
