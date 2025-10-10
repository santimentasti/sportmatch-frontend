# 🏆 SportMatch - Frontend

> Aplicación web moderna para conectar deportistas y organizar encuentros deportivos

[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3+-06B6D4.svg?logo=tailwindcss)](https://tailwindcss.com/)

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Componentes Principales](#-componentes-principales)
- [Estado Global](#-estado-global)
- [Testing](#-testing)
- [Build y Despliegue](#-build-y-despliegue)
- [PWA](#-pwa)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🎯 Descripción

**SportMatch Frontend** es una aplicación web progresiva (PWA) que permite a los deportistas encontrar compañeros y rivales para practicar sus deportes favoritos. Con una interfaz intuitiva tipo "Tinder", los usuarios pueden hacer match con otros jugadores basándose en ubicación, nivel de habilidad y deporte.

### 🎮 Características Principales

- **Sistema de Swipe:** Interfaz tipo Tinder para encontrar jugadores
- **Perfiles Deportivos:** Configura múltiples deportes y niveles de habilidad
- **Matching en Tiempo Real:** Notificaciones instantáneas de nuevos matches
- **Chat Integrado:** Comunicación directa con tus matches
- **Geolocalización:** Encuentra jugadores cerca de ti
- **Responsive Design:** Funciona en desktop, tablet y móvil
- **PWA:** Instálalo como app nativa

## ✨ Características

### ✅ Implementadas
- ✅ Autenticación con JWT y refresh tokens
- ✅ Sistema de registro y login
- ✅ Perfil de usuario editable
- ✅ Configuración de deportes y niveles
- ✅ Sistema de swipe con animaciones
- ✅ Detección de matches mutuos
- ✅ Chat básico entre matches
- ✅ Geolocalización (GPS + manual)
- ✅ Diseño responsive
- ✅ PWA instalable
- ✅ Dark mode ready

### 🚧 En Desarrollo
- 🚧 Notificaciones push
- 🚧 Sistema de calificaciones
- 🚧 Mapa interactivo de sedes
- 🚧 Calendario de partidos

### 📅 Futuro
- 📅 Videollamadas
- 📅 Compartir en redes sociales
- 📅 Torneos y ligas
- 📅 Sistema de logros

## 🛠 Tecnologías

### Core
- **React 18.2** - Librería UI
- **TypeScript 5.0** - Type safety
- **Vite 5.0** - Build tool ultra-rápido
- **TailwindCSS 3.3** - Utility-first CSS

### Estado y Data Fetching
- **Zustand** - State management simple y ligero
- **React Query (TanStack Query)** - Data fetching y caching
- **Axios** - Cliente HTTP

### UI y Animaciones
- **Framer Motion** - Animaciones fluidas
- **Lucide React** - Iconos modernos
- **React Hot Toast** - Notificaciones elegantes

### Routing y Forms
- **React Router v6** - Navegación SPA
- **React Hook Form** - Manejo de formularios

### Desarrollo
- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 📦 Requisitos Previos

- **Node.js 18+** ([Descargar](https://nodejs.org/))
- **npm 9+** o **pnpm 8+** (recomendado)
- Backend de SportMatch corriendo (ver [sportmatch-backend](../sportmatch-backend))

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/sportmatch-frontend.git
cd sportmatch-frontend
```

### 2. Instalar dependencias
```bash
# Con npm
npm install

# Con pnpm (recomendado)
pnpm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz:

```env
# API Backend
VITE_API_URL=http://localhost:8080/api

# WebSocket (para chat en tiempo real - futuro)
VITE_WS_URL=ws://localhost:8080/ws

# Google Maps (opcional - para mapa de sedes)
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en: `http://localhost:5173`

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Requerido | Default |
|----------|-------------|-----------|---------|
| `VITE_API_URL` | URL del backend API | Sí | `http://localhost:8080/api` |
| `VITE_WS_URL` | URL WebSocket | No | - |
| `VITE_GOOGLE_MAPS_API_KEY` | API Key de Google Maps | No | - |

### Configuración de TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Configuración de Tailwind (`tailwind.config.js`)

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ... más colores
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

## 📖 Uso

### Flujo de Usuario Básico

1. **Registro/Login**
   ```
   http://localhost:5173/login
   ```

2. **Configurar Perfil Deportivo**
   - Seleccionar ubicación (GPS o manual)
   - Elegir deportes
   - Definir nivel de habilidad

3. **Explorar Deportes**
   ```
   http://localhost:5173/sports
   ```

4. **Sistema de Swipe**
   - Seleccionar un deporte
   - Swipe derecha (like) o izquierda (dislike)
   - ¡Match automático si hay reciprocidad!

5. **Chat con Matches**
   - Coordinar encuentros
   - Confirmar ubicación y horario

## 📁 Estructura del Proyecto

```
sportmatch-frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service Worker
├── src/
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Componentes UI base
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── InstallPWA.tsx
│   │   ├── Layout.tsx        # Layout principal
│   │   └── UserProfileForm.tsx
│   ├── pages/                # Páginas/Rutas
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── SportProfile.tsx
│   │   ├── SportSelection.tsx
│   │   ├── Matching.tsx
│   │   └── NotFound.tsx
│   ├── services/             # Servicios externos
│   │   ├── api.ts           # Cliente API (Axios)
│   │   └── websocket.ts     # WebSocket client
│   ├── store/               # Estado global
│   │   └── useStore.ts      # Zustand store
│   ├── hooks/               # Custom hooks
│   │   ├── useApi.ts        # React Query hooks
│   │   ├── useMatching.ts
│   │   └── usePWA.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── config/              # Configuraciones
│   │   └── queryClient.ts   # React Query config
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globales
├── .env                      # Variables de entorno
├── .env.example             # Ejemplo de .env
├── vite.config.ts           # Configuración Vite
├── tailwind.config.js       # Configuración Tailwind
├── tsconfig.json            # Configuración TypeScript
└── package.json
```

## 🧩 Componentes Principales

### Layout
```tsx
// src/components/Layout.tsx
// Componente de layout con navegación y autenticación
```

### Matching
```tsx
// src/pages/Matching.tsx
// Sistema de swipe con animaciones Framer Motion
// - Drag & drop
// - Detección de matches
// - Modal de confirmación
```

### SportProfile
```tsx
// src/pages/SportProfile.tsx
// Configuración de deportes y nivel
// - Geolocalización GPS + manual
// - Selección múltiple de deportes
// - Niveles: Beginner/Intermediate/Advanced/Expert
```

## 🗄️ Estado Global

### Zustand Store

```typescript
// src/store/useStore.ts
interface AppState {
  // Auth
  currentUser: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Sports & Matching
  sports: Sport[]
  potentialMatches: User[]
  currentMatchIndex: number
  
  // Location
  userLocation: { latitude: number; longitude: number } | null
  maxDistance: number
  
  // Actions
  setCurrentUser: (user: User | null) => void
  logout: () => void
  // ... más acciones
}
```

### React Query

```typescript
// src/hooks/useApi.ts
// Custom hooks con React Query
export const useSports = () => useQuery({...})
export const useMatching = () => useMutation({...})
export const useLogin = () => useMutation({...})
```

## 🧪 Testing

```bash
# Ejecutar tests (próximamente)
npm test

# Tests con coverage
npm run test:coverage

# Tests E2E (próximamente)
npm run test:e2e
```

### Testing Stack (Planeado)
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

## 📦 Build y Despliegue

### Desarrollo
```bash
npm run dev
```

### Preview de producción
```bash
npm run build
npm run preview
```

### Build para producción
```bash
npm run build
```

Output en `dist/`:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── manifest.json
```

### Despliegue

#### Vercel (Recomendado)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

#### Google Cloud Storage + CDN
```bash
# Build
npm run build

# Upload
gsutil -m rsync -r dist/ gs://your-bucket-name/

# Configure CDN
gcloud compute backend-buckets create sportmatch-frontend \
  --gcs-bucket-name=your-bucket-name
```

## 📱 PWA

### Características PWA

- ✅ **Instalable:** Agrega a pantalla de inicio
- ✅ **Offline-ready:** Service Worker con cache
- ✅ **Responsive:** Funciona en todos los tamaños
- ✅ **App-like:** Sin barras del navegador

### Configuración PWA

```json
// public/manifest.json
{
  "name": "SportMatch",
  "short_name": "SportMatch",
  "description": "Encuentra compañeros deportivos",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "display": "standalone",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Instalación PWA

```typescript
// src/hooks/usePWA.ts
// Detecta si la PWA es instalable y muestra prompt
const { isInstallable, installApp } = usePWA()
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guidelines
- Usa TypeScript estrictamente
- Sigue las convenciones de nombres (camelCase, PascalCase)
- Máximo 20 líneas por función
- Escribe tests para nuevas features
- Documenta componentes complejos

## 🗺️ Roadmap

Ver [Roadmap completo](../ROADMAP.md)

### v1.0 (MVP) ✅
- [x] Autenticación
- [x] Perfiles deportivos
- [x] Sistema de matching
- [x] Chat básico

### v1.1 (En progreso)
- [ ] Notificaciones push
- [ ] Mejoras en UI/UX
- [ ] Performance optimizations
- [ ] Tests automatizados

### v2.0 (Futuro)
- [ ] Mapa interactivo
- [ ] Sistema de torneos
- [ ] Videollamadas
- [ ] Analytics dashboard

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE)

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tuusuario](https://github.com/tuusuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tuperfil)

## 🙏 Agradecimientos

- React team por una librería increíble
- Vercel por Vite
- Tailwind Labs por TailwindCSS
- Todos los beta testers

---

<div align="center">
  <strong>⭐ Si te gusta el proyecto, dale una estrella!</strong>
  <br>
  <sub>Hecho con ❤️ para deportistas</sub>
</div>
