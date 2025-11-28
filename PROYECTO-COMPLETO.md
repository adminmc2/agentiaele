# 📚 PROYECTO COMPLETO: AgentIA ele

## Equipo Lingüístico Aplicado con Inteligencia Artificial para Español lengua extranjera

## 🎯 VISIÓN GENERAL

**AgentIA ele** es un sistema educativo completo para aprendizaje de español como lengua extranjera (ELE), aplicado específicamente para brindar andamiaje pedagógico y lingüístico a estudiantes de español como lengua extranjera.
- Frontend desplegado en **Netlify**
- Base de datos **PostgreSQL 15** en **Neon.tech** 
  - 512 MB RAM, 3 GB storage
  - Serverless PostgreSQL con auto-scaling
  - Sin tarjeta de crédito requerida
- Autenticación con **Auth0 Free Tier** (7,000 usuarios gratis) o **Clerk.dev** (10,000 usuarios gratis)
- Backend serverless con **Netlify Functions**
- **Equipo de múltiples agentes de IA especializados** como tutores virtuales lingüísticos
- Integración con IA (**diferentes modelos de LLM que se adaptarán según las necesidades**)
- Sistema de roles: **Superadmin**, **Editor** y **Usuario**
- Sistema de agentes que apoyan en todas las 
- Tracking completo de progreso
- Sistema de badges y gamificación
- Caché inteligente con ahorro del 70-80% en costos de IA
- Reportes y análisis de aprendizaje y uso de agentes

**💡 Stack 100% gratuito**: Neon.tech + Auth0/Clerk + Netlify gratis para siempre. Solo pagas DeepSeek API ($5-10/mes con caché).

---

## 🎓 MOMENTOS PEDAGÓGICOS DEL SISTEMA

AgentIA ele está diseñado en torno a **dos momentos pedagógicos** que reflejan el proceso natural de aprendizaje de un idioma:

### **MOMENTO 1: CLASE** 📖
**Aprendizaje guiado con IA, sin evaluación ni seguimiento de progreso**

- **Objetivo**: Exploración libre y práctica sin presión
- **Características**:
  - Chat único "Eliana" con múltiples agentes IA especializados
  - Traducción contextual al idioma nativo
  - Explicaciones de vocabulario y gramática
  - Ejemplos personalizados según intereses del estudiante
  - Contenido creativo (historias, diálogos)
  - Sin puntuaciones ni evaluaciones
  - Enfoque en comprensión y familiarización
- **Agentes disponibles**: Translator, Vocabulary, Personalizer, Creative (sistema extensible)
- **Implementado en**: MVP (Fase 1)

### **MOMENTO 2: REPASO** ✍️
**Práctica personalizada con evaluación, dificultad adaptativa y seguimiento de progreso**

- **Objetivo**: Consolidación de conocimientos con retroalimentación
- **Características**:
  - Corrección automática de respuestas
  - Evaluación con puntuación 0-10
  - Feedback detallado sobre errores
  - Dificultad adaptativa según progreso
  - Seguimiento completo de evolución
  - Sistema de logros y gamificación
  - Recomendaciones personalizadas
- **Agentes adicionales**: Corrector, Evaluator, Teacher, Tutor
- **Implementado en**: Versión completa (Fase 2)

---

## 📍 FASES DE DESARROLLO

Este proyecto se desarrolla en **dos fases principales** para garantizar un lanzamiento exitoso y escalable:

### **FASE 1: MVP - 100 USUARIOS BETA (1 semana)** 🚀

**Objetivo**: Versión simple y funcional para validación temprana con usuarios reales.

**Características incluidas**:
- ✅ Autenticación (email/password)
- ✅ **Sistema de agentes IA extensible** para MOMENTO 1: CLASE (4 agentes iniciales: Translator, Vocabulary, Personalizer, Creative - más agentes se añaden según necesidad)
- ✅ Chat único "Eliana" con múltiples agentes respondiendo
- ✅ Traducción contextual y explicaciones de vocabulario
- ✅ Ejemplos personalizados y contenido creativo
- ✅ Guardar progreso en base de datos
- ✅ Dashboard básico del usuario
- ✅ 3-5 actividades demo por unidad
- ✅ Sistema de gestión de actividades (admin)
- ✅ Editor de prompts con 34 placeholders dinámicos
- ✅ 16 tipos de bloques de contenido modulares
- ✅ Caché simple en memoria

**No incluido en MVP** (se agrega en Fase 2):
- ❌ Dashboard de superadmin completo
- ❌ Sistema de badges y gamificación
- ❌ Reportes avanzados de agentes
- ❌ Modo práctica personalizado
- ❌ Caché inteligente con PostgreSQL
- ❌ Sistema de alertas
- ❌ Configuración avanzada de agentes por actividad

**Costos estimados MVP**:
```
INFRAESTRUCTURA (GRATIS PARA SIEMPRE):
• Neon.tech PostgreSQL: $0 (512 MB RAM, 3 GB storage - sin límite de tiempo)
• Auth0 / Clerk: $0 (Free tier - hasta 7,000-10,000 usuarios)
• Netlify: $0 (Free tier - 100 GB bandwidth/mes)
• DeepSeek API: ~$5-10/mes

TOTAL: $5-10/mes (SOLO pagas DeepSeek API, infraestructura gratis)

CÁLCULO:
• 100 usuarios
• 5 actividades/usuario/semana = 500 actividades/semana
• 2,000 actividades/mes
• 3 llamadas IA/actividad = 6,000 requests/mes
• 500 tokens/request = 3M tokens
• DeepSeek: $0.14/1M tokens input + $0.28/1M output
• Costo IA: ~$8/mes
• Con caché (50% hit): ~$4-5/mes

✅ Infraestructura 100% gratis sin límite de tiempo
✅ Solo pagas API de IA
```

**Base de datos MVP - MOMENTO 1 (6 tablas en Neon.tech PostgreSQL 17)**:
1. `user_profiles` - Perfiles con preferencias (campo `send_chat_emails`)
2. `class_activities` - Actividades de clase (EM1, EM2, EM3, EM4)
3. `class_sessions` - Sesiones de clase con chat completo y detección de inactividad
4. `user_interactions` - Interacciones para analytics y entrenamiento de IA
5. `user_achievements` - Sistema de logros y gamificación básica
6. `ai_cache` - Caché de respuestas de IA

**Características de la base de datos**:
- **Soporte multi-libro**: EM1, EM2, EM3, EM4 (Español en Marcha)
- **10 tipos de actividades**: oral_expression, reading_comprehension, vocabulary, listening_comprehension, oral_interaction, spelling, pronunciation, grammar, writing, self_assessment
- **9 estructuras de actividad**: multiple_choice, fill_blank, true_false, matching, ordering, short_answer, open_ended, dialogue, essay
- **Sistema dual de almacenamiento**: `chat_messages` (JSONB) para UI/email + `user_interactions` para ML/analytics
- **Email consolidado**: Un email por sesión con preferencia configurable (`send_chat_emails`)
- **Detección de inactividad**: Campo `last_active_at` para enviar email al finalizar sesión

**Sistema de Gestión de Actividades - Admin** 🎨

El MVP incluye un sistema completo de gestión de actividades con diseño Material Design:

**Formulario de creación/edición (ActivityForm.jsx)**:
- **5 secciones organizadas**:
  1. **Identificación**: Código de libro (EM1-EM4), número de unidad, apartado
  2. **Estructura**: Número de actividad, tipo, estructura, tiempo estimado
  3. **Contenido**: Instrucciones + sistema de bloques modulares
  4. **Agentes IA**: Selección de agentes disponibles (MOMENTO 1)
  5. **Prompt personalizado**: Editor con inserción dinámica de campos

**Sistema de bloques de contenido modulares (16 tipos)**:
- Palabras de vocabulario, Texto de lectura, Audio transcrito
- Preguntas cerradas, Texto para completar, Texto para relacionar
- Texto para ordenar, Situaciones para hablar, Imagen
- Frases, Palabras para crear frases, Vocabulario
- Imagen para señalar, Vocabulario para relacionar
- Texto preguntas abiertas, Texto escribir

**Editor de prompts dinámico** (estilo newsletter):
- **10 campos principales**: activity_type, activity_structure, instructions, content, book_code, unit_number, apartado, activity_number, estimated_time, available_agents
- **24 campos de bloques**: category, text, title, audio, transcription, questions_list, text_with_blanks, answers, column_a, column_b, items_to_order, correct_order, situations, image, alt_text, caption, phrases_list, words_list, vocab_list, definitions, points, labels, vocab_words, definitions_to_match, prompt, guidelines, word_count
- **Total: 34 placeholders** con sintaxis `{{campo}}`
- Inserción con botones tipo newsletter

**Diseño y UX**:
- **Material Design**: Cards con elevaciones, transiciones suaves
- **Iconos Lucide**: Identificación visual de cada tipo de bloque
- **Color principal**: Naranja #8C430D unificado en toda la interfaz
- **Tipografía**: Inconsolata monospace para selectores y campos técnicos
- **Layout responsive**: Grid adaptativo de 2 columnas en desktop

**Componentes técnicos**:
- `ActivityForm.jsx` - Formulario principal (320 líneas)
- `ContentBlock.jsx` - Renderizado de bloques modulares (500 líneas)
- `CustomSelect.jsx` - Select personalizado con Inconsolata
- `ActivityForm.css` - Estilos Material Design (492 líneas)
- `ContentBlock.css` - Estilos para bloques (277 líneas)

---

### **FASE 2: VERSIÓN COMPLETA - 1000+ USUARIOS (3-4 semanas)** 🏆

**Objetivo**: Sistema completo con todas las funcionalidades avanzadas y optimizaciones.

**Nuevas características**:
- ✅ **Sistema de agentes ampliado para MOMENTO 2: REPASO** (añade agentes de evaluación: Corrector, Evaluator, Teacher, Tutor)
- ✅ **Caché inteligente con PostgreSQL + pg_trgm** (70-80% ahorro)
- ✅ Dashboard de Superadmin con analytics de agentes
- ✅ Sistema completo de gamificación (badges, niveles, XP)
- ✅ Reportes avanzados y exportación (CSV/JSON/PDF)
- ✅ Configuración de agentes por actividad
- ✅ Sistema de alertas para admin
- ✅ Modo práctica personalizado
- ✅ Historial completo de interacciones IA
- ✅ Monitor de agentes en tiempo real
- ✅ Gestión completa de contenido

**Base de datos completa (16 tablas)**:
1. `user_profiles` - Perfiles extendidos con roles
2. `units` - Unidades del curso
3. `sections` - Secciones por unidad
4. `activities` - Actividades con config de IA
5. `user_progress` - Progreso detallado
6. `user_answers` - Historial de respuestas
7. `badges` - Insignias del sistema
8. `user_badges` - Badges obtenidos
9. `user_stats` - Estadísticas agregadas
10. `ai_interactions` - Historial completo de IA
11. `practice_sessions` - Sesiones de práctica
12. `notifications` - Sistema de notificaciones
13. `agent_stats` - Estadísticas por agente/día
14. `activity_agent_config` - Config de agentes por actividad
15. `admin_alerts` - Alertas para superadmin
16. `ai_response_cache` - Caché inteligente optimizado

**Costos estimados Producción (1000 usuarios)**:
```
OPCIÓN A - Neon.tech Free (Mientras quepas en límites):
Sin caché: ~$52/mes
Con caché (80% hit rate): ~$18/mes (65% ahorro)

Desglose:
• Neon.tech: $0 (Free tier - 512 MB puede manejar ~500-1000 usuarios)
• Auth0/Clerk: $0 (Free tier cubre hasta 7,000-10,000 MAU)
• Netlify: $10/mes (puede necesitar más bandwidth)
• DeepSeek API: $8/mes (con caché) vs $42/mes (sin caché)

OPCIÓN B - Escalar con Neon.tech Pro (cuando superes límites):
Sin caché: ~$95/mes
Con caché (80% hit rate): ~$61/mes (36% ahorro)

Desglose:
• Neon.tech Pro: $19/mes (mejor performance + más recursos)
• Auth0 Essentials: $25/mes (más usuarios y features)
• Netlify Pro: $19/mes (más bandwidth)
• DeepSeek API: $8/mes (con caché) vs $42/mes (sin caché)

OPCIÓN C - Migrar a Supabase (Si necesitas auth + storage integrado):
Sin caché: ~$77/mes
Con caché (80% hit rate): ~$43/mes (44% ahorro)

Desglose:
• Supabase Pro: $25/mes (BD + Auth + Storage + Realtime)
• Netlify: $19/mes
• DeepSeek API: $8/mes (con caché) vs $42/mes (sin caché)
```

**Timeline**: 20-25 días (después de MVP validado)

---

### **🎯 Estrategia de Implementación**

```
Semana 1: MVP Beta (100 usuarios)
    ↓
Validación y Feedback (1-2 semanas)
    ↓
Semanas 3-6: Desarrollo Versión Completa
    ↓
Lanzamiento Producción (1000+ usuarios)
```

**Ventajas de este enfoque**:
1. ✅ **Validación temprana** con usuarios reales
2. ✅ **Iteración rápida** basada en feedback
3. ✅ **Menor riesgo** financiero y técnico
4. ✅ **Aprendizaje continuo** sobre uso real
5. ✅ **Base sólida** para escalar

---

**El resto de este documento describe la FASE 2 (Versión Completa)**. Para detalles específicos del MVP, consulta la sección dedicada al final del documento.

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Netlify)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │  Dashboard   │  │  Activities  │     │
│  │     Page     │  │    Usuario   │  │     Page     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Login/    │  │  Dashboard   │  │   Reports    │     │
│  │   Register   │  │  Superadmin  │  │   & Stats    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Neon.tech + Netlify)               │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Auth0 / Clerk (Authentication) 🔐                    │ │
│  │  • Login/Register con email/password                  │ │
│  │  • JWT tokens para autorización                       │ │
│  │  • Gestión de roles (usuario/superadmin)              │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Neon.tech PostgreSQL 17 (Database) 💾                │ │
│  │  • GRATIS para siempre: 512 MB RAM, 3 GB storage     │ │
│  │  • Serverless PostgreSQL con auto-scaling            │ │
│  │  • Sin tarjeta de crédito requerida                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Netlify Functions (Serverless Backend) ⚡            │ │
│  │  • API endpoints para CRUD                            │ │
│  │  • Conexión a PostgreSQL con pg                       │ │
│  │  • Rate limiting y validación                         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              SISTEMA DE AGENTES IA (Capa Intermedia)        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │  AGENT SERVICE (Orquestador Principal) 🧠           │   │
│  │  • Decide qué agente usar                            │   │
│  │  • Coordina múltiples agentes                        │   │
│  │  • Gestiona cache y rate limiting                    │   │
│  └─────────────────┬───────────────────────────────────┘   │
│                    │                                         │
│     ┌──────────────┼──────────────┐                        │
│     ▼              ▼              ▼                         │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐                  │
│  │Corrector│  │Evaluator │  │Translator│                  │
│  │ Agent   │  │  Agent   │  │  Agent   │                  │
│  └─────────┘  └──────────┘  └──────────┘                  │
│     ▼              ▼              ▼                         │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐                  │
│  │Generator│  │  Teacher │  │  Tutor   │                  │
│  │ Agent   │  │  Agent   │  │  Agent   │                  │
│  └─────────┘  └──────────┘  └──────────┘                  │
│                                                              │
│  Todos heredan de: BaseAgent (clase padre)                 │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    DEEPSEEK API (IA Real)                   │
├─────────────────────────────────────────────────────────────┤
│  • Procesamiento de lenguaje natural                        │
│  • Generación de respuestas contextuales                    │
│  • Análisis gramatical y semántico                          │
│  • Modelo: deepseek-chat                                    │
└─────────────────────────────────────────────────────────────┘

