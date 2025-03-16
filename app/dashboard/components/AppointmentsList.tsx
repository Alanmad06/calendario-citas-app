'use server';

import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { AppointmentsListClient } from './AppointmentsListClient';

// Helper function to transform Prisma Appointment to our interface


export async function AppointmentsList() {
  try {
    // Get the authenticated user session
    const session = await getAuthSession();

    // Check if user is authenticated
    if (!session?.user) {
      return null;
    }

    // Get user ID from session
    const userId = session.user.id;

    // Fetch appointments for the user
    const prismaAppointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
      },
      include: {
        service: true,
        stylist: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
    
    // Transform the Prisma appointments to match our interface
    const appointments = prismaAppointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date.toISOString(),
      status: appointment.status,
      service: {
        name: appointment.service.name,
        price: Number(appointment.service.price.toString()),
        duration: appointment.service.duration,
      },
      stylist: appointment.stylist ? {
        id: appointment.stylist.id,
        name: appointment.stylist.name || '',
        email: appointment.stylist.email,
        image: appointment.stylist.image || undefined,
        phoneNumber: appointment.stylist.phoneNumber || undefined,
      } : undefined,
    }));

    return <AppointmentsListClient appointments={appointments} />;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    // Return an empty list with an error message that will be handled by the client
    return <AppointmentsListClient appointments={[]} error="Error loading appointments" />;
  }
}