'use client';

import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { ServiceSelection } from './ServiceSelection';
import { StylistSelection } from './StylistSelection';
import { DateSelection } from './DateSelection';
import { TimeSelection } from './TimeSelection';
import { BookingSummary } from './BookingSummary';
import { useBookingForm } from '../hooks/useBookingForm';

export default function BookingForm() {
  const {
    status,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedStylist,
    setSelectedStylist,
    availableDates,
    availableTimes,
    services,
    stylists,
    isLoading,
    isSubmitting,
    handleSubmit,
    router
  } = useBookingForm();

  // Show loading state for authentication status
  if (status === 'loading') {
    return <Loading size="large" text="Verificando sesión..." />
  }
  
  // Render the form with loading indicators for specific sections
  // instead of blocking the entire screen

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
            <ServiceSelection 
              services={services}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              isLoading={isLoading}
            />

            {/* Stylist Selection */}
            <StylistSelection 
              stylists={stylists}
              selectedStylist={selectedStylist}
              setSelectedStylist={setSelectedStylist}
            />

            {/* Date Selection */}
            <DateSelection 
              availableDates={availableDates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {/* Time Selection */}
            {selectedDate && (
              <TimeSelection 
                availableTimes={availableTimes}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                isLoading={isLoading}
              />
            )}

            {/* Summary and Submit */}
            {selectedService && selectedStylist && selectedDate && selectedTime && (
              <BookingSummary 
                selectedService={selectedService}
                selectedStylist={selectedStylist}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />
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
                disabled={!selectedService || !selectedStylist || !selectedDate || !selectedTime || isSubmitting}
                className="bg-primary hover:bg-primary-600 text-white flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-1 border-b-1 border-white"></div>
                )}
                {isSubmitting ? 'Agendando...' : 'Confirmar cita'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}