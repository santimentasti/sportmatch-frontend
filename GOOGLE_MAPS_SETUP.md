# 🗺️ Configuración de Google Maps API

## Paso 1: Obtener API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - **Maps JavaScript API**
   - **Geocoding API** (opcional, para búsquedas avanzadas)

4. Ve a **Credenciales** → **Crear credenciales** → **Clave de API**
5. Copia la API Key generada

## Paso 2: Configurar Restricciones (Recomendado)

### Restricciones de API
En la configuración de tu API Key, limita el acceso a:
- ✅ Maps JavaScript API
- ✅ Geocoding API

### Restricciones de Aplicación
**Para desarrollo local:**
```
HTTP referrers (sitios web):
- http://localhost:*
- http://127.0.0.1:*
```

**Para producción:**
```
HTTP referrers (sitios web):
- https://tudominio.com/*
- https://www.tudominio.com/*
```

## Paso 3: Configurar Variable de Entorno

Crea un archivo `.env` en la raíz del proyecto frontend:

```bash
cp .env.example .env
```

Edita `.env` y agrega tu API Key:

```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI
```

⚠️ **Importante:** Nunca subas el archivo `.env` a Git (ya está en `.gitignore`)

## Paso 4: Instalar Dependencias

```bash
npm install @react-google-maps/api
```

## Paso 5: Probar el Mapa

1. Inicia el backend (debe tener datos de venues en la BD)
2. Inicia el frontend: `npm run dev`
3. Navega a `/venues` en tu navegador
4. Deberías ver el mapa con marcadores de sedes deportivas

## Costos y Cuotas

### Nivel Gratuito de Google Maps
- **$200 USD en créditos mensuales gratis**
- Equivale a aproximadamente:
  - 28,000 cargas de mapa por mes
  - 40,000 geocodificaciones por mes

### Para MVP (uso esperado)
Con 100 usuarios activos al día:
- ~3,000 cargas de mapa/mes
- Costo: **$0** (dentro del nivel gratuito)

### Monitoreo de Uso
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **APIs y servicios** → **Panel de control**
4. Revisa el uso diario de Maps JavaScript API

## Alternativas Gratuitas (Para MVP sin tarjeta)

Si no quieres usar Google Maps, puedes usar **Leaflet + OpenStreetMap**:

### Instalación
```bash
npm install react-leaflet leaflet
npm install -D @types/leaflet
```

### Ventajas
- ✅ 100% gratuito
- ✅ Sin API Key
- ✅ Sin límites de uso
- ✅ Open source

### Desventajas
- ❌ Menos features que Google Maps
- ❌ Calidad de datos variable
- ❌ Sin soporte de Google

## Troubleshooting

### Error: "This page can't load Google Maps correctly"
**Solución:** Verifica que:
1. La API Key esté correctamente configurada en `.env`
2. Maps JavaScript API esté habilitada en Google Cloud
3. Las restricciones de HTTP referrer incluyan tu dominio/localhost

### Error: "RefererNotAllowedMapError"
**Solución:** Agrega tu dominio a las restricciones de HTTP referrers en Google Cloud Console

### El mapa no carga
**Solución:**
1. Abre la consola del navegador (F12)
2. Verifica errores de red o de API
3. Confirma que `VITE_GOOGLE_MAPS_API_KEY` esté definida
4. Ejecuta: `console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)`

### No aparecen marcadores
**Solución:**
1. Verifica que el backend esté corriendo
2. Confirma que existan venues en la base de datos:
   ```sql
   SELECT COUNT(*) FROM venues WHERE is_active = true;
   ```
3. Ejecuta el script `init-scripts/05-venue-data.sql`
4. Verifica que el endpoint `/api/venues/nearby` responda correctamente

## Recursos Útiles

- [Documentación oficial de Google Maps](https://developers.google.com/maps/documentation)
- [React Google Maps API Docs](https://react-google-maps-api-docs.netlify.app/)
- [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)
- [Leaflet (alternativa gratuita)](https://leafletjs.com/)

