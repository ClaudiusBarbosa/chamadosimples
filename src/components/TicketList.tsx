/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  SupportLevel,
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from '../types/ticket';
import { StatusBadge } from './StatusBadge';
import { SupportLevelBadge } from './SupportLevelBadge';
import { PriorityBadge } from './PriorityBadge';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  PlusCircle,
  Inbox,
  Eye,
  ChevronRight,
  FilterX,
} from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onOpenNewTicketTab: () => void;
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

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  onSelectTicket,
  onOpenNewTicketTab,
}) => {
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [levelFilter, setLevelFilter] = useState<string>('TODOS');
  const [priorityFilter, setPriorityFilter] = useState<string>('TODOS');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODOS');

  // Chamados filtrados
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Busca textual
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesId = t.id.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        const matchesReq = t.requesterName?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesId && !matchesDesc && !matchesReq) {
          return false;
        }
      }

      // Filtro de status
      if (statusFilter !== 'TODOS' && t.status !== statusFilter) {
        return false;
      }

      // Filtro de nível
      if (levelFilter !== 'TODOS' && t.supportLevel !== levelFilter) {
        return false;
      }

      // Filtro de prioridade
      if (priorityFilter !== 'TODOS' && t.priority !== priorityFilter) {
        return false;
      }

      // Filtro de categoria
      if (categoryFilter !== 'TODOS' && t.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [tickets, searchTerm, statusFilter, levelFilter, priorityFilter, categoryFilter]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    statusFilter !== 'TODOS' ||
    levelFilter !== 'TODOS' ||
    priorityFilter !== 'TODOS' ||
    categoryFilter !== 'TODOS';

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('TODOS');
    setLevelFilter('TODOS');
    setPriorityFilter('TODOS');
    setCategoryFilter('TODOS');
  };

  // Se a lista de chamados total estiver vazia
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
          <Inbox className="w-7 h-7" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Nenhum chamado registrado
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          A lista de chamados de suporte está vazia no momento. Abra sua primeira solicitação para acompanhar o atendimento.
        </p>
        <button
          type="button"
          onClick={onOpenNewTicketTab}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Abrir Primeiro Chamado</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Busca */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        {/* Barra superior com Busca e Status rápidos */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <label htmlFor="search-tickets-input" className="sr-only">
              Pesquisar chamados
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="search-tickets-input"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por protocolo (ex: TK-2026), título, solicitante ou descrição..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
            />
          </div>

          {/* Botão limpar filtros se ativo */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 shrink-0"
              title="Limpar todos os filtros aplicados"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        {/* Linha de Dropdowns de Filtro */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Status */}
          <div>
            <label
              htmlFor="filter-status-select"
              className="block font-medium text-slate-600 mb-1"
            >
              Estado / Status:
            </label>
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
            >
              <option value="TODOS">Todos os estados</option>
              {TICKET_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Nível de Atendimento */}
          <div>
            <label
              htmlFor="filter-level-select"
              className="block font-medium text-slate-600 mb-1"
            >
              Nível de Suporte:
            </label>
            <select
              id="filter-level-select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
            >
              <option value="TODOS">Todos os níveis (N1, N2, N3)</option>
              <option value="N1">N1 - Primeiro Nível</option>
              <option value="N2">N2 - Segundo Nível (Dev)</option>
              <option value="N3">N3 - Terceiro Nível (Segurança/Infra)</option>
            </select>
          </div>

          {/* Prioridade */}
          <div>
            <label
              htmlFor="filter-priority-select"
              className="block font-medium text-slate-600 mb-1"
            >
              Prioridade:
            </label>
            <select
              id="filter-priority-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
            >
              <option value="TODOS">Todas as prioridades</option>
              {TICKET_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label
              htmlFor="filter-category-select"
              className="block font-medium text-slate-600 mb-1"
            >
              Categoria:
            </label>
            <select
              id="filter-category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
            >
              <option value="TODOS">Todas as categorias</option>
              {TICKET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Barra de Contagem */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Exibindo <strong className="font-semibold text-slate-800">{filteredTickets.length}</strong> de{' '}
          <strong className="font-semibold text-slate-800">{tickets.length}</strong> chamados
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 font-medium">Filtro aplicado</span>
        )}
      </div>

      {/* Lista de Chamados / Tabela */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <FilterX className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Nenhum chamado encontrado
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-4">
            Não encontramos chamados que correspondam aos filtros selecionados.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Limpar Filtros de Pesquisa
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">
                    Protocolo
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Título e Descrição
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Categoria
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Nível
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Prioridade
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Estado Atual
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Abertura
                  </th>
                  <th scope="col" className="py-3 px-3 text-right">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => onSelectTicket(ticket)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectTicket(ticket);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Ver detalhes do chamado ${ticket.id}: ${ticket.title}`}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors focus-visible:bg-blue-50/60 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                  >
                    {/* Protocolo */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                      {ticket.id}
                    </td>

                    {/* Título & Detalhes */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <p className="font-semibold text-slate-900 truncate">
                        {ticket.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {ticket.description}
                      </p>
                      {ticket.requesterName && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Solicitante: {ticket.requesterName}
                        </p>
                      )}
                    </td>

                    {/* Categoria */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-slate-800 font-medium">
                        {ticket.category}
                      </span>
                    </td>

                    {/* Nível de Suporte */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <SupportLevelBadge level={ticket.supportLevel} />
                    </td>

                    {/* Prioridade */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <PriorityBadge priority={ticket.priority} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <StatusBadge status={ticket.status} size="sm" />
                    </td>

                    {/* Data */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap tabular-nums">
                      {formatDatetime(ticket.createdAt)}
                    </td>

                    {/* Ação */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(ticket);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
                        title="Abrir detalhes e fluxo do chamado"
                        aria-label={`Abrir detalhes do chamado ${ticket.id}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
