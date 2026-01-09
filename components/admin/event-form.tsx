'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

// Basic input styles reused
// Basic input styles reused - exact match to LocationForm
const inputStyles = "flex h-10 w-full bg-neutral-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-neutral-400 transition-all font-sans"
const labelStyles = "block text-xs uppercase tracking-wider font-bold text-neutral-400 mb-1.5"

export function EventForm({ event, locations }: { event?: any, locations: any[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [title, setTitle] = useState(event?.title || '')
    const [date, setDate] = useState(event?.date || '')
    const [time, setTime] = useState(event?.time || '6:30 PM')
    const [type, setType] = useState(event?.type || 'local')
    const [locationId, setLocationId] = useState(event?.location_id || (locations.length > 0 ? locations[0].id : ''))
    const [useCustomLocation, setUseCustomLocation] = useState(!event?.location_id && (event?.venue_name || event?.venue_address))
    const [venueName, setVenueName] = useState(event?.venue_name || '')
    const [venueAddress, setVenueAddress] = useState(event?.venue_address || '')
    const [entryFee, setEntryFee] = useState(event?.entry_fee || '$10')
    const [gameFormat, setGameFormat] = useState(event?.game_format || '501 / Cricket / Choice')
    const [drawType, setDrawType] = useState(event?.draw_type || 'A/B Draw')
    const [description, setDescription] = useState(event?.description || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const eventData = {
                title,
                date,
                time,
                type,
                location_id: useCustomLocation ? null : locationId,
                venue_name: useCustomLocation ? venueName : null,
                venue_address: useCustomLocation ? venueAddress : null,
                entry_fee: entryFee,
                game_format: gameFormat,
                draw_type: drawType,
                description
            }

            if (event) {
                // Update
                const { error: updateError } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', event.id)

                if (updateError) throw updateError
            } else {
                // Create
                const { error: createError } = await supabase
                    .from('events')
                    .insert([eventData])

                if (createError) throw createError
            }

            router.push('/admin/events')
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Event Information</h3>
                {/* Title */}
                <div>
                    <label className={labelStyles}>Event Title</label>
                    <input
                        required
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className={inputStyles}
                        placeholder="e.g. Friday Night Blind Draw"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                        <label className={labelStyles}>Date</label>
                        <input
                            required
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className={`${inputStyles} [color-scheme:dark]`}
                        />
                    </div>
                    {/* Time */}
                    <div>
                        <label className={labelStyles}>Time</label>
                        <input
                            required
                            type="text"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className={inputStyles}
                            placeholder="e.g. 7:00 PM"
                        />
                    </div>
                </div>

                {/* Type */}
                {/* Type */}
                <div>
                    <label className={labelStyles}>Event Type</label>
                    <div className="relative">
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className={inputStyles}
                        >
                            <option value="local" className="bg-neutral-900">Local</option>
                            <option value="special" className="bg-neutral-900">Special</option>
                            <option value="travel" className="bg-neutral-900">Travel</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">

                {/* Location Logic */}
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Location Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className={labelStyles}>Location Type</label>
                        <div className="relative mb-4">
                            <select
                                value={useCustomLocation ? 'custom' : 'existing'}
                                onChange={e => setUseCustomLocation(e.target.value === 'custom')}
                                className={inputStyles}
                            >
                                <option value="existing" className="bg-neutral-900">Existing Venue</option>
                                <option value="custom" className="bg-neutral-900">Custom / Travel</option>
                            </select>
                        </div>

                        {!useCustomLocation ? (
                            <select
                                value={locationId}
                                onChange={e => setLocationId(e.target.value)}
                                className={inputStyles}
                            >
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id} className="bg-neutral-900 text-white">
                                        {loc.name} - {loc.city}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <input
                                        type="text"
                                        value={venueName}
                                        onChange={e => setVenueName(e.target.value)}
                                        className={inputStyles}
                                        placeholder="Venue Name (e.g. Red Lion Hotel)"
                                        required={useCustomLocation}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={venueAddress}
                                        onChange={e => setVenueAddress(e.target.value)}
                                        className={inputStyles}
                                        placeholder="Venue City/Address (e.g. Vancouver, WA)"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Format Information</h3>
                <div className="grid grid-cols-3 gap-4">
                    {/* Entry Fee */}
                    <div>
                        <label className={labelStyles}>Entry Fee</label>
                        <input
                            type="text"
                            value={entryFee}
                            onChange={e => setEntryFee(e.target.value)}
                            className={inputStyles}
                            placeholder="$10"
                        />
                    </div>
                    {/* Game Format */}
                    <div>
                        <label className={labelStyles}>Game Format</label>
                        <input
                            type="text"
                            value={gameFormat}
                            onChange={e => setGameFormat(e.target.value)}
                            className={inputStyles}
                            placeholder="501 / Cricket"
                        />
                    </div>
                    {/* Draw Type */}
                    <div>
                        <label className={labelStyles}>Draw Type</label>
                        <input
                            type="text"
                            value={drawType}
                            onChange={e => setDrawType(e.target.value)}
                            className={inputStyles}
                            placeholder="Blind Draw"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className={labelStyles}>Description</label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className={`${inputStyles} min-h-[100px] h-auto`}
                        placeholder="Additional details about the event..."
                    />
                </div>

            </div>

            <div className="pt-4 border-t border-white/10">
                <Button type="submit" disabled={loading} className="w-full font-bold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {event ? 'Update Event' : 'Create Event'}
                </Button>
            </div>
        </form>
    )
}
