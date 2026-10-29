/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Ticket } from '../types/ticket';
import { AlertTriangle, X } from 'lucide-react';

interface CancelConfirmationModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const CancelConfirmationModal: React.FC<CancelConfirmationModalProps> = ({
  isOpen,
  ticket,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason.trim() || 'Cancelado pelo solicitante / suporte');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      aria-describedby="cancel-modal-desc"
    >
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-rose-50/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-rose-100 text-rose-700">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="cancel-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                Confirmar Cancelamento do Chamado
              </h2>
              <p className="text-xs font-mono text-slate-500 tabular-nums">
                Protocolo: {ticket.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Fechar janela de cancelamento"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p id="cancel-modal-desc" className="text-sm text-slate-700">
            Você está prestes a cancelar o chamado{' '}
            <strong className="text-slate-900">"{ticket.title}"</strong>.
            Esta é uma ação com transição para estado final. Deseja realmente prosseguir?
          </p>

          <div>
            <label
              htmlFor="cancel-reason-input"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Motivo do cancelamento (opcional):
            </label>
            <textarea
              id="cancel-reason-input"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: O problema foi solucionado pelo próprio usuário ou aberto em duplicidade..."
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Voltar / Manter Chamado
            </button>
            <button
              ref={cancelButtonRef}
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-600"
            >
              Sim, Cancelar Chamado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
