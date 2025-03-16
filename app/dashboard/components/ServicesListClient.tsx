'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface ServicesListClientProps {
  services: Service[];
  error?: string;
}

export function ServicesListClient({ services, error }: ServicesListClientProps) {
  const router = useRouter();

  return (
    <div className=" shadow overflow-hidden sm:rounded-lg bg-second-background">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-foreground-title">Servicios Disponibles</h2>
        <p className="mt-1 max-w-2xl text-sm text-foreground">
          Explora nuestros servicios y agenda una cita.
        </p>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-foreground-title">{service.name}</h3>
              <p className="text-foreground mt-1">Duración: {service.duration} minutos</p>
              <p className="text-foreground-title font-medium mt-2">${service.price}</p>
              <Button
                onClick={() => router.push(`/dashboard/book?service=${service.id}`)}
                className="mt-4 w-full bg-primary hover:bg-primary-600 text-white"
              >
                Reservar
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}