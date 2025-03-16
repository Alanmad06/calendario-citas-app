import { Suspense } from 'react';
import { AppointmentsList } from './components/AppointmentsList';
import { ServicesList } from './components/ServicesList';
import { AppointmentsSkeleton } from '@/components/ui/skeletons/appointments-skeleton';
import { ServicesSkeletonGrid } from '@/components/ui/skeletons/services-skeleton';
import { DashboardButtons } from './components/DashboardButtons';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-foreground-title">Mi Panel</h1>
          <DashboardButtons />
        </div>

        {/* Appointments section with Suspense */}
        <Suspense fallback={<div className="sm:p-6 bg-second-background"><AppointmentsSkeleton /></div>}>
          <AppointmentsList />
        </Suspense>

        {/* Services section with Suspense */}
        <Suspense fallback={<div className="shadow overflow-hidden sm:rounded-lg bg-second-background"><div className="px-4 py-5 sm:px-6"><h2 className="text-lg font-medium text-foreground-title">Servicios Disponibles</h2><p className="mt-1 max-w-2xl text-sm text-foreground">Explora nuestros servicios y agenda una cita.</p></div><ServicesSkeletonGrid /></div>}>
          <ServicesList />
        </Suspense>
      </div>
    </div>
  );
}