💡 MIGRACIÓN FUTURA A SUPABASE (cuando haya presupuesto):
   → PostgreSQL nativo permite migración simple con pg_dump/pg_restore
   → Auth0/Clerk → Supabase Auth (migración de usuarios)
   → Netlify Functions → Supabase Edge Functions (opcional)
```

---

## 📊 ESTRUCTURA DE BASE DE DATOS (Neon.tech PostgreSQL 17)

### **TABLAS PRINCIPALES**

#### **1. user_profiles (perfiles de usuario)**
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id VARCHAR(255) UNIQUE NOT NULL, -- ID de Auth0/Clerk
  email VARCHAR NOT NULL,
  full_name VARCHAR,
  role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'superadmin')),
  native_language VARCHAR DEFAULT 'en',
  age INTEGER,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **2. units (Unidades del curso)**
```sql
CREATE TABLE public.units (
  id SERIAL PRIMARY KEY,
  unit_number INTEGER NOT NULL,
  title VARCHAR NOT NULL,
  subtitle TEXT,
  description TEXT,
  color_theme VARCHAR,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **3. sections (Secciones dentro de cada unidad)**
```sql
CREATE TABLE public.sections (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE,
  section_code VARCHAR NOT NULL, -- Ejemplo: "1A", "2B"
  title VARCHAR NOT NULL,
  description TEXT,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **4. activities (Actividades por sección)**
```sql
CREATE TABLE public.activities (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
  activity_code VARCHAR NOT NULL, -- Ejemplo: "1A-1", "1A-2"
  type VARCHAR NOT NULL, -- 'conversation', 'grammar', 'vocabulary', 'listening', 'writing'
  title VARCHAR NOT NULL,
  description TEXT,
  question TEXT,
  context JSONB, -- { vocabulary: [], grammar_points: [], instructions: "" }
  correct_answers JSONB, -- Array de respuestas correctas
  ai_config JSONB, -- Configuración de IA para esta actividad
  prompts JSONB, -- Prompts personalizados
  scoring JSONB, -- { maxPoints: 10, criteria: [] }
  difficulty_level VARCHAR DEFAULT 'A1',
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **5. user_progress (Progreso del usuario)**
```sql
CREATE TABLE public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  status VARCHAR DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  attempts INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  max_score INTEGER,
  last_answer TEXT,
  ai_feedback TEXT,
  time_spent INTEGER DEFAULT 0, -- en segundos
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, activity_id)
);
```

#### **6. user_answers (Respuestas guardadas)**
```sql
CREATE TABLE public.user_answers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  attempt_number INTEGER,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN,
  score INTEGER,
  ai_evaluation JSONB, -- { feedback: "", corrections: [], suggestions: [] }
  time_taken INTEGER, -- segundos
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **7. badges (Insignias disponibles)**
```sql
CREATE TABLE public.badges (
  id SERIAL PRIMARY KEY,
  code VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  icon_url TEXT,
  category VARCHAR, -- 'progress', 'achievement', 'special'
  condition_type VARCHAR, -- 'activities_completed', 'perfect_score', 'streak_days'
  condition_value JSONB, -- Configuración de la condición
  points INTEGER DEFAULT 0,
  rarity VARCHAR DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **8. user_badges (Insignias obtenidas por usuarios)**
```sql
CREATE TABLE public.user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);
```

#### **9. user_stats (Estadísticas del usuario)**
```sql
CREATE TABLE public.user_stats (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_activities INTEGER DEFAULT 0,
  completed_activities INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- minutos
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **10. ai_interactions (Historial de interacciones con IA)**
```sql
CREATE TABLE public.ai_interactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
  agent_name VARCHAR NOT NULL, -- 'Corrector', 'Evaluator', 'Translator', 'Generator', 'Teacher', 'Tutor'
  interaction_type VARCHAR NOT NULL, -- 'correction', 'translation', 'examples', 'help', 'evaluation', 'explanation'
  user_input TEXT NOT NULL,
  ai_response TEXT,
  prompt_used TEXT,
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER, -- Tiempo de respuesta en milisegundos
  was_cached BOOLEAN DEFAULT false, -- Si la respuesta vino del cache
  cost_usd DECIMAL(10, 6), -- Costo estimado en USD
  success BOOLEAN DEFAULT true, -- Si la llamada fue exitosa
  error_message TEXT, -- Mensaje de error si falló
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar consultas del superadmin
CREATE INDEX idx_ai_interactions_agent ON ai_interactions(agent_name);
CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_activity ON ai_interactions(activity_id);
CREATE INDEX idx_ai_interactions_date ON ai_interactions(created_at);
CREATE INDEX idx_ai_interactions_type ON ai_interactions(interaction_type);
```

#### **11. practice_sessions (Sesiones de práctica personalizadas)**
```sql
CREATE TABLE public.practice_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type VARCHAR, -- 'review', 'weak_areas', 'custom'
  activities_included JSONB, -- Array de activity_ids
  completed BOOLEAN DEFAULT false,
  score INTEGER,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

#### **12. notifications (Notificaciones para usuarios)**
```sql
CREATE TABLE public.notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR, -- 'badge_earned', 'achievement', 'reminder', 'admin_message'
  title VARCHAR NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **13. agent_stats (Estadísticas agregadas de agentes)** 🆕
```sql
CREATE TABLE public.agent_stats (
  id SERIAL PRIMARY KEY,
  agent_name VARCHAR NOT NULL,
  date DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  successful_calls INTEGER DEFAULT 0,
  failed_calls INTEGER DEFAULT 0,
  cached_calls INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10, 4) DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(agent_name, date)
);

CREATE INDEX idx_agent_stats_name_date ON agent_stats(agent_name, date);
```

#### **14. activity_agent_config (Configuración de agentes por actividad)** 🆕
```sql
CREATE TABLE public.activity_agent_config (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  agent_name VARCHAR NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  custom_prompt TEXT, -- Prompt personalizado para esta actividad
  config JSONB, -- Configuración específica (temperatura, max_tokens, etc.)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(activity_id, agent_name)
);

CREATE INDEX idx_activity_agent_config_activity ON activity_agent_config(activity_id);
```

#### **15. admin_alerts (Alertas para el superadmin)** 🆕
```sql
CREATE TABLE public.admin_alerts (
  id SERIAL PRIMARY KEY,
  alert_type VARCHAR NOT NULL, -- 'cost_limit', 'agent_error', 'high_latency', 'anomaly'
  severity VARCHAR DEFAULT 'info', -- 'info', 'warning', 'critical'
  title VARCHAR NOT NULL,
  message TEXT,
  details JSONB, -- Datos adicionales del contexto
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_alerts_type ON admin_alerts(alert_type);
CREATE INDEX idx_admin_alerts_severity ON admin_alerts(severity);
CREATE INDEX idx_admin_alerts_resolved ON admin_alerts(is_resolved);
```

#### **16. ai_response_cache (Caché de respuestas de IA)** 🆕 💰
```sql
-- Tabla optimizada para guardar y reutilizar respuestas de IA
CREATE TABLE public.ai_response_cache (
  id SERIAL PRIMARY KEY,
  agent_name VARCHAR NOT NULL,
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  interaction_type VARCHAR NOT NULL,

  -- Hash del input para búsqueda exacta
  input_hash VARCHAR(64) NOT NULL, -- SHA256 del input normalizado
  input_text TEXT NOT NULL, -- Input original del usuario
  input_normalized TEXT NOT NULL, -- Input normalizado (sin tildes, lowercase, etc.)

  -- Respuesta guardada
  ai_response TEXT NOT NULL,
  response_metadata JSONB, -- { score, feedback, corrections, etc. }

  -- Métricas
  usage_count INTEGER DEFAULT 1, -- Cuántas veces se ha reutilizado
  tokens_saved INTEGER DEFAULT 0, -- Tokens ahorrados por reutilización
  cost_saved_usd DECIMAL(10, 6) DEFAULT 0, -- Dinero ahorrado

  -- Context para matching inteligente
  context_data JSONB, -- { level, user_age, target_lang, etc. }

  -- Control de calidad
  quality_score DECIMAL(3, 2) DEFAULT 1.0, -- Calidad de la respuesta (0-1)
  is_active BOOLEAN DEFAULT true, -- Si está disponible para reutilizar

  -- Timestamps
  first_generated_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- Opcional: expiración de caché

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsqueda ultra-rápida
CREATE INDEX idx_cache_hash ON ai_response_cache(input_hash);
CREATE INDEX idx_cache_agent_activity ON ai_response_cache(agent_name, activity_id);
CREATE INDEX idx_cache_normalized ON ai_response_cache(input_normalized);
CREATE INDEX idx_cache_usage ON ai_response_cache(usage_count DESC);
CREATE INDEX idx_cache_active ON ai_response_cache(is_active) WHERE is_active = true;

-- Índice para búsqueda de similitud (usando extensión pg_trgm)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_cache_similarity ON ai_response_cache USING gin(input_normalized gin_trgm_ops);
```

---

## 🔐 ROW LEVEL SECURITY (RLS) - SUPABASE

### **Políticas de seguridad**

```sql
-- Users pueden leer solo su propio perfil
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Superadmin puede ver todos los perfiles
CREATE POLICY "Superadmin can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Users pueden actualizar solo su propio perfil
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users pueden ver solo su propio progreso
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users pueden insertar solo su propio progreso
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Superadmin puede ver todo el progreso
CREATE POLICY "Superadmin can view all progress"
  ON user_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Actividades son públicas para lectura
CREATE POLICY "Activities are publicly readable"
  ON activities FOR SELECT
  USING (is_active = true);

-- Solo superadmin puede modificar actividades
CREATE POLICY "Superadmin can manage activities"
  ON activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- 🆕 Políticas para ai_interactions
CREATE POLICY "Users can view own ai_interactions"
  ON ai_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Superadmin can view all ai_interactions"
  ON ai_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- 🆕 Políticas para agent_stats (solo superadmin)
CREATE POLICY "Superadmin can view agent_stats"
  ON agent_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

CREATE POLICY "Superadmin can manage agent_stats"
  ON agent_stats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- 🆕 Políticas para activity_agent_config (solo superadmin)
CREATE POLICY "Superadmin can manage activity_agent_config"
  ON activity_agent_config FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- 🆕 Políticas para admin_alerts (solo superadmin)
CREATE POLICY "Superadmin can view admin_alerts"
  ON admin_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

CREATE POLICY "Superadmin can manage admin_alerts"
  ON admin_alerts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );
```

---

## 🎨 ESTRUCTURA DE CARPETAS FRONTEND

```
demo-ar-libro/
│
├── public/
│   ├── images/
│   │   ├── badges/
│   │   ├── avatars/
│   │   └── units/
│   └── icons/
│
├── src/
│   ├── config/
│   │   ├── auth0.js                 # Configuración de Auth0
│   │   ├── database.js              # Configuración de conexión a Neon.tech
│   │   ├── deepseek.js              # Configuración de DeepSeek API
│   │   └── constants.js             # Constantes globales
│   │
│   ├── agents/                      # 🧠 SISTEMA DE AGENTES IA
│   │   ├── BaseAgent.js             # Clase padre de todos los agentes
│   │   ├── TranslatorAgent.js       # Traducción contextual (MOMENTO 1)
│   │   ├── VocabularyAgent.js       # Explicaciones de vocabulario (MOMENTO 1)
│   │   ├── PersonalizerAgent.js     # Ejemplos personalizados (MOMENTO 1)
│   │   ├── CreativeAgent.js         # Contenido creativo (MOMENTO 1)
│   │   # Sistema extensible - más agentes se añaden según necesidad
│   │   # Fase 2 añadirá: CorrectorAgent, EvaluatorAgent, TeacherAgent, TutorAgent
│   │   ├── AgentService.js          # Orquestador principal (decide qué agente usar)
│   │   └── CacheService.js          # 💰 Servicio de caché inteligente
│   │
│   ├── services/
│   │   ├── authService.js           # Autenticación y roles
│   │   ├── activityService.js       # CRUD de actividades
│   │   ├── progressService.js       # Gestión de progreso
│   │   ├── aiService.js             # Integración con IA (usa AgentService)
│   │   ├── badgeService.js          # Sistema de badges
│   │   ├── statsService.js          # Estadísticas y reportes
│   │   ├── storageService.js        # Gestión de archivos
│   │   ├── agentAnalyticsService.js # 🆕 Análisis de agentes (solo admin)
│   │   └── adminService.js          # 🆕 Servicios administrativos
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.js
│   │   │   ├── RegisterForm.js
│   │   │   └── ProtectedRoute.js
│   │   │
│   │   ├── activity/
│   │   │   ├── ActivityCard.js
│   │   │   ├── ActivityViewer.js
│   │   │   ├── AnswerInput.js
│   │   │   ├── AIAssistant.js
│   │   │   └── FeedbackPanel.js
│   │   │
│   │   ├── dashboard/
│   │   │   ├── UserDashboard.js
│   │   │   ├── ProgressChart.js
│   │   │   ├── BadgeDisplay.js
│   │   │   └── StatsCard.js
│   │   │
│   │   ├── admin/
│   │   │   ├── SuperadminDashboard.js
│   │   │   ├── UserManagement.js
│   │   │   ├── ActivityEditor.js
│   │   │   ├── ActivityAgentConfig.js    # 🆕 Configurar agentes por actividad
│   │   │   ├── AnalyticsPanel.js
│   │   │   ├── AgentMonitor.js           # 🆕 Monitor de agentes en tiempo real
│   │   │   ├── AgentHistoryViewer.js     # 🆕 Visualizador de historial de agentes
│   │   │   ├── AgentReports.js           # 🆕 Reportes detallados de agentes
│   │   │   ├── CostAnalytics.js          # 🆕 Análisis de costos de IA
│   │   │   ├── AlertsPanel.js            # 🆕 Panel de alertas
│   │   │   └── BadgeManager.js
│   │   │
│   │   ├── common/
│   │   │   ├── Header.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Modal.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Notification.js
│   │   │   ├── CustomSelect.jsx          # 🎨 Select personalizado con Inconsolata (MVP)
│   │   │   └── ContentBlock.jsx          # 🎨 Bloque de contenido modular (MVP)
│   │   │
│   │   └── practice/
│   │       ├── PracticeMode.js
│   │       ├── ReviewSession.js
│   │       └── CustomPractice.js
│   │
│   ├── pages/
│   │   ├── Landing.js               # Página de bienvenida
│   │   ├── Login.js                 # Página de login
│   │   ├── Register.js              # Página de registro
│   │   ├── UnitsIndex.js            # Índice de unidades
│   │   ├── Activity.js              # Vista de actividad
│   │   ├── UserDashboard.js         # Dashboard del usuario
│   │   ├── SuperadminDashboard.js   # Dashboard del superadmin
│   │   ├── Profile.js               # Perfil del usuario
│   │   ├── Practice.js              # Modo práctica
│   │   └── admin/
│   │       ├── ActivityForm.jsx     # 🎨 Formulario de gestión de actividades (MVP)
│   │       ├── ActivityForm.css     # 🎨 Estilos Material Design (MVP)
│   │       └── ContentBlock.css     # 🎨 Estilos para bloques modulares (MVP)
│   │
│   ├── utils/
│   │   ├── validators.js            # Validaciones de respuestas
│   │   ├── formatters.js            # Formateadores de datos
│   │   ├── helpers.js               # Funciones auxiliares
│   │   └── badgeEngine.js           # Motor de badges
│   │
│   ├── styles/
│   │   ├── main.css
│   │   ├── components.css
│   │   ├── dashboard.css
│   │   └── responsive.css
│   │
│   └── App.js                        # Componente principal
│
├── netlify.toml                      # Configuración de Netlify
├── netlify/
│   └── functions/                    # Netlify Functions (API Backend)
│       ├── auth/                     # Endpoints de autenticación
│       │   ├── login.js
│       │   ├── register.js
│       │   └── verify-token.js
│       ├── activities/               # CRUD de actividades
│       │   ├── get-activities.js
│       │   ├── submit-answer.js
│       │   └── get-progress.js
│       ├── agents/                   # Endpoints para agentes IA
│       │   ├── correct.js
│       │   ├── evaluate.js
│       │   ├── translate.js
│       │   └── generate.js
│       └── utils/
│           ├── db-connection.js      # Conexión a Neon.tech
│           └── auth-middleware.js    # Validación JWT
│
├── database/
│   ├── migrations/                   # Migraciones SQL para Neon.tech
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_badges.sql
│   │   └── 003_add_indexes.sql
│   └── seeds/                        # Datos iniciales
│       └── initial_data.sql
│
├── package.json
└── README.md
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN PASO A PASO

### **FASE 1: CONFIGURACIÓN INICIAL (Día 1-2)**

#### **Paso 1.1: Crear base de datos en Neon.tech**
```bash
# 1. Ir a https://neon.tech
# 2. Crear cuenta GRATIS (sin tarjeta de crédito requerida)
# 3. Create Project:
#    - Project name: elias-mvp
#    - PostgreSQL version: 17
#    - Region: Elegir el más cercano
# 4. Neon creará automáticamente:
#    - Database: neondb (o nombre personalizado)
#    - Role: Un usuario con permisos completos
# 5. Copiar Connection String desde el dashboard
# 6. Guardar variables de entorno:
#    - DATABASE_URL (connection string completa)
#    O por separado:
#    - DB_HOST (ep-xxx-xxx.region.aws.neon.tech)
#    - DB_PORT (5432)
#    - DB_NAME (neondb)
#    - DB_USER (nombre del role)
#    - DB_PASSWORD (generado automáticamente)
```

#### **Paso 1.2: Configurar Auth0 o Clerk**

**Opción A - Auth0** (Recomendado):
```bash
# 1. Ir a https://auth0.com
# 2. Crear cuenta gratuita (7,000 usuarios MAU)
# 3. Create Application → Single Page Application
# 4. Configurar:
#    - Allowed Callback URLs: http://localhost:5173, https://tuapp.netlify.app
#    - Allowed Logout URLs: (same)
#    - Allowed Web Origins: (same)
# 5. Habilitar "Username-Password-Authentication"
# 6. Guardar:
#    - AUTH0_DOMAIN
#    - AUTH0_CLIENT_ID
#    - AUTH0_CLIENT_SECRET (para backend)
```

**Opción B - Clerk.dev**:
```bash
# 1. Ir a https://clerk.dev
# 2. Crear cuenta gratuita (10,000 usuarios MAU)
# 3. Create Application
# 4. Guardar:
#    - CLERK_FRONTEND_API
#    - CLERK_API_KEY
```

#### **Paso 1.3: Crear estructura de base de datos**
```bash
# Conectar a Neon.tech usando psql:
psql -h [DB_HOST] -U postgres -d postgres

# Ejecutar migraciones SQL:
# 1. Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para caché con similitud

# 2. Ejecutar scripts de database/migrations/
\i database/migrations/001_initial_schema.sql
\i database/migrations/002_add_badges.sql
\i database/migrations/003_add_indexes.sql

# 3. Cargar datos iniciales
\i database/seeds/initial_data.sql
```

#### **Paso 1.4: Configurar Netlify**
```bash
# 1. Conectar repositorio de GitHub a Netlify
# 2. Configurar variables de entorno:
#    - DB_HOST
#    - DB_PORT
#    - DB_NAME
#    - DB_USER
#    - DB_PASSWORD
#    - AUTH0_DOMAIN (o CLERK_API_KEY)
#    - AUTH0_CLIENT_ID
#    - AUTH0_CLIENT_SECRET
#    - DEEPSEEK_API_KEY
#    - JWT_SECRET (generar uno aleatorio)
# 3. Configurar build settings:
#    - Build command: npm run build
#    - Publish directory: dist
#    - Functions directory: netlify/functions
```

#### **Paso 1.5: Inicializar proyecto frontend**
```bash
cd /Users/armandocruz/Desktop/demo-ar-libro

# Crear estructura de carpetas
mkdir -p src/{config,agents,services,components/{auth,activity,dashboard,admin,common,practice},pages,utils,styles}
mkdir -p public/{images/{badges,avatars,units},icons}
mkdir -p netlify/functions/{auth,activities,agents,utils}
mkdir -p database/{migrations,seeds}

# Instalar dependencias
npm init -y
npm install pg                         # PostgreSQL client
npm install @auth0/auth0-react        # Auth0 para React
npm install jsonwebtoken bcryptjs     # JWT y password hashing
npm install date-fns chart.js recharts
npm install dotenv                    # Variables de entorno

# Dependencias de desarrollo
npm install -D @netlify/functions
```

---

### **FASE 2: AUTENTICACIÓN Y ROLES (Día 3-4)**

#### **Paso 2.1: Configurar Auth0 en React**
Archivo: `src/config/auth0.js`
```javascript
import { Auth0Provider } from '@auth0/auth0-react'

export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin
  }
}

// Wrap App con Auth0Provider en main.jsx
```

Archivo: `netlify/functions/utils/db-connection.js`
```javascript
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // Para Neon.tech
  }
})

export const query = (text, params) => pool.query(text, params)
```

#### **Paso 2.2: Implementar authService.js**
```javascript
// src/services/authService.js
import { useAuth0 } from '@auth0/auth0-react'

export class AuthService {
  async createUserProfile(authUserId, email, fullName) {
    // Llamar a Netlify Function para crear perfil en PostgreSQL
    const response = await fetch('/.netlify/functions/auth/create-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authUserId, email, fullName })
    })
    return response.json()
  }

  async getUserRole(authUserId) {
    // Obtener rol desde PostgreSQL
    const response = await fetch(`/.netlify/functions/auth/get-role?userId=${authUserId}`)
    return response.json()
  }

  async isSuperAdmin(authUserId) {
    const { role } = await this.getUserRole(authUserId)
    return role === 'superadmin'
  }
}
```

#### **Paso 2.3: Crear Netlify Functions para autenticación**
Archivo: `netlify/functions/auth/create-profile.js`
```javascript
import { query } from '../utils/db-connection'

exports.handler = async (event) => {
  const { authUserId, email, fullName } = JSON.parse(event.body)

  const result = await query(
    `INSERT INTO user_profiles (auth_user_id, email, full_name, role)
     VALUES ($1, $2, $3, 'user')
     ON CONFLICT (auth_user_id) DO NOTHING
     RETURNING *`,
    [authUserId, email, fullName]
  )

  return {
    statusCode: 200,
    body: JSON.stringify(result.rows[0])
  }
}
```

#### **Paso 2.4: Crear componentes de autenticación**
- `LoginButton.js` (usa `loginWithRedirect` de Auth0)
- `LogoutButton.js` (usa `logout` de Auth0)
- `ProtectedRoute.js` (usa `isAuthenticated` de Auth0)

#### **Paso 2.5: Crear primer superadmin**
```sql
-- Ejecutar en Neon.tech después de registrar usuario:
UPDATE user_profiles
SET role = 'superadmin'
WHERE email = 'tu-email@ejemplo.com';
```

---

### **FASE 3: GESTIÓN DE ACTIVIDADES (Día 5-7)**

#### **Paso 3.1: Poblar base de datos con contenido**
```sql
-- Insertar Unidad 1
INSERT INTO units (unit_number, title, subtitle, color_theme, order_index)
VALUES (1, 'Saludos', 'Aprende a presentarte y saludar', '#FDB813', 1);

-- Insertar Sección 1A
INSERT INTO sections (unit_id, section_code, title, order_index)
VALUES (1, '1A', 'Hola, ¿qué tal?', 1);

-- Insertar Actividad 1A-1
INSERT INTO activities (
  section_id,
  activity_code,
  type,
  title,
  question,
  context,
  ai_config,
  prompts,
  scoring,
  order_index
) VALUES (
  1,
  '1A-1',
  'conversation',
  '¿Te gusta salir con amigos?',
  '¿Te gusta salir con tus amigos? ¿Dónde vais?',
  '{"vocabulary": ["al cine", "a tomar algo", "a bailar"], "grammar": ["gustar + infinitivo", "ir + a + lugar"]}'::jsonb,
  '{"enabledFeatures": ["traduccion", "ejemplos", "correccion"], "checkAnswers": true}'::jsonb,
  '{"system": "Eres Eliana, asistente de español A1..."}'::jsonb,
  '{"maxPoints": 10, "criteria": ["gramática", "vocabulario", "coherencia"]}'::jsonb,
  1
);
```

#### **Paso 3.2: Implementar activityService.js**
```javascript
// src/services/activityService.js
export class ActivityService {
  async getAllUnits()
  async getUnitById(id)
  async getSectionsByUnit(unitId)
  async getActivitiesBySection(sectionId)
  async getActivityById(id)
  async createActivity(data) // Solo superadmin
  async updateActivity(id, data) // Solo superadmin
  async deleteActivity(id) // Solo superadmin
}
```

#### **Paso 3.3: Crear componentes de actividades**
- `ActivityCard.js`
- `ActivityViewer.js`
- `AnswerInput.js`
- `AIAssistant.js`
- `FeedbackPanel.js`

---

### **FASE 4: INTEGRACIÓN CON IA Y SISTEMA DE AGENTES (Día 8-10)**

> **⚠️ NOTA IMPORTANTE SOBRE CÓDIGO DE EJEMPLO**:
> Los ejemplos de código en esta sección muestran sintaxis de Supabase (`supabase.from()`, `supabase.rpc()`) por simplicidad y legibilidad.
>
> **Para Neon.tech PostgreSQL**, debes adaptar estos ejemplos usando:
> - `query()` con SQL directo en lugar de `.from()`
> - Parámetros con `$1, $2, etc.` en lugar de métodos encadenados
> - Funciones SQL nativas en lugar de `.rpc()`
> - Netlify Functions para endpoints API
>
> Ejemplo de conversión:
> ```javascript
> // Supabase (ejemplo):
> await supabase.from('activities').select('*').eq('id', activityId)
>
> // Neon.tech (adaptado):
> await query('SELECT * FROM activities WHERE id = $1', [activityId])
> ```

#### **Paso 4.1: Implementar BaseAgent (clase padre)**
```javascript
// src/agents/BaseAgent.js
export class BaseAgent {
  constructor(config) {
    this.name = config.name
    this.apiKey = config.apiKey || process.env.DEEPSEEK_API_KEY
    this.systemPrompt = config.systemPrompt
    this.baseUrl = 'https://api.deepseek.com/v1/chat/completions'
  }

  async execute(userInput, context = {}) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()
    return data.choices[0].message.content
  }
}
```

#### **Paso 4.2: Implementar agentes especializados**
```javascript
// src/agents/CorrectorAgent.js
import { BaseAgent } from './BaseAgent.js'

export class CorrectorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Corrector',
      systemPrompt: 'Eres un corrector de español nivel A1. Identifica errores gramaticales y ortográficos.'
    })
  }

  async correct(text, level = 'A1') {
    const prompt = `Corrige este texto en español nivel ${level}: "${text}"`
    return await this.execute(prompt)
  }
}

// src/agents/EvaluatorAgent.js
import { BaseAgent } from './BaseAgent.js'

export class EvaluatorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Evaluator',
      systemPrompt: 'Eres un evaluador educativo. Califica respuestas de 0-10 y da feedback constructivo.'
    })
  }

  async evaluate(activity, userAnswer) {
    const prompt = `
      Actividad: ${activity.question}
      Respuesta del usuario: ${userAnswer}

      Evalúa esta respuesta en formato JSON:
      {
        "score": 0-10,
        "feedback": "comentario constructivo",
        "errors": ["error1", "error2"],
        "suggestions": ["sugerencia1"]
      }
    `
    const result = await this.execute(prompt)
    return JSON.parse(result)
  }
}

// src/agents/TranslatorAgent.js
import { BaseAgent } from './BaseAgent.js'

export class TranslatorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Translator',
      systemPrompt: 'Eres un traductor especializado en contextos educativos.'
    })
  }

  async translate(text, targetLang, context = '') {
    const prompt = `Traduce al ${targetLang}: "${text}". Contexto: ${context}`
    return await this.execute(prompt)
  }
}

// Implementar: GeneratorAgent, TeacherAgent, TutorAgent siguiendo el mismo patrón
```

#### **Paso 4.3: Implementar CacheService (Caché Inteligente)** 🆕 💰
```javascript
// src/agents/CacheService.js
import crypto from 'crypto'
import { supabase } from '../config/supabase.js'

export class CacheService {
  constructor() {
    this.SIMILARITY_THRESHOLD = 0.85 // 85% de similitud para match
    this.CACHE_EXPIRATION_DAYS = 30 // Caché válido por 30 días
  }

  // Normalizar texto para comparación
  normalizeText(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
      .replace(/[^\w\s]/g, '') // Quitar puntuación
      .trim()
  }

  // Generar hash único del input
  generateHash(input, agentName, activityId, context = {}) {
    const normalized = this.normalizeText(input)
    const contextStr = JSON.stringify(context)
    const combined = `${agentName}-${activityId}-${normalized}-${contextStr}`
    return crypto.createHash('sha256').update(combined).digest('hex')
  }

  // Buscar en caché (búsqueda exacta por hash)
  async findExactMatch(hash) {
    const { data } = await supabase
      .from('ai_response_cache')
      .select('*')
      .eq('input_hash', hash)
      .eq('is_active', true)
      .single()

    return data
  }

  // Buscar respuesta similar (búsqueda por similitud de texto)
  async findSimilarMatch(agentName, activityId, normalizedInput) {
    // Usar pg_trgm para búsqueda de similitud
    const { data } = await supabase
      .rpc('find_similar_cache', {
        p_agent_name: agentName,
        p_activity_id: activityId,
        p_input: normalizedInput,
        p_threshold: this.SIMILARITY_THRESHOLD,
        p_limit: 1
      })

    return data && data.length > 0 ? data[0] : null
  }

  // Obtener respuesta del caché (intenta exacta primero, luego similar)
  async get(agentName, activityId, userInput, interactionType, context = {}) {
    const startTime = Date.now()
    const hash = this.generateHash(userInput, agentName, activityId, context)
    const normalized = this.normalizeText(userInput)

    // 1. Buscar match exacto
    let cached = await this.findExactMatch(hash)

    // 2. Si no hay match exacto, buscar similar
    if (!cached) {
      cached = await this.findSimilarMatch(agentName, activityId, normalized)
    }

    if (cached) {
      // Actualizar métricas de uso
      await this.updateUsageMetrics(cached.id)

      console.log(`💰 CACHE HIT: Ahorrado ~${cached.tokens_saved} tokens`)

      return {
        response: cached.ai_response,
        metadata: cached.response_metadata,
        fromCache: true,
        cacheId: cached.id,
        similarity: cached.similarity || 1.0
      }
    }

    console.log(`🔍 CACHE MISS: Se necesita llamar a IA`)
    return null
  }

  // Guardar respuesta en caché
  async set(agentName, activityId, userInput, aiResponse, interactionType, context = {}, metadata = {}) {
    const hash = this.generateHash(userInput, agentName, activityId, context)
    const normalized = this.normalizeText(userInput)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + this.CACHE_EXPIRATION_DAYS)

    const cacheEntry = {
      agent_name: agentName,
      activity_id: activityId,
      interaction_type: interactionType,
      input_hash: hash,
      input_text: userInput,
      input_normalized: normalized,
      ai_response: aiResponse,
      response_metadata: metadata,
      context_data: context,
      expires_at: expiresAt.toISOString(),
      usage_count: 1,
      tokens_saved: 0,
      cost_saved_usd: 0
    }

    const { data, error } = await supabase
      .from('ai_response_cache')
      .insert(cacheEntry)
      .select()
      .single()

    if (error) {
      console.error('Error guardando en caché:', error)
      return null
    }

    console.log(`💾 Respuesta guardada en caché: ${data.id}`)
    return data
  }

  // Actualizar métricas cuando se reutiliza una respuesta
  async updateUsageMetrics(cacheId) {
    // Estimar tokens y costo ahorrado
    const ESTIMATED_TOKENS_SAVED = 150 // Promedio por respuesta
    const COST_PER_1M_TOKENS = 0.14 // DeepSeek pricing
    const costSaved = (ESTIMATED_TOKENS_SAVED / 1000000) * COST_PER_1M_TOKENS

    await supabase
      .from('ai_response_cache')
      .update({
        usage_count: supabase.raw('usage_count + 1'),
        tokens_saved: supabase.raw(`tokens_saved + ${ESTIMATED_TOKENS_SAVED}`),
        cost_saved_usd: supabase.raw(`cost_saved_usd + ${costSaved}`),
        last_used_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', cacheId)
  }

  // Obtener estadísticas de ahorro
  async getSavingsStats() {
    const { data } = await supabase
      .from('ai_response_cache')
      .select('usage_count, tokens_saved, cost_saved_usd')

    const totalUsages = data.reduce((sum, item) => sum + item.usage_count, 0)
    const totalTokensSaved = data.reduce((sum, item) => sum + item.tokens_saved, 0)
    const totalCostSaved = data.reduce((sum, item) => sum + parseFloat(item.cost_saved_usd), 0)

    return {
      totalCachedResponses: data.length,
      totalReuses: totalUsages - data.length,
      totalTokensSaved,
      totalCostSaved: totalCostSaved.toFixed(2),
      avgUsagePerResponse: (totalUsages / data.length).toFixed(1)
    }
  }

  // Limpiar caché expirado
  async cleanExpiredCache() {
    const { data } = await supabase
      .from('ai_response_cache')
      .delete()
      .lt('expires_at', new Date().toISOString())

    console.log(`🧹 Limpiadas ${data?.length || 0} entradas expiradas`)
    return data
  }
}

// Exportar como singleton
export const cacheService = new CacheService()
```

#### **Paso 4.4: Función SQL para búsqueda de similitud**
```sql
-- Crear función para buscar respuestas similares usando pg_trgm
CREATE OR REPLACE FUNCTION find_similar_cache(
  p_agent_name VARCHAR,
  p_activity_id INTEGER,
  p_input TEXT,
  p_threshold FLOAT DEFAULT 0.85,
  p_limit INTEGER DEFAULT 1
)
RETURNS TABLE (
  id INTEGER,
  agent_name VARCHAR,
  activity_id INTEGER,
  input_hash VARCHAR,
  input_text TEXT,
  input_normalized TEXT,
  ai_response TEXT,
  response_metadata JSONB,
  context_data JSONB,
  usage_count INTEGER,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.agent_name,
    c.activity_id,
    c.input_hash,
    c.input_text,
    c.input_normalized,
    c.ai_response,
    c.response_metadata,
    c.context_data,
    c.usage_count,
    similarity(c.input_normalized, p_input) as similarity
  FROM ai_response_cache c
  WHERE c.agent_name = p_agent_name
    AND c.activity_id = p_activity_id
    AND c.is_active = true
    AND similarity(c.input_normalized, p_input) >= p_threshold
  ORDER BY similarity DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
```

#### **Paso 4.5: Implementar AgentService con Caché Inteligente**
```javascript
// src/agents/AgentService.js
import { CorrectorAgent } from './CorrectorAgent.js'
import { EvaluatorAgent } from './EvaluatorAgent.js'
import { TranslatorAgent } from './TranslatorAgent.js'
import { GeneratorAgent } from './GeneratorAgent.js'
import { TeacherAgent } from './TeacherAgent.js'
import { TutorAgent } from './TutorAgent.js'
import { cacheService } from './CacheService.js'
import { supabase } from '../config/supabase.js'

class AgentService {
  constructor() {
    // Inicializar todos los agentes (Singleton)
    this.corrector = new CorrectorAgent()
    this.evaluator = new EvaluatorAgent()
    this.translator = new TranslatorAgent()
    this.generator = new GeneratorAgent()
    this.teacher = new TeacherAgent()
    this.tutor = new TutorAgent()
  }

  // Método principal: decide qué agente usar según la acción
  async processRequest(action, params, userId = null) {
    const startTime = Date.now()

    // Preparar contexto para caché
    const context = {
      level: params.level || 'A1',
      targetLang: params.targetLang,
      userAge: params.userAge
    }

    // 1. INTENTAR OBTENER DEL CACHÉ
    const agentName = this.getAgentNameFromAction(action)
    const activityId = params.activity?.id || params.activityId
    const userInput = params.text || params.answer || JSON.stringify(params)

    const cached = await cacheService.get(
      agentName,
      activityId,
      userInput,
      action,
      context
    )

    if (cached) {
      // Registrar que fue del caché
      await this.logInteraction(
        userId,
        activityId,
        agentName,
        action,
        userInput,
        cached.response,
        0, // 0 tokens usados
        Date.now() - startTime,
        true, // was_cached = true
        0 // $0 costo
      )

      return cached.response
    }

    // 2. NO HAY CACHÉ: LLAMAR AL AGENTE
    let result
    let tokensUsed = 0

    switch(action) {
      case 'correct':
        result = await this.corrector.correct(params.text, params.level)
        tokensUsed = 150
        break
      case 'evaluate':
        result = await this.evaluator.evaluate(params.activity, params.answer)
        tokensUsed = 200
        break
      case 'translate':
        result = await this.translator.translate(params.text, params.targetLang, params.context)
        tokensUsed = 100
        break
      case 'generateExamples':
        result = await this.generator.generate(params.activity, params.userAge, params.count)
        tokensUsed = 300
        break
      case 'explain':
        result = await this.teacher.explain(params.concept, params.level)
        tokensUsed = 250
        break
      case 'help':
        result = await this.tutor.provideHelp(params.activity, params.question)
        tokensUsed = 180
        break
      default:
        throw new Error(`Acción desconocida: ${action}`)
    }

    const responseTime = Date.now() - startTime
    const costUsd = (tokensUsed / 1000000) * 0.14 // DeepSeek pricing

    // 3. GUARDAR EN CACHÉ
    await cacheService.set(
      agentName,
      activityId,
      userInput,
      result,
      action,
      context,
      typeof result === 'object' ? result : {}
    )

    // 4. REGISTRAR INTERACCIÓN
    await this.logInteraction(
      userId,
      activityId,
      agentName,
      action,
      userInput,
      result,
      tokensUsed,
      responseTime,
      false, // was_cached = false
      costUsd
    )

    return result
  }

  getAgentNameFromAction(action) {
    const mapping = {
      'correct': 'Corrector',
      'evaluate': 'Evaluator',
      'translate': 'Translator',
      'generateExamples': 'Generator',
      'explain': 'Teacher',
      'help': 'Tutor'
    }
    return mapping[action] || 'Unknown'
  }

  async logInteraction(userId, activityId, agentName, interactionType, userInput, aiResponse, tokensUsed, responseTime, wasCached, costUsd) {
    await supabase.from('ai_interactions').insert({
      user_id: userId,
      activity_id: activityId,
      agent_name: agentName,
      interaction_type: interactionType,
      user_input: userInput,
      ai_response: typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse),
      tokens_used: tokensUsed,
      response_time_ms: responseTime,
      was_cached: wasCached,
      cost_usd: costUsd,
      success: true
    })
  }

  // Método específico para revisar respuestas completas
  async checkAnswer(activity, userAnswer, userId) {
    const correction = await this.processRequest('correct', {
      text: userAnswer,
      level: activity.difficulty_level,
      activityId: activity.id
    }, userId)

    const evaluation = await this.processRequest('evaluate', {
      activity,
      answer: userAnswer,
      activityId: activity.id
    }, userId)

    return {
      correction,
      evaluation,
      score: evaluation.score,
      feedback: evaluation.feedback
    }
  }
}

// Exportar como singleton
export const agentService = new AgentService()
```

#### **Paso 4.4: Integrar AgentService en aiService.js**
```javascript
// src/services/aiService.js
import { agentService } from '../agents/AgentService.js'

export class AIService {
  // Este servicio ahora actúa como interfaz hacia el sistema de agentes

  async checkAnswer(activity, userAnswer, userId) {
    return await agentService.checkAnswer(activity, userAnswer, userId)
  }

  async translate(text, targetLang, context) {
    return await agentService.processRequest('translate', { text, targetLang, context })
  }

  async generateExamples(activity, userAge, count) {
    return await agentService.processRequest('generateExamples', { activity, userAge, count })
  }

  async provideHelp(activity, question) {
    return await agentService.processRequest('help', { activity, question })
  }

  async correctGrammar(text, level) {
    return await agentService.processRequest('correct', { text, level })
  }

  async evaluateResponse(activity, answer) {
    return await agentService.processRequest('evaluate', { activity, answer })
  }

  async explainConcept(concept, level) {
    return await agentService.processRequest('explain', { concept, level })
  }
}
```

#### **Paso 4.5: Implementar validación de respuestas**
```javascript
// src/utils/validators.js
export class AnswerValidator {
  static validateBasicGrammar(text)
  static checkRequiredVocabulary(text, required)
  static calculateSimilarity(answer, correct)
  static async validateWithAI(activity, answer) {
    // Ahora usa el sistema de agentes
    const aiService = new AIService()
    return await aiService.evaluateResponse(activity, answer)
  }
}
```

---

### **FASE 5: PROGRESO Y ESTADÍSTICAS (Día 11-13)**

#### **Paso 5.1: Implementar progressService.js**
```javascript
// src/services/progressService.js
export class ProgressService {
  async saveProgress(userId, activityId, data)
  async getProgress(userId)
  async getActivityProgress(userId, activityId)
  async updateStats(userId)
  async getCompletionPercentage(userId)
  async getWeakAreas(userId)
}
```

#### **Paso 5.2: Implementar statsService.js**
```javascript
// src/services/statsService.js
export class StatsService {
  async getUserStats(userId)
  async updateStreak(userId)
  async calculateLevel(experiencePoints)
  async generateReport(userId, period) // 'week', 'month', 'all'
  async getLeaderboard(limit)
}
```

#### **Paso 5.3: Crear componentes de dashboard**
- `UserDashboard.js`
- `ProgressChart.js`
- `StatsCard.js`
- `ActivityHistory.js`

---

### **FASE 6: SISTEMA DE BADGES (Día 14-15)**

#### **Paso 6.1: Poblar badges en la base de datos**
```sql
-- Badges de progreso
INSERT INTO badges (code, name, description, category, condition_type, condition_value, rarity)
VALUES
  ('first_activity', 'Primer Paso', 'Completa tu primera actividad', 'progress', 'activities_completed', '{"count": 1}'::jsonb, 'common'),
  ('unit_1_complete', 'Unidad 1 Dominada', 'Completa toda la Unidad 1', 'progress', 'unit_completed', '{"unit_id": 1}'::jsonb, 'rare'),
  ('perfect_score', 'Perfeccionista', 'Obtén 10/10 en una actividad', 'achievement', 'perfect_score', '{"score": 10}'::jsonb, 'epic'),
  ('streak_7', 'Constancia', '7 días seguidos practicando', 'achievement', 'streak_days', '{"days": 7}'::jsonb, 'rare'),
  ('ai_helper', 'Curioso', 'Usa todas las funciones de IA', 'special', 'ai_features_used', '{"count": 4}'::jsonb, 'common');
```

#### **Paso 6.2: Implementar badgeService.js**
```javascript
// src/services/badgeService.js
export class BadgeService {
  async checkAndAwardBadges(userId)
  async getUserBadges(userId)
  async awardBadge(userId, badgeId)
  async getBadgeProgress(userId, badgeCode)
}
```

#### **Paso 6.3: Implementar motor de badges**
```javascript
// src/utils/badgeEngine.js
export class BadgeEngine {
  static async evaluateCondition(userId, badge)
  static async notifyBadgeEarned(userId, badge)
}
```

#### **Paso 6.4: Crear componentes de badges**
- `BadgeDisplay.js`
- `BadgeModal.js`
- `BadgeNotification.js`

---

### **FASE 7: DASHBOARD DE SUPERADMIN Y GESTIÓN DE AGENTES (Día 16-18)**

#### **Paso 7.1: Crear SuperadminDashboard.js**
Funcionalidades:
- Ver todos los usuarios
- Estadísticas globales
- **Monitor de agentes IA en tiempo real**
- Gestión de actividades
- Ver progreso de todos
- Gestión de badges
- Reportes avanzados
- **Panel de alertas de sistema**

#### **Paso 7.2: Implementar agentAnalyticsService.js** 🆕
```javascript
// src/services/agentAnalyticsService.js
export class AgentAnalyticsService {
  // Obtener todas las interacciones con filtros
  async getInteractions(filters = {}) {
    // filters: { agent_name, user_id, activity_id, date_from, date_to, interaction_type }
    let query = supabase.from('ai_interactions').select(`
      *,
      user_profiles(full_name, email),
      activities(title, activity_code)
    `)

    if (filters.agent_name) query = query.eq('agent_name', filters.agent_name)
    if (filters.user_id) query = query.eq('user_id', filters.user_id)
    if (filters.activity_id) query = query.eq('activity_id', filters.activity_id)
    if (filters.date_from) query = query.gte('created_at', filters.date_from)
    if (filters.date_to) query = query.lte('created_at', filters.date_to)

    return await query.order('created_at', { ascending: false })
  }

  // Obtener estadísticas por agente
  async getAgentStats(agentName, period = 'day') {
    const { data } = await supabase
      .from('agent_stats')
      .select('*')
      .eq('agent_name', agentName)
      .order('date', { ascending: false })
      .limit(period === 'day' ? 30 : 12)

    return data
  }

  // Obtener resumen de todos los agentes
  async getAllAgentsSummary(dateFrom, dateTo) {
    const { data } = await supabase.rpc('get_agents_summary', {
      date_from: dateFrom,
      date_to: dateTo
    })

    return data
  }

  // Análisis de costos
  async getCostAnalysis(period = 'month') {
    const { data } = await supabase.rpc('get_cost_analysis', { period })

    return {
      totalCost: data.total_cost,
      costByAgent: data.cost_by_agent,
      costByUser: data.cost_by_user,
      costByActivity: data.cost_by_activity,
      projection: data.projected_monthly_cost
    }
  }

  // Análisis de eficiencia (cache hits)
  async getCacheEfficiency(agentName = null) {
    let query = supabase.from('ai_interactions').select('was_cached')

    if (agentName) query = query.eq('agent_name', agentName)

    const { data } = await query

    const total = data.length
    const cached = data.filter(i => i.was_cached).length

    return {
      total,
      cached,
      hitRate: (cached / total * 100).toFixed(2),
      savings: cached * 0.001 // Estimación de ahorro en USD
    }
  }

  // Obtener agentes más usados
  async getTopAgents(limit = 10, dateFrom, dateTo) {
    const { data } = await supabase
      .from('ai_interactions')
      .select('agent_name')
      .gte('created_at', dateFrom)
      .lte('created_at', dateTo)

    const counts = {}
    data.forEach(i => {
      counts[i.agent_name] = (counts[i.agent_name] || 0) + 1
    })

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, count]) => ({ agent_name: name, call_count: count }))
  }

  // Obtener métricas de rendimiento por agente
  async getAgentPerformance(agentName) {
    const { data } = await supabase
      .from('ai_interactions')
      .select('response_time_ms, success, tokens_used, cost_usd')
      .eq('agent_name', agentName)

    const successful = data.filter(i => i.success)

    return {
      totalCalls: data.length,
      successRate: (successful.length / data.length * 100).toFixed(2),
      avgResponseTime: (data.reduce((sum, i) => sum + i.response_time_ms, 0) / data.length).toFixed(0),
      totalTokens: data.reduce((sum, i) => sum + i.tokens_used, 0),
      totalCost: data.reduce((sum, i) => sum + i.cost_usd, 0).toFixed(4)
    }
  }

  // Buscar en historial
  async searchHistory(searchTerm, filters = {}) {
    let query = supabase
      .from('ai_interactions')
      .select('*')
      .or(`user_input.ilike.%${searchTerm}%,ai_response.ilike.%${searchTerm}%`)

    if (filters.agent_name) query = query.eq('agent_name', filters.agent_name)
    if (filters.user_id) query = query.eq('user_id', filters.user_id)

    return await query.order('created_at', { ascending: false })
  }

  // Exportar historial
  async exportHistory(format = 'csv', filters = {}) {
    const { data } = await this.getInteractions(filters)

    if (format === 'csv') {
      return this.convertToCSV(data)
    } else if (format === 'json') {
      return JSON.stringify(data, null, 2)
    }
  }

  convertToCSV(data) {
    const headers = ['ID', 'Usuario', 'Agente', 'Tipo', 'Input', 'Respuesta', 'Tokens', 'Costo', 'Fecha']
    const rows = data.map(row => [
      row.id,
      row.user_profiles?.email || 'N/A',
      row.agent_name,
      row.interaction_type,
      row.user_input.substring(0, 50),
      row.ai_response?.substring(0, 50) || 'N/A',
      row.tokens_used,
      row.cost_usd,
      row.created_at
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
}
```

#### **Paso 7.3: Implementar adminService.js extendido** 🆕
```javascript
// src/services/adminService.js
export class AdminService {
  async getAllUsers()
  async getUserDetails(userId)
  async getAllProgress()
  async getGlobalStats()

  // 🆕 Gestión de configuración de agentes por actividad
  async getActivityAgentConfig(activityId) {
    const { data } = await supabase
      .from('activity_agent_config')
      .select('*')
      .eq('activity_id', activityId)

    return data
  }

  async updateActivityAgentConfig(activityId, agentName, config) {
    const { data } = await supabase
      .from('activity_agent_config')
      .upsert({
        activity_id: activityId,
        agent_name: agentName,
        is_enabled: config.is_enabled,
        custom_prompt: config.custom_prompt,
        config: config.config
      })

    return data
  }

  // 🆕 Gestión de alertas
  async getAlerts(filters = {}) {
    let query = supabase.from('admin_alerts').select('*')

    if (filters.alert_type) query = query.eq('alert_type', filters.alert_type)
    if (filters.severity) query = query.eq('severity', filters.severity)
    if (filters.is_resolved !== undefined) query = query.eq('is_resolved', filters.is_resolved)

    return await query.order('created_at', { ascending: false })
  }

  async createAlert(alertData) {
    const { data } = await supabase
      .from('admin_alerts')
      .insert(alertData)

    return data
  }

  async resolveAlert(alertId, adminUserId) {
    const { data } = await supabase
      .from('admin_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: adminUserId
      })
      .eq('id', alertId)

    return data
  }

  // 🆕 Ver historial de usuario con agentes
  async getUserAgentHistory(userId) {
    const { data } = await supabase
      .from('ai_interactions')
      .select(`
        *,
        activities(title, activity_code)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Agrupar por agente
    const byAgent = {}
    data.forEach(interaction => {
      if (!byAgent[interaction.agent_name]) {
        byAgent[interaction.agent_name] = []
      }
      byAgent[interaction.agent_name].push(interaction)
    })

    return {
      all: data,
      byAgent,
      totalInteractions: data.length,
      totalCost: data.reduce((sum, i) => sum + (i.cost_usd || 0), 0)
    }
  }

  async exportData(format) // 'csv', 'json', 'pdf'
  async bulkOperations()
}
```

#### **Paso 7.4: Implementar componentes admin de agentes** 🆕

**AgentMonitor.js** - Monitor en tiempo real
```javascript
// src/components/admin/AgentMonitor.js
export function AgentMonitor() {
  const [agentStats, setAgentStats] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)

  // Actualizar cada 30 segundos
  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0]
      const stats = await Promise.all(
        ['Corrector', 'Evaluator', 'Translator', 'Generator', 'Teacher', 'Tutor'].map(
          agent => agentAnalyticsService.getAgentPerformance(agent)
        )
      )
      setAgentStats(stats)
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="agent-monitor">
      <h2>Monitor de Agentes IA en Tiempo Real</h2>
      <div className="agent-grid">
        {agentStats.map(stat => (
          <AgentCard key={stat.agent_name} stat={stat} />
        ))}
      </div>
    </div>
  )
}
```

**AgentHistoryViewer.js** - Visualizador de historial
```javascript
// src/components/admin/AgentHistoryViewer.js
export function AgentHistoryViewer() {
  const [interactions, setInteractions] = useState([])
  const [filters, setFilters] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const loadInteractions = async () => {
    const data = await agentAnalyticsService.getInteractions(filters)
    setInteractions(data)
  }

  const handleSearch = async () => {
    const results = await agentAnalyticsService.searchHistory(searchTerm, filters)
    setInteractions(results)
  }

  const handleExport = async (format) => {
    const exported = await agentAnalyticsService.exportHistory(format, filters)
    downloadFile(exported, `agent-history.${format}`)
  }

  return (
    <div className="agent-history-viewer">
      <FilterPanel filters={filters} onChange={setFilters} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} onSearch={handleSearch} />
      <ExportButtons onExport={handleExport} />
      <InteractionTable interactions={interactions} />
    </div>
  )
}
```

**ActivityAgentConfig.js** - Configurar agentes por actividad
```javascript
// src/components/admin/ActivityAgentConfig.js
export function ActivityAgentConfig({ activityId }) {
  const [config, setConfig] = useState([])
  const agents = ['Corrector', 'Evaluator', 'Translator', 'Generator', 'Teacher', 'Tutor']

  useEffect(() => {
    loadConfig()
  }, [activityId])

  const loadConfig = async () => {
    const data = await adminService.getActivityAgentConfig(activityId)
    setConfig(data)
  }

  const toggleAgent = async (agentName, isEnabled) => {
    await adminService.updateActivityAgentConfig(activityId, agentName, {
      is_enabled: isEnabled
    })
    loadConfig()
  }

  const updatePrompt = async (agentName, customPrompt) => {
    await adminService.updateActivityAgentConfig(activityId, agentName, {
      custom_prompt: customPrompt
    })
  }

  return (
    <div className="activity-agent-config">
      <h3>Configuración de Agentes para esta Actividad</h3>
      {agents.map(agent => (
        <AgentConfigRow
          key={agent}
          agentName={agent}
          config={config.find(c => c.agent_name === agent)}
          onToggle={toggleAgent}
          onUpdatePrompt={updatePrompt}
        />
      ))}
    </div>
  )
}
```

#### **Paso 7.5: Crear vistas de reportes de agentes** 🆕

**AgentReports.js** - Reportes detallados
**CostAnalytics.js** - Análisis de costos
**AlertsPanel.js** - Panel de alertas

---

### **FASE 8: MODO PRÁCTICA Y REPASO (Día 19-20)**

#### **Paso 8.1: Implementar sistema de práctica**
```javascript
// src/services/practiceService.js
export class PracticeService {
  async createReviewSession(userId)
  async getWeakAreasActivities(userId)
  async createCustomSession(userId, activityIds)
  async saveSessionProgress(sessionId, data)
}
```

#### **Paso 8.2: Crear componentes de práctica**
- `PracticeMode.js` - Modo práctica general
- `ReviewSession.js` - Repaso de actividades débiles
- `CustomPractice.js` - Práctica personalizada

#### **Paso 8.3: Implementar resúmenes inteligentes**
```javascript
// src/utils/summaryGenerator.js
export class SummaryGenerator {
  static async generateWeeklySummary(userId)
  static async generateUnitSummary(userId, unitId)
  static async generateRecommendations(userId)
}
```

---

### **FASE 9: REFINAMIENTO Y UX (Día 21-23)**

#### **Paso 9.1: Mejorar interfaz de usuario**
- Diseño responsive completo
- Animaciones y transiciones
- Dark mode (opcional)
- Accesibilidad (a11y)

#### **Paso 9.2: Optimización de rendimiento**
- Lazy loading de componentes
- Caché de datos frecuentes
- Optimización de imágenes
- Minificación de assets

#### **Paso 9.3: Notificaciones y feedback**
- Sistema de notificaciones en tiempo real
- Toast messages
- Confirmaciones de acciones
- Mensajes de éxito/error

---

### **FASE 10: TESTING Y DEPLOYMENT (Día 24-25)**

#### **Paso 10.1: Testing**
- Pruebas unitarias de servicios
- Pruebas de integración
- Pruebas de roles y permisos
- Pruebas de flujos completos

#### **Paso 10.2: Configurar Netlify**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### **Paso 10.3: Desplegar**
```bash
# Commit y push a GitHub
git add .
git commit -m "Initial deployment"
git push origin main

