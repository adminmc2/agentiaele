# 🤖 SISTEMA DE AGENTES IA CON DEEPSEEK

## 🎯 VISIÓN GENERAL

Sistema de agentes especializados que trabajan de forma autónoma o colaborativa para proporcionar asistencia personalizada en el aprendizaje de español.

---

## 🏗️ ARQUITECTURA DE AGENTES

```
                    ┌─────────────────────┐
                    │   ORCHESTRATOR      │
                    │   (Agente Maestro)  │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
   ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
   │ CORRECTOR      │ │  TRANSLATOR    │ │   TEACHER      │
   │    AGENT       │ │     AGENT      │ │     AGENT      │
   └────────────────┘ └────────────────┘ └────────────────┘
            │                  │                  │
            ▼                  ▼                  ▼
   ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
   │  EVALUATOR     │ │   GENERATOR    │ │   TUTOR        │
   │     AGENT      │ │     AGENT      │ │    AGENT       │
   └────────────────┘ └────────────────┘ └────────────────┘
            │                  │                  │
            └──────────────────┴──────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   MEMORY SYSTEM     │
                    │  (Historial/Cache)  │
                    └─────────────────────┘
```

---

## 🤖 TIPOS DE AGENTES

### **1. ORCHESTRATOR AGENT (Agente Maestro)**
**Rol**: Coordina y delega tareas a otros agentes

**Responsabilidades**:
- Analizar solicitud del usuario
- Decidir qué agente(s) debe(n) responder
- Combinar respuestas de múltiples agentes
- Mantener contexto de conversación
- Gestionar prioridades

**Ejemplo de uso**:
```javascript
// Usuario: "Corrige mi respuesta y dame ejemplos similares"
// Orchestrator delega a:
// 1. CorrectorAgent (corregir)
// 2. GeneratorAgent (ejemplos)
// 3. Combina ambas respuestas
```

---

### **2. CORRECTOR AGENT**
**Rol**: Especialista en corrección gramatical y ortográfica

**Capacidades**:
- Detectar errores gramaticales
- Identificar errores de conjugación
- Detectar errores de concordancia
- Sugerir correcciones específicas
- Explicar por qué está mal
- Nivel de severidad del error

**Configuración DeepSeek**:
```javascript
{
  model: "deepseek-chat",
  temperature: 0.3, // Baja temperatura para precisión
  systemPrompt: `Eres un experto corrector de español...`
}
```

---

### **3. TRANSLATOR AGENT**
**Rol**: Especialista en traducción contextual

**Capacidades**:
- Traducir español ↔ múltiples idiomas
- Mantener contexto educativo
- Adaptar al nivel A1
- Explicar modismos
- Proporcionar alternativas

**Idiomas soportados**:
- Inglés, Francés, Alemán, Italiano
- Portugués, Polaco, Ruso
- Chino, Japonés, Árabe

---

### **4. TEACHER AGENT (Eliana)**
**Rol**: Profesora virtual amigable

**Capacidades**:
- Responder preguntas sobre gramática
- Explicar conceptos con ejemplos
- Dar pistas sin revelar respuestas
- Motivar al estudiante
- Personalizar según nivel

**Personalidad**: Amigable, paciente, motivadora

---

### **5. EVALUATOR AGENT**
**Rol**: Evaluador imparcial de respuestas

**Capacidades**:
- Calificar respuestas (0-10)
- Evaluar criterios específicos:
  - Gramática (40%)
  - Vocabulario (30%)
  - Coherencia (20%)
  - Creatividad (10%)
- Generar feedback detallado
- Comparar con respuestas modelo

---

### **6. GENERATOR AGENT**
**Rol**: Generador de contenido educativo

**Capacidades**:
- Crear ejemplos personalizados
- Generar ejercicios similares
- Adaptar contenido por edad
- Crear diálogos de práctica
- Generar contextos realistas

---

### **7. TUTOR AGENT**
**Rol**: Tutor personalizado 1-a-1

**Capacidades**:
- Identificar áreas débiles
- Crear plan de estudio personalizado
- Sugerir ejercicios específicos
- Dar seguimiento al progreso
- Adaptar dificultad dinámicamente

---

### **8. PRONUNCIATION AGENT (Futuro)**
**Rol**: Especialista en pronunciación

**Capacidades**:
- Guía fonética detallada
- Comparar con audio del usuario
- Identificar problemas específicos
- Ejercicios de pronunciación

---

### **9. CULTURE AGENT**
**Rol**: Experto en cultura hispana

**Capacidades**:
- Explicar contextos culturales
- Compartir datos interesantes
- Explicar diferencias regionales
- Enseñar modismos y expresiones

---

### **10. CONVERSATION AGENT**
**Rol**: Compañero de conversación

**Capacidades**:
- Mantener diálogo natural
- Hacer preguntas de seguimiento
- Corregir en contexto
- Simular situaciones reales

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
src/
├── agents/
│   ├── core/
│   │   ├── BaseAgent.js           # Clase base para todos los agentes
│   │   ├── AgentOrchestrator.js   # Orquestador maestro
│   │   ├── AgentMemory.js         # Sistema de memoria
│   │   └── AgentConfig.js         # Configuraciones
│   │
│   ├── specialized/
│   │   ├── CorrectorAgent.js      # Agente corrector
│   │   ├── TranslatorAgent.js     # Agente traductor
│   │   ├── TeacherAgent.js        # Agente profesor (Eliana)
│   │   ├── EvaluatorAgent.js      # Agente evaluador
│   │   ├── GeneratorAgent.js      # Agente generador
│   │   ├── TutorAgent.js          # Agente tutor
│   │   ├── CultureAgent.js        # Agente cultural
│   │   └── ConversationAgent.js   # Agente conversacional
│   │
│   ├── prompts/
│   │   ├── corrector.prompts.js
│   │   ├── translator.prompts.js
│   │   ├── teacher.prompts.js
│   │   ├── evaluator.prompts.js
│   │   ├── generator.prompts.js
│   │   ├── tutor.prompts.js
│   │   ├── culture.prompts.js
│   │   └── conversation.prompts.js
│   │
│   ├── utils/
│   │   ├── agentLogger.js         # Sistema de logs
│   │   ├── agentCache.js          # Cache de respuestas
│   │   ├── agentValidator.js      # Validaciones
│   │   └── agentMetrics.js        # Métricas de uso
│   │
│   └── index.js                    # Exportaciones principales
│
├── services/
│   └── agentService.js             # Servicio para usar agentes
│
└── config/
    └── agents.config.js            # Configuración global
