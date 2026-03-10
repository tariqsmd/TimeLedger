import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
    IconBold, IconItalic, IconH1, IconH2, IconQuote,
    IconCode, IconOrderedList, IconBulletList
} from '../../assets/Icons';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const isActive = (type, opts) => editor.isActive(type, opts) ? 'is-active' : '';

    return (
        <div className="editor-menubar">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`menu-btn ${isActive('bold')}`}
                title="Bold"
            >
                <IconBold size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`menu-btn ${isActive('italic')}`}
                title="Italic"
            >
                <IconItalic size={16} />
            </button>
            <div className="divider"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`menu-btn ${isActive('heading', { level: 1 })}`}
                title="Heading 1"
            >
                <IconH1 size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`menu-btn ${isActive('heading', { level: 2 })}`}
                title="Heading 2"
            >
                <IconH2 size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`menu-btn ${isActive('bulletList')}`}
                title="Bullet List"
            >
                <IconBulletList size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`menu-btn ${isActive('orderedList')}`}
                title="Ordered List"
            >
                <IconOrderedList size={16} />
            </button>
            <div className="divider"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`menu-btn ${isActive('blockquote')}`}
                title="Quote"
            >
                <IconQuote size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`menu-btn ${isActive('codeBlock')}`}
                title="Code"
            >
                <IconCode size={16} />
            </button>
        </div>
    );
};

export default function RichEditor({ value, onChange, placeholder = 'Write details here...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'editor-content-area',
            },
        },
    });

    // Handle external updates
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only update if content is different to avoid cursor jumps
            // Check if current selection is empty or not involved to prevent jumping
            // Basic check: if editor is empty but value has something (initial load)
            // Or if value is NOT what editor has (reset)

            // To be safe against loop (Update -> OnChange -> Effect -> Update), 
            // we rely on strict inequality. 
            // Ideally we track 'isTyping'.

            // For now, this is standard pattern for controlled-ish TipTap
            if (Math.abs(editor.getHTML().length - value.length) > 5 || value === '') {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    return (
        <div className="rich-editor-container">
            <MenuBar editor={editor} />
            <div className="editor-scroll-area">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
