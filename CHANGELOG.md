# 📝 Changelog - AgentiaELE

## Agentes de Inteligencia Artificial para Español como Lengua Extranjera

Todas las modificaciones notables del proyecto serán documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [0.7.0] - Integración Base de Datos Neon + Netlify Blobs (Noviembre 2025) 🗄️

### ✨ Agregado

#### **Integración con Neon.tech PostgreSQL** 📊
- **Tabla `cursos`** con campos en español:
  - `id` (UUID), `codigo`, `nombre`, `empresa`, `unidades`
  - `lecciones_por_unidad`, `nivel`, `periodo_dias`, `horas_proyectadas`
  - `portada`, `estado`, `progreso`, `created_at`, `updated_at`
- **Migración SQL** completa en `database/migration_cursos_espanol.sql`
- **4 cursos iniciales** migrados (EM1, EM2, EM3, EM4 - Español en Marcha)

#### **API de Cursos (Netlify Functions)** 🔌
- **`/api/courses`** - Nuevo endpoint CRUD completo:
  - `GET /api/courses` - Obtener todos los cursos
  - `GET /api/courses/:id` - Obtener curso por ID (UUID)
  - `GET /api/courses/stats` - Estadísticas de cursos
  - `POST /api/courses` - Crear nuevo curso
  - `PUT /api/courses/:id` - Actualizar curso existente
  - `DELETE /api/courses/:id` - Eliminar curso
- **Validaciones** de nivel (A1-C2) y progreso (0-100)
- **Tagged template literals** para queries SQL seguras

#### **Sistema de Upload con Netlify Blobs** 📁
- **`/api/upload`** - Nuevo endpoint para imágenes:
  - `POST /api/upload` - Subir imagen (retorna URL)
  - `GET /api/upload/:filename` - Obtener imagen
  - `DELETE /api/upload/:filename` - Eliminar imagen
- **Modo desarrollo**: Guarda en `public/uploads/` (local)
- **Modo producción**: Usa Netlify Blobs (cloud)
- **Soporte** para JPEG, PNG, GIF, WebP

#### **Servicio de Cursos (Frontend)** 🎨
- **`src/services/courseService.js`** - Nuevo servicio:
  - `getAllCourses()` - Obtener todos los cursos
  - `getCourseById()` - Obtener curso por ID
  - `createCourse()` - Crear curso
  - `updateCourse()` - Actualizar curso
  - `deleteCourse()` - Eliminar curso
  - `getCoursesStats()` - Estadísticas
  - `uploadPortada()` - Subir imagen de portada
  - `deletePortada()` - Eliminar imagen
  - `validateCourseData()` - Validación de datos

### 🔄 Cambiado

#### **ActivitiesManager - Conexión a Base de Datos**
- **Eliminados datos hardcodeados** - Ahora carga desde API
- **Formulario actualizado** con campos en español:
  - `codigo`, `nombre`, `empresa`, `unidades`, `lecciones_por_unidad`
  - `nivel`, `periodo_dias`, `horas_proyectadas`, `portada`
- **Upload de imágenes** integrado en el formulario
- **Estados de carga** (loading, uploading) con feedback visual
- **Manejo de errores** mejorado con mensajes en español

#### **Configuración de Netlify**
- **`netlify.toml`** actualizado para desarrollo local:
  - Puerto 8888 para Netlify Dev
  - Puerto 5173 para Vite
  - Redirect `/api/*` a funciones
- **`public/_redirects`** para producción (SPA routing)

### 🐛 Corregido
- **Error de tagged template literals** en `@neondatabase/serverless`
- **Conflicto de redirects** entre desarrollo y producción
- **Error de Vite** parseando HTML como JavaScript

### 📁 Archivos Nuevos
- `netlify/functions/courses.js` - API CRUD de cursos
- `netlify/functions/upload.js` - API de upload de imágenes
- `src/services/courseService.js` - Servicio frontend de cursos
- `database/migration_cursos_espanol.sql` - Migración SQL
- `public/_redirects` - Redirects para producción

### 📁 Archivos Modificados
- `src/pages/admin/ActivitiesManager.jsx` - Conectado a API
- `netlify.toml` - Configuración de desarrollo
- `.gitignore` - Ignorar uploads locales
- `package.json` - Añadido `@netlify/blobs`

