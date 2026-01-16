// ========================================
// FUNCIÓN NETLIFY: Autenticación de Usuarios
// ========================================
// API para registro, login y autenticación biométrica (WebAuthn)

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} from '@simplewebauthn/server';

const sql = neon(process.env.DATABASE_URL);

// Configuración WebAuthn
const rpName = 'AgentIA ELE';
const rpID = process.env.URL ? new URL(process.env.URL).hostname : 'localhost';
const origin = process.env.URL || 'http://localhost:8888';

// Headers CORS
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

export async function handler(event) {
  // Manejar preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/auth', '');
    const method = event.httpMethod;

    // ========================================
    // POST /auth/validate-code - Validar código de invitación
    // ========================================
    if (method === 'POST' && path === '/validate-code') {
      const { codigo } = JSON.parse(event.body);

      if (!codigo) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Código requerido' })
        };
      }

      const result = await sql`
        SELECT * FROM codigos_invitacion
        WHERE codigo = ${codigo.toUpperCase()}
        AND usado = FALSE
        AND (expires_at IS NULL OR expires_at > NOW())
      `;

      if (result.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            valid: false,
            error: 'Código inválido o ya utilizado'
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: true })
      };
    }

    // ========================================
    // POST /auth/register - Registrar nuevo usuario
    // ========================================
    if (method === 'POST' && path === '/register') {
      const { codigo, nombre, institucion, email, password } = JSON.parse(event.body);

      // Validaciones
      if (!codigo || !nombre || !institucion || !email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Todos los campos son obligatorios' })
        };
      }

      // Validar código de invitación
      const codigoResult = await sql`
        SELECT * FROM codigos_invitacion
        WHERE codigo = ${codigo.toUpperCase()}
        AND usado = FALSE
        AND (expires_at IS NULL OR expires_at > NOW())
      `;

      if (codigoResult.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Código de invitación inválido o ya utilizado' })
        };
      }

      // Verificar si el email ya existe
      const existingUser = await sql`
        SELECT id FROM usuarios WHERE email = ${email.toLowerCase()}
      `;

      if (existingUser.length > 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Este email ya está registrado' })
        };
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear usuario
      const newUser = await sql`
        INSERT INTO usuarios (nombre, institucion, email, password_hash, rol)
        VALUES (${nombre.trim()}, ${institucion.trim()}, ${email.toLowerCase().trim()}, ${passwordHash}, 'usuario')
        RETURNING id, nombre, institucion, email, rol, created_at
      `;

      // Marcar código como usado
      await sql`
        UPDATE codigos_invitacion
        SET usado = TRUE, usado_por = ${newUser[0].id}
        WHERE codigo = ${codigo.toUpperCase()}
      `;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Usuario registrado exitosamente',
          user: {
            id: newUser[0].id,
            nombre: newUser[0].nombre,
            email: newUser[0].email,
            role: newUser[0].rol
          }
        })
      };
    }

    // ========================================
    // POST /auth/login - Login con email/contraseña
    // ========================================
    if (method === 'POST' && path === '/login') {
      const { email, password } = JSON.parse(event.body);

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email y contraseña son obligatorios' })
        };
      }

      // Buscar usuario
      const users = await sql`
        SELECT id, nombre, email, password_hash, rol
        FROM usuarios
        WHERE email = ${email.toLowerCase()}
      `;

      if (users.length === 0) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Email no registrado' })
        };
      }

      const user = users[0];

      // Verificar contraseña
      const passwordValid = await bcrypt.compare(password, user.password_hash);

      if (!passwordValid) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Contraseña incorrecta' })
        };
      }

      // Verificar si tiene credenciales biométricas
      const webauthnCreds = await sql`
        SELECT id FROM credenciales_webauthn WHERE usuario_id = ${user.id}
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          user: {
            id: user.id,
            name: user.nombre,
            email: user.email,
            role: user.rol
          },
          hasBiometric: webauthnCreds.length > 0
        })
      };
    }

    // ========================================
    // POST /auth/webauthn/register-options - Opciones para registrar biometría
    // ========================================
    if (method === 'POST' && path === '/webauthn/register-options') {
      const { userId, email } = JSON.parse(event.body);

      if (!userId || !email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'userId y email son obligatorios' })
        };
      }

      // Obtener credenciales existentes del usuario
      const existingCreds = await sql`
        SELECT credential_id FROM credenciales_webauthn WHERE usuario_id = ${userId}
      `;

      const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: userId,
        userName: email,
        attestationType: 'none',
        excludeCredentials: existingCreds.map(cred => ({
          id: Buffer.from(cred.credential_id, 'base64url'),
          type: 'public-key'
        })),
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
          authenticatorAttachment: 'platform'
        }
      });

      // Guardar challenge temporalmente (en producción usar Redis o similar)
      await sql`
        INSERT INTO usuarios (id, nombre, email, password_hash)
        VALUES (${userId}, '', '', '')
        ON CONFLICT (id) DO UPDATE SET updated_at = NOW()
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          options,
          challenge: options.challenge
        })
      };
    }

    // ========================================
    // POST /auth/webauthn/register - Guardar credencial biométrica
    // ========================================
    if (method === 'POST' && path === '/webauthn/register') {
      const { userId, credential, challenge, deviceName } = JSON.parse(event.body);

      if (!userId || !credential || !challenge) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Datos incompletos' })
        };
      }

      try {
        const verification = await verifyRegistrationResponse({
          response: credential,
          expectedChallenge: challenge,
          expectedOrigin: origin,
          expectedRPID: rpID
        });

        if (!verification.verified || !verification.registrationInfo) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Verificación fallida' })
          };
        }

        const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

        // Guardar credencial
        await sql`
          INSERT INTO credenciales_webauthn (
            usuario_id,
            credential_id,
            public_key,
            counter,
            device_name
          )
          VALUES (
            ${userId},
            ${Buffer.from(credentialID).toString('base64url')},
            ${Buffer.from(credentialPublicKey).toString('base64url')},
            ${counter},
            ${deviceName || 'Dispositivo'}
          )
        `;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Autenticación biométrica configurada'
          })
        };
      } catch (error) {
        console.error('Error verificando registro WebAuthn:', error);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Error en la verificación' })
        };
      }
    }

    // ========================================
    // POST /auth/webauthn/login-options - Opciones para login biométrico
    // ========================================
    if (method === 'POST' && path === '/webauthn/login-options') {
      const { email } = JSON.parse(event.body);

      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email requerido' })
        };
      }

      // Buscar usuario y sus credenciales
      const users = await sql`
        SELECT u.id, u.nombre, u.email, u.rol, c.credential_id
        FROM usuarios u
        JOIN credenciales_webauthn c ON c.usuario_id = u.id
        WHERE u.email = ${email.toLowerCase()}
      `;

      if (users.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No hay credenciales biométricas para este email' })
        };
      }

      const options = await generateAuthenticationOptions({
        rpID,
        allowCredentials: users.map(u => ({
          id: Buffer.from(u.credential_id, 'base64url'),
          type: 'public-key'
        })),
        userVerification: 'preferred'
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          options,
          challenge: options.challenge,
          userId: users[0].id
        })
      };
    }

    // ========================================
    // POST /auth/webauthn/login - Verificar login biométrico
    // ========================================
    if (method === 'POST' && path === '/webauthn/login') {
      const { credential, challenge, email } = JSON.parse(event.body);

      if (!credential || !challenge || !email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Datos incompletos' })
        };
      }

      // Buscar la credencial
      const credResult = await sql`
        SELECT c.*, u.id as user_id, u.nombre, u.email, u.rol
        FROM credenciales_webauthn c
        JOIN usuarios u ON u.id = c.usuario_id
        WHERE c.credential_id = ${credential.id}
      `;

      if (credResult.length === 0) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Credencial no encontrada' })
        };
      }

      const storedCred = credResult[0];

      try {
        const verification = await verifyAuthenticationResponse({
          response: credential,
          expectedChallenge: challenge,
          expectedOrigin: origin,
          expectedRPID: rpID,
          authenticator: {
            credentialID: Buffer.from(storedCred.credential_id, 'base64url'),
            credentialPublicKey: Buffer.from(storedCred.public_key, 'base64url'),
            counter: storedCred.counter
          }
        });

        if (!verification.verified) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Verificación fallida' })
          };
        }

        // Actualizar contador
        await sql`
          UPDATE credenciales_webauthn
          SET counter = ${verification.authenticationInfo.newCounter}
          WHERE id = ${storedCred.id}
        `;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: {
              id: storedCred.user_id,
              name: storedCred.nombre,
              email: storedCred.email,
              role: storedCred.rol
            }
          })
        };
      } catch (error) {
        console.error('Error verificando login WebAuthn:', error);
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Error en la verificación' })
        };
      }
    }

    // ========================================
    // GET /auth/check-biometric - Verificar si usuario tiene biometría
    // ========================================
    if (method === 'GET' && path === '/check-biometric') {
      const email = event.queryStringParameters?.email;

      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email requerido' })
        };
      }

      const result = await sql`
        SELECT c.id
        FROM usuarios u
        JOIN credenciales_webauthn c ON c.usuario_id = u.id
        WHERE u.email = ${email.toLowerCase()}
        LIMIT 1
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          hasBiometric: result.length > 0
        })
      };
    }

    // Ruta no encontrada
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Ruta no encontrada' })
    };

  } catch (error) {
    console.error('Error en auth function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
}
