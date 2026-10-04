import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  Info,
  Search,
  Upload
} from "lucide-react";
import { services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServicePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) notFound();

  return (
    <main className="page">
      <Link href="/servicos" className="back-link"><ArrowLeft size={17} /> Serviços</Link>

      <div className={`service-banner ${service.color}`}>
        <div className="large-service-icon"><service.icon size={23} /></div>
        <div>
          <span className="section-kicker">Serviço municipal</span>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </div>
      </div>

      <div className="service-actions">
        {service.actions.map((action, index) => (
          <div className="action-card" key={action.title}>
            <div className={`action-icon ${index === 0 ? "primary" : ""}`}>
              {index === 0 ? <FileCheck2 size={20} /> :
               index === 1 ? <Search size={20} /> :
               index === 2 ? <CreditCard size={20} /> : <Info size={20} />}
            </div>
            <div>
              <strong>{action.title}</strong>
              <span>{action.description}</span>
            </div>
            <ArrowRight size={17} />
          </div>
        ))}
      </div>

      <div className="info-box">
        <Info size={19} />
        <div>
          <strong>Antes de começar</strong>
          <p>Tenha consigo os documentos necessários. Poderá acompanhar o estado do pedido na área “Meus pedidos”.</p>
        </div>
      </div>

      <Link href="/pedidos" className="primary-button">
        <CheckCircle2 size={18} />
        Acompanhar um pedido
      </Link>
    </main>
  );
}
