// components/NewsletterForm.tsx
'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          source: 'footer' 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setEmail('');
        toast.success('¡Gracias por suscribirte! 🎉');
        
        // Reset success state after 3 seconds
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        toast.error(data.error || 'Error al suscribirse');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la suscripción');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
        <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
        <p className="text-sm text-white">
          ¡Suscripción exitosa! Revisa tu email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          disabled={isLoading}
          className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-secondary hover:bg-secondary-light rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin text-white" size={18} />
          ) : (
            <Send className="text-white" size={18} />
          )}
        </button>
      </div>
      <p className="text-xs text-white/60">
        Al suscribirte aceptas nuestra política de privacidad
      </p>
    </form>
  );
}