import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function HomePage() {
return ( <main className="relative min-h-dvh overflow-hidden bg-slate-100 lg:grid lg:grid-cols-2">

  {/* Fundo da página inicial no celular e tablet */}
 <div
  aria-hidden="true"
  className="absolute inset-0 bg-[url('/img_home.png')] bg-cover bg-[center_70%] lg:hidden"
/>

  {/* Degradê suave para melhorar a leitura */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-gradient-to-b from-sky-50/50 via-sky-50/30 to-transparent lg:hidden"
  />

  {/* Apresentação para computador */}
  <section className="relative hidden overflow-hidden bg-green-800 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
    <div>
      <AuthHeader />

      <div className="mt-24 max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-200">
          Município da Namaacha
        </p>

        <h1 className="mt-5 text-5xl font-bold leading-tight xl:text-6xl">
          Os serviços municipais na palma da sua mão.
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-8 text-green-100">
          Consulte impostos, acompanhe processos, solicite licenças
          e aceda aos serviços municipais num só lugar.
        </p>
      </div>
    </div>

    <p className="text-sm text-green-200">
      Namaacha Digital · Serviços públicos digitais
    </p>
  </section>

  {/* Página inicial para celular */}
  <section className="relative z-10 flex min-h-dvh flex-col items-center px-6 pb-10 pt-10 sm:px-10 lg:hidden">

    {/* Logótipo */}
    <div className="w-full max-w-sm">
      <AuthHeader />
    </div>

    {/* Boas-vindas */}
    <div className="mt-10 w-full max-w-md text-center sm:mt-16">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
        Bem-vindo ao
        <span className="block">Município de Namaacha</span>
      </h1>

      <p className="mx-auto mt-4 max-w-sm text-sm font-medium leading-6 text-slate-700 sm:text-base">
        A sua cidade, os nossos serviços.
        <span className="block">
          Mais simples, mais perto de si.
        </span>
      </p>
    </div>

    {/* Botões diretamente sobre o fundo */}
    <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-10">
      <Link
        href="/entrar"
        className="flex min-h-12 items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        Entrar
      </Link>

      <Link
        href="/criar-conta"
        className="flex min-h-12 items-center justify-center rounded-full border-2 border-emerald-800 bg-white/10 px-6 py-3 text-base font-bold text-slate-900 transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        Criar Conta
      </Link>
    </div>

    {/* Espaço flexível para deixar a paisagem visível em baixo */}
    <div className="min-h-32 flex-1 sm:min-h-40" />
  </section>

  {/* Formulário original — apenas computador */}
  <section className="relative z-10 hidden min-h-dvh items-center justify-center px-4 py-8 sm:px-8 lg:flex lg:px-10 xl:px-16">
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Bem-vindo!
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Inicia sessão para aceder aos serviços municipais.
        </p>

        <div className="mt-7">
          <LoginForm />
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          Ainda não tens conta?{" "}
          <Link
            href="/criar-conta"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Criar conta
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Município da Namaacha · Plataforma Digital
      </p>
    </div>
  </section>
</main>


);
}
