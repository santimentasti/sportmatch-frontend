import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import LoadingSpinner from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * 
 * Funcionalidad:
 * - Verifica si el usuario está autenticado
 * - Valida el token con el backend
 * - Redirige al login si no está autenticado
 * - Mantiene la ubicación para redirect después del login
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, token, currentUser, logout } = useStore();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      // Si no hay token, no está autenticado
      if (!token || !currentUser) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        // Validar token con el backend
        // Intenta hacer una petición simple para verificar el token
        await apiService.getUserProfile(currentUser.id);
        
        // Si la petición es exitosa, el token es válido
        setIsValid(true);
      } catch (error: any) {
        // Si falla, el token es inválido (expirado, blacklisted, etc.)
        console.error('Token validation failed:', error);
        
        // Si es 401, token inválido/expirado
        // Si es error de red, permitir acceso (fail-open para mejor UX)
        if (error?.response?.status === 401) {
          logout(); // Limpiar estado solo si es 401
          setIsValid(false);
        } else {
          // Para otros errores (red, server down), permitir acceso
          setIsValid(true);
        }
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, currentUser, logout]);

  // Mostrar loading mientras valida
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Si no está autenticado o token inválido, redirigir al login
  if (!isAuthenticated || !isValid) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};

