'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Role, User } from '@/lib/types';
import { usersApi, CreateUserRequest, UpdateUserRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { 
  UserCog, Plus, Pencil, Trash2, X, Loader2, 
  Shield, Users, User as UserIcon, Eye, EyeOff 
} from 'lucide-react';

interface UserFormData {
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'COLLABORATOR';
  fullName: string;
}

const initialFormData: UserFormData = {
  email: '',
  password: '',
  role: 'COLLABORATOR',
  fullName: '',
};

export default function UsersPage() {
  const { hasRole, user: currentUser } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersApi.list(0, 100);
      setUsers(response.content);
    } catch {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasRole(Role.ADMIN)) {
      router.push('/');
      return;
    }
    loadUsers();
  }, [hasRole, router, loadUsers]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(initialFormData);
    setShowModal(true);
    setError('');
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
      fullName: '',
    });
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData(initialFormData);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        const updateData: UpdateUserRequest = {
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await usersApi.update(editingUser.id, updateData);
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        const createData: CreateUserRequest = {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          fullName: formData.fullName || undefined,
        };
        await usersApi.create(createData);
        setSuccess('Usuário criado com sucesso!');
      }
      closeModal();
      loadUsers();
    } catch {
      setError(editingUser ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.delete(id);
      setSuccess('Usuário removido com sucesso!');
      setDeletingId(null);
      loadUsers();
    } catch {
      setError('Erro ao remover usuário');
    }
  };

  const getRoleBadge = (role: Role) => {
    const styles: Record<Role, { bg: string; text: string; icon: React.ReactNode }> = {
      [Role.ADMIN]: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-600 dark:text-red-400',
        icon: <Shield className="h-3 w-3" />
      },
      [Role.MANAGER]: { 
        bg: 'bg-blue-100 dark:bg-blue-900/30', 
        text: 'text-blue-600 dark:text-blue-400',
        icon: <Users className="h-3 w-3" />
      },
      [Role.COLLABORATOR]: { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-600 dark:text-green-400',
        icon: <UserIcon className="h-3 w-3" />
      },
    };
    const style = styles[role];
    const labels: Record<Role, string> = {
      [Role.ADMIN]: 'Admin',
      [Role.MANAGER]: 'Manager',
      [Role.COLLABORATOR]: 'Collaborator',
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.icon}
        {labels[role]}
      </span>
    );
  };

  if (!hasRole(Role.ADMIN)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center">
            <UserCog size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gestão de Usuários
            </h1>
            <p className="text-muted-foreground">
              Criar e gerenciar contas de acesso ao sistema
            </p>
          </div>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Messages */}
      {success && (
        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--muted))]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[hsl(var(--muted))]/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white text-sm font-medium">
                          {user.email.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(user)}
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {user.id !== currentUser?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingId(user.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            aria-label="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingUser && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nome Completo
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nome do colaborador"
                  />
                  <p className="text-xs text-muted-foreground">
                    Opcional. Se preenchido, cria um colaborador associado.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Senha {editingUser ? '(deixe vazio para manter)' : '*'}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? '••••••••' : 'Mínimo 8 caracteres'}
                    required={!editingUser}
                    minLength={editingUser ? 0 : 8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Role *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ADMIN', 'MANAGER', 'COLLABORATOR'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.role === role
                          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10'
                          : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50'
                      }`}
                    >
                      <div className="text-center">
                        {role === 'ADMIN' && <Shield className="h-5 w-5 mx-auto mb-1 text-red-500" />}
                        {role === 'MANAGER' && <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />}
                        {role === 'COLLABORATOR' && <UserIcon className="h-5 w-5 mx-auto mb-1 text-green-500" />}
                        <span className="text-xs font-medium text-foreground">
                          {role === 'ADMIN' ? 'Admin' : role === 'MANAGER' ? 'Manager' : 'Collaborator'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : editingUser ? (
                    'Atualizar'
                  ) : (
                    'Criar'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] w-full max-w-sm mx-4 p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Confirmar exclusão
            </h2>
            <p className="text-muted-foreground mb-6">
              Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeletingId(null)} className="flex-1">
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(deletingId)} 
                className="flex-1"
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
