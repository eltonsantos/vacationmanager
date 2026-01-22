import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="h-12 bg-[var(--lbc-card)] border-t border-[var(--lbc-border)] flex items-center justify-center px-4">
      <p className="text-xs text-[var(--lbc-muted)]">
        Desenvolvido por{' '}
        <span className="font-medium text-[var(--lbc-text)]">Elton Santos</span>{' '}
        – 2026 |{' '}
        <Link
          href="/accessibility"
          className="text-[var(--lbc-primary)] hover:underline"
        >
          Declaração de Acessibilidade
        </Link>
      </p>
    </footer>
  );
}
