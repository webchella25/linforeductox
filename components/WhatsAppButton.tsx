// components/WhatsAppButton.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
}

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Mostrar tooltip automáticamente después de 3 segundos
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    // Ocultar tooltip después de 8 segundos
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    // Verificar si está en horario laboral (Lun-Vie 9-19, Sáb 10-14)
    const checkOnlineStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentTime = hour * 60 + minute;

      let online = false;

      // Lunes a Viernes: 9:00 - 19:00
      if (day >= 1 && day <= 5) {
        online = currentTime >= 9 * 60 && currentTime < 19 * 60;
      }
      // Sábado: 10:00 - 14:00
      else if (day === 6) {
        online = currentTime >= 10 * 60 && currentTime < 14 * 60;
      }

      setIsOnline(online);
    };

    checkOnlineStatus();
    // Verificar cada minuto
    const interval = setInterval(checkOnlineStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    // Vibración en mobile (si está disponible)
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-[280px] border border-gray-100"
          >
            {/* Close button */}
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
              aria-label="Cerrar"
            >
              <X size={14} />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">¿Necesitas ayuda?</p>
                <p className="text-sm text-gray-600 mb-3">
                  Estamos aquí para asesorarte sobre nuestros tratamientos
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className={isOnline ? 'text-green-600 font-medium' : 'text-gray-500'}>
                    {isOnline ? 'En línea ahora' : 'Fuera de horario'}
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Principal */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Badge Online */}
        {isOnline && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full z-10"
          >
            <motion.div
              className="w-full h-full bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}

        {/* Pulso de fondo */}
        <motion.div
          className="absolute inset-0 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Botón */}
        <Link
          href={`https://wa.me/${cleanPhoneNumber}?text=Hola,%20me%20gustaría%20información%20sobre%20sus%20tratamientos`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="relative w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all group"
          aria-label="Contactar por WhatsApp"
        >
          <svg 
            className="w-9 h-9 relative z-10 group-hover:scale-110 transition-transform" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>

          {/* Contador de mensajes sin leer (opcional - estático para demo) */}
          {isOnline && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
            >
              1
            </motion.div>
          )}
        </Link>
      </motion.div>
    </div>
  );
}