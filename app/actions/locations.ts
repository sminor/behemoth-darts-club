'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export type Location = {
    id: string
    name: string
    address: string
    city: string
    state: string
    zip: string
    coordinates: string // "lat, lng"
    board_count: number
    is_league_venue: boolean
    league_notes?: string
    is_new_location: boolean
    google_place_id?: string
    is_active: boolean
    created_at: string
}

export async function getLocations() {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name')

    if (error) {
        console.error('Error fetching locations:', error)
        return []
    }

    return data as Location[]
}

export async function getAllLocationsAdmin() {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching admin locations:', error)
        throw new Error('Failed to fetch locations')
    }

    return data as Location[]
}

export async function getLocation(id: string) {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching location:', error)
        return null
    }

    return data as Location
}

export async function createLocation(formData: FormData) {
    const rawData = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        coordinates: formData.get('coordinates') as string,
        board_count: parseInt(formData.get('board_count') as string) || 0,
        is_league_venue: formData.get('is_league_venue') === 'on',
        league_notes: formData.get('league_notes') as string || null,
        is_new_location: formData.get('is_new_location') === 'on',
        google_place_id: formData.get('google_place_id') as string || null,
        is_active: formData.get('is_active') === 'on',
    }

    const { data, error } = await supabase
        .from('locations')
        .insert([rawData])
        .select()

    if (error) {
        console.error('Error creating location:', error)
        throw new Error('Failed to create location')
    }

    revalidatePath('/locations')
    revalidatePath('/admin/locations')
    return data[0]
}

export async function updateLocation(id: string, formData: FormData) {
    const rawData = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        coordinates: formData.get('coordinates') as string,
        board_count: parseInt(formData.get('board_count') as string) || 0,
        is_league_venue: formData.get('is_league_venue') === 'on',
        league_notes: formData.get('league_notes') as string || null,
        is_new_location: formData.get('is_new_location') === 'on',
        google_place_id: formData.get('google_place_id') as string || null,
        is_active: formData.get('is_active') === 'on',
    }

    const { error } = await supabase
        .from('locations')
        .update(rawData)
        .eq('id', id)

    if (error) {
        console.error('Error updating location:', error)
        throw new Error('Failed to update location')
    }

    revalidatePath('/locations')
    revalidatePath('/admin/locations')
}

export async function deleteLocation(id: string) {
    const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting location:', error)
        throw new Error('Failed to delete location')
    }

    revalidatePath('/locations')
    revalidatePath('/admin/locations')
}

export async function toggleLocationStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase
        .from('locations')
        .update({ is_active: !currentStatus })
        .eq('id', id)

    if (error) {
        console.error('Error toggling location status:', error)
        throw new Error('Failed to toggle location status')
    }

    revalidatePath('/locations')
    revalidatePath('/admin/locations')
}
