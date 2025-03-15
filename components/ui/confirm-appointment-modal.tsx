'use client';

import { useState } from 'react';
import { Modal } from './modal';
import { Button } from './button';

interface ConfirmAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onSuccess: () => void;
}

export function ConfirmAppointmentModal({
  isOpen,
  onClose,
  appointmentId,
  onSuccess,
}: ConfirmAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

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
          status: 'CONFIRMED',
          notes: notes ? `Confirmada: ${notes}` : 'Confirmada por el usuario',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al confirmar la cita');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al confirmar la cita');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Cita">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-foreground-title mb-1">
            Notas adicionales (opcional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="¿Alguna nota adicional para esta cita?"
          />
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
            variant="default"
            className="bg-primary text-white hover:bg-primary-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirmando...
              </>
            ) : (
              'Confirmar Cita'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}