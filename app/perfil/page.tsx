import Link from "next/link";
import { ArrowLeft, ChevronRight, FileText, HelpCircle, LockKeyhole, UserRound } from "lucide-react";

export default function PerfilPage() {
  return (
    <main className="page">
      <Link href="/" className="back-link"><ArrowLeft size={17} /> Início</Link>
      <div className="profile-head">
        <div className="avatar">M</div>
        <div><span className="section-kicker">Munícipe</span><h1>Meu perfil</h1><p>Gerencie os seus dados e preferências.</p></div>
      </div>

      <div className="profile-list">
        <div className="profile-row"><UserRound size={19}/><div><strong>Dados pessoais</strong><span>Nome, telefone e endereço</span></div><ChevronRight size={18}/></div>
        <div className="profile-row"><FileText size={19}/><div><strong>Meus documentos</strong><span>Documentos submetidos aos processos</span></div><ChevronRight size={18}/></div>
        <div className="profile-row"><LockKeyhole size={19}/><div><strong>Segurança</strong><span>PIN e definições de acesso</span></div><ChevronRight size={18}/></div>
        <div className="profile-row"><HelpCircle size={19}/><div><strong>Ajuda</strong><span>Perguntas frequentes e contactos</span></div><ChevronRight size={18}/></div>
      </div>
    </main>
  );
}
