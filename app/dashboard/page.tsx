'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';


interface Appointment {
  id: string;
  date: string;
  status: string;
  service: {
    name: string;
    price: number;
    duration: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  console.log(session)
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      // This would be replaced with an actual API call
      // const response = await fetch('/api/appointments');
      // const data = await response.json();
      // setAppointments(data);
      
      // For now, using mock data
      setTimeout(() => {
        setAppointments([
          {
            id: '1',
            date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
            status: 'CONFIRMED',
            service: {
              name: 'Corte de cabello',
              price: 25.00,
              duration: 30,
            },
          },
          {
            id: '2',
            date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
            status: 'PENDING',
            service: {
              name: 'Tinte de cabello',
              price: 45.00,
              duration: 60,
            },
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-foreground-title">Mi Panel</h1>
          <Button
            onClick={() => router.push('/dashboard/book')}
            className="bg-primary hover:bg-primary-600 text-white"
          >
            Agendar nueva cita
          </Button>
        </div>

        <div className=" shadow overflow-hidden sm:rounded-lg mb-8  bg-second-background">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-foreground-title">Mis Citas</h2>
            <p className="mt-1 max-w-2xl text-sm text-foreground">
              Aquí puedes ver todas tus citas programadas.
            </p>
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
                  <div key={appointment.id} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-second-background">
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
                            Precio: ${appointment.service.price.toFixed(2)}
                          </p>
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
                              <button className="text-sm text-red-600 hover:text-red-800">
                                Cancelar
                              </button>
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
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-foreground-title">Corte de cabello</h3>
                <p className="text-foreground mt-1">Duración: 30 minutos</p>
                <p className="text-foreground-title font-medium mt-2">$25.00</p>
                <Button
                  onClick={() => router.push('/dashboard/book?service=1')}
                  className="mt-4 w-full bg-primary hover:bg-primary-600 text-white"
                >
                  Reservar
                </Button>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-foreground-title">Tinte de cabello</h3>
                <p className="text-foreground mt-1">Duración: 60 minutos</p>
                <p className="text-foreground-title font-medium mt-2">$45.00</p>
                <Button
                  onClick={() => router.push('/dashboard/book?service=2')}
                  className="mt-4 w-full bg-primary hover:bg-primary-600 text-white"
                >
                  Reservar
                </Button>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-foreground-title">Peinado</h3>
                <p className="text-foreground mt-1">Duración: 45 minutos</p>
                <p className="text-foreground-title font-medium mt-2">$35.00</p>
                <Button
                  onClick={() => router.push('/dashboard/book?service=3')}
                  className="mt-4 w-full bg-primary hover:bg-primary-600 text-white"
                >
                  Reservar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}