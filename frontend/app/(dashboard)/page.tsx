"use client";

import { useEffect, useState } from "react";
import { Users, Clock, CheckCircle, CalendarDays } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { useAuth } from "@/contexts/AuthContext";
import { vacationsApi, employeesApi, balancesApi } from "@/lib/api";
import { VacationRequest, VacationStatus, Role } from "@/lib/types";

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    approvedThisMonth: 0,
    myBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vacation requests
        const vacationsResponse = await vacationsApi.list(0, 10);
        setRequests(vacationsResponse.content);

        // Count pending and approved
        const allVacations = await vacationsApi.list(0, 100);
        const pending = allVacations.content.filter(
          (v: VacationRequest) => v.status === VacationStatus.PENDING
        ).length;
        const approved = allVacations.content.filter(
          (v: VacationRequest) => v.status === VacationStatus.APPROVED
        ).length;

        // Fetch employees count
        let employeesCount = 0;
        if (hasRole([Role.ADMIN, Role.MANAGER])) {
          const employeesResponse = await employeesApi.list(0, 1);
          employeesCount = employeesResponse.totalElements;
        }

        // Fetch my balance
        let balance = 0;
        if (user?.employeeId) {
          try {
            const balanceResponse = await balancesApi.getByEmployee(user.employeeId);
            balance = balanceResponse.remainingDays;
          } catch {
            // Balance might not exist
          }
        }

        setStats({
          totalEmployees: employeesCount,
          pendingRequests: pending,
          approvedThisMonth: approved,
          myBalance: balance,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, hasRole]);

  const handleApprove = async (request: VacationRequest) => {
    try {
      await vacationsApi.approve(request.id, { comment: "Aprovado" });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id ? { ...r, status: VacationStatus.APPROVED } : r
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (request: VacationRequest) => {
    try {
      await vacationsApi.reject(request.id, { comment: "Rejeitado" });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id ? { ...r, status: VacationStatus.REJECTED } : r
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <header>
        <h1 className="text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta! Aqui está a visão geral das férias.
        </p>
      </header>

      {/* Stats Grid */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hasRole([Role.ADMIN, Role.MANAGER]) && (
            <StatCard
              title="Total de Colaboradores"
              value={stats.totalEmployees}
              description="Ativos na equipe"
              icon={Users}
              variant="primary"
            />
          )}
          <StatCard
            title="Pendentes"
            value={stats.pendingRequests}
            description="Aguardando aprovação"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Aprovadas"
            value={stats.approvedThisMonth}
            description="Este período"
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Meu Saldo"
            value={`${stats.myBalance} dias`}
            description="Disponível para uso"
            icon={CalendarDays}
            variant="default"
          />
        </div>
      </section>

      {/* Recent Requests */}
      <section>
        <RecentRequests
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </section>
    </div>
  );
}
