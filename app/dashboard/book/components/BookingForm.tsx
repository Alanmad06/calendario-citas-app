'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfDay, addHours, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export default function BookingForm() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Load services and initialize booking form
    if (status === 'authenticated') {
      loadServices();
      generateAvailableDates();
    }
  }, [status, router]);

  useEffect(() => {
    // Set selected service from URL parameter if available
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [serviceId, services]);

  useEffect(() => {
    // Generate available time slots when date is selected
    if (selectedDate) {
      generateAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      // Make a real API call to fetch services
      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error('Error loading services');
      }
      
      const data = await response.json();
      setServices(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading services:', error);
      setIsLoading(false);
    }
  };

  const generateAvailableDates = () => {
    // Generate dates for the next 14 days
    const dates = [];
    const today = startOfDay(new Date());
    
    for (let i = 1; i <= 14; i++) {
      const date = addDays(today, i);
      // Exclude Sundays (0 is Sunday in JavaScript)
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    
    setAvailableDates(dates);
  };

  const generateAvailableTimes = (date: Date) => {
    // Generate time slots from 9 AM to 6 PM
    const times = [];
    const startTime = addHours(startOfDay(date), 9); // 9 AM
    const endTime = addHours(startOfDay(date), 18); // 6 PM
    const now = new Date();
    
    // Time slots every 30 minutes
    for (let time = startTime; time < endTime; time = addHours(time, 0.5)) {
      // Skip times in the past for today
      if (isBefore(time, now) && date.getDate() === now.getDate()) {
        continue;
      }
      times.push(format(time, 'HH:mm'));
    }
    
    setAvailableTimes(times);
    setSelectedTime(null); // Reset selected time when date changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Por favor selecciona un servicio, fecha y hora');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare appointment data
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      appointmentDate.setHours(hours, minutes);
      
      // Make a real API call to create the appointment
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: appointmentDate.toISOString(),
          notes: '',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la cita');
      }
      
      // Redirect to dashboard with success message
      router.push('/dashboard?booking=success');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Ocurrió un error al agendar la cita. Por favor intenta de nuevo.');
      setIsSubmitting(false);
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground-title">Agendar una cita</h1>
          <p className="mt-2 text-foreground">
            Selecciona el servicio, fecha y hora para tu cita.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Service Selection */}
            <div>
              <h2 className="text-lg font-medium text-foreground-title mb-4">1. Selecciona un servicio</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedService?.id === service.id ? 'border-primary-500 ring-2 ring-primary-200' : 'hover:border-gray-300'}`}
                    onClick={() => setSelectedService(service)}
                  >
                    <h3 className="font-medium text-foreground-title">{service.name}</h3>
                    <p className="text-foreground mt-1">Duración: {service.duration} minutos</p>
                    <p className="text-foreground-title font-medium mt-2">${service.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <h2 className="text-lg font-medium text-foreground-title mb-4">2. Selecciona una fecha</h2>
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

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <h2 className="text-lg font-medium text-foreground-title mb-4">3. Selecciona una hora</h2>
                {availableTimes.length > 0 ? (
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
            )}

            {/* Summary and Submit */}
            {selectedService && selectedDate && selectedTime && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-foreground-title mb-2">Resumen de tu cita</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Servicio:</span> {selectedService.name}</p>
                  <p><span className="font-medium">Fecha:</span> {format(selectedDate, 'PPPP', { locale: es })}</p>
                  <p><span className="font-medium">Hora:</span> {selectedTime}</p>
                  <p><span className="font-medium">Duración:</span> {selectedService.duration} minutos</p>
                  <p><span className="font-medium">Precio:</span> ${selectedService.price}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!selectedService || !selectedDate || !selectedTime || isSubmitting}
                className="bg-primary hover:bg-primary-600 text-white"
              >
                {isSubmitting ? 'Agendando...' : 'Confirmar cita'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}