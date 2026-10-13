
import Image from "next/image";
import Link from "next/link";

export function AuthHeader() {
  return (
    <header className="flex w-full items-center justify-center gap-3 px-2 sm:gap-4">
      <Link
        href="/entrar"
        aria-label="Município de Namaacha — página de entrada"
        className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:size-20"
      >
        <Image
          src="/logo_municipio.jpg"
          alt="Logótipo do Município de Namaacha"
          width={64}
          height={64}
          sizes="(max-width: 640px) 48px, 64px"
          className="h-12 w-12 object-contain sm:h-16 sm:w-16"
          priority
        />
      </Link>

      <div className="min-w-0 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-xs sm:tracking-[0.2em]">
          Município de
        </p>

        <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
          Namaacha
        </h1>
      </div>
    </header>
  );
}

