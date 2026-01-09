'use client';

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Calendar, MapPin, PartyPopper, Plane, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteEventButton } from "@/components/admin/delete-event-button";

export function EventsList({ events }: { events: any[] }) {
    const [showPassed, setShowPassed] = useState(false);

    // Filter Logic
    const filteredEvents = events.filter(event => {
        if (showPassed) return true;
        // Simple string comparison works if strict ISO, but let's be safe with dates
        // Parse date safely to avoid timezone issues (OFF-BY-ONE FIX)
        // new Date('2024-01-09') is UTC, which shows as previous day in PST.
        // We append T00:00:00 to force local time interpretation, or easier: split and compare strings.
        // Since we are comparing dates, string comparison 'YYYY-MM-DD' works perfectly for >=.
        // But to be robust against time components, we can parse parts.

        // Actually, simplest is just treating the DB date string as the source of truth.
        // If event.date is "2026-01-09", and today is 2026-01-09...
        const todayStr = new Date().toISOString().split('T')[0];
        return event.date >= todayStr;
    });

    // Helper for safe date display
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        // Create date object treating input as Local Time midnight (by appending time without Z)
        // This ensures it stays on the correct day regardless of browser timezone
        const date = new Date(`${dateStr}T00:00:00`);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Events</h1>
                    <p className="text-neutral-400 mt-1">Manage upcoming tournaments and special dates.</p>
                </div>
                <Button asChild className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold">
                    <Link href="/admin/events/create">
                        <Plus className="w-4 h-4 mr-2" /> New Event
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-400 hover:text-white transition-colors">
                    <input
                        type="checkbox"
                        checked={showPassed}
                        onChange={(e) => setShowPassed(e.target.checked)}
                        className="rounded bg-white/5 border-white/10 text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0"
                    />
                    Show past events
                </label>
            </div>

            <div className="rounded-md border border-white/10 bg-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-white/5 text-neutral-400">
                            <tr>
                                <th className="px-6 py-4">Event</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-neutral-500">
                                        No upcoming events found. {events.length > 0 && "Try showing past events."}
                                    </td>
                                </tr>
                            ) : (
                                filteredEvents.map((event: any) => {
                                    const isSpecial = event.type === 'special';
                                    const isTravel = event.type === 'travel';

                                    return (
                                        <tr key={event.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 p-1.5 rounded bg-white/5 border border-white/10 ${isSpecial ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' : ''} ${isTravel ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' : ''}`}>
                                                        {isSpecial ? <PartyPopper className="w-4 h-4" /> : isTravel ? <Plane className="w-4 h-4" /> : <Calendar className="w-4 h-4 text-neutral-400" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">
                                                            {event.title}
                                                        </div>
                                                        <div className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                                                            {event.description}
                                                        </div>
                                                        <div className="flex gap-2 mt-1.5">
                                                            {event.draw_type && <span className="text-[10px] text-neutral-400 border border-white/10 px-1.5 py-0.5 rounded">{event.draw_type}</span>}
                                                            {event.entry_fee && <span className="text-[10px] text-neutral-400 border border-white/10 px-1.5 py-0.5 rounded text-green-500/80 border-green-500/20">{event.entry_fee}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-white font-medium">
                                                        {formatDate(event.date)}
                                                    </span>
                                                    <span className="text-xs text-neutral-500">{event.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-neutral-300">
                                                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                                                    {event.locations?.name || event.venue_name || "Unknown"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10" asChild>
                                                        <Link href={`/admin/events/${event.id}`}>
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <DeleteEventButton id={event.id} title={event.title} />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
