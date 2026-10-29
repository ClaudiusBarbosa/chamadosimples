/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ALLOWED_TRANSITIONS,
  CreateTicketDTO,
  FINAL_STATUSES,
  SupportLevel,
  Ticket,
  TicketCategory,
  TicketStatus,
  TimelineEvent,
} from '../types/ticket';

const STORAGE_KEY = 'simpletickets_data_v1';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Palavras-chave que indicam segurança ou infraestrutura
 */
const SECURITY_INFRA_KEYWORDS = [
  'segurança',
  'seguranca',
  'infraestrutura',
  'firewall',
  'vazamento',
  'invasão',
  'invasao',
  'ataque',
  'malware',
  'ransomware',
  'servidor',
  'datacenter',
  'vpn corporativa',
  'certificado',
  'ssl',
  'ddos',
  'brecha',
  'vulnerabilidade',
  'switch central',
  'roteador de borda',
];

/**
 * Sugere o nível de atendimento de acordo com as regras de negócio:
 * - Hardware, Acesso, Rede, E-mail e Outro: N1
 * - Software: N2
 * - Problemas identificados como segurança ou infraestrutura: N3
 */
export function suggestSupportLevel(
  category: TicketCategory,
  isSecurityOrInfra: boolean,
  title?: string,
  description?: string
): { level: SupportLevel; reason: string; autoDetectedKeyword?: string } {
  // Verificação explícita de segurança ou infraestrutura
  if (isSecurityOrInfra) {
    return {
      level: 'N3',
      reason: 'Identificado como questão de Segurança ou Infraestrutura crítica (Suporte Especializado N3).',
    };
  }

  // Verificação de palavras-chave no título e descrição para auxílio inteligente
  const fullText = `${title || ''} ${description || ''}`.toLowerCase();
  const matchedKeyword = SECURITY_INFRA_KEYWORDS.find((keyword) =>
    fullText.includes(keyword)
  );

  if (matchedKeyword) {
    return {
      level: 'N3',
      reason: `Termo relacionado à infraestrutura/segurança detectado ("${matchedKeyword}"). Sugerido N3.`,
      autoDetectedKeyword: matchedKeyword,
    };
  }

  // Regra por categoria
  if (category === 'Software') {
    return {
      level: 'N2',
      reason: 'Categoria Software: direcionado para desenvolvimento e suporte de segundo nível (N2).',
    };
  }

  return {
    level: 'N1',
    reason: `Categoria ${category}: direcionado para suporte técnico de primeiro nível (N1).`,
  };
}

/**
 * Retorna as transições válidas para o status atual
 */
export function getAllowedTransitions(currentStatus: TicketStatus): TicketStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus] || [];
}

/**
 * Verifica se um chamado pode ser cancelado
 */
export function canCancelTicket(currentStatus: TicketStatus): boolean {
  return !FINAL_STATUSES.includes(currentStatus);
}

/**
 * Cria os dados de demonstração iniciais
 */
