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
    const [items, setItems] = useState(initialAnnouncements);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setItems(initialAnnouncements);
    }, [initialAnnouncements]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);

            const updates = newItems.map((item, index) => ({
                id: item.id,
                title: item.title,
                content: item.content,
                display_order: index
            }));

            startTransition(() => {
                updateAnnouncementsOrder(updates);
            });
        }
    }

    return (
        <div className="rounded-md border border-white/10 bg-white/5 overflow-hidden">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <table className="w-full text-sm text-left table-fixed">
                        <thead className="text-xs uppercase bg-white/5 text-neutral-400">
                            <tr>
                                <th className="px-2 py-3 w-[40px]"></th>
                                <th className="px-6 py-3 w-28 text-center">Featured</th>
                                <th className="px-6 py-3">Announcement</th>
                                <th className="px-6 py-3 w-[140px] text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((announcement) => (
                                <SortableAnnouncementItem key={announcement.id} announcement={announcement} />
                            ))}
                        </tbody>
                    </table>
                </SortableContext>
            </DndContext>
        </div>
    );
}
