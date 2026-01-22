'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { employeesApi } from '@/lib/api';
import { Employee, EmployeeRequest, Role, ApiError } from '@/lib/types';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

export default function EmployeesPage() {
  const { hasRole } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeRequest>({
    fullName: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = hasRole(Role.ADMIN);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await employeesApi.list(page, 10);
      setEmployees(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        fullName: employee.fullName,
        email: employee.email,
        managerId: employee.managerId || undefined,
        userId: employee.userId || undefined,
      });
    } else {
      setEditingEmployee(null);
      setFormData({ fullName: '', email: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({ fullName: '', email: '' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      if (editingEmployee) {
        await employeesApi.update(editingEmployee.id, formData);
      } else {
        await employeesApi.create(formData);
      }
      handleCloseModal();
      fetchEmployees();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Erro ao guardar colaborador');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (!confirm(`Tem certeza que deseja remover ${employee.fullName}?`)) {
      return;
    }

    try {
      await employeesApi.delete(employee.id);
      fetchEmployees();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message || 'Erro ao remover colaborador');
    }
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Nome',
      render: (employee: Employee) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--lbc-primary)] flex items-center justify-center text-white text-sm font-medium">
            {employee.fullName.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{employee.fullName}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'managerEmail',
      header: 'Gestor',
      render: (employee: Employee) => employee.managerEmail || '-',
    },
    {
      key: 'active',
      header: 'Estado',
      render: (employee: Employee) => (
        <div className="flex items-center gap-1">
          {employee.active ? (
            <>
              <UserCheck size={16} className="text-[var(--status-approved)]" />
              <span className="text-[var(--status-approved)]">Ativo</span>
            </>
          ) : (
            <>
              <UserX size={16} className="text-[var(--status-rejected)]" />
              <span className="text-[var(--status-rejected)]">Inativo</span>
            </>
          )}
        </div>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Ações',
            render: (employee: Employee) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(employee)}
                  className="p-1.5 rounded hover:bg-[var(--lbc-bg-secondary)]"
                  title="Editar"
                >
                  <Edit size={16} className="text-[var(--lbc-muted)]" />
                </button>
                <button
                  onClick={() => handleDelete(employee)}
                  className="p-1.5 rounded hover:bg-[var(--lbc-bg-secondary)]"
                  title="Remover"
                >
                  <Trash2 size={16} className="text-[var(--status-rejected)]" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--lbc-text)]">
            Colaboradores
          </h1>
          <p className="text-[var(--lbc-muted)]">
            Gestão de colaboradores da organização
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={18} />}>
            Novo Colaborador
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)]">
        <Table
          columns={columns}
          data={employees}
          keyExtractor={(employee) => employee.id}
          isLoading={isLoading}
          emptyMessage="Nenhum colaborador encontrado."
          pagination={{
            page,
            totalPages,
            onPageChange: setPage,
          }}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEmployee ? 'Editar Colaborador' : 'Novo Colaborador'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          {error && (
            <div className="p-3 rounded-lg bg-[var(--status-rejected-bg)] text-[var(--status-rejected)] text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingEmployee ? 'Guardar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
