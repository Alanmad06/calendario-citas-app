import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { addMinutes, format, parseISO } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getAuthSession();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = request.nextUrl;
    const stylistId = searchParams.get('stylistId');
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    // Validate required parameters
    if (!stylistId || !date || !serviceId) {
      return NextResponse.json(
        { error: 'Missing required parameters: stylistId, date, and serviceId are required' },
        { status: 400 }
      );
    }

    // Parse the date
    const selectedDate = parseISO(date);
    
    // Get the service to determine duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Get all appointments for the stylist on the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const stylistAppointments = await prisma.appointment.findMany({
      where: {
        stylistId: stylistId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          notIn: ['CANCELLED'],
        },
      },
      include: {
        service: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Generate all possible time slots for the day (9 AM to 6 PM, every 30 minutes)
const allTimeSlots: string[] = [];
    const startTime = new Date(selectedDate);
    startTime.setHours(9, 0, 0, 0); // 9 AM
    
    const endTime = new Date(selectedDate);
    endTime.setHours(18, 0, 0, 0); // 6 PM

    // Generate time slots every 30 minutes
    for (let time = new Date(startTime); time < endTime; time = addMinutes(time, 30)) {
      allTimeSlots.push(format(time, 'HH:mm'));
    }

    // Mark time slots as unavailable if they overlap with existing appointments
    const unavailableTimeSlots = new Set<string>();

    stylistAppointments.forEach(appointment => {
      const appointmentStart = new Date(appointment.date);
      const appointmentEnd = addMinutes(appointmentStart, appointment.service.duration);
      
      // Mark all time slots that overlap with this appointment as unavailable
      allTimeSlots.forEach(timeSlot => {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hours, minutes, 0, 0);
        
        // Calculate when this time slot would end based on the requested service duration
        const slotEndTime = addMinutes(slotTime, service.duration);
        
        // Check if this time slot overlaps with the appointment
        const overlapsStart = slotTime < appointmentEnd && appointmentStart < slotEndTime;
        
        // If there's an overlap, mark the time slot as unavailable
        if (overlapsStart) {
          unavailableTimeSlots.add(timeSlot);
        }
      });
    });

    // Filter out unavailable time slots
    const availableTimeSlots = allTimeSlots.filter(timeSlot => !unavailableTimeSlots.has(timeSlot));

    return NextResponse.json({
      availableTimeSlots,
      unavailableTimeSlots: Array.from(unavailableTimeSlots),
    });
  } catch (error) {
    console.error('Error checking appointment availability:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}