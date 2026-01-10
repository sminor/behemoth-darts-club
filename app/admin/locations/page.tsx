import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Plus, Eye, EyeOff, MapPin, Edit } from "lucide-react"
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
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Locations</h1>
                    <p className="text-neutral-400 mt-1">Manage venue locations and details.</p>
                </div>
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
                                <th className="px-6 py-3"></th>
                                <th className="px-6 py-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {allLocations.map((location) => (
                                <tr key={location.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 rounded bg-white/5 border border-white/10 text-[var(--color-primary)] border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="font-bold text-white transition-colors group-hover:text-[var(--color-primary)]">
                                                        {location.name}
                                                    </div>
                                                    {location.is_new_location && (
                                                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-600 text-white border border-red-500/20 shadow-sm">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                                                    {location.address}, {location.city}, {location.state}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-neutral-300 font-medium">
                                            {location.board_count} {location.board_count === 1 ? 'Board' : 'Boards'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
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
                                                    <Edit className="w-4 h-4" />
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
