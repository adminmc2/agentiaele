# 🗄️ ARQUITECTURA DE BASE DE DATOS - AgentIAele

## 📊 DIAGRAMA DE RELACIONES

```
┌─────────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL 17 (Neon.tech)                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   user_profiles      │  (Tabla maestro de usuarios)
├──────────────────────┤
│ id (PK)             │
│ auth_user_id (UQ)   │  ← Auth0/Clerk
│ email (UQ)          │
│ full_name           │
│ level (A1-C2)       │
│ send_chat_emails    │
└──────────┬───────────┘
           │
           │ (1:N)
           ├─────────────────────────────────┐
           │                                 │
           ▼                                 ▼
┌─────────────────────┐           ┌──────────────────────┐
│  class_sessions     │◄─────────►│  class_activities    │
├─────────────────────┤   (N:1)   ├──────────────────────┤
│ id (PK)            │           │ id (PK)              │
│ user_id (FK) ──────┼──┐        │ book_code (EM1-4)    │
│ activity_id (FK) ───┼──┼────────│ unit_number (1-12)   │
│ session_start      │  │        │ activity_type        │
│ session_end        │  │        │ activity_structure   │
│ last_active_at     │  │        │ title                │
│ chat_messages (JSON)│  │        │ instructions         │
│ ai_agents_used     │  │        │ content (JSONB)      │
│ total_interactions │  │        │ available_agents     │
│ time_spent_seconds │  │        └──────────────────────┘
│ email_sent         │  │
└──────────┬──────────┘  │
           │             │
           │ (1:N)       │
           ▼             │
┌──────────────────────┐ │
│  user_interactions   │ │  (Tabla analítica para IA/ML)
├──────────────────────┤ │
│ id (PK)             │ │
│ session_id (FK) ────┼─┘
│ user_id (FK) ───────┼──────────┐
│ activity_id (FK)    │          │
│ user_question       │          │
│ user_question_topic │          │
│ agent_type          │          │
│ agent_response      │          │
│ interaction_index   │          │
│ user_rating (1-5)   │          │
└─────────────────────┘          │
                                 │
           ┌─────────────────────┘
           │ (1:N)
           ▼
┌──────────────────────┐
│  user_achievements   │  (Gamificación)
├──────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ achievement_type    │
│ achievement_category│
│ points              │
│ metadata (JSONB)    │
└─────────────────────┘


┌──────────────────────┐
│     ai_cache         │  (Sistema de caché independiente)
├──────────────────────┤
│ id (PK)             │
│ cache_key (UQ)      │  ← SHA-256 de prompt + params
│ prompt_hash         │
│ agent_type          │
│ response (JSONB)    │
│ hit_count           │  ← Contador de reusos
│ last_used_at        │
│ expires_at          │
└─────────────────────┘
```

---

## 🔄 FLUJO COMPLETO DE DATOS - Desde Usuario hasta IA

### **PASO 1: Usuario selecciona actividad**

```
[React Frontend] → [Netlify Function: activities.js] → [PostgreSQL]
```

**Query ejecutado:**
```sql
SELECT * FROM class_activities WHERE id = $1
```

**Datos retornados:**
```json
{
  "id": "uuid",
  "book_code": "EM1",
  "unit_number": 1,
  "activity_type": "grammar",
  "title": "Presente de indicativo",
  "content": { ... },
  "available_agents": {
    "translator": { "name": "Ag. Traducción", ... },
    "vocabulary": { "name": "Ag. Expansor", ... },
    "personalizer": { "name": "Ag. Enfocado", ... },
    "creative": { "name": "Ag. Improvisador", ... }
  }
}
```

---

### **PASO 2: Usuario inicia sesión de actividad**

**Frontend crea sesión:**
```javascript
// POST /api/sessions
{
  user_id: "user-uuid",
  activity_id: "activity-uuid",
  session_start: "2024-11-29T10:00:00Z"
}
```

**Base de datos inserta:**
```sql
INSERT INTO class_sessions (
  user_id, activity_id, session_start,
  chat_messages, ai_agents_used
) VALUES (
  $1, $2, NOW(),
  '[]'::jsonb, '[]'::jsonb
) RETURNING *;
```

---

### **PASO 3: Usuario hace pregunta a un agente**

