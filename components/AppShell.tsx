import Link from "next/link";
import { Bell, Home, LayoutGrid, UserRound } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="desktop-brand">
        <div className="brand-mark">NM</div>
        <div><span>Município de</span><strong>Namaacha</strong></div>
      </div>

      <div className="app-content">{children}</div>

      <nav className="bottom-nav" aria-label="Navegação principal">
        <Link href="/"><Home size={19}/><span>Início</span></Link>
        <Link href="/servicos"><LayoutGrid size={19}/><span>Serviços</span></Link>
        <Link href="/notificacoes"><Bell size={19}/><span>Notificações</span></Link>
        <Link href="/perfil"><UserRound size={19}/><span>Perfil</span></Link>
      </nav>
    </div>
  );
}
