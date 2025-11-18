// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  parentServiceId?: string | null;
  childServices?: Service[];
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [hoveredParent, setHoveredParent] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?active=true');
      const data = await res.json();
      
      // Organizar en jerarquía
      const allServices = data.services || [];
      const parents = allServices.filter((s: Service) => !s.parentServiceId);
      const children = allServices.filter((s: Service) => s.parentServiceId);
      
      const servicesWithChildren = parents.map((parent: Service) => ({
        ...parent,
        childServices: children.filter((child: Service) => child.parentServiceId === parent.id),
      }));
      
      setServices(servicesWithChildren);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    }
  };

  const navLinks = [
   
    { href: "/aline-vidal", label: "Aline Vidal" },
    { href: "/eventos", label: "Eventos" },
    { href: "/testimonios", label: "Testimonios" },
    { href: "/tienda", label: "Tienda" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-4"
      }`}
    >
      <nav className="container-custom flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12 md:w-14 md:h-14">
            <Image
              src="/logo.png"
              alt="LINFOREDUCTOX Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1
            className={`font-heading text-xl md:text-2xl font-bold transition-colors ${
              isScrolled ? "text-primary" : "text-white"
            }`}
          >
            LINFOREDUCTOX
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {/* Inicio */}
          <li>
            <Link
              href="/"
              className={`font-medium hover:text-secondary transition-colors ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              Inicio
            </Link>
          </li>

          {/* Dropdown Tratamientos con Jerarquía */}
          <li
            className="relative group"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => {
              setIsServicesOpen(false);
              setHoveredParent(null);
            }}
          >
            <button
              className={`font-medium hover:text-secondary transition-colors flex items-center gap-1 ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              Tratamientos
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isServicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu Principal */}
            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[280px] border border-gray-100"
                >
                  {/* Ver Todos */}
                  <Link
                    href="/servicios"
                    className="block px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors font-medium border-b border-gray-100"
                  >
                    📋 Ver Todos los Tratamientos
                  </Link>

                  {/* Servicios Padres */}
                  {services.map((parent) => (
                    <div
                      key={parent.id}
                      className="relative"
                      onMouseEnter={() => setHoveredParent(parent.id)}
                    >
                      <Link
                        href={`/servicios/${parent.slug}`}
                        className="flex items-center justify-between px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors"
                      >
                        <span className="font-medium">{parent.name}</span>
                        {parent.childServices && parent.childServices.length > 0 && (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </Link>

                      {/* Submenu de Hijos */}
                      {hoveredParent === parent.id && parent.childServices && parent.childServices.length > 0 && (
                        <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-xl py-2 min-w-[260px] border border-gray-100">
                          {parent.childServices.map((child) => (
                            <Link
                              key={child.id}
                              href={`/servicios/${child.slug}`}
                              className="block px-6 py-3 text-gray-700 hover:bg-cream hover:text-primary transition-colors text-sm"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Resto de Links */}
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-medium hover:text-secondary transition-colors ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Botón Reservar */}
          <li>
            <Link
              href="/reservar"
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                isScrolled
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-white text-primary hover:bg-cream"
              }`}
            >
              Reservar
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 ${
            isScrolled ? "text-primary" : "text-white"
          }`}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <ul className="flex flex-col py-4">
              {/* Tratamientos Mobile */}
              <li>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full text-left px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors flex items-center justify-between"
                >
                  Tratamientos
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="bg-cream/50">
                    <Link
                      href="/servicios"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-12 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                    >
                      📋 Ver Todos
                    </Link>
                    {services.map((parent) => (
                      <div key={parent.id}>
                        <Link
                          href={`/servicios/${parent.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-12 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                        >
                          {parent.name}
                        </Link>
                        {parent.childServices?.map((child) => (
                          <Link
                            key={child.id}
                            href={`/servicios/${child.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-16 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                          >
                            • {child.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </li>

              {/* Resto de Links Mobile */}
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li className="px-6 pt-2">
                <Link
                  href="/reservar"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center bg-primary text-white py-3 rounded-full hover:bg-primary-dark transition-colors"
                >
                  Reservar
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;