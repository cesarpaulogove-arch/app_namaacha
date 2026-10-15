
"use client";

import Link from "next/link";
import {
  UserRound,
  Bell,
  ShieldCheck,
  FileText,
  CreditCard,
  CircleHelp,
  ChevronRight,
} from "lucide-react";

const opcoes = [
  {
    titulo: "Dados pessoais",
    descricao: "Consulte e atualize as suas informações.",
    href: "#dados-pessoais",
    Icon: UserRound,
    cor: "bg-blue-50 text-blue-700",
  },
  {
    titulo: "Segurança da conta",
    descricao: "Consulte as opções de proteção da conta.",
    href: "#seguranca",
    Icon: ShieldCheck,
    cor: "bg-emerald-50 text-emerald-700",
  },
  {
    titulo: "Notificações",
    descricao: "Acompanhe avisos e atualizações municipais.",
    href: "/notificacoes",
    Icon: Bell,
    cor: "bg-amber-50 text-amber-700",
  },
  {
    titulo: "Os meus processos",
    descricao: "Consulte os seus pedidos e processos.",
    href: "/processos",
    Icon: FileText,
    cor: "bg-violet-50 text-violet-700",
  },
  {
    titulo: "Pagamentos",
    descricao: "Consulte pagamentos e obrigações municipais.",
    href: "/pagamentos",
    Icon: CreditCard,
    cor: "bg-teal-50 text-teal-700",
  },
  {
    titulo: "Ajuda e suporte",
    descricao: "Obtenha orientação sobre os serviços digitais.",
    href: "/reclamacoes",
    Icon: CircleHelp,
    cor: "bg-slate-100 text-slate-700",
  },
];

export function ProfileMenu() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Gestão da conta
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Aceda às principais opções do seu perfil.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {opcoes.map((opcao, index) => {
          const Icon = opcao.Icon;

          return (
            <Link
              key={opcao.titulo}
              href={opcao.href}
              className={`flex min-h-[84px] items-center gap-3 px-4 py-4 transition hover:bg-slate-50 sm:gap-4 sm:px-5 ${
                index !== opcoes.length - 1
                  ? "border-b border-slate-100"
                  : ""
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${opcao.cor}`}
              >
                <Icon size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  {opcao.titulo}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  {opcao.descricao}
                </p>
              </div>

              <ChevronRight
                size={19}
                className="shrink-0 text-slate-400"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
