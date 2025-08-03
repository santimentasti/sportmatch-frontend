# SportMatch Frontend

Frontend de la aplicación SportMatch - Conecta con jugadores de tu deporte.

## 🚀 Tecnologías

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router DOM**
- **Zustand** (state management)
- **Axios** (HTTP Client)
- **Framer Motion** (animations)
- **React Hook Form** (forms)
- **Zod** (validation)
- **Lucide React** (icons)
- **React Hot Toast** (notifications)
- **PWA** (Progressive Web App)

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Git

## ⚙️ Instalación y Ejecución

### Opción 1: Ejecución Local

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/sportmatch-frontend.git
cd sportmatch-frontend
```

2. **Instalar dependencias:**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno:**
```bash
# Crear archivo .env en la raíz del proyecto
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=SportMatch
```

4. **Ejecutar en modo desarrollo:**
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Opción 2: Docker

1. **Construir la imagen:**
```bash
docker build -t sportmatch-frontend .
```

2. **Ejecutar el contenedor:**
```bash
docker run -p 3000:3000 sportmatch-frontend
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Layout.tsx
│   └── ui/
│       ├── LoadingSpinner.tsx
│       └── InstallPWA.tsx
├── hooks/
│   └── usePWA.ts
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Matching.tsx
│   ├── NotFound.tsx
│   ├── Profile.tsx
│   └── SportSelection.tsx
├── services/
│   └── api.ts
├── store/
│   └── useStore.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Características

### ✅ Funcionalidades Implementadas

- **Autenticación completa** - Login/registro con JWT
- **Selección de deportes** - Filtros por tipo (individual/grupal)
- **Sistema de matching** - Interfaz tipo Tinder con swipe
- **Perfil de usuario** - Edición de datos y configuración
- **Geolocalización** - Detección automática de ubicación
- **PWA** - Instalable como aplicación móvil
- **Responsive design** - Optimizado para móvil y desktop
- **Animaciones** - Transiciones suaves con Framer Motion
- **Notificaciones** - Feedback visual con React Hot Toast

### 📱 PWA (Progressive Web App)

- **Instalación como app** - Añadir a pantalla de inicio
- **Funcionamiento offline** - Caché de recursos esenciales
- **Notificaciones push** - Alertas en tiempo real
- **Interfaz nativa** - Experiencia similar a app móvil

## 🔧 Configuración

### Vite Config
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.sportmatch\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      },
      manifest: {
        name: 'SportMatch - Conecta con jugadores',
        short_name: 'SportMatch',
        description: 'Aplicación tipo Tinder para conectar personas que quieren jugar el mismo deporte',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### Tailwind Config
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      }
    },
  },
  plugins: [],
}
```

## 📱 Páginas y Componentes

### Páginas Principales
- **Home** - Página de bienvenida con información de la app
- **Login** - Autenticación (login/registro)
- **SportSelection** - Selección de deporte para matching
- **Matching** - Interfaz de swipe tipo Tinder
- **Profile** - Gestión del perfil de usuario
- **NotFound** - Página 404

### Componentes UI
- **Layout** - Estructura principal con navegación
- **LoadingSpinner** - Indicador de carga
- **InstallPWA** - Banner de instalación PWA

## 🔌 Integración con Backend

### API Service
```typescript
class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor para JWT
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor para manejo de errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }
}
```

### Estado Global (Zustand)
```typescript
interface AppState {
  // Auth state
  currentUser: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Sports state
  sports: Sport[]
  selectedSport: Sport | null
  
  // Matching state
  potentialMatches: User[]
  currentMatchIndex: number
  
  // UI state
  isLoading: boolean
  
  // Actions
  setCurrentUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  // ... más acciones
}
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Ejecutar tests con UI
npm run test:ui

# Ejecutar tests con coverage
npm run test:coverage
```

## 📦 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## 📦 Docker

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:8080/api
    depends_on:
      - backend

  backend:
    image: sportmatch-backend:latest
    ports:
      - "8080:8080"
```

## 🚀 Despliegue

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Netlify
```bash
# Construir el proyecto
npm run build

# Desplegar manualmente o con CI/CD
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- **Desarrollador:** Tu Nombre
- **Email:** tu-email@ejemplo.com
- **GitHub:** [@tu-usuario](https://github.com/tu-usuario)

## 🔗 Enlaces Relacionados

- [Backend Repository](https://github.com/tu-usuario/sportmatch-backend)
- [Documentación PWA](docs/MOBILE.md)
- [Guía de Despliegue](docs/DEPLOYMENT.md) 