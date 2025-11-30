# 📚 AgentiaELE - Agentes de Inteligencia Artificial para Español como Lengua Extranjera

> Sistema educativo completo para aprendizaje de español como lengua extranjera (ELE) aplicado al método "Español en Marcha" nivel A1, con equipo de agentes de IA especializados y gamificación

[![Version](https://img.shields.io/badge/version-0.7.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Privado-red.svg)]()
[![Status](https://img.shields.io/badge/status-En%20Desarrollo-yellow.svg)]()

---

## 🎯 Descripción General

**AgentiaELE** (Agentes de Inteligencia Artificial para Español como Lengua Extranjera) es un sistema web educativo para el aprendizaje de español como lengua extranjera, específicamente diseñado para el nivel A1 del método **"Español en Marcha"**.

AgentiaELE integra un **equipo de 6 agentes de IA especializados** que actúan como tutores virtuales lingüísticos, proporcionando corrección gramatical, evaluación automática, traducción contextual, generación de ejemplos, explicaciones pedagógicas y tutoría personalizada.

### Características Principales

✅ **Equipo de Tutores IA**: 6 agentes especializados que actúan como tutores virtuales
✅ **Sistema de Diseño Unificado**: Componentes reutilizables con paleta naranja coherente
✅ **Gestor de Cursos**: Interfaz Material Design con formularios intuitivos
✅ **Caché Inteligente**: Ahorro del 70-80% en costos de IA
✅ **Doble Rol**: Usuario estudiante y Superadministrador
✅ **Gamificación**: Badges, niveles, XP y sistema de recompensas
✅ **Tracking Completo**: Progreso detallado y estadísticas en tiempo real
✅ **Dashboard Admin**: Monitoreo de agentes, costos, usuarios y actividades
✅ **Reportes Avanzados**: Exportación CSV/JSON/PDF con análisis detallado

---

## 📋 Versión Actual y Roadmap

### **FASE 1: MVP Beta - 100 Usuarios** 🚀
**Fecha estimada**: Noviembre 2025 (última semana)
**Estado**: En Desarrollo

#### MVP - MOMENTO 1: CLASE
Aprendizaje guiado con IA, sin evaluación ni seguimiento de progreso. Enfoque en exploración y práctica libre.

#### MVP Incluye:
- ✅ Autenticación con Auth0/Clerk
- ✅ Sistema de 4 agentes IA para aprendizaje:
  - **Translator**: Traducciones contextuales
  - **Vocabulary**: Explicaciones de palabras
  - **Personalizer**: Ejemplos personalizados
  - **Creative**: Historias y diálogos creativos
- ✅ Chat único "Eliana" por actividad con múltiples agentes
- ✅ Base de datos PostgreSQL 17 (6 tablas):
  - user_profiles, class_activities, class_sessions
  - user_interactions, user_achievements, ai_cache
- ✅ Soporte multi-libro (EM1, EM2, EM3, EM4)
- ✅ 10 tipos de actividades + 9 estructuras
- ✅ Email consolidado por sesión (opcional)
- ✅ Sistema dual: chat para UI + datos para ML

**Costo estimado MVP**: $5-10/mes (solo DeepSeek API)

---

### **FASE 2: Versión Completa - 1000+ Usuarios** 🏆
**Fecha estimada**: Diciembre 2025 - Enero 2026 (3-4 semanas)
**Estado**: Planificado (después de validar MVP)

#### Versión Completa - MOMENTO 1 + MOMENTO 2
Añade **MOMENTO 2: REPASO** con evaluación, dificultad adaptativa y seguimiento de progreso.

#### Incluye:
- ✅ **8 agentes IA** (4 aprendizaje + 4 evaluación):
  - MOMENTO 1: Translator, Vocabulary, Personalizer, Creative
  - MOMENTO 2: Corrector, Evaluator, Teacher, Tutor
- ✅ **16 tablas** en base de datos (6 MOMENTO 1 + 10 MOMENTO 2)
- ✅ Caché inteligente con búsqueda por similitud (70-80% ahorro)
- ✅ Sistema de roles (Usuario/Superadmin)
- ✅ Dashboard de usuario con progreso y badges
- ✅ Dashboard de superadmin con analytics de agentes
- ✅ Sistema de gamificación (badges, niveles, XP)
- ✅ Modo práctica y repaso personalizado
- ✅ Reportes y exportación de datos

**Costo estimado Producción**: $33/mes (1000 usuarios, con caché optimizado)

**Ver detalles**: [CHANGELOG.md](CHANGELOG.md) | [PROYECTO-COMPLETO.md](PROYECTO-COMPLETO.md)

---

## 🏗️ Arquitectura

```
┌─────────────────────────────┐
│   NETLIFY (Frontend)        │  ← React + Vite
│   + Netlify Functions       │  ← Serverless API
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│  Neon.tech PostgreSQL 15 💾 │  ← Base de Datos
│  (GRATIS para siempre)      │  ← 512 MB RAM, 3 GB storage
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│  Auth0 / Clerk 🔐           │  ← Autenticación
│  (Free Tier)                │
└─────────────────────────────┘

           ↕
┌──────────────────────────────────────────┐
│    SISTEMA DE AGENTES IA (Middleware)   │
│  ┌────────────────────────────────────┐ │
│  │   AgentService (Orquestador) 🧠    │ │
│  └───┬────────────────────────────────┘ │
│      │                                   │
│  ┌───▼──────┬──────┬──────┬──────┬────┐ │
│  │Corrector │Eval. │Trans.│Gen.  │etc.│ │
│  └──────────┴──────┴──────┴──────┴────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  CacheService 💰 (70-80% ahorro)   │ │
│  └────────────────────────────────────┘ │
└──────────┬───────────────────────────────┘
           │
┌──────────▼──────────┐
│   DEEPSEEK API      │  ← IA Real
└─────────────────────┘

💡 Stack 100% gratuito para siempre (MVP y producción inicial)
```

---

## 🚀 Stack Tecnológico

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **UI**: CSS Modules + Responsive Design
- **Charts**: Chart.js + Recharts
- **Deploy**: Netlify

### Backend
- **Database**: Neon.tech PostgreSQL 17 (Gratis para siempre)
  - 512 MB RAM, 3 GB storage
  - Serverless PostgreSQL con auto-scaling
  - **MVP**: 6 tablas (MOMENTO 1: Clase)
  - **v1.0**: 16 tablas (+ MOMENTO 2: Repaso)
- **Auth**: Auth0 (7,000 MAU) o Clerk (10,000 MAU)
- **API**: Netlify Functions (serverless)
- **Connection**: PostgreSQL client (pg) o @neondatabase/serverless
- **Security**: JWT + SQL prepared statements

### Inteligencia Artificial
- **API**: DeepSeek (deepseek-chat)
- **Arquitectura MVP**: 4 agentes (Translator, Vocabulary, Personalizer, Creative)
- **Arquitectura v1.0**: 8 agentes (+ Corrector, Evaluator, Teacher, Tutor)
- **Caché**: PostgreSQL + pg_trgm (similitud de texto)
- **Optimización**: Cache hit rate 70-80%
- **Chat único**: "Eliana" con múltiples agentes respondiendo

---

## 💰 Costos Estimados

### 🎉 Stack 100% GRATUITO para siempre

#### MVP y Producción Inicial (hasta ~1000 usuarios)
| Servicio | Plan | Costo/mes |
|----------|------|-----------|
| **Neon.tech** | Free (512 MB, 3 GB storage) | **$0** |
| **Auth0/Clerk** | Free (7,000-10,000 MAU) | **$0** |
| **Netlify** | Free (100 GB bandwidth) | **$0** |
| **DeepSeek API** | Pay-as-you-go con caché | **$5-10** |
| **TOTAL** | - | **$5-10/mes** |

✅ **Infraestructura 100% gratis**
✅ **Solo pagas IA (y con caché, muy poco)**
✅ **Sin límite de tiempo** (gratis para siempre)

---

#### Cuando escales (1000-5000 usuarios)
| Servicio | Sin Caché | Con Caché (80%) |
|----------|-----------|-----------------|
| **Neon.tech Pro** | $19/mes | $19/mes |
| **Auth0 Essentials** | $25/mes | $25/mes |
| **Netlify** | $19/mes | $19/mes |
| **DeepSeek API** | $42/mes | $8/mes |
| **TOTAL** | $105/mes | **$71/mes** |

---

#### Opción: Migrar a Supabase cuando haya presupuesto
| Servicio | Sin Caché | Con Caché (80%) |
|----------|-----------|-----------------|
| **Supabase Pro** | $25/mes | $25/mes |
| **Netlify** | $19/mes | $19/mes |
| **DeepSeek API** | $42/mes | $8/mes |
| **TOTAL** | $86/mes | **$52/mes** |

---

### 💡 Ventaja de Neon.tech

- ✅ **Gratis para siempre** (no 12 meses, PARA SIEMPRE)
- ✅ **PostgreSQL nativo** (código portable)
- ✅ **Serverless** (auto-scaling incluido)
- ✅ **Backup automático** incluido
- ✅ **Sin tarjeta de crédito** para empezar

---

## 📊 Documentación Técnica

- **[PROYECTO-COMPLETO.md](PROYECTO-COMPLETO.md)**: Arquitectura completa con Neon.tech, base de datos, plan de implementación (incluye guía MVP)
- **[CHANGELOG.md](CHANGELOG.md)**: Historial de versiones y cambios
- **[EXPLICACION-AGENTES-PRINCIPIANTE.md](EXPLICACION-AGENTES-PRINCIPIANTE.md)**: Explicación detallada del sistema de agentes
- **[ARQUITECTURA-ESCALABLE.md](ARQUITECTURA-ESCALABLE.md)**: Estrategias de escalabilidad para 10,000+ usuarios
- **[LANGGRAPH-VS-CUSTOM.md](LANGGRAPH-VS-CUSTOM.md)**: Comparativa de arquitecturas de IA

---

## 👥 Roles de Usuario

### 👤 **Usuario Estudiante**
- Dashboard personal con progreso
- Realizar actividades del nivel A1
- Asistente de IA (traducción, corrección, ejemplos)
- Sistema de badges y gamificación
- Historial de respuestas y feedback
- Modo práctica y repaso
- Resúmenes de progreso

### 👑 **Superadministrador**
- Dashboard global con todos los usuarios
- Monitor de agentes IA en tiempo real
- Gestión completa de actividades
- Configuración de agentes por actividad
- Historial completo de interacciones IA
- Reportes avanzados de costos y uso
- Sistema de alertas y monitoreo
- Gestión de badges y usuarios
- Exportación de datos (CSV/JSON/PDF)

---

## 🗂️ Estructura del Proyecto

```
demo-ar-libro/
├── database/            # 📊 Base de datos PostgreSQL
│   ├── schema_mvp.sql   # Schema MOMENTO 1 (6 tablas)
│   ├── reset_database.sql
│   └── verify_database.sql
├── public/              # Assets estáticos
├── src/
│   ├── agents/          # 🧠 Sistema de agentes IA
│   │   ├── BaseAgent.js
│   │   ├── momento1/    # Aprendizaje guiado
│   │   │   ├── TranslatorAgent.js
│   │   │   ├── VocabularyAgent.js
│   │   │   ├── PersonalizerAgent.js
│   │   │   └── CreativeAgent.js
│   │   ├── momento2/    # Evaluación (v1.0)
│   │   │   ├── CorrectorAgent.js
│   │   │   ├── EvaluatorAgent.js
│   │   │   ├── TeacherAgent.js
│   │   │   └── TutorAgent.js
│   │   ├── AgentService.js
│   │   └── CacheService.js  # 💰 Caché inteligente
│   ├── components/      # Componentes React
│   ├── services/        # Servicios de backend
│   ├── pages/           # Páginas de la app
│   ├── utils/           # Utilidades
│   └── config/          # Configuración
├── netlify/
│   └── functions/       # Netlify Functions (serverless API)
├── PROYECTO-COMPLETO.md
├── CHANGELOG.md
└── README.md
```

---

## 🎮 Sistema de Gamificación

### Niveles
- **Nivel 1**: Principiante (0-100 XP)
- **Nivel 2**: Aprendiz (100-250 XP)
- **Nivel 3**: Estudiante (250-500 XP)
- **Nivel 4**: Intermedio (500-1000 XP)
- **Nivel 5**: Avanzado (1000-2000 XP)
- **Nivel 6**: Experto (2000-5000 XP)
- **Nivel 7**: Maestro (5000+ XP)

### Badges
- 🎯 **Progreso**: Primera actividad, 5 actividades, 20 actividades...
- 🌟 **Unidad**: Completar cada unidad
- 💯 **Achievement**: Puntuaciones perfectas, rapidez
- 🔥 **Sociales**: Rachas de días consecutivos
- 🧠 **Especiales**: Uso de todas las funciones de IA, graduación

---

## 📈 Roadmap

### v1.0.0 (Actual) - MVP
- Sistema completo de agentes con caché
- Roles usuario/superadmin
- Gamificación básica
- Analytics de agentes
- Nivel A1 completo

### v2.0.0 (Futuro)
- 🎤 Reconocimiento de voz
- 🔊 Text-to-speech para pronunciación
- 📱 App móvil (React Native)
- 👥 Modo multijugador
- 💬 Chat entre estudiantes
- 🌐 Niveles A2, B1, B2

### v3.0.0 (Futuro)
- 🤖 IA generativa de actividades
- 📊 Análisis predictivo de aprendizaje
- 🎯 Tests adaptativos de nivel
- 🌍 Soporte multiidioma completo

---

## 🔒 Seguridad

- ✅ JWT tokens con Auth0/Clerk
- ✅ SQL prepared statements (prevención de inyección SQL)
- ✅ Variables de entorno para API keys y credenciales
- ✅ HTTPS obligatorio (SSL/TLS)
- ✅ Neon.tech con SSL connection automática
- ✅ Rate limiting en requests de IA
- ✅ Sanitización de inputs en frontend y backend
- ✅ CORS configurado en Netlify Functions
- ✅ Validación de roles en frontend y backend

---

## 📞 Soporte y Contacto

Para preguntas sobre el proyecto, consulta la documentación técnica o contacta al equipo de desarrollo.

### Documentación de Dependencias
- [Neon.tech Docs](https://neon.tech/docs)
- [Auth0 Docs](https://auth0.com/docs)
- [Clerk Docs](https://clerk.dev/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Netlify Functions Docs](https://docs.netlify.com/functions/)
- [DeepSeek API Docs](https://platform.deepseek.com/docs)
- [React Docs](https://react.dev)

---

## 📄 Licencia

Este proyecto es privado y propietario. Todos los derechos reservados.

---

**Última actualización**: Noviembre 2025
**Versión**: 0.7.0 (En Desarrollo - Integración Base de Datos Neon + Netlify Blobs)
