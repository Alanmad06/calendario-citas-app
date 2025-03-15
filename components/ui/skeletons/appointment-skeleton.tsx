'use client';

import { Skeleton } from '../skeleton';

export function AppointmentSkeleton() {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      {/* Header skeleton */}
      <Skeleton variant="text" width="70%" height={24} className="mb-4" />
      
      {/* Empty state skeleton */}
      <Skeleton variant="text" width="100%" height={20} className="mb-2" />
      
      {/* Appointment items skeleton */}
      <div className="space-y-4 mt-4">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-full">
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="50%" height={16} />
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="45%" height={16} />
              </div>
              <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
            </div>
            <div className="mt-2">
              <Skeleton variant="text" width={100} height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}