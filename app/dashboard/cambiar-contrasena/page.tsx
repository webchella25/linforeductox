// app/dashboard/cambiar-contrasena/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Key, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CambiarContrasenaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Contraseña actualizada correctamente');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        toast.error(data.error || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cambiar Contraseña</h1>
        <p className="text-gray-600 mt-2">
          Actualiza tu contraseña para mantener tu cuenta segura
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contraseña actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual *
            </label>
            <input
              type="password"
              required
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Tu contraseña actual"
            />
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña *
            </label>
            <input
              type="password"
              required
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Mínimo 8 caracteres"
              minLength={8}
            />
          </div>

          {/* Confirmar nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña *
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Repite la nueva contraseña"
              minLength={8}
            />
          </div>

          {/* Requisitos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Requisitos de la contraseña:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <Check size={16} />
                Mínimo 8 caracteres
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} />
                Combina letras y números
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} />
                Evita contraseñas muy simples
              </li>
            </ul>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Actualizando...
              </>
            ) : (
              <>
                <Key size={20} />
                Cambiar Contraseña
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}