# 🎓 EXPLICACIÓN COMPLETA DEL SISTEMA DE AGENTES (Para Principiantes)

## 🤔 ¿QUÉ ES UN AGENTE?

Imagina que tienes varios **profesores especializados**:
- 👩‍🏫 Profesor 1: Experto en **corregir** errores gramaticales
- 👨‍🏫 Profesor 2: Experto en **evaluar** y dar notas
- 👩‍💼 Profesor 3: Experto en **traducir** a otros idiomas
- 👨‍💼 Profesor 4: Experto en **generar** ejemplos

Un **agente** es como uno de esos profesores especializados, pero en código.

---

## 📁 ¿DÓNDE SE GUARDAN LOS AGENTES?

### **Estructura de carpetas:**

```
tu-proyecto/
│
├── src/                          ← Aquí va TODO tu código
│   │
│   ├── agents/                   ← 📁 AQUÍ VIVEN LOS AGENTES
│   │   ├── BaseAgent.js          ← El "padre" de todos los agentes
│   │   ├── CorrectorAgent.js     ← Agente corrector
│   │   ├── EvaluatorAgent.js     ← Agente evaluador
│   │   ├── TranslatorAgent.js    ← Agente traductor
│   │   └── GeneratorAgent.js     ← Agente generador
│   │
│   ├── services/                 ← 📁 SERVICIOS (coordinadores)
│   │   ├── agentService.js       ← 🎯 CEREBRO que decide qué agente usar
│   │   └── supabaseClient.js     ← Conexión a base de datos
│   │
│   └── components/               ← 📁 COMPONENTES REACT (UI)
│       └── ActivityViewer.jsx    ← Vista donde usuario escribe
│
└── package.json
```

### **¿Por qué esta estructura?**

```
agents/         → Los "profesores" que hacen el trabajo
services/       → El "director" que coordina a los profesores
components/     → La "interfaz" que ve el usuario
```

---

## 🔄 ¿CÓMO FUNCIONA TODO? (Paso a Paso)

### **ESCENARIO: Usuario quiere comprobar su respuesta**

```
USUARIO escribe en la app:
"Me llama Juan y soy de españa"  ← (tiene errores)

    ↓ Click en "Comprobar"

COMPONENT (ActivityViewer.jsx)
    ↓ Llama a →

SERVICIO (agentService.js) ← 🧠 CEREBRO
    |
    | Decide: "Necesito corrección Y evaluación"
    |
    ├─→ CorrectorAgent.js (corrige errores)
    |       ↓ "Me llamo Juan y soy de España"
    |
    └─→ EvaluatorAgent.js (da nota)
            ↓ "7/10 - Buen intento"

SERVICIO combina los resultados
    ↓ Regresa a →

COMPONENT muestra al usuario:
    ✅ Correcciones
    ✅ Puntuación
    ✅ Feedback
```

---

## 📝 EXPLICACIÓN DETALLADA DE CADA ARCHIVO

### **1. BaseAgent.js (El Padre de todos)**

**¿Qué es?**
Es la "plantilla base" que todos los agentes usan. Como un molde.

**¿Qué hace?**
- Se conecta a DeepSeek API
- Envía preguntas a la IA
- Recibe respuestas
- Maneja errores

**Código simplificado:**

```javascript
// src/agents/BaseAgent.js

export class BaseAgent {
  constructor(config) {
    this.name = config.name           // Nombre del agente
    this.systemPrompt = config.systemPrompt  // Instrucciones para la IA
  }

  // Este método es el CORAZÓN: se conecta a DeepSeek
  async execute(userInput) {
    // 1. Preparar la pregunta para DeepSeek
    const pregunta = {
      system: this.systemPrompt,  // "Eres un corrector de español..."
      user: userInput             // "Me llama Juan"
    }

    // 2. Enviar a DeepSeek API
    const respuesta = await fetch('https://api.deepseek.com/...', {
      method: 'POST',
      body: JSON.stringify(pregunta)
    })

    // 3. Recibir respuesta
    const resultado = await respuesta.json()

    // 4. Devolver la respuesta
    return resultado
  }
}
```

**Analogía:**
- BaseAgent es como un **teléfono genérico**
- Todos los profesores usan el mismo tipo de teléfono
- Pero cada uno habla diferente (según su especialidad)

---

### **2. CorrectorAgent.js (Profesor Corrector)**

**¿Qué es?**
Un agente especializado en corregir errores.

**¿Qué hace?**
- Recibe texto del estudiante
- Identifica errores
- Explica qué está mal
- Da la versión corregida

**Código simplificado:**