# Netlify automáticamente desplegará
```

---

## 📱 FUNCIONALIDADES POR ROL

### **👤 USUARIO NORMAL**

#### **Dashboard Personal**
- ✅ Progreso general (% completado)
- ✅ Estadísticas personales
  - Actividades completadas
  - Puntuación promedio
  - Tiempo total de estudio
  - Racha de días consecutivos
- ✅ Badges obtenidos
- ✅ Gráfico de progreso semanal
- ✅ Próximas actividades sugeridas

#### **Vista de Actividades**
- ✅ Ver todas las unidades y secciones
- ✅ Indicadores de progreso por unidad
- ✅ Hacer actividades
- ✅ Ver respuestas anteriores
- ✅ Usar asistente de IA:
  - Traducir al idioma nativo
  - Pedir ejemplos personalizados
  - Corrección de respuestas
  - Pedir ayuda contextual
- ✅ Comprobar respuestas
- ✅ Ver feedback detallado
- ✅ Guardar progreso automático

#### **Historial**
- ✅ Ver todas las respuestas guardadas
- ✅ Filtrar por unidad/sección
- ✅ Ver calificaciones obtenidas
- ✅ Revisar feedback de IA

#### **Modo Práctica**
- ✅ Repaso de áreas débiles
- ✅ Práctica personalizada
- ✅ Sesiones de repaso
- ✅ Ejercicios aleatorios

#### **Resúmenes**
- ✅ Resumen semanal de actividad
- ✅ Resumen por unidad completada
- ✅ Recomendaciones personalizadas
- ✅ Exportar progreso (PDF)

#### **Perfil**
- ✅ Editar información personal
- ✅ Cambiar idioma nativo
- ✅ Ver nivel actual y XP
- ✅ Ver todos los badges
- ✅ Configuración de notificaciones

---

### **👑 SUPERADMIN**

#### **Dashboard Global**
- ✅ Estadísticas de todos los usuarios
- ✅ Actividad reciente
- ✅ Usuarios activos hoy/semana/mes
- ✅ Actividades más difíciles
- ✅ Tiempo promedio por actividad
- ✅ Gráficos de uso
- ✅ **Monitor de Agentes IA en tiempo real**
  - Agentes más utilizados
  - Tasa de acierto por agente
  - Tiempo de respuesta promedio
  - Costo acumulado por agente

#### **Gestión de Usuarios**
- ✅ Listar todos los usuarios
- ✅ Ver perfil detallado de cualquier usuario
- ✅ Ver progreso completo de usuario
- ✅ Ver historial de respuestas
- ✅ **Ver historial de interacciones con agentes IA**
  - Qué agentes ha usado cada usuario
  - Frecuencia de uso por agente
  - Resultados obtenidos
- ✅ Ver badges obtenidos
- ✅ Editar roles
- ✅ Eliminar usuarios
- ✅ Enviar notificaciones

#### **Gestión de Actividades**
- ✅ CRUD completo de actividades
- ✅ Editor visual de actividades
- ✅ **Visualizar qué agentes intervienen en cada actividad**
  - Ver configuración de agentes por actividad
  - Asignar/desasignar agentes específicos
  - Configurar qué agentes están disponibles
- ✅ **Monitor de rendimiento de actividades**
  - Agentes más usados por actividad
  - Tasa de éxito por actividad
  - Feedback de agentes agregado
- ✅ Configurar prompts personalizados de agentes
- ✅ Definir respuestas correctas
- ✅ Configurar criterios de evaluación
- ✅ Activar/desactivar actividades
- ✅ Reordenar actividades

#### **Gestión de Badges**
- ✅ Crear nuevos badges
- ✅ Editar badges existentes
- ✅ Configurar condiciones
- ✅ Asignar manualmente badges
- ✅ Ver estadísticas de badges

#### **Historial de Agentes IA** 🆕
- ✅ **Visualizar todas las interacciones con agentes**
  - Filtrar por agente (Corrector, Evaluator, Translator, etc.)
  - Filtrar por usuario
  - Filtrar por actividad
  - Filtrar por fecha/rango de fechas
- ✅ **Análisis detallado de interacciones**
  - Ver input del usuario
  - Ver respuesta del agente
  - Ver prompt usado
  - Tokens consumidos
  - Tiempo de respuesta
- ✅ **Búsqueda avanzada en historial**
  - Buscar por palabra clave
  - Buscar por tipo de interacción
  - Exportar resultados

#### **Reportes y Análisis**
- ✅ Reporte de uso general
- ✅ Actividades más/menos completadas
- ✅ Usuarios más activos
- ✅ Tasa de finalización
- ✅ Tiempo promedio por actividad
- ✅ Análisis de respuestas
- ✅ **Reportes de Agentes IA** 🆕
  - Uso de cada agente (cantidad de llamadas)
  - Costo total por agente
  - Costo por usuario
  - Análisis de eficiencia (cache hits vs misses)
  - Agentes más/menos usados
  - Distribución de uso por hora/día/semana
  - Tendencias de uso
  - Comparativa entre agentes
- ✅ **Reportes de Costos** 🆕
  - Costo total de IA por período
  - Costo por usuario
  - Costo por actividad
  - Proyección de costos
  - Alertas de límites de gasto
- ✅ Exportar datos (CSV, JSON, PDF)
  - Exportar historial completo de agentes
  - Exportar reportes de costos
  - Exportar análisis de rendimiento

#### **Configuración Global**
- ✅ Configurar API keys
- ✅ Ajustar límites de uso de IA
- ✅ **Configuración de Agentes** 🆕
  - Habilitar/deshabilitar agentes globalmente
  - Configurar rate limiting por agente
  - Configurar tiempo de cache
  - Configurar límites de tokens por agente
  - Configurar temperatura y parámetros de IA
- ✅ Configurar sistema de puntos
- ✅ Gestionar niveles
- ✅ Configurar notificaciones
- ✅ **Alertas y Monitoreo** 🆕
  - Configurar alertas de costo
  - Alertas de errores en agentes
  - Alertas de latencia alta
  - Notificaciones de uso anómalo

---

## 🎮 SISTEMA DE GAMIFICACIÓN

### **Niveles y Experiencia**
```javascript
const LEVELS = [
  { level: 1, minXP: 0, maxXP: 100, title: "Principiante" },
  { level: 2, minXP: 100, maxXP: 250, title: "Aprendiz" },
  { level: 3, minXP: 250, maxXP: 500, title: "Estudiante" },
  { level: 4, minXP: 500, maxXP: 1000, title: "Intermedio" },
  { level: 5, minXP: 1000, maxXP: 2000, title: "Avanzado" },
  { level: 6, minXP: 2000, maxXP: 5000, title: "Experto" },
  { level: 7, minXP: 5000, maxXP: 10000, title: "Maestro" }
]

