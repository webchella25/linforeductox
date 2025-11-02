// components/dashboard/DashboardHeader.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { User, LogOut, Key, ChevronDown, Bell } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || 'Usuario';
  const userEmail = user?.email || '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Panel de Administración
        </h2>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications button */}
        <button
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Notificaciones"
        >
          <Bell size={20} className="text-gray-600" />
          {/* Badge de notificaciones */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 mt-1">{userEmail}</p>
              </div>

              <div className="py-2">
                <Link
                  href="/dashboard/perfil"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={16} />
                  <span>Mi Perfil</span>
                </Link>

                <Link
                  href="/dashboard/cambiar-contrasena"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Key size={16} />
                  <span>Cambiar Contraseña</span>
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}