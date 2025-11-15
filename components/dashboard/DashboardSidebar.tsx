// components/dashboard/DashboardSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Sparkles,
  FileText,
  Settings,
  Clock,
  X,
  Menu,
  Home,
  Phone,
  Palette,
  User,
} from 'lucide-react';
import Image from 'next/image';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/servicios',
    label: 'Tratamientos',
    icon: Sparkles,
  },
  {
  href: '/dashboard/eventos',
  label: 'Eventos',
  icon: Calendar,  // Importar: import { Calendar } from 'lucide-react';
},
  {
    href: '/dashboard/testimonios',
    label: 'Testimonios',
    icon: MessageSquare,
  },
  {
    href: '/dashboard/reservas',
    label: 'Reservas',
    icon: Calendar,
  },
  {
    href: '/dashboard/contenido',
    label: 'Contenido Web',
    icon: FileText,
  },
 {
  href: '/dashboard/configuracion',
  label: 'Configuración',
  icon: Settings,
  subItems: [
    {
      href: '/dashboard/configuracion/portada',  // ✅ NUEVO
      label: 'Portada',
      icon: Home,  // Importar: import { Home } from 'lucide-react';
    },
	{
      href: '/dashboard/configuracion/sobre-mi',  // ✅ NUEVO
      label: 'Sobre Mí',
      icon: User,  // Importar: import { User } from 'lucide-react';
    },
    {
      href: '/dashboard/configuracion/horarios',
      label: 'Horarios',
      icon: Clock,
    },
    {
      href: '/dashboard/configuracion/contacto',
      label: 'Información de Contacto',
      icon: Phone,
    },
    {
      href: '/dashboard/configuracion/colores',
      label: 'Colores de la Web',
      icon: Palette,
    },
  ],
},
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['/dashboard/configuracion']);

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out shadow-xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="LINFOREDUCTOX"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-heading text-xl font-bold text-primary group-hover:text-secondary transition-colors">
              LINFOREDUCTOX
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItems.includes(item.href);

            return (
              <div key={item.href}>
                {/* Main item */}
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpand(item.href)}
                    className={`
                      w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all
                      ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}

                {/* Sub items */}
                {hasSubItems && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = pathname === subItem.href;

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm
                            ${
                              isSubActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }
                          `}
                        >
                          <SubIcon size={18} />
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            <Home size={16} />
            Ver sitio web
          </Link>
        </div>
      </aside>
    </>
  );
}