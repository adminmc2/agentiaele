# AgentIA ELE - Roadmap

## Estado Actual del Proyecto

**Versión:** 0.7.1
**Última actualización:** Enero 2026

---

## Sistema de Autenticación Actual

### Implementado
- Login con email/contraseña (bcrypt)
- Registro con códigos de invitación
- WebAuthn/Passkeys (huella digital, Face ID)
- Tablas: `usuarios`, `codigos_invitacion`, `credenciales_webauthn`

### Funciona para
- Sistema cerrado con usuarios controlados
- Base de usuarios pequeña/mediana
- Control total de datos (almacenados en Neon PostgreSQL)
- Sin costos adicionales de servicios externos

---

## Propuestas Futuras de Autenticación

### Opción A: Auth0

**Cuándo considerarlo:**
- Necesidad de OAuth social (Google, GitHub, Apple)
- MFA avanzado (SMS, TOTP)
- SSO Enterprise (SAML, LDAP)
- Compliance SOC2/HIPAA requerido

**Tier gratuito:**
- 7,000 MAU (Monthly Active Users)
- Login social básico
- MFA básico

**Implementación requerida:**
- [ ] Crear cuenta en Auth0
- [ ] Configurar tenant y aplicación
- [ ] Migrar usuarios existentes
- [ ] Actualizar AuthContext.jsx
- [ ] Configurar callbacks y logout
- [ ] Mantener WebAuthn como opción adicional

**Documentación:** https://auth0.com/docs

---

### Opción B: Clerk

**Cuándo considerarlo:**
- Preferencia por UI pre-construida
- Necesidad de componentes React listos
- Gestión de organizaciones/equipos
- Experiencia de usuario más pulida out-of-the-box

**Tier gratuito:**
- 10,000 MAU
- Login social
- Componentes UI incluidos

**Implementación requerida:**
- [ ] Crear cuenta en Clerk
- [ ] Instalar @clerk/clerk-react
- [ ] Envolver App con ClerkProvider
- [ ] Reemplazar formularios con componentes Clerk
- [ ] Migrar usuarios existentes
- [ ] Configurar webhooks para sync con DB

**Documentación:** https://clerk.com/docs

---

### Opción C: Mantener Sistema Propio (Recomendado actualmente)

**Ventajas:**
- Sin dependencias externas
- Sin límites de usuarios
- Control total de datos y flujos
- Códigos de invitación personalizados
- WebAuthn ya implementado
- Costo: $0

**Mejoras pendientes:**
- [ ] Arreglar error WebAuthn userID (Uint8Array)
- [ ] Agregar "recordar sesión" con tokens JWT
- [ ] Implementar recuperación de contraseña por email
- [ ] Agregar rate limiting en endpoints de auth
- [ ] Logs de auditoría de accesos

---

## Criterios de Decisión

| Criterio | Sistema Propio | Auth0 | Clerk |
|----------|---------------|-------|-------|
| Costo inicial | $0 | $0 (hasta 7K) | $0 (hasta 10K) |
| Complejidad setup | Ya hecho | Media | Baja |
| OAuth Social | No | Sí | Sí |
| Control de datos | 100% | Parcial | Parcial |
| Códigos invitación | Sí | Custom | Custom |
| WebAuthn | Sí | Sí | Sí |
| Compliance | DIY | Incluido | Incluido |
| Vendor lock-in | No | Sí | Sí |

---

## Decisión Recomendada

**Para el estado actual del proyecto:** Mantener sistema propio.

**Considerar Auth0/Clerk cuando:**
1. Base de usuarios supere ~1,000 activos
2. Se requiera login con Google/Apple
3. Clientes enterprise soliciten SSO/SAML
4. Se necesite certificación de compliance

---

## Otras Funcionalidades en Roadmap

### Corto Plazo (Q1 2026)
- [ ] Corregir errores WebAuthn pendientes
- [ ] Documentar sistema de auth en CHANGELOG
- [ ] Agregar recuperación de contraseña
- [ ] Mejorar manejo de sesiones

### Mediano Plazo (Q2-Q3 2026)
- [ ] Dashboard de analytics para profesores
- [ ] Sistema de notificaciones
- [ ] Exportación de datos de estudiantes
- [ ] API pública documentada

### Largo Plazo (2026+)
- [ ] App móvil nativa (React Native)
- [ ] Integración con LMS externos
- [ ] Marketplace de actividades
- [ ] Multi-idioma en interfaz

---

## Notas

Este documento se actualiza según las necesidades del proyecto. Las decisiones de autenticación deben revisarse cuando:
- Cambie significativamente la base de usuarios
- Se añadan requisitos de compliance
- Se soliciten integraciones enterprise