```javascript
// src/agents/CorrectorAgent.js
import { BaseAgent } from './BaseAgent.js'

export class CorrectorAgent extends BaseAgent {
  constructor() {
    // Llama al padre (BaseAgent)
    super({
      name: 'Corrector',
      systemPrompt: `Eres un corrector de español.
                     Encuentra errores y corrígelos.
                     Responde en JSON con este formato:
                     {
                       "errors": [...],
                       "correctedText": "..."
                     }`
    })
  }

  // Método específico para corregir
  async correct(text) {
    // Preparar mensaje para IA
    const mensaje = `Corrige este texto: "${text}"`

    // Usar el método del padre para llamar a DeepSeek
    const resultado = await this.execute(mensaje)

    // Parsear JSON y devolver
    return JSON.parse(resultado.content)
  }
}
```

**Ejemplo de uso:**

```javascript
const corrector = new CorrectorAgent()

const resultado = await corrector.correct("Me llama Juan")

// Resultado:
// {
//   errors: [
//     { incorrect: "llama", correct: "llamo", explanation: "..." }
//   ],
//   correctedText: "Me llamo Juan"
// }
```

---

### **3. EvaluatorAgent.js (Profesor Evaluador)**

**¿Qué es?**
Un agente especializado en dar notas.

**¿Qué hace?**
- Recibe la respuesta del estudiante
- La compara con respuestas correctas
- Da una nota de 0-10
- Explica fortalezas y debilidades

**Código simplificado:**

```javascript
// src/agents/EvaluatorAgent.js
import { BaseAgent } from './BaseAgent.js'

export class EvaluatorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Evaluator',
      systemPrompt: `Eres un evaluador objetivo.
                     Califica la respuesta de 0-10.
                     Responde en JSON:
                     {
                       "score": 7,
                       "feedback": "Buen trabajo pero...",
                       "strengths": ["..."],
                       "weaknesses": ["..."]
                     }`
    })
  }

  // Método específico para evaluar
  async evaluate(activity, userAnswer) {
    const mensaje = `
      Pregunta: ${activity.question}
      Respuesta del estudiante: ${userAnswer}

      Evalúa y califica.
    `

    const resultado = await this.execute(mensaje)
    return JSON.parse(resultado.content)
  }
}
```

---

### **4. agentService.js (El Director/Coordinador) 🧠**

**¿Qué es?**
El **CEREBRO** que decide qué agente usar y cuándo.

**¿Qué hace?**
- Recibe peticiones del usuario
- Decide qué agentes necesita
- Coordina múltiples agentes
- Combina sus respuestas
- Devuelve resultado final

**Código COMPLETO explicado:**

```javascript
// src/services/agentService.js
import { CorrectorAgent } from '../agents/CorrectorAgent.js'
import { EvaluatorAgent } from '../agents/EvaluatorAgent.js'
import { TranslatorAgent } from '../agents/TranslatorAgent.js'

class AgentService {
  constructor() {
    // CREAR INSTANCIAS de cada agente al iniciar
    this.corrector = new CorrectorAgent()
    this.evaluator = new EvaluatorAgent()
    this.translator = new TranslatorAgent()

    // Cache simple para evitar llamadas duplicadas
    this.cache = new Map()
  }

  /**
   * MÉTODO PRINCIPAL: Comprobar respuesta
   * Este es el que usas desde tu componente React
   */
  async checkAnswer(activity, userAnswer, userId) {
    console.log('🎯 agentService recibió la petición')

    // PASO 1: Verificar si ya tenemos la respuesta en cache
    const cacheKey = `${activity.id}_${userAnswer}`
    if (this.cache.has(cacheKey)) {
      console.log('✅ Respuesta encontrada en cache')
      return this.cache.get(cacheKey)
    }

    console.log('🚀 Llamando a los agentes...')

    // PASO 2: Llamar al CORRECTOR
    console.log('  → Llamando a CorrectorAgent...')
    const correction = await this.corrector.correct(userAnswer)
    console.log('  ✓ CorrectorAgent respondió:', correction)

    // PASO 3: Llamar al EVALUADOR
    console.log('  → Llamando a EvaluatorAgent...')
    const evaluation = await this.evaluator.evaluate(activity, userAnswer)
    console.log('  ✓ EvaluatorAgent respondió:', evaluation)

    // PASO 4: COMBINAR resultados
    const resultado = {
      correction: correction,      // Errores y texto corregido
      evaluation: evaluation,      // Nota y feedback
      score: evaluation.score,     // Nota (0-10)
      timestamp: new Date()
    }

    // PASO 5: Guardar en cache
    this.cache.set(cacheKey, resultado)

    // PASO 6: Guardar en base de datos
    await this.saveToDatabase(userId, activity.id, userAnswer, resultado)

    console.log('✅ Proceso completado')
    return resultado
  }

  /**
   * MÉTODO: Traducir texto
   */
  async translate(text, targetLanguage) {
    console.log(`🌍 Traduciendo a ${targetLanguage}...`)

    // Llamar solo al TRADUCTOR
    const translation = await this.translator.translate(text, targetLanguage)

    return translation
  }

  /**
   * MÉTODO: Guardar en base de datos
   */
  async saveToDatabase(userId, activityId, answer, result) {
    // Aquí guardas en Supabase
    // (código de Supabase)
  }
}

// EXPORTAR una ÚNICA INSTANCIA (Singleton)
// Esto significa que en toda tu app usas el MISMO agentService
export const agentService = new AgentService()
```

