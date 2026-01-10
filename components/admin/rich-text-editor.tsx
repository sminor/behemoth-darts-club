"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import to avoid SSR issues with Quill
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const modules = useMemo(() => ({
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    }), []);

    return (
        <div className={`mb-12 ${className} flex flex-col rounded-md border border-white/10 transition-all focus-within:border-transparent focus-within:ring-1 focus-within:ring-[var(--color-primary)]`}>
            <style jsx global>{`
                .ql-toolbar.ql-snow {
                    border: none !important;
                    background: #0A0A0A;
                    border-top-left-radius: 0.375rem;
                    border-top-right-radius: 0.375rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
                .ql-container.ql-snow {
                    border: none !important;
                    background: #0A0A0A;
                    color: white;
                    font-family: inherit;
                    border-bottom-left-radius: 0.375rem;
                    border-bottom-right-radius: 0.375rem;
                }
                .ql-editor {
                    min-height: 150px;
                    font-family: inherit;
                    font-size: 0.875rem; /* text-sm */
                    padding: 0.75rem; /* Roughly match px-3 py-2 + extra for editor feel */
                }
                .ql-editor.ql-blank::before {
                    color: #a3a3a3 !important; /* text-neutral-400 */
                    font-style: normal;
                    font-size: 0.875rem;
                    left: 0.75rem;
                }
                /* Icon colors */
                .ql-snow .ql-stroke {
                    stroke: #a3a3a3 !important;
                }
                .ql-snow .ql-fill {
                    fill: #a3a3a3 !important;
                }
                /* Hover/Active states */
                .ql-snow .ql-picker-label:hover {
                    color: var(--color-primary) !important;
                }
                .ql-snow button:hover .ql-stroke {
                    stroke: var(--color-primary) !important;
                }
             `}</style>
            {/* text-sm ensures 14px font size to match site inputs */}
            <div className="text-sm font-sans rounded-md overflow-hidden">
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    className="h-full"
                />
            </div>
        </div>
    );
}
