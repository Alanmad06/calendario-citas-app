import { Suspense } from 'react';

import BookingForm from './components/BookingForm';

export default function BookingPage() {

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-foreground">Cargando...</p>
      </div>
    </div>}>
      <BookingForm />
    </Suspense>
  );
}