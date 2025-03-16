'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CancelAppointmentModal } from '@/components/ui/cancel-appointment-modal';
import { ConfirmAppointmentModal } from '@/components/ui/confirm-appointment-modal';

interface Appointment {
  id: string;
  date: string;
  status: string;
  service: {
    name: string;
    price: number;
    duration: number;
  };
  stylist?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    phoneNumber?: string;
  };
}

interface AppointmentsListClientProps {
  appointments: Appointment[];
  error?: string;
}

export function AppointmentsListClient({ appointments, error }: AppointmentsListClientProps) {
  const router = useRouter();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelSuccess = async () => {
    router.refresh();
  };

  const handleConfirmSuccess = async () => {
    router.refresh();
  };

  return (
    <div className=" shadow overflow-hidden sm:rounded-lg mb-8  bg-second-background">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-foreground-title">Mis Citas</h2>
        <p className="mt-1 max-w-2xl text-sm text-foreground">
          Aquí puedes ver todas tus citas programadas.
        </p>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
      </div>

      {appointments.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center bg-second-background ">
          <p className="text-foreground">No tienes citas programadas.</p>
          <Button
            onClick={() => router.push('/dashboard/book')}
            className="mt-4 bg-primary hover:bg-primary-600 text-white"
          >
            Agendar tu primera cita
          </Button>
        </div>
      ) : (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className={`py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-second-background ${appointment.status === 'CANCELLED' ? 'line-through text-gray-500' : ''}`}>
                <dt className="text-sm font-medium text-foreground">
                  {appointment.service.name}
                </dt>
                <dd className="mt-1 text-sm text-foreground-title sm:mt-0 sm:col-span-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p>{formatDate(appointment.date)}</p>
                      <p className="text-foreground">
                        Duración: {appointment.service.duration} minutos
                      </p>
                      <p className="text-foreground">
                        Precio: ${appointment.service.price}
                      </p>
                      {appointment.stylist && (
                        <p className="text-foreground">
                          Estilista: {appointment.stylist.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status === 'CONFIRMED' && 'Confirmada'}
                        {appointment.status === 'PENDING' && 'Pendiente'}
                        {appointment.status === 'CANCELLED' && 'Cancelada'}
                        {appointment.status === 'COMPLETED' && 'Completada'}
                      </span>
                      <div className="mt-2 flex space-x-2">
                        <button
                          className="text-sm text-primary hover:text-primary-600"
                          onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
                        >
                          Ver detalles
                        </button>
                        {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                          <div className="flex space-x-4">
                            {appointment.status === 'PENDING' && (
                              <button 
                                className="text-sm text-green-600 hover:text-green-800"
                                onClick={() => {
                                  setSelectedAppointmentId(appointment.id);
                                  setConfirmModalOpen(true);
                                }}
                              >
                                Confirmar
                              </button>
                            )}
                            <button 
                              className="text-sm text-red-600 hover:text-red-800"
                              onClick={() => {
                                setSelectedAppointmentId(appointment.id);
                                setCancelModalOpen(true);
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      <CancelAppointmentModal 
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        appointmentId={selectedAppointmentId}
        onSuccess={handleCancelSuccess}
      />

      {/* Confirm Appointment Modal */}
      <ConfirmAppointmentModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        appointmentId={selectedAppointmentId}
        onSuccess={handleConfirmSuccess}
      />
    </div>
  );
}