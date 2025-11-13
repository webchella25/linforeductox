// components/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar si ya aceptó las cookies
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary shadow-2xl animate-slide-up">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Texto */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🍪 Este sitio utiliza cookies
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Utilizamos cookies propias y de terceros para mejorar nuestros servicios 
              y mostrarle publicidad relacionada con sus preferencias mediante el análisis 
              de sus hábitos de navegación. Si continúa navegando, consideramos que acepta su uso. 
              Puede obtener más información en nuestra{' '}
              <Link 
                href="/cookies" 
                className="text-primary hover:underline font-medium"
              >
                Política de Cookies
              </Link>.
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={rejectCookies}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium whitespace-nowrap"
            >
              Rechazar
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-medium whitespace-nowrap shadow-md hover:shadow-lg"
            >
              Aceptar todas
            </button>
          </div>

          {/* Botón cerrar (mobile) */}
          <button
            onClick={rejectCookies}
            className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}