// Obtener XP:
// - Completar actividad: 10 XP
// - Puntuación perfecta: +5 XP bonus
// - Racha de 7 días: +20 XP
// - Completar unidad: +50 XP
```

### **Badges Completos**

#### **Badges de Progreso (Common)**
- 🎯 Primer Paso - Completa tu primera actividad
- 📖 Lector - Completa 5 actividades
- 🚀 Imparable - Completa 20 actividades
- 🏆 Completista - Completa 50 actividades

#### **Badges de Unidad (Rare)**
- 🌟 Unidad 1 Dominada
- 🌟 Unidad 2 Dominada
- 🌟 ... (por cada unidad)

#### **Badges de Achievement (Epic)**
- 💯 Perfeccionista - Obtén 10/10 en una actividad
- 🎯 Francotirador - 5 puntuaciones perfectas
- 🔥 En Llamas - 10 puntuaciones perfectas
- ⚡ Rápido - Completa actividad en < 2 minutos

#### **Badges Sociales (Rare)**
- 🤝 Constancia - 7 días seguidos
- 📅 Dedicado - 30 días seguidos
- 💪 Leyenda - 100 días seguidos

#### **Badges Especiales (Legendary)**
- 🧠 Curioso - Usa todas las funciones de IA
- 🌍 Políglota - Traduce a 5 idiomas diferentes
- 🎓 Graduado - Completa todas las unidades
- 👑 Maestro ELE - Nivel 7 alcanzado

---

## 🔧 TECNOLOGÍAS Y DEPENDENCIAS

### **Frontend**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "date-fns": "^2.30.0",
    "recharts": "^2.10.0",
    "html2pdf.js": "^0.10.1",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### **Backend (Supabase)**
- PostgreSQL 15
- PostgREST API
- Supabase Auth
- Supabase Storage
- Supabase Realtime

### **IA - Sistema de Agentes**
- **DeepSeek API** (chat completions)
- **Arquitectura de agentes extensible**: BaseAgent + agentes especializados
  - **MVP (MOMENTO 1)**: 4 agentes iniciales de aprendizaje
    - TranslatorAgent (traducción contextual)
    - VocabularyAgent (explicaciones de vocabulario)
    - PersonalizerAgent (ejemplos personalizados)
    - CreativeAgent (contenido creativo)
  - **Sistema extensible**: Más agentes se añaden según necesidad
  - **Fase 2 añadirá (MOMENTO 2)**: Agentes de evaluación
    - CorrectorAgent, EvaluatorAgent, TeacherAgent, TutorAgent
- **AgentService**: Orquestador principal con patrón Singleton
- **Cache interno**: Optimización de llamadas repetidas

### **Deployment**
- Netlify (Frontend)
- Supabase Cloud (Backend)

---

## 📊 MÉTRICAS Y KPIs

### **Para Usuarios**
- Actividades completadas
- Puntuación promedio
- Tiempo de estudio
- Racha de días
- Badges obtenidos
- Nivel alcanzado

### **Para Superadmin**
- DAU (Daily Active Users)
- WAU (Weekly Active Users)
- Tasa de retención
- Tiempo promedio por sesión
- Actividades por usuario
- Tasa de finalización de unidades
- Uso de funciones de IA
- Badges más obtenidos

---

## 🔒 SEGURIDAD

### **Mejores Prácticas**
✅ Row Level Security (RLS) en todas las tablas
✅ Validación de roles en frontend y backend
✅ API keys en variables de entorno
✅ HTTPS obligatorio
✅ Rate limiting en IA requests
✅ Sanitización de inputs
✅ Protección contra SQL injection (automático con Supabase)
✅ CORS configurado correctamente

---

## 📈 ROADMAP FUTURO

### **V2.0 (Futuro)**
- 🎤 Reconocimiento de voz
- 🔊 Text-to-speech para pronunciación
- 📱 App móvil (React Native)
- 👥 Modo multijugador/competitivo
- 💬 Chat entre estudiantes
- 📹 Vídeos explicativos
- 🎯 Tests de nivel automáticos
- 🌐 Más niveles (A2, B1, B2)

---

## 📞 SOPORTE Y CONTACTO

### **Documentación**
- Supabase: https://supabase.com/docs
- DeepSeek: https://platform.deepseek.com/docs
- Netlify: https://docs.netlify.com

### **Monitoreo**
- Supabase Dashboard: Logs y errores
- Netlify Analytics: Tráfico y rendimiento
- Sentry (opcional): Error tracking

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Setup Inicial**
- [ ] Crear proyecto Supabase
- [ ] Crear proyecto Netlify
- [ ] Obtener API key de DeepSeek
- [ ] Configurar variables de entorno
- [ ] Inicializar repositorio Git

### **Base de Datos**
- [ ] Crear todas las tablas
- [ ] Aplicar políticas RLS
- [ ] Crear índices
- [ ] Poblar datos iniciales (unidades, actividades, badges)
- [ ] Crear primer superadmin

### **Autenticación**
- [ ] Implementar registro
- [ ] Implementar login
- [ ] Implementar logout
- [ ] Sistema de roles
- [ ] Rutas protegidas

### **Funcionalidades Usuario**
- [ ] Dashboard personal
- [ ] Vista de actividades
- [ ] Hacer actividades con IA
- [ ] Guardar progreso
- [ ] Ver historial
- [ ] Sistema de badges
- [ ] Modo práctica
- [ ] Resúmenes

### **Funcionalidades Superadmin**
- [ ] Dashboard global
- [ ] Gestión de usuarios
- [ ] Gestión de actividades
- [ ] Gestión de badges
- [ ] Reportes y análisis
- [ ] Configuración global

### **Testing**
- [ ] Pruebas de autenticación
- [ ] Pruebas de roles
- [ ] Pruebas de actividades
- [ ] Pruebas de IA
- [ ] Pruebas de progreso
- [ ] Pruebas de badges

### **Deployment**
- [ ] Build exitoso
- [ ] Variables de entorno configuradas
- [ ] Deploy en Netlify
- [ ] Verificar funcionamiento completo
- [ ] Configurar dominio (opcional)

---

## 🎯 RESUMEN EJECUTIVO

Este proyecto es una **plataforma completa de aprendizaje de español** con:

✅ **Frontend moderno** en Netlify
✅ **Backend robusto** con Supabase
✅ **Sistema de Agentes IA** especializado con 6 agentes (Corrector, Evaluator, Translator, Generator, Teacher, Tutor)
✅ **Arquitectura escalable** con AgentService como orquestador central
✅ **Sistema de roles** (Usuario y Superadmin)
✅ **Gamificación completa** (badges, niveles, XP)
✅ **Tracking detallado** de progreso
✅ **Reportes y análisis** avanzados
✅ **Cache inteligente** para optimizar costos de IA

**Tiempo estimado de implementación**: 20-25 días
**Costo mensual estimado**:
- Supabase: $0-25 (según uso)
- Netlify: $0-19 (según tráfico)
- DeepSeek API: $0-50 (según uso de IA - optimizado con cache)

**Total**: $0-100/mes (muy escalable según crecimiento)

### **Ventajas del Sistema de Agentes**:
🧠 **Especialización**: Cada agente es experto en una tarea específica
⚡ **Rendimiento**: Cache y optimización de llamadas a IA
💰 **Costo eficiente**: 96% más económico que alternativas como LangGraph
🔧 **Mantenible**: Código modular y fácil de extender
📊 **Trazabilidad**: Registro de qué agente procesa cada petición

### **Sistema de Caché Inteligente** 💰:

El sistema implementa un **caché agresivo** que minimiza drásticamente el uso de la API de DeepSeek:

#### **Cómo Funciona**:
1. **Primera vez**: Usuario hace pregunta → Se llama a DeepSeek → Se guarda respuesta en BD
2. **Siguientes veces**: Usuario hace pregunta similar → Se busca en caché → Se devuelve respuesta guardada **sin llamar a IA**

#### **Búsqueda Inteligente**:
- **Match exacto**: Hash SHA256 del input normalizado
- **Match similar**: Algoritmo de similitud de texto (pg_trgm) con 85% de umbral
- **Normalización**: Elimina tildes, mayúsculas, puntuación para mejor matching

#### **Ejemplo de Ahorro**:
```
Usuario 1: "Me gusta ir al cine con mis amigos"
→ Llama a IA: $0.00002 → Guarda en caché

