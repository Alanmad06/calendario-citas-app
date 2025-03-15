'use client';

import { Skeleton } from '../skeleton';

export function CalendarSkeleton() {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="rectangular" width={32} height={32} className="rounded-md" />
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="rectangular" width={32} height={32} className="rounded-md" />
      </div>
      
      {/* Days of week skeleton */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {Array(7).fill(0).map((_, index) => (
          <Skeleton key={index} variant="text" width="100%" height={24} />
        ))}
      </div>
      
      {/* Calendar cells skeleton */}
      <div className="grid grid-cols-1 gap-2">
        {Array(6).fill(0).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-1">
            {Array(7).fill(0).map((_, dayIndex) => (
              <Skeleton 
                key={dayIndex} 
                variant="rectangular" 
                width="100%" 
                height={48} 
                className="rounded-md" 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}