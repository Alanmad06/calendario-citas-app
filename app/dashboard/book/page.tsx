import { Suspense } from 'react';
import BookingForm from './components/BookingForm';
import { BookingFormSkeleton } from '@/components/ui/skeletons/booking-form-skeleton';

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingFormSkeleton />}>
      <BookingForm />
    </Suspense>
  );
}