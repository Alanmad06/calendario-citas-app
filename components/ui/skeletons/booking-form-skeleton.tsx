'use client';

import { Skeleton } from '../skeleton';

export function BookingFormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6 space-y-8">
      {/* Form header */}
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" height={32} className="mb-2" animation="wave" />
        <Skeleton variant="text" width="80%" height={20} animation="wave" />
      </div>
      
      {/* Service selection */}
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" height={24} className="mb-2" animation="wave" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <Skeleton variant="text" width="70%" height={20} className="mb-2" animation="wave" />
              <Skeleton variant="text" width="40%" height={16} className="mb-1" animation="wave" />
              <Skeleton variant="text" width="30%" height={16} animation="wave" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Date selection */}
      <div className="space-y-4">
        <Skeleton variant="text" width="30%" height={24} className="mb-2" animation="wave" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array(7).fill(0).map((_, index) => (
            <Skeleton key={index} variant="rectangular" width="100%" height={48} className="rounded-md" animation="wave" />
          ))}
        </div>
      </div>
      
      {/* Time selection */}
      <div className="space-y-4">
        <Skeleton variant="text" width="30%" height={24} className="mb-2" animation="wave" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array(8).fill(0).map((_, index) => (
            <Skeleton key={index} variant="rectangular" width="100%" height={40} className="rounded-md" animation="wave" />
          ))}
        </div>
      </div>
      
      {/* Stylist selection */}
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" height={24} className="mb-2" animation="wave" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 border rounded-lg p-4">
              <Skeleton variant="circular" width={50} height={50} animation="wave" />
              <div className="space-y-2">
                <Skeleton variant="text" width={120} height={20} animation="wave" />
                <Skeleton variant="text" width={80} height={16} animation="wave" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Submit button */}
      <div className="pt-4">
        <Skeleton variant="rectangular" width="100%" height={48} className="rounded-md" animation="wave" />
      </div>
    </div>
  );
}