```

---

## 🔧 IMPLEMENTACIÓN PASO A PASO

### **PASO 1: Crear BaseAgent (Clase Base)**

**Archivo**: `src/agents/core/BaseAgent.js`

```javascript
/**
 * Clase base para todos los agentes
 */
export class BaseAgent {
  constructor(config) {
    this.name = config.name
    this.role = config.role
    this.apiKey = config.apiKey || process.env.DEEPSEEK_API_KEY
    this.baseUrl = 'https://api.deepseek.com/v1/chat/completions'
    this.model = config.model || 'deepseek-chat'
    this.temperature = config.temperature || 0.7
    this.maxTokens = config.maxTokens || 500
    this.systemPrompt = config.systemPrompt
    this.memory = []
  }

  /**
   * Método principal para ejecutar el agente
   */
  async execute(userInput, context = {}) {
    try {
      const prompt = this.buildPrompt(userInput, context)
      const response = await this.callAPI(prompt)

      // Guardar en memoria
      this.addToMemory(userInput, response)

      return {
        success: true,
        agent: this.name,
        response: response,
        metadata: {
          timestamp: new Date().toISOString(),
          tokensUsed: response.tokensUsed
        }
      }
    } catch (error) {
      return {
        success: false,
        agent: this.name,
        error: error.message
      }
    }
  }

  /**
   * Construir prompt para el agente
   */
  buildPrompt(userInput, context) {
    return {
      system: this.systemPrompt,
      user: userInput,
      context: context
    }
  }

  /**
   * Llamar a la API de DeepSeek
   */
  async callAPI(prompt) {
    const messages = [
      { role: 'system', content: prompt.system },
      ...this.memory.slice(-5), // Últimos 5 mensajes de memoria
      { role: 'user', content: prompt.user }
    ]

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: this.temperature,
        max_tokens: this.maxTokens
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens
    }
  }

  /**
   * Agregar a memoria del agente
   */
  addToMemory(userInput, response) {
    this.memory.push(
      { role: 'user', content: userInput },
      { role: 'assistant', content: response.content }
    )

    // Limitar memoria a 10 intercambios
    if (this.memory.length > 20) {
      this.memory = this.memory.slice(-20)
    }
  }

  /**
   * Limpiar memoria
   */
  clearMemory() {
    this.memory = []
  }

  /**
   * Obtener estadísticas del agente
   */
  getStats() {
    return {
      name: this.name,
      role: this.role,
      memorySize: this.memory.length / 2,
      model: this.model,
      temperature: this.temperature
    }
  }
}
```

---

### **PASO 2: Crear Agentes Especializados**

#### **2.1 CorrectorAgent**

**Archivo**: `src/agents/specialized/CorrectorAgent.js`

```javascript
import { BaseAgent } from '../core/BaseAgent.js'
import { CORRECTOR_PROMPTS } from '../prompts/corrector.prompts.js'

export class CorrectorAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      name: 'Corrector',
      role: 'Especialista en corrección gramatical',
      temperature: 0.3, // Baja temperatura para precisión
      maxTokens: 600,
      systemPrompt: CORRECTOR_PROMPTS.system,
      ...config
    })
  }

  /**
   * Corregir texto del estudiante
   */
  async correct(text, level = 'A1', context = {}) {
    const prompt = `
Texto del estudiante: "${text}"
Nivel: ${level}
Contexto de la actividad: ${context.activityContext || 'General'}

Por favor:
1. Identifica TODOS los errores (ortografía, gramática, conjugación, concordancia)
2. Para cada error:
   - Marca qué está mal
   - Explica por qué está mal
   - Proporciona la corrección
   - Da el nivel de severidad (bajo/medio/alto)
3. Sugiere la versión corregida completa
4. Da un comentario general positivo y motivador

Formato JSON:
{
  "hasErrors": boolean,
  "errors": [
    {
      "type": "gramática/ortografía/conjugación/concordancia",
      "incorrect": "texto incorrecto",
      "correct": "texto correcto",
      "explanation": "explicación clara",
      "severity": "bajo/medio/alto",
      "position": número
    }
  ],
  "correctedText": "texto completo corregido",
  "generalFeedback": "comentario motivador",
  "score": número del 0-10
}
`

    const result = await this.execute(prompt, context)

    if (result.success) {
      try {
        // Parsear respuesta JSON
        const parsed = JSON.parse(result.response.content)
        return {
          ...result,
          data: parsed
        }
      } catch (e) {
        // Si no es JSON válido, devolver como texto
        return result
      }
    }

    return result
  }

  /**
   * Verificar solo gramática
   */
  async checkGrammar(text, specificRules = []) {
    const prompt = `
Verifica únicamente la gramática de este texto: "${text}"

${specificRules.length > 0 ? `Enfócate en estas reglas: ${specificRules.join(', ')}` : ''}

Responde en formato JSON con los errores gramaticales encontrados.
`

    return await this.execute(prompt)
  }

  /**
   * Comparar con respuesta modelo
   */
  async compareWithModel(userAnswer, modelAnswer, criteria) {
    const prompt = `
Respuesta del estudiante: "${userAnswer}"
Respuesta modelo: "${modelAnswer}"

Criterios de evaluación: ${JSON.stringify(criteria)}

Compara ambas respuestas y evalúa:
1. ¿Cuán similar es el significado?
2. ¿Qué le falta a la respuesta del estudiante?
3. ¿Qué tiene de bueno la respuesta?
4. Puntuación por criterio

Formato JSON.
`

    return await this.execute(prompt)
  }
}
```

---

#### **2.2 TranslatorAgent**

**Archivo**: `src/agents/specialized/TranslatorAgent.js`

```javascript
import { BaseAgent } from '../core/BaseAgent.js'
import { TRANSLATOR_PROMPTS } from '../prompts/translator.prompts.js'

