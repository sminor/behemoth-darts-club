import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, MapPin, Calendar, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const { count: announcementsCount } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true });

    const { count: locationsCount } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true });

    const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

    const { count: reportsCount } = await supabase
        .from('data_sources')
        .select('*', { count: 'exact', head: true });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">
                            Total Announcements
                        </CardTitle>
                        <Megaphone className="h-4 w-4 text-[var(--color-primary)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{announcementsCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">
                            Total Locations
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{locationsCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">
                            Total Events
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{eventsCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">
                            Club Reports
                        </CardTitle>
                        <FileText className="h-4 w-4 text-[var(--color-primary)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{reportsCount || 0}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