function getInitialSampleTickets(): Ticket[] {
  const now = new Date();
  const pastHours = (hours: number) =>
    new Date(now.getTime() - hours * 3600 * 1000).toISOString();

  return [
    {
      id: 'TK-2026-0001',
      title: 'Configuração de acesso à impressora do setor financeiro',
      description:
        'A impressora multifuncional não aparece listada após a atualização do Windows no computador da contabilidade.',
      category: 'Hardware',
      isSecurityOrInfra: false,
      priority: 'Normal',
      supportLevel: 'N1',
      supportLevelReason: 'Categoria Hardware: direcionado para suporte técnico de primeiro nível (N1).',
      status: 'Recebido',
      createdAt: pastHours(2),
      updatedAt: pastHours(2),
      requesterName: 'Mariana Silva',
      requesterEmail: 'mariana.silva@empresa.com.br',
      requesterDepartment: 'Financeiro',
      timeline: [
        {
          id: 'tl-1',
          timestamp: pastHours(2),
          type: 'CRIACAO',
          newStatus: 'Recebido',
          author: 'Mariana Silva (Usuária)',
          note: 'Chamado aberto via portal SimpleTickets.',
        },
      ],
    },
    {
      id: 'TK-2026-0002',
      title: 'Erro de validação de CPF no sistema ERP interno',
      description:
        'Ao tentar cadastrar novos fornecedores com inscrição estadual isenta, o ERP exibe erro 500 no módulo de faturamento.',
      category: 'Software',
      isSecurityOrInfra: false,
      priority: 'Alta',
      supportLevel: 'N2',
      supportLevelReason: 'Categoria Software: direcionado para desenvolvimento e suporte de segundo nível (N2).',
      status: 'Em análise',
      createdAt: pastHours(18),
      updatedAt: pastHours(6),
      requesterName: 'Carlos Eduardo',
      requesterEmail: 'carlos.eduardo@empresa.com.br',
      requesterDepartment: 'Compras',
      timeline: [
        {
          id: 'tl-2-1',
          timestamp: pastHours(18),
          type: 'CRIACAO',
          newStatus: 'Recebido',
          author: 'Carlos Eduardo (Usuário)',
          note: 'Chamado registrado com prioridade alta.',
        },
        {
          id: 'tl-2-2',
          timestamp: pastHours(6),
          type: 'MUDANCA_ESTADO',
          previousStatus: 'Recebido',
          newStatus: 'Em análise',
          author: 'Lucas Mendes (Suporte N2)',
          note: 'Iniciada análise do log do servidor de aplicação ERP.',
        },
      ],
    },
    {
      id: 'TK-2026-0003',
      title: 'Aviso de suspeita de phishing recebido no e-mail corporativo',
      description:
        'Recebi um e-mail com anexo suspeito alegando ser cobrança bancária com link externo não reconhecido.',
      category: 'E-mail',
      isSecurityOrInfra: true,
      priority: 'Crítica',
      supportLevel: 'N3',
      supportLevelReason: 'Identificado como questão de Segurança ou Infraestrutura crítica (Suporte Especializado N3).',
      status: 'Aguardando usuário',
      createdAt: pastHours(28),
      updatedAt: pastHours(8),
      requesterName: 'Fernanda Rocha',
      requesterEmail: 'fernanda.rocha@empresa.com.br',
      requesterDepartment: 'Recursos Humanos',
      timeline: [
        {
          id: 'tl-3-1',
          timestamp: pastHours(28),
          type: 'CRIACAO',
          newStatus: 'Recebido',
          author: 'Fernanda Rocha (Usuária)',
          note: 'Chamado aberto.',
        },
        {
          id: 'tl-3-2',
          timestamp: pastHours(20),
          type: 'MUDANCA_ESTADO',
          previousStatus: 'Recebido',
          newStatus: 'Em análise',
          author: 'Equipe SOC (N3)',
          note: 'Análise de cabeçalho do e-mail iniciada.',
        },
        {
          id: 'tl-3-3',
          timestamp: pastHours(8),
          type: 'MUDANCA_ESTADO',
          previousStatus: 'Em análise',
          newStatus: 'Aguardando usuário',
          author: 'Equipe SOC (N3)',
          note: 'Solicitado à usuária o encaminhamento do e-mail como anexo .eml original.',
        },
      ],
    },
    {
      id: 'TK-2026-0004',
      title: 'Queda intermitente do switch principal do 3º andar',
      description:
        'A infraestrutura de rede cabeada do 3º andar sofreu oscilações de pacotes devido a sobreaquecimento na sala de servidores.',
      category: 'Rede',
      isSecurityOrInfra: true,
      priority: 'Alta',
      supportLevel: 'N3',
      supportLevelReason: 'Identificado como questão de Segurança ou Infraestrutura crítica (Suporte Especializado N3).',
      status: 'Resolvido',
      createdAt: pastHours(48),
      updatedAt: pastHours(4),
      requesterName: 'Renato Almeida',
      requesterEmail: 'renato.almeida@empresa.com.br',
      requesterDepartment: 'Operações',
      timeline: [
        {
          id: 'tl-4-1',
          timestamp: pastHours(48),
          type: 'CRIACAO',
          newStatus: 'Recebido',
          author: 'Renato Almeida',
          note: 'Chamado inicial criado.',
        },
        {
          id: 'tl-4-2',
          timestamp: pastHours(40),
          type: 'MUDANCA_ESTADO',
          previousStatus: 'Recebido',
          newStatus: 'Em análise',
          author: 'Engenharia de Infraestrutura (N3)',
          note: 'Técnico em deslocamento para verificação do rack.',
        },
        {
          id: 'tl-4-3',
          timestamp: pastHours(4),
          type: 'MUDANCA_ESTADO',
          previousStatus: 'Em análise',
          newStatus: 'Resolvido',
          author: 'Engenharia de Infraestrutura (N3)',
          note: 'Substituída fonte redundante do switch e normalizada climatização do rack.',
        },
      ],
    },
  ];
}