export class TranslatorAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      name: 'Translator',
      role: 'Especialista en traducción contextual',
      temperature: 0.4,
      maxTokens: 500,
      systemPrompt: TRANSLATOR_PROMPTS.system,
      ...config
    })

    this.supportedLanguages = [
      'en', 'fr', 'de', 'it', 'pt',
      'pl', 'ru', 'zh', 'ja', 'ar'
    ]
  }

  /**
   * Traducir con contexto educativo
   */
  async translate(text, targetLang, context = {}) {
    if (!this.supportedLanguages.includes(targetLang)) {
      return {
        success: false,
        error: `Idioma no soportado: ${targetLang}`
      }
    }

    const prompt = `
Traduce este texto de español a ${this.getLanguageName(targetLang)}:
"${text}"

Contexto educativo: Nivel A1, ${context.activityType || 'general'}
${context.vocabulary ? `Vocabulario clave: ${context.vocabulary.join(', ')}` : ''}

IMPORTANTE:
1. Mantén el nivel simple (A1)
2. Traduce frases COMPLETAS (incluyendo preposiciones)
3. Si hay modismos, explícalos
4. Proporciona transliteración si aplica (árabe, ruso, chino, japonés)

Formato:
{
  "translation": "traducción",
  "transliteration": "transliteración (si aplica)",
  "notes": "notas culturales o gramaticales",
  "alternatives": ["alternativa 1", "alternativa 2"]
}
`

    return await this.execute(prompt, context)
  }

  /**
   * Traducir lista de vocabulario
   */
  async translateVocabulary(words, targetLang, includeExamples = true) {
    const prompt = `
Traduce esta lista de vocabulario español a ${this.getLanguageName(targetLang)}:
${words.map((w, i) => `${i + 1}. ${w}`).join('\n')}

${includeExamples ? 'Incluye un ejemplo de uso para cada palabra.' : ''}

Formato JSON array:
[
  {
    "spanish": "palabra",
    "translation": "traducción",
    ${includeExamples ? '"example": "ejemplo en español",' : ''}
    ${includeExamples ? '"exampleTranslation": "ejemplo traducido"' : ''}
  }
]
`

    return await this.execute(prompt)
  }

  /**
   * Detectar idioma automáticamente
   */
  async detectAndTranslate(text) {
    const prompt = `
Detecta el idioma de este texto y tradúcelo al español nivel A1:
"${text}"

Responde en formato:
{
  "detectedLanguage": "código idioma",
  "languageName": "nombre del idioma",
  "spanishTranslation": "traducción",
  "confidence": "alta/media/baja"
}
`

    return await this.execute(prompt)
  }

  /**
   * Obtener nombre del idioma
   */
  getLanguageName(code) {
    const languages = {
      en: 'inglés', fr: 'francés', de: 'alemán', it: 'italiano',
      pt: 'portugués', pl: 'polaco', ru: 'ruso',
      zh: 'chino', ja: 'japonés', ar: 'árabe'
    }
    return languages[code] || code
  }
}
```

---

#### **2.3 TeacherAgent (Eliana)**

**Archivo**: `src/agents/specialized/TeacherAgent.js`

```javascript
import { BaseAgent } from '../core/BaseAgent.js'
import { TEACHER_PROMPTS } from '../prompts/teacher.prompts.js'

