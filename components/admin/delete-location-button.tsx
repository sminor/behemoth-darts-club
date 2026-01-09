'use client'

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteLocation } from "@/app/actions/locations"

export function DeleteLocationButton({ id, name }: { id: string, name?: string }) {
    return (
        <form
            action={deleteLocation.bind(null, id)}
            onSubmit={(e) => {
                const message = name
                    ? `Are you sure you want to delete "${name}"? This cannot be undone.`
                    : "Delete this location? This cannot be undone."

                if (!confirm(message)) {
                    e.preventDefault()
                }
            }}
        >
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
            </Button>
        </form>
    )
}
