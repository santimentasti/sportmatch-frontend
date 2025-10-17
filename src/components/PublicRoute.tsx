import { Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rutas públicas (Login, Register)
 * 
 * Funcionalidad:
 * - Si el usuario YA está autenticado, redirige a home
 * - Si no está autenticado, muestra el contenido (login/register)
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useStore();

  // Si ya está autenticado, redirigir a home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, mostrar el contenido público
  return <>{children}</>;
};