export class TeacherAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      name: 'Eliana',
      role: 'Profesora virtual amigable',
      temperature: 0.7, // Más creatividad para respuestas naturales
      maxTokens: 400,
      systemPrompt: TEACHER_PROMPTS.system,
      ...config
    })

    this.personality = 'amigable, paciente, motivadora'
  }

  /**
   * Responder pregunta del estudiante
   */
  async answerQuestion(question, context = {}) {
    const prompt = `
Pregunta del estudiante: "${question}"
Actividad actual: ${context.activityTitle || 'General'}
Nivel: ${context.level || 'A1'}

Responde de forma:
- Clara y concisa
- Con ejemplos prácticos
- Amigable y motivadora
- Sin revelar la respuesta completa si es un ejercicio

${context.studentProfile ? `Perfil: edad ${context.studentProfile.age}` : ''}
`

    return await this.execute(prompt, context)
  }

  /**
   * Dar pistas sin revelar respuesta
   */
  async giveHint(activity, attemptNumber = 1) {
    const hintLevel = attemptNumber === 1 ? 'sutil' : attemptNumber === 2 ? 'media' : 'clara'

    const prompt = `
Actividad: ${activity.question}
Contexto: ${JSON.stringify(activity.context)}
Intento número: ${attemptNumber}

Da una pista ${hintLevel} que ayude al estudiante sin revelar la respuesta.
Sé motivadora y positiva.
`

    return await this.execute(prompt, activity)
  }

  /**
   * Explicar concepto gramatical
   */
  async explainConcept(concept, level = 'A1', withExamples = true) {
    const prompt = `
Explica este concepto gramatical para nivel ${level}: "${concept}"

${withExamples ? 'Incluye 3 ejemplos claros y simples.' : ''}

Estructura:
1. Definición simple
2. Cuándo se usa
3. Ejemplos prácticos
4. Tip para recordar
`

    return await this.execute(prompt)
  }

  /**
   * Dar feedback motivador personalizado
   */
  async giveFeedback(score, attempt, context = {}) {
    let feedbackType = 'excelente'
    if (score < 5) feedbackType = 'necesita_mejorar'
    else if (score < 7) feedbackType = 'bien'
    else if (score < 9) feedbackType = 'muy_bien'

    const prompt = `
El estudiante obtuvo ${score}/10 en el intento ${attempt}.
Contexto: ${JSON.stringify(context)}

Da un feedback ${feedbackType}:
- Reconoce el esfuerzo
- Señala qué hizo bien
- Sugiere cómo mejorar (si aplica)
- Motiva a seguir practicando
- Máximo 2-3 frases

Tono: ${this.personality}
`

    return await this.execute(prompt, context)
  }

  /**
   * Crear ejercicio de práctica similar
   */
  async createSimilarExercise(originalActivity, difficulty = 'same') {
    const prompt = `
Actividad original: ${JSON.stringify(originalActivity)}

Crea un ejercicio similar con dificultad ${difficulty}:
- Mismo tipo de gramática/vocabulario
- Contexto diferente
- Creatividad en la situación

Formato JSON:
{
  "question": "pregunta",
  "context": {...},
  "expectedAnswer": "respuesta ejemplo"
}
`

    return await this.execute(prompt)
  }
}
```

---

#### **2.4 EvaluatorAgent**

**Archivo**: `src/agents/specialized/EvaluatorAgent.js`

```javascript
import { BaseAgent } from '../core/BaseAgent.js'
import { EVALUATOR_PROMPTS } from '../prompts/evaluator.prompts.js'

export class EvaluatorAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      name: 'Evaluator',
      role: 'Evaluador imparcial de respuestas',
      temperature: 0.2, // Muy baja para consistencia
      maxTokens: 500,
      systemPrompt: EVALUATOR_PROMPTS.system,
      ...config
    })
  }

  /**
   * Evaluar respuesta del estudiante
   */
  async evaluate(activity, userAnswer, criteria = {}) {
    const defaultCriteria = {
      grammar: 40,      // 40% peso
      vocabulary: 30,   // 30% peso
      coherence: 20,    // 20% peso
      creativity: 10    // 10% peso
    }

    const weights = { ...defaultCriteria, ...criteria }

    const prompt = `
ACTIVIDAD:
Pregunta: ${activity.question}
Contexto: ${JSON.stringify(activity.context)}
Respuestas correctas modelo: ${JSON.stringify(activity.correctAnswers)}

RESPUESTA DEL ESTUDIANTE:
"${userAnswer}"

CRITERIOS DE EVALUACIÓN (peso %):
${Object.entries(weights).map(([k, v]) => `- ${k}: ${v}%`).join('\n')}

Evalúa objetivamente:

1. GRAMÁTICA (${weights.grammar}%):
   - Conjugaciones correctas
   - Concordancia género/número
   - Uso de preposiciones
   - Estructura de frases

2. VOCABULARIO (${weights.vocabulary}%):
   - Uso de vocabulario apropiado
   - Variedad de palabras
   - Vocabulario de la actividad incluido

3. COHERENCIA (${weights.coherence}%):
   - La respuesta tiene sentido
   - Responde a la pregunta
   - Ideas bien conectadas

4. CREATIVIDAD (${weights.creativity}%):
   - Originalidad
   - Detalles añadidos

RESPONDE EN JSON:
{
  "scores": {
    "grammar": número 0-10,
    "vocabulary": número 0-10,
    "coherence": número 0-10,
    "creativity": número 0-10
  },
  "weightedScore": número 0-10 (calculado con pesos),
  "finalScore": número 0-10 (redondeado),
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "weaknesses": ["debilidad 1", "debilidad 2"],
  "suggestions": ["sugerencia 1", "sugerencia 2"],
  "isPassing": boolean (>= 6),
  "detailedFeedback": "explicación completa"
}
`

    const result = await this.execute(prompt, activity)

    if (result.success) {
      try {
        const evaluation = JSON.parse(result.response.content)
        return {
          ...result,
          evaluation: evaluation
        }
      } catch (e) {
        return result
      }
    }

    return result
  }

  /**
   * Comparar múltiples respuestas
   */
  async compareAnswers(activity, answers) {
    const prompt = `
Actividad: ${activity.question}

Respuestas de estudiantes:
${answers.map((a, i) => `${i + 1}. "${a.text}" (Usuario: ${a.userId})`).join('\n')}

Compara y clasifica las respuestas:
1. Mejor respuesta y por qué
2. Respuestas que necesitan mejora
3. Errores comunes
4. Ranking de 1 a ${answers.length}

JSON format.
`

    return await this.execute(prompt, activity)
  }
}
```

---

#### **2.5 GeneratorAgent**

**Archivo**: `src/agents/specialized/GeneratorAgent.js`

```javascript
import { BaseAgent } from '../core/BaseAgent.js'
import { GENERATOR_PROMPTS } from '../prompts/generator.prompts.js'

