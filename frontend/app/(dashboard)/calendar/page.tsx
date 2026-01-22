'use client';

import { useEffect, useState } from 'react';
import { vacationsApi } from '@/lib/api';
import { VacationRequest, VacationStatus } from '@/lib/types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  vacations: VacationRequest[];
}

const statusColors: Record<VacationStatus, string> = {
  [VacationStatus.PENDING]: 'bg-[var(--status-pending)]',
  [VacationStatus.APPROVED]: 'bg-[var(--status-approved)]',
  [VacationStatus.REJECTED]: 'bg-[var(--status-rejected)]',
  [VacationStatus.CANCELLED]: 'bg-[var(--status-cancelled)]',
};

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [vacations, setVacations] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null);

  const fetchVacations = async () => {
    setIsLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      const data = await vacationsApi.getForCalendar(startDate, endDate);
      setVacations(data);
    } catch (error) {
      console.error('Error fetching vacations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVacations();
  }, [currentDate]);

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: CalendarDay[] = [];

    // Previous month days
    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        vacations: getVacationsForDate(date),
      });
    }

    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        vacations: getVacationsForDate(date),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        vacations: getVacationsForDate(date),
      });
    }

    return days;
  };

  const getVacationsForDate = (date: Date): VacationRequest[] => {
    return vacations.filter((vacation) => {
      const start = new Date(vacation.startDate);
      const end = new Date(vacation.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--lbc-text)]">
            Calendário de Férias
          </h1>
          <p className="text-[var(--lbc-muted)]">
            Visualização mensal das férias aprovadas
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-[var(--lbc-card)] rounded-xl border border-[var(--lbc-border)]">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--lbc-border)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-[var(--lbc-bg-secondary)]"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-[var(--lbc-bg-secondary)]"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <h2 className="text-lg font-semibold text-[var(--lbc-text)]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoje
          </Button>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-8 h-8 border-4 border-[var(--lbc-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Week days header */}
            <div className="grid grid-cols-7 border-b border-[var(--lbc-border)]">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-[var(--lbc-muted)]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    min-h-24 p-2 border-b border-r border-[var(--lbc-border)]
                    ${!day.isCurrentMonth ? 'bg-[var(--lbc-bg-secondary)]' : ''}
                    ${day.isToday ? 'bg-[var(--lbc-primary)]/5' : ''}
                  `}
                >
                  <div
                    className={`
                      text-sm mb-1
                      ${day.isToday ? 'font-bold text-[var(--lbc-primary)]' : ''}
                      ${!day.isCurrentMonth ? 'text-[var(--lbc-muted)]' : 'text-[var(--lbc-text)]'}
                    `}
                  >
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {day.vacations.slice(0, 2).map((vacation) => (
                      <button
                        key={vacation.id}
                        onClick={() => setSelectedVacation(vacation)}
                        className={`
                          w-full text-left px-1.5 py-0.5 rounded text-xs text-white truncate
                          ${statusColors[vacation.status]}
                          hover:opacity-80 transition-opacity
                        `}
                      >
                        {vacation.employeeName}
                      </button>
                    ))}
                    {day.vacations.length > 2 && (
                      <div className="text-xs text-[var(--lbc-muted)] px-1">
                        +{day.vacations.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${statusColors[VacationStatus.APPROVED]}`} />
          <span className="text-sm text-[var(--lbc-muted)]">Aprovado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${statusColors[VacationStatus.PENDING]}`} />
          <span className="text-sm text-[var(--lbc-muted)]">Pendente</span>
        </div>
      </div>

      {/* Selected vacation details */}
      {selectedVacation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--lbc-card)] rounded-xl shadow-xl max-w-md w-full p-6 animate-slideIn">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--lbc-primary)] flex items-center justify-center">
                  <CalendarIcon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--lbc-text)]">
                    {selectedVacation.employeeName}
                  </h3>
                  <p className="text-sm text-[var(--lbc-muted)]">
                    {selectedVacation.employeeEmail}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVacation(null)}
                className="p-1 rounded hover:bg-[var(--lbc-bg-secondary)]"
              >
                <span className="sr-only">Fechar</span>
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--lbc-muted)]">Período</p>
                <p className="text-[var(--lbc-text)]">
                  {new Date(selectedVacation.startDate).toLocaleDateString('pt-PT')} -{' '}
                  {new Date(selectedVacation.endDate).toLocaleDateString('pt-PT')}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--lbc-muted)]">Duração</p>
                <p className="text-[var(--lbc-text)]">{selectedVacation.daysCount} dias</p>
              </div>
              {selectedVacation.reason && (
                <div>
                  <p className="text-sm text-[var(--lbc-muted)]">Motivo</p>
                  <p className="text-[var(--lbc-text)]">{selectedVacation.reason}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedVacation(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
