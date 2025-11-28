# AgentIAele - Frontend React

Panel de Superadministrador para gestión de contenido educativo.

## Descripción

Frontend del MVP de AgentIAele (Agentes de Inteligencia Artificial para Español Lengua Extranjera) - **MOMENTO 1: CLASE**.

Este panel permite a los superadministradores:
- Gestionar actividades de clase (CRUD completo)
- Organizar contenido por libro (EM1, EM2, EM3, EM4) y unidad (1-12)
- Configurar agentes IA disponibles por actividad
- Previsualizar actividades
- Importar/exportar datos

## Stack Tecnológico

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: CSS Modules
- **Base de Datos**: Neon.tech PostgreSQL 17 (6 tablas)
- **API**: Netlify Functions

## Estructura del Proyecto

```
agentiaele/
├── src/
│   ├── pages/
│   │   └── admin/              # Páginas de administración
│   │       ├── AdminDashboard.jsx
│   │       ├── ActivitiesManager.jsx
│   │       └── ...
│   ├── components/
│   │   └── admin/              # Componentes de administración
│   ├── services/               # Servicios API
│   │   └── activityService.js
│   ├── config/                 # Configuración
│   │   └── database.js
│   ├── utils/                  # Utilidades
│   ├── App.jsx                 # App principal con rutas
│   └── main.jsx                # Entry point
├── .env.example                # Variables de entorno de ejemplo
├── package.json
└── vite.config.js
```

## Instalación

1. **Clonar el repositorio**:
```bash
cd agentiaele
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita `.env` y configura:
- `DATABASE_URL`: Connection string de Neon.tech PostgreSQL (para Netlify Functions, sin VITE_ prefix)
- `VITE_API_URL`: URL de tu API (en desarrollo usa `/.netlify/functions` o `/api`)
- `VITE_DEEPSEEK_API_KEY`: API key de DeepSeek (para futuro)

**IMPORTANTE**: La variable `DATABASE_URL` NO lleva el prefijo `VITE_` porque se usa en Netlify Functions (backend), no en el frontend.

4. **Iniciar desarrollo local con Netlify CLI**:
```bash
# Instalar Netlify CLI globalmente (si no lo tienes)
npm install -g netlify-cli

# Iniciar dev server con Netlify Functions
netlify dev
```

El proyecto estará disponible en `http://localhost:8888` (con funciones backend funcionando).

**Alternativa sin Netlify CLI**: Si solo quieres ver el frontend:
```bash
npm run dev
```
El frontend estará en `http://localhost:5173` (pero las funciones NO funcionarán)

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo (frontend solo, puerto 5173)
- `netlify dev` - Inicia Netlify Dev con backend functions (puerto 8888)
- `npm run build` - Build de producción
- `npm run preview` - Preview de build de producción
- `npm run lint` - Ejecuta ESLint

## Características Principales

### Dashboard de Superadmin
- Estadísticas generales del sistema
- Accesos rápidos a funciones principales
- Información de tablas y agentes IA

### Gestor de Actividades
- **Listado** con filtros por libro, unidad y tipo
- **Búsqueda** en tiempo real
- **Crear** nuevas actividades
- **Editar** actividades existentes
- **Eliminar** actividades
- **Resumen** por libro

### Tipos de Actividades Soportados
1. Expresión oral (oral_expression)
2. Comprensión lectora (reading_comprehension)
3. Vocabulario (vocabulary)
4. Comprensión auditiva (listening_comprehension)
5. Interacción oral (oral_interaction)
6. Ortografía (spelling)
7. Pronunciación (pronunciation)
8. Gramática (grammar)
9. Escritura (writing)
10. Autoevaluación (self_assessment)

### Estructuras de Actividad
1. Opción múltiple (multiple_choice)
2. Rellenar huecos (fill_blank)
3. Verdadero/Falso (true_false)
4. Emparejar (matching)
5. Ordenar (ordering)
6. Respuesta corta (short_answer)
7. Respuesta abierta (open_ended)
8. Diálogo (dialogue)
9. Ensayo (essay)

## Agentes IA - MOMENTO 1

### Agentes Disponibles
1. **Translator** - Traducciones contextuales
2. **Vocabulary** - Explicaciones de palabras
3. **Personalizer** - Ejemplos personalizados
4. **Creative** - Historias y diálogos creativos

## API - Netlify Functions

### Endpoints Disponibles

Todas las funciones están en `netlify/functions/` y se acceden vía `/.netlify/functions/` o `/api/` (con redirect configurado).

#### Activities (CRUD completo)

**GET /api/activities**
- Listar todas las actividades
- Query params opcionales: `book_code`, `unit_number`, `activity_type`
- Ejemplo: `/api/activities?book_code=EM1&unit_number=1`

**GET /api/activities/stats**
- Estadísticas generales del sistema
- Retorna: totalActivities, activeBooks, totalUnits, activityTypes

**GET /api/activities/:id**
- Obtener una actividad específica por ID (UUID)

**POST /api/activities**
- Crear nueva actividad
- Body: JSON con todos los campos obligatorios
- Retorna: actividad creada con ID generado

**PUT /api/activities/:id**
- Actualizar actividad existente
- Body: JSON con campos a actualizar
- Retorna: actividad actualizada

**DELETE /api/activities/:id**
- Eliminar actividad por ID
- Retorna: mensaje de confirmación

### Campos Obligatorios para Actividades

```javascript
{
  book_code: "EM1",              // EM1, EM2, EM3, EM4
  unit_number: 1,                // 1-12
  activity_number: 1,            // número correlativo
  activity_type: "vocabulary",   // ver lista completa en README
  activity_structure: "multiple_choice",  // ver lista completa
  title: "Título de la actividad",
  instructions: "Instrucciones para el estudiante",
  content: { /* objeto JSON */ },
  available_agents: {
    translator: true,
    vocabulary: true,
    personalizer: false,
    creative: false
  },
  estimated_time: 15             // minutos (opcional)
}
```

## Base de Datos

### 6 Tablas - MOMENTO 1: CLASE
1. `user_profiles` - Perfiles de usuarios
2. `class_activities` - Actividades de clase
3. `class_sessions` - Sesiones de aprendizaje
4. `user_interactions` - Interacciones para ML
5. `user_achievements` - Sistema de logros
6. `ai_cache` - Caché de respuestas IA

## Estado del Desarrollo

### Completado ✅
- [x] Estructura base del proyecto React + Vite
- [x] React Router con navegación
- [x] Dashboard de superadministrador con estadísticas
- [x] Gestor de actividades con filtros y búsqueda
- [x] Formulario de creación/edición de actividades
- [x] Netlify Functions para CRUD de actividades
- [x] Conexión con Neon.tech PostgreSQL 17
- [x] Servicios API (activityService.js)
- [x] Configuración de base de datos (database.js)
- [x] Validación de datos de actividades

### Próximos Pasos 🚧
- [ ] Configurar variable DATABASE_URL en .env
- [ ] Probar Netlify Functions localmente
- [ ] Implementar vista previa de actividades
- [ ] Añadir sistema de importación/exportación
- [ ] Implementar página de detalle de actividad
- [ ] Integrar Auth0 para autenticación (futuro)

## Configuración de Producción

### Deploy en Netlify

1. Conectar repositorio a Netlify
2. Configurar build command: `npm run build`
3. Configurar publish directory: `dist`
4. Añadir variables de entorno en Netlify Dashboard

## Licencia

Este proyecto es privado y propietario. Todos los derechos reservados.

---

**Versión**: 0.1.0 (MVP)
**Última actualización**: Noviembre 2024
