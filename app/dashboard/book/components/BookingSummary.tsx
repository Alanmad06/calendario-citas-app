'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Service } from '@/lib/services/serviceService';
import { Stylist } from '@/lib/services/stylistService';

interface BookingSummaryProps {
  selectedService: Service;
  selectedStylist: Stylist;
  selectedDate: Date;
  selectedTime: string;
}

export function BookingSummary({
  selectedService,
  selectedStylist,
  selectedDate,
  selectedTime,
}: BookingSummaryProps) {
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-medium text-foreground-title mb-2">Resumen de tu cita</h2>
      <div className="space-y-2">
        <p><span className="font-medium">Servicio:</span> {selectedService.name}</p>
        <p><span className="font-medium">Estilista:</span> {selectedStylist.name}</p>
        <p><span className="font-medium">Fecha:</span> {format(selectedDate, 'PPPP', { locale: es })}</p>
        <p><span className="font-medium">Hora:</span> {selectedTime}</p>
        <p><span className="font-medium">Duración:</span> {selectedService.duration} minutos</p>
        <p><span className="font-medium">Precio:</span> ${selectedService.price}</p>
      </div>
    </div>
  );
}