import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  MapPin,
  Search,
  Sparkles,
  Trash2,
  WalletCards
} from "lucide-react";
import { services } from "@/lib/services";

const iconMap: Record<string, React.ReactNode> = {
  obras: <FileText size={22} />,
  taxas: <WalletCards size={22} />,
  residuos: <Trash2 size={22} />,
  mercados: <MapPin size={22} />,
  atendimento: <CalendarDays size={22} />,
  transporte: <MapPin size={22} />
};

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-top">
          <div className="brand-mark">NM</div>
          <div className="hero-brand">
            <span>Município de</span>
            <strong>Namaacha</strong>
          </div>
          <Link href="/notificacoes" className="icon-button light" aria-label="Notificações">
            <Bell size={19} />
          </Link>
        </div>

        <div className="hero-copy">
          <div className="eyebrow">Portal do Munícipe</div>
          <h1>Serviços públicos mais simples.</h1>
          <p>Consulte, solicite, pague e acompanhe os serviços do Município de Namaacha.</p>
        </div>

        <div className="search-box">
          <Search size={19} />
          <input placeholder="O que procura?" aria-label="Pesquisar serviço" />
        </div>
      </section>

      <section className="content">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Acesso rápido</span>
            <h2>Serviços municipais</h2>
          </div>
          <Link href="/servicos" className="text-link">Ver todos <ArrowRight size={16} /></Link>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <Link
              href={`/servicos/${service.slug}`}
              className={`service-card ${service.color}`}
              key={service.slug}
            >
              <div className="service-icon">{iconMap[service.slug]}</div>
              <strong>{service.shortTitle}</strong>
              <span>{service.shortDescription}</span>
              <ChevronRight className="card-arrow" size={17} />
            </Link>
          ))}
        </div>

        <div className="quick-actions">
          <Link href="/pedidos" className="quick-card">
            <div className="quick-icon"><CheckCircle2 size={20} /></div>
            <div>
              <strong>Meus pedidos</strong>
              <span>Acompanhe os processos submetidos</span>
            </div>
            <ChevronRight size={18} />
          </Link>
          <Link href="/pagamentos" className="quick-card">
            <div className="quick-icon"><CreditCard size={20} /></div>
            <div>
              <strong>Pagamentos</strong>
              <span>Consulte taxas e comprovativos</span>
            </div>
            <ChevronRight size={18} />
          </Link>
        </div>

        <section className="notice">
          <div className="notice-icon"><Sparkles size={19} /></div>
          <div>
            <strong>Fique por dentro</strong>
            <p>Consulte avisos, campanhas, notícias e eventos do Município.</p>
          </div>
          <ArrowRight size={18} />
        </section>
      </section>
    </main>
  );
}
