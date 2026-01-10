"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeagueStructure } from "@/app/actions/leagues";
import { LeagueCard } from "./league-card";

interface LeagueManagerProps {
    initialLeagues: LeagueStructure[];
}

export function LeagueManager({ initialLeagues }: LeagueManagerProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button asChild className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]">
                    <Link href="/admin/leagues/create">
                        <Plus className="w-4 h-4 mr-2" />
                        New League
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                {initialLeagues.map((league) => (
                    <LeagueCard key={league.id} league={league} />
                ))}

                {initialLeagues.length === 0 && (
                    <div className="text-center py-12 text-neutral-500 border border-dashed border-white/10 rounded-xl">
                        No leagues found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
