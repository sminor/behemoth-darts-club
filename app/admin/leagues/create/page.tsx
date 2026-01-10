import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LeagueForm } from "@/components/admin/league-form";

export default function CreateLeaguePage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/leagues"
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-neutral-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">New League</h1>
                    <p className="text-neutral-400">Add a new season or league container.</p>
                </div>
            </div>

            <LeagueForm />
        </div>
    );
}
