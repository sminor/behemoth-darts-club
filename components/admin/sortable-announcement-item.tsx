import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, Star, Pencil, Trash2, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteAnnouncement, toggleAnnouncementStatus, toggleAnnouncementFeatured } from "@/app/actions/announcements";
import DOMPurify from "isomorphic-dompurify";

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
        zIndex: isDragging ? 10 : 1, // Ensure dragged item is on top
        position: 'relative' as const,
    };

    // Strip tags for preview
    const stripDiv = typeof document !== 'undefined' ? document.createElement("div") : null;
    if (stripDiv) stripDiv.innerHTML = announcement.content;
    const rawText = stripDiv ? stripDiv.textContent || "" : announcement.content;

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group ${isDragging ? 'bg-white/5 opacity-50' : ''}`}
        >
            <td className="px-2 py-4 w-[40px]">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-2 text-neutral-500 hover:text-white cursor-grab active:cursor-grabbing touch-none"
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4" />
                </button>
            </td>
            <td className="px-6 py-4 text-center">
                <form action={toggleAnnouncementFeatured.bind(null, announcement.id, announcement.is_featured || false)}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 hover:bg-white/10 ${announcement.is_featured ? "text-yellow-400 fill-yellow-400 hover:text-yellow-300" : "text-neutral-600 hover:text-yellow-400/50"}`}
                        title={announcement.is_featured ? "Unfeature" : "Set as Featured"}
                    >
                        <Star className={`w-4 h-4 ${announcement.is_featured ? "fill-current" : ""}`} />
                    </Button>
                </form>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 rounded bg-white/5 border border-white/10 text-[var(--color-primary)] border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10">
                        <Megaphone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-white transition-colors group-hover:text-[var(--color-primary)]">
                                {announcement.title}
                            </span>
                        </div>
                        <div className="text-xs text-neutral-500 line-clamp-1">
                            {rawText}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    {/* Active Toggle */}
                    <form action={toggleAnnouncementStatus.bind(null, announcement.id, announcement.is_active)}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 hover:bg-white/10 ${announcement.is_active ? "text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" : "text-neutral-400 hover:text-white"}`}
                            title={announcement.is_active ? "Deactivate" : "Activate"}
                        >
                            {announcement.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                    </form>

                    {/* Edit */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10" asChild>
                        <Link href={`/admin/announcements/${announcement.id}`}>
                            <Pencil className="w-4 h-4" />
                        </Link>
                    </Button>

                    {/* Delete */}
                    <form
                        action={deleteAnnouncement.bind(null, announcement.id)}
                        onSubmit={(e) => {
                            if (!confirm("Are you sure?")) e.preventDefault();
                        }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-white hover:bg-white/10"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </td>
        </tr>
    );
}
