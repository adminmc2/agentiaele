# 🔍 ANÁLISIS DE MODIFICACIONES - Sistema de Cursos

## ⚠️ IMPORTANTE: Desincronización encontrada

El **frontend** tiene campos nuevos que **NO EXISTEN** en el schema de la base de datos actual.

---

## 📊 COMPARACIÓN: Frontend vs Base de Datos

### **Frontend - ActivityForm.jsx** (Líneas 66-87)

```javascript
const [formData, setFormData] = useState({
  book_code: 'EM1',
  unit_number: 1,
  apartado: '',              // ❌ NO EXISTE EN BD
  activity_number: 1,
  activity_type: 'vocabulary',
  activity_structure: 'multiple_choice',
  instructions: '',
  activity_text: '',         // ❌ NO EXISTE EN BD
  content: {
    blocks: []
  },
  chat_display_name: '',     // ❌ NO EXISTE EN BD
  ai_prompt: '',             // ❌ NO EXISTE EN BD
  available_agents: {
    translator: true,
    vocabulary: true,
    personalizer: false,
    creative: false
  },
  estimated_time: 15
});
```

### **Base de Datos - schema_mvp.sql** (Líneas 34-54)

```sql
CREATE TABLE IF NOT EXISTS class_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_code VARCHAR(50) NOT NULL,
    unit_number INTEGER NOT NULL,
    activity_number INTEGER NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_structure VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,      -- ✅ EXISTE pero no en form
    instructions TEXT NOT NULL,
    content JSONB NOT NULL,
    available_agents JSONB NOT NULL,
    estimated_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🆕 CAMPOS NUEVOS EN FRONTEND (No en BD)

### **1. `apartado` (Sección/Apartado)**
- **Tipo**: String
- **Uso**: Organizar actividades por sección del libro
- **Ejemplos**: "Gramática", "Lectura", "Vocabulario"
- **Ubicación**: CourseActivityPage.jsx línea 69, ActivityForm.jsx línea 69

```javascript
// Uso en CourseActivityPage
{
  apartado: 'Gramática',  // "Sección del libro"
}
```

### **2. `activity_text` (Texto de la actividad)**
- **Tipo**: String (texto largo)
- **Uso**: Contenido textual principal de la actividad
- **Diferencia con `instructions`**:
  - `instructions`: Qué debe hacer el estudiante
  - `activity_text`: El texto/lectura/contenido de la actividad
- **Ubicación**: ActivityForm.jsx línea 74

### **3. `chat_display_name` (Nombre del agente en chat)**
- **Tipo**: String
- **Uso**: Nombre personalizado del agente para esta actividad específica
- **Ejemplos**: "Ag. Expansor", "Ag. Traducción", "Ag. Improvisador"
- **Ubicación**: ActivityForm.jsx línea 78, CourseActivityPage.jsx línea 72

```javascript
// Permite personalizar nombre del agente por actividad
{
  chat_display_name: 'Ag. Expansor',  // En vez de "Vocabulary Agent"
}
```

### **4. `ai_prompt` (System Prompt del agente)**
- **Tipo**: String (texto largo)
- **Uso**: Prompt personalizado para el agente IA en esta actividad
- **Soporta variables**: `{{activity_type}}`, `{{activity_structure}}`, `{{instructions}}`
- **Ubicación**: ActivityForm.jsx líneas 79, 506-534

```javascript
// Ejemplo de uso con variables
{
  ai_prompt: "Eres un asistente para {{activity_type}}.
              El estudiante debe {{instructions}}.
              Adapta tu ayuda al tipo {{activity_structure}}."
}
```

---

## 📄 ESTRUCTURA COMPLETA DE DATOS (Frontend)

### **Datos de ejemplo en CourseActivityPage.jsx** (Líneas 55-74)

```javascript
const activities = [
  {
    id: 1,
    book_code: 'EM1',
    unit_number: 1,
    apartado: 'Gramática',           // ← NUEVO
    activity_number: 1,
    activity_type: 'vocabulary',
    chat_display_name: 'Ag. Expansor' // ← NUEVO
  }
];
```

### **Datos de cursos en ActivitiesManager.jsx** (Líneas 50-95)

```javascript
const courses = [
  {
    id: 1,
    title: 'Español en marcha 1',
    company: 'SGEL',
    hours: 20,
    lessons: 15,
    level: 'A1',
    status: 'En proceso',
    progress: 60,
    coverImage: '/portada.jpg'
  }
];
```

---

## 🗂️ PÁGINAS Y RUTAS IMPLEMENTADAS

### **1. ActivitiesManager.jsx** - Gestor de Cursos
- **Ruta**: `/activities`
- **Función**: Listar todos los cursos (EM1, EM2, EM3, EM4)
- **Características**:
  - Búsqueda con filtros
  - Visualización en tarjetas con portada
  - Botón para crear nuevo curso
  - Click en curso → navega a `/activities/:courseId`

### **2. CourseActivityPage.jsx** - Actividades por Curso
- **Ruta**: `/activities/:courseId`
- **Función**: Gestionar actividades de un curso específico
- **Características**:
  - Búsqueda con filtros (unidad, sección, actividad, agente)
  - Visualización en tarjetas
  - Botón "Añadir acción" (abre modal con ActivityForm)
  - Click en actividad → editar en modal

### **3. ActivityForm.jsx** - Formulario de Actividad
- **Ubicación**: Modal dentro de CourseActivityPage
- **Función**: Crear/editar actividades
- **Campos**:
  - Metadatos: book_code, unit_number, apartado, activity_number
  - Configuración: activity_type, activity_structure
  - Contenido: instructions, activity_text, content blocks
  - IA: chat_display_name, ai_prompt, available_agents
  - Tiempo estimado

---

## 🎨 SISTEMA DE FILTROS

### **CourseActivityPage - Filtros de actividades**

```javascript
const [filterType, setFilterType] = useState('all');
// Opciones: 'all', 'unidad', 'seccion', 'actividad', 'agente'