Usuario 2: "me gusta ir al cine con amigos"
→ Match 92% similitud → Respuesta del caché: $0 → Ahorro: 100%

Usuario 3: "Me gusta ir al cine con mis amigas"
→ Match 95% similitud → Respuesta del caché: $0 → Ahorro: 100%
```

#### **Impacto Económico Proyectado**:
- **Sin caché**: 1000 usuarios × 50 interacciones = 50,000 llamadas = ~$1.40/día = **$42/mes**
- **Con caché (60% hit rate)**: 20,000 llamadas = ~$0.56/día = **$17/mes**
- **Con caché (80% hit rate)**: 10,000 llamadas = ~$0.28/día = **$8/mes**
- **Ahorro potencial**: **70-80% de reducción en costos de IA**

#### **Dashboard para Superadmin**:
- Ver total de respuestas cacheadas
- Tasa de acierto del caché (cache hit rate)
- Dinero ahorrado en tiempo real
- Respuestas más reutilizadas
- Gestión manual del caché (limpiar, desactivar entries)

---
---

# 📋 APÉNDICE: GUÍA DETALLADA DEL MVP (FASE 1)

## 🎯 OBJETIVO DEL MVP

Crear una versión **simple y funcional** en **1 semana** para validar la plataforma con 100 usuarios beta, obteniendo feedback real antes de desarrollar todas las funcionalidades avanzadas.

---

## 🏗️ ARQUITECTURA SIMPLIFICADA DEL MVP

```
┌─────────────────────────────────────────┐
│  FRONTEND (HTML/CSS/JS + React básico)  │
│  • Landing page                          │
│  • Login/Register                        │
│  • Dashboard usuario                     │
│  • Vista de actividades                  │
│  • Modal de IA (Asistente)               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         SUPABASE (Backend)              │
│  • Auth (email/password)                │
│  • PostgreSQL:                          │
│    - user_profiles                      │
│    - activities (hardcoded inicial)     │
│    - user_progress                      │
│    - user_answers                       │
│    - ai_cache (opcional)                │
│  • Edge Function (opcional):            │
│    - agent-handler (procesa IA)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         DEEPSEEK API                    │
│  MOMENTO 1 (MVP - Aprendizaje):         │
│  • Traducción (TranslatorAgent)         │
│  • Vocabulario (VocabularyAgent)        │
│  • Personalización (PersonalizerAgent)  │
│  • Creatividad (CreativeAgent)          │
│  + Más agentes según necesidad          │
└─────────────────────────────────────────┘
```

**SIMPLIFICACIONES PARA MVP**:
- ✅ Sin sistema de cola complejo (llamadas directas)
- ✅ Cache simple en memoria (no Redis ni PostgreSQL)
- ✅ Rate limiting básico (frontend)
- ✅ Base de datos enfocada en MOMENTO 1 (6 tablas)
- ✅ Sistema de agentes extensible (4 agentes iniciales de aprendizaje, más se añaden según necesidad)
- ✅ Sin dashboard de superadmin completo
- ✅ Sistema de logros básico (gamificación completa en Fase 2)

---

## 📊 BASE DE DATOS MVP - MOMENTO 1 (6 TABLAS)

### **1. user_profiles (perfiles básicos)**

```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email VARCHAR NOT NULL,
  full_name VARCHAR,
  native_language VARCHAR DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **2. activities (actividades hardcoded inicial)**

