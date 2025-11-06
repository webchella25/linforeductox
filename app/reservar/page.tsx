import { Suspense } from 'react';
import ReservarClient from './reservarclient';

export default function ReservarPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ReservarClient />
    </Suspense>
  );
}