/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import {
  CreateTicketDTO,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  Ticket,
  TicketCategory,
  TicketPriority,
} from '../types/ticket';
import { suggestSupportLevel, ticketService } from '../services/ticketService';
import { SupportLevelBadge } from './SupportLevelBadge';
import { ReviewTicketModal } from './ReviewTicketModal';
import {
  ShieldAlert,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CreateTicketFormProps {
  onTicketCreated: (ticket: Ticket) => void;
  onError: (errorMessage: string) => void;
}

export const CreateTicketForm: React.FC<CreateTicketFormProps> = ({
  onTicketCreated,
  onError,
}) => {
  const titleId = useId();
  const descId = useId();
  const catId = useId();
  const secInfraId = useId();
  const reqNameId = useId();
  const reqEmailId = useId();
  const reqDeptId = useId();

  // Estados dos campos
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Hardware');
  const [priority, setPriority] = useState<TicketPriority>('Normal');
  const [isSecurityOrInfra, setIsSecurityOrInfra] = useState(false);
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [requesterDepartment, setRequesterDepartment] = useState('');

  // Estados de validação
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cálculo de sugestão do nível de atendimento em tempo real
  const levelSuggestion = suggestSupportLevel(
    category,
    isSecurityOrInfra,
    title,
    description
  );

  // Validação simples
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'O título do chamado é obrigatório.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'O título deve conter ao menos 5 caracteres.';
    }

    if (!description.trim()) {
      newErrors.description = 'A descrição do problema é obrigatória.';
    } else if (description.trim().length < 10) {
      newErrors.description =
        'Por favor, forneça mais detalhes sobre o chamado (mínimo 10 caracteres).';
    }

    if (!category) {
      newErrors.category = 'Selecione uma categoria válida.';
    }

    if (!priority) {
      newErrors.priority = 'Selecione a prioridade do atendimento.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsReviewOpen(true);
    }
  };

  const handleConfirmCreation = () => {
    setIsSubmitting(true);
    try {
      const dto: CreateTicketDTO = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        isSecurityOrInfra: isSecurityOrInfra || levelSuggestion.level === 'N3',
        requesterName: requesterName.trim() || undefined,
        requesterEmail: requesterEmail.trim() || undefined,
        requesterDepartment: requesterDepartment.trim() || undefined,
      };

      const result = ticketService.createTicket(dto);
      if (!result.success || !result.data) {
        onError(result.error || 'Falha ao registrar o chamado no armazenamento.');
        setIsSubmitting(false);
        return;
      }

      setIsReviewOpen(false);
      setIsSubmitting(false);

      // Limpa os campos
      setTitle('');
      setDescription('');
      setCategory('Hardware');
      setPriority('Normal');
      setIsSecurityOrInfra(false);
      setErrors({});

      onTicketCreated(result.data);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Erro inesperado ao criar o chamado.';
      onError(`Falha no armazenamento ou execução: ${msg}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Cabeçalho do formulário */}
        <div className="p-6 border-b border-slate-200 bg-linear-to-r from-slate-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Abertura de Chamado de TI
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Preencha os campos obrigatórios abaixo para registrar sua solicitação de suporte.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs font-medium self-start sm:self-auto">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Campos com * são obrigatórios</span>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleOpenReview} noValidate className="p-6 sm:p-8 space-y-6">
          {/* Título do Chamado */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor={titleId}
                className="block text-xs sm:text-sm font-semibold text-slate-900"
              >
                Título do Chamado <span className="text-rose-600">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {title.length}/100
              </span>
            </div>
            <input
              id={titleId}
              type="text"
              maxLength={100}
              required
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              placeholder="Ex: Teclado não responde na estação 04, Erro ao acessar o CRM..."
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-rose-500/20'
                  : 'border-slate-300 text-slate-900 bg-white focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.title && (
              <p
                id="title-error"
                role="alert"
                className="mt-1.5 text-xs text-rose-600 font-medium"
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Grid: Categoria e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoria */}
            <div>
              <label
                htmlFor={catId}
                className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5"
              >
                Categoria <span className="text-rose-600">*</span>
              </label>
              <select
                id={catId}
                required
                aria-required="true"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as TicketCategory)
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 transition-colors outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              >
                {TICKET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} {cat === 'Software' ? '(Nível N2)' : '(Nível N1)'}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                Selecione a área principal afetada pelo problema.
              </p>
            </div>

            {/* Prioridade */}
            <div>
              <fieldset>
                <legend className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5">
                  Prioridade do Atendimento <span className="text-rose-600">*</span>
                </legend>
                <div
                  className="grid grid-cols-4 gap-2"
                  role="radiogroup"
                  aria-label="Prioridade do atendimento"
                >
                  {TICKET_PRIORITIES.map((p) => {
                    const isSelected = priority === p;
                    return (
                      <label
                        key={p}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all select-none ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ticket-priority"
                          value={p}
                          checked={isSelected}
                          onChange={() => setPriority(p)}
                          className="sr-only"
                        />
                        <span>{p}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <p className="mt-1.5 text-xs text-slate-500">
                Defina o impacto nas suas atividades de rotina.
              </p>
            </div>
          </div>

          {/* Opção e detecção de Segurança ou Infraestrutura (Nível N3) */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3">
            <div className="flex items-start gap-3">
              <input
                id={secInfraId}
                type="checkbox"
                checked={isSecurityOrInfra}
                onChange={(e) => setIsSecurityOrInfra(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 focus-visible:ring-2"
              />
              <div className="flex-1">
                <label
                  htmlFor={secInfraId}
                  className="text-xs sm:text-sm font-semibold text-slate-900 cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4 text-purple-700" />
                  Identificado como problema de Segurança da Informação ou Infraestrutura Crítica
                </label>
                <p className="text-xs text-slate-600 mt-0.5">
                  Marque esta opção caso envolva servidores, firewall, vazamento de dados, ataques, queda de rede central ou vulnerabilidades. Isso direcionará automaticamente para o <strong>Nível 3 (N3)</strong>.
                </p>
              </div>
            </div>

            {/* Aviso inteligente de termo detectado */}
            {levelSuggestion.autoDetectedKeyword && !isSecurityOrInfra && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  O sistema identificou o termo <strong>"{levelSuggestion.autoDetectedKeyword}"</strong> no texto e sugeriu o atendimento <strong>N3</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Card em tempo real de Nível de Atendimento Sugerido */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Nível de Atendimento Atribuído pelo Sistema
              </span>
              <div className="flex items-center gap-2">
                <SupportLevelBadge level={levelSuggestion.level} showDescription />
              </div>
              <p className="text-xs text-slate-600 pt-0.5">
                {levelSuggestion.reason}
              </p>
            </div>
            <div className="text-xs text-slate-500 border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-200 shrink-0">
              <span className="block font-medium text-slate-700 mb-0.5">
                Regras de Atendimento:
              </span>
              <ul className="space-y-0.5 text-[11px]">
                <li>• N1: Hardware, Acesso, Rede, E-mail, Outro</li>
                <li>• N2: Software (Desenvolvimento/Sistemas)</li>
                <li>• N3: Segurança ou Infraestrutura Crítica</li>
              </ul>
            </div>
          </div>

          {/* Descrição do Chamado */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor={descId}
                className="block text-xs sm:text-sm font-semibold text-slate-900"
              >
                Descrição Detalhada do Problema <span className="text-rose-600">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {description.length} caracteres
              </span>
            </div>
            <textarea
              id={descId}
              rows={4}
              required
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'desc-error' : undefined}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: '' }));
                }
              }}
              placeholder="Descreva o que está acontecendo, quando começou, mensagens de erro exibidas e procedimentos que já tentou realizar..."
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors outline-none focus:ring-2 ${
                errors.description
                  ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-rose-500/20'
                  : 'border-slate-300 text-slate-900 bg-white focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.description && (
              <p
                id="desc-error"
                role="alert"
                className="mt-1.5 text-xs text-rose-600 font-medium"
              >
                {errors.description}
              </p>
            )}
          </div>

          {/* Dados opcionais do Solicitante */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <span>Informações do Solicitante</span>
              <span className="text-slate-400 font-normal lowercase">(opcional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor={reqNameId}
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Nome completo
                </label>
                <input
                  id={reqNameId}
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor={reqEmailId}
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  E-mail corporativo
                </label>
                <input
                  id={reqEmailId}
                  type="email"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  placeholder="nome@empresa.com.br"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor={reqDeptId}
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Departamento / Setor
                </label>
                <input
                  id={reqDeptId}
                  type="text"
                  value={requesterDepartment}
                  onChange={(e) => setRequesterDepartment(e.target.value)}
                  placeholder="Ex: Comercial, Financeiro"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rodapé do Formulário: Ação de Revisão */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>
                Na próxima etapa você poderá <strong>revisar todos os dados</strong> antes da confirmação final.
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span>Revisar e Confirmar Chamado</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Revisão e Confirmação */}
      <ReviewTicketModal
        isOpen={isReviewOpen}
        formData={{
          title,
          description,
          category,
          priority,
          isSecurityOrInfra,
          requesterName,
          requesterEmail,
          requesterDepartment,
        }}
        onClose={() => setIsReviewOpen(false)}
        onConfirm={handleConfirmCreation}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
