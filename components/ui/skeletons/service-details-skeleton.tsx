'use client';

import { Skeleton } from '../skeleton';

export function ServiceDetailsSkeleton() {
  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto space-y-6">
      {/* Service header */}
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" height={32} className="mb-2" animation="wave" />
        <Skeleton variant="text" width="80%" height={20} animation="wave" />
      </div>
      
      {/* Service details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton variant="rectangular" width="100%" height={240} className="rounded-lg" animation="wave" />
          <div className="flex justify-between">
            <Skeleton variant="text" width="30%" height={24} animation="wave" />
            <Skeleton variant="text" width="20%" height={24} animation="wave" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton variant="text" width="50%" height={24} className="mb-2" animation="wave" />
          <Skeleton variant="text" width="100%" height={16} className="mb-1" animation="wave" />
          <Skeleton variant="text" width="100%" height={16} className="mb-1" animation="wave" />
          <Skeleton variant="text" width="90%" height={16} className="mb-1" animation="wave" />
          <Skeleton variant="text" width="95%" height={16} className="mb-1" animation="wave" />
          <Skeleton variant="text" width="85%" height={16} animation="wave" />
          
          <div className="mt-6">
            <Skeleton variant="text" width="40%" height={24} className="mb-2" animation="wave" />
            <div className="flex space-x-2">
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="pt-4 flex justify-end space-x-4">
        <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" animation="wave" />
        <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" animation="wave" />
      </div>
    </div>
  );
}