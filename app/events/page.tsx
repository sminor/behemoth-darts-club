import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { MOCK_EVENTS, MOCK_LOCATIONS } from '@/lib/mock-data';

export default function EventsPage() {

    // Helper to get location name
    const getLocationName = (id: string) => {
        const loc = MOCK_LOCATIONS.find(l => l.id === id);
        return loc ? loc.name : 'Unknown Location';
    };

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 pb-12 pt-8 sm:px-6 lg:px-8">

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <Button variant="ghost" className="mr-4" asChild>
                        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
                </div>

                <div className="space-y-4">
                    {MOCK_EVENTS.map((event) => (
                        <Card key={event.id} className="border-white/10 hover:bg-white/5 transition-colors">
                            <div className="flex flex-col md:flex-row">
                                {/* Date Box */}
                                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-[var(--color-primary)] text-white p-6 md:w-32 text-center">
                                    <div className="text-sm font-bold opacity-80 uppercase tracking-widest">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                    <div className="text-3xl font-extrabold">{new Date(event.date).getDate()}</div>
                                    <div className="text-sm opacity-80">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                </div>

                                <div className="flex-grow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                                                <div className="flex flex-wrap gap-4 text-sm text-neutral-300">
                                                    <div className="flex items-center">
                                                        <Clock className="mr-1 h-4 w-4 text-[var(--color-primary)]" />
                                                        {event.time}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin className="mr-1 h-4 w-4 text-[var(--color-primary)]" />
                                                        {getLocationName(event.locationId)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border
                                            ${event.type === 'tournament' ? 'border-amber-500 text-amber-500' :
                                                        event.type === 'league' ? 'border-blue-500 text-blue-500' :
                                                            'border-purple-500 text-purple-500'}`}>
                                                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-neutral-400">{event.description}</p>
                                    </CardContent>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