// Buscar por:
- Número de unidad (1, 2, 3...)
- Sección/Apartado ("Gramática", "Lectura")
- Número de actividad
- Nombre del agente ("Ag. Expansor")
```

### **ActivitiesManager - Filtros de cursos**

```javascript
const [searchFilter, setSearchFilter] = useState('all');
// Opciones: 'all', 'title', 'company', 'level'

// Buscar por:
- Título del curso
- Empresa (SGEL)
- Nivel (A1, A2, B1, B2)
```

---

## 🔧 SISTEMA DE BLOQUES DE CONTENIDO

### **ContentBlock.jsx** - Bloques reutilizables

El formulario soporta 14 tipos de bloques de contenido:

```javascript
// Definidos en src/config/database.js líneas 100-182
export const CONTENT_BLOCK_TYPES = {
  vocabulary_words: { name: 'Palabras de vocabulario', icon: 'BookText' },
  reading_text: { name: 'Texto de comprensión lectora', icon: 'BookOpen' },
  audio_transcribed: { name: 'Audio transcrito', icon: 'Headphones' },
  closed_questions: { name: 'Preguntas cerradas', icon: 'HelpCircle' },
  fill_blank_text: { name: 'Texto para completar', icon: 'FileEdit' },
  matching_text: { name: 'Texto para relacionar', icon: 'Link' },
  ordering_text: { name: 'Texto para ordenar', icon: 'ListOrdered' },
  speaking_situations: { name: 'Situaciones para hablar', icon: 'MessageCircle' },
  image: { name: 'Imagen', icon: 'Image' },
  phrases: { name: 'Frases', icon: 'Quote' },
  words_to_create_phrases: { name: 'Palabras para crear frases', icon: 'Puzzle' },
  vocabulary: { name: 'Vocabulario', icon: 'Library' },
  image_to_point: { name: 'Imagen para señalar', icon: 'MousePointer' },
  vocabulary_matching: { name: 'Vocabulario para relacionar', icon: 'ArrowLeftRight' },
  open_questions_text: { name: 'Preguntas abiertas', icon: 'FileQuestion' },
  writing_text: { name: 'Texto escribir', icon: 'PenTool' }
};
```

---

## ⚠️ PROBLEMAS DETECTADOS

### **1. Desincronización con Base de Datos**

El frontend espera campos que NO existen en `class_activities`:

| Campo Frontend | ¿Existe en BD? | Problema |
|---|---|---|
| `apartado` | ❌ NO | Formulario intenta guardar pero BD rechazará |
| `activity_text` | ❌ NO | Contenido de actividad se perderá |
| `chat_display_name` | ❌ NO | Nombre personalizado no se guarda |
| `ai_prompt` | ❌ NO | Prompt del agente no se guarda |
| `title` | ✅ SÍ | **FALTA en formulario** |

### **2. Campo `title` faltante en formulario**

La BD requiere `title` (NOT NULL) pero el formulario no lo incluye.

```sql
-- BD requiere:
title VARCHAR(255) NOT NULL

