# React Query en SportMatch

Este proyecto utiliza **React Query (TanStack Query)** para la gestión eficiente del estado del servidor y la sincronización de datos.

## 🚀 Características Implementadas

### ✅ Configuración Básica
- **QueryClient** configurado con opciones optimizadas
- **QueryClientProvider** en el nivel raíz de la aplicación
- **Configuración de reintentos** con backoff exponencial
- **Gestión de caché** inteligente

### ✅ Hooks Personalizados
- **`useApi.ts`** - Hooks básicos para todas las operaciones CRUD
- **`useMatching.ts`** - Hook avanzado para el sistema de matching
- **Gestión automática de caché** y invalidación

### ✅ Funcionalidades Avanzadas
- **Optimistic Updates** para mejor UX
- **Infinite Queries** para paginación
- **Manejo automático de errores** y reintentos
- **Sincronización en tiempo real** de datos

## 📚 Cómo Usar

### 1. Hooks Básicos (useApi.ts)

```typescript
import { useSports, useUser, useUpdateUserLocation } from '@/hooks/useApi'

// Obtener deportes
const { data: sports, isLoading, error } = useSports()

// Obtener usuario específico
const { data: user } = useUser(userId)

// Actualizar ubicación del usuario
const updateLocation = useUpdateUserLocation()
const handleUpdate = () => {
  updateLocation.mutate({ id: userId, latitude, longitude })
}
```

### 2. Hook de Matching Avanzado

```typescript
import { useMatching } from '@/hooks/useMatching'

const {
  potentialMatches,
  processLike,
  processDislike,
  isLoading,
  hasNextPage,
  loadNextPage
} = useMatching(userId, sportId)

// Procesar like con actualización optimista
await processLike(targetUserId)

// Cargar más resultados
if (hasNextPage) {
  loadNextPage()
}
```

### 3. Mutaciones con React Query

```typescript
const mutation = useMutation({
  mutationFn: apiService.someFunction,
  onSuccess: (data) => {
    // Invalidar queries relacionadas
    queryClient.invalidateQueries({ queryKey: ['related-data'] })
    
    // Mostrar notificación
    toast.success('Operación exitosa')
  },
  onError: (error) => {
    toast.error('Error en la operación')
  }
})

// Usar la mutación
await mutation.mutateAsync(data)
```

## 🔧 Configuración del QueryClient

### Opciones Principales

```typescript
// src/config/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutos
      gcTime: 10 * 60 * 1000,          // 10 minutos
      retry: 3,                         // 3 reintentos
      refetchOnWindowFocus: true,       // Refetch al enfocar ventana
      refetchOnReconnect: true,         // Refetch al reconectar
    },
    mutations: {
      retry: 2,                         // 2 reintentos para mutaciones
    }
  }
})
```

### Configuración por Query

```typescript
const { data } = useQuery({
  queryKey: ['sports'],
  queryFn: () => apiService.getSports(),
  staleTime: 10 * 60 * 1000,          // 10 minutos para deportes
  gcTime: 30 * 60 * 1000,             // 30 minutos en caché
  enabled: !!userId,                   // Solo ejecutar si hay userId
})
```

## 🎯 Patrones de Uso

### 1. Gestión de Estado de Carga

```typescript
const { data, isLoading, isError, error } = useQuery({...})

if (isLoading) return <LoadingSpinner />
if (isError) return <ErrorMessage error={error} />
if (!data) return <EmptyState />

return <DataDisplay data={data} />
```

### 2. Invalidación de Caché

```typescript
const queryClient = useQueryClient()

// Invalidar queries específicas
queryClient.invalidateQueries({ queryKey: ['users'] })

// Invalidar queries relacionadas
queryClient.invalidateQueries({ 
  queryKey: ['user'], 
  predicate: (query) => query.queryKey[1] === userId 
})
```

### 3. Actualizaciones Optimistas

```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    // Cancelar queries en curso
    await queryClient.cancelQueries({ queryKey: ['user', newUser.id] })
    
    // Snapshot del valor anterior
    const previousUser = queryClient.getQueryData(['user', newUser.id])
    
    // Actualización optimista
    queryClient.setQueryData(['user', newUser.id], newUser)
    
    return { previousUser }
  },
  onError: (err, newUser, context) => {
    // Revertir en caso de error
    queryClient.setQueryData(['user', newUser.id], context?.previousUser)
  },
  onSettled: () => {
    // Refetch para sincronizar
    queryClient.invalidateQueries({ queryKey: ['user'] })
  }
})
```

## 🚨 Manejo de Errores

### Configuración Global

```typescript
// src/main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // No reintentar en errores 4xx
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      }
    }
  }
})
```

### Manejo por Query

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['sports'],
  queryFn: () => apiService.getSports(),
  retry: (failureCount, error) => {
    // Lógica personalizada de reintento
    return failureCount < 2 && error.status !== 404
  }
})
```

## 📱 Beneficios para SportMatch

### 1. **Performance**
- Caché inteligente de deportes y usuarios
- Refetch automático solo cuando es necesario
- Actualizaciones optimistas para mejor UX

### 2. **Experiencia de Usuario**
- Estados de carga automáticos
- Manejo de errores consistente
- Sincronización en tiempo real

### 3. **Mantenibilidad**
- Separación clara de lógica de datos
- Hooks reutilizables
- Gestión centralizada del estado del servidor

## 🔄 Migración desde Estado Local

### Antes (con useState + useEffect)

```typescript
const [sports, setSports] = useState([])
const [isLoading, setIsLoading] = useState(false)

useEffect(() => {
  const fetchSports = async () => {
    setIsLoading(true)
    try {
      const data = await apiService.getSports()
      setSports(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  fetchSports()
}, [])
```

### Después (con React Query)

```typescript
const { data: sports, isLoading, error } = useSports()

// ¡Eso es todo! React Query maneja el resto automáticamente
```

## 🧪 Testing

### Mocking de Queries

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)
```

## 📚 Recursos Adicionales

- [Documentación oficial de React Query](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Patrones de React Query](https://tanstack.com/query/latest/docs/react/guides/important-defaults)

## 🎉 ¡Listo para Usar!

React Query está completamente configurado en tu proyecto SportMatch. Los hooks personalizados te proporcionan una API limpia y eficiente para manejar todos los datos del servidor.

**¡Disfruta de una gestión de estado más inteligente y una mejor experiencia de usuario!** 🚀
