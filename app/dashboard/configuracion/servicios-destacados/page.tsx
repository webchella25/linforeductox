// app/dashboard/configuracion/servicios-destacados/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, Sparkles, Eye, GripVertical, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Service {
  id: string;
  name: string;
  description: string;
  slug: string;
  active: boolean;
}

// Componente de servicio arrastrable
function SortableServiceItem({ service, onRemove }: { service: Service; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-white border-2 rounded-lg ${
        isDragging ? 'border-primary shadow-lg' : 'border-gray-200'
      }`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-primary"
      >
        <GripVertical size={24} />
      </button>

      {/* Service Info */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{service.name}</h4>
        <p className="text-sm text-gray-600 line-clamp-1">{service.description}</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Eliminar"
      >
        <X size={20} />
      </button>
    </div>
  );
}

export default function ServicesDestacadosPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [config, setConfig] = useState({
    title: 'Nuestros Servicios',
    subtitle: '',
    active: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Obtener todos los servicios activos
      const servicesRes = await fetch('/api/services?active=true');
      const servicesData = await servicesRes.json();
      setAllServices(servicesData.services || []);

      // Obtener configuración actual
      const configRes = await fetch('/api/config/home-services');
      const configData = await configRes.json();
      
      setConfig({
        title: configData.title || 'Nuestros Servicios',
        subtitle: configData.subtitle || '',
        active: configData.active ?? true,
      });
      
      setSelectedServiceIds(configData.selectedServices || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (selectedServiceIds.length < 3) {
      toast.error('Debes seleccionar al menos 3 servicios');
      return;
    }
    if (selectedServiceIds.length > 6) {
      toast.error('Puedes seleccionar máximo 6 servicios');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/config/home-services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          selectedServices: selectedServiceIds,
        }),
      });

      if (res.ok) {
        toast.success('Configuración guardada correctamente');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al guardar');
      }
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedServiceIds((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addService = (serviceId: string) => {
    if (selectedServiceIds.length >= 6) {
      toast.error('Máximo 6 servicios permitidos');
      return;
    }
    setSelectedServiceIds([...selectedServiceIds, serviceId]);
  };

  const removeService = (serviceId: string) => {
    setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
  };

  const selectedServices = selectedServiceIds
    .map(id => allServices.find(s => s.id === id))
    .filter(Boolean) as Service[];

  const availableServices = allServices.filter(
    s => !selectedServiceIds.includes(s.id)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Servicios Destacados</h1>
          <p className="text-gray-600 mt-2">
            Configura qué servicios mostrar en la portada de tu web
          </p>
        </div>
        <Sparkles size={40} className="text-primary" />
      </div>

      {/* Textos de la Sección */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">📝 Textos de la Sección</h2>

        <div className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título Principal
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nuestros Servicios"
            />
          </div>

          {/* Subtítulo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtítulo / Descripción (opcional)
            </label>
            <textarea
              value={config.subtitle}
              onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Descubre los tratamientos que transformarán tu bienestar..."
            />
          </div>

          {/* Toggle Mostrar/Ocultar */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.active}
                onChange={(e) => setConfig({ ...config, active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm font-medium text-gray-700">
              Mostrar esta sección en la portada
            </span>
          </div>
        </div>
      </div>

      {/* Servicios Seleccionados (Drag & Drop) */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            ✨ Servicios Destacados ({selectedServiceIds.length}/6)
          </h2>
          <span className="text-sm text-gray-600">
            {selectedServiceIds.length < 3 && '⚠️ Mínimo 3 servicios'}
            {selectedServiceIds.length >= 3 && selectedServiceIds.length <= 6 && '✅ Listo'}
            {selectedServiceIds.length > 6 && '❌ Máximo 6 servicios'}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Arrastra para reordenar. El orden aquí es el orden en la web.
        </p>

        {selectedServices.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No hay servicios seleccionados</p>
            <p className="text-sm text-gray-400 mt-1">Agrega servicios desde abajo</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedServiceIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {selectedServices.map((service) => (
                  <SortableServiceItem
                    key={service.id}
                    service={service}
                    onRemove={() => removeService(service.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Servicios Disponibles */}
      {availableServices.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">➕ Agregar Servicios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableServices.map((service) => (
              <button
                key={service.id}
                onClick={() => addService(service.id)}
                disabled={selectedServiceIds.length >= 6}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">{service.description}</p>
                </div>
                <span className="text-primary font-medium">+</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Vista Previa */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={24} className="text-primary" />
          <h2 className="text-xl font-semibold">Vista Previa</h2>
        </div>

        <div className="bg-white rounded-lg p-8">
          {/* Textos */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {config.title || 'Nuestros Servicios'}
            </h2>
            {config.subtitle && (
              <p className="text-xl text-gray-700">
                {config.subtitle}
              </p>
            )}
          </div>

          {/* Grid de servicios */}
          {selectedServices.length > 0 ? (
            <div className={`grid gap-6 ${
              selectedServices.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
              selectedServices.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
              selectedServices.length === 5 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {selectedServices.map((service, index) => (
                <div
                  key={service.id}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors"
                >
                  <div className="text-xs text-gray-500 mb-2">#{index + 1}</div>
                  <h3 className="text-xl font-bold text-primary mb-2">{service.name}</h3>
                  <p className="text-gray-600 line-clamp-3">{service.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Agrega servicios para ver la vista previa
            </div>
          )}
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex gap-4 justify-end bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={handleSave}
          disabled={saving || selectedServiceIds.length < 3 || selectedServiceIds.length > 6}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
        >
          <Save size={20} />
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}