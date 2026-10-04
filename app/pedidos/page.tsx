import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, FileText } from "lucide-react";

const requests = [
  { id: "NM-2026-00481", title: "Licenciamento de actividade", date: "02 Out 2026", status: "Em análise", type: "processing" },
  { id: "NM-2026-00397", title: "Pedido de recolha de resíduos", date: "28 Set 2026", status: "Concluído", type: "done" },
  { id: "NM-2026-00342", title: "Atendimento ao munícipe", date: "22 Set 2026", status: "Agendado", type: "scheduled" }
];

export default function PedidosPage() {
  return (
    <main className="page">
      <Link href="/" className="back-link"><ArrowLeft size={17} /> Início</Link>
      <div className="page-header">
        <span className="section-kicker">Área pessoal</span>
        <h1>Meus pedidos</h1>
        <p>Acompanhe o andamento dos seus processos.</p>
      </div>

      <div className="request-list">
        {requests.map((request) => (
          <article className="request-card" key={request.id}>
            <div className="request-icon"><FileText size={19} /></div>
            <div className="request-copy">
              <strong>{request.title}</strong>
              <span>{request.id} · {request.date}</span>
            </div>
            <span className={`status ${request.type}`}>
              {request.type === "done" ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
              {request.status}
            </span>
          </article>
        ))}
      </div>
    </main>
  );
}
