import { LocationForm } from "@/components/admin/location-form"

export default function CreateLocationPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white text-center">Add New Location</h1>
            <LocationForm />
        </div>
    )
}
