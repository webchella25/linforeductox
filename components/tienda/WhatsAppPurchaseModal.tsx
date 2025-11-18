// components/tienda/WhatsAppPurchaseModal.tsx
'use client';

import { useState } from 'react';
import { X, ShoppingBag, Loader2, Mail, User, Phone, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  basePrice: number;
}

interface Colors {
  primaryColor: string;
  primaryDark: string;
  secondaryColor: string;
  secondaryLight: string;
  creamColor: string;
  textColor: string;
}

interface WhatsAppPurchaseModalProps {
  product: Product;
  colors: Colors;
  whatsappNumber: string | null;
  onClose: () => void;
}

export default function WhatsAppPurchaseModal({
  product,
  colors,
  whatsappNumber,
  onClose,
}: WhatsAppPurchaseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientNotes: '',
    acceptsNewsletter: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappNumber) {
      toast.error('WhatsApp no configurado. Contacta con soporte.');
      return;
    }

    setLoading(true);

    try {
      // 1. Guardar venta en BD
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
          clientNotes: formData.clientNotes,
          acceptsNewsletter: formData.acceptsNewsletter,
        }),
      });

      if (!res.ok) {
        throw new Error('Error al registrar la solicitud');
      }

      // 2. Construir mensaje de WhatsApp
      const mensaje = `Hola! Me interesa comprar:

📦 *Producto:* ${product.name}
💰 *Precio:* ${product.basePrice}€

👤 *Mis datos:*
Nombre: ${formData.clientName}
Email: ${formData.clientEmail}
Teléfono: ${formData.clientPhone}

${formData.clientNotes ? `📝 *Notas:* ${formData.clientNotes}` : ''}

¿Está disponible?`;

      // 3. Abrir WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
      
      window.open(whatsappUrl, '_blank');

      // 4. Mostrar confirmación
      toast.success('¡Solicitud registrada! Abriendo WhatsApp...');
      
      // 5. Cerrar modal después de un segundo
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 px-6 py-4 border-b flex items-center justify-between text-white"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
          }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold">Completar Compra</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Producto Info */}
        <div className="px-6 py-4 border-b" style={{ backgroundColor: colors.creamColor }}>
          <h3 className="font-bold text-lg mb-1" style={{ color: colors.primaryColor }}>
            {product.name}
          </h3>
          <p className="text-2xl font-bold" style={{ color: colors.secondaryColor }}>
            {product.basePrice}€
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <p className="text-sm" style={{ color: colors.textColor }}>
            Completa tus datos para continuar con la compra por WhatsApp. 
            Te contactaremos para confirmar disponibilidad y coordinar el pago y envío.
          </p>

          {/* Nombre */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.textColor }}>
              <User size={18} style={{ color: colors.primaryColor }} />
              Nombre completo *
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
              placeholder="Tu nombre"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{
                '--tw-ring-color': colors.primaryColor,
              } as React.CSSProperties}
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.textColor }}>
              <Mail size={18} style={{ color: colors.primaryColor }} />
              Email *
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              required
              placeholder="tu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{
                '--tw-ring-color': colors.primaryColor,
              } as React.CSSProperties}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.textColor }}>
              <Phone size={18} style={{ color: colors.primaryColor }} />
              Teléfono / WhatsApp *
            </label>
            <input
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              required
              placeholder="+34 123 456 789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{
                '--tw-ring-color': colors.primaryColor,
              } as React.CSSProperties}
            />
          </div>

          {/* Notas */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.textColor }}>
              <MessageSquare size={18} style={{ color: colors.primaryColor }} />
              Notas adicionales (opcional)
            </label>
            <textarea
              value={formData.clientNotes}
              onChange={(e) => setFormData({ ...formData, clientNotes: e.target.value })}
              rows={3}
              placeholder="¿Alguna pregunta o comentario sobre el producto?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
              style={{
                '--tw-ring-color': colors.primaryColor,
              } as React.CSSProperties}
            />
          </div>

          {/* Newsletter checkbox */}
          <div
            className="flex items-start gap-3 p-4 rounded-lg border-2"
            style={{ 
              borderColor: colors.secondaryLight,
              backgroundColor: `${colors.creamColor}`,
            }}
          >
            <input
              type="checkbox"
              id="newsletter"
              checked={formData.acceptsNewsletter}
              onChange={(e) =>
                setFormData({ ...formData, acceptsNewsletter: e.target.checked })
              }
              className="w-5 h-5 rounded border-gray-300 mt-0.5 cursor-pointer"
              style={{
                accentColor: colors.primaryColor,
              }}
            />
            <label
              htmlFor="newsletter"
              className="text-sm cursor-pointer"
              style={{ color: colors.textColor }}
            >
              <span className="font-medium">Suscribirme al newsletter</span>
              <br />
              <span className="text-xs opacity-75">
                Recibe ofertas exclusivas y novedades por email
              </span>
            </label>
          </div>

          {/* Info importante */}
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: `${colors.primaryColor}10`,
              borderColor: colors.primaryColor,
            }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: colors.primaryColor }}>
              ℹ️ ¿Cómo funciona?
            </p>
            <ol className="text-sm space-y-1 list-decimal list-inside" style={{ color: colors.textColor }}>
              <li>Completa tus datos y haz clic en "Continuar a WhatsApp"</li>
              <li>Se abrirá WhatsApp con un mensaje pre-rellenado</li>
              <li>Aline te confirmará disponibilidad y coordinará el pago</li>
              <li>Una vez confirmado, recibirás tu producto</li>
            </ol>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              style={{
                borderColor: colors.primaryColor,
                color: colors.primaryColor,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.primaryColor,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Continuar a WhatsApp
                </>
              )}
            </button>
          </div>

          {/* Seguridad */}
          <p className="text-xs text-center text-gray-500">
            🔒 Tus datos están seguros y solo se usarán para procesar tu pedido
          </p>
        </form>
      </div>
    </div>
  );
}