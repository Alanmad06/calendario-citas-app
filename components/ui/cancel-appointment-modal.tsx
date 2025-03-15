'use client';

import { useState } from 'react';
import { Modal } from './modal';
import { Button } from './button';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onSuccess: () => void;
}

export function CancelAppointmentModal({
  isOpen,
  onClose,
  appointmentId,
  onSuccess,
}: CancelAppointmentModalProps) {
  const [reason, setReason] = useState('');
  const [wantToReschedule, setWantToReschedule] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}?id=${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CANCELLED',
          notes: reason ? `Cancelada: ${reason}` : 'Cancelada por el usuario',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la cita');
      }

      onSuccess();
      onClose();
      
      // Redirect to booking page if user wants to reschedule
      if (wantToReschedule) {
        window.location.href = '/dashboard/book';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al cancelar la cita');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancelar Cita">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-foreground-title mb-1">
            Motivo de cancelación (opcional)
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="¿Por qué deseas cancelar esta cita?"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="reschedule"
            checked={wantToReschedule}
            onChange={(e) => setWantToReschedule(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="reschedule" className="ml-2 block text-sm text-foreground">
            Quiero reagendar esta cita
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar cancelación'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}