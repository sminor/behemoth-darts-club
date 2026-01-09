'use client'

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteLocation } from "@/app/actions/locations"

export function DeleteLocationButton({ id }: { id: string }) {
    return (
        <form
            action={deleteLocation.bind(null, id)}
            onSubmit={(e) => {
                if (!confirm("Delete this location? This cannot be undone.")) {
                    e.preventDefault()
                }
            }}
        >
            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-red-400 hover:bg-white/5">
                <Trash2 className="w-4 h-4" />
            </Button>
        </form>
    )
}
