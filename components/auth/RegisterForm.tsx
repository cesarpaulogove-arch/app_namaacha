
"use client";

import { useState, type FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  registarConta,
  type TipoTitular,
  type DocumentoCarregado,
} from "@/lib/auth-local";

const campoClass =
  "h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 disabled:opacity-60";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const ficheiroClass =
  "block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-800 disabled:opacity-60";

const MAX_TAMANHO = 2 * 1024 * 1024;

const TIPOS_PERMITIDOS: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg, .jpeg",
  "image/png": ".png",
  "image/webp": ".webp",
};

function validarFicheiro(ficheiro: File, descricao: string) {
  const extensaoValida = /\.(pdf|jpg|jpeg|png|webp)$/i.test(
    ficheiro.name
  );

  if (!extensaoValida || !TIPOS_PERMITIDOS[ficheiro.type]) {
    throw new Error(
      `${descricao}: selecione um ficheiro PDF, JPG, PNG ou WEBP.`
    );
  }

  if (ficheiro.size === 0) {
    throw new Error(`${descricao}: o ficheiro está vazio.`);
  }

  if (ficheiro.size > MAX_TAMANHO) {
    throw new Error(`${descricao}: o tamanho máximo é 2 MB.`);
  }
}

function converterFicheiro(
  ficheiro: File
): Promise<DocumentoCarregado> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onload = () => {
      if (typeof leitor.result !== "string") {
        reject(new Error(`Não foi possível ler ${ficheiro.name}.`));
        return;
      }

      resolve({
        nome: ficheiro.name,
        tipo: ficheiro.type,
        tamanho: ficheiro.size,
        dados: leitor.result,
      });
    };

    leitor.onerror = () => {
      reject(new Error(`Erro ao ler ${ficheiro.name}.`));
    };

    leitor.readAsDataURL(ficheiro);
  });
}

export function RegisterForm() {
  const router = useRouter();

  const [tipoTitular, setTipoTitular] =
    useState<TipoTitular>("cidadao");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [nomeBI, setNomeBI] = useState("");
  const [nomeNuit, setNomeNuit] = useState("");

  function alterarTipo(novoTipo: TipoTitular) {
    setTipoTitular(novoTipo);
    setError("");
    setSuccess("");
    setNomeBI("");
    setNomeNuit("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const nome = String(formData.get("nome") ?? "").trim();
      const email = String(formData.get("email") ?? "")
        .trim()
        .toLowerCase();
      const telefone = String(formData.get("telefone") ?? "").trim();
      const password = String(formData.get("password") ?? "");
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
      const termsAccepted = formData.get("terms") === "on";

      if (!termsAccepted) {
        throw new Error("Deve aceitar os termos de utilização.");
      }

      if (!nome || !email || !telefone || !password) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Introduza um endereço de email válido.");
      }

      if (password.length < 8) {
        throw new Error(
          "A palavra-passe deve ter pelo menos 8 caracteres."
        );
      }

      if (tipoTitular === "cidadao" && !documentoIdentificacao) {
        throw new Error("Introduza o número do BI ou passaporte.");
      }

      if (tipoTitular !== "cidadao" && !nuit) {
        throw new Error("Introduza o NUIT da entidade.");
      }

      if (tipoTitular === "empresa" && !numeroRegisto) {
        throw new Error("Introduza o número de registo da empresa.");
      }

      if (tipoTitular === "instituicao" && !tipoInstituicao) {
        throw new Error("Indique o tipo de instituição.");
      }

      const ficheiroBI = formData.get("documentoBI");
      const ficheiroNuit = formData.get("documentoNuit");

      let documentoBI: DocumentoCarregado | null = null;
      let documentoNuit: DocumentoCarregado | null = null;

      if (tipoTitular === "cidadao") {
        if (!(ficheiroBI instanceof File) || ficheiroBI.size === 0) {
          throw new Error("Anexe uma fotografia ou PDF do BI/passaporte.");
        }

        validarFicheiro(ficheiroBI, "BI/passaporte");
        documentoBI = await converterFicheiro(ficheiroBI);
      }

      if (ficheiroNuit instanceof File && ficheiroNuit.size > 0) {
        validarFicheiro(ficheiroNuit, "Comprovativo do NUIT");
        documentoNuit = await converterFicheiro(ficheiroNuit);
      } else if (tipoTitular !== "cidadao") {
        throw new Error("Anexe o comprovativo do NUIT da entidade.");
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
        documentoBI,
        documentoNuit,
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
            alterarTipo(event.target.value as TipoTitular)
          }
          disabled={loading}
          className={campoClass}
        >
          <option value="cidadao">Cidadão / Pessoa singular</option>
          <option value="empresa">Empresa</option>
          <option value="instituicao">Instituição</option>
        </select>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Esta escolha determina os dados de identificação associados
          à sua conta municipal.
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
        <>
          <div>
            <label
              htmlFor="documentoIdentificacao"
              className={labelClass}
            >
              Número do BI / Passaporte
            </label>
            <input
              id="documentoIdentificacao"
              name="documentoIdentificacao"
              type="text"
              placeholder="Número do BI ou passaporte"
              required
              disabled={loading}
              className={campoClass}
            />
          </div>

          <div>
            <label htmlFor="documentoBI" className={labelClass}>
              Fotografia ou PDF do BI / Passaporte
            </label>
            <input
              id="documentoBI"
              name="documentoBI"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              required
              disabled={loading}
              onChange={(event) =>
                setNomeBI(event.target.files?.[0]?.name ?? "")
              }
              className={ficheiroClass}
            />
            <p className="mt-2 text-xs text-slate-500">
              PDF, JPG, PNG ou WEBP. Máximo de 2 MB.
            </p>
            {nomeBI && (
              <p className="mt-2 break-all text-sm text-emerald-700">
                Ficheiro selecionado: {nomeBI}
              </p>
            )}
          </div>
        </>
      )}

      <div>
        <label htmlFor="nuit" className={labelClass}>
          NUIT {tipoTitular === "cidadao" ? "(opcional)" : "da entidade"}
        </label>
        <input
          id="nuit"
          name="nuit"
          type="text"
          inputMode="numeric"
          placeholder="Introduza o NUIT"
          required={tipoTitular !== "cidadao"}
          disabled={loading}
          className={campoClass}
        />
      </div>

      <div>
        <label htmlFor="documentoNuit" className={labelClass}>
          Comprovativo do NUIT
          {tipoTitular === "cidadao" ? " (opcional)" : ""}
        </label>
        <input
          id="documentoNuit"
          name="documentoNuit"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          required={tipoTitular !== "cidadao"}
          disabled={loading}
          onChange={(event) =>
            setNomeNuit(event.target.files?.[0]?.name ?? "")
          }
          className={ficheiroClass}
        />
        <p className="mt-2 text-xs text-slate-500">
          Anexe uma fotografia ou PDF. Máximo de 2 MB.
        </p>
        {nomeNuit && (
          <p className="mt-2 break-all text-sm text-emerald-700">
            Ficheiro selecionado: {nomeNuit}
          </p>
        )}
      </div>

      {tipoTitular === "empresa" && (
        <div>
          <label htmlFor="numeroRegisto" className={labelClass}>
            Número de registo comercial
          </label>
          <input
            id="numeroRegisto"
            name="numeroRegisto"
            type="text"
            placeholder="Número de registo da empresa"
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
          Endereço / Localização{" "}
          <span className="font-normal text-slate-400">(opcional)</span>
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
          Estes dados serão usados para aceder à conta e contactar
          o titular.
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
          Aceito os termos de utilização e a política de privacidade.
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
