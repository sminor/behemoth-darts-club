'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { deleteDataSource } from '@/app/actions/data-sources'

export function DeleteDataSourceButton({ id, title }: { id: string, title: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the report "${title}"?`)) return

        setIsDeleting(true)
        try {
            await deleteDataSource(id)
        } catch (error) {
            console.error('Failed to delete report:', error)
            alert('Failed to delete report. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            title="Delete Report"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}