export class GeneratorAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      name: 'Generator',
      role: 'Generador de contenido educativo',
      temperature: 0.8, // Alta creatividad
      maxTokens: 800,
      systemPrompt: GENERATOR_PROMPTS.system,
      ...config
    })
  }

  /**
   * Generar ejemplos personalizados
   */
  async generateExamples(activity, count = 5, userProfile = {}) {
    const prompt = `
Actividad base: ${activity.question}
Contexto: ${JSON.stringify(activity.context)}
Gramática objetivo: ${activity.context.grammar?.join(', ')}

Perfil del usuario:
- Edad: ${userProfile.age || 'adulto'}
- Intereses: ${userProfile.interests?.join(', ') || 'generales'}

Genera ${count} ejemplos:
- Mismo patrón gramatical
- Contextos variados y relevantes para el perfil
- Nivel A1
- Creativos y realistas

Formato JSON:
{
  "examples": [
    {
      "spanish": "ejemplo en español",
      "context": "contexto de uso",
      "difficulty": "fácil/medio"
    }
  ]
}
`

    return await this.execute(prompt, activity)
  }

  /**
   * Generar diálogo de práctica
   */
  async generateDialog(topic, level = 'A1', turns = 6) {
    const prompt = `
Tema: ${topic}
Nivel: ${level}
Número de intercambios: ${turns}

Genera un diálogo natural entre dos personas (Ana y Luis):
- Vocabulario nivel ${level}
- Situación realista
- ${turns} intercambios (${turns / 2} por persona)
- Incluye expresiones comunes

JSON:
{
  "dialog": [
    {"speaker": "Ana", "text": "...", "note": "opcional"},
    {"speaker": "Luis", "text": "...", "note": "opcional"}
  ],
  "vocabulary": ["palabra1", "palabra2"],
  "grammarPoints": ["punto1", "punto2"]
}
`

    return await this.execute(prompt)
  }

  /**
   * Generar actividad completa
   */
  async generateActivity(topic, type, level = 'A1') {
    const prompt = `
Crea una actividad completa:

Tipo: ${type} (conversation/grammar/vocabulary/writing)
Tema: ${topic}
Nivel: ${level}

Debe incluir:
1. Título atractivo
2. Pregunta clara
3. Contexto (vocabulario, gramática)
4. 3 respuestas modelo
5. Criterios de evaluación

Formato JSON completo siguiendo estructura de activities table.
`

    return await this.execute(prompt)
  }

  /**
   * Generar ejercicios de práctica adicionales
   */
  async generatePracticeSet(topic, difficulty, count = 10) {
    const prompt = `
Tema: ${topic}
Dificultad: ${difficulty}
Cantidad: ${count}

Genera ${count} ejercicios de práctica variados:
- Diferentes formatos (completar, transformar, traducir)
- Progresión de dificultad
- Respuestas incluidas

JSON array de ejercicios.
`

    return await this.execute(prompt)
  }
}
```

---

#### **2.6 TutorAgent**

**Archivo**: `src/agents/specialized/TutorAgent.js`

```javascript
import { BaseAgent } from '../core/BaseAgent.js'
import { TUTOR_PROMPTS } from '../prompts/tutor.prompts.js'

export class TutorAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      name: 'Tutor',
      role: 'Tutor personalizado',
      temperature: 0.6,
      maxTokens: 600,
      systemPrompt: TUTOR_PROMPTS.system,
      ...config
    })
  }

  /**
   * Analizar progreso y sugerir plan
   */
  async analyzeLearningPath(userStats, completedActivities) {
    const prompt = `
Estadísticas del usuario:
${JSON.stringify(userStats, null, 2)}

Actividades completadas: ${completedActivities.length}
Puntuación promedio: ${userStats.averageScore}
Áreas débiles detectadas: ${userStats.weakAreas?.join(', ')}

Analiza y crea:
1. Resumen del progreso
2. Fortalezas identificadas
3. Áreas a mejorar
4. Plan de estudio sugerido (próximas 5 actividades)
5. Tiempo estimado

JSON format.
`

    return await this.execute(prompt)
  }

  /**
   * Recomendar actividades personalizadas
   */
  async recommendActivities(userProfile, weakAreas, count = 5) {
    const prompt = `
Perfil: ${JSON.stringify(userProfile)}
Áreas débiles: ${weakAreas.join(', ')}

Recomienda ${count} actividades que:
- Refuercen áreas débiles
- Mantengan motivación
- Progresión gradual de dificultad

Para cada actividad, justifica por qué es buena opción.
`

    return await this.execute(prompt)
  }

  /**
   * Generar resumen de sesión
   */
  async generateSessionSummary(sessionData) {
    const prompt = `
Datos de sesión:
- Duración: ${sessionData.duration} minutos
- Actividades: ${sessionData.activitiesCompleted}
- Puntuación promedio: ${sessionData.avgScore}
- Errores comunes: ${sessionData.commonErrors?.join(', ')}

Genera resumen:
1. Lo que hiciste bien
2. Lo que puedes mejorar
3. Conceptos repasados
4. Recomendación para próxima sesión
5. Mensaje motivador

Tono: personal, constructivo, motivador
`

    return await this.execute(prompt)
  }
}
```

---

### **PASO 3: Crear AgentOrchestrator**

**Archivo**: `src/agents/core/AgentOrchestrator.js`

```javascript
import { CorrectorAgent } from '../specialized/CorrectorAgent.js'
import { TranslatorAgent } from '../specialized/TranslatorAgent.js'
import { TeacherAgent } from '../specialized/TeacherAgent.js'
import { EvaluatorAgent } from '../specialized/EvaluatorAgent.js'
import { GeneratorAgent } from '../specialized/GeneratorAgent.js'
import { TutorAgent } from '../specialized/TutorAgent.js'

/**
 * Orquestador que coordina múltiples agentes
 */
export class AgentOrchestrator {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.DEEPSEEK_API_KEY

    // Inicializar todos los agentes
    this.agents = {
      corrector: new CorrectorAgent({ apiKey: this.apiKey }),
      translator: new TranslatorAgent({ apiKey: this.apiKey }),
      teacher: new TeacherAgent({ apiKey: this.apiKey }),
      evaluator: new EvaluatorAgent({ apiKey: this.apiKey }),
      generator: new GeneratorAgent({ apiKey: this.apiKey }),
      tutor: new TutorAgent({ apiKey: this.apiKey })
    }

