"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/servicios", label: "Servicios" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-4"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="container-custom flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <h1
            className={`font-heading text-2xl md:text-3xl font-bold transition-colors ${
              isScrolled ? "text-primary" : "text-white"
            }`}
          >
            LINFOREDUCTOX
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
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
          <li>
            <Link
              href="/contacto"
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
                  href="/contacto"
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