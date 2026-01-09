'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export async function createAnnouncement(formData: FormData) {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const is_active = formData.get('is_active') === 'on'
    const is_featured = formData.get('is_featured') === 'on'
    // Calculate display order: put at top (min - 1)
    const { data: minOrderData } = await supabase
        .from('announcements')
        .select('display_order')
        .order('display_order', { ascending: true })
        .limit(1)
        .single();

    const minOrder = minOrderData?.display_order ?? 0;
    const newOrder = minOrder - 1;

    const { error } = await supabase
        .from('announcements')
        .insert({ title, content, display_order: newOrder, is_active, is_featured })

    if (error) {
        console.error('Error creating announcement:', error)
    } else {
        revalidatePath('/admin/announcements')
        revalidatePath('/')
        redirect('/admin/announcements')
    }
}

export async function updateAnnouncement(id: string, formData: FormData) {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const display_order = Number(formData.get('display_order'))
    const is_active = formData.get('is_active') === 'on'
    const is_featured = formData.get('is_featured') === 'on'

    const { error } = await supabase
        .from('announcements')
        .update({ title, content, display_order, is_active, is_featured })
        .eq('id', id)

    if (error) {
        console.error('Error updating announcement:', error)
    } else {
        revalidatePath('/admin/announcements')
        revalidatePath('/')
        redirect('/admin/announcements')
    }
}

export async function deleteAnnouncement(id: string, _formData?: FormData) {
    const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting announcement:', error)
    }

    revalidatePath('/admin/announcements')
    revalidatePath('/')
}

export async function toggleAnnouncementStatus(id: string, currentStatus: boolean, _formData?: FormData) {
    const { error } = await supabase
        .from('announcements')
        .update({ is_active: !currentStatus })
        .eq('id', id)

    if (error) {
        console.error('Error updating announcement status:', error)
    }

    revalidatePath('/admin/announcements')
    revalidatePath('/')
}

export async function toggleAnnouncementFeatured(id: string, currentFeatured: boolean, _formData?: FormData) {
    const { error } = await supabase
        .from('announcements')
        .update({ is_featured: !currentFeatured })
        .eq('id', id)

    if (error) {
        console.error('Error updating announcement featured status:', error)
    }

    revalidatePath('/admin/announcements')
    revalidatePath('/')
}

export async function updateAnnouncementsOrder(items: { id: string; display_order: number; title: string; content: string }[]) {
    // Upsert requires all non-nullable fields to be present
    const { error } = await supabase
        .from('announcements')
        .upsert(items, { onConflict: 'id' })

    if (error) {
        console.error('Error updating order:', error)
    }

    revalidatePath('/admin/announcements')
    revalidatePath('/')
}
