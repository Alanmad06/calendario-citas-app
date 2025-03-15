/**
 * Service for appointment-related API calls
 */

/**
 * Fetches available time slots for a specific date, stylist and service
 */
export async function fetchAvailableTimes(date: Date, stylistId: string, serviceId: string) {
  try {
    // Format date as ISO string for the API
    const formattedDate = date.toISOString().split('T')[0];
    
    // Call the availability API
    const response = await fetch(
      `/api/appointments/availability?stylistId=${stylistId}&date=${formattedDate}&serviceId=${serviceId}`
    );
    
    if (!response.ok) {
      throw new Error('Error fetching available times');
    }
    
    const data = await response.json();
    return data.availableTimeSlots;
  } catch (error) {
    console.error('Error fetching available times:', error);
    throw error;
  }
}

/**
 * Creates a new appointment
 */
export async function createAppointment(appointmentData: {
  serviceId: string;
  stylistId: string;
  date: string;
  notes: string;
}) {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    
    // Handle conflict (time slot no longer available)
    if (response.status === 409) {
      throw new Error(errorData.error || 'Este horario ya no está disponible. Por favor selecciona otro.');
    } else {
      throw new Error(errorData.error || 'Error al crear la cita');
    }
  }

  return await response.json();
}