'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { auditApi } from '@/lib/api';
import { AuditLog, Role } from '@/lib/types';
import Table from '@/components/ui/Table';
import { ClipboardList, User, Calendar } from 'lucide-react';

const actionLabels: Record<string, string> = {
  CREATE_EMPLOYEE: 'Criou colaborador',
  UPDATE_EMPLOYEE: 'Atualizou colaborador',
  DELETE_EMPLOYEE: 'Removeu colaborador',
  CREATE_VACATION: 'Criou pedido de férias',
  UPDATE_VACATION: 'Atualizou pedido de férias',
  CANCEL_VACATION: 'Cancelou pedido de férias',
  APPROVE_VACATION: 'Aprovou pedido de férias',
  REJECT_VACATION: 'Rejeitou pedido de férias',
};

export default function AuditPage() {
  const { hasRole } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasRole(Role.ADMIN)) {
      router.push('/');
      return;
    }

    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await auditApi.list(page, 20);
        setLogs(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [page, hasRole, router]);

  const columns = [
    {
      key: 'createdAt',
      header: 'Data/Hora',
      render: (log: AuditLog) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[var(--lbc-muted)]" />
          <span className="text-sm">
            {new Date(log.createdAt).toLocaleString('pt-PT')}
          </span>
        </div>
      ),
    },
    {
      key: 'actorEmail',
      header: 'Utilizador',
      render: (log: AuditLog) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--lbc-primary)] flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <span>{log.actorEmail}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Ação',
      render: (log: AuditLog) => (
        <span className="font-medium">
          {actionLabels[log.action] || log.action}
        </span>
      ),
    },
    {
      key: 'entityType',
      header: 'Entidade',
      render: (log: AuditLog) => (
        <span className="px-2 py-1 rounded bg-[var(--lbc-bg-secondary)] text-xs font-medium">
          {log.entityType}
        </span>
      ),
    },
    {
      key: 'metadata',
      header: 'Detalhes',
      render: (log: AuditLog) => (
        <div className="max-w-xs truncate text-sm text-[var(--lbc-muted)]">
          {log.metadata ? JSON.stringify(log.metadata) : '-'}
        </div>
      ),
    },
  ];

  if (!hasRole(Role.ADMIN)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--lbc-primary)] flex items-center justify-center">
          <ClipboardList size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--lbc-text)]">
            Registos de Auditoria
          </h1>
          <p className="text-[var(--lbc-muted)]">
            Histórico de ações realizadas no sistema
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)]">
        <Table
          columns={columns}
          data={logs}
          keyExtractor={(log) => log.id}
          isLoading={isLoading}
          emptyMessage="Nenhum registo de auditoria encontrado."
          pagination={{
            page,
            totalPages,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
}
