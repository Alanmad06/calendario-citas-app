'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

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

export default function CalendarPage() {
  const { status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Fetch user appointments if authenticated
    if (status === 'authenticated') {
      fetchAppointments();
    }
  }, [status, router]);

  useEffect(() => {
    // Filter appointments for selected date
    if (selectedDate && appointments.length > 0) {
      const filtered = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return isSameDay(appointmentDate, selectedDate);
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments([]);
    }
  }, [selectedDate, appointments]);

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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
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

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-foreground-title">Calendario de Citas</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary hover:text-primary-600 font-medium"
          >
            Volver al Panel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Calendar appointments={appointments} onDateClick={handleDateClick} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-medium text-foreground-title mb-4">
                {selectedDate ? (
                  <span>Citas para {format(selectedDate, 'PPPP', { locale: es })}</span>
                ) : (
                  <span>Selecciona una fecha para ver las citas</span>
                )}
              </h2>

              {selectedDate && filteredAppointments.length === 0 && (
                <p className="text-foreground">No hay citas para esta fecha.</p>
              )}

              {filteredAppointments.length > 0 && (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className={`p-4 border rounded-lg ${appointment.status === 'CANCELLED' ? 'line-through text-gray-500' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-foreground-title">{appointment.service.name}</h3>
                          <p className="text-sm text-foreground">{formatDate(appointment.date)}</p>
                          <p className="text-sm text-foreground">
                            Duración: {appointment.service.duration} minutos
                          </p>
                          <p className="text-sm text-foreground">
                            Precio: ${appointment.service.price}
                          </p>
                          {appointment.stylist && (
                            <p className="text-sm text-foreground">
                              Estilista: {appointment.stylist.name}
                            </p>
                          )}
                        </div>
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
                      </div>
                      <div className="mt-2">
                        <button
                          className="text-sm text-primary hover:text-primary-600"
                          onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}