```sql
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  unit_number INTEGER NOT NULL,
  section_code VARCHAR NOT NULL, -- "1A", "1B", etc.
  activity_code VARCHAR NOT NULL UNIQUE, -- "1A-1", "1A-2"
  title VARCHAR NOT NULL,
  question TEXT NOT NULL,
  context JSONB, -- { vocabulary: [], grammar: [] }
  correct_answers JSONB, -- Array de respuestas modelo
  difficulty VARCHAR DEFAULT 'A1',
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_unit ON activities(unit_number);
CREATE INDEX idx_activities_code ON activities(activity_code);
```

### **3. user_progress (progreso simple)**

```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id),
  status VARCHAR DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  attempts INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  last_answer TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, activity_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);
```

### **4. user_answers (historial de respuestas)**

```sql
CREATE TABLE user_answers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id),
  attempt_number INTEGER,
  answer_text TEXT NOT NULL,
  score INTEGER,
  ai_feedback JSONB, -- { correction: {}, evaluation: {} }
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_answers_user ON user_answers(user_id, activity_id);
```

### **5. ai_cache (caché simple - opcional pero recomendado)**

```sql
CREATE TABLE ai_cache (
  id SERIAL PRIMARY KEY,
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  request_type VARCHAR NOT NULL, -- 'correction', 'translation', 'evaluation', 'examples'
  request_data JSONB NOT NULL, -- Input del usuario
  result JSONB NOT NULL, -- Respuesta de la IA
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_cache_key ON ai_cache(cache_key);
CREATE INDEX idx_ai_cache_expires ON ai_cache(expires_at);
```

### **Row Level Security (RLS) Básico**

```sql
-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- Políticas: usuarios solo ven sus datos
CREATE POLICY "Users view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own answers" ON user_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own answers" ON user_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Actividades son públicas (solo lectura)
CREATE POLICY "Activities public read" ON activities
  FOR SELECT USING (true);
```

---

## 🤖 SISTEMA DE AGENTES SIMPLIFICADO

### **Estructura de archivos del MVP:**

