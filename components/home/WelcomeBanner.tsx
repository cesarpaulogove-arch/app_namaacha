
import Image from "next/image";

export function WelcomeBanner() {
  return (
    <section className="w-full min-w-0">
      <div className="relative h-24 w-full overflow-hidden rounded-xl sm:h-32 md:h-40">
        <Image
          src="/logo_municipio.jpg"
          alt="Paisagem do Município de Namaacha"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6">
          <h1 className="text-base font-extrabold leading-tight tracking-tight text-white sm:text-xl">
            Namaacha
          </h1>

          <p className="mt-1 max-w-[90%] text-[11px] font-medium leading-snug text-white sm:text-sm">
            Juntos por um futuro melhor
          </p>
        </div>
      </div>
    </section>
  );
}
