/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TicketPriority } from '../types/ticket';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const priorityConfig: Record<
  TicketPriority,
  { label: string; bg: string; text: string; border: string }
> = {
  Baixa: {
    label: 'Baixa',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  Normal: {
    label: 'Normal',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  Alta: {
    label: 'Alta',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  Crítica: {
    label: 'Crítica',
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.Normal;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      aria-label={`Prioridade: ${config.label}`}
    >
      {config.label}
    </span>
  );
};
