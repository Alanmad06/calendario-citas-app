'use client';

import { Skeleton } from '../skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Appointments section skeleton */}
    
      <div>
        <div className="border-t border-gray-200 py-5 sm:p-0 my-2">
          <dl className="sm:divide-y sm:divide-gray-200">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-second-background">
                <dt className="text-sm font-medium text-foreground">
                  <Skeleton variant="text" width="70%" height={20} />
                </dt>
                <dd className="mt-1 text-sm text-foreground-title sm:mt-0 sm:col-span-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Skeleton variant="text" width="60%" height={20} className="mb-2" />
                      <Skeleton variant="text" width="40%" height={16} className="mb-2" />
                      <Skeleton variant="text" width="50%" height={16} className="mb-2" />
                      <Skeleton variant="text" width="65%" height={16} />
                    </div>
                    <div>
                      <Skeleton variant="rectangular" width={80} height={24} className="rounded-full mb-2" />
                      <div className="mt-2 flex space-x-2">
                        <Skeleton variant="text" width={80} height={16} />
                        <Skeleton variant="text" width={80} height={16} />
                      </div>
                    </div>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        </div>
      
      {/* Services section skeleton - keeping the static title */}
      <div className="shadow overflow-hidden sm:rounded-lg bg-second-background">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-foreground-title">Servicios Disponibles</h2>
          <p className="mt-1 max-w-2xl text-sm text-foreground">
            Explora nuestros servicios y agenda una cita.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <Skeleton variant="text" width="70%" height={20} className="mb-2" />
                <Skeleton variant="text" width="40%" height={16} className="mb-2" />
                <Skeleton variant="text" width="30%" height={20} className="mb-2" />
                <div className="mt-4">
                  <Skeleton variant="rectangular" width="100%" height={36} className="rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}