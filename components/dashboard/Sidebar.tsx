'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  Clock,
  Phone,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Principal',
      items: [
        {
          href: '/dashboard',
          label: 'Resumen',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Gestión',
      items: [
        {
          href: '/dashboard/reservas',
          label: 'Reservas',
          icon: Calendar,
        },
        {
          href: '/dashboard/testimonios',
          label: 'Testimonios',
          icon: MessageSquare,
        },
        {
          href: '/dashboard/servicios',
          label: 'Servicios',
          icon: Sparkles,
        },
        {
          href: '/dashboard/contenido',
          label: 'Contenido Web',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Configuración',
      items: [
        {
          href: '/dashboard/configuracion/horarios',
          label: 'Horarios',
          icon: Clock,
        },
        {
          href: '/dashboard/configuracion/contacto',
          label: 'Contacto',
          icon: Phone,
        },
        {
          href: '/dashboard/configuracion/perfil',
          label: 'Mi Perfil',
          icon: Settings,
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="LINFOREDUCTOX"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-primary">
              LINFOREDUCTOX
            </h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        active
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">AV</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">
              Aline Vidal
            </p>
            <p className="text-xs text-gray-500 truncate">Administrador</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
          className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;