```
src/
├── config/
│   └── supabase.js              # Cliente de Supabase + auth helpers
│
├── agents/
│   ├── BaseAgent.js             # Clase base para todos los agentes
│   ├── TranslatorAgent.js       # Traducción contextual (MOMENTO 1)
│   ├── VocabularyAgent.js       # Explicaciones de vocabulario (MOMENTO 1)
│   ├── PersonalizerAgent.js     # Ejemplos personalizados (MOMENTO 1)
│   └── CreativeAgent.js         # Contenido creativo (MOMENTO 1)
│   # Sistema extensible: más agentes se añaden según necesidad
│
├── services/
│   ├── agentService.js          # Servicio principal (orquestador)
│   └── cacheService.js          # Cache simple en memoria (opcional)
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── activities/
│   │   ├── ActivityViewer.jsx   # Vista principal de actividad
│   │   ├── ActivityCard.jsx
│   │   └── FeedbackPanel.jsx
│   └── dashboard/
│       ├── UserDashboard.jsx    # Dashboard básico
│       └── ProgressCard.jsx
│
└── pages/
    ├── LandingPage.jsx
    ├── LoginPage.jsx
    ├── DashboardPage.jsx
    └── ActivityPage.jsx
```

### **Código de Implementación MVP**

#### **1. config/supabase.js**

```javascript
// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper: Obtener usuario actual
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper: Sign up
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })

  if (error) throw error

  // Crear perfil
  if (data.user) {
    await supabase.from('user_profiles').insert({
      id: data.user.id,
      email: email,
      full_name: fullName
    })
  }

  return data
}

// Helper: Sign in
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

// Helper: Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

#### **2. agents/BaseAgent.js**

```javascript
// src/agents/BaseAgent.js
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions'

export class BaseAgent {
  constructor(config) {
    this.name = config.name
    this.systemPrompt = config.systemPrompt
    this.temperature = config.temperature || 0.7
    this.maxTokens = config.maxTokens || 500
  }

  async execute(userInput, context = {}) {
    try {
      const response = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: userInput }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        success: true,
        content: data.choices[0].message.content,
        tokensUsed: data.usage?.total_tokens || 0
      }
    } catch (error) {
      console.error(`${this.name} error:`, error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}
```

#### **3. agents/CorrectorAgent.js**

```javascript
// src/agents/CorrectorAgent.js
import { BaseAgent } from './BaseAgent.js'

export class CorrectorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Corrector',
      temperature: 0.3,
      maxTokens: 600,
      systemPrompt: `Eres un corrector experto de español nivel A1.

Corrige el texto del estudiante e identifica errores.

IMPORTANTE: Responde SIEMPRE en formato JSON válido:
{
  "hasErrors": boolean,
  "errors": [
    {
      "type": "gramática/ortografía/conjugación",
      "incorrect": "texto mal",
      "correct": "texto bien",
      "explanation": "por qué está mal"
    }
  ],
  "correctedText": "texto corregido completo",
  "generalFeedback": "comentario motivador"
}`
    })
  }

  async correct(text, level = 'A1') {
    const prompt = `Nivel: ${level}
Texto del estudiante: "${text}"

Corrige y responde en JSON.`

    const result = await this.execute(prompt)

    if (result.success) {
      try {
        const parsed = JSON.parse(result.content)
        return { ...result, data: parsed }
      } catch (e) {
        console.error('JSON parse error:', e)
        return result
      }
    }

    return result
  }
}
```

#### **4. agents/EvaluatorAgent.js**

```javascript
// src/agents/EvaluatorAgent.js
import { BaseAgent } from './BaseAgent.js'

export class EvaluatorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Evaluator',
      temperature: 0.2,
      maxTokens: 500,
      systemPrompt: `Eres un evaluador objetivo de español nivel A1.

Evalúa la respuesta del estudiante en estos criterios:
- Gramática (40%)
- Vocabulario (30%)
- Coherencia (20%)
- Creatividad (10%)

IMPORTANTE: Responde en JSON:
{
  "finalScore": número 0-10,
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "weaknesses": ["debilidad 1"],
  "feedback": "comentario constructivo",
  "isPassing": boolean (>= 6)
}`
    })
  }

  async evaluate(activity, userAnswer) {
    const prompt = `Actividad: ${activity.question}
Respuesta del estudiante: "${userAnswer}"

Evalúa y responde en JSON.`

    const result = await this.execute(prompt)

    if (result.success) {
      try {
        const parsed = JSON.parse(result.content)
        return { ...result, evaluation: parsed }
      } catch (e) {
        return result
      }
    }

    return result
  }
}
```

#### **5. services/agentService.js (Orquestador Principal MVP)**

```javascript
// src/services/agentService.js
import { CorrectorAgent } from '../agents/CorrectorAgent.js'
import { EvaluatorAgent } from '../agents/EvaluatorAgent.js'
import { TranslatorAgent } from '../agents/TranslatorAgent.js'
import { GeneratorAgent } from '../agents/GeneratorAgent.js'
import { supabase } from '../config/supabase.js'

class AgentService {
  constructor() {
    this.corrector = new CorrectorAgent()
    this.evaluator = new EvaluatorAgent()
    this.translator = new TranslatorAgent()
    this.generator = new GeneratorAgent()
    this.cache = new Map() // Cache simple en memoria
  }

  /**
   * Comprobar respuesta completa (corrección + evaluación)
   */
  async checkAnswer(activity, userAnswer, userId) {
    // 1. Verificar cache
    const cacheKey = `check_${activity.id}_${this.simpleHash(userAnswer)}`
    if (this.cache.has(cacheKey)) {
      console.log('✅ Respuesta desde cache')
      return this.cache.get(cacheKey)
    }

    // 2. Corrección
    const correction = await this.corrector.correct(userAnswer, 'A1')

    // 3. Evaluación
    const evaluation = await this.evaluator.evaluate(activity, userAnswer)

    // 4. Combinar resultados
    const result = {
      correction: correction.data || correction,
      evaluation: evaluation.evaluation || {},
      score: evaluation.evaluation?.finalScore || 0,
      isPassing: evaluation.evaluation?.isPassing || false,
      timestamp: new Date().toISOString()
    }

    // 5. Guardar en base de datos
    await this.saveAnswer(userId, activity.id, userAnswer, result)

    // 6. Actualizar progreso
    await this.updateProgress(userId, activity.id, result.score)

    // 7. Guardar en cache (5 minutos)
    this.cache.set(cacheKey, result)
    setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000)

