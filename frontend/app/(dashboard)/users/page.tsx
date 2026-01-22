'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Role } from '@/lib/types';
import { UserCog, Info } from 'lucide-react';

export default function UsersPage() {
  const { hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hasRole(Role.ADMIN)) {
      router.push('/');
    }
  }, [hasRole, router]);

  if (!hasRole(Role.ADMIN)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--lbc-primary)] flex items-center justify-center">
          <UserCog size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--lbc-text)]">
            Gestão de Utilizadores
          </h1>
          <p className="text-[var(--lbc-muted)]">
            Administração de contas de acesso ao sistema
          </p>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)] p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--status-pending-bg)] flex items-center justify-center flex-shrink-0">
            <Info size={20} className="text-[var(--status-pending)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--lbc-text)] mb-2">
              Funcionalidade em Desenvolvimento
            </h2>
            <p className="text-[var(--lbc-muted)] text-sm">
              A gestão completa de utilizadores (criar, editar, remover) está em fase 
              de implementação. Atualmente, os utilizadores são geridos através das 
              migrations do banco de dados.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-[var(--lbc-bg-secondary)]">
              <h3 className="font-medium text-[var(--lbc-text)] mb-2">
                Utilizadores disponíveis para teste:
              </h3>
              <ul className="text-sm text-[var(--lbc-muted)] space-y-1">
                <li>
                  <strong>Admin:</strong> admin@lbc.local / Admin123!
                </li>
                <li>
                  <strong>Manager:</strong> manager@lbc.local / Manager123!
                </li>
                <li>
                  <strong>Collaborator:</strong> collab@lbc.local / Collab123!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Roles explanation */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)] p-6">
          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <span className="text-red-600 dark:text-red-400 font-bold">A</span>
          </div>
          <h3 className="font-semibold text-[var(--lbc-text)] mb-2">Admin</h3>
          <ul className="text-sm text-[var(--lbc-muted)] space-y-1">
            <li>• Acesso total ao sistema</li>
            <li>• Gerir colaboradores</li>
            <li>• Gerir todos os pedidos de férias</li>
            <li>• Ver registos de auditoria</li>
          </ul>
        </div>

        <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)] p-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <span className="text-blue-600 dark:text-blue-400 font-bold">M</span>
          </div>
          <h3 className="font-semibold text-[var(--lbc-text)] mb-2">Manager</h3>
          <ul className="text-sm text-[var(--lbc-muted)] space-y-1">
            <li>• Ver colaboradores do seu time</li>
            <li>• Aprovar/rejeitar férias do time</li>
            <li>• Ver pedidos de férias do time</li>
          </ul>
        </div>

        <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)] p-6">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <span className="text-green-600 dark:text-green-400 font-bold">C</span>
          </div>
          <h3 className="font-semibold text-[var(--lbc-text)] mb-2">Collaborator</h3>
          <ul className="text-sm text-[var(--lbc-muted)] space-y-1">
            <li>• Criar pedidos de férias próprios</li>
            <li>• Ver e cancelar seus pedidos</li>
            <li>• Ver seu saldo de férias</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
