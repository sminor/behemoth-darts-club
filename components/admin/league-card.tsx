"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Folder, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDivision, deleteLeague, LeagueStructure } from "@/app/actions/leagues";
import { DivisionCard } from "./division-card";

interface LeagueCardProps {
    league: LeagueStructure;
}

export function LeagueCard({ league }: LeagueCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddDivisionOpen, setIsAddDivisionOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleAddDivision(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        // Simple auto-increment for display order based on current length
        const display_order = league.divisions.length;

        try {
            await createDivision({
                league_id: league.id,
                name,
                display_order,
            });
            setIsAddDivisionOpen(false);
            setIsExpanded(true); // Auto expand when adding
        } catch (error) {
            console.error("Failed to create division:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure? This will delete all divisions and flights within this league.")) return;
        try {
            await deleteLeague(league.id);
        } catch (error) {
            console.error("Failed to delete league:", error);
        }
    }

    return (
        <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
            <div className="p-4 flex items-center gap-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                    )}
                </button>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white max-md:text-sm">{league.name}</h3>
                    <p className="text-sm text-neutral-400">{league.season} {league.year}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Dialog open={isAddDivisionOpen} onOpenChange={setIsAddDivisionOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Division
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-neutral-900 border-white/10 text-white">
                            <DialogHeader>
                                <DialogTitle>Add Division</DialogTitle>
                                <DialogDescription>
                                    Create a new division (e.g. Gold, Silver, Bronze) for {league.name}.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddDivision} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="division-name">Division Name</Label>
                                    <Input
                                        id="division-name"
                                        name="name"
                                        placeholder="e.g. Gold"
                                        className="bg-neutral-800 border-white/10"
                                        required
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsAddDivisionOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Adding..." : "Add Division"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-white/10 bg-black/20 p-4 space-y-3">
                    {league.divisions.map((division) => (
                        <DivisionCard key={division.id} division={division} />
                    ))}

                    {league.divisions.length === 0 && (
                        <div className="text-center py-4 text-neutral-500 text-sm italic">
                            No divisions yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