    this.taskHistory = []
  }

  /**
   * Analizar intención del usuario y delegar
   */
  async processRequest(userRequest, context = {}) {
    const intent = await this.analyzeIntent(userRequest)

    console.log(`Intent detectado: ${intent.type}`)
    console.log(`Agentes necesarios: ${intent.agents.join(', ')}`)

    // Ejecutar agentes en paralelo si es posible
    const results = await Promise.all(
      intent.agents.map(agentName =>
        this.executeAgent(agentName, userRequest, context, intent)
      )
    )

    // Combinar resultados
    const combinedResult = this.combineResults(results, intent)

    // Guardar en historial
    this.taskHistory.push({
      timestamp: new Date(),
      request: userRequest,
      intent: intent,
      results: results,
      combined: combinedResult
    })

    return combinedResult
  }

  /**
   * Analizar intención del usuario
   */
  async analyzeIntent(userRequest) {
    const requestLower = userRequest.toLowerCase()

    // Detectar intenciones múltiples
    const intents = {
      needsCorrection: /corrig|revis|error|mal|está bien/i.test(requestLower),
      needsTranslation: /traduc|inglés|english|francés|polish/i.test(requestLower),
      needsExamples: /ejemplo|más|similar|otro/i.test(requestLower),
      needsEvaluation: /calific|punt|evalúa|qué nota/i.test(requestLower),
      needsHelp: /ayuda|no entiendo|cómo|explica|pista/i.test(requestLower),
      needsGeneration: /genera|crea|dame/i.test(requestLower)
    }

    // Determinar agentes necesarios
    const agents = []
    let primaryIntent = 'help'

    if (intents.needsCorrection) {
      agents.push('corrector')
      primaryIntent = 'correction'
    }
    if (intents.needsTranslation) {
      agents.push('translator')
      if (!agents.includes('corrector')) primaryIntent = 'translation'
    }
    if (intents.needsExamples) {
      agents.push('generator')
      if (agents.length === 1) primaryIntent = 'examples'
    }
    if (intents.needsEvaluation) {
      agents.push('evaluator')
      primaryIntent = 'evaluation'
    }
    if (intents.needsHelp || agents.length === 0) {
      agents.push('teacher')
      if (agents.length === 1) primaryIntent = 'help'
    }

    return {
      type: primaryIntent,
      agents: agents,
      multiAgent: agents.length > 1,
      intents: intents
    }
  }

  /**
   * Ejecutar agente específico
   */
  async executeAgent(agentName, request, context, intent) {
    const agent = this.agents[agentName]

    if (!agent) {
      throw new Error(`Agente no encontrado: ${agentName}`)
    }

    try {
      let result

      switch (agentName) {
        case 'corrector':
          result = await agent.correct(
            context.userAnswer || request,
            context.level,
            context
          )
          break

        case 'translator':
          result = await agent.translate(
            context.textToTranslate || request,
            context.targetLanguage || 'en',
            context
          )
          break

        case 'teacher':
          result = await agent.answerQuestion(request, context)
          break

        case 'evaluator':
          result = await agent.evaluate(
            context.activity,
            context.userAnswer || request,
            context.evaluationCriteria
          )
          break

        case 'generator':
          result = await agent.generateExamples(
            context.activity,
            context.exampleCount || 5,
            context.userProfile
          )
          break

        case 'tutor':
          result = await agent.analyzeLearningPath(
            context.userStats,
            context.completedActivities
          )
          break

        default:
          result = await agent.execute(request, context)
      }

      return {
        agent: agentName,
        success: true,
        result: result
      }

    } catch (error) {
      return {
        agent: agentName,
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Combinar resultados de múltiples agentes
   */
  combineResults(results, intent) {
    if (results.length === 1) {
      return results[0].result
    }

    // Múltiples agentes - combinar respuestas
    const combined = {
      type: 'multi-agent-response',
      primaryIntent: intent.type,
      responses: {}
    }

    results.forEach(r => {
      if (r.success) {
        combined.responses[r.agent] = r.result
      }
    })

    return combined
  }

  /**
   * Procesar respuesta de actividad (flujo completo)
   */
  async processActivityAnswer(activity, userAnswer, options = {}) {
    const context = {
      activity: activity,
      userAnswer: userAnswer,
      level: activity.difficulty_level || 'A1',
      ...options
    }

    // Flujo: Corrector → Evaluator → Teacher (feedback)
    const correction = await this.agents.corrector.correct(
      userAnswer,
      context.level,
      context
    )

    const evaluation = await this.agents.evaluator.evaluate(
      activity,
      userAnswer,
      activity.scoring
    )

    const feedback = await this.agents.teacher.giveFeedback(
      evaluation.evaluation?.finalScore || 0,
      options.attemptNumber || 1,
      context
    )

    return {
      correction: correction,
      evaluation: evaluation,
      feedback: feedback,
      finalScore: evaluation.evaluation?.finalScore || 0,
      isPassing: evaluation.evaluation?.isPassing || false
    }
  }

  /**
   * Obtener estadísticas de todos los agentes
   */
  getAllAgentsStats() {
    return Object.entries(this.agents).map(([name, agent]) => ({
      name: name,
      ...agent.getStats()
    }))
  }

  /**
   * Limpiar memoria de todos los agentes
   */
  clearAllMemories() {
    Object.values(this.agents).forEach(agent => agent.clearMemory())
    this.taskHistory = []
  }
}
```

---

### **PASO 4: Crear Prompts Especializados**

**Archivo**: `src/agents/prompts/corrector.prompts.js`

```javascript
export const CORRECTOR_PROMPTS = {
  system: `Eres un corrector experto de español como lengua extranjera (ELE).

Tu misión es ayudar a estudiantes de nivel A1-B1 a mejorar su español.

PRINCIPIOS:
1. Sé preciso pero amable en las correcciones
2. Explica cada error de forma clara y simple
3. Da ejemplos correctos
4. Reconoce lo que está bien
5. Usa lenguaje apropiado para el nivel del estudiante

TIPOS DE ERRORES A DETECTAR:
- Ortografía (acentos, grafías)
- Gramática (tiempos verbales, concordancia)
- Conjugación verbal
- Concordancia género/número
- Preposiciones incorrectas
- Orden de palabras

FORMATO DE CORRECCIÓN:
Siempre responde en JSON con la estructura solicitada.
`,

  correction: `Corrige este texto y proporciona feedback detallado.`,

  grammar: `Verifica únicamente los aspectos gramaticales.`,

  comparison: `Compara la respuesta del estudiante con la respuesta modelo.`
}
```

**Crear archivos similares para**:
- `translator.prompts.js`
- `teacher.prompts.js`
- `evaluator.prompts.js`
- `generator.prompts.js`
- `tutor.prompts.js`

---

### **PASO 5: Crear Sistema de Memoria**

**Archivo**: `src/agents/core/AgentMemory.js`

```javascript
/**
 * Sistema de memoria compartida entre agentes
 */
export class AgentMemory {
  constructor(maxSize = 100) {
    this.maxSize = maxSize
    this.shortTerm = [] // Última conversación
    this.longTerm = new Map() // Datos persistentes por usuario
    this.cache = new Map() // Cache de respuestas frecuentes
  }

  /**
   * Agregar a memoria a corto plazo
   */
  addToShortTerm(data) {
    this.shortTerm.push({
      timestamp: new Date(),
      ...data
    })

    if (this.shortTerm.length > this.maxSize) {
      this.shortTerm.shift()
    }
  }

  /**
   * Obtener contexto reciente
   */
  getRecentContext(count = 5) {
    return this.shortTerm.slice(-count)
  }

  /**
   * Guardar en memoria a largo plazo (por usuario)
   */
  saveToLongTerm(userId, key, value) {
    if (!this.longTerm.has(userId)) {
      this.longTerm.set(userId, new Map())
    }

    this.longTerm.get(userId).set(key, {
      value: value,
      timestamp: new Date()
    })
  }

  /**
   * Obtener de memoria a largo plazo
   */
  getFromLongTerm(userId, key) {
    if (!this.longTerm.has(userId)) return null

    const userData = this.longTerm.get(userId)
    return userData.get(key)?.value || null
  }

  /**
   * Cache de respuestas (para evitar llamadas duplicadas)
   */
  cacheResponse(key, response, ttl = 3600000) { // 1 hora default
    this.cache.set(key, {
      response: response,
      expiresAt: Date.now() + ttl
    })
  }

  /**
   * Obtener de cache
   */
  getFromCache(key) {
    const cached = this.cache.get(key)

    if (!cached) return null

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return cached.response
  }

  /**
   * Limpiar cache expirado
   */
  cleanExpiredCache() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Limpiar todo
   */
  clearAll() {
    this.shortTerm = []
    this.longTerm.clear()
    this.cache.clear()
  }
}
```

---

### **PASO 6: Crear AgentService (Servicio Principal)**

**Archivo**: `src/services/agentService.js`

```javascript
import { AgentOrchestrator } from '../agents/core/AgentOrchestrator.js'
import { AgentMemory } from '../agents/core/AgentMemory.js'

/**
 * Servicio principal para usar agentes en la aplicación
 */
class AgentService {
  constructor() {
    this.orchestrator = new AgentOrchestrator()
    this.memory = new AgentMemory()
    this.isInitialized = false
  }

  /**
   * Inicializar servicio
   */
  async initialize(apiKey) {
    if (this.isInitialized) return

    this.orchestrator = new AgentOrchestrator({ apiKey })
    this.isInitialized = true

    console.log('✅ AgentService inicializado')
  }

  /**
   * Procesar respuesta de actividad (caso de uso principal)
   */
  async checkActivityAnswer(activity, userAnswer, userId, options = {}) {
    // Verificar cache
    const cacheKey = `check_${activity.id}_${userAnswer}`
    const cached = this.memory.getFromCache(cacheKey)

    if (cached && !options.skipCache) {
      console.log('📦 Respuesta desde cache')
      return cached
    }

    // Procesar con orquestador
    const result = await this.orchestrator.processActivityAnswer(
      activity,
      userAnswer,
      {
        attemptNumber: options.attemptNumber || 1,
        userProfile: options.userProfile,
        evaluationCriteria: activity.scoring
      }
    )

    // Guardar en memoria del usuario
    this.memory.saveToLongTerm(userId, `activity_${activity.id}`, {
      answer: userAnswer,
      result: result,
      timestamp: new Date()
    })

    // Cache por 1 hora
    this.memory.cacheResponse(cacheKey, result, 3600000)

    return result
  }

  /**
   * Pedir ayuda a Eliana (Teacher Agent)
   */
  async askTeacher(question, context = {}, userId) {
    const result = await this.orchestrator.agents.teacher.answerQuestion(
      question,
      context
    )

    this.memory.addToShortTerm({
      type: 'teacher_interaction',
      userId: userId,
      question: question,
      answer: result.response.content
    })

    return result
  }

  /**
   * Traducir texto
   */
  async translate(text, targetLang, context = {}) {
    const cacheKey = `translate_${text}_${targetLang}`
    const cached = this.memory.getFromCache(cacheKey)

    if (cached) return cached

    const result = await this.orchestrator.agents.translator.translate(
      text,
      targetLang,
      context
    )

    this.memory.cacheResponse(cacheKey, result, 86400000) // 24 horas

    return result
  }

  /**
   * Generar ejemplos personalizados
   */
  async generateExamples(activity, count, userProfile) {
    return await this.orchestrator.agents.generator.generateExamples(
      activity,
      count,
      userProfile
    )
  }

  /**
   * Dar pista sin revelar respuesta
   */
  async getHint(activity, attemptNumber = 1) {
    return await this.orchestrator.agents.teacher.giveHint(
      activity,
      attemptNumber
    )
  }

  /**
   * Obtener plan de estudio personalizado
   */
  async getLearningPath(userId, userStats, completedActivities) {
    return await this.orchestrator.agents.tutor.analyzeLearningPath(
      userStats,
      completedActivities
    )
  }

  /**
   * Procesar solicitud general (detecta intención)
   */
  async processGeneral(userRequest, context = {}) {
    return await this.orchestrator.processRequest(userRequest, context)
  }

  /**
   * Obtener estadísticas de uso de agentes
   */
  getStats() {
    return {
      agents: this.orchestrator.getAllAgentsStats(),
      memory: {
        shortTermSize: this.memory.shortTerm.length,
        longTermUsers: this.memory.longTerm.size,
        cacheSize: this.memory.cache.size
      },
      taskHistory: this.orchestrator.taskHistory.length
    }
  }

  /**
   * Limpiar memoria
   */
  clearMemory() {
    this.orchestrator.clearAllMemories()
    this.memory.clearAll()
  }
}

// Exportar instancia singleton
export const agentService = new AgentService()
```

---

## 🔌 INTEGRACIÓN CON EL PROYECTO

### **Uso en componentes React**

```javascript
// En un componente de actividad
import { agentService } from '../services/agentService'

function ActivityComponent({ activity, userId }) {
  const [userAnswer, setUserAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheckAnswer = async () => {
    setLoading(true)

    try {
      const result = await agentService.checkActivityAnswer(
        activity,
        userAnswer,
        userId,
        {
          attemptNumber: 1,
          userProfile: { age: 25 }
        }
      )

      setResult(result)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTranslate = async () => {
    const translation = await agentService.translate(
      activity.question,
      'en',
      { activityType: activity.type }
    )

    console.log(translation)
  }

  const handleGetExamples = async () => {
    const examples = await agentService.generateExamples(
      activity,
      5,
      { age: 25, interests: ['sports', 'music'] }
    )

    console.log(examples)
  }

  return (
    <div>
      <h2>{activity.title}</h2>
      <p>{activity.question}</p>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />

      <button onClick={handleCheckAnswer} disabled={loading}>
        {loading ? 'Comprobando...' : 'Comprobar'}
      </button>

      <button onClick={handleTranslate}>Traducir</button>
      <button onClick={handleGetExamples}>Más ejemplos</button>

      {result && (
        <div>
          <h3>Corrección:</h3>
          <pre>{JSON.stringify(result.correction, null, 2)}</pre>

          <h3>Evaluación:</h3>
          <p>Puntuación: {result.finalScore}/10</p>

          <h3>Feedback:</h3>
          <p>{result.feedback.response.content}</p>
        </div>
      )}
    </div>
  )
}
```

---

## 📊 MONITOREO Y MÉTRICAS

### **Archivo**: `src/agents/utils/agentMetrics.js`

```javascript
export class AgentMetrics {
  constructor() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokensUsed: 0,
      avgResponseTime: 0,
      byAgent: {}
    }
  }

  recordRequest(agentName, success, tokensUsed, responseTime) {
    this.metrics.totalRequests++

    if (success) {
      this.metrics.successfulRequests++
    } else {
      this.metrics.failedRequests++
    }

    this.metrics.totalTokensUsed += tokensUsed || 0

    // Calcular promedio de tiempo de respuesta
    const n = this.metrics.totalRequests
    this.metrics.avgResponseTime =
      (this.metrics.avgResponseTime * (n - 1) + responseTime) / n

    // Por agente
    if (!this.metrics.byAgent[agentName]) {
      this.metrics.byAgent[agentName] = {
        requests: 0,
        successes: 0,
        failures: 0,
        tokens: 0
      }
    }

    const agentMetrics = this.metrics.byAgent[agentName]
    agentMetrics.requests++
    if (success) agentMetrics.successes++
    else agentMetrics.failures++
    agentMetrics.tokens += tokensUsed || 0
  }

  getReport() {
    return {
      ...this.metrics,
      successRate: (
        (this.metrics.successfulRequests / this.metrics.totalRequests) * 100
      ).toFixed(2) + '%',
      estimatedCost: (this.metrics.totalTokensUsed / 1000000 * 0.14).toFixed(4) // DeepSeek pricing
    }
  }
}
```

---

## ✅ RESUMEN FINAL

### **Has creado un sistema de agentes que incluye**:

✅ **8 agentes especializados**:
- CorrectorAgent (corrección)
- TranslatorAgent (traducción)
- TeacherAgent (enseñanza - Eliana)
- EvaluatorAgent (evaluación)
- GeneratorAgent (generación de contenido)
- TutorAgent (tutoría personalizada)
- CultureAgent (futuro)
- ConversationAgent (futuro)

✅ **AgentOrchestrator**: Coordina múltiples agentes
✅ **AgentMemory**: Sistema de memoria compartida
✅ **AgentService**: Servicio fácil de usar
✅ **Prompts especializados**: Por cada agente
✅ **Métricas y monitoreo**: Tracking de uso

### **Beneficios**:
- 🎯 Respuestas especializadas por tipo de tarea
- 🔄 Múltiples agentes trabajando juntos
- 💾 Memoria y contexto mantenido
- 📊 Métricas de uso
- ⚡ Cache para optimizar costos
- 🔧 Fácil de extender con nuevos agentes

**¿Quieres que implemente algún agente específico ahora?** 🚀
