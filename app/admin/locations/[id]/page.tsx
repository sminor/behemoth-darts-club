import Link from "next/link"
import { LocationForm } from "@/components/admin/location-form"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: location, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !location) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/locations">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-white">Edit Location</h1>
            </div>

            <div className="border border-white/10 bg-white/5 rounded-lg p-6">
                <LocationForm location={location} />
            </div>
        </div>
    )
}
