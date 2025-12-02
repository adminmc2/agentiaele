# Especificación de Base de Datos: Actividades/Acciones

> Documento de referencia para la construcción de la tabla `actividades` y su integración con los agentes de IA.

**Última actualización**: Diciembre 2025
**Estado**: En desarrollo

---

## 1. Propósito

Los campos de las actividades están diseñados para:
1. **Alimentar a los agentes de IA** con contexto relevante
2. **Construir prompts dinámicos** reemplazando variables `{{campo}}`
3. **Generar respuestas contextualizadas** según el tipo de ejercicio y nivel

---

## 2. Relación con Cursos

```
TABLA: cursos                          TABLA: actividades
┌─────────────────────┐                ┌─────────────────────┐
│ id (UUID) PK        │◄───────────────│ curso_id (UUID) FK  │
│ codigo (EM1, EM2..) │                │ id (UUID) PK        │
│ nombre              │                │ ...                 │
│ empresa             │                │                     │
│ nivel (A1, A2...)   │                │                     │
└─────────────────────┘                └─────────────────────┘

Una actividad pertenece a UN curso.
Un curso puede tener MUCHAS actividades.
```

---

## 3. Bloques de Campos

### BLOQUE 1: Identificación
*Ubica la actividad dentro del libro/curso*

| Campo BD | Tipo | Obligatorio | UI Label | Descripción | Uso en IA |
|----------|------|-------------|----------|-------------|-----------|
| `curso_id` | UUID FK | ✅ | (heredado) | Referencia al curso padre | Obtener nivel, código libro |
| `numero_unidad` | INTEGER | ✅ | "Unidad" | 1-12 | Contexto de nivel/tema |
| `apartado` | VARCHAR(50) | ✅ | "Apartado" | Ej: "1b", "7a", "Gramática" | Sección específica del tema |

### BLOQUE 2: Estructura de la Actividad
*Define el tipo pedagógico y formato del ejercicio*

| Campo BD | Tipo | Obligatorio | UI Label | Valores | Uso en IA |
|----------|------|-------------|----------|---------|-----------|
| `numero_actividad` | INTEGER | ✅ | "Actividad" | 1-15 | Identificación |
| `tipo_actividad` | VARCHAR(50) | ✅ | "Tipo" | Ver tabla abajo | Adaptar respuesta al tipo |
| `estructura_actividad` | VARCHAR(50) | ✅ | "Estructura" | Ver tabla abajo | Formato de respuesta |
| `tiempo_estimado` | INTEGER | ✅ | "Tiempo" | 5-120 (minutos) | Complejidad esperada |

**Valores de `tipo_actividad`:**
| Valor | Nombre ES | Descripción para IA |
|-------|-----------|---------------------|
| `oral_expression` | Expresión oral | Ejercicio de habla/pronunciación |
| `reading_comprehension` | Comprensión lectora | Lectura y preguntas |
| `vocabulary` | Vocabulario | Aprender/practicar palabras |
| `listening_comprehension` | Comprensión auditiva | Escuchar y responder |
| `oral_interaction` | Interacción oral | Diálogo/conversación |
| `spelling` | Ortografía | Escritura correcta |
| `pronunciation` | Pronunciación | Fonética |
| `grammar` | Gramática | Reglas gramaticales |
| `writing` | Escritura | Producción escrita |
| `self_assessment` | Autoevaluación | Reflexión del estudiante |

**Valores de `estructura_actividad`:**
| Valor | Nombre ES | Formato de respuesta |
|-------|-----------|---------------------|
| `multiple_choice` | Opción múltiple | Elegir entre opciones |
| `fill_blank` | Rellenar huecos | Completar espacios |
| `true_false` | Verdadero/Falso | V/F |
| `matching` | Relacionar | Conectar elementos |
| `ordering` | Ordenar | Secuenciar |
| `short_answer` | Respuesta corta | Texto breve |
| `open_ended` | Respuesta abierta | Texto libre |
| `dialogue` | Diálogo | Conversación |
| `essay` | Ensayo | Texto largo |

