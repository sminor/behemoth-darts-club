"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnnouncementItem } from "./announcement-item";
import { GripVertical } from "lucide-react";

type Announcement = {
    id: string;
    title: string;
    content: string;
    display_order: number;
    is_active: boolean;
    is_featured?: boolean;
};

export function SortableAnnouncementItem({ announcement }: { announcement: Announcement }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: announcement.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">

            {/* Drag Handle - Absolutely positioned or flex? Let's try flex wrapper if needed, 
          but AnnouncementItem is a Card. Let's start with a handle to the left. */}

            <div className="flex items-start gap-2">
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-8 p-1 text-neutral-500 hover:text-white cursor-grab active:cursor-grabbing touch-none"
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="w-5 h-5" />
                </button>

                <div className="flex-1 min-w-0">
                    <AnnouncementItem announcement={announcement} />
                </div>
            </div>
        </div>
    );
}
