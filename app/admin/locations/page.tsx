import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Plus, Pencil, MapPin } from "lucide-react" // MapPin icon
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
                <h1 className="text-2xl font-bold text-white">Locations</h1>
                <Button asChild className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
                    <Link href="/admin/locations/create">
                        <Plus className="w-4 h-4 mr-2" /> Add Location
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-white/5 text-neutral-400">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">City</th>
                            <th className="px-6 py-3 text-center">Active</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allLocations.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                                    No locations found. Add one to get started.
                                </td>
                            </tr>
                        ) : (
                            allLocations.map((location) => (
                                <tr key={location.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        {location.name}
                                        <div className="text-xs text-neutral-500 font-normal">{location.address}</div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-300">
                                        {location.city}, {location.state}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <form action={toggleLocationStatus.bind(null, location.id, location.is_active)}>
                                            <button className={`w-3 h-3 rounded-full ${location.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-neutral-600'}`} title={location.is_active ? "Deactivate" : "Activate"} />
                                        </form>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10" asChild>
                                                <Link href={`/admin/locations/${location.id}`}>
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <DeleteLocationButton id={location.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