### BLOQUE 3: Contenido de la Actividad
*Material con el que trabaja el estudiante y el agente*

| Campo BD | Tipo | Obligatorio | UI Label | Descripción | Uso en IA |
|----------|------|-------------|----------|-------------|-----------|
| `instrucciones` | TEXT | ✅ | "Instrucciones" | Lo que debe hacer el estudiante | Contexto de la tarea |
| `contenido` | JSONB | ❌ | "Bloques de contenido" | Array de bloques modulares | Material de trabajo |
| `nombre_chat` | VARCHAR(100) | ✅ | "Nombre en chat" | Nombre visible del agente | Identidad del agente |

**Estructura de `contenido` (JSONB):**
```json
{
  "blocks": [
    {
      "type": "vocabulary_words",
      "data": {
        "words": ["palabra1", "palabra2"],
        "category": "verbos"
      }
    },
    {
      "type": "reading_text",
      "data": {
        "title": "Mi familia",
        "text": "Texto de lectura..."
      }
    }
  ]
}
```

**Tipos de bloques disponibles:**
| Tipo | Nombre | Campos internos |
|------|--------|-----------------|
| `vocabulary_words` | Palabras de vocabulario | words, category |
| `reading_text` | Texto de comprensión | text, title |
| `audio_transcribed` | Audio transcrito | audio_url, transcription |
| `closed_questions` | Preguntas cerradas | questions_list |
| `fill_blank_text` | Texto para completar | text_with_blanks, answers |
| `matching_text` | Texto para relacionar | column_a, column_b |
| `ordering_text` | Texto para ordenar | items_to_order, correct_order |
| `speaking_situations` | Situaciones para hablar | situations, prompts |
| `image` | Imagen | image_url, alt_text, caption |
| `phrases` | Frases | phrases_list, context |
| `words_to_create_phrases` | Palabras para crear frases | words_list, instructions |
| `vocabulary` | Vocabulario | vocab_list, definitions |
| `image_to_point` | Imagen para señalar | image_url, points, labels |
| `vocabulary_matching` | Vocabulario para relacionar | vocab_words, definitions_to_match |
| `open_questions_text` | Preguntas abiertas | text, questions_list |
| `writing_text` | Texto escribir | prompt, guidelines, word_count |

### BLOQUE 4: Configuración de Agentes IA
*Qué agentes pueden ayudar en esta actividad*

| Campo BD | Tipo | Obligatorio | UI Label | Descripción | Uso en IA |
|----------|------|-------------|----------|-------------|-----------|
| `agentes_disponibles` | JSONB | ✅ | "Agentes IA Disponibles" | Objeto con agentes activos | Filtrar agentes |

**Estructura de `agentes_disponibles` (JSONB):**
```json
{
  "translator": true,
  "vocabulary": true,
  "personalizer": false,
  "creative": false
}
```

**Agentes disponibles (MOMENTO 1):**
| Key | Nombre | Descripción |
|-----|--------|-------------|
| `translator` | Ag. Traducción | Traduce del español a otra lengua |
| `vocabulary` | Ag. Expansor | Amplía el vocabulario |
| `personalizer` | Ag. Enfocado | Traduce expresiones específicas |
| `creative` | Ag. Improvisador | Respuestas creativas |

### BLOQUE 5: Prompt para IA
*Instrucciones personalizadas para los agentes*

| Campo BD | Tipo | Obligatorio | UI Label | Descripción | Uso en IA |
|----------|------|-------------|----------|-------------|-----------|
| `prompt_ia` | TEXT | ✅ | "Prompt personalizado" | Template con variables | Prompt base |

**Variables disponibles para el prompt:**