-- Formulario NO tiene:
// formData sin 'title'
```

### **3. Servicio `activityService.js` desactualizado**

```javascript
// src/services/activityService.js línea 13
export const getAllActivities = async (filters = {}) => {
  // Llama a /api/activities
  // Espera { book_code, unit_number, activity_type, ... }
  // Pero NO maneja apartado, chat_display_name, etc.
};
```

---

## 🔧 SOLUCIONES PROPUESTAS

### **Opción 1: Actualizar Schema de BD (RECOMENDADO)**

```sql
ALTER TABLE class_activities
ADD COLUMN apartado VARCHAR(100),
ADD COLUMN activity_text TEXT,
ADD COLUMN chat_display_name VARCHAR(100),
ADD COLUMN ai_prompt TEXT;
```

**Ventajas:**
- Mantiene todos los datos del frontend
- Permite personalización por actividad
- No rompe código existente

**Desventajas:**
- Requiere migración de BD
- Agrega complejidad al schema

---

### **Opción 2: Guardar en `content` JSONB (Alternativa)**

```javascript
// Guardar campos nuevos dentro de content.metadata
content: {
  blocks: [...],
  metadata: {
    apartado: 'Gramática',
    activity_text: '...',
    chat_display_name: 'Ag. Expansor',
    ai_prompt: '...'
  }
}
```

**Ventajas:**
- No requiere cambios en schema
- Flexibilidad para agregar más campos
- Funciona con BD actual

**Desventajas:**
- No se puede indexar/filtrar por apartado
- Queries más complejas
- Pérdida de validación de tipos

---

### **Opción 3: Usar `title` para `apartado`**

```javascript
// Mapear apartado → title en formulario
formData.title = `Unidad ${unit_number} - ${apartado}`;
```

**Ventajas:**
- No requiere cambios en BD
- Cumple con NOT NULL de title

**Desventajas:**
- Pérdida de semántica
- No resuelve chat_display_name ni ai_prompt
- Confuso para desarrolladores

---

## 📋 MIGRACIÓN RECOMENDADA

### **Script de migración:**

```sql
-- ========================================
-- MIGRACIÓN: Agregar campos de cursos
-- ========================================

-- 1. Agregar nuevas columnas
ALTER TABLE class_activities
ADD COLUMN IF NOT EXISTS apartado VARCHAR(100),
ADD COLUMN IF NOT EXISTS activity_text TEXT,
ADD COLUMN IF NOT EXISTS chat_display_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS ai_prompt TEXT;

-- 2. Crear índices para búsquedas
CREATE INDEX IF NOT EXISTS idx_class_activities_apartado
  ON class_activities(apartado)
  WHERE apartado IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_class_activities_chat_display_name
  ON class_activities(chat_display_name)
  WHERE chat_display_name IS NOT NULL;

-- 3. Actualizar activities.js Netlify Function
-- (Agregar nuevos campos al INSERT/UPDATE)

-- 4. Actualizar validación en activityService.js
-- (Remover validación de title como obligatorio si se usa apartado)
```

### **Actualizar Netlify Function - activities.js**

```javascript
// Línea 96 - POST: Agregar nuevos campos
const result = await sql`
  INSERT INTO class_activities (
    book_code, unit_number, activity_number,
    activity_type, activity_structure,
    title, instructions, content,
    available_agents, estimated_time,
    apartado, activity_text,           // ← NUEVO
    chat_display_name, ai_prompt       // ← NUEVO
  ) VALUES (
    ${data.book_code}, ${data.unit_number}, ${data.activity_number},
    ${data.activity_type}, ${data.activity_structure},
    ${data.title || data.apartado || 'Sin título'},
    ${data.instructions}, ${JSON.stringify(data.content)},
    ${JSON.stringify(data.available_agents)}, ${data.estimated_time || null},
    ${data.apartado || null}, ${data.activity_text || null},
    ${data.chat_display_name || null}, ${data.ai_prompt || null}
  )
  RETURNING *
`;
```

---

## 📝 RESUMEN DE CAMBIOS NECESARIOS

### **Backend:**
1. ✅ Ejecutar migración SQL (agregar 4 columnas)
2. ✅ Actualizar `netlify/functions/activities.js` (INSERT/UPDATE)
3. ✅ Actualizar `src/services/activityService.js` (validación)

### **Frontend:**
1. ✅ Agregar campo `title` al formulario (opcional si se usa apartado)
2. ✅ Manejar respuesta de API con nuevos campos
3. ✅ Actualizar CourseActivityPage para mostrar campos nuevos

### **Base de Datos:**
1. ✅ Ejecutar script de migración
2. ✅ Verificar índices creados
3. ✅ Probar INSERT/UPDATE con nuevos campos

---

## 🎯 PRÓXIMOS PASOS

1. **Decidir estrategia**: ¿Opción 1, 2 o 3?
2. **Crear script de migración** definitivo
3. **Actualizar Netlify Functions**
4. **Probar CRUD completo** con datos reales
5. **Actualizar documentación** (ARQUITECTURA-BASE-DATOS.md)

---

**Última actualización:** 2024-11-29
**Estado:** ⚠️ Desincronización detectada - Requiere migración
