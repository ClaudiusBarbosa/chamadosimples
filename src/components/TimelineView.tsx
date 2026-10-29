/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TimelineEvent } from '../types/ticket';
import { StatusBadge } from './StatusBadge';
import { ArrowRight, CheckCircle2, AlertTriangle, FileText, XCircle } from 'lucide-react';

interface TimelineViewProps {
  events: TimelineEvent[];
}

function formatDatetime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-3 italic">
        Nenhum registro de alteração disponível para este chamado.
      </p>
    );
  }

  // Ordena cronologicamente: o mais recente no topo
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="flow-root">
      <ul className="-mb-8" aria-label="Linha do tempo das alterações do chamado">
        {sortedEvents.map((event, idx) => {
          const isLast = idx === sortedEvents.length - 1;

          let iconBg = 'bg-blue-100 text-blue-700';
          let IconComponent = FileText;

          if (event.type === 'CRIACAO') {
            iconBg = 'bg-sky-100 text-sky-700';
            IconComponent = FileText;
          } else if (event.type === 'CANCELAMENTO') {
            iconBg = 'bg-rose-100 text-rose-700';
            IconComponent = XCircle;
          } else if (event.newStatus === 'Resolvido' || event.newStatus === 'Concluído') {
            iconBg = 'bg-emerald-100 text-emerald-700';
            IconComponent = CheckCircle2;
          } else if (event.newStatus === 'Aguardando usuário') {
            iconBg = 'bg-purple-100 text-purple-700';
            IconComponent = AlertTriangle;
          }

          return (
            <li key={event.id || idx}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  {/* Ícone */}
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${iconBg}`}
                  >
                    <IconComponent className="h-4 w-4" aria-hidden="true" />
                  </div>

                  {/* Conteúdo */}
                  <div className="min-w-0 flex-1 pt-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900">
                        {event.author}
                      </p>
                      <time
                        dateTime={event.timestamp}
                        className="text-xs font-mono text-slate-500 tabular-nums"
                      >
                        {formatDatetime(event.timestamp)}
                      </time>
                    </div>

                    {/* Mudança de status se houver */}
                    {event.previousStatus && event.newStatus && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-500">Transição:</span>
                        <StatusBadge status={event.previousStatus} size="sm" />
                        <ArrowRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
                        <StatusBadge status={event.newStatus} size="sm" />
                      </div>
                    )}

                    {/* Status inicial de criação */}
                    {!event.previousStatus && event.newStatus && event.type === 'CRIACAO' && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-slate-500">Estado inicial:</span>
                        <StatusBadge status={event.newStatus} size="sm" />
                      </div>
                    )}

                    {/* Nota/Observação */}
                    {event.note && (
                      <p className="mt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
