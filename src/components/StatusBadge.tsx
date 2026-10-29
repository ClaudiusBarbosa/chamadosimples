/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TicketStatus } from '../types/ticket';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<
  TicketStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Recebido: {
    label: 'Recebido',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
    dot: 'bg-sky-600',
  },
  'Em análise': {
    label: 'Em análise',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-600',
  },
  'Aguardando usuário': {
    label: 'Aguardando usuário',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    dot: 'bg-purple-600',
  },
  Resolvido: {
    label: 'Resolvido',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600',
  },
  Concluído: {
    label: 'Concluído',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
  },
  Cancelado: {
    label: 'Cancelado',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    dot: 'bg-rose-600',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const config = statusConfig[status] || statusConfig.Recebido;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
      role="status"
      aria-label={`Status do chamado: ${config.label}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </span>
  );
};
