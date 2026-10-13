
import Image from "next/image";
import Link from "next/link";

export function WelcomeBanner() {
  return (
    <section className="w-full overflow-hidden rounded-card bg-primary text-white shadow-card md:rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Conteúdo de boas-vindas */}
        <div className="flex min-w-0 flex-col items-start justify-center p-5 sm:p-7 lg:p-9">
          <span className="text-xs font-medium text-white/85 sm:text-sm">
            Bem-vindo ao
          </span>

          <h1 className="mb-2 mt-1.5 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Município de Namaacha
          </h1>

          <p className="mb-5 max-w-md text-sm leading-relaxed text-white/90 sm:mb-6 sm:text-base">
            A sua cidade, os nossos serviços.
            Mais simples, mais perto de si.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex min-h-11 max-w-full items-center justify-center rounded-full bg-white px-5 py-2.5 text-center text-xs font-bold text-primary-dark transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:text-sm"
          >
            Aceder ao meu dashboard
          </Link>
        </div>

        {/* Imagem de Namaacha */}
        <div className="relative h-36 min-w-0 sm:h-48 md:h-full md:min-h-64 lg:min-h-72">
          <Image
            src="/images/banners/namaacha.jpg"
            alt="Paisagem do Município de Namaacha"
            fill
            priority
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

