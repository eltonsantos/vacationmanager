import { VacationStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: VacationStatus;
}

const statusConfig: Record<VacationStatus, { label: string; className: string }> = {
  [VacationStatus.PENDING]: {
    label: 'Pendente',
    className: 'bg-[var(--status-pending-bg)] text-[var(--status-pending)]',
  },
  [VacationStatus.APPROVED]: {
    label: 'Aprovado',
    className: 'bg-[var(--status-approved-bg)] text-[var(--status-approved)]',
  },
  [VacationStatus.REJECTED]: {
    label: 'Rejeitado',
    className: 'bg-[var(--status-rejected-bg)] text-[var(--status-rejected)]',
  },
  [VacationStatus.CANCELLED]: {
    label: 'Cancelado',
    className: 'bg-[var(--status-cancelled-bg)] text-[var(--status-cancelled)]',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 
        rounded-full text-xs font-medium
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}
