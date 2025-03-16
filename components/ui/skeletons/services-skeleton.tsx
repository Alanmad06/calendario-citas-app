'use client';

import { Skeleton } from '../skeleton';

export function ServicesSkeletonGrid() {
  return (
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
  );
}