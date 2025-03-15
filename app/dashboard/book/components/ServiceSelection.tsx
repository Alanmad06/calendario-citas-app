'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Service } from '@/lib/services/serviceService';

interface ServiceSelectionProps {
  services: Service[];
  selectedService: Service | null;
  setSelectedService: (service: Service) => void;
  isLoading: boolean;
}

export function ServiceSelection({
  services,
  selectedService,
  setSelectedService,
  isLoading,
}: ServiceSelectionProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-foreground-title mb-4">1. Selecciona un servicio</h2>
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <Skeleton variant="text" width="100%" height={32} className="mb-2" animation="wave" />
                <Skeleton variant="text" width="40%" height={20} className="mb-1" animation="wave" />
                <Skeleton variant="text" width="30%" height={20} animation="wave" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedService?.id === service.id ? 'border-primary-500 ring-2 ring-primary-200' : 'hover:border-gray-300'}`}
              onClick={() => setSelectedService(service)}
            >
              <h3 className="font-medium text-foreground-title">{service.name}</h3>
              <p className="text-foreground mt-1">Duración: {service.duration} minutos</p>
              <p className="text-foreground-title font-medium mt-2">${service.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}