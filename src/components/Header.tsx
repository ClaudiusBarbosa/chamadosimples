/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TicketCheck, Plus, ListOrdered, BookOpen, RotateCcw } from 'lucide-react';

export type ActiveTab = 'consultar' | 'abrir' | 'guia';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  ticketCount: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  ticketCount,
  onResetData,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <TicketCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                SimpleTickets
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 font-medium whitespace-nowrap">
                Suporte de TI
              </span>
            </div>
          </div>

          {/* Zone 2: Nav Tabs */}
          <nav
            className="flex items-center gap-1 sm:gap-2"
            aria-label="Navegação principal da aplicação"
          >
            <button
              type="button"
              onClick={() => onTabChange('consultar')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activeTab === 'consultar'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              aria-current={activeTab === 'consultar' ? 'page' : undefined}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Consultar Chamados</span>
              <span className="ml-1 text-[11px] font-mono font-bold bg-white text-slate-700 px-1.5 py-0.2 rounded border border-slate-200 tabular-nums">
                {ticketCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('abrir')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activeTab === 'abrir'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              aria-current={activeTab === 'abrir' ? 'page' : undefined}
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Abrir Chamado</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('guia')}
              className={`hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activeTab === 'guia'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              aria-current={activeTab === 'guia' ? 'page' : undefined}
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Fluxo & Regras</span>
            </button>
          </nav>

          {/* Zone 3: Ação Rápida */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onResetData}
              title="Restaurar chamados de exemplo para teste do fluxo"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="Restaurar dados de demonstração"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {activeTab !== 'abrir' ? (
              <button
                type="button"
                onClick={() => onTabChange('abrir')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Chamado</span>
                <span className="sm:hidden">Novo</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onTabChange('consultar')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <ListOrdered className="w-4 h-4" />
                <span className="hidden sm:inline">Ver Lista</span>
                <span className="sm:hidden">Lista</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
