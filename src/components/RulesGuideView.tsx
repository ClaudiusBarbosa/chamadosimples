/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SupportLevelBadge } from './SupportLevelBadge';
import { StatusBadge } from './StatusBadge';
import {
  Layers,
  GitBranch,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';

export const RulesGuideView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-blue-600" />
          Guia de Fluxo & Regras de Atendimento
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          O <strong>SimpleTickets</strong> foi arquitetado com base nas boas práticas de Service Desk e suporte de TI corporativo. Abaixo estão descritas as regras de negócio implementadas na aplicação.
        </p>
      </div>

      {/* Níveis de Atendimento */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-600" />
          Níveis de Atendimento (SLA & Escalonamento)
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          O sistema sugere o nível de atendimento de forma automática no momento da abertura do chamado:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <SupportLevelBadge level="N1" />
              <span className="text-[11px] font-semibold text-emerald-800">1º Nível</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Suporte Técnico N1</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Atendimento operacional de primeiro nível.
            </p>
            <div className="pt-2 border-t border-emerald-200/60 text-xs text-emerald-900 font-medium">
              Categorias: Hardware, Acesso, Rede, E-mail e Outro.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <SupportLevelBadge level="N2" />
              <span className="text-[11px] font-semibold text-blue-800">2º Nível</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Desenvolvimento & Sistemas N2</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Suporte técnico aprofundado e equipe de engenharia/desenvolvimento de software.
            </p>
            <div className="pt-2 border-t border-blue-200/60 text-xs text-blue-900 font-medium">
              Categoria: Software.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <SupportLevelBadge level="N3" />
              <span className="text-[11px] font-semibold text-purple-800">3º Nível</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Segurança & Infraestrutura N3</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Especialistas em servidores, datacenter, segurança defensiva e conectividade de borda.
            </p>
            <div className="pt-2 border-t border-purple-200/60 text-xs text-purple-900 font-medium">
              Gatilho: Problemas identificados como Segurança ou Infraestrutura.
            </div>
          </div>
        </div>
      </div>

      {/* Ciclo de Vida e Transições de Estado */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-600" />
          Transições de Estado Permitidas
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          A aplicação valida estritamente o ciclo de vida dos chamados para evitar inconsistências no fluxo de trabalho:
        </p>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">A partir de</span>
              <StatusBadge status="Recebido" size="sm" />
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span>Transições válidas:</span>
              <StatusBadge status="Em análise" size="sm" />
              <span>ou</span>
              <StatusBadge status="Cancelado" size="sm" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">A partir de</span>
              <StatusBadge status="Em análise" size="sm" />
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span>Transições válidas:</span>
              <StatusBadge status="Aguardando usuário" size="sm" />
              <StatusBadge status="Resolvido" size="sm" />
              <span>ou</span>
              <StatusBadge status="Cancelado" size="sm" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">A partir de</span>
              <StatusBadge status="Aguardando usuário" size="sm" />
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span>Transições válidas:</span>
              <StatusBadge status="Em análise" size="sm" />
              <StatusBadge status="Resolvido" size="sm" />
              <span>ou</span>
              <StatusBadge status="Cancelado" size="sm" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">A partir de</span>
              <StatusBadge status="Resolvido" size="sm" />
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span>Transições válidas:</span>
              <StatusBadge status="Concluído" size="sm" />
              <StatusBadge status="Em análise" size="sm" />
              <span>ou</span>
              <StatusBadge status="Cancelado" size="sm" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Estados Finais:</span>
              <StatusBadge status="Concluído" size="sm" />
              <StatusBadge status="Cancelado" size="sm" />
            </div>
            <div className="text-rose-800 font-medium">
              Estados terminais definitivos (não aceitam novas transições).
            </div>
          </div>
        </div>
      </div>

      {/* Regra de Cancelamento com Confirmação & Revisão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Cancelamento Seguro
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            O cancelamento pode ser acionado em qualquer fase ativa (Recebido, Em análise, Aguardando usuário ou Resolvido). Para evitar erros acidentais, a aplicação sempre exige <strong>confirmação expressa</strong> com campo para justificativa antes de efetivar o cancelamento.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            Revisão Prévia Obrigatória
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Antes de salvar qualquer novo chamado, o formulário apresenta uma <strong>etapa de revisão e confirmação</strong> detalhando os dados preenchidos, a categoria e a justificativa do nível de suporte sugerido.
          </p>
        </div>
      </div>
    </div>
  );
};
