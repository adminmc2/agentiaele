# CLAUDE.md - Guía del Proyecto AgentiaELE

## Descripción del Proyecto

AgentiaELE es una plataforma educativa para el aprendizaje del español como lengua extranjera (ELE) potenciada por inteligencia artificial. Combina agentes conversacionales de IA con metodología pedagógica estructurada.

## Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Backend**: Netlify Functions (Node.js con ESM)
- **Base de datos**: Neon PostgreSQL (serverless)
- **Autenticación**: Sistema propio con bcrypt + WebAuthn/Passkeys
- **Despliegue**: Netlify (https://agentiaele.netlify.app)

## Estructura del Proyecto

```
agentiaele/
├── src/                    # Código fuente React
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas de la aplicación
│   ├── contexts/           # Context providers (Auth, Theme)
│   └── services/           # Servicios y API calls
├── public/                 # Assets estáticos
├── netlify/
│   └── functions/          # Funciones serverless (.mjs)
├── docs/                   # Documentación del proyecto
└── scripts/                # Scripts de utilidad
```

## Comandos Principales

```bash
# Desarrollo local
npm run dev              # Inicia Vite dev server (solo frontend)
netlify dev              # Inicia servidor completo con functions (puerto 8888)

# Build y deploy
npm run build            # Build de producción
netlify deploy --prod    # Deploy a producción

# Base de datos
# Las funciones de setup están en netlify/functions/setup-db.mjs
```

## Funciones Netlify (ESM)

Todas las funciones usan extensión `.mjs` para soporte ESM:

- `auth.mjs` - Autenticación (login, registro, verificación)
- `courses.mjs` - Gestión de cursos
- `activities.mjs` - Actividades de aprendizaje
- `acciones.mjs` - Acciones del sistema
- `propuestas.mjs` - Propuestas de agentes
- `db.mjs` - Conexión a base de datos (módulo compartido)
- `upload.mjs` - Subida de archivos
- `setup-db.mjs` - Inicialización de tablas
- `setup-auth-tables.mjs` - Tablas de autenticación
- `test-conversations.mjs` - Testing de conversaciones

## Base de Datos

### Conexión
```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
```

### Tablas Principales
- `users` - Usuarios del sistema
- `invitation_codes` - Códigos de invitación para registro
- `courses` - Cursos disponibles
- `activities` - Actividades de aprendizaje
- `user_progress` - Progreso del usuario
- `passkey_credentials` - Credenciales WebAuthn

## Sistema de Autenticación

1. **Registro**: Requiere código de invitación válido
2. **Login**: Email + contraseña o WebAuthn/Passkey
3. **Biométrico**: Soporte para autenticación con huella/Face ID

## Variables de Entorno

```env
DATABASE_URL=             # URL de conexión Neon PostgreSQL
VITE_API_URL=             # URL base para API calls
```

## Notas Importantes

- **ESM**: Las funciones Netlify usan `.mjs` - NO cambiar a `.js`
- **Imports**: Usar `from './db.mjs'` (con extensión completa)
- **deno.lock**: Usado por Netlify Edge Functions - NO eliminar
- **.netlify/**: Carpeta de cache local - NO incluir en git

## URLs del Proyecto

- **Producción**: https://agentiaele.netlify.app
- **Login**: https://agentiaele.netlify.app/login
- **Formulario Sueña**: https://agentiaele.netlify.app/suena-con-tu-agente.html

## Historial de Cambios Recientes

Ver [CHANGELOG.md](./CHANGELOG.md) para el historial completo.

### Últimos cambios (Enero 2026):
- Migración de funciones a ESM (.js → .mjs)
- Sistema de autenticación con códigos de invitación
- Soporte WebAuthn/Passkeys
- Campo institución en registro
- Sincronización formulario "Sueña con tu agente"
