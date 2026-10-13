
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function CriarContaPage() {
  return (
    <main className="min-h-dvh bg-slate-50 lg:grid lg:grid-cols-2">
      {/* Painel de apresentação para computadores */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-emerald-800 p-10 text-white lg:flex xl:p-16">
        <AuthHeader />

        <div className="mx-auto my-12 w-full max-w-xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Município da Namaacha
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
            Crie a sua conta e aceda aos serviços municipais.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-emerald-100 xl:text-lg">
            Registe-se na Namaacha Digital para consultar impostos,
            acompanhar processos e solicitar serviços municipais
            de forma simples e segura.
          </p>
        </div>

        <p className="text-sm text-emerald-200">
          © {new Date().getFullYear()} Município de Namaacha
        </p>
      </aside>

      {/* Formulário de registo */}
      <section className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-8 lg:px-10 xl:px-16">
        <div className="w-full max-w-lg">
          {/* Cabeçalho visível em ecrãs pequenos */}
          <div className="mb-7 lg:hidden">
            <AuthHeader />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Criar conta
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                Preencha os seus dados para aceder aos serviços municipais.
              </p>
            </div>

            <RegisterForm />

            <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
              Já tem uma conta?{" "}
              <Link
                href="/entrar"
                className="font-semibold text-emerald-700 transition hover:text-emerald-900"
              >
                Iniciar sessão
              </Link>
            </div>
          </div>

          <footer className="mt-6 text-center text-xs leading-5 text-slate-400">
            © {new Date().getFullYear()} Município de Namaacha
            <p className="mt-1">
              Plataforma Digital de Serviços Municipais
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}