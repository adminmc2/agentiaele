# Guía para Agentes de IA en el Proyecto AgentiaELE

Este documento proporciona una guía para que los agentes de IA (como GitHub Copilot) puedan asistir de manera efectiva en el desarrollo del proyecto AgentiaELE.

## Arquitectura General

AgentiaELE es un sistema de aprendizaje de español con tutores de IA. La arquitectura se compone de:

-   **Frontend (`elias-mvp`):** Una aplicación de React (con Vite) que funciona como panel de Superadministrador. Está desplegada en Netlify.
-   **Backend (Netlify Functions):** Funciones serverless escritas en JavaScript que se encuentran en `elias-mvp/netlify/functions`. Estas funciones manejan la lógica de negocio y la comunicación con la base de datos.
-   **Base de Datos:** PostgreSQL 17 alojada en Neon.tech. El esquema se encuentra en `database/schema_mvp.sql`.
-   **Contenido Estático (`materiaele`):** Prototipos HTML/CSS/JS antiguos. **No es parte del desarrollo activo.**

## Flujo de Trabajo de Desarrollo

El flujo de trabajo principal se centra en el proyecto `elias-mvp`.

1.  **Instalación:**
    -   `cd elias-mvp`
    -   `npm install`

2.  **Desarrollo Local:**
    -   La forma recomendada de ejecutar el proyecto es con `netlify dev`. Esto inicia tanto el frontend de React como las funciones de Netlify.
    -   El sitio estará disponible en `http://localhost:8888`.
    -   `npm run dev` solo iniciará el frontend, y las llamadas a la API fallarán.

3.  **Variables de Entorno:**
    -   Crea un archivo `.env` en la raíz de `elias-mvp`.
    -   `DATABASE_URL`: La cadena de conexión a la base de datos de Neon.tech (usada por las Netlify Functions).
    -   `VITE_API_URL`: La URL de la API. En desarrollo, debería ser `/.netlify/functions` o `/api`.

## Patrones y Convenciones del Proyecto

### Frontend (`elias-mvp`)

-   **Estructura:** El código fuente está en `elias-mvp/src`.
    -   `pages`: Componentes de página, organizados por rutas.
    -   `components`: Componentes reutilizables.
    -   `services`: Módulos para interactuar con la API del backend (ej. `activityService.js`).
    -   `layout`: Componentes de la estructura principal de la página (header, sidebar).
-   **Enrutamiento:** Se utiliza `react-router-dom` en `App.jsx` para definir las rutas de la aplicación.
-   **Estilos:** Se utilizan CSS Modules para el estilado de componentes.

### Backend (Netlify Functions)

-   **Ubicación:** `elias-mvp/netlify/functions`.
-   **Estructura de Funciones:** Cada archivo (ej. `activities.js`) exporta una función `handler` que procesa las solicitudes HTTP.
-   **Base de Datos:** La conexión a la base de datos se gestiona en `db.js` usando `@neondatabase/serverless`. Las consultas se realizan con la sintaxis de plantillas de `postgres`.
-   **Rutas:** Las rutas de la API se manejan manualmente dentro de cada función `handler` inspeccionando `event.httpMethod` y `event.path`.

### Base de Datos

-   **Esquema:** Definido en `database/schema_mvp.sql`.
-   **Tablas Clave:**
    -   `class_activities`: Almacena el contenido de las actividades educativas. Usa JSONB para `content` y `available_agents`.
    -   `user_profiles`, `class_sessions`, `user_interactions`: Rastrean a los usuarios y su progreso.
    -   `ai_cache`: Almacena en caché las respuestas de la IA para reducir costos.
-   **IDs:** Se utilizan UUIDs como claves primarias.

## Puntos Clave para Agentes de IA

-   Al agregar una nueva ruta de API, recuerda actualizar el `handler` de la función de Netlify correspondiente para manejar la nueva ruta y el método HTTP.
-   Al agregar una nueva tabla a la base de datos, asegúrate de actualizar `schema_mvp.sql` y, si es necesario, `reset_database.sql`.
-   Al agregar una nueva dependencia de frontend, usa `npm install`.
-   Al trabajar en el frontend, sigue la estructura de componentes existente y utiliza los servicios definidos en `src/services` para las llamadas a la API.
-   Presta atención a las variables de entorno y su prefijo (`VITE_` para el frontend, sin prefijo para el backend).
