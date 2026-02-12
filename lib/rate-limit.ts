// lib/rate-limit.ts
// ✅ SEGURIDAD: Rate limiting simple en memoria para endpoints públicos

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  /** Número máximo de peticiones permitidas en la ventana de tiempo */
  maxRequests: number;
  /** Ventana de tiempo en segundos */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Rate limiter en memoria.
 * @param identifier - Identificador único (IP, email, etc.)
 * @param config - Configuración del límite
 * @returns Resultado indicando si la petición está permitida
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  // Si no existe entrada o la ventana expiró, crear nueva
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowSeconds * 1000,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowSeconds * 1000,
    };
  }

  // Si está dentro de la ventana, verificar límite
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Incrementar contador
  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Obtener IP del request (compatible con Vercel)
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return '127.0.0.1';
}
