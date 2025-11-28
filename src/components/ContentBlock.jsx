// ========================================
// BLOQUE DE CONTENIDO MODULAR
// ========================================
// Componente que renderiza diferentes tipos de bloques de contenido

import {
  X,
  GripVertical,
  BookText,
  BookOpen,
  Headphones,
  HelpCircle,
  FileEdit,
  Link,
  ListOrdered,
  MessageCircle,
  Image as ImageIcon,
  Quote,
  Puzzle,
  Library,
  MousePointer,
  ArrowLeftRight,
  FileQuestion,
  PenTool
} from 'lucide-react';
import { CONTENT_BLOCK_TYPES } from '../config/database';
import './ContentBlock.css';

// Mapping de nombres de iconos a componentes Lucide
const ICON_MAP = {
  BookText,
  BookOpen,
  Headphones,
  HelpCircle,
  FileEdit,
  Link,
  ListOrdered,
  MessageCircle,
  Image: ImageIcon,
  Quote,
  Puzzle,
  Library,
  MousePointer,
  ArrowLeftRight,
  FileQuestion,
  PenTool
};

const ContentBlock = ({ block, index, onUpdate, onDelete }) => {
  const blockType = CONTENT_BLOCK_TYPES[block.type];

  const handleFieldChange = (fieldName, value) => {
    onUpdate(index, {
      ...block,
      data: {
        ...block.data,
        [fieldName]: value
      }
    });
  };

  const renderFields = () => {
    switch (block.type) {
      case 'vocabulary_words':
        return (
          <>
            <div className="block-field">
              <label>Palabras (una por línea)</label>
              <textarea
                value={block.data.words || ''}
                onChange={(e) => handleFieldChange('words', e.target.value)}
                placeholder="family&#10;father&#10;mother&#10;brother"
                rows="6"
              />
            </div>
            <div className="block-field">
              <label>Categoría (opcional)</label>
              <input
                type="text"
                value={block.data.category || ''}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                placeholder="Ej: familia, animales, etc."
              />
            </div>
          </>
        );

      case 'reading_text':
        return (
          <>
            <div className="block-field">
              <label>Título del texto (opcional)</label>
              <input
                type="text"
                value={block.data.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Título del texto"
              />
            </div>
            <div className="block-field">
              <label>Texto de lectura</label>
              <textarea
                value={block.data.text || ''}
                onChange={(e) => handleFieldChange('text', e.target.value)}
                placeholder="Añade el texto completo de lectura..."
                rows="10"
              />
            </div>
          </>
        );

      case 'audio_transcribed':
        return (
          <>
            <div className="block-field">
              <label>URL del audio</label>
              <input
                type="url"
                value={block.data.audio_url || ''}
                onChange={(e) => handleFieldChange('audio_url', e.target.value)}
                placeholder="https://ejemplo.com/audio.mp3"
              />
            </div>
            <div className="block-field">
              <label>Transcripción del audio</label>
              <textarea
                value={block.data.transcription || ''}
                onChange={(e) => handleFieldChange('transcription', e.target.value)}
                placeholder="Transcribe el audio aquí..."
                rows="8"
              />
            </div>
          </>
        );

      case 'closed_questions':
        return (
          <div className="block-field">
            <label>Preguntas cerradas (formato JSON)</label>
            <textarea
              value={block.data.questions_list || ''}
              onChange={(e) => handleFieldChange('questions_list', e.target.value)}
              placeholder='[{"question": "¿Cómo se dice father?", "options": ["padre", "madre"], "correct": "padre"}]'
              rows="8"
            />
            <small className="field-hint">Una pregunta por línea en formato JSON</small>
          </div>
        );

      case 'fill_blank_text':
        return (
          <>
            <div className="block-field">
              <label>Texto con huecos (usa ___ para los espacios en blanco)</label>
              <textarea
                value={block.data.text_with_blanks || ''}
                onChange={(e) => handleFieldChange('text_with_blanks', e.target.value)}
                placeholder="Yo ___ español. Tú ___ inglés."
                rows="6"
              />
            </div>
            <div className="block-field">
              <label>Respuestas correctas (una por línea, en orden)</label>
              <textarea
                value={block.data.answers || ''}
                onChange={(e) => handleFieldChange('answers', e.target.value)}
                placeholder="hablo&#10;hablas"
                rows="4"
              />
            </div>
          </>
        );

      case 'matching_text':
        return (
          <>
            <div className="block-field">
              <label>Columna A (una por línea)</label>
              <textarea
                value={block.data.column_a || ''}
                onChange={(e) => handleFieldChange('column_a', e.target.value)}
                placeholder="padre&#10;madre&#10;hermano"
                rows="6"
              />
            </div>
            <div className="block-field">
              <label>Columna B (una por línea, en el orden correspondiente)</label>
              <textarea
                value={block.data.column_b || ''}
                onChange={(e) => handleFieldChange('column_b', e.target.value)}
                placeholder="father&#10;mother&#10;brother"
                rows="6"
              />
            </div>
          </>
        );

      case 'ordering_text':
        return (
          <>
            <div className="block-field">
              <label>Elementos para ordenar (una por línea, en orden desordenado)</label>
              <textarea
                value={block.data.items_to_order || ''}
                onChange={(e) => handleFieldChange('items_to_order', e.target.value)}
                placeholder="voy&#10;al&#10;yo&#10;cine"
                rows="6"
              />
            </div>
            <div className="block-field">
              <label>Orden correcto (números separados por comas: 3,1,4,2)</label>
              <input
                type="text"
                value={block.data.correct_order || ''}
                onChange={(e) => handleFieldChange('correct_order', e.target.value)}
                placeholder="3,1,4,2"
              />
            </div>
          </>
        );

      case 'speaking_situations':
        return (
          <>
            <div className="block-field">
              <label>Situaciones para hablar (una por línea)</label>
              <textarea
                value={block.data.situations || ''}
                onChange={(e) => handleFieldChange('situations', e.target.value)}
                placeholder="En el restaurante&#10;En el aeropuerto&#10;En una tienda"
                rows="6"
              />
            </div>
            <div className="block-field">
              <label>Preguntas/Prompts opcionales (una por línea)</label>
              <textarea
                value={block.data.prompts || ''}
                onChange={(e) => handleFieldChange('prompts', e.target.value)}
                placeholder="¿Qué dirías para pedir la cuenta?&#10;¿Cómo pedirías ayuda?"
                rows="4"
              />
            </div>
          </>
        );

      case 'image':
        return (
          <>
            <div className="block-field">
              <label>URL de la imagen</label>
              <input
                type="url"
                value={block.data.image_url || ''}
                onChange={(e) => handleFieldChange('image_url', e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div className="block-field">
              <label>Texto alternativo (alt)</label>
              <input
                type="text"
                value={block.data.alt_text || ''}
                onChange={(e) => handleFieldChange('alt_text', e.target.value)}
                placeholder="Descripción de la imagen"
              />
            </div>
            <div className="block-field">
              <label>Pie de foto (opcional)</label>
              <input
                type="text"
                value={block.data.caption || ''}
                onChange={(e) => handleFieldChange('caption', e.target.value)}
                placeholder="Texto que aparece debajo de la imagen"
              />
            </div>
          </>
        );

      case 'phrases':
        return (
          <>
            <div className="block-field">
              <label>Frases (una por línea)</label>
              <textarea
                value={block.data.phrases_list || ''}
                onChange={(e) => handleFieldChange('phrases_list', e.target.value)}
                placeholder="Buenos días&#10;¿Cómo estás?&#10;Mucho gusto"
                rows="8"
              />
            </div>
            <div className="block-field">
              <label>Contexto (opcional)</label>
              <input
                type="text"
                value={block.data.context || ''}
                onChange={(e) => handleFieldChange('context', e.target.value)}
                placeholder="Ej: Saludos formales, expresiones cotidianas"
              />
            </div>
          </>
        );

      case 'words_to_create_phrases':
        return (
          <>
            <div className="block-field">
              <label>Palabras para crear frases (una por línea)</label>
              <textarea
                value={block.data.words_list || ''}
                onChange={(e) => handleFieldChange('words_list', e.target.value)}
                placeholder="yo&#10;tú&#10;comer&#10;estudiar&#10;español"
                rows="6"
              />
            </div>
            <div className="block-field">
              <label>Instrucciones</label>
              <textarea
                value={block.data.instructions || ''}
                onChange={(e) => handleFieldChange('instructions', e.target.value)}
                placeholder="Crea frases coherentes usando estas palabras..."
                rows="3"
              />
            </div>
          </>
        );

      case 'vocabulary':
        return (
          <>
            <div className="block-field">
              <label>Lista de vocabulario (palabra = definición, una por línea)</label>
              <textarea
                value={block.data.vocab_list || ''}
                onChange={(e) => handleFieldChange('vocab_list', e.target.value)}
                placeholder="padre = father&#10;madre = mother&#10;hermano = brother"
                rows="10"
              />
            </div>
            <div className="block-field">
              <label>Definiciones adicionales (opcional)</label>
              <textarea
                value={block.data.definitions || ''}
                onChange={(e) => handleFieldChange('definitions', e.target.value)}
                placeholder="Contexto o explicaciones adicionales..."
                rows="4"
              />
            </div>
          </>
        );

      case 'image_to_point':
        return (
          <>
            <div className="block-field">
              <label>URL de la imagen</label>
              <input
                type="url"
                value={block.data.image_url || ''}
                onChange={(e) => handleFieldChange('image_url', e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div className="block-field">
              <label>Puntos a señalar (formato: x,y,label - uno por línea)</label>
              <textarea
                value={block.data.points || ''}
                onChange={(e) => handleFieldChange('points', e.target.value)}
                placeholder="100,50,cabeza&#10;100,150,brazo&#10;100,300,pierna"
                rows="6"
              />
            </div>
            <div className="block-field">
              <label>Etiquetas (una por línea, orden correspondiente)</label>
              <textarea
                value={block.data.labels || ''}
                onChange={(e) => handleFieldChange('labels', e.target.value)}
                placeholder="cabeza&#10;brazo&#10;pierna"
                rows="4"
              />
            </div>
          </>
        );

      case 'vocabulary_matching':
        return (
          <>
            <div className="block-field">
              <label>Palabras de vocabulario (una por línea)</label>
              <textarea
                value={block.data.vocab_words || ''}
                onChange={(e) => handleFieldChange('vocab_words', e.target.value)}
                placeholder="padre&#10;madre&#10;hermano"
                rows="6"
              />
            </div>
            <div className="block-field">
              <label>Definiciones para relacionar (una por línea, en orden correspondiente)</label>
              <textarea
                value={block.data.definitions_to_match || ''}
                onChange={(e) => handleFieldChange('definitions_to_match', e.target.value)}
                placeholder="father&#10;mother&#10;brother"
                rows="6"
              />
            </div>
          </>
        );

      case 'open_questions_text':
        return (
          <>
            <div className="block-field">
              <label>Texto base</label>
              <textarea
                value={block.data.text || ''}
                onChange={(e) => handleFieldChange('text', e.target.value)}
                placeholder="Texto sobre el que se basarán las preguntas..."
                rows="8"
              />
            </div>
            <div className="block-field">
              <label>Preguntas abiertas (una por línea)</label>
              <textarea
                value={block.data.questions_list || ''}
                onChange={(e) => handleFieldChange('questions_list', e.target.value)}
                placeholder="¿Qué opinas sobre...?&#10;¿Por qué crees que...?"
                rows="6"
              />
            </div>
          </>
        );

      case 'writing_text':
        return (
          <>
            <div className="block-field">
              <label>Tema/Prompt de escritura</label>
              <textarea
                value={block.data.prompt || ''}
                onChange={(e) => handleFieldChange('prompt', e.target.value)}
                placeholder="Escribe sobre tu familia..."
                rows="3"
              />
            </div>
            <div className="block-field">
              <label>Guía/Estructura</label>
              <textarea
                value={block.data.guidelines || ''}
                onChange={(e) => handleFieldChange('guidelines', e.target.value)}
                placeholder="Incluye: nombres, edades, profesiones..."
                rows="4"
              />
            </div>
            <div className="block-field">
              <label>Número de palabras sugerido</label>
              <input
                type="number"
                value={block.data.word_count || ''}
                onChange={(e) => handleFieldChange('word_count', e.target.value)}
                placeholder="50"
                min="10"
              />
            </div>
          </>
        );

      default:
        return <p className="no-fields">No hay campos definidos para este tipo de bloque.</p>;
    }
  };

  // Obtener el componente de icono
  const IconComponent = ICON_MAP[blockType.icon];

  return (
    <div className="content-block">
      <div className="block-header">
        <div className="block-title">
          <GripVertical className="drag-handle" size={20} />
          {IconComponent && <IconComponent className="block-icon" size={24} />}
          <span className="block-name">{blockType.name}</span>
          <span className="block-number">#{index + 1}</span>
        </div>
        <button
          type="button"
          className="btn-delete-block"
          onClick={() => onDelete(index)}
          title="Eliminar bloque"
        >
          <X size={18} />
        </button>
      </div>
      <div className="block-content">
        {renderFields()}
      </div>
    </div>
  );
};

export default ContentBlock;
