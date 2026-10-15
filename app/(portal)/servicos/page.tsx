
import { ServiceList } from "@/components/services/ServiceList";

export default function ServicosPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-5 pb-10 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-primary">
          Município da Namaacha
        </p>

        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
          Serviços municipais
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          Consulte os serviços disponíveis e aceda às respetivas
          áreas digitais de forma simples e conveniente.
        </p>
      </header>

      <section className="rounded-card bg-primary p-5 text-white sm:p-7">
        <div className="flex items-start gap-4">
          <div className="hidden size-12 shrink-0 place-items-center rounded-xl bg-white/10 sm:grid">
            <IconWrapper />
          </div>

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Tudo o que precisa, num só lugar
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Consulte impostos, pagamentos, licenças, mercados,
              construção e outros serviços do Município.
            </p>
          </div>
        </div>
      </section>

      <ServiceList />
    </main>
  );
}

function IconWrapper() {
  return (
    <span aria-hidden="true" className="text-white">
      <LandmarkIcon />
    </span>
  );
}

function LandmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-7"
    >
      <path
        d="M3 9h18L12 3 3 9Zm2 0v9m5-9v9m4-9v9m5-9v9M3 21h18M2 18h20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
