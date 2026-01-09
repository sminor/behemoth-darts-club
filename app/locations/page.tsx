import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, ArrowLeft } from "lucide-react";
import { MOCK_LOCATIONS } from '@/lib/mock-data';
import { LocationImage } from "@/components/location-image";

export default function LocationsPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] px-4 pb-12 pt-8 sm:px-6 lg:px-8">

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <Button variant="ghost" className="mr-4" asChild>
                        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-white">Find a Location</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOCK_LOCATIONS.map((location) => (
                        <Card key={location.id} className="border-white/10 overflow-hidden hover:bg-white/5 transition-colors">
                            <div className="aspect-video w-full bg-neutral-800 relative">
                                <LocationImage src={location.imageUrl} alt={location.name} />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl text-[var(--color-primary)]">{location.name}</CardTitle>
                                <CardDescription className="flex items-start gap-2 mt-2">
                                    <MapPin className="h-4 w-4 mt-1 shrink-0" />
                                    {location.address}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-neutral-300">
                                    <span>Boards Available:</span>
                                    <span className="font-bold text-white">{location.boardCount}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="gap-2">
                                {location.websiteUrl && (
                                    <Button variant="outline" size="sm" className="w-full" asChild>
                                        <a href={location.websiteUrl} target="_blank" rel="noopener noreferrer">
                                            <Globe className="mr-2 h-4 w-4" />
                                            Website
                                        </a>
                                    </Button>
                                )}
                                <Button variant="default" size="sm" className="w-full" asChild>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noopener noreferrer">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Directions
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