*Campos de la actividad:*
- `{{tipo_actividad}}` - Tipo de actividad
- `{{estructura_actividad}}` - Estructura
- `{{instrucciones}}` - Instrucciones
- `{{contenido}}` - Contenido completo (JSON)
- `{{numero_unidad}}` - Número de unidad
- `{{apartado}}` - Apartado
- `{{numero_actividad}}` - Número de actividad
- `{{tiempo_estimado}}` - Tiempo estimado
- `{{agentes_disponibles}}` - Agentes disponibles
- `{{nombre_chat}}` - Nombre en chat

*Campos del curso (heredados):*
- `{{codigo_libro}}` - Código del libro (EM1, EM2...)
- `{{nivel}}` - Nivel MCER (A1, A2...)

*Campos de bloques de contenido:*
- `{{category}}`, `{{text}}`, `{{title}}`, `{{audio}}`, `{{transcription}}`
- `{{questions_list}}`, `{{text_with_blanks}}`, `{{answers}}`
- `{{column_a}}`, `{{column_b}}`, `{{items_to_order}}`, `{{correct_order}}`
- `{{situations}}`, `{{image}}`, `{{alt_text}}`, `{{caption}}`
- `{{phrases_list}}`, `{{words_list}}`, `{{vocab_list}}`, `{{definitions}}`
- `{{points}}`, `{{labels}}`, `{{vocab_words}}`, `{{definitions_to_match}}`
- `{{prompt}}`, `{{guidelines}}`, `{{word_count}}`

---

## 4. Flujo de Uso con IA

> **Importante**: El estudiante NO escribe preguntas. Las acciones están predefinidas por el administrador y el prompt ya fue probado antes de publicarse.

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. ADMINISTRADOR: Crea y prueba acciones (ANTES)                │
│                                                                 │
│    - Define el prompt_ia para cada acción                       │
│    - Prueba que el resultado sea correcto                       │
│    - Publica la acción (queda disponible para estudiantes)      │
└─────────────────────────────────────────────────────────────────┘

                    ... tiempo después ...

