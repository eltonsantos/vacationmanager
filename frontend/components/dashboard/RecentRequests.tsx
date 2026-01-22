"use client";

import { Eye, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VacationRequest, VacationStatus, Role } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

interface RecentRequestsProps {
  requests: VacationRequest[];
  onView?: (request: VacationRequest) => void;
  onApprove?: (request: VacationRequest) => void;
  onReject?: (request: VacationRequest) => void;
}

export function RecentRequests({ requests, onView, onApprove, onReject }: RecentRequestsProps) {
  const { hasRole } = useAuth();
  const canManage = hasRole([Role.ADMIN, Role.MANAGER]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatusBadge = (status: VacationStatus) => {
    const variants: Record<VacationStatus, { variant: "default" | "success" | "warning" | "destructive"; label: string }> = {
      [VacationStatus.PENDING]: { variant: "warning", label: "Pendente" },
      [VacationStatus.APPROVED]: { variant: "success", label: "Aprovado" },
      [VacationStatus.REJECTED]: { variant: "destructive", label: "Rejeitado" },
      [VacationStatus.CANCELLED]: { variant: "default", label: "Cancelado" },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (requests.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Solicitações Recentes</h3>
        <p className="text-sm text-muted-foreground">Acompanhe as últimas solicitações de férias</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Colaborador
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Período
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Dias
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{request.employeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      Solicitado em {formatDate(request.requestedAt)}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-foreground">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-foreground">
                    {calculateDays(request.startDate, request.endDate)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView?.(request)}
                      aria-label="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {request.status === VacationStatus.PENDING && canManage && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onApprove?.(request)}
                          className="text-success hover:text-success hover:bg-success/10"
                          aria-label="Aprovar"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onReject?.(request)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label="Rejeitar"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
