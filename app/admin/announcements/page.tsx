import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SortableAnnouncementsList } from "@/components/admin/sortable-announcements-list";

export const dynamic = 'force-dynamic'

export default async function AnnouncementsPage() {
    const { data: announcements, error } = await supabase
        .from('announcements')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false }); // Strictly order by display_order for DnD list

    // We filter featured out of the sortable list if we want them separate, OR include them.
    // User requirement: "In the admin page, we could have these dragable."
    // If we mix Featured and Non-Featured, dragging might interact weirdly if we want Featured to always be top.
    // However, user said "Featured" is a special section. 
    // Usually, you might want to pin Featured to top. 
    // For simplicity, let's treat Featured as a flag, but Priority as the Master Sort Order.
    // So you can have a high priority item that IS NOT featured, appearing high in the list.

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Announcements</h1>
                    <p className="text-neutral-400 mt-1">Manage site announcements and news.</p>
                </div>
                <Button asChild className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
                    <Link href="/admin/announcements/create">
                        <Plus className="mr-2 h-4 w-4" />
                        New Announcement
                    </Link>
                </Button>
            </div>

            {(!announcements || announcements.length === 0) ? (
                <div className="text-center py-12 text-neutral-500 bg-white/5 rounded-lg border border-white/5">
                    No announcements found. Create one to get started.
                </div>
            ) : (
                <SortableAnnouncementsList initialAnnouncements={announcements} />
            )}
        </div>
    );
}
