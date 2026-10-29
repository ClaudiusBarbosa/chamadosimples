/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { CreateTicketDTO } from '../types/ticket';
import { suggestSupportLevel } from '../services/ticketService';
import { SupportLevelBadge } from './SupportLevelBadge';
import { PriorityBadge } from './PriorityBadge';
import { CheckCircle2, X, AlertCircle, Edit3 } from 'lucide-react';

interface ReviewTicketModalProps {
  isOpen: boolean;
  formData: CreateTicketDTO;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const ReviewTicketModal: React.FC<ReviewTicketModalProps> = ({
  isOpen,
  formData,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const levelInfo = suggestSupportLevel(
    formData.category,
    formData.isSecurityOrInfra,
    formData.title,
    formData.description
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div>
            <span className="text-xs font-semibold text-blue-600 tracking-wide">
              Etapa de Confirmação
            </span>
            <h2
              id="review-modal-title"
              className="text-lg font-bold text-slate-900 mt-0.5"
            >
              Revisar Dados do Chamado
            </h2>
            <p className="text-xs text-slate-500">
              Verifique os dados com atenção antes de registrar o chamado no sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50"
            aria-label="Voltar para o formulário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Resumo */}
        <div className="p-6 space-y-5 text-sm">
          {/* Título */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="block text-xs font-medium text-slate-500 mb-1">
              Título do chamado:
            </span>
            <p className="text-base font-semibold text-slate-900">
              {formData.title || '(Não informado)'}
            </p>
          </div>

          {/* Grid de atributos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="block text-xs font-medium text-slate-500 mb-1.5">
                Categoria:
              </span>
              <span className="inline-flex text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                {formData.category}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="block text-xs font-medium text-slate-500 mb-1.5">
                Prioridade:
              </span>
              <PriorityBadge priority={formData.priority} />
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="block text-xs font-medium text-slate-500 mb-1.5">
                Nível sugerido:
              </span>
              <SupportLevelBadge level={levelInfo.level} />
            </div>
          </div>

          {/* Justificativa do nível de atendimento */}
          <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Regra de Direcionamento ({levelInfo.level}):</strong>{' '}
              {levelInfo.reason}
            </div>
          </div>

          {formData.isSecurityOrInfra && (
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span>Marcado como ocorrência de Segurança ou Infraestrutura Crítica.</span>
            </div>
          )}

          {/* Solicitante */}
          {(formData.requesterName || formData.requesterEmail || formData.requesterDepartment) && (
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <span className="block text-xs font-medium text-slate-500 mb-1">
                Dados do Solicitante:
              </span>
              <p className="text-xs text-slate-800">
                {formData.requesterName || 'Não informado'}
                {formData.requesterEmail && ` · ${formData.requesterEmail}`}
                {formData.requesterDepartment && ` · Setor: ${formData.requesterDepartment}`}
              </p>
            </div>
          )}

          {/* Descrição */}
          <div>
            <span className="block text-xs font-medium text-slate-500 mb-1">
              Descrição detalhada:
            </span>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {formData.description || '(Não informada)'}
            </div>
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50"
          >
            <Edit3 className="w-4 h-4" />
            Voltar e Corrigir
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Salvando Chamado...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirmar e Abrir Chamado
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
