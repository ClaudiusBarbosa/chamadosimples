/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TicketCategory =
  | 'Hardware'
  | 'Software'
  | 'Acesso'
  | 'Rede'
  | 'E-mail'
  | 'Outro';

export const TICKET_CATEGORIES: TicketCategory[] = [
  'Hardware',
  'Software',
  'Acesso',
  'Rede',
  'E-mail',
  'Outro',
];

export type TicketPriority = 'Baixa' | 'Normal' | 'Alta' | 'Crítica';

export const TICKET_PRIORITIES: TicketPriority[] = [
  'Baixa',
  'Normal',
  'Alta',
  'Crítica',
];

export type SupportLevel = 'N1' | 'N2' | 'N3';

export interface SupportLevelInfo {
  level: SupportLevel;
  name: string;
  description: string;
  badgeColor: string;
}

export const SUPPORT_LEVELS_INFO: Record<SupportLevel, SupportLevelInfo> = {
  N1: {
    level: 'N1',
    name: 'N1 - Primeiro Nível',
    description: 'Suporte técnico de primeiro nível (Hardware, Acesso, Rede, E-mail e Outro).',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  N2: {
    level: 'N2',
    name: 'N2 - Segundo Nível',
    description: 'Desenvolvimento e suporte de segundo nível (Software).',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  N3: {
    level: 'N3',
    name: 'N3 - Terceiro Nível',
    description: 'Segurança e infraestrutura, suporte de terceiro nível.',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
  },
};

export type TicketStatus =
  | 'Recebido'
  | 'Em análise'
  | 'Aguardando usuário'
  | 'Resolvido'
  | 'Concluído'
  | 'Cancelado';

export const TICKET_STATUSES: TicketStatus[] = [
  'Recebido',
  'Em análise',
  'Aguardando usuário',
  'Resolvido',
  'Concluído',
  'Cancelado',
];

export interface TimelineEvent {
  id: string;
  timestamp: string; // ISO 8601
  type: 'CRIACAO' | 'MUDANCA_ESTADO' | 'CANCELAMENTO' | 'NOTA';
  previousStatus?: TicketStatus;
  newStatus?: TicketStatus;
  author: string;
  note?: string;
}

export interface Ticket {
  id: string; // Ex: TK-2026-0001
  title: string;
  description: string;
  category: TicketCategory;
  isSecurityOrInfra: boolean;
  priority: TicketPriority;
  supportLevel: SupportLevel;
  supportLevelReason: string;
  status: TicketStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  requesterName?: string;
  requesterEmail?: string;
  requesterDepartment?: string;
  timeline: TimelineEvent[];
}

export interface CreateTicketDTO {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  isSecurityOrInfra: boolean;
  requesterName?: string;
  requesterEmail?: string;
  requesterDepartment?: string;
}

/**
 * Regras estritas de transição:
 * - Recebido → Em análise ou Cancelado.
 * - Em análise → Aguardando usuário, Resolvido ou Cancelado.
 * - Aguardando usuário → Em análise, Resolvido ou Cancelado.
 * - Resolvido → Concluído, Em análise ou Cancelado.
 * - Concluído e Cancelado são estados finais.
 */
export const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  'Recebido': ['Em análise', 'Cancelado'],
  'Em análise': ['Aguardando usuário', 'Resolvido', 'Cancelado'],
  'Aguardando usuário': ['Em análise', 'Resolvido', 'Cancelado'],
  'Resolvido': ['Concluído', 'Em análise', 'Cancelado'],
  'Concluído': [],
  'Cancelado': [],
};

export const FINAL_STATUSES: TicketStatus[] = ['Concluído', 'Cancelado'];
