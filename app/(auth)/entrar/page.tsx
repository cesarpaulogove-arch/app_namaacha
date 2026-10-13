
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";

export default function EntrarPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center md:max-w-lg lg:max-w-xl">
        <AuthHeader />

        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:mt-8 sm:p-7 md:rounded-3xl md:p-8 lg:p-10">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Bem-vindo de volta
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Entre para gerir os seus serviços e pedidos municipais.
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            <LoginForm />
          </div>
        </section>

        <div className="mt-5 flex items-start justify-center gap-2 px-1 text-center text-xs leading-5 text-slate-500 sm:mt-6 sm:text-sm">
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-emerald-700"
            aria-hidden="true"
          />
          <span>
            Os seus dados devem ser tratados de forma segura.
          </span>
        </div>

        <footer className="mt-7 text-center text-xs leading-5 text-slate-400 sm:mt-8 sm:text-sm">
          <p>
            © {new Date().getFullYear()} Município de Namaacha
          </p>

          <Link
            href="/inicio"
            className="mt-2 inline-flex min-h-11 items-center justify-center px-3 font-medium text-slate-500 transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            Continuar sem iniciar sessão
          </Link>
        </footer>
      </div>
    </main>
  );
}

