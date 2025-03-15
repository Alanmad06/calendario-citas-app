import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
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

    // Fetch all users with STYLIST role
    const stylists = await prisma.user.findMany({
      where: {
        role: 'STYLIST',
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phoneNumber: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(stylists);
  } catch (error) {
    console.error('Error fetching stylists:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}