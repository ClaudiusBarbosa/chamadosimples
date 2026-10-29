/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FINAL_STATUSES,
  Ticket,
  TicketStatus,
} from '../types/ticket';
import {
  getAllowedTransitions,
  ticketService,
} from '../services/ticketService';
import { StatusBadge } from './StatusBadge';
import { SupportLevelBadge } from './SupportLevelBadge';
import { PriorityBadge } from './PriorityBadge';
import { TimelineView } from './TimelineView';
import { CancelConfirmationModal } from './CancelConfirmationModal';
import {
  X,
  Calendar,
  User,
  Tag,
  ArrowRightCircle,
  XCircle,
  MessageSquarePlus,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface TicketDetailModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onTicketUpdated: (updatedTicket: Ticket) => void;
  onError: (errorMessage: string) => void;
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

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  isOpen,
  ticket,
  onClose,
  onTicketUpdated,
  onError,
}) => {
  const [transitionNote, setTransitionNote] = useState('');
  const [timelineNote, setTimelineNote] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isCancelModalOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCancelModalOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const isFinalState = FINAL_STATUSES.includes(ticket.status);
  const allowedTransitions = getAllowedTransitions(ticket.status);
  // Transições operacionais que não são Cancelamento
  const operationalTransitions = allowedTransitions.filter(
    (st) => st !== 'Cancelado'
  );

  const handleExecuteTransition = (newStatus: TicketStatus) => {
    setIsProcessing(true);
    try {
      const res = ticketService.updateStatus(
        ticket.id,
        newStatus,
        transitionNote.trim() || undefined,
        'Analista de Suporte'
      );

      if (!res.success || !res.data) {
        onError(res.error || 'Erro ao atualizar o estado do chamado.');
        setIsProcessing(false);
        return;
      }

      setTransitionNote('');
      setIsProcessing(false);
      onTicketUpdated(res.data);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Falha ao atualizar.';
      onError(`Erro de execução: ${msg}`);
    }
  };

  const handleConfirmCancel = (reason: string) => {
    setIsProcessing(true);
    try {
      const res = ticketService.cancelTicket(
        ticket.id,
        reason,
        'Usuário Solicitante'
      );

      if (!res.success || !res.data) {
        onError(res.error || 'Erro ao cancelar o chamado.');
        setIsProcessing(false);
        return;
      }

      setIsCancelModalOpen(false);
      setIsProcessing(false);
      onTicketUpdated(res.data);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Falha ao cancelar.';
      onError(`Erro de execução: ${msg}`);
    }
  };

  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineNote.trim()) return;

    setIsProcessing(true);
    try {
      const res = ticketService.addTimelineNote(
        ticket.id,
        timelineNote.trim(),
        'Analista de Suporte'
      );

      if (!res.success || !res.data) {
        onError(res.error || 'Erro ao salvar a observação.');
        setIsProcessing(false);
        return;
      }

      setTimelineNote('');
      setIsProcessing(false);
      onTicketUpdated(res.data);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Falha ao adicionar nota.';
      onError(`Erro: ${msg}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-detail-title"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 tabular-nums">
                {ticket.id}
              </span>
              <StatusBadge status={ticket.status} size="md" />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h2
              id="ticket-detail-title"
              className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
            >
              {ticket.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 shrink-0"
            aria-label="Fechar detalhes do chamado"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Categoria
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {ticket.category}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Abertura
              </span>
              <p className="text-xs sm:text-sm font-mono text-slate-800 tabular-nums">
                {formatDatetime(ticket.createdAt)}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Solicitante
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate" title={ticket.requesterName || 'Usuário Solicitante'}>
                {ticket.requesterName || 'Usuário Solicitante'}
              </p>
              {ticket.requesterDepartment && (
                <span className="text-[11px] text-slate-500 block">
                  {ticket.requesterDepartment}
                </span>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Nível de Atendimento
              </span>
              <div className="mt-0.5">
                <SupportLevelBadge level={ticket.supportLevel} />
              </div>
            </div>
          </div>

          {/* Nível de Atendimento Info Box */}
          <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">
                Encaminhamento: {ticket.supportLevel} -{' '}
                {ticket.supportLevel === 'N1' && 'Suporte Técnico de Primeiro Nível'}
                {ticket.supportLevel === 'N2' && 'Desenvolvimento e Suporte de Segundo Nível'}
                {ticket.supportLevel === 'N3' && 'Segurança e Infraestrutura (Terceiro Nível)'}
              </span>
              <p className="text-slate-600">{ticket.supportLevelReason}</p>
            </div>
          </div>

          {/* Descrição do Chamado */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Descrição do Problema
            </h3>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Painel de Transições Manuais (Demonstração do Fluxo) */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ArrowRightCircle className="w-4 h-4 text-blue-600" />
                  Mudar Estado do Chamado (Demonstração de Fluxo)
                </h3>
                <p className="text-xs text-slate-500">
                  Transições permitidas pelas regras de suporte para o estado atual: <strong>{ticket.status}</strong>.
                </p>
              </div>

              {isFinalState ? (
                <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2.5 py-1 rounded">
                  Estado Final Atingido
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  {allowedTransitions.length} transição(ões) permitida(s)
                </span>
              )}
            </div>

            {/* Se for estado final */}
            {isFinalState ? (
              <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                <span>
                  Este chamado encontra-se em <strong>{ticket.status}</strong>, um estado final definitivo. Não são permitidas novas alterações de estado.
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Campo de observação ao mudar de estado */}
                <div>
                  <label
                    htmlFor="transition-note-input"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Nota ou motivo da transição (opcional):
                  </label>
                  <input
                    id="transition-note-input"
                    type="text"
                    value={transitionNote}
                    onChange={(e) => setTransitionNote(e.target.value)}
                    placeholder="Ex: 'Testes realizados com sucesso', 'Aguardando retorno do solicitante sobre o token'..."
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                </div>

                {/* Botões de Ação para as transições permitidas */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {operationalTransitions.map((targetStatus) => {
                    let btnColor =
                      'bg-blue-600 hover:bg-blue-700 text-white';
                    if (targetStatus === 'Resolvido') {
                      btnColor =
                        'bg-emerald-600 hover:bg-emerald-700 text-white';
                    } else if (targetStatus === 'Concluído') {
                      btnColor =
                        'bg-slate-800 hover:bg-slate-900 text-white';
                    } else if (targetStatus === 'Aguardando usuário') {
                      btnColor =
                        'bg-purple-600 hover:bg-purple-700 text-white';
                    } else if (targetStatus === 'Em análise') {
                      btnColor =
                        'bg-amber-600 hover:bg-amber-700 text-white';
                    }

                    return (
                      <button
                        key={targetStatus}
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleExecuteTransition(targetStatus)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 ${btnColor}`}
                      >
                        <span>Mudar para: {targetStatus}</span>
                      </button>
                    );
                  })}

                  {/* Botão de Cancelamento dedicado (sempre com confirmação prévia) */}
                  {allowedTransitions.includes('Cancelado') && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setIsCancelModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors focus-visible:ring-2 focus-visible:ring-rose-600 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancelar Chamado...</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Adicionar Nota Rápida na Linha do Tempo */}
          {!isFinalState && (
            <form onSubmit={handleAddCustomNote} className="space-y-2">
              <label
                htmlFor="timeline-note-input"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Adicionar Nota na Linha do Tempo
              </label>
              <div className="flex gap-2">
                <input
                  id="timeline-note-input"
                  type="text"
                  value={timelineNote}
                  onChange={(e) => setTimelineNote(e.target.value)}
                  placeholder="Registre uma observação técnica ou atualização de andamento..."
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !timelineNote.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              </div>
            </form>
          )}

          {/* Linha do Tempo com Histórico Completo */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-blue-600" />
              Linha do Tempo e Histórico do Chamado
            </h3>
            <TimelineView events={ticket.timeline} />
          </div>
        </div>

        {/* Modal de Confirmação de Cancelamento com Motivo */}
        <CancelConfirmationModal
          isOpen={isCancelModalOpen}
          ticket={ticket}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      </div>
    </div>
  );
};