### 📊 Métricas
- **1 tabla** nueva en Neon.tech (`cursos`)
- **2 funciones** Netlify nuevas (courses, upload)
- **1 servicio** frontend nuevo (courseService)
- **4 cursos** migrados a base de datos
- **100%** sincronización web ↔ base de datos

---

## [0.6.3] - Mejoras en Dashboard: Gráfico de Barras (Noviembre 2025) 📊

### 🔄 Cambiado

#### **Dashboard - Gráfico de Barras de Actividades** 📊
- **Ancho del gráfico reducido al 75%**:
  - Cambio de `width: 100%` a `width: 75%; max-width: 75%` en `.activity-chart-card`
  - Crea espacio en el lado derecho para visualizar el menú desplegable sin superposición
  - Mejora la experiencia de usuario al hacer visible la ventana de opciones del gráfico
- **Posicionamiento del menú desplegable**:
  - Menú ahora se alinea a la izquierda del botón de 3 puntos (⋮)
  - Aplicado `left: 0 !important; right: auto !important` en `.chart-menu-container .dropdown-menu`
  - Evita que el menú cubra el gráfico al desplegarse

### 🐛 Corregido
- Menú desplegable del gráfico de barras ahora es completamente visible al hacer click en los 3 puntos
- Eliminada superposición del menú con el contenido del gráfico

### 📁 Archivos Modificados
- `elias-mvp/src/pages/Dashboard.css`: Estilos del gráfico de barras y menú desplegable

---

## [0.6.2] - Sistema de Tarjetas de Actividad con Búsqueda (Noviembre 2025) 📋

### ✨ Agregado

