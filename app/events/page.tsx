import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft, Trophy, Plane, Ticket, Star, PartyPopper } from "lucide-react";
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {

    // Fetch Events
    const { data: eventsData } = await supabase
        .from('events')
        .select(`
            *,
            locations (
                name,
                city,
                state
            )
        `)
        .order('date', { ascending: true });

    // Helper to safely parse YYYY-MM-DD to a Date object that respects the day (Local Midnight)
    const parseDate = (dateStr: string) => {
        if (!dateStr) return new Date();
        return new Date(`${dateStr}T00:00:00`);
    };

    const rawEvents = eventsData || [];

    // Helper to format event for UI (snake_case DB -> props) in a consistent way
    // Also attach location details logic here
    const processedEvents = rawEvents.map(event => {
        let locationName = 'Unknown Location';
        let locationAddress = '';
        let isTravel = event.type === 'travel';

        if (event.locations) {
            locationName = event.locations.name;
            locationAddress = `${event.locations.city}, ${event.locations.state}`;
        } else if (event.venue_name) {
            locationName = event.venue_name;
            locationAddress = event.venue_address || '';
            if (event.type === 'travel') isTravel = true; // redundancy check
        }

        return {
            ...event,
            locationName,
            locationAddress,
            isTravel,
            // Map DB snake_case fields that were camelCase in mock
            entryFee: event.entry_fee,
            gameFormat: event.game_format,
            drawType: event.draw_type,
            venueName: event.venue_name, // keep for ref
        };
    });

    // 1. Identify "Next Up" event (First in the sorted list, effectively)
    // Supabase query is already sorted, but let's filter for future only?
    // User requested "Next Upcoming".
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    // Filter out past events
    // Filter out past events
    // Use ISO string comparison for date filtering to be timezone-agnostic relative to "Today"
    // We want to show events that are >= Today (local date)
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

    const futureEvents = processedEvents.filter(e => {
        return e.date >= todayStr;
    });

    const nextEvent = futureEvents.length > 0 ? futureEvents[0] : null;

    // 2. Remaining events (excluding nextEvent)
    const listEvents = futureEvents.length > 0 ? futureEvents.slice(1) : [];

    // 3. Group by Month Year
    const groupedEvents = listEvents.reduce((acc, event) => {
        const date = parseDate(event.date); // Safe parse
        const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(event);
        return acc;
    }, {} as Record<string, typeof listEvents>);

    const sortedMonths = Object.keys(groupedEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
        <main className="min-h-screen bg-[var(--background)] pb-24">

            {/* Sticky Header */}
            <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-20 mb-8">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-xl font-bold text-white tracking-wider uppercase flex items-center gap-2">
                        Upcoming <span className="text-[var(--color-primary)]">Events</span>
                    </h1>
                    <div className="w-[100px] flex justify-end">
                        <Trophy className="w-5 h-5 text-[var(--color-primary)] opacity-80" />
                    </div>
                </div>
            </header>

            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                    <p className="text-neutral-400">
                        Whether you're a seasoned player or just starting out, our tournaments are the perfect opportunity to compete and have fun!
                        <br />
                        <span className="text-[var(--color-primary)]">Open to all skill levels.</span>
                    </p>
                </div>

                {/* Next Up Hero */}
                {nextEvent && (
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className={`relative overflow-hidden rounded-2xl border ${nextEvent.type === 'special' ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/20' : 'border-[var(--color-primary)]/30 bg-gradient-to-br from-[var(--color-primary)]/20'} to-neutral-900/50 p-8 md:p-12 shadow-2xl transition-all duration-500`}>
                            {/* Background Deco */}
                            <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 ${nextEvent.type === 'special' ? 'bg-amber-500' : 'bg-[var(--color-primary)]'} opacity-10 blur-3xl rounded-full pointer-events-none`}></div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                                <div className="space-y-6 max-w-2xl w-full">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 ${nextEvent.type === 'special' ? 'bg-amber-500 text-black' : 'bg-[var(--color-primary)] text-white'} text-xs font-bold uppercase tracking-widest rounded-full`}>
                                        {nextEvent.type === 'special' ? <PartyPopper className="w-3 h-3" /> : <Star className="w-3 h-3 fill-current" />}
                                        Next Up
                                    </div>

                                    <div>
                                        <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
                                            {nextEvent.title}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-6 text-lg text-neutral-200 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar className={`w-5 h-5 ${nextEvent.type === 'special' ? 'text-amber-500' : 'text-[var(--color-primary)]'}`} />
                                                {parseDate(nextEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className={`w-5 h-5 ${nextEvent.type === 'special' ? 'text-amber-500' : 'text-[var(--color-primary)]'}`} />
                                                {nextEvent.time}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className={`w-5 h-5 ${nextEvent.type === 'special' ? 'text-amber-500' : 'text-[var(--color-primary)]'}`} />
                                                {nextEvent.locationName}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-4">
                                        <div className="bg-black/20 rounded p-3 text-center sm:text-left">
                                            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Entry Fee</div>
                                            <div className="font-bold text-white">{nextEvent.entryFee}</div>
                                        </div>
                                        <div className="bg-black/20 rounded p-3 text-center sm:text-left">
                                            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Format</div>
                                            <div className="font-bold text-white">{nextEvent.gameFormat}</div>
                                        </div>
                                        <div className="bg-black/20 rounded p-3 text-center sm:text-left">
                                            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Type</div>
                                            <div className="font-bold text-white">{nextEvent.drawType}</div>
                                        </div>
                                    </div>

                                    <p className="text-neutral-300 text-lg leading-relaxed pt-2">
                                        {nextEvent.description}
                                    </p>
                                </div>

                                {/* Date Badge Big */}
                                <div className="hidden md:flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-w-[140px] text-center shadow-lg transform rotate-2">
                                    <span className={`text-xl font-medium uppercase tracking-widest ${nextEvent.type === 'special' ? 'text-amber-500' : 'text-[var(--color-primary)]'}`}>{parseDate(nextEvent.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                    <span className="text-6xl font-black text-white leading-none my-2">{parseDate(nextEvent.date).getDate()}</span>
                                    <span className="text-neutral-400">{parseDate(nextEvent.date).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Monthly Listings */}
                <div className="max-w-6xl mx-auto space-y-16">
                    {sortedMonths.map(month => (
                        <section key={month} className="relative">
                            {/* Sticky Month Header */}
                            <div className="sticky top-0 z-20 bg-[var(--background)]/95 backdrop-blur-md py-4 border-b border-white/10 mb-6 flex items-baseline gap-4">
                                <h2 className="text-2xl font-bold text-white">{month}</h2>
                                <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">{groupedEvents[month].length} Events</span>
                            </div>

                            <div className="grid gap-4">
                                {groupedEvents[month]
                                    .map((event: any) => {
                                        const dateObj = parseDate(event.date);

                                        return (
                                            <Card key={event.id} className={`group border-white/5 bg-white/[0.02] hover:bg-white/[0.06] transition-all overflow-hidden ${event.type === 'special' ? 'hover:border-amber-500/50' : 'hover:border-[var(--color-primary)]/30'}`}>
                                                <div className="flex flex-row items-stretch">
                                                    {/* Left: Date */}
                                                    <div className={`flex-none w-20 sm:w-24 bg-white/5 transition-colors flex flex-col items-center justify-center p-2 border-r border-white/5 ${event.type === 'special' ? 'group-hover:bg-amber-500/20' : 'group-hover:bg-[var(--color-primary)]/20'}`}>
                                                        <span className={`text-xs font-bold uppercase text-neutral-500 ${event.type === 'special' ? 'group-hover:text-amber-500' : 'group-hover:text-[var(--color-primary)]'}`}>{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                        <span className="text-2xl sm:text-3xl font-black text-white my-1">{dateObj.getDate()}</span>
                                                        <span className="text-xs font-medium text-neutral-400 group-hover:text-white/80">{event.time}</span>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-grow p-4 sm:p-6 flex flex-col gap-4">
                                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                            <div className="space-y-1.5 flex-grow">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    {/* Type Badges */}
                                                                    {event.type === 'special' && (
                                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                                                                            <PartyPopper className="w-3 h-3 mr-1" /> Special
                                                                        </span>
                                                                    )}
                                                                    {event.isTravel && (
                                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                                                                            <Plane className="w-3 h-3 mr-1" /> Travel
                                                                        </span>
                                                                    )}
                                                                    {event.type === 'local' && (
                                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-700 text-neutral-300 border border-neutral-600 uppercase tracking-wider">
                                                                            Local
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <h3 className={`text-lg sm:text-xl font-bold text-white transition-colors ${event.type === 'special' ? 'group-hover:text-amber-500' : 'group-hover:text-[var(--color-primary)]'}`}>
                                                                    {event.title}
                                                                </h3>
                                                                <div className="flex items-center text-sm text-neutral-400 gap-2">
                                                                    <MapPin className="w-4 h-4 text-neutral-500" />
                                                                    <span>{event.locationName}</span>
                                                                    {event.locationAddress && (
                                                                        <>
                                                                            <span className="text-neutral-600">•</span>
                                                                            <span className="text-neutral-500 hidden sm:inline">{event.locationAddress}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Details Grid (Right side on desktop) */}
                                                            <div className="flex-none grid grid-cols-2 sm:grid-cols-1 gap-x-8 gap-y-1 text-right text-sm">
                                                                <div>
                                                                    <span className="text-neutral-500 text-xs uppercase tracking-wide mr-2">Entry</span>
                                                                    <span className="font-bold text-white">{event.entryFee}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-neutral-500 text-xs uppercase tracking-wide mr-2">Format</span>
                                                                    <span className="font-medium text-neutral-300">{event.gameFormat}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-neutral-500 text-xs uppercase tracking-wide mr-2">Type</span>
                                                                    <span className="font-medium text-neutral-300">{event.drawType}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-neutral-300 pt-1 border-t border-white/5 mt-2 pt-3">{event.description}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })}
                            </div>
                        </section>
                    ))}
                </div>

            </div>
        </main>
    );
}

