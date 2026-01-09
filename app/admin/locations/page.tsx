import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Plus, Pencil, Eye, EyeOff, Trophy, Target } from "lucide-react"
import { toggleLocationStatus } from "@/app/actions/locations"
import { DeleteLocationButton } from "@/components/admin/delete-location-button"

export const dynamic = 'force-dynamic'

export default async function AdminLocationsPage() {
    const { data: locations, error } = await supabase
        .from('locations')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching locations:', error)
    }

    const allLocations = locations || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Locations</h1>
                <Button asChild className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
                    <Link href="/admin/locations/create">
                        <Plus className="w-4 h-4 mr-2" /> New Location
                    </Link>
                </Button>
            </div>

            {allLocations.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 bg-white/5 rounded-lg border border-white/5">
                    No locations found. Add one to get started.
                </div>
            ) : (
                <div className="rounded-md border border-white/10 bg-white/5 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-white/5 text-neutral-400">
                            <tr>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">City</th>
                                <th className="px-6 py-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {allLocations.map((location) => (
                                <tr key={location.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white text-base">{location.name}</span>
                                            {location.is_new_location && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-neutral-400 mb-2">
                                            {location.address}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 bg-white/5 px-2 py-1 rounded border border-white/5">
                                                <Target className="w-3 h-3 text-[var(--color-primary)]" />
                                                <span>{location.board_count} {location.board_count === 1 ? 'Board' : 'Boards'}</span>
                                            </div>
                                            {location.is_league_venue && (
                                                <div className="flex items-center justify-center w-6 h-6 rounded bg-white/5 border border-white/5" title="League Venue">
                                                    <Trophy className="w-3 h-3 text-yellow-500" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-300">
                                        {location.city}, {location.state}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <form action={toggleLocationStatus.bind(null, location.id, location.is_active)}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-8 w-8 hover:bg-white/10 ${location.is_active ? "text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" : "text-neutral-400 hover:text-white"}`}
                                                    title={location.is_active ? "Deactivate" : "Activate"}
                                                >
                                                    {location.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </Button>
                                            </form>

                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10" asChild>
                                                <Link href={`/admin/locations/${location.id}`}>
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </Button>

                                            <DeleteLocationButton id={location.id} name={location.name} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
