'use client';

import { Skeleton } from '../skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header section skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width="30%" height={32} className="mb-2" />
        <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" />
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4">
            <Skeleton variant="text" width="50%" height={24} className="mb-2" />
            <Skeleton variant="text" width="70%" height={20} className="mb-4" />
            <div className="flex justify-between items-end">
              <Skeleton variant="text" width="30%" height={28} />
              <Skeleton variant="circular" width={40} height={40} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Services section skeleton */}
      <div className="bg-white shadow rounded-lg p-4">
        <Skeleton variant="text" width="40%" height={28} className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <Skeleton variant="text" width="70%" height={24} className="mb-2" />
              <Skeleton variant="text" width="40%" height={20} className="mb-2" />
              <Skeleton variant="text" width="30%" height={20} className="mb-2" />
              <div className="mt-4">
                <Skeleton variant="rectangular" width="100%" height={36} className="rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Upcoming appointments skeleton */}
      <div className="bg-white shadow rounded-lg p-4">
        <Skeleton variant="text" width="50%" height={28} className="mb-4" />
        <div className="space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="space-y-2 w-3/4">
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={16} />
                  <Skeleton variant="text" width="50%" height={16} />
                </div>
                <div className="flex space-x-2">
                  <Skeleton variant="rectangular" width={80} height={32} className="rounded-md" />
                  <Skeleton variant="rectangular" width={80} height={32} className="rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}