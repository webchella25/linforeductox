// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronRight, Sparkles } from "lucide-react"; // ✅ Agregado ChevronRight
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
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      
      // Calcular progreso de scroll
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / windowHeight) * 100;
      setScrollProgress(progress);
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

  // Iconos de ejemplo para servicios (puedes personalizar)
  const serviceIcons: Record<string, string> = {
    'corporal': '💆‍♀️',
    'facial': '✨',
    'acupuntura': '🌿',
    'default': '💫'
  };

  return (
    <>
      {/* Barra de progreso de scroll */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary z-[60]"
        style={{
          scaleX: scrollProgress / 100,
          transformOrigin: "0%",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100 py-3"
            : "bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm py-4"
        }`}
      >
        <nav className="container-custom flex items-center justify-between px-6">
          {/* Logo con efecto hover mejorado */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              className="relative w-12 h-12 md:w-14 md:h-14"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/logo.png"
                alt="LINFOREDUCTOX Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </motion.div>
            <div>
              <motion.h1
                className={`font-heading text-xl md:text-2xl font-bold transition-all duration-300 ${
                  isScrolled 
                    ? "text-primary" 
                    : "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                LINFOREDUCTOX
              </motion.h1>
              <p className={`text-xs transition-all duration-300 ${
                isScrolled ? "text-gray-600" : "text-white/80"
              }`}>
                Centro de Bienestar
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {/* Inicio */}
            <li>
              <Link
                href="/"
                className={`font-medium transition-all duration-300 relative group ${
                  isScrolled ? "text-gray-800" : "text-white drop-shadow-md"
                }`}
              >
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>

            {/* Mega Menu Tratamientos */}
            <li
              className="relative group"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => {
                setIsServicesOpen(false);
                setHoveredParent(null);
              }}
            >
              <button
                className={`font-medium transition-all duration-300 flex items-center gap-1 relative ${
                  isScrolled ? "text-gray-800" : "text-white drop-shadow-md"
                }`}
              >
                Tratamientos
                <motion.div
                  animate={{ rotate: isServicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></span>
              </button>

              {/* Mega Dropdown */}
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[320px]"
                  >
                    {/* Header del dropdown */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles size={16} />
                        Nuestros Tratamientos
                      </p>
                    </div>

                    {/* Ver Todos */}
                    <Link
                      href="/servicios"
                      className="block px-6 py-4 text-gray-800 hover:bg-cream/50 transition-all font-medium border-b border-gray-100 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          📋 Ver Todos los Tratamientos
                        </span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>

                    {/* Grid de Servicios */}
                    <div className="p-3 max-h-[400px] overflow-y-auto">
                      {services.map((parent) => (
                        <div
                          key={parent.id}
                          onMouseEnter={() => setHoveredParent(parent.id)}
                          className="mb-2"
                        >
                          {/* Servicio Padre como Card */}
                          <Link
                            href={`/servicios/${parent.slug}`}
                            className={`block p-4 rounded-xl transition-all duration-300 ${
                              hoveredParent === parent.id
                                ? "bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                                {serviceIcons[parent.slug] || serviceIcons.default}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{parent.name}</p>
                                {parent.childServices && parent.childServices.length > 0 && (
                                  <p className="text-xs text-gray-500">
                                    {parent.childServices.length} tratamientos
                                  </p>
                                )}
                              </div>
                              <ChevronRight 
                                size={16} 
                                className={`text-gray-400 transition-transform ${
                                  hoveredParent === parent.id ? "translate-x-1" : ""
                                }`}
                              />
                            </div>
                          </Link>

                          {/* Servicios Hijos */}
                          <AnimatePresence>
                            {hoveredParent === parent.id && parent.childServices && parent.childServices.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-14 mt-2 space-y-1"
                              >
                                {parent.childServices.map((child) => (
                                  <Link
                                    key={child.id}
                                    href={`/servicios/${child.slug}`}
                                    className="block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-cream/30 rounded-lg transition-all"
                                  >
                                    • {child.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Resto de Links */}
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-medium transition-all duration-300 relative group ${
                    isScrolled ? "text-gray-800" : "text-white drop-shadow-md"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}

            {/* CTA Reservar con efecto GLOW */}
            <li>
              <Link
                href="/reservar"
                className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 overflow-hidden group ${
                  isScrolled
                    ? "bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl"
                    : "bg-white text-primary hover:bg-cream shadow-lg hover:shadow-2xl"
                }`}
              >
                <span className="relative z-10">Reservar</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-primary/50"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Efecto shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button con animación */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? "text-primary bg-primary/10 hover:bg-primary/20" 
                : "text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={28} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* Mobile Menu Mejorado */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay con blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm top-[73px]"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu Content */}
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed right-0 top-[73px] bottom-0 w-[85%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl overflow-y-auto"
              >
                <ul className="flex flex-col py-6 px-4 space-y-2">
                  {/* Inicio Mobile */}
                  <li>
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-gray-800 hover:bg-cream/50 rounded-xl transition-all font-medium"
                    >
                      🏠 Inicio
                    </Link>
                  </li>

                  {/* Tratamientos Mobile Accordion */}
                  <li>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-cream/50 rounded-xl transition-all font-medium"
                    >
                      <span>💆‍♀️ Tratamientos</span>
                      <motion.div
                        animate={{ rotate: isServicesOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-cream/30 rounded-xl mt-2 overflow-hidden"
                        >
                          <Link
                            href="/servicios"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-6 py-3 text-gray-700 hover:bg-white/50 transition-all font-medium border-b border-gray-200"
                          >
                            📋 Ver Todos
                          </Link>
                          {services.map((parent) => (
                            <div key={parent.id}>
                              <Link
                                href={`/servicios/${parent.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-6 py-3 text-gray-800 hover:bg-white/50 transition-all font-medium border-b border-gray-100"
                              >
                                {serviceIcons[parent.slug] || serviceIcons.default} {parent.name}
                              </Link>
                              {parent.childServices?.map((child) => (
                                <Link
                                  key={child.id}
                                  href={`/servicios/${child.slug}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-10 py-2 text-sm text-gray-600 hover:bg-white/50 hover:text-primary transition-all"
                                >
                                  • {child.name}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>

                  {/* Resto de Links Mobile */}
                  {navLinks.map((link, index) => {
                    const icons = ['👤', '📅', '💬', '🛍️'];
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 text-gray-800 hover:bg-cream/50 rounded-xl transition-all font-medium"
                        >
                          {icons[index]} {link.label}
                        </Link>
                      </li>
                    );
                  })}

                  {/* CTA Mobile */}
                  <li className="pt-4">
                    <Link
                      href="/reservar"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      ✨ Reservar Cita
                    </Link>
                  </li>
                </ul>

                {/* Footer del menu mobile */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-cream/50 to-transparent">
                  <p className="text-xs text-center text-gray-600">
                    © 2024 LINFOREDUCTOX
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;