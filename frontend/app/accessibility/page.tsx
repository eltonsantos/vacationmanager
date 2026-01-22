import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, Mail } from 'lucide-react';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[var(--lbc-bg)]">
      {/* Header */}
      <header className="bg-[var(--lbc-card)] border-b border-[var(--lbc-border)]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--lbc-primary)] hover:underline"
          >
            <ArrowLeft size={18} />
            Voltar ao início
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)] p-8">
          {/* Title */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--lbc-primary)] flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--lbc-text)]">
                Declaração de Acessibilidade e Usabilidade
              </h1>
              <p className="text-[var(--lbc-muted)] mt-1">
                VacationManager - Sistema de Gestão de Férias
              </p>
            </div>
          </div>

          {/* Content sections */}
          <div className="space-y-8 text-[var(--lbc-text)]">
            {/* Conformidade */}
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle size={20} className="text-[var(--status-approved)]" />
                Estado de Conformidade
              </h2>
              <p className="text-[var(--lbc-text-secondary)] leading-relaxed">
                O VacationManager está em processo de implementação das diretrizes 
                de acessibilidade definidas nas{' '}
                <strong>Web Content Accessibility Guidelines (WCAG) 2.1</strong>, 
                nível AA, conforme recomendado pela Agência para a Modernização 
                Administrativa (AMA) de Portugal.
              </p>
              <div className="mt-4 p-4 rounded-lg bg-[var(--status-pending-bg)]">
                <p className="text-sm text-[var(--status-pending)]">
                  <strong>Nota:</strong> Esta declaração representa o compromisso 
                  com a acessibilidade e não constitui certificação oficial.
                </p>
              </div>
            </section>

            {/* Funcionalidades */}
            <section>
              <h2 className="text-lg font-semibold mb-3">
                Funcionalidades de Acessibilidade
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--lbc-text-secondary)]">
                <li>
                  <strong>Navegação por teclado:</strong> Todas as funcionalidades 
                  podem ser acedidas através do teclado
                </li>
                <li>
                  <strong>Modo escuro/claro:</strong> Opção de tema para reduzir 
                  fadiga visual
                </li>
                <li>
                  <strong>Contraste de cores:</strong> Utilização de cores com 
                  contraste adequado para melhor legibilidade
                </li>
                <li>
                  <strong>Textos alternativos:</strong> Imagens e ícones possuem 
                  descrições alternativas
                </li>
                <li>
                  <strong>Estrutura semântica:</strong> Utilização de HTML semântico 
                  para facilitar a navegação com leitores de ecrã
                </li>
                <li>
                  <strong>Design responsivo:</strong> Interface adaptada para 
                  diferentes dispositivos e tamanhos de ecrã
                </li>
                <li>
                  <strong>Mensagens de erro claras:</strong> Feedback explícito 
                  sobre erros e como corrigi-los
                </li>
              </ul>
            </section>

            {/* Limitações conhecidas */}
            <section>
              <h2 className="text-lg font-semibold mb-3">
                Limitações Conhecidas
              </h2>
              <p className="text-[var(--lbc-text-secondary)] mb-3">
                Embora nos esforcemos para garantir a acessibilidade do VacationManager, 
                algumas limitações podem existir:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--lbc-text-secondary)]">
                <li>
                  Componentes de calendário podem ter compatibilidade limitada 
                  com alguns leitores de ecrã
                </li>
                <li>
                  Algumas notificações em tempo real podem não ser anunciadas 
                  imediatamente por tecnologias assistivas
                </li>
              </ul>
            </section>

            {/* Tecnologias utilizadas */}
            <section>
              <h2 className="text-lg font-semibold mb-3">
                Tecnologias Utilizadas
              </h2>
              <p className="text-[var(--lbc-text-secondary)] mb-3">
                A acessibilidade deste website depende das seguintes tecnologias:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[var(--lbc-text-secondary)]">
                <li>HTML5</li>
                <li>CSS3 (TailwindCSS)</li>
                <li>JavaScript/TypeScript</li>
                <li>React/Next.js</li>
                <li>WAI-ARIA</li>
              </ul>
            </section>

            {/* Métodos de avaliação */}
            <section>
              <h2 className="text-lg font-semibold mb-3">
                Métodos de Avaliação
              </h2>
              <p className="text-[var(--lbc-text-secondary)]">
                A acessibilidade do VacationManager foi avaliada através de:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[var(--lbc-text-secondary)] mt-2">
                <li>Auto-avaliação interna</li>
                <li>Ferramentas automáticas de verificação (Lighthouse, axe)</li>
                <li>Testes manuais de navegação por teclado</li>
                <li>Verificação de contraste de cores</li>
              </ul>
            </section>

            {/* Contacto */}
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Mail size={20} className="text-[var(--lbc-primary)]" />
                Contacto
              </h2>
              <p className="text-[var(--lbc-text-secondary)] mb-3">
                Se encontrar barreiras de acessibilidade ou tiver sugestões de 
                melhoria, contacte-nos:
              </p>
              <div className="p-4 rounded-lg bg-[var(--lbc-bg-secondary)]">
                <p className="text-sm">
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:acessibilidade@lbc.local"
                    className="text-[var(--lbc-primary)] hover:underline"
                  >
                    acessibilidade@lbc.local
                  </a>
                </p>
              </div>
            </section>

            {/* Data */}
            <section className="pt-4 border-t border-[var(--lbc-border)]">
              <p className="text-sm text-[var(--lbc-muted)]">
                <strong>Data desta declaração:</strong> Janeiro de 2026
              </p>
              <p className="text-sm text-[var(--lbc-muted)] mt-1">
                Esta declaração foi preparada com base no modelo recomendado 
                pela Agência para a Modernização Administrativa (AMA).
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-[var(--lbc-muted)]">
          <p>Desenvolvido por Elton Santos – 2026</p>
        </footer>
      </main>
    </div>
  );
}
