import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, ReceiptText, WalletCards } from "lucide-react";

export default function PagamentosPage() {
  return (
    <main className="page">
      <Link href="/" className="back-link"><ArrowLeft size={17} /> Início</Link>
      <div className="page-header">
        <span className="section-kicker">Finanças municipais</span>
        <h1>Pagamentos</h1>
        <p>Consulte valores, efetue pagamentos e obtenha comprovativos.</p>
      </div>

      <div className="balance-card">
        <span>Total em aberto</span>
        <strong>12.450,00 MT</strong>
        <small>Valores demonstrativos</small>
      </div>

      <div className="payment-actions">
        <div className="action-card"><div className="action-icon primary"><WalletCards size={20}/></div><div><strong>Consultar débitos</strong><span>Veja valores em aberto e histórico.</span></div></div>
        <div className="action-card"><div className="action-icon"><CreditCard size={20}/></div><div><strong>Efetuar pagamento</strong><span>Pague com o método disponível.</span></div></div>
        <div className="action-card"><div className="action-icon"><ReceiptText size={20}/></div><div><strong>Comprovativos</strong><span>Consulte pagamentos realizados.</span></div></div>
      </div>

      <div className="info-box">
        <CheckCircle2 size={19}/>
        <div><strong>Pagamento seguro</strong><p>Na versão de produção, esta área deverá ser integrada ao gateway de pagamento definido pelo Município.</p></div>
      </div>
    </main>
  );
}