```
┌─────────────┐
│   Usuario   │
│  "¿Cómo se │
│   conjuga   │
│  'hablar'?" │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────┐
│  Frontend (AgentChatModal.jsx)   │
│  - Detecta agente seleccionado   │
│  - Envía mensaje                 │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Netlify Function: chat.js (TODO) │
│  1. Recibe pregunta               │
│  2. Identifica agente             │
│  3. Verifica caché                │
└──────┬───────────────────────────┘
       │
       ├──► ¿Existe en caché?
       │
       ├─[SÍ]──► Devolver respuesta cacheada (ahorro 70-80%)
       │
       └─[NO]──┐
               │
               ▼
┌────────────────────────────────────┐
│  Sistema de Agentes IA (TODO)     │
│  1. BaseAgent.js                  │
│  2. TranslatorAgent.js            │
│  3. Call DeepSeek API             │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│      DeepSeek API                 │
│  model: "deepseek-chat"           │
│  system_prompt: "Eres traductor..." │
│  temperature: 0.3                 │
└────────┬───────────────────────────┘
         │
         ▼ respuesta de IA
┌────────────────────────────────────┐
│  Guardar en ai_cache              │
│  - cache_key: hash(prompt+params) │
│  - response: { text: "..." }      │
│  - hit_count: 1                   │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Actualizar class_sessions        │
│  - Agregar a chat_messages[]      │
│  - Agregar agente a ai_agents_used│
│  - Incrementar total_interactions │
│  - Actualizar last_active_at      │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Insertar en user_interactions    │
│  - user_question                  │
│  - agent_response                 │
│  - agent_type: "translator"       │
│  - interaction_index: 1           │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Devolver respuesta a Frontend    │
└────────────────────────────────────┘
```

---

## 📋 ESTRUCTURA DE DATOS EN CADA TABLA

### **1. class_sessions.chat_messages** (JSONB - Para UI/Email)

```json
[
  {
    "id": 1,
    "role": "user",
    "content": "¿Cómo se conjuga 'hablar'?",
    "timestamp": "2024-11-29T10:05:00Z"
  },
  {
    "id": 2,
    "role": "assistant",
    "agent": "translator",
    "content": "El verbo 'hablar' se conjuga: yo hablo, tú hablas...",
    "timestamp": "2024-11-29T10:05:03Z"
  }
]
```

**Propósito:**
- Mostrar historial completo en UI
- Enviar por email al finalizar sesión
- Mantener contexto de conversación

---

### **2. user_interactions** (Tabla normalizada - Para ML/Analytics)

```sql
INSERT INTO user_interactions (
  session_id,
  user_id,
  activity_id,
  user_question,
  user_question_topic,
  agent_type,
  agent_response,
  interaction_index
) VALUES (
  'session-uuid',
  'user-uuid',
  'activity-uuid',
  '¿Cómo se conjuga hablar?',
  'presente_indicativo',
  'translator',
  'El verbo hablar se conjuga...',
  1
);
```

**Propósito:**
- Analytics: ¿Qué preguntas son más comunes?
- ML futuro: Entrenar modelos con interacciones reales
- Métricas: Qué agentes se usan más
- Seguimiento: Progreso del estudiante

---

### **3. ai_cache** (Caché inteligente)

```sql
INSERT INTO ai_cache (
  cache_key,
  prompt_hash,
  agent_type,
  response,
  hit_count,
  last_used_at
) VALUES (
  'sha256_abc123...',
  'sha256_prompt...',
  'translator',
  '{"text": "El verbo hablar...", "metadata": {...}}',
  1,
  NOW()
);
```

**Flujo de caché:**
```javascript
// 1. Usuario pregunta: "¿Cómo se conjuga hablar?"
const cacheKey = sha256(prompt + agentType + params);

// 2. Buscar en caché
const cached = await sql`
  SELECT response, hit_count
  FROM ai_cache
  WHERE cache_key = ${cacheKey}
    AND (expires_at IS NULL OR expires_at > NOW())
`;

if (cached.length > 0) {
  // 3. Incrementar hit_count
  await sql`
    UPDATE ai_cache
    SET hit_count = hit_count + 1,
        last_used_at = NOW()
    WHERE cache_key = ${cacheKey}
  `;

  return cached[0].response; // ✅ Ahorro!
}

// 4. Si no existe, llamar a DeepSeek y guardar
```

**Ahorro estimado:** 70-80% de llamadas a IA

---

## 🔌 NETLIFY FUNCTIONS - Conexión con BD

### **Actual: activities.js** ✅

```javascript
import { getDB } from './db.js';

export async function handler(event) {
  const sql = getDB(); // Conexión reutilizada

  // GET /api/activities
  const activities = await sql`
    SELECT * FROM class_activities
    ORDER BY book_code, unit_number
  `;

  return { statusCode: 200, body: JSON.stringify(activities) };
}
```

### **Pendiente: Funciones necesarias** ⏳

1. **sessions.js** - CRUD de sesiones
   - POST `/api/sessions` - Crear sesión
   - GET `/api/sessions/:id` - Obtener sesión
   - PUT `/api/sessions/:id` - Actualizar (agregar mensajes)
   - DELETE `/api/sessions/:id` - Finalizar sesión

2. **chat.js** - Interacción con agentes IA
   - POST `/api/chat` - Enviar mensaje a agente
   - Maneja caché, llamadas a DeepSeek, guardado de datos

3. **users.js** - Gestión de usuarios
   - GET `/api/users/:id` - Perfil
   - PUT `/api/users/:id` - Actualizar perfil

