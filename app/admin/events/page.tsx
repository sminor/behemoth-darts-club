import { supabase } from "@/lib/supabase";
import { EventsList } from "@/components/admin/events-list";

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
    const { data: events, error } = await supabase
        .from('events')
        .select(`
            *,
            locations (
                name
            )
        `)
        .order('date', { ascending: true }); // We sort ascending (oldest to newest)

    if (error) {
        console.error("Error fetching events:", error);
    }

    const allEvents = events || [];

    return <EventsList events={allEvents} />;
}

