'use client'

import { Button } from "@/components/ui/button"
import { createLocation, updateLocation, type Location } from "@/app/actions/locations"

const labelStyles = "block text-xs uppercase tracking-wider font-bold text-neutral-400 mb-1.5"

export function LocationForm({ location }: { location?: Location }) {
    const isEditing = !!location

    return (
        <form action={isEditing ? updateLocation.bind(null, location.id) : createLocation} className="space-y-8 max-w-2xl mx-auto">

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Location Information</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className={labelStyles}>Location Name</label>
                        <input
                            id="name"
                            name="name"
                            defaultValue={location?.name}
                            required
                            className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="address" className={labelStyles}>Street Address</label>
                        <input
                            id="address"
                            name="address"
                            defaultValue={location?.address}
                            required
                            className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="city" className={labelStyles}>City</label>
                        <input
                            id="city"
                            name="city"
                            defaultValue={location?.city}
                            required
                            className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="state" className={labelStyles}>State</label>
                            <input
                                id="state"
                                name="state"
                                defaultValue={location?.state || 'OR'}
                                required
                                className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="zip" className={labelStyles}>Zip</label>
                            <input
                                id="zip"
                                name="zip"
                                defaultValue={location?.zip}
                                required
                                className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Coordinates (Map)</h3>

                <div className="space-y-2">
                    <label htmlFor="coordinates" className={labelStyles}>Coordinates</label>
                    <input
                        id="coordinates"
                        name="coordinates"
                        defaultValue={location?.coordinates}
                        placeholder="e.g. 45.523914, -123.039457"
                        required
                        className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    <p className="text-[10px] text-neutral-500">
                        Right-click a location in Google Maps and copy the coordinates (e.g. &quot;45.523, -123.039&quot;)
                    </p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="google_place_id" className={labelStyles}>Google Place ID (Optional)</label>
                    <input
                        id="google_place_id"
                        name="google_place_id"
                        defaultValue={location?.google_place_id || ''}
                        placeholder="ChIJ..."
                        className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    <p className="text-xs text-neutral-500">Needed for fetching photos/reviews in the future.</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Location Details</h3>
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="board_count" className={labelStyles}>Number of Boards</label>
                        <input
                            id="board_count"
                            name="board_count"
                            type="number"
                            min="0"
                            defaultValue={location?.board_count || 0}
                            className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                    </div>

                    <div className="space-y-4 border border-white/10 p-4 rounded-md">
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_league_venue"
                                    defaultChecked={location?.is_league_venue ?? false}
                                    className="rounded border-white/10 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                />
                                <span className="text-sm font-medium text-white">Available for League Play</span>
                            </label>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="league_notes" className={labelStyles}>League Availability Notes</label>
                            <input
                                id="league_notes"
                                name="league_notes"
                                placeholder="e.g. Mondays and Wednesdays only"
                                defaultValue={location?.league_notes || ''}
                                className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked={location?.is_active ?? true}
                        className="rounded border-white/10 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm font-medium text-white">Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_new_location"
                        defaultChecked={location?.is_new_location ?? false}
                        className="rounded border-white/10 bg-neutral-900 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-white">New Location (Highlight)</span>
                </label>
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
                    {location ? 'Update Location' : 'Create Location'}
                </Button>
            </div>
        </form>
    )
}
