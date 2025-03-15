'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Service, fetchServices } from '@/lib/services/serviceService';
import { Stylist, fetchStylists } from '@/lib/services/stylistService';
import { generateAvailableDates, generateBasicTimeSlots } from '@/lib/services/dateService';
import { fetchAvailableTimes, createAppointment } from '@/lib/services/appointmentService';

export function useBookingForm() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
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
      loadStylists();
      setAvailableDates(generateAvailableDates());
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
    // Generate available time slots when date and stylist are selected
    if (selectedDate && selectedStylist && selectedService) {
      loadAvailableTimes(selectedDate, selectedStylist.id, selectedService.id);
    } else if (selectedDate) {
      // Fallback to basic time slots if stylist or service not selected
      setAvailableTimes(generateBasicTimeSlots(selectedDate));
    }
  }, [selectedDate, selectedStylist, selectedService]);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const data = await fetchServices();
      setServices(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading services:', error);
      setIsLoading(false);
    }
  };

  const loadStylists = async () => {
    try {
      const data = await fetchStylists();
      setStylists(data);
    } catch (error) {
      console.error('Error loading stylists:', error);
    }
  };

  const loadAvailableTimes = async (date: Date, stylistId: string, serviceId: string) => {
    try {
      setIsLoading(true);
      const times = await fetchAvailableTimes(date, stylistId, serviceId);
      setAvailableTimes(times);
      setSelectedTime(null); // Reset selected time when parameters change
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching available times:', error);
      // Fallback to basic time slots generation if API fails
      setAvailableTimes(generateBasicTimeSlots(date));
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime || !selectedStylist) {
      alert('Por favor selecciona un servicio, estilista, fecha y hora');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare appointment data
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      appointmentDate.setHours(hours, minutes);
      
      // Create the appointment
      await createAppointment({
        serviceId: selectedService.id,
        stylistId: selectedStylist.id,
        date: appointmentDate.toISOString(),
        notes: '',
      });
      
      // Redirect to dashboard with success message
      router.push('/dashboard?booking=success');
    } catch (error: Error | unknown) {
      console.error('Error booking appointment:', error);
      
      // Handle conflict (time slot no longer available)
      if (error instanceof Error && error.message.includes('Este horario ya no está disponible')) {
        // Refresh available times
        await loadAvailableTimes(selectedDate, selectedStylist.id, selectedService.id);
      }
      
      alert(error instanceof Error ? error.message : 'Ocurrió un error al agendar la cita. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}