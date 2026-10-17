import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function CriarContaPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center md:max-w-lg">
        <AuthHeader />

        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:mt-8 sm:p-7 md:rounded-3xl md:p-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Criar conta
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Registe-se para aceder aos serviços municipais de Namaacha.
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            <RegisterForm />
          </div>
        </section>

        <footer className="mt-6 text-center text-sm text-slate-500">
          <Link
            href="/inicio"
            className="font-medium hover:text-emerald-700"
          >
            Continuar sem iniciar sessão
          </Link>
        </footer>
      </div>
    </main>
  );
}