┌─────────────────────────────────────────────────────────────────┐
│ 2. ESTUDIANTE: Entra a una actividad                            │
│                                                                 │
│    - Navega: Curso → Unidad → Apartado → Actividad              │
│    - Ve los botones de acciones disponibles                     │
│      Ej: [Traducir] [Ampliar vocabulario] [Crear historia]      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. ESTUDIANTE: Hace clic en un botón de acción                  │
│                                                                 │
│    - El botón muestra el `nombre_chat` de la acción             │
│    - No hay escritura, solo clic                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. BACKEND: Obtener datos de la acción + curso                  │
│                                                                 │
│    SELECT a.*, c.codigo, c.nivel                                │
│    FROM actividades a                                           │
│    JOIN cursos c ON a.curso_id = c.id                          │
│    WHERE a.id = 'uuid_de_la_accion'                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. CONSTRUIR PROMPT: Reemplazar variables                       │
│                                                                 │
│    prompt = accion.prompt_ia                                    │
│      .replace('{{tipo_actividad}}', accion.tipo_actividad)      │
│      .replace('{{nivel}}', curso.nivel)                         │
│      .replace('{{instrucciones}}', accion.instrucciones)        │
│      .replace('{{contenido}}', JSON.stringify(accion.contenido))│
│      ...                                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. ENVIAR A LLM (DeepSeek)                                      │
│                                                                 │
│    {                                                            │
│      system: prompt_construido                                  │
│      // No hay "user message" - el prompt ya contiene todo      │
│    }                                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. RESPUESTA: Resultado predecible y probado                    │
│                                                                 │
│    - El resultado es consistente porque el prompt fue probado   │
│    - Se muestra al estudiante en el chat de Eliana              │
└─────────────────────────────────────────────────────────────────┘
```

### Ejemplo concreto:

| Paso | Actor | Acción |
|------|-------|--------|
| 1 | Admin | Crea acción "Traducir vocabulario" con prompt probado |
| 2 | Estudiante | Entra a Unidad 1, Apartado 1b, Actividad 3 |
| 3 | Estudiante | Ve botón "Traducir" y hace clic |
| 4 | Sistema | Ejecuta el prompt predefinido |
| 5 | IA | Devuelve traducciones del vocabulario |
| 6 | Estudiante | Ve el resultado en el chat |

---

## 5. SQL Propuesto (Borrador)

```sql
-- Tabla de actividades
CREATE TABLE actividades (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  numero_unidad INTEGER NOT NULL CHECK (numero_unidad >= 1 AND numero_unidad <= 12),
  apartado VARCHAR(50) NOT NULL,

  -- Estructura
  numero_actividad INTEGER NOT NULL CHECK (numero_actividad >= 1 AND numero_actividad <= 15),
  tipo_actividad VARCHAR(50) NOT NULL,
  estructura_actividad VARCHAR(50) NOT NULL,
  tiempo_estimado INTEGER NOT NULL DEFAULT 15 CHECK (tiempo_estimado >= 5 AND tiempo_estimado <= 120),

  -- Contenido
  instrucciones TEXT NOT NULL,
  contenido JSONB DEFAULT '{"blocks": []}',
  nombre_chat VARCHAR(100) NOT NULL,

  -- Configuración IA
  agentes_disponibles JSONB NOT NULL DEFAULT '{"translator": true, "vocabulary": true, "personalizer": false, "creative": false}',
  prompt_ia TEXT NOT NULL,

  -- Metadatos
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Restricción única: no puede haber dos actividades con misma unidad/apartado/número en el mismo curso
  UNIQUE(curso_id, numero_unidad, apartado, numero_actividad)
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_actividades_curso ON actividades(curso_id);
CREATE INDEX idx_actividades_unidad ON actividades(numero_unidad);
CREATE INDEX idx_actividades_tipo ON actividades(tipo_actividad);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_actividades_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actividades_updated_at
  BEFORE UPDATE ON actividades
  FOR EACH ROW
  EXECUTE FUNCTION update_actividades_updated_at();
```

---

## 6. Mapeo Frontend ↔ Backend ↔ BD

| Frontend (formData) | API (JSON) | BD (columna) | Notas |
|---------------------|------------|--------------|-------|
| `curso_id` | `curso_id` | `curso_id` | Viene del prop `courseId` (página padre) |
| `unit_number` | `numero_unidad` | `numero_unidad` | |
| `apartado` | `apartado` | `apartado` | |
| `activity_number` | `numero_actividad` | `numero_actividad` | |
| `activity_type` | `tipo_actividad` | `tipo_actividad` | |
| `activity_structure` | `estructura_actividad` | `estructura_actividad` | |
| `estimated_time` | `tiempo_estimado` | `tiempo_estimado` | |
| `instructions` | `instrucciones` | `instrucciones` | |
| `content` | `contenido` | `contenido` | |
| `chat_display_name` | `nombre_chat` | `nombre_chat` | |
| `available_agents` | `agentes_disponibles` | `agentes_disponibles` | Permite múltiples agentes |
| `ai_prompt` | `prompt_ia` | `prompt_ia` | |

> **Nota**: El campo `book_code` fue eliminado del formulario. El código del libro se obtiene a través del `curso_id` mediante JOIN con la tabla `cursos`.

---

## 7. Pendientes / Notas

- [ ] Definir si los nombres de campos en BD serán en español o inglés
- [ ] Verificar que todos los tipos de bloques de contenido tienen campos suficientes
- [ ] Definir validaciones adicionales para el prompt_ia
- [ ] Considerar si agregar campo para "respuestas correctas" (para evaluación)
- [ ] Definir cómo manejar imágenes/audio en los bloques de contenido

---

## 8. Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2025-12-01 | Documento inicial creado |
| 2025-12-01 | Eliminado `book_code` del formData, añadido `curso_id` que viene del prop `courseId`. Eliminado import de `BOOK_CODES`. Actualizado `loadActivity` para usar `curso_id` y `chat_display_name`. |
| 2025-12-01 | Corregido flujo de IA: el estudiante NO escribe, solo hace clic en botones de acciones predefinidas. El prompt ya fue probado por el administrador antes de publicarse. |
