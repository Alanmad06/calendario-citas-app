'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateSelectionProps {
  availableDates: Date[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}

export function DateSelection({
  availableDates,
  selectedDate,
  setSelectedDate,
}: DateSelectionProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-foreground-title mb-4">3. Selecciona una fecha</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {availableDates.map((date) => (
          <div
            key={date.toISOString()}
            className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${selectedDate?.toDateString() === date.toDateString() ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50' : 'hover:border-gray-300'}`}
            onClick={() => setSelectedDate(date)}
          >
            <p className="text-sm font-medium">
              {format(date, 'EEEE', { locale: es })}
            </p>
            <p className="text-lg font-bold mt-1">
              {format(date, 'd', { locale: es })}
            </p>
            <p className="text-xs text-foreground">
              {format(date, 'MMMM', { locale: es })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}