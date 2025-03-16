'use client';

import { Skeleton } from '../skeleton';

export function AppointmentsSkeleton() {
  return (
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
  );
}