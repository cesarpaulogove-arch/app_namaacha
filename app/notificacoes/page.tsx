import Link from "next/link";
import { ArrowLeft, Bell, Megaphone, Info, AlertTriangle } from "lucide-react";

export default function NotificacoesPage() {
  return (
    <main className="page">
      <Link href="/" className="back-link"><ArrowLeft size={17} /> Início</Link>
      <div className="page-header">
        <span className="section-kicker">Atualizações</span>
        <h1>Notificações</h1>
        <p>Informações importantes do Município.</p>
      </div>

      <div className="notification-list">
        <article className="notification unread"><div className="notification-icon"><Megaphone size={18}/></div><div><strong>Campanha de limpeza</strong><p>Consulte o calendário de recolha no seu bairro.</p><small>Hoje</small></div></article>
        <article className="notification"><div className="notification-icon"><Info size={18}/></div><div><strong>Atendimento ao munícipe</strong><p>Novos horários disponíveis para atendimento.</p><small>Ontem</small></div></article>
        <article className="notification"><div className="notification-icon"><AlertTriangle size={18}/></div><div><strong>Aviso municipal</strong><p>Consulte as informações e orientações publicadas.</p><small>02 Out 2026</small></div></article>
      </div>
    </main>
  );
}
