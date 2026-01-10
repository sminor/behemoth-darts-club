"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { createFlight, deleteDivision, DivisionStructure } from "@/app/actions/leagues";
import { FlightRow } from "./flight-row";

interface DivisionCardProps {
    division: DivisionStructure;
}

export function DivisionCard({ division }: DivisionCardProps) {
    const [isAddFlightOpen, setIsAddFlightOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleAddFlight(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const day_of_week = formData.get("day_of_week") as string;
        const time = formData.get("time") as string;
        const standings_url = formData.get("standings_url") as string;

        try {
            await createFlight({
                division_id: division.id,
                name,
                day_of_week,
                time,
                standings_url,
            });
            setIsAddFlightOpen(false);
        } catch (error) {
            console.error("Failed to create flight:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this division and all its flights?")) return;
        try {
            await deleteDivision(division.id);
        } catch (error) {
            console.error("Failed to delete division:", error);
        }
    }

    return (
        <div className="bg-neutral-900/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-neutral-700 rounded-full" />
                    <h4 className="font-bold text-neutral-300">{division.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                    <Dialog open={isAddFlightOpen} onOpenChange={setIsAddFlightOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-neutral-400 hover:text-white hover:bg-white/5 h-8">
                                <Plus className="w-4 h-4 mr-1" />
                                Add Flight
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-neutral-900 border-white/10 text-white">
                            <DialogHeader>
                                <DialogTitle>Add Flight to {division.name}</DialogTitle>
                                <DialogDescription>
                                    Create a new flight and link its LeagueLeader report.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddFlight} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="flight-name">Flight Name</Label>
                                    <Input
                                        id="flight-name"
                                        name="name"
                                        placeholder="e.g. Flight A"
                                        className="bg-neutral-800 border-white/10"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="day">Day</Label>
                                        <Input
                                            id="day"
                                            name="day_of_week"
                                            placeholder="e.g. Monday"
                                            className="bg-neutral-800 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Time</Label>
                                        <Input
                                            id="time"
                                            name="time"
                                            placeholder="e.g. 7:00 PM"
                                            className="bg-neutral-800 border-white/10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="url">Standings URL</Label>
                                    <Input
                                        id="url"
                                        name="standings_url"
                                        placeholder="https://leagueleader.net/..."
                                        className="bg-neutral-800 border-white/10"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsAddFlightOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Adding..." : "Add Flight"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button size="icon" variant="ghost" className="h-8 we-8 text-neutral-500 hover:text-red-400 hover:bg-white/5" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-2 pl-4 border-l-2 border-white/5">
                {division.flights.map((flight: any) => (
                    <FlightRow key={flight.id} flight={flight} />
                ))}

                {division.flights.length === 0 && (
                    <div className="text-neutral-500 text-sm py-2 px-3 bg-white/5 rounded border border-white/5 border-dashed">
                        No flights. Click "Add Flight" to start.
                    </div>
                )}
            </div>
        </div>
    );
}
