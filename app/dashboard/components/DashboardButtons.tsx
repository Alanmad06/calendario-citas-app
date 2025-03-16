'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function DashboardButtons() {
  const router = useRouter();
  
  return (
    <div className="flex space-x-4">
      <Button
        onClick={() => router.push('/dashboard/calendar')}
        className="bg-gray-100 text-gray-800 hover:bg-gray-200"
      >
        Ver calendario
      </Button>
      <Button
        onClick={() => router.push('/dashboard/book')}
        className="bg-primary hover:bg-primary-600 text-white"
      >
        Agendar nueva cita
      </Button>
    </div>
  );
}