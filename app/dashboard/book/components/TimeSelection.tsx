'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface TimeSelectionProps {
  availableTimes: string[];
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  isLoading: boolean;
}

export function TimeSelection({
  availableTimes,
  selectedTime,
  setSelectedTime,
  isLoading,
}: TimeSelectionProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-foreground-title mb-4">4. Selecciona una hora</h2>
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {Array(18).fill(0).map((_, index) => (
              <Skeleton key={index} variant="rectangular" width="100%" height={41.5} className="rounded-md" animation="wave" />
            ))}
          </div>
        </div>
      ) : availableTimes.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {availableTimes.map((time) => (
            <div
              key={time}
              className={`border rounded-lg p-2 text-center cursor-pointer transition-all ${selectedTime === time ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50' : 'hover:border-gray-300'}`}
              onClick={() => setSelectedTime(time)}
            >
              <p className="font-medium">{time}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-foreground">No hay horarios disponibles para esta fecha.</p>
      )}
    </div>
  );
}