import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';
import BookingForm from './components/BookingForm';

export default function BookingPage() {
  return (
    <Suspense fallback={<Loading size="large" text="Cargando formulario..." />}>
      <BookingForm />
    </Suspense>
  );
}