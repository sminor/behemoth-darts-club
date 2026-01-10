import { supabase } from "@/lib/supabase"
import { LocationsMap } from "@/components/locations-map"
import Link from "next/link"
import { Metadata } from "next"
import { MapPin, ArrowLeft, Home } from "lucide-react"

export const metadata: Metadata = {
    title: 'Locations | Behemoth Darts Club',
    description: 'Find a dart board near you in the Portland metro area.',
}

// Force dynamic since we might add geo-based features or just to ensure fresh data
export const dynamic = 'force-dynamic'

export default async function LocationsPage() {
    const { data: locations, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

    if (error) {
        console.error("Error fetching locations:", error)
    }

    const activeLocations = locations || []

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="w-[100px] flex justify-start">
                        <Link href="/" className="hover:text-white transition-colors group">
                            <Home className="w-5 h-5 text-[var(--color-primary)] opacity-80 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wider uppercase">
                        Our <span className="text-[var(--color-primary)]">Locations</span>
                    </h1>
                    <div className="w-[100px] flex justify-end">
                        <MapPin className="w-5 h-5 text-[var(--color-primary)] opacity-80" />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <p className="text-neutral-400">
                        With {activeLocations.length} locations around the Portland metro area, Behemoth Darts Club offers convenient spots for you to join the excitement of dart games, leagues, and tournaments.
                        <br />
                        <span className="text-[var(--color-primary)]">Click on a location to explore more!</span>
                    </p>
                </div>

                <LocationsMap locations={activeLocations} />
            </main>

            <footer className="border-t border-white/10 py-8 mt-12 bg-black/20">
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                    <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} Behemoth Darts Club</p>
                </div>
            </footer>
        </div>
    )
}
