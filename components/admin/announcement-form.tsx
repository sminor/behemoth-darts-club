'use client'

import { Button } from "@/components/ui/button"
import { createAnnouncement, updateAnnouncement } from "@/app/actions/announcements"
import { RichTextEditor } from "./rich-text-editor";
import { useState } from "react";

// Basic Input component since we might not have one yet
function ensureInput() {
    // This is just a placeholder to remind me I might need to create an Input component
    // If it doesn't exist, I'll use standard input with classNames
}

type Announcement = {
    id: string
    title: string
    content: string
    display_order: number
    is_active: boolean
    is_featured?: boolean
}

// Standard label style reused across admin forms
const labelStyles = "block text-xs uppercase tracking-wider font-bold text-neutral-400 mb-1.5"

export function AnnouncementForm({ announcement }: { announcement?: Announcement }) {
    const isEditing = !!announcement
    // Local state for Rich Text Editor
    const [content, setContent] = useState(announcement?.content || "");

    return (
        <form action={isEditing ? updateAnnouncement.bind(null, announcement.id) : createAnnouncement} className="space-y-6 max-w-2xl mx-auto">
            {/* Hidden input to sync with Server Action */}
            <input type="hidden" name="content" value={content} />
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="title" className={labelStyles}>Title</label>
                    <input
                        id="title"
                        name="title"
                        defaultValue={announcement?.title}
                        required
                        className="flex h-10 w-full rounded-md border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="content" className={labelStyles}>Content</label>
                    <RichTextEditor
                        value={content}
                        onChange={setContent}
                    />
                </div>
            </div>

            {/* Hidden display_order input. We manage this via drag-and-drop. */}
            <input type="hidden" name="display_order" value={announcement?.display_order || 0} />

            <div className="space-y-4">

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                id="is_featured"
                                name="is_featured"
                                type="checkbox"
                                defaultChecked={announcement?.is_featured ?? false}
                                className="w-4 h-4 rounded border-white/10 bg-[#0A0A0A] text-yellow-500 focus:ring-yellow-500"
                            />
                            <span className="text-sm font-medium text-white">Featured (Highlight)</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                defaultChecked={announcement?.is_active ?? true}
                                className="w-4 h-4 rounded border-white/10 bg-[#0A0A0A] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                            <span className="text-sm font-medium text-white">Active (Visible on site)</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
                    {announcement ? 'Update Announcement' : 'Create Announcement'}
                </Button>
            </div>
        </form >
    )
}
