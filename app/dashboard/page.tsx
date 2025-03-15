'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { CancelAppointmentModal } from '@/components/ui/cancel-appointment-modal';
import { ConfirmAppointmentModal } from '@/components/ui/confirm-appointment-modal';
import { DashboardSkeleton } from '@/components/ui/skeletons/dashboard-skeleton';


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

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  console.log(session)
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Fetch user appointments if authenticated
    if (status === 'authenticated') {
      fetchAppointments();
      fetchServices();
    }
  }, [status, router]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      // Make a real API call to fetch appointments
      const response = await fetch('/api/appointments');
      
      if (!response.ok) {
        throw new Error('Error fetching appointments');
      }
      
      const data = await response.json();
      setAppointments(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      // Make a real API call to fetch services
      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error('Error fetching services');
      }
      
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

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

  // Show loading state for authentication status
  if (status === 'loading') {
    return <Loading size="large" text="Verificando sesión..." />
  }

  const handleCancelSuccess = async () => {
    await fetchAppointments();
  };

  const handleConfirmSuccess = async () => {
    await fetchAppointments();
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-foreground-title">Mi Panel</h1>
          <div className="flex space-x-4">
            <Button
              onClick={() => router.push('/dashboard/calendar')}
              className="bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              Ver calendario
            </Button>
            <Button
              onClick={() => router.push('/dashboard/book')}
              className="bg-primary hover:bg-primary-600 text-white"
            >
              Agendar nueva cita
            </Button>
          </div>
        </div>

        <div className=" shadow overflow-hidden sm:rounded-lg mb-8  bg-second-background">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-foreground-title">Mis Citas</h2>
            <p className="mt-1 max-w-2xl text-sm text-foreground">
              Aquí puedes ver todas tus citas programadas.
            </p>
          </div>

          {isLoading ? (
            <div className="px-4 py-5 sm:p-6 bg-second-background">
              <DashboardSkeleton />
            </div>
          ) : appointments.length === 0 ? (
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
        </div>

        <div className=" shadow overflow-hidden sm:rounded-lg bg-second-background">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-foreground-title">Servicios Disponibles</h2>
            <p className="mt-1 max-w-2xl text-sm text-foreground">
              Explora nuestros servicios y agenda una cita.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-foreground-title">{service.name}</h3>
                  <p className="text-foreground mt-1">Duración: {service.duration} minutos</p>
                  <p className="text-foreground-title font-medium mt-2">${service.price}</p>
                  <Button
                    onClick={() => router.push(`/dashboard/book?service=${service.id}`)}
                    className="mt-4 w-full bg-primary hover:bg-primary-600 text-white"
                  >
                    Reservar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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