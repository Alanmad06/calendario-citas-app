import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get the authenticated user session
    const session = await getAuthSession();
    console.log(session)

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;

    // Fetch appointments for the user
    const appointments = await prisma.appointment.findMany({
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

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Get user ID from session
    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const { serviceId, stylistId, date, notes } = body;

    // Validate required fields
    if (!serviceId || !date) {
      return NextResponse.json(
        { error: 'Service ID and date are required' },
        { status: 400 }
      );
    }

    // If stylist is provided, check for availability
    if (stylistId) {
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

      // Check for overlapping appointments
      const appointmentDate = new Date(date);
      const appointmentEndTime = new Date(appointmentDate.getTime() + service.duration * 60000);
      
      // Find any overlapping appointments for this stylist
      const overlappingAppointments = await prisma.appointment.findMany({
        where: {
          stylistId: stylistId,
          status: { notIn: ['CANCELLED'] },
          OR: [
            // Appointment starts during an existing appointment
            {
              date: {
                lt: appointmentEndTime,
              },
              AND: {
                service: {
                  duration: {
                    gt: 0,
                  },
                },
              },
            },
          ],
        },
        include: {
          service: true,
        },
      });

      // Check if any appointments overlap with the requested time
      for (const existingAppointment of overlappingAppointments) {
        const existingStart = new Date(existingAppointment.date);
        const existingEnd = new Date(existingStart.getTime() + 
          existingAppointment.service.duration * 60000);
        
        // Check for overlap
        if (
          (appointmentDate < existingEnd && existingStart < appointmentEndTime)
        ) {
          return NextResponse.json(
            { 
              error: 'This time slot is no longer available. Please select another time.', 
              conflictingAppointment: {
                time: existingStart.toLocaleTimeString(),
                duration: existingAppointment.service.duration
              }
            },
            { status: 409 } // Conflict status code
          );
        }
      }
    }

    // Create new appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        serviceId,
        stylistId,
        date: new Date(date),
        notes,
        status: 'PENDING',
      },
      include: {
        service: true,
        stylist: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}