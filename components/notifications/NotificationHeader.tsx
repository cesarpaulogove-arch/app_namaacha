
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

type Props = {
  naoLidas: number;
};

export function NotificationHeader({ naoLidas }: Props) {
  return (
    <header className="flex items-center gap-3">
      <Link
        href="/inicio"
        aria-label="Voltar ao início"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-emerald-700">
          Município da Namaacha
        </p>
        <h1 className="text-xl font-bold text-slate-900">
          Notificações
        </h1>
      </div>

      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
        <Bell size={22} />

        {naoLidas > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {naoLidas > 99 ? "99+" : naoLidas}
          </span>
        )}
      </div>
    </header>
  );
}