**¿Por qué es importante este archivo?**

1. **Crea los agentes UNA SOLA VEZ** al iniciar
2. **Decide qué agente llamar** según la necesidad
3. **Coordina múltiples agentes** cuando es necesario
4. **Cache** para evitar llamadas repetidas
5. Es el **único punto de entrada** desde tus componentes

---

## 🎨 ¿CÓMO SE USA DESDE REACT?

### **En tu componente (ActivityViewer.jsx):**

```javascript
// src/components/ActivityViewer.jsx
import { useState } from 'react'
import { agentService } from '../services/agentService'  // ← IMPORTAR

export function ActivityViewer({ activity }) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)

  const handleCheck = async () => {
    // SIMPLEMENTE LLAMAS A agentService
    const resultado = await agentService.checkAnswer(
      activity,    // La actividad actual
      answer,      // Lo que escribió el usuario
      'user123'    // ID del usuario
    )

    setResult(resultado)  // Mostrar resultado
  }

  return (
    <div>
      <h2>{activity.question}</h2>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button onClick={handleCheck}>
        Comprobar
      </button>

      {result && (
        <div>
          <h3>Resultado: {result.score}/10</h3>
          <p>{result.evaluation.feedback}</p>

          {result.correction.errors.map(error => (
            <div key={error.incorrect}>
              ❌ {error.incorrect} → ✅ {error.correct}
              <p>{error.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 🔄 FLUJO COMPLETO VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│  USUARIO                                                     │
│  Escribe: "Me llama Juan"                                   │
│  Click: [Comprobar]                                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT (ActivityViewer.jsx)                             │
│                                                              │
│  handleCheck() {                                            │
│    const result = await agentService.checkAnswer(...)       │
│  }                                                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  SERVICE (agentService.js) 🧠 CEREBRO                       │
│                                                              │
│  checkAnswer() {                                            │
│    1. ¿Ya está en cache? → SÍ: devolver                    │
│    2. NO: Llamar agentes                                    │
│  }                                                           │
└────┬───────────────────────┬──────────────────────────────┘
     │                       │
     │                       │
     ▼                       ▼
┌─────────────────┐   ┌─────────────────┐
│ CorrectorAgent  │   │ EvaluatorAgent  │
│                 │   │                 │
│ correct() {     │   │ evaluate() {    │
│   execute(...)  │   │   execute(...)  │
│ }               │   │ }               │
└────┬────────────┘   └────┬────────────┘
     │                     │
     │  Ambos heredan de   │
     │  BaseAgent          │
     │                     │
     ▼                     ▼
┌─────────────────────────────────────────┐
│  BaseAgent                               │
│                                          │
│  execute() {                             │
│    → Llama a DeepSeek API               │
│    → Recibe respuesta                   │
│  }                                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  DEEPSEEK API                            │
│  (La Inteligencia Artificial)           │
│                                          │
│  Procesa y responde                     │
└────────────────┬────────────────────────┘
                 │
                 │ Respuestas
                 ▼
┌─────────────────────────────────────────┐
│  SERVICE combina resultados              │
│                                          │
│  resultado = {                           │
│    correction: {...},                    │
│    evaluation: {...}                     │
│  }                                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  COMPONENT recibe resultado              │
│  setResult(resultado)                    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  USUARIO ve:                             │
│  ✅ Correcciones                         │
│  ✅ Nota: 7/10                          │
│  ✅ Feedback                             │
└─────────────────────────────────────────┘
```

---

## 🤔 PREGUNTAS FRECUENTES

### **P1: ¿Cómo sabe el sistema qué agente usar?**

**R:** El `agentService.js` decide. Es como un director:

```javascript
// Si usuario pide traducción:
agentService.translate()  → Usa TranslatorAgent

// Si usuario pide corrección:
agentService.checkAnswer()  → Usa CorrectorAgent + EvaluatorAgent

// Es TÚ quien decides en el código qué método llamar
```

