'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { vacationsApi, employeesApi, balancesApi } from '@/lib/api';
import { VacationRequest, VacationStatus, Role } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { Users, Palmtree, Calendar, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalEmployees: number;
  pendingVacations: number;
  approvedVacations: number;
  myBalance: number;
}

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    pendingVacations: 0,
    approvedVacations: 0,
    myBalance: 22,
  });
  const [recentVacations, setRecentVacations] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vacationsRes, employeesRes, balancesRes] = await Promise.all([
          vacationsApi.list(0, 5),
          hasRole([Role.ADMIN, Role.MANAGER]) ? employeesApi.list(0, 1) : Promise.resolve(null),
          balancesApi.list(new Date().getFullYear(), 0, 100),
        ]);

        setRecentVacations(vacationsRes.content);

        const pending = vacationsRes.content.filter(
          (v) => v.status === VacationStatus.PENDING
        ).length;
        const approved = vacationsRes.content.filter(
          (v) => v.status === VacationStatus.APPROVED
        ).length;

        const myBalance = balancesRes.content[0]?.remainingDays || 22;

        setStats({
          totalEmployees: employeesRes?.totalElements || 0,
          pendingVacations: pending,
          approvedVacations: approved,
          myBalance,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [hasRole]);

  const statCards = [
    {
      title: 'Colaboradores',
      value: stats.totalEmployees,
      icon: <Users size={24} className="text-[var(--lbc-primary)]" />,
      href: '/employees',
      show: hasRole([Role.ADMIN, Role.MANAGER]),
    },
    {
      title: 'Férias Pendentes',
      value: stats.pendingVacations,
      icon: <Clock size={24} className="text-[var(--status-pending)]" />,
      href: '/vacations',
      show: true,
    },
    {
      title: 'Férias Aprovadas',
      value: stats.approvedVacations,
      icon: <CheckCircle size={24} className="text-[var(--status-approved)]" />,
      href: '/vacations',
      show: true,
    },
    {
      title: 'Meu Saldo (dias)',
      value: stats.myBalance,
      icon: <Palmtree size={24} className="text-[var(--lbc-accent)]" />,
      href: '/vacations',
      show: hasRole(Role.COLLABORATOR),
    },
  ].filter((card) => card.show);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--lbc-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--lbc-text)]">
          Bem-vindo, {user?.email.split('@')[0]}!
        </h1>
        <p className="text-[var(--lbc-muted)]">
          Aqui está o resumo do sistema de gestão de férias.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)] p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--lbc-muted)]">{card.title}</p>
                <p className="text-3xl font-bold text-[var(--lbc-text)] mt-1">
                  {card.value}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[var(--lbc-bg-secondary)] flex items-center justify-center">
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent vacations */}
      <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)]">
        <div className="flex items-center justify-between p-6 border-b border-[var(--lbc-border)]">
          <h2 className="text-lg font-semibold text-[var(--lbc-text)]">
            Pedidos de Férias Recentes
          </h2>
          <Link
            href="/vacations"
            className="text-sm text-[var(--lbc-primary)] hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {recentVacations.length === 0 ? (
          <div className="p-6 text-center text-[var(--lbc-muted)]">
            Nenhum pedido de férias encontrado.
          </div>
        ) : (
          <div className="divide-y divide-[var(--lbc-border)]">
            {recentVacations.map((vacation) => (
              <div
                key={vacation.id}
                className="p-4 flex items-center justify-between hover:bg-[var(--lbc-card-hover)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--lbc-bg-secondary)] flex items-center justify-center">
                    <Calendar size={20} className="text-[var(--lbc-muted)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--lbc-text)]">
                      {vacation.employeeName}
                    </p>
                    <p className="text-sm text-[var(--lbc-muted)]">
                      {new Date(vacation.startDate).toLocaleDateString('pt-PT')} -{' '}
                      {new Date(vacation.endDate).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
                <StatusBadge status={vacation.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/vacations"
          className="bg-[var(--lbc-primary)] text-white rounded-xl p-6 hover:bg-[var(--lbc-primary-hover)] transition-colors"
        >
          <Palmtree size={32} className="mb-4" />
          <h3 className="text-lg font-semibold">Gerir Férias</h3>
          <p className="text-sm opacity-90 mt-1">
            Criar, visualizar e gerir pedidos de férias
          </p>
        </Link>

        <Link
          href="/calendar"
          className="bg-[var(--lbc-secondary)] text-white rounded-xl p-6 hover:bg-[var(--lbc-secondary-hover)] transition-colors"
        >
          <Calendar size={32} className="mb-4" />
          <h3 className="text-lg font-semibold">Calendário</h3>
          <p className="text-sm opacity-90 mt-1">
            Visualizar férias no calendário
          </p>
        </Link>
      </div>
    </div>
  );
}
