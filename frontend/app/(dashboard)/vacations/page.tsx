'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { vacationsApi, employeesApi } from '@/lib/api';
import { VacationRequest, VacationRequestDto, VacationStatus, Role, Employee, ApiError } from '@/lib/types';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import StatusBadge from '@/components/ui/StatusBadge';
import { Plus, Check, X, Ban, Calendar } from 'lucide-react';

export default function VacationsPage() {
  const { hasRole, user } = useAuth();
  const [vacations, setVacations] = useState<VacationRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null);
  const [decisionType, setDecisionType] = useState<'approve' | 'reject'>('approve');
  const [comment, setComment] = useState('');
  const [formData, setFormData] = useState<VacationRequestDto>({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const canApprove = hasRole([Role.ADMIN, Role.MANAGER]);
  const isAdmin = hasRole(Role.ADMIN);

  const fetchVacations = async () => {
    setIsLoading(true);
    try {
      const response = await vacationsApi.list(page, 10);
      setVacations(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching vacations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeesApi.list(0, 100);
      setEmployees(response.content);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchVacations();
    if (isAdmin) {
      fetchEmployees();
    }
  }, [page]);

  const handleOpenModal = () => {
    setFormData({
      employeeId: employees[0]?.id || '',
      startDate: '',
      endDate: '',
      reason: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ employeeId: '', startDate: '', endDate: '', reason: '' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await vacationsApi.create(formData);
      handleCloseModal();
      fetchVacations();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Erro ao criar pedido de férias');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDecisionModal = (vacation: VacationRequest, type: 'approve' | 'reject') => {
    setSelectedVacation(vacation);
    setDecisionType(type);
    setComment('');
    setIsDecisionModalOpen(true);
  };

  const handleDecision = async () => {
    if (!selectedVacation) return;
    setIsSaving(true);

    try {
      if (decisionType === 'approve') {
        await vacationsApi.approve(selectedVacation.id, { comment });
      } else {
        await vacationsApi.reject(selectedVacation.id, { comment });
      }
      setIsDecisionModalOpen(false);
      setSelectedVacation(null);
      fetchVacations();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message || 'Erro ao processar decisão');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async (vacation: VacationRequest) => {
    if (!confirm('Tem certeza que deseja cancelar este pedido de férias?')) {
      return;
    }

    try {
      await vacationsApi.cancel(vacation.id);
      fetchVacations();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message || 'Erro ao cancelar pedido');
    }
  };

  const columns = [
    {
      key: 'employeeName',
      header: 'Colaborador',
      render: (vacation: VacationRequest) => (
        <div>
          <p className="font-medium">{vacation.employeeName}</p>
          <p className="text-xs text-[var(--lbc-muted)]">{vacation.employeeEmail}</p>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Período',
      render: (vacation: VacationRequest) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[var(--lbc-muted)]" />
          <span>
            {new Date(vacation.startDate).toLocaleDateString('pt-PT')} -{' '}
            {new Date(vacation.endDate).toLocaleDateString('pt-PT')}
          </span>
        </div>
      ),
    },
    {
      key: 'daysCount',
      header: 'Dias',
      render: (vacation: VacationRequest) => `${vacation.daysCount} dias`,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (vacation: VacationRequest) => <StatusBadge status={vacation.status} />,
    },
    {
      key: 'reason',
      header: 'Motivo',
      render: (vacation: VacationRequest) => (
        <span className="text-sm text-[var(--lbc-muted)]">
          {vacation.reason || '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (vacation: VacationRequest) => (
        <div className="flex items-center gap-1">
          {vacation.status === VacationStatus.PENDING && canApprove && (
            <>
              <button
                onClick={() => handleOpenDecisionModal(vacation, 'approve')}
                className="p-1.5 rounded hover:bg-[var(--status-approved-bg)]"
                title="Aprovar"
              >
                <Check size={16} className="text-[var(--status-approved)]" />
              </button>
              <button
                onClick={() => handleOpenDecisionModal(vacation, 'reject')}
                className="p-1.5 rounded hover:bg-[var(--status-rejected-bg)]"
                title="Rejeitar"
              >
                <X size={16} className="text-[var(--status-rejected)]" />
              </button>
            </>
          )}
          {vacation.status !== VacationStatus.CANCELLED && vacation.status !== VacationStatus.REJECTED && (
            <button
              onClick={() => handleCancel(vacation)}
              className="p-1.5 rounded hover:bg-[var(--lbc-bg-secondary)]"
              title="Cancelar"
            >
              <Ban size={16} className="text-[var(--lbc-muted)]" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--lbc-text)]">
            Gestão de Férias
          </h1>
          <p className="text-[var(--lbc-muted)]">
            Pedidos de férias da organização
          </p>
        </div>
        <Button onClick={handleOpenModal} leftIcon={<Plus size={18} />}>
          Novo Pedido
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)]">
        <Table
          columns={columns}
          data={vacations}
          keyExtractor={(vacation) => vacation.id}
          isLoading={isLoading}
          emptyMessage="Nenhum pedido de férias encontrado."
          pagination={{
            page,
            totalPages,
            onPageChange: setPage,
          }}
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Novo Pedido de Férias"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {isAdmin && employees.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[var(--lbc-text)] mb-1.5">
                Colaborador
              </label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-lg bg-[var(--lbc-card)] text-[var(--lbc-text)] border-[var(--lbc-border)]"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                required
              >
                <option value="">Selecione um colaborador</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Início"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="Data Fim"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--lbc-text)] mb-1.5">
              Motivo
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border rounded-lg bg-[var(--lbc-card)] text-[var(--lbc-text)] border-[var(--lbc-border)] resize-none"
              rows={3}
              value={formData.reason || ''}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Opcional"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[var(--status-rejected-bg)] text-[var(--status-rejected)] text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Criar Pedido
            </Button>
          </div>
        </form>
      </Modal>

      {/* Decision Modal */}
      <Modal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        title={decisionType === 'approve' ? 'Aprovar Férias' : 'Rejeitar Férias'}
      >
        <div className="space-y-4">
          {selectedVacation && (
            <div className="p-4 rounded-lg bg-[var(--lbc-bg-secondary)]">
              <p className="font-medium">{selectedVacation.employeeName}</p>
              <p className="text-sm text-[var(--lbc-muted)]">
                {new Date(selectedVacation.startDate).toLocaleDateString('pt-PT')} -{' '}
                {new Date(selectedVacation.endDate).toLocaleDateString('pt-PT')} ({selectedVacation.daysCount} dias)
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--lbc-text)] mb-1.5">
              Comentário
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border rounded-lg bg-[var(--lbc-card)] text-[var(--lbc-text)] border-[var(--lbc-border)] resize-none"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDecisionModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant={decisionType === 'approve' ? 'success' : 'danger'}
              onClick={handleDecision}
              isLoading={isSaving}
            >
              {decisionType === 'approve' ? 'Aprovar' : 'Rejeitar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
