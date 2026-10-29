/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Ticket } from './types/ticket';
import { ticketService } from './services/ticketService';
import { Header, ActiveTab } from './components/Header';
import { TicketList } from './components/TicketList';
import { CreateTicketForm } from './components/CreateTicketForm';
import { TicketDetailModal } from './components/TicketDetailModal';
import { RulesGuideView } from './components/RulesGuideView';
import {
  NotificationBanner,
  NotificationState,
} from './components/NotificationBanner';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('consultar');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [isStorageFailure, setIsStorageFailure] = useState(false);

  // Carrega os chamados do serviço
  const loadTickets = useCallback(() => {
    const result = ticketService.getTickets();
    if (!result.success || !result.data) {
      setIsStorageFailure(true);
      setNotification({
        id: `notif-${Date.now()}`,
        type: 'erro',
        title: 'Falha no Armazenamento Local',
        message:
          result.error ||
          'Não foi possível ler os dados do navegador. O suporte a localStorage pode estar desativado ou o limite foi atingido.',
      });
      return;
    }

    setIsStorageFailure(false);
    setTickets(result.data);
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Notificação com auto-dismiss para sucessos
  const showNotification = (
    type: 'sucesso' | 'erro' | 'aviso' | 'info',
    message: string,
    title?: string
  ) => {
    const id = `notif-${Date.now()}`;
    setNotification({ id, type, title, message });

    if (type === 'sucesso' || type === 'info') {
      setTimeout(() => {
        setNotification((current) => (current?.id === id ? null : current));
      }, 5000);
    }
  };

  const handleTicketCreated = (newTicket: Ticket) => {
    loadTickets();
    setActiveTab('consultar');
    setSelectedTicket(newTicket);
    showNotification(
      'sucesso',
      `O chamado protocolo ${newTicket.id} foi registrado com sucesso com nível de atendimento ${newTicket.supportLevel}.`,
      'Chamado Aberto com Sucesso'
    );
  };

  const handleTicketUpdated = (updatedTicket: Ticket) => {
    loadTickets();
    setSelectedTicket(updatedTicket);
    showNotification(
      'sucesso',
      `O status do chamado ${updatedTicket.id} foi alterado para "${updatedTicket.status}".`,
      'Atualização Realizada'
    );
  };

  const handleResetData = () => {
    const res = ticketService.resetToSampleData();
    if (!res.success || !res.data) {
      showNotification(
        'erro',
        res.error || 'Não foi possível restaurar os dados de exemplo.',
        'Falha no Armazenamento'
      );
      return;
    }

    setTickets(res.data);
    setSelectedTicket(null);
    showNotification(
      'info',
      'Os chamados de demonstração foram restaurados para o estado original.',
      'Dados de Exemplo Restaurados'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Link de acessibilidade para pular diretamente ao conteúdo */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-md"
      >
        Pular para o conteúdo principal
      </a>

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        ticketCount={tickets.length}
        onResetData={handleResetData}
      />

      {/* Container Principal */}
      <main id="conteudo-principal" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner de Notificação e Erro */}
        <NotificationBanner
          notification={notification}
          onDismiss={() => setNotification(null)}
        />

        {/* Alerta crítico se houver falha no armazenamento local */}
        {isStorageFailure && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 flex items-start justify-between gap-3 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm">
                  Alerta de Falha no Armazenamento Local
                </strong>
                <p className="text-xs sm:text-sm text-rose-800 mt-0.5">
                  Não foi possível salvar ou ler do armazenamento local do navegador. Verifique se o navegador está em modo anônimo restritivo ou se a cota foi atingida.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadTickets}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-600 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tentar Novamente</span>
            </button>
          </div>
        )}

        {/* Visualização de acordo com a aba ativa */}
        {activeTab === 'consultar' && (
          <section aria-labelledby="consultar-chamados-heading">
            <h1 id="consultar-chamados-heading" className="sr-only">
              Consultar e Acompanhar Chamados de TI
            </h1>
            <TicketList
              tickets={tickets}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
              onOpenNewTicketTab={() => setActiveTab('abrir')}
            />
          </section>
        )}

        {activeTab === 'abrir' && (
          <section aria-labelledby="abrir-chamado-heading">
            <h1 id="abrir-chamado-heading" className="sr-only">
              Abrir Novo Chamado de TI
            </h1>
            <CreateTicketForm
              onTicketCreated={handleTicketCreated}
              onError={(errMsg) =>
                showNotification('erro', errMsg, 'Não foi possível criar o chamado')
              }
            />
          </section>
        )}

        {activeTab === 'guia' && (
          <section aria-labelledby="guia-regras-heading">
            <h1 id="guia-regras-heading" className="sr-only">
              Guia de Regras e Transições do Service Desk
            </h1>
            <RulesGuideView />
          </section>
        )}
      </main>

      {/* Modal de Detalhes e Transições do Chamado Selecionado */}
      {selectedTicket && (
        <TicketDetailModal
          isOpen={!!selectedTicket}
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onTicketUpdated={handleTicketUpdated}
          onError={(errMsg) =>
            showNotification(
              'erro',
              errMsg,
              'Operação de transição não permitida'
            )
          }
        />
      )}

      {/* Footer simples e limpo em pt-BR */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            SimpleTickets — Sistema de Abertura e Acompanhamento de Chamados de TI
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>N1: Primeiro Nível</span>
            <span>·</span>
            <span>N2: Desenvolvimento</span>
            <span>·</span>
            <span>N3: Infra & Segurança</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
