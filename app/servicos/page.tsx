import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { services } from "@/lib/services";

export default function ServicosPage() {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <span className="section-kicker">Portal do Munícipe</span>
          <h1>Serviços</h1>
          <p>Escolha o serviço que pretende realizar.</p>
        </div>
      </div>

      <div className="search-box standalone">
        <Search size={19} />
        <input placeholder="Pesquisar serviços..." />
      </div>

      <div className="service-list">
        {services.map((service) => (
          <Link href={`/servicos/${service.slug}`} className="service-row" key={service.slug}>
            <div className={`service-icon ${service.color}`}><service.icon size={23} /></div>
            <div className="service-row-copy">
              <strong>{service.title}</strong>
              <span>{service.description}</span>
            </div>
            <ChevronRight size={19} />
          </Link>
        ))}
      </div>
    </main>
  );
}
