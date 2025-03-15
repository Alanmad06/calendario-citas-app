'use client';

import { Stylist } from '@/lib/services/stylistService';
import Image from 'next/image';

interface StylistSelectionProps {
  stylists: Stylist[];
  selectedStylist: Stylist | null;
  setSelectedStylist: (stylist: Stylist) => void;
}

export function StylistSelection({
  stylists,
  selectedStylist,
  setSelectedStylist,
}: StylistSelectionProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-foreground-title mb-4">2. Selecciona un estilista</h2>
      {stylists.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stylists.map((stylist) => (
            <div
              key={stylist.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedStylist?.id === stylist.id ? 'border-primary-500 ring-2 ring-primary-200' : 'hover:border-gray-300'}`}
              onClick={() => setSelectedStylist(stylist)}
            >
              <div className="flex items-center">
                {stylist.image ? (
                  <Image src={stylist.image} alt={stylist.name} className="w-10 h-10 rounded-full mr-3" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span className="text-gray-500 font-medium">{stylist.name?.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-foreground-title">{stylist.name}</h3>
                  {stylist.phoneNumber && (
                    <p className="text-foreground text-sm">{stylist.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-foreground">No hay estilistas disponibles en este momento.</p>
      )}
    </div>
  );
}