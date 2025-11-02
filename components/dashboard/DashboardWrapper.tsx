// components/dashboard/DashboardWrapper.tsx

'use client';

import { useEffect } from 'react';

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Ocultar Header y Footer al montar
    const header = document.querySelector('body > header');
    const footer = document.querySelector('body > footer');

    if (header) (header as HTMLElement).style.display = 'none';
    if (footer) (footer as HTMLElement).style.display = 'none';

    // Restaurar al desmontar
    return () => {
      if (header) (header as HTMLElement).style.display = '';
      if (footer) (footer as HTMLElement).style.display = '';
    };
  }, []);

  return <>{children}</>;
}