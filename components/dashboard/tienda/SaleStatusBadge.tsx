// components/dashboard/tienda/SaleStatusBadge.tsx
import React from 'react';
import { Clock, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface SaleStatusBadgeProps {
  status: 'PENDING' | 'IN_PROCESS' | 'COMPLETED' | 'CANCELLED';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    icon: Clock,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
  },
  IN_PROCESS: {
    label: 'En Proceso',
    icon: RefreshCw,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
  },
  COMPLETED: {
    label: 'Completada',
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
  },
  CANCELLED: {
    label: 'Cancelada',
    icon: XCircle,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
  },
};

export default function SaleStatusBadge({ status, size = 'md' }: SaleStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}`}
    >
      <Icon size={iconSize[size]} />
      {config.label}
    </span>
  );
}