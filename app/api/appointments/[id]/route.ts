import { NextResponse , NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';


// GET a specific appointment by ID
export async function GET(request: NextRequest) {
  try {

    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
     
    if(!id){
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    
    
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

    // Fetch the specific appointment
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: id,
      },
      include: {
        service: true,
        stylist: true,
      },
    });

    // Check if appointment exists
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if the appointment belongs to the authenticated user
    if (appointment.userId !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH to update an appointment
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if(!id){
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
    
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

    // Check if the appointment exists and belongs to the user
    const existingAppointment = await prisma.appointment.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if the appointment belongs to the authenticated user
    if (existingAppointment.userId !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { serviceId, date, notes, status } = body;

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        ...(serviceId && { serviceId }),
        ...(date && { date: new Date(date) }),
        ...(notes !== undefined && { notes }),
        ...(status && { status }),
      },
      include: {
        service: true,
        stylist: true,
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE an appointment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if(!id){
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
    
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

    // Check if the appointment exists and belongs to the user
    const existingAppointment = await prisma.appointment.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if the appointment belongs to the authenticated user
    if (existingAppointment.userId !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the appointment
    await prisma.appointment.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: 'Appointment deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}