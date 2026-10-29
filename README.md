# 🎟️ SimpleTickets – Sistema de Gestão de Chamados de TI

> Aplicação web desenvolvida para otimizar o fluxo de trabalho de suporte de TI, priorizando clareza, acessibilidade (WCAG AA), resiliência e regras de negócio bem estruturadas.

Projeto construído durante a **Imersão Engenharia de Software: Dev na Era da IA** promovida pela **Alura**, utilizando o **Google AI Studio** como ferramenta de apoio ao desenvolvimento.

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Acessibilidade e UX](#-acessibilidade-e-ux)
- [Arquitetura e Estrutura Técnica](#-arquitetura-e-estrutura-técnica)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Licença](#-licença)

---

## 🚀 Visão Geral

O **SimpleTickets** foi desenhado para simular o ecossistema real de um *Help Desk* / *Service Desk* corporativo. Ele abstrai a complexidade do ciclo de vida de um incidente de TI, permitindo triagem automática, acompanhamento transparente por linha do tempo e transições de estado estritas.

---

## ✨ Funcionalidades

### 📋 1. Abertura e Validação de Chamados
* Validação em tempo real para campos obrigatórios: *Título*, *Descrição*, *Categoria* (Hardware, Software, Acesso, Rede, E-mail, Outro) e *Prioridade* (Baixa, Normal, Alta, Crítica).
* **Modal de Revisão:** Confirmação detalhada exibindo resumo, nível atribuído e regras aplicadas antes da gravação final.

### 🧠 2. Níveis de Atendimento Inteligentes
Atribuição automatizada de níveis com base na categoria e termos críticos:
* **N1 (Suporte 1º Nível):** Padrão para Hardware, Acesso, Rede, E-mail e Outro.
* **N2 (Desenvolvimento 2º Nível):** Direcionado para a categoria Software.
* **N3 (Segurança & Infraestrutura 3º Nível):** Atribuído automaticamente via seleção explícita ou detecção de termos críticos.

### 🔄 3. Máquina de Estados & Ciclo de Vida
Controle rígido de transições respeitando a matriz de permissões:
* `Recebido` ➔ `Em análise` ou `Cancelado`
* `Em análise` ➔ `Aguardando usuário`, `Resolvido` ou `Cancelado`
* `Aguardando usuário` ➔ `Em análise`, `Resolvido` ou `Cancelado`
* `Resolvido` ➔ `Concluído`, `Em análise` ou `Cancelado`
* `Concluído` e `Cancelado`: Estados finais bloqueados para novas edições.
* **Cancelamento Seguro:** Requer justificativa obrigatória através de modal de confirmação.

### ⏱️ 4. Linha do Tempo (Timeline)
* Registro cronológico detalhado com carimbo de data/hora no formato brasileiro (`pt-BR`).
* Histórico de autor, notas e justificativas de cada mudança de estado.

---

## ♿ Acessibilidade e UX

* **Conformidade WCAG AA:** Relação de contraste de cores adequada e anéis de foco visíveis (`:focus-visible`).
* **Navegação por Teclado:** Suporte completo a atalhos de navegação e acessibilidade.
* **Leitores de Tela:** Estrutura semântica e rótulos associados (`htmlFor` / `aria-*`).
* **Feedback ao Usuário:** Mensagens em banners de sucesso/erro, tratamento de lista vazia e gestão de exceções de armazenamento (`localStorage`).

---

## 🛠️ Arquitetura e Estrutura Técnica

A aplicação adota uma arquitetura desacoplada e tipada:

```text
src/
 ├── types/
 │    └── ticket.ts        # Tipagem centralizada, enums e regras de negócio
 ├── services/
 │    └── ticketService.ts # Serviço de persistência local, regras de filtro e mock inicial
 └── components/           # Componentes visuais e modais da interface