### **P2: ¿Los agentes "viven" en la base de datos?**

**R:** ¡NO! Los agentes son **código JavaScript** que vive en archivos `.js`:

```
agents/
├── BaseAgent.js          ← Código JavaScript
├── CorrectorAgent.js     ← Código JavaScript
├── EvaluatorAgent.js     ← Código JavaScript
└── TranslatorAgent.js    ← Código JavaScript
```

Lo que SÍ va a la base de datos:
- Las respuestas del usuario
- Los resultados de las correcciones
- El progreso del usuario

### **P3: ¿Se crea un agente cada vez que usuario comprueba?**

**R:** ¡NO! Los agentes se crean UNA SOLA VEZ:

```javascript
// En agentService.js
class AgentService {
  constructor() {
    // ESTO SE EJECUTA UNA SOLA VEZ cuando inicia la app
    this.corrector = new CorrectorAgent()  ← Se crea aquí
    this.evaluator = new EvaluatorAgent()  ← Se crea aquí
  }

  // Luego REUTILIZAS los mismos agentes
  async checkAnswer() {
    await this.corrector.correct()  ← Reutiliza el mismo
  }
}

// Y exportas UNA SOLA INSTANCIA
export const agentService = new AgentService()  ← Singleton
```

### **P4: ¿Qué hace realmente DeepSeek API?**

**R:** DeepSeek es la **IA real** que:
1. Lee tu prompt (instrucciones)
2. Entiende la pregunta
3. Genera la respuesta

**Analogía:**
```
Tu código (agentes) = El teléfono
DeepSeek API = El profesor experto al otro lado del teléfono

Tú llamas y preguntas, el profesor responde.
```

### **P5: ¿Por qué usar diferentes agentes y no uno solo?**

**R:** Por **especialización** y **claridad**:

```javascript
// OPCIÓN 1: Un solo agente (malo) ❌
class UltraAgent {
  async doEverything(task, data) {
    if (task === 'correct') { ... }
    if (task === 'evaluate') { ... }
    if (task === 'translate') { ... }
    // Código confuso y difícil de mantener
  }
}

// OPCIÓN 2: Agentes especializados (bueno) ✅
class CorrectorAgent {
  async correct(text) { ... }  // Solo se enfoca en corregir
}

class EvaluatorAgent {
  async evaluate(answer) { ... }  // Solo se enfoca en evaluar
}

// Código limpio y fácil de entender
```

### **P6: ¿Dónde está el "cerebro" que decide?**

**R:** En `agentService.js`:

```javascript
// Este archivo ES el cerebro
class AgentService {
  // Método 1: Usuario pide corrección
  async checkAnswer(activity, answer) {
    // YO DECIDO: necesito corrector Y evaluador
    const correction = await this.corrector.correct(answer)
    const evaluation = await this.evaluator.evaluate(answer)

    // YO COMBINO los resultados
    return { correction, evaluation }
  }

  // Método 2: Usuario pide traducción
  async translate(text) {
    // YO DECIDO: solo necesito traductor
    return await this.translator.translate(text)
  }
}
```

---

## 📦 RESUMEN FINAL

### **Los agentes SON:**
✅ Archivos de código JavaScript
✅ Clases que heredan de BaseAgent
✅ Especialistas en tareas específicas
✅ Se guardan en la carpeta `src/agents/`

### **Los agentes NO SON:**
❌ Base de datos
❌ Servidores separados
❌ Aplicaciones independientes
❌ IA por sí mismos (usan DeepSeek API)

### **El flujo es:**
```
Usuario → Component → agentService → Agente → DeepSeek → Respuesta
```

### **El "cerebro" es:**
```
agentService.js (decide qué agente usar)
```

### **Los archivos clave:**
```
src/
├── agents/
│   ├── BaseAgent.js          ← Padre de todos
│   ├── CorrectorAgent.js     ← Hijo que corrige
│   └── EvaluatorAgent.js     ← Hijo que evalúa
│
├── services/
│   └── agentService.js       ← 🧠 CEREBRO (coordina todo)
│
└── components/
    └── ActivityViewer.jsx    ← UI (usa agentService)
```

---

## 🚀 PRÓXIMO PASO

**¿Quieres que te cree estos archivos con código real funcionando?**

Puedo crear:
1. ✅ `BaseAgent.js`
2. ✅ `CorrectorAgent.js`
3. ✅ `EvaluatorAgent.js`
4. ✅ `agentService.js`
5. ✅ Componente React de ejemplo

**¿Empezamos a crear los archivos reales?** 🎯