    return result
  }

  /**
   * Traducir texto
   */
  async translateText(text, targetLang = 'en') {
    const cacheKey = `translate_${targetLang}_${this.simpleHash(text)}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const result = await this.translator.translate(text, targetLang)

    if (result.success) {
      this.cache.set(cacheKey, result)
      setTimeout(() => this.cache.delete(cacheKey), 10 * 60 * 1000)
    }

    return result
  }

  /**
   * Generar ejemplos personalizados
   */
  async generateExamples(activity, count = 3) {
    const result = await this.generator.generate(activity, count)
    return result
  }

  /**
   * Guardar respuesta en BD
   */
  async saveAnswer(userId, activityId, answer, result) {
    // Contar intentos
    const { count } = await supabase
      .from('user_answers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('activity_id', activityId)

    const { error } = await supabase
      .from('user_answers')
      .insert({
        user_id: userId,
        activity_id: activityId,
        attempt_number: (count || 0) + 1,
        answer_text: answer,
        score: result.score,
        ai_feedback: {
          correction: result.correction,
          evaluation: result.evaluation
        }
      })

    if (error) console.error('Error guardando respuesta:', error)
  }

  /**
   * Actualizar progreso del usuario
   */
  async updateProgress(userId, activityId, score) {
    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_id', activityId)
      .single()

    if (existing) {
      // Actualizar si es mejor score
      if (score > existing.best_score) {
        await supabase
          .from('user_progress')
          .update({
            best_score: score,
            attempts: existing.attempts + 1,
            status: score >= 6 ? 'completed' : 'in_progress',
            completed_at: score >= 6 ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
      } else {
        // Solo incrementar intentos
        await supabase
          .from('user_progress')
          .update({
            attempts: existing.attempts + 1,
            status: 'in_progress',
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
      }
    } else {
      // Crear nuevo
      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          activity_id: activityId,
          attempts: 1,
          best_score: score,
          status: score >= 6 ? 'completed' : 'in_progress',
          completed_at: score >= 6 ? new Date().toISOString() : null
        })
    }
  }

  /**
   * Obtener progreso del usuario
   */
  async getUserProgress(userId) {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        activities (
          id,
          title,
          unit_number,
          section_code,
          activity_code
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  /**
   * Obtener estadísticas básicas del usuario
   */
  async getUserStats(userId) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)

    const completed = progress?.filter(p => p.status === 'completed').length || 0
    const total = progress?.length || 0
    const avgScore = progress?.length
      ? progress.reduce((sum, p) => sum + p.best_score, 0) / progress.length
      : 0

    return {
      totalActivities: total,
      completedActivities: completed,
      averageScore: Math.round(avgScore * 10) / 10,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  /**
   * Hash simple para cache keys
   */
  simpleHash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString(36)
  }
}

export const agentService = new AgentService()
```

#### **6. components/ActivityViewer.jsx (Componente Principal)**

```jsx
// src/components/activities/ActivityViewer.jsx
import { useState } from 'react'
import { agentService } from '../../services/agentService'
import { getCurrentUser } from '../../config/supabase'

export function ActivityViewer({ activity }) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!answer.trim()) return

    setLoading(true)
    try {
      const user = await getCurrentUser()
      const result = await agentService.checkAnswer(
        activity,
        answer,
        user.id
      )
      setResult(result)
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="activity-container">
      <h2>{activity.title}</h2>
      <p className="question">{activity.question}</p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Escribe tu respuesta aquí..."
        rows={6}
        className="answer-input"
        disabled={loading}
      />

      <button
        onClick={handleCheck}
        disabled={!answer.trim() || loading}
        className="check-button"
      >
        {loading ? 'Comprobando...' : '✓ Comprobar Respuesta'}
      </button>

      {result && (
        <div className="result-panel">
          <h3>Resultado</h3>

          <div className="score">
            Puntuación: <strong>{result.score}/10</strong>
            {result.isPassing ? ' ✅ ¡Aprobado!' : ' ❌ Intenta de nuevo'}
          </div>

          {result.correction?.hasErrors && (
            <div className="correction">
              <h4>Correcciones:</h4>
              {result.correction.errors.map((error, i) => (
                <div key={i} className="error-item">
                  <strong>{error.type}:</strong> {error.explanation}
                  <br />
                  ❌ "{error.incorrect}" → ✅ "{error.correct}"
                </div>
              ))}
              <p><strong>Texto corregido:</strong></p>
              <p className="corrected">{result.correction.correctedText}</p>
            </div>
          )}

          <div className="feedback">
            <h4>Feedback:</h4>
            <p>{result.evaluation.feedback}</p>

            {result.evaluation.strengths?.length > 0 && (
              <>
                <strong>Fortalezas:</strong>
                <ul>
                  {result.evaluation.strengths.map((s, i) => (
                    <li key={i}>✅ {s}</li>
                  ))}
                </ul>
              </>
            )}

            {result.evaluation.weaknesses?.length > 0 && (
              <>
                <strong>A mejorar:</strong>
                <ul>
                  {result.evaluation.weaknesses.map((w, i) => (
                    <li key={i}>⚠️ {w}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 📐 SISTEMA DE CONTROL DE NIVEL MCER (Level Strictness)

### **Propuesta: Parámetro de Adherencia al Nivel**

El sistema AgentIA ele incorpora un **parámetro configurable de adherencia al nivel MCER** (`level_strictness`) que permite controlar qué tan estrictos deben ser los agentes con el vocabulario y gramática apropiado para cada nivel (A1, A2, B1, B2, C1, C2).

#### **Concepto**

Similar a los parámetros de IA existentes (Temperature, Max Tokens, Top P), `level_strictness` es un **índice deslizante de 0.0 a 1.0** que define el grado de flexibilidad o rigidez en el uso de elementos lingüísticos según el nivel del estudiante.

#### **Escala de Valores**

```
┌─────────────────────────────────────────────────────────────┐
│  0.0          0.25         0.5          0.75          1.0   │
│  │             │            │             │             │    │
│  Flexible                 Moderado                 Estricto │
└─────────────────────────────────────────────────────────────┘

• 0.0-0.3: FLEXIBLE
  - Permite vocabulario y estructuras ligeramente por encima o debajo del nivel
  - Útil para introducir nuevo vocabulario gradualmente
  - Exposición natural a la progresión del idioma

• 0.4-0.6: MODERADO (valor por defecto: 0.5)
  - Balance entre adherencia al nivel y flexibilidad pedagógica
  - Ocasionalmente introduce elementos del siguiente nivel con explicación
  - Recomendado para la mayoría de actividades

• 0.7-1.0: ESTRICTO
  - Solo usa vocabulario y gramática del nivel exacto
  - Ideal para evaluaciones y certificaciones
  - Garantiza que el estudiante trabaja exclusivamente con su nivel
```

#### **Implementación Técnica**

**1. Estructura del parámetro en la configuración del agente:**

```javascript
// Configuración de parámetros del agente
parameters: {
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 0.95,
  level_strictness: 0.5  // NUEVO PARÁMETRO
}
```

**2. Integración en el System Prompt:**

El parámetro `level_strictness` se incorpora dinámicamente en el system prompt del agente:

```javascript
const buildSystemPrompt = (agentConfig, levelStrictness) => {
  let levelInstruction = '';

  if (levelStrictness <= 0.3) {
    levelInstruction = `
    ADHERENCIA AL NIVEL: FLEXIBLE
    - Puedes usar vocabulario y estructuras de niveles adyacentes (±1 nivel)
    - Cuando uses elementos fuera del nivel objetivo, proporciona contexto breve
    - Enfócate en la comunicación natural y gradual progresión
    `;
  } else if (levelStrictness <= 0.6) {
    levelInstruction = `
    ADHERENCIA AL NIVEL: MODERADA
    - Usa principalmente vocabulario y gramática del nivel objetivo
    - Ocasionalmente puedes introducir elementos del siguiente nivel CON explicación clara
    - Prioriza la comprensión del estudiante
    `;
  } else {
    levelInstruction = `
    ADHERENCIA AL NIVEL: ESTRICTA
    - USA EXCLUSIVAMENTE vocabulario y gramática del nivel ${agentConfig.targetLevel}
    - NO uses estructuras o palabras de niveles superiores
    - Verifica cada respuesta contra los descriptores MCER del nivel
    `;
  }

  return `${agentConfig.basePrompt}

  NIVEL DEL ESTUDIANTE: ${agentConfig.targetLevel}
  ${levelInstruction}

  ${agentConfig.specificInstructions}`;
};
```

**3. Interfaz de Usuario (UI):**

En el panel de configuración del agente ([AgentDetailView.jsx](elias-mvp/src/pages/admin/components/AgentDetailView.jsx)), se añade un slider similar a Temperature y Top P:

```jsx
<div className="form-field">
  <label>
    Adherencia al Nivel
    <span className="param-value">{formData.parameters.level_strictness}</span>
  </label>
  <input
    type="range"
    min="0"
    max="1"
    step="0.05"
    value={formData.parameters.level_strictness}
    onChange={(e) => handleChange('parameters.level_strictness', parseFloat(e.target.value))}
  />
  <small className="field-hint">
    0 = Flexible | 1 = Estricto al nivel
  </small>
</div>
```

#### **Casos de Uso Específicos**

**Caso 1: Agente de Vocabulario con nivel A1**
- `level_strictness: 0.2` (Flexible)
- El agente puede introducir palabras de A2 en contextos familiares
- Ejemplo: Estudiante A1 pregunta sobre "comida" → el agente puede mencionar "delicioso" (A2) explicando que significa "muy bueno para comer"

**Caso 2: Agente de Gramática con nivel B1**
- `level_strictness: 0.5` (Moderado)
- El agente se centra en estructuras B1 pero puede mencionar B2 ocasionalmente
- Ejemplo: Al explicar subjuntivo presente (B1), puede mencionar brevemente que existe el subjuntivo imperfecto (B2) sin profundizar

**Caso 3: Agente Evaluador con nivel B2**
- `level_strictness: 0.9` (Estricto)
- Solo acepta y evalúa respuestas con vocabulario y gramática B2
- No da crédito por uso de estructuras de C1 o simplificaciones de B1

#### **Base de Datos de Vocabulario por Nivel**

Para que este sistema funcione de manera óptima, se recomienda crear una tabla de referencia de vocabulario categorizado por nivel MCER:

```sql
CREATE TABLE vocabulary_mcer (
  id SERIAL PRIMARY KEY,
  word VARCHAR(100) NOT NULL,
  level VARCHAR(5) NOT NULL, -- A1, A2, B1, B2, C1, C2
  category VARCHAR(50), -- sustantivo, verbo, adjetivo, etc.
  frequency INT, -- frecuencia de uso (1-100)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vocabulary_level ON vocabulary_mcer(level);
CREATE INDEX idx_vocabulary_word ON vocabulary_mcer(word);

-- Ejemplo de datos
INSERT INTO vocabulary_mcer (word, level, category, frequency) VALUES
('hola', 'A1', 'saludo', 100),
('comer', 'A1', 'verbo', 95),
('delicioso', 'A2', 'adjetivo', 70),
('aunque', 'B1', 'conjunción', 60),
('sin embargo', 'B2', 'locución', 55);
```

#### **Validación del Nivel en Runtime**

El agente puede consultar la base de datos para verificar si está respetando el nivel configurado:

```javascript
async function validateLevelCompliance(agentResponse, targetLevel, strictness) {
  // Extraer palabras de la respuesta del agente
  const words = extractWords(agentResponse);

  // Consultar nivel de cada palabra
  const wordLevels = await db.query(`
    SELECT word, level FROM vocabulary_mcer
    WHERE word = ANY($1)
  `, [words]);

  // Calcular porcentaje de palabras fuera del nivel permitido
  const levelMap = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
  const targetLevelNum = levelMap[targetLevel];
  const tolerance = Math.ceil((1 - strictness) * 2); // 0.5 → ±1 nivel

  let violations = 0;
  for (const {word, level} of wordLevels) {
    const wordLevelNum = levelMap[level];
    if (Math.abs(wordLevelNum - targetLevelNum) > tolerance) {
      violations++;
    }
  }

  const complianceRate = 1 - (violations / words.length);

  return {
    compliant: complianceRate >= 0.85, // 85% de cumplimiento mínimo
    complianceRate,
    violations
  };
}
```

#### **Beneficios Pedagógicos**

1. **Personalización por Actividad**: El profesor puede ajustar la rigidez según el objetivo pedagógico
2. **Progresión Natural**: En nivel "flexible", los estudiantes se exponen gradualmente a vocabulario del siguiente nivel
3. **Evaluaciones Justas**: En nivel "estricto", las evaluaciones son objetivas y alineadas con los estándares MCER
4. **Adaptabilidad**: Permite diferentes estrategias de enseñanza (inductiva, deductiva, comunicativa)
5. **Transparencia**: El estudiante y profesor saben exactamente qué esperar del agente

#### **Roadmap de Implementación**

**Fase 1 (Actual)**:
- ✅ Diseño conceptual del parámetro
- 🔄 Añadir campo `level_strictness` a la interfaz de configuración

**Fase 2 (Corto plazo)**:
- Integrar parámetro en el system prompt dinámico
- Crear tabla `vocabulary_mcer` con vocabulario A1-B2 básico
- Implementar validación básica post-generación

**Fase 3 (Medio plazo)**:
- Expandir base de datos de vocabulario con todas las palabras del MCER
- Añadir métricas de cumplimiento en el dashboard de agentes
- Implementar ajuste automático basado en rendimiento del estudiante

**Fase 4 (Largo plazo)**:
- Sistema de machine learning para categorización automática de vocabulario por nivel
- Validación en tiempo real (pre-generación) para mayor precisión
- Recomendaciones automáticas de `level_strictness` según tipo de actividad

---

## 📅 PLAN DE IMPLEMENTACIÓN MVP (7 DÍAS)

### **DÍA 1: Setup y Configuración**

```bash
✅ Tareas del día:
1. Crear base de datos en Neon.tech (PostgreSQL 17)
2. Ejecutar SQL para crear 6 tablas MVP (MOMENTO 1)
3. Configurar autenticación con Auth0/Clerk
4. Crear cuenta en Netlify
5. Crear proyecto React con Vite
6. Configurar variables de entorno (.env)
7. Instalar dependencias básicas

# Comandos:
npm create vite@latest agentiaele -- --template react
cd agentiaele
npm install @supabase/supabase-js
npm install react-router-dom
```

### **DÍA 2: Autenticación**

```bash
✅ Tareas del día:
1. Implementar supabase.js con helpers de auth
2. Crear componentes LoginForm.jsx y RegisterForm.jsx
3. Crear páginas LoginPage.jsx y DashboardPage.jsx
4. Implementar rutas protegidas
5. Persistencia de sesión
6. Pruebas de login/logout

Archivos a crear:
- src/config/supabase.js
- src/components/auth/LoginForm.jsx
- src/components/auth/RegisterForm.jsx
- src/pages/LoginPage.jsx
- src/App.jsx (con routing)
```

### **DÍA 3: Sistema de Agentes**

```bash
✅ Tareas del día:
1. Implementar BaseAgent.js
2. Implementar TranslatorAgent.js (MOMENTO 1)
3. Implementar VocabularyAgent.js (MOMENTO 1)
4. Implementar PersonalizerAgent.js (MOMENTO 1)
5. Implementar CreativeAgent.js (MOMENTO 1)
6. Implementar AgentService.js (orquestador)
7. Pruebas con console.log

Archivos a crear:
- src/agents/BaseAgent.js
- src/agents/TranslatorAgent.js
- src/agents/VocabularyAgent.js
- src/agents/PersonalizerAgent.js
- src/agents/CreativeAgent.js
- src/services/agentService.js

Testing:
- Probar corrección de texto simple
- Probar evaluación de respuesta
- Verificar respuestas JSON válidas
```

### **DÍA 4: Actividades y Vista Principal**

```bash
✅ Tareas del día:
1. Poblar BD con 5 actividades demo (SQL)
2. Crear componente ActivityViewer.jsx
3. Integrar agentService en el componente
4. Implementar guardado de progreso
5. Crear ActivityPage.jsx
6. Routing a actividades

SQL de actividades:
INSERT INTO activities (unit_number, section_code, activity_code, title, question, context, correct_answers, order_index) VALUES
(1, '1A', '1A-1', '¿Cómo te llamas?', '¿Cómo te llamas? ¿De dónde eres?',
 '{"vocabulary": ["nombre", "país", "ciudad"], "grammar": ["ser + de", "llamarse"]}'::jsonb,
 '["Me llamo [nombre]. Soy de [país]."]'::jsonb, 1);
-- (agregar 4 actividades más)
```

### **DÍA 5: Dashboard de Usuario**

```bash
✅ Tareas del día:
1. Implementar getUserProgress() en agentService
2. Implementar getUserStats() en agentService
3. Crear componente UserDashboard.jsx
4. Mostrar estadísticas (actividades completadas, promedio)
5. Listar actividades disponibles
6. Mostrar historial de respuestas
7. Crear DashboardPage.jsx completo

Componentes a crear:
- src/components/dashboard/UserDashboard.jsx
- src/components/dashboard/ProgressCard.jsx
- src/components/dashboard/ActivityList.jsx
```

### **DÍA 6: UI/UX y Pulido**

```bash
✅ Tareas del día:
1. Crear estilos CSS/módulos
2. Diseño responsive (móvil + desktop)
3. Loading states en todos los componentes
4. Error handling y mensajes de error
5. Animaciones básicas
6. Landing page atractiva
7. Navegación intuitiva

Archivos de estilos:
- src/styles/global.css
- src/styles/auth.css
- src/styles/activity.css
- src/styles/dashboard.css
```

### **DÍA 7: Testing, Fixes y Deploy**

```bash
✅ Tareas del día:
1. Testing con 2-3 usuarios reales
2. Fix de bugs encontrados
3. Optimización de rendimiento
4. Deploy a Netlify
5. Configurar variables de entorno en Netlify
6. Probar en producción
7. Documentación básica (README)

Deploy:
# Conectar repo a Netlify
# Build command: npm run build
# Publish directory: dist

Variables de entorno en Netlify:
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_DEEPSEEK_API_KEY
```

---

## 🎯 ACTIVIDADES DEMO PARA POBLAR (SQL)

```sql
-- 5 actividades de ejemplo para MVP (Unidad 1 - Español en Marcha A1)

INSERT INTO activities (unit_number, section_code, activity_code, title, question, context, correct_answers, order_index) VALUES

-- Actividad 1
(1, '1A', '1A-1', '¿Cómo te llamas?',
 '¿Cómo te llamas? ¿De dónde eres? Preséntate en español.',
 '{"vocabulary": ["nombre", "país", "ciudad"], "grammar": ["ser + de", "llamarse"]}'::jsonb,
 '["Me llamo María. Soy de España.", "Mi nombre es John y soy de Estados Unidos."]'::jsonb,
 1),

-- Actividad 2
(1, '1A', '1A-2', 'Saludos formales e informales',
 '¿Cómo saludas a un amigo? ¿Y a un profesor? Escribe dos saludos diferentes.',
 '{"vocabulary": ["hola", "buenos días", "¿qué tal?", "¿cómo está?"], "grammar": ["tú vs usted"]}'::jsonb,
 '["Hola, ¿qué tal? (informal)", "Buenos días, profesor. ¿Cómo está usted? (formal)"]'::jsonb,
 2),

-- Actividad 3
(1, '1B', '1B-1', 'Nacionalidades',
 'Escribe 3 frases completas sobre nacionalidades de personas que conoces o famosas.',
 '{"vocabulary": ["español", "francés", "alemán", "americano", "italiano"], "grammar": ["ser + nacionalidad"]}'::jsonb,
 '["Penélope Cruz es española.", "Barack Obama es americano.", "Emmanuel Macron es francés."]'::jsonb,
 3),

-- Actividad 4
(1, '1C', '1C-1', 'Mi profesión',
 '¿A qué te dedicas? Describe tu profesión o estudios en 2-3 frases.',
 '{"vocabulary": ["estudiante", "profesor", "doctor", "ingeniero"], "grammar": ["ser + profesión", "trabajar de"]}'::jsonb,
 '["Soy estudiante de español.", "Trabajo de profesor en una universidad.", "Soy doctor en un hospital."]'::jsonb,
 4),

-- Actividad 5
(1, '1C', '1C-2', 'Un día en mi trabajo',
 'Describe qué haces en tu trabajo o estudios. Usa el presente simple.',
 '{"vocabulary": ["estudiar", "trabajar", "enseñar", "ayudar"], "grammar": ["presente simple", "verbos regulares -ar"]}'::jsonb,
 '["Estudio español todos los días.", "Trabajo en una oficina y ayudo a los clientes.", "Enseño matemáticas a estudiantes de secundaria."]'::jsonb,
 5);
```

---

## ⚙️ VARIABLES DE ENTORNO (.env)

```bash
# .env (desarrollo local)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...tu_anon_key_aqui
VITE_DEEPSEEK_API_KEY=sk-tu_api_key_de_deepseek
```

**Importante**: Agregar `.env` a `.gitignore` para no subir las keys al repo.

---

## 📈 MÉTRICAS A MONITOREAR (Beta)

```javascript
// Tracking simple para MVP
const mvpMetrics = {
  // Usuarios
  totalSignups: 100,
  activeUsers: 85, // usuarios que han hecho al menos 1 actividad

  // Actividades
  totalAttempts: 500,
  averageScore: 7.2,
  completionRate: 65, // % de actividades completadas

  // IA
  aiRequests: 1500, // total llamadas a DeepSeek
  cacheHitRate: 45, // % de respuestas desde caché
  avgResponseTime: 2.3, // segundos

  // Costos
  totalTokens: 3000000,
  estimatedCost: 8.40 // USD total del mes
}
```

**Herramientas de tracking**:
- Google Analytics (opcional)
- Supabase Dashboard (built-in analytics)
- Console logs para debugging

---

## 📋 CHANGELOG

### [2025-11-26] - Mejoras en AgentDetailView

**Interfaz de Configuración**
- ✨ Centrado de sección de imagen del agente para mejor alineación visual
- ✨ Optimización del botón "Subir imagen" para ser más compacto (inline-flex)
- ✨ Mejora en el layout de la sección de descripción e imagen (layout en fila)

**Pestaña "Probar Agente"**
- ✨ Ocultación de pestaña "Histórico" al crear nuevo agente (solo visible al editar)
- ✨ Estandarización de botones "Limpiar" y "Guardar conversación" (negro, radius 50px, shadow)
- ✨ Cambio de color de mensajes del usuario a naranja pálido (#ffb380) con texto negro para mejor legibilidad
- ✨ Integración de imagen del agente en avatares del chat (reemplaza ícono genérico)
- ✨ Cambio de textarea de mensajes a border-radius 12px (coherente con elementos grandes)
- ✨ Reducción de tamaño del textarea (min-height: 40px, padding optimizado)
- ✨ Estandarización del botón de enviar a negro (#2c2c2c) coherente con otros botones de acción

**Estilos Globales**
- 🎨 Aplicación consistente de border-radius: 50px para botones pequeños, 12px para elementos grandes
- 🎨 Unificación de colores de botones de acción (#2c2c2c) en toda la interfaz
- 🎨 Mejora de efectos hover (translateY, box-shadow) para mejor feedback visual

---

## ✅ CHECKLIST DE LANZAMIENTO MVP

```
ANTES DE INVITAR USUARIOS BETA:

Infraestructura:
□ Base de datos creada en Neon.tech
□ 6 tablas MVP creadas con configuración adecuada
□ Al menos 5 actividades pobladas en DB
□ Variables de entorno configuradas
□ Deploy en Netlify exitoso
□ HTTPS funcionando

Funcionalidades:
□ Autenticación funcionando (login/register/logout)
□ Al menos 5 actividades operativas y visibles
□ Sistema de agentes IA respondiendo correctamente
□ Corrección de gramática funciona
□ Evaluación de respuestas funciona
□ Respuestas se guardan en BD correctamente
□ Progreso se actualiza correctamente
□ Dashboard muestra estadísticas básicas

Testing:
□ Probado en Chrome, Firefox, Safari
□ Probado en móvil (iOS y Android)
□ Probado flujo completo: registro → actividad → respuesta → resultado
□ Sin errores en consola del navegador
□ Tiempos de carga aceptables (< 3 segundos)

Documentación:
□ README básico con instrucciones
□ Variables de entorno documentadas
□ Instrucciones para usuarios beta

OPCIONAL PERO RECOMENDADO:
□ Google Analytics configurado
□ Formulario de feedback (Google Forms)
□ Email de bienvenida automático
□ Tutorial/onboarding al primer login
□ FAQ básico
```

---

## 🚀 SIGUIENTE PASO DESPUÉS DEL MVP

Una vez validado el MVP con 100 usuarios beta (1-2 semanas de uso real), proceder con:

1. **Análisis de feedback**
2. **Decisión de continuar a Fase 2**
3. **Desarrollo de versión completa** (PROYECTO-COMPLETO.md)
4. **Migración gradual** de usuarios beta a producción

---

**FIN DEL APÉNDICE MVP**
