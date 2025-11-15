// components/Header.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cargar servicios activos
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?active=true');
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    }
  };

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/aline-vidal", label: "Alin Vidal" },
	{ href: "/eventos", label: "Eventos" },
    { href: "/testimonios", label: "Testimonios" },
    { href: "/contacto", label: "Contacto" },
  ];

  // Links del menú de servicios (dinámicos)
  const serviciosLinks = [
    { href: "/servicios", label: "Todos los Servicios" },
    ...services.map(service => ({
      href: `/servicios/${service.slug}`,
      label: service.name,
    })),
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

          {/* Dropdown Servicios */}
          <li
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button
              className={`font-medium hover:text-secondary transition-colors flex items-center gap-1 ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              Servicios
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isServicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[250px] border border-gray-100"
                >
                  {serviciosLinks.map((servicio) => (
                    <Link
                      key={servicio.href}
                      href={servicio.href}
                      className="block px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors"
                    >
                      {servicio.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Alin Vidal */}
          <li>
            <Link
              href="/aline-vidal"
              className={`font-medium hover:text-secondary transition-colors ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              Aline Vidal
            </Link>
          </li>

 {/* Eventos */}
          <li>
            <Link
              href="/eventos"
              className={`font-medium hover:text-secondary transition-colors ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              Eventos
            </Link>
          </li>

          {/* Testimonios */}
          <li>
            <Link
              href="/testimonios"
              className={`font-medium hover:text-secondary transition-colors ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              Testimonios
            </Link>
          </li>

          {/* Contacto */}
          <li>
            <Link
              href="/contacto"
              className={`font-medium hover:text-secondary transition-colors ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              Contacto
            </Link>
          </li>

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
              {/* Inicio */}
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors"
                >
                  Inicio
                </Link>
              </li>

              {/* Servicios Mobile */}
              <li>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full text-left px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors flex items-center justify-between"
                >
                  Servicios
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="bg-cream/50">
                    {serviciosLinks.map((servicio) => (
                      <Link
                        key={servicio.href}
                        href={servicio.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-12 py-2 text-gray-700 hover:text-primary transition-colors"
                      >
                        {servicio.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {/* Alin Vidal */}
              <li>
                <Link
                  href="/aline-vidal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors"
                >
                  Aline Vidal
                </Link>
              </li>

              {/* Testimonios */}
              <li>
                <Link
                  href="/testimonios"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors"
                >
                  Testimonios
                </Link>
              </li>

              {/* Contacto */}
              <li>
                <Link
                  href="/contacto"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 text-gray-800 hover:bg-cream hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>

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