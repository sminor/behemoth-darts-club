'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type DataSource = {
    id: string
    title: string
    url: string
    category: string
    is_active: boolean
    is_default: boolean
    created_at: string
}

export async function createDataSource(formData: FormData) {
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const category = formData.get('category') as string
    const is_active = formData.get('is_active') === 'on'
    const is_default = formData.get('is_default') === 'on'

    // If making this default, unset others first (simplest approach, though trigger/function is better for concurrency)
    // For this low-traffic admin, two queries is fine. Use transaction if strictness needed.
    if (is_default) {
        await supabase
            .from('data_sources')
            .update({ is_default: false })
            .eq('is_default', true)
    }

    const { error } = await supabase
        .from('data_sources')
        .insert({
            title,
            url,
            category,
            is_active,
            is_default
        })

    if (error) {
        console.error('Error creating data source:', error)
        throw new Error('Failed to create data source')
    }

    revalidatePath('/admin/reports')
    redirect('/admin/reports')
}

export async function updateDataSource(id: string, formData: FormData) {
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const category = formData.get('category') as string
    const is_active = formData.get('is_active') === 'on'
    const is_default = formData.get('is_default') === 'on'

    if (is_default) {
        await supabase
            .from('data_sources')
            .update({ is_default: false })
            .neq('id', id) // Don't unset self if already set, though Eq true covers it. safely unset all others (where true).
            .eq('is_default', true)
    }

    const { error } = await supabase
        .from('data_sources')
        .update({
            title,
            url,
            category,
            is_active,
            is_default
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating data source:', error)
        throw new Error('Failed to update data source')
    }

    revalidatePath('/admin/reports')
    redirect('/admin/reports')
}

export async function deleteDataSource(id: string) {

    const { error } = await supabase
        .from('data_sources')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting data source:', error)
        throw new Error('Failed to delete data source')
    }

    revalidatePath('/admin/reports')
}

export async function toggleDataSourceStatus(id: string, currentStatus: boolean) {

    const { error } = await supabase
        .from('data_sources')
        .update({ is_active: !currentStatus })
        .eq('id', id)

    if (error) {
        console.error('Error toggling data source status:', error)
        throw new Error('Failed to toggle data source status')
    }

    revalidatePath('/admin/reports')
}

export async function setReportAsDefault(id: string) {
    // 1. Unset any existing default
    await supabase
        .from('data_sources')
        .update({ is_default: false })
        .eq('is_default', true)

    // 2. Set the new default
    const { error } = await supabase
        .from('data_sources')
        .update({ is_default: true })
        .eq('id', id)

    if (error) {
        console.error('Error setting default report:', error)
        throw new Error('Failed to set default report')
    }

    revalidatePath('/admin/reports')
    revalidatePath('/stats') // Also revalidate public stats page
}