4. **achievements.js** - Sistema de logros
   - GET `/api/achievements/:userId` - Logros de usuario
   - POST `/api/achievements` - Otorgar logro

---

## 🎯 QUERIES OPTIMIZADOS CON ÍNDICES

### **1. Buscar actividades por libro y unidad** ⚡

```sql
-- Index: idx_class_activities_book_unit
SELECT * FROM class_activities
WHERE book_code = 'EM1' AND unit_number = 1;
```

### **2. Obtener sesiones recientes de un usuario** ⚡

```sql
-- Index: idx_class_sessions_user_id + idx_class_sessions_created_at
SELECT * FROM class_sessions
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC
LIMIT 10;
```

### **3. Analytics: Agentes más usados** ⚡

```sql
-- Index: idx_user_interactions_agent
SELECT
  agent_type,
  COUNT(*) as total_uses,
  AVG(user_rating) as avg_rating
FROM user_interactions
GROUP BY agent_type
ORDER BY total_uses DESC;
```

### **4. Buscar en caché** ⚡

```sql
-- Index: idx_ai_cache_key (UNIQUE)
SELECT response, hit_count
FROM ai_cache
WHERE cache_key = 'sha256_hash'
  AND (expires_at IS NULL OR expires_at > NOW());
```

### **5. Detectar sesiones inactivas** ⚡

```sql
-- Index: idx_class_sessions_last_active
SELECT id, user_id, activity_id
FROM class_sessions
WHERE email_sent = FALSE
  AND last_active_at < NOW() - INTERVAL '30 minutes';
```

---

## 🔐 SEGURIDAD Y VALIDACIÓN

### **1. SQL Injection Prevention** ✅

```javascript
// ❌ MAL - Vulnerable
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;

// ✅ BIEN - Prepared statements
const users = await sql`SELECT * FROM users WHERE email = ${userEmail}`;
```

### **2. Validación de datos** ✅

```javascript
// En activities.js línea 89
const required = ['book_code', 'unit_number', 'title', ...];
for (const field of required) {
  if (!data[field]) {
    return error(`Campo obligatorio: ${field}`, 400);
  }
}
```

### **3. CORS configurado** ✅

```javascript
// db.js línea 31
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};
```

---

## 📊 MÉTRICAS Y ANALYTICS

### **Dashboard de Superadmin - Queries**

```sql
-- Total de actividades por libro
SELECT
  book_code,
  COUNT(*) as total_activities,
  COUNT(DISTINCT unit_number) as units_covered
FROM class_activities
GROUP BY book_code;

-- Uso de agentes IA
SELECT
  agent_type,
  COUNT(*) as total_interactions,
  AVG(user_rating) as avg_rating,
  COUNT(DISTINCT user_id) as unique_users
FROM user_interactions
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY agent_type;

-- Eficiencia de caché
SELECT
  agent_type,
  COUNT(*) as total_cached,
  SUM(hit_count) as total_hits,
  SUM(hit_count - 1) as saves  -- Saves = reusos
FROM ai_cache
GROUP BY agent_type;
```

---

## 🚀 PRÓXIMOS PASOS

### **Backend - Pendiente**
- [ ] Implementar `sessions.js` Netlify Function
- [ ] Implementar `chat.js` con DeepSeek API
- [ ] Crear sistema de agentes (BaseAgent, TranslatorAgent, etc.)
- [ ] Implementar lógica de caché en chat.js
- [ ] Crear `users.js` y `achievements.js`

### **Frontend - Pendiente**
- [ ] Conectar AgentChatModal con API real
- [ ] Implementar manejo de sesiones
- [ ] Mostrar historial de chat desde BD
- [ ] Sistema de achievements/badges

### **Base de Datos - Completo** ✅
- [x] 6 tablas creadas
- [x] Extensiones instaladas (uuid-ossp, pg_trgm)
- [x] Índices optimizados
- [x] Triggers automáticos
- [x] Conexión configurada

---

## 📝 RESUMEN FINAL

### **Estado Actual:**
✅ **Base de datos**: 100% configurada (Neon.tech PostgreSQL 17)
✅ **Schema**: 6 tablas con relaciones correctas
✅ **Netlify Functions**: 1 de 5 implementadas (activities.js)
⏳ **Sistema de IA**: Documentado pero no implementado
⏳ **Caché**: Tabla lista, lógica pendiente

### **Arquitectura clave:**
1. **Sistema dual de almacenamiento**: `chat_messages` (UI) + `user_interactions` (ML)
2. **Caché inteligente**: Ahorra 70-80% en costos de IA
3. **Prepared statements**: Protección contra SQL injection
4. **Índices estratégicos**: Queries optimizados
5. **Serverless**: Neon.tech auto-scaling

---

**Última actualización:** 2024-11-29
**Versión:** 0.1.0 (MVP)
