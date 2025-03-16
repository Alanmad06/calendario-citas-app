'use server';

import { prisma } from '@/lib/db';
import { ServicesListClient } from './ServicesListClient';
import { Service } from '@prisma/client';

// Define the PrismaService type (Service from Prisma with Decimal price)
type PrismaService = Service;

// Define ServiceWithNumberPrice type (Service with price as number instead of Decimal)
type ServiceWithNumberPrice = Omit<Service, 'price'> & { price: number };

export async function ServicesList() {
  try {
    // Fetch all services
    const prismaServices = await prisma.service.findMany({
      orderBy: {
        name: 'asc',
      },
    }) as PrismaService[];
    
    // Convert Decimal price to number for each service
    const services: ServiceWithNumberPrice[] = prismaServices.map(service => ({
      ...service,
      price: Number(service.price)
    }));

    return <ServicesListClient services={services} />;
  } catch (error) {
    console.error('Error fetching services:', error);
    // Return an empty list with an error message that will be handled by the client
    return <ServicesListClient services={[]} error="Error loading services" />;
  }
}