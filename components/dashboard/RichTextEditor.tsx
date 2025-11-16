//components/dashboard/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';  // ✅ Con llaves
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';  // ✅ Con llaves
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  ListOrdered, 
  Heading2,
  Heading,
  Quote,
  Undo,
  Redo,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Escribe aquí...' 
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4',
          },
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary-dark',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[250px] px-4 py-3',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const setColor = () => {
    const color = window.prompt('Color (hex o nombre):', '#2C5F2D');
    if (color) {
      editor.chain().focus().setColor(color).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-3">
        {/* Fila 1: Formato de texto */}
        <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-gray-200">
          {/* Tamaños de letra */}
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'p') {
                editor.chain().focus().setParagraph().run();
              } else if (value === 'h1') {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              } else if (value === 'h2') {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              } else if (value === 'h3') {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              }
            }}
            className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 text-sm font-medium"
            title="Tamaño de letra"
          >
            <option value="p">Normal</option>
            <option value="h1">Grande</option>
            <option value="h2">Medio</option>
            <option value="h3">Pequeño</option>
          </select>

          {/* Fuentes */}
          <select
            onChange={(e) => {
              const font = e.target.value;
              if (font === 'default') {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(font).run();
              }
            }}
            className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 text-sm"
            title="Tipografía"
          >
            <option value="default">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="cursive">Cursiva</option>
          </select>

          <div className="w-px bg-gray-300 mx-1" />

          {/* Negrita */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Negrita (Ctrl+B)"
          >
            <Bold size={18} />
          </button>

          {/* Cursiva */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Cursiva (Ctrl+I)"
          >
            <Italic size={18} />
          </button>

          {/* Subrayado */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('underline') ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Subrayado (Ctrl+U)"
          >
            <UnderlineIcon size={18} />
          </button>

          <div className="w-px bg-gray-300 mx-1" />

          {/* Color de texto */}
          <button
            type="button"
            onClick={setColor}
            className="p-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
            title="Color de texto"
          >
            <Palette size={18} />
          </button>
        </div>

        {/* Fila 2: Alineación y listas */}
        <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-gray-200">
          {/* Alineación izquierda */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Alinear a la izquierda"
          >
            <AlignLeft size={18} />
          </button>

          {/* Alineación centro */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Alinear al centro"
          >
            <AlignCenter size={18} />
          </button>

          {/* Alineación derecha */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Alinear a la derecha"
          >
            <AlignRight size={18} />
          </button>

          <div className="w-px bg-gray-300 mx-1" />

          {/* Lista con viñetas */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Lista con viñetas"
          >
            <List size={18} />
          </button>

          {/* Lista numerada */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Lista numerada"
          >
            <ListOrdered size={18} />
          </button>

          <div className="w-px bg-gray-300 mx-1" />

          {/* Cita */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('blockquote') ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Cita"
          >
            <Quote size={18} />
          </button>

          {/* Enlace */}
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('link') ? 'bg-gray-300 text-primary' : ''
            }`}
            title="Agregar enlace"
          >
            <Link2 size={18} />
          </button>
        </div>

        {/* Fila 3: Deshacer/Rehacer */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Deshacer (Ctrl+Z)"
          >
            <Undo size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Rehacer (Ctrl+Y)"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Ayuda */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600">
        <strong>Atajos:</strong> Ctrl+B (negrita) | Ctrl+I (cursiva) | Ctrl+U (subrayado) | Enter (nuevo párrafo) | Shift+Enter (salto de línea)
      </div>
    </div>
  );
}