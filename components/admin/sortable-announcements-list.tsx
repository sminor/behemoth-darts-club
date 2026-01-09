"use client";

import { useState, useEffect, useTransition } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableAnnouncementItem } from "./sortable-announcement-item";
import { updateAnnouncementsOrder } from "@/app/actions/announcements";

type Announcement = {
    id: string;
    title: string;
    content: string;
    display_order: number;
    is_active: boolean;
    is_featured?: boolean;
};

export function SortableAnnouncementsList({ initialAnnouncements }: { initialAnnouncements: Announcement[] }) {
    // Sort optimistic state by priority to be safe
    const [items, setItems] = useState(initialAnnouncements);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [isPending, startTransition] = useTransition();

    // Sync with server data if it changes externally (optional but good)
    useEffect(() => {
        setItems(initialAnnouncements);
    }, [initialAnnouncements]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            // Calculate new items based on current state
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);

            const newItems = arrayMove(items, oldIndex, newIndex);

            // Optimistic update
            setItems(newItems);

            // Calculate new display_order based on index
            const updates = newItems.map((item, index) => ({
                id: item.id,
                title: item.title,
                content: item.content,
                display_order: index
            }));

            // Sync with server
            startTransition(() => {
                updateAnnouncementsOrder(updates);
            });
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                    {items.map((announcement) => (
                        <SortableAnnouncementItem key={announcement.id} announcement={announcement} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
