import { Suspense } from "react";
import { LeagueManager } from "@/components/admin/league-manager";
import { getLeaguesStructure } from "@/app/actions/leagues";

export const dynamic = 'force-dynamic';

export default async function AdminLeaguesPage() {
    // We'll fetch the full tree structure to pass to the client manager
    const initialData = await getLeaguesStructure();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">League Management</h1>
                    <p className="text-neutral-400">Manage seasons, divisions, and flights.</p>
                </div>
            </div>

            <Suspense fallback={<div className="text-white">Loading leagues...</div>}>
                <LeagueManager initialLeagues={initialData} />
            </Suspense>
        </div>
    );
}