#### **Tarjetas de Actividad** 🎴
- **Diseño de tarjetas** para actividades guardadas:
  - Información principal en mayúsculas, negrita, 24px:
    - UNIDAD (número)
    - SECCIÓN (nombre/número)
    - ACTIVIDAD (número)
  - Información secundaria en badges redondeados (border-radius: 50px):
    - Nombre del agente con fondo naranja pastel
    - Tipo de actividad con fondo naranja pastel
  - Borde naranja (#ff7918) de 2px alrededor de la tarjeta
  - Separador naranja entre información principal y secundaria
  - Efectos hover: elevación y cambio de sombra
  - Click en tarjeta abre modal en modo edición

#### **Sistema de Búsqueda de Actividades** 🔍
- **Barra de búsqueda** en CourseActivityPage:
  - Input con placeholder "Buscar"
  - Icono de búsqueda (Lucide Search)
  - Filtros con chips: Todas, Unidad, Sección, Actividad, Agente
  - Filtrado dinámico según tipo seleccionado
- **Lógica de filtrado**:
  - "Todas": Busca en todos los campos
  - "Unidad": Filtra solo por número de unidad
  - "Sección": Filtra solo por nombre de sección
  - "Actividad": Filtra solo por número de actividad
  - "Agente": Filtra solo por nombre del agente

### 🔧 Arreglado
- **Border-top persistente**: Se agregó `!important` y estado `:active` para mantener la línea separadora visible durante el click
- **Colores del sistema de diseño**: Se reemplazaron colores hardcodeados por variables CSS (`var(--primary-dark)`, `var(--primary-pastel-bg)`)

### 📁 Archivos Modificados
- `elias-mvp/src/pages/admin/CourseActivityPage.jsx`: Componente de página con tarjetas y búsqueda
- `elias-mvp/src/pages/admin/CourseActivityPage.css`: Estilos para tarjetas de actividad
- `elias-mvp/src/index.css`: Variables de diseño utilizadas en las tarjetas

---

## [0.6.1] - Actualización de Agentes y Búsqueda (Noviembre 2025) 🔍

### ✨ Agregado

#### **Sistema de Búsqueda de Agentes** 🔍
- **Barra de búsqueda** implementada en ActivityForm:
  - Icono de búsqueda (Lucide Search)
  - Input con placeholder "Buscar agentes..."
  - Border naranja con efecto focus (#8C430D)
  - Box-shadow al enfocar
- **Filtros de búsqueda** con chips visuales:
  - "Todos": Busca en nombre, descripción y tipo
  - "Nombre": Busca solo en nombres de agentes
  - "Descripción": Busca solo en descripciones
  - "Tipo": Busca solo en tipos de agente
  - Chips con estado activo (fondo naranja)
  - Transiciones suaves en hover
- **Función de filtrado** dinámica con switch statement
- **Estado de búsqueda** gestionado con React hooks

#### **Nuevos Agentes MOMENTO 1** 🤖
- **Ag. Improvisador**: "Responde de forma creativa y abierta a la actividad"
  - Icono: `/improvisador.png`
  - Reemplaza al anterior "Ag. Creatividad"

### 🔄 Cambiado

#### **Actualización de Agentes Existentes**
- **Ag. Expansor** (antes "Ag. Vocabulario"):
  - Nueva descripción: "Amplia el vocabulario según el nivel y el campo semántico"
  - Nuevo icono: `/expansor.png`
- **Ag. Enfocado** (antes "Ag. Personalización"):
  - Nueva descripción: "Traduce o adapta al español una expresión específica del estudiante"
  - Nuevo icono: `/enfocado.png`
- **Ag. Traducción**:
  - Icono actualizado: `/traduccion.png`

#### **Grid de Agentes**
- **Layout proporcional**: Cambiado de `repeat(6, 200px)` a `repeat(6, 1fr)`
- **Tarjetas expandibles**: width: 100% para ocupar todo el espacio disponible
- **Alineación vertical mejorada**: `justify-content: space-between` en `.agent-info`
- **Iconos con altura fija**: 110px con `flex-shrink: 0` y `flex-grow: 0`

#### **Imágenes "En construcción"**
- **placeholder1**: `/under constr1.png`
- **placeholder2**: `/underconstr2.png`
- **placeholder3**: `/under construct3.png`
- Cada tarjeta tiene una imagen diferente para variedad visual

#### **Estilos de Botones Homogeneizados**
- **btn-primary**: Color negro (#2c2c2c) en lugar de naranja
- **btn-secondary**: Fondo gris claro (#f5f5f5)
- **Border-radius**: 24px en todos los botones
- **Padding**: 12px 20px uniforme
- **Hover effect**: translateY(-2px) y box-shadow en ambos tipos

### 🐛 Corregido
- Problema de alineación de texto en tarjetas de agentes
- Inconsistencia de altura en iconos causaba desalineación vertical
- Botones con estilos diferentes ahora tienen diseño homogéneo
- Espacios vacíos en grid ahora se llenan proporcionalmente

### 📊 Métricas Actualización
- **4 agentes activos** con iconos personalizados
- **3 placeholders** "En construcción" con imágenes únicas
- **4 filtros de búsqueda** implementados
- **Grid responsive** con 6 columnas proporcionales
- **100% alineación vertical** en todas las tarjetas

---

## [0.6.0] - Actualización Sistema de Diseño (Noviembre 2025) 🎨

### 🎨 Sistema de Diseño Unificado - AgentiaELE

**Fecha**: Noviembre 2025

Actualización mayor del sistema de diseño con enfoque en coherencia visual, reutilización de componentes y experiencia de usuario mejorada.

### ✨ Agregado

#### **Sistema de Diseño Global** 🎨
- **Paleta de colores unificada** en CSS variables:
  - `--primary-dark: #e66b15` (naranja oscuro - color principal)
  - `--primary-light: #ff7918` (naranja claro)
  - `--primary-color: #ff6600` (naranja base)
  - Transparencias naranja: alpha-08, alpha-10, alpha-15, alpha-20, alpha-30, alpha-40
  - Transparencias blanco: alpha-40, alpha-60, alpha-80, alpha-95, alpha-98
- **Tipografías del sistema**:
  - `--font-headings: 'Dosis', sans-serif` (títulos y botones)
  - `--font-body: 'Inconsolata', monospace` (textos y formularios)
- **Componentes globales reutilizables** en `index.css`:
  - `.btn-primary` - Botón primario naranja con hover (#e66b15)
  - `.btn-secondary` - Botón secundario con fondo translúcido
  - `.btn-close-circular` - Botón circular de cierre (36px)
  - `.btn-close-compact` - Botón circular compacto (28px)
  - `.section-title` - Títulos de sección en mayúsculas
  - `.card-gradient-bg` - Fondo degradado para cards
  - `.modal-overlay` - Overlay oscuro para modales
  - `.modal-content` - Contenedor principal de modales

#### **Gestor de Actividades - ActivitiesManager** 📚
- **Modo 4: Navegación a página completa** implementado:
  - Click en botón expandir (ArrowUpRight) navega a `/activities/:courseId`
  - Vista completa del curso en CourseActivityPage
  - Botón de retorno con animación hover
  - Header con título, empresa y nivel del curso
  - Integración con ActivityForm en vista detallada
- **Nuevo formulario de creación de cursos** con diseño Material Design:
  - Layout de 3 columnas responsive
  - Campos de formulario con estilo coherente:
    - Inputs con fondo pastel naranja (`--primary-pastel-bg`)
    - Border-radius: 50px (pill shape)
    - Bordes naranja sutiles
  - **Labels con badge design**:
    - Iconos Lucide en color `--primary-dark`
    - Fondo naranja suave (`--primary-alpha-08`)
    - Border-radius: 20px
    - Padding: 6px 12px
  - **CustomSelect component**:
    - Dropdown personalizado con Dosis font
    - Navegación por teclado (flechas, Enter, Escape)
    - Estados hover y selected con colores coherentes
    - Animación de apertura suave
  - **Campo "Código del curso" añadido**:
    - Icono Key de Lucide
    - Posición: segunda fila en Columna 1 (debajo de Nombre del curso)
    - Placeholder: "Ej: EM-A1-001"
    - Estado gestionado en formData.courseCode
    - Disponible en creación y edición de cursos
- **Sistema de iconos únicos** sin duplicados:
  - Key: Código del curso
  - BookMarked: Nombre del curso
  - Building2: Empresa
  - FolderTree: Unidades
  - Hash: Lecciones por unidad
  - GraduationCap: Nivel de lengua
  - CalendarDays: Período (días)
  - Timer: Horas proyectadas
  - Upload: Portada
- **Grid de tarjetas de cursos**:
  - Cards con imagen de portada
  - Información del curso (título, instructor, horas, lecciones)
  - Barras de progreso visuales (20 barras)
  - Estados y porcentaje de completado
  - Botones de acción (menú y expandir)
- **Modal responsivo**:
  - Tamaño: 85vw (max: 1500px, min: 1200px)
  - Altura máxima: 90vh con scroll automático
  - Animación de entrada (slide-in)
  - Backdrop blur effect
  - Responsive en tablets (90vw) y móviles (95vw)

#### **Componentes React Nuevos**
- `CustomSelect.jsx` - Select dropdown personalizado con keyboard navigation
- `CustomSelect.css` - Estilos del componente select
- `ActivitiesManager.jsx` - Gestor completo de cursos y actividades
- `ActivitiesManager.css` - Estilos del gestor de actividades

### 🔄 Cambiado

#### **Estructura de Estilos**
- Migrados estilos de botones de archivos locales a `index.css` global
- Eliminados estilos duplicados en componentes individuales
- Centralización de variables CSS en `:root`
- Todos los componentes ahora heredan del sistema de diseño global

#### **Mejoras de UX/UI**
- Inputs y selects con mismo estilo pill (border-radius: 50px)
- Labels con diseño de badge integrado visualmente
- Iconos con color naranja oscuro coherente
- Hover states suaves en todos los elementos interactivos
- Transiciones CSS de 0.2s para fluidez

### 🐛 Corregido
- Error de CSS: Variable `--primary-alpha-15` mal formada
- Mismatch de imports de iconos que impedía abrir modal
- Duplicación de iconos en formularios
- Inconsistencia de colores en botones y labels
- **Scroll contenido dentro del contenedor de cursos**:
  - Altura fija en `.activities-manager`: `calc(100vh - 120px)`
  - Scroll ahora está contenido dentro del recuadro naranja (`.courses-container`)
  - Evita conflictos con el header al mantener scroll local
  - Scrollbar global de `index.css` se aplica automáticamente (4px, naranja pastel)

### 📊 Métricas Actualización
- **8 componentes globales** CSS reutilizables
- **12 variables CSS** de color definidas
- **2 tipografías** sistema (Dosis + Inconsolata)
- **2 componentes React** nuevos (ActivitiesManager + CustomSelect)
- **20 barras** de progreso visual en cards
- **8 iconos únicos** en formulario de curso
- **100% coherencia** visual en toda la aplicación
- **Scroll optimizado** dentro del contenedor sin conflictos con header

---

## [0.5.0] - MVP Beta (Noviembre 2025) 🚀

### 🎯 Versión MVP - 100 Usuarios Beta (1 semana)

**Fecha estimada**: Noviembre 2025 (última semana)

Versión MVP enfocada en **MOMENTO 1: CLASE** - Aprendizaje guiado con IA, sin evaluación ni seguimiento de progreso. Enfoque en exploración y práctica libre con agentes de IA.

### ✨ Agregado (MVP)

#### **Sistema de Agentes IA para MOMENTO 1** 🧠
- Implementado sistema de 4 agentes especializados para aprendizaje guiado:
  - **TranslatorAgent**: Traduce entre inglés y español con contexto
  - **VocabularyAgent**: Explica palabras, da sinónimos y antónimos
  - **PersonalizerAgent**: Adapta ejemplos a intereses personales del estudiante
  - **CreativeAgent**: Genera historias, diálogos y ejemplos creativos
- **BaseAgent**: Clase padre con lógica común
- **AgentService**: Orquestador de chat único "Eliana"
- Chat único por actividad con múltiples agentes respondiendo

#### **Base de Datos MVP - MOMENTO 1** 📊
- 6 tablas en **Neon.tech PostgreSQL 17** (GRATIS para siempre):
  1. `user_profiles` - Perfiles con preferencias de email (campo `send_chat_emails`)
  2. `class_activities` - Actividades de clase (EM1, EM2, EM3, EM4)
  3. `class_sessions` - Sesiones de clase con chat completo y detección de inactividad
  4. `user_interactions` - Interacciones para analytics y entrenamiento de IA
  5. `user_achievements` - Sistema de logros y gamificación básica
  6. `ai_cache` - Caché de respuestas de IA
- **Soporte multi-libro**: EM1, EM2, EM3, EM4 (Español en Marcha)
- **10 tipos de actividades**: oral_expression, reading_comprehension, vocabulary, listening_comprehension, oral_interaction, spelling, pronunciation, grammar, writing, self_assessment
- **9 estructuras de actividad**: multiple_choice, fill_blank, true_false, matching, ordering, short_answer, open_ended, dialogue, essay
- **Sistema dual de almacenamiento**:
  - `chat_messages` (JSONB) para UI/email del estudiante
  - `user_interactions` tabla separada para ML/analytics
- **Email consolidado**: Un email por sesión (no por actividad) con preferencia configurable
- **Detección de inactividad**: Campo `last_active_at` para enviar email al finalizar sesión
- 512 MB RAM, 3 GB storage
- Serverless PostgreSQL 17 con auto-scaling

#### **Autenticación Básica**
- Autenticación con **Auth0** (7,000 MAU gratis) o **Clerk** (10,000 MAU gratis)
- JWT tokens para autorización
- Netlify Functions con middleware de autenticación
- Rutas protegidas en frontend

#### **Dashboard de Usuario Básico** 👤
- Progreso simple
- Estadísticas personales básicas (tiempo, puntuación)
- Historial de actividades completadas

#### **Actividades Demo**
- 3-5 actividades demo por unidad
- Corrección automática básica
- Feedback simple

#### **Sistema de Gestión de Actividades - Admin** 🎨
- **Formulario de creación de actividades** con diseño Material Design
- **5 secciones organizadas**:
  1. Identificación (código libro, unidad, apartado)
  2. Estructura de actividad (tipo, estructura, tiempo estimado)
  3. Contenido de actividad (instrucciones + bloques modulares)
  4. Agentes IA disponibles (selección de agentes MOMENTO 1)
  5. Prompt personalizado para agentes IA
- **Sistema de bloques de contenido modulares** con 16 tipos:
  - Palabras de vocabulario, Texto de lectura, Audio transcrito
  - Preguntas cerradas, Texto para completar, Texto para relacionar
  - Texto para ordenar, Situaciones para hablar, Imagen
  - Frases, Palabras para crear frases, Vocabulario
  - Imagen para señalar, Vocabulario para relacionar
  - Texto preguntas abiertas, Texto escribir
- **Editor de prompts con inserción dinámica de campos** (estilo newsletter)
  - 10 campos principales del formulario
  - 24 campos de bloques de contenido
  - Total: 34 placeholders con sintaxis `{{campo}}`
- **Iconos Lucide** para identificación visual de bloques
- **Esquema de color unificado**: Naranja #8C430D en toda la interfaz
- **Menú de navegación en mayúsculas**: INICIO, ACTIVIDADES, AGENTES IA
- **Componentes React**: `ActivityForm.jsx`, `ContentBlock.jsx`
- **Estilos Material Design**: `ActivityForm.css`, `ContentBlock.css`

### 💰 Costos Estimados MVP
- $5-10/mes total (100 usuarios beta)
- Neon.tech PostgreSQL: $0 (GRATIS para siempre - 512 MB, 3 GB)
- Auth0/Clerk: $0 (Free tier - 7,000-10,000 MAU)
- Netlify: $0 (Free tier - 100 GB bandwidth/mes)
- DeepSeek API: ~$5-10/mes

✅ Infraestructura 100% gratis sin límite de tiempo

### 📊 Métricas MVP
- **6 tablas** en base de datos (MOMENTO 1: Clase)
- **4 agentes** de IA (Translator, Vocabulary, Personalizer, Creative)
- **1 chat** "Eliana" por actividad con múltiples agentes
- **1 rol** de usuario (Usuario básico)
- **10 tipos de actividades** soportados
- **9 estructuras de actividad** diferentes
- **16 tipos de bloques** de contenido modulares
- **2 componentes** principales (ActivityForm, ContentBlock)
- **34 placeholders** dinámicos para prompts de IA
- **1 semana** de desarrollo

---

## [1.0.0] - Versión Completa (Diciembre 2025 - Enero 2026) 🏆

### 🎉 Sistema Completo con MOMENTO 2: REPASO - 1000+ Usuarios

**Fecha estimada**: Diciembre 2025 - Enero 2026 (3-4 semanas después de validar MVP)

Esta versión añade **MOMENTO 2: REPASO** - Práctica personalizada con evaluación, dificultad adaptativa y seguimiento de progreso. Incluye agentes adicionales para corrección y evaluación.

### ✨ Agregado

#### **Sistema de Agentes IA Completo** 🧠
- Sistema ampliado a 8 agentes especializados (4 MOMENTO 1 + 4 MOMENTO 2):

  **MOMENTO 1 - Agentes de Aprendizaje** (ya implementados en MVP):
  - **TranslatorAgent**: Traducción contextual al idioma nativo
  - **VocabularyAgent**: Explicaciones de palabras, sinónimos y antónimos
  - **PersonalizerAgent**: Ejemplos adaptados a intereses personales
  - **CreativeAgent**: Historias, diálogos y ejemplos creativos

  **MOMENTO 2 - Agentes de Evaluación** (nuevos):
  - **CorrectorAgent**: Corrección gramatical y ortográfica con feedback detallado
  - **EvaluatorAgent**: Evaluación automática con puntuación 0-10
  - **TeacherAgent**: Explicaciones pedagógicas de gramática
  - **TutorAgent**: Asistencia personalizada y ayuda contextual

- **AgentService**: Orquestador central con patrón Singleton
- **BaseAgent**: Clase padre con lógica común para todos los agentes

#### **Sistema de Caché Inteligente** 💰
- **CacheService**: Servicio de caché agresivo con ahorro 70-80%
- Búsqueda exacta por hash SHA256
- Búsqueda por similitud con pg_trgm (85% umbral)
- Normalización de texto (sin tildes, mayúsculas, puntuación)
- Tabla `ai_response_cache` con 16 campos optimizados
- Función SQL `find_similar_cache()` para matching inteligente
- Métricas de ahorro en tiempo real (tokens, costos USD)
- Sistema de expiración (30 días por defecto)

#### **Base de Datos Completa** 📊
- **MOMENTO 1 (6 tablas existentes del MVP)**:
  1. `user_profiles` - Perfiles con roles y preferencias
  2. `class_activities` - Actividades de clase (EM1-EM4)
  3. `class_sessions` - Sesiones de aprendizaje guiado
  4. `user_interactions` - Interacciones para ML/analytics
  5. `user_achievements` - Sistema de logros
  6. `ai_cache` - Caché de respuestas IA

- **MOMENTO 2 (10 tablas nuevas para práctica y evaluación)**:
  7. `practice_activities` - Actividades de repaso con dificultad
  8. `practice_sessions` - Sesiones de práctica personalizada
  9. `user_progress` - Seguimiento de progreso por actividad
  10. `user_answers` - Historial de respuestas evaluadas
  11. `badges` - Insignias del sistema
  12. `user_badges` - Badges obtenidos por usuario
  13. `user_stats` - Estadísticas agregadas
  14. `notifications` - Sistema de notificaciones
  15. `agent_stats` - Estadísticas por agente/día
  16. `admin_alerts` - Alertas para superadmin

**Total**: 16 tablas en **Neon.tech PostgreSQL 17**

#### **Autenticación y Roles**
- Autenticación con **Auth0** o **Clerk**
- Sistema de roles: Usuario y Superadministrador (almacenado en PostgreSQL)
- JWT tokens validados en Netlify Functions
- SQL prepared statements para seguridad
- Políticas de acceso en backend y frontend
- Rutas protegidas en frontend

#### **Dashboard de Usuario** 👤
- Progreso visual con gráficos
- Sistema de badges y gamificación
- Historial de actividades completadas
- Estadísticas personales (tiempo, puntuación, racha)
- Modo práctica personalizado
- Resúmenes semanales/por unidad

#### **Dashboard de Superadmin** 👑
- Monitor de agentes IA en tiempo real (actualización cada 30s)
- Vista de todos los usuarios y su progreso
- Gestión completa de actividades (CRUD)
- Configuración de agentes por actividad
- Historial completo de interacciones IA con filtros avanzados
- Reportes de costos y uso de IA
- Análisis de eficiencia de caché (hit rate)
- Sistema de alertas (costos, errores, latencia)
- Exportación de datos (CSV, JSON, PDF)
- Gestión de badges y usuarios

#### **Gamificación** 🎮
- Sistema de niveles (1-7) con XP
- 20+ badges en 4 categorías (Progreso, Unidad, Achievement, Especiales)
- Sistema de puntos y recompensas
- Racha de días consecutivos
- Notificaciones al obtener badges

#### **Actividades Interactivas**
- Contenido completo nivel A1 "Español en Marcha"
- 5 tipos de actividades: conversación, gramática, vocabulario, listening, writing
- Asistente de IA integrado en cada actividad
- Corrección automática con feedback detallado
- Ejemplos personalizados por edad del usuario
- Traducción contextual al idioma nativo

#### **Servicios Frontend**
- `authService.js` - Autenticación y roles
- `activityService.js` - CRUD de actividades
- `progressService.js` - Gestión de progreso
- `aiService.js` - Interfaz hacia agentes
- `badgeService.js` - Sistema de badges
- `statsService.js` - Estadísticas y reportes
- `agentAnalyticsService.js` - Analytics de agentes (admin)
- `adminService.js` - Servicios administrativos

#### **Componentes React**
- Componentes de autenticación (Login, Register, ProtectedRoute)
- Componentes de actividades (ActivityCard, ActivityViewer, AIAssistant)
- Componentes de dashboard usuario (ProgressChart, BadgeDisplay, StatsCard)
- Componentes admin (AgentMonitor, AgentHistoryViewer, ActivityAgentConfig, CostAnalytics, AlertsPanel)
- Componentes comunes (Header, Sidebar, Modal, LoadingSpinner)

#### **Documentación**
- `PROYECTO-COMPLETO.md` - Arquitectura técnica completa con AWS RDS (incluye guía MVP integrada)
- `README.md` - Documentación general del proyecto
- `CHANGELOG.md` - Este archivo
- `EXPLICACION-AGENTES-PRINCIPIANTE.md` - Explicación detallada
- `ARQUITECTURA-ESCALABLE.md` - Guía de escalabilidad
- `LANGGRAPH-VS-CUSTOM.md` - Comparativa de arquitecturas
- `MIGRACION-SUPABASE.md` - Guía de migración a Supabase (próximamente)

### 🎯 Características Clave v1.0.0

- ✅ Sistema completo de agentes IA con caché inteligente
- ✅ Ahorro del 70-80% en costos de IA
- ✅ Dashboard dual (usuario + superadmin)
- ✅ Gamificación completa con badges y niveles
- ✅ Tracking detallado de progreso
- ✅ Analytics en tiempo real de agentes
- ✅ Reportes avanzados con exportación
- ✅ Sistema de alertas para admin
- ✅ Seguridad con JWT + SQL prepared statements

### 💰 Costos Estimados v1.0.0

**MVP (100 usuarios beta) - GRATIS PARA SIEMPRE**:
- $5-10/mes total (solo DeepSeek API)
- Neon.tech: $0 (GRATIS para siempre)
- Auth0/Clerk: $0 (Free Tier permanente)
- Netlify: $0 (Free Tier)
- ~80% cache hit rate

**Producción (500-1000 usuarios) - Con Neon.tech Free**:
- Sin caché: $52/mes
- Con caché: $18/mes (65% ahorro)
- Infraestructura: $0 (Neon.tech + Auth0/Clerk gratis)
- DeepSeek API: $8/mes con caché (81% ahorro en IA)

**Escalado (1000-5000 usuarios) - Neon.tech Pro**:
- Sin caché: $105/mes
- Con caché: $71/mes (32% ahorro)
- Neon.tech Pro: $19/mes
- Auth0 Essentials: $25/mes
- Netlify Pro: $19/mes
- DeepSeek API: $8/mes con caché

**Alternativa (cuando necesites features avanzados)**:
- Opción Supabase Pro: $52/mes con caché (BD + Auth + Storage integrado)

### 📊 Métricas v1.0.0

- **16 tablas** en base de datos (6 MOMENTO 1 + 10 MOMENTO 2)
- **8 agentes** especializados de IA (4 aprendizaje + 4 evaluación)
- **2 momentos** de interacción (Clase + Repaso)
- **20+ badges** implementados
- **7 niveles** de progreso
- **10 tipos** de actividades
- **2 roles** de usuario
- **10+ servicios** frontend
- **15+ componentes** React

---

## [Próximas Versiones]

### [2.0.0] - Planificado (2025)

#### 🎤 Audio y Voz
- [ ] Reconocimiento de voz para ejercicios de pronunciación
- [ ] Text-to-speech para escuchar frases
- [ ] Evaluación de pronunciación con IA

#### 📱 Móvil
- [ ] App móvil con React Native
- [ ] Sincronización offline
- [ ] Notificaciones push

#### 👥 Social
- [ ] Modo multijugador/competitivo
- [ ] Chat entre estudiantes
- [ ] Foros de discusión
- [ ] Leaderboards globales

#### 📚 Contenido
- [ ] Nivel A2 completo
- [ ] Inicio de nivel B1
- [ ] Vídeos explicativos integrados
- [ ] Tests de nivel automáticos

### [3.0.0] - Futuro (2026)

#### 🤖 IA Avanzada
- [ ] Generación automática de actividades
- [ ] Análisis predictivo de aprendizaje
- [ ] Recomendaciones personalizadas con ML
- [ ] Tests adaptativos con dificultad dinámica

#### 🌍 Expansión
- [ ] Soporte para otros idiomas (inglés, francés, alemán)
- [ ] Certificaciones oficiales
- [ ] Integración con DELE/SIELE

---

## Convenciones de Versionado

- **MAJOR** (X.0.0): Cambios incompatibles con versiones anteriores
- **MINOR** (1.X.0): Nueva funcionalidad compatible con versiones anteriores
- **PATCH** (1.0.X): Corrección de bugs compatible

### Tipos de Cambios

- `✨ Agregado` - Nueva funcionalidad
- `🔄 Cambiado` - Cambios en funcionalidad existente
- `⚠️ Deprecado` - Funcionalidad que será eliminada
- `🗑️ Eliminado` - Funcionalidad eliminada
- `🐛 Corregido` - Corrección de bugs
- `🔒 Seguridad` - Parches de seguridad

---

**Nota**: Este changelog se actualiza con cada versión del proyecto. Para detalles técnicos de implementación, consulta [PROYECTO-COMPLETO.md](PROYECTO-COMPLETO.md).