class TicketService {
  /**
   * Lê todos os chamados armazenados
   */
  public getTickets(): StorageResult<Ticket[]> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return {
          success: false,
          error: 'Armazenamento local não disponível neste navegador.',
        };
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Inicializa com chamados de demonstração
        const sampleTickets = getInitialSampleTickets();
        this.saveTicketsToStorage(sampleTickets);
        return { success: true, data: sampleTickets };
      }

      const parsed: Ticket[] = JSON.parse(raw);
      return { success: true, data: parsed };
    } catch (err) {
      console.error('Erro ao ler chamados do localStorage:', err);
      return {
        success: false,
        error:
          'Falha ao carregar dados do armazenamento local. Os dados podem estar corrompidos ou o acesso foi bloqueado.',
      };
    }
  }

  /**
   * Salva a lista inteira de chamados com proteção contra QuotaExceeded
   */
  private saveTicketsToStorage(tickets: Ticket[]): StorageResult<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return {
          success: false,
          error: 'Armazenamento local não disponível.',
        };
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      return { success: true };
    } catch (err: unknown) {
      console.error('Falha no armazenamento local:', err);
      let errorMsg = 'Falha ao gravar no armazenamento local.';
      if (
        err instanceof DOMException &&
        (err.name === 'QuotaExceededError' ||
          err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      ) {
        errorMsg =
          'Falha no armazenamento: O limite de armazenamento do navegador foi atingido. Libere espaço para continuar.';
      } else if (err instanceof Error) {
        errorMsg = `Falha no armazenamento: ${err.message}`;
      }
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Gera o próximo identificador de protocolo legível
   */
  private generateNextId(existingTickets: Ticket[]): string {
    const year = new Date().getFullYear();
    const prefix = `TK-${year}-`;
    const sequenceNumbers = existingTickets
      .map((t) => {
        if (t.id.startsWith(prefix)) {
          const numPart = t.id.replace(prefix, '');
          const parsed = parseInt(numPart, 10);
          return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      })
      .filter((n) => n > 0);

    const maxSeq = sequenceNumbers.length > 0 ? Math.max(...sequenceNumbers) : 0;
    const nextSeq = (maxSeq + 1).toString().padStart(4, '0');
    return `${prefix}${nextSeq}`;
  }

  /**
   * Cria um novo chamado com revisão prévia
   */
  public createTicket(dto: CreateTicketDTO): StorageResult<Ticket> {
    const readResult = this.getTickets();
    if (!readResult.success || !readResult.data) {
      return {
        success: false,
        error: readResult.error || 'Não foi possível ler os chamados existentes.',
      };
    }

    // Validações obrigatórias
    if (!dto.title || dto.title.trim() === '') {
      return { success: false, error: 'O título do chamado é obrigatório.' };
    }
    if (!dto.description || dto.description.trim() === '') {
      return { success: false, error: 'A descrição do chamado é obrigatória.' };
    }
    if (!dto.category) {
      return { success: false, error: 'A categoria é obrigatória.' };
    }
    if (!dto.priority) {
      return { success: false, error: 'A prioridade é obrigatória.' };
    }

    const tickets = readResult.data;
    const newId = this.generateNextId(tickets);
    const nowIso = new Date().toISOString();

    const levelSuggestion = suggestSupportLevel(
      dto.category,
      dto.isSecurityOrInfra,
      dto.title,
      dto.description
    );

    const initialEvent: TimelineEvent = {
      id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      type: 'CRIACAO',
      newStatus: 'Recebido',
      author: dto.requesterName
        ? `${dto.requesterName} (Solicitante)`
        : 'Usuário Solicitante',
      note: 'Chamado aberto no sistema SimpleTickets.',
    };

    const newTicket: Ticket = {
      id: newId,
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category,
      isSecurityOrInfra: dto.isSecurityOrInfra,
      priority: dto.priority,
      supportLevel: levelSuggestion.level,
      supportLevelReason: levelSuggestion.reason,
      status: 'Recebido',
      createdAt: nowIso,
      updatedAt: nowIso,
      requesterName: dto.requesterName?.trim() || undefined,
      requesterEmail: dto.requesterEmail?.trim() || undefined,
      requesterDepartment: dto.requesterDepartment?.trim() || undefined,
      timeline: [initialEvent],
    };

    const updatedList = [newTicket, ...tickets];
    const saveResult = this.saveTicketsToStorage(updatedList);
    if (!saveResult.success) {
      return {
        success: false,
        error:
          saveResult.error ||
          'Falha no armazenamento local ao salvar o novo chamado.',
      };
    }

    return { success: true, data: newTicket };
  }

  /**
   * Altera manualmente o estado de um chamado seguindo as regras de transição:
   * - Recebido → Em análise ou Cancelado.
   * - Em análise → Aguardando usuário, Resolvido ou Cancelado.
   * - Aguardando usuário → Em análise, Resolvido ou Cancelado.
   * - Resolvido → Concluído, Em análise ou Cancelado.
   * - Concluído e Cancelado são estados finais.
   */
  public updateStatus(
    ticketId: string,
    newStatus: TicketStatus,
    note?: string,
    author: string = 'Analista de Suporte'
  ): StorageResult<Ticket> {
    const readResult = this.getTickets();
    if (!readResult.success || !readResult.data) {
      return {
        success: false,
        error: readResult.error || 'Não foi possível carregar os chamados.',
      };
    }

    const tickets = [...readResult.data];
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) {
      return {
        success: false,
        error: `Chamado com protocolo "${ticketId}" não foi encontrado.`,
      };
    }

    const currentTicket = tickets[index];
    const currentStatus = currentTicket.status;

    if (FINAL_STATUSES.includes(currentStatus)) {
      return {
        success: false,
        error: `O chamado já está em estado final ("${currentStatus}") e não aceita mais alterações.`,
      };
    }

    const allowed = getAllowedTransitions(currentStatus);
    if (!allowed.includes(newStatus)) {
      return {
        success: false,
        error: `Transição inválida: Não é permitido mudar de "${currentStatus}" diretamente para "${newStatus}". Transições permitidas: ${allowed.join(', ') || 'Nenhuma'}.`,
      };
    }

    const nowIso = new Date().toISOString();
    const eventType =
      newStatus === 'Cancelado' ? 'CANCELAMENTO' : 'MUDANCA_ESTADO';

    const timelineEvent: TimelineEvent = {
      id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      type: eventType,
      previousStatus: currentStatus,
      newStatus: newStatus,
      author: author,
      note:
        note && note.trim()
          ? note.trim()
          : `Estado alterado de "${currentStatus}" para "${newStatus}".`,
    };

    const updatedTicket: Ticket = {
      ...currentTicket,
      status: newStatus,
      updatedAt: nowIso,
      timeline: [timelineEvent, ...currentTicket.timeline],
    };

    tickets[index] = updatedTicket;
    const saveResult = this.saveTicketsToStorage(tickets);
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error || 'Falha ao salvar a alteração de estado.',
      };
    }

    return { success: true, data: updatedTicket };
  }

  /**
   * Cancela um chamado (permitido em qualquer estado exceto Concluído ou Cancelado)
   */
  public cancelTicket(
    ticketId: string,
    reason: string = 'Cancelado a pedido do solicitante',
    author: string = 'Usuário Solicitante'
  ): StorageResult<Ticket> {
    const readResult = this.getTickets();
    if (!readResult.success || !readResult.data) {
      return {
        success: false,
        error: readResult.error || 'Erro ao carregar chamados.',
      };
    }

    const ticket = readResult.data.find((t) => t.id === ticketId);
    if (!ticket) {
      return { success: false, error: 'Chamado não encontrado.' };
    }

    if (!canCancelTicket(ticket.status)) {
      return {
        success: false,
        error: `O chamado não pode ser cancelado porque já se encontra no estado "${ticket.status}".`,
      };
    }

    return this.updateStatus(ticketId, 'Cancelado', reason, author);
  }

  /**
   * Adiciona uma observação/comentário à linha do tempo sem mudar o status
   */
  public addTimelineNote(
    ticketId: string,
    note: string,
    author: string = 'Analista de Suporte'
  ): StorageResult<Ticket> {
    if (!note || !note.trim()) {
      return { success: false, error: 'A observação não pode estar vazia.' };
    }

    const readResult = this.getTickets();
    if (!readResult.success || !readResult.data) {
      return { success: false, error: 'Erro ao carregar chamados.' };
    }

    const tickets = [...readResult.data];
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) {
      return { success: false, error: 'Chamado não encontrado.' };
    }

    const ticket = tickets[index];
    const nowIso = new Date().toISOString();

    const event: TimelineEvent = {
      id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      type: 'NOTA',
      author,
      note: note.trim(),
    };

    const updatedTicket: Ticket = {
      ...ticket,
      updatedAt: nowIso,
      timeline: [event, ...ticket.timeline],
    };

    tickets[index] = updatedTicket;
    const saveResult = this.saveTicketsToStorage(tickets);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }

    return { success: true, data: updatedTicket };
  }

  /**
   * Restaura os dados de exemplo caso o usuário deseje reiniciar a demonstração
   */
  public resetToSampleData(): StorageResult<Ticket[]> {
    const samples = getInitialSampleTickets();
    const saveResult = this.saveTicketsToStorage(samples);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }
    return { success: true, data: samples };
  }
}

export const ticketService = new TicketService();
