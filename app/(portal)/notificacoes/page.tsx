
"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCheck, Inbox } from "lucide-react";

import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import {
  NotificationFilters,
  type FiltroNotificacao,
} from "@/components/notifications/NotificationFilters";

import { notificacoesIniciais } from "@/data/notifications";
import type { Notificacao } from "@/types/notification";

const CHAVE_NOTIFICACOES = "namaacha_notificacoes";

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] =
    useState<Notificacao[]>(notificacoesIniciais);

  const [filtro, setFiltro] =
    useState<FiltroNotificacao>("todas");

  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const dadosGuardados = localStorage.getItem(
        CHAVE_NOTIFICACOES
      );

      if (dadosGuardados) {
        const estadosGuardados: Record<string, boolean> =
          JSON.parse(dadosGuardados);

        setNotificacoes(
          notificacoesIniciais.map((notificacao) => ({
            ...notificacao,
            lida:
              typeof estadosGuardados[notificacao.id] === "boolean"
                ? estadosGuardados[notificacao.id]
                : notificacao.lida,
          }))
        );
      }
    } catch {
      // Se os dados locais forem inválidos, mantém os dados iniciais.
    } finally {
      setCarregado(true);
    }
  }, []);

  useEffect(() => {
    if (!carregado) return;

    try {
      const estados = Object.fromEntries(
        notificacoes.map((notificacao) => [
          notificacao.id,
          notificacao.lida,
        ])
      );

      localStorage.setItem(
        CHAVE_NOTIFICACOES,
        JSON.stringify(estados)
      );
    } catch {
      // A interface continua funcional durante a sessão.
    }
  }, [notificacoes, carregado]);

  const totalNaoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida
  ).length;

  const totalLidas = notificacoes.length - totalNaoLidas;

  const notificacoesFiltradas = useMemo(() => {
    switch (filtro) {
      case "nao-lidas":
        return notificacoes.filter(
          (notificacao) => !notificacao.lida
        );

      case "lidas":
        return notificacoes.filter(
          (notificacao) => notificacao.lida
        );

      default:
        return notificacoes;
    }
  }, [notificacoes, filtro]);

  function alternarLeitura(id: string) {
    setNotificacoes((atuais) =>
      atuais.map((notificacao) =>
        notificacao.id === id
          ? { ...notificacao, lida: !notificacao.lida }
          : notificacao
      )
    );
  }

  function marcarTodasComoLidas() {
    setNotificacoes((atuais) =>
      atuais.map((notificacao) => ({
        ...notificacao,
        lida: true,
      }))
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-5 pb-10 sm:py-8">
      <NotificationHeader naoLidas={totalNaoLidas} />

      <section className="rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-700 p-5 text-white shadow-sm sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-100">
              Centro de notificações
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Os seus avisos municipais
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-emerald-50">
              Acompanhe as atualizações dos seus processos,
              pagamentos e serviços municipais num só lugar.
            </p>
          </div>

          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
            <Inbox size={30} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs text-emerald-100">
              Total de notificações
            </p>
            <p className="mt-1 text-2xl font-bold">
              {notificacoes.length}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs text-emerald-100">
              Por consultar
            </p>
            <p className="mt-1 text-2xl font-bold">
              {totalNaoLidas}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Atividade recente
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Consulte os avisos recebidos.
            </p>
          </div>

          {totalNaoLidas > 0 && (
            <button
              type="button"
              onClick={marcarTodasComoLidas}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              <CheckCheck size={18} />
              Marcar todas como lidas
            </button>
          )}
        </div>

        <NotificationFilters
          filtro={filtro}
          onChange={setFiltro}
          totalTodas={notificacoes.length}
          totalNaoLidas={totalNaoLidas}
          totalLidas={totalLidas}
        />

        <div className="space-y-3">
          {notificacoesFiltradas.length > 0 ? (
            notificacoesFiltradas.map((notificacao) => (
              <NotificationCard
                key={notificacao.id}
                notificacao={notificacao}
                onAlternarLeitura={alternarLeitura}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Inbox size={27} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                {filtro === "nao-lidas"
                  ? "Tudo em dia!"
                  : "Nenhuma notificação encontrada"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {filtro === "nao-lidas"
                  ? "Não existem notificações por consultar."
                  : "Não existem notificações nesta categoria."}
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="pt-2 text-center text-xs text-slate-400">
        Município da Namaacha · Serviços Digitais
      </footer>
    </main>
  );
}
