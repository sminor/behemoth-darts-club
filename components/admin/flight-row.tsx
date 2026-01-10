"use client";

import { useState } from "react";
import { Save, Trash2, X, ExternalLink, Calendar, Link as LinkIcon, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteFlight, Flight, updateFlight } from "@/app/actions/leagues";

interface FlightRowProps {
    flight: Flight;
}

export function FlightRow({ flight }: FlightRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initial form state
    const [formData, setFormData] = useState({
        name: flight.name,
        day_of_week: flight.day_of_week || "",
        time: flight.time || "",
        standings_url: flight.standings_url || "",
    });

    async function handleSave() {
        setIsSaving(true);
        try {
            await updateFlight(flight.id, {
                name: formData.name,
                day_of_week: formData.day_of_week,
                time: formData.time,
                standings_url: formData.standings_url,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update flight:", error);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        if (!confirm(`Delete flight "${flight.name}"?`)) return;
        try {
            await deleteFlight(flight.id);
        } catch (error) {
            console.error("Failed to delete flight:", error);
        }
    }

    if (isEditing) {
        return (
            <div className="bg-neutral-800 rounded p-2 flex flex-col gap-2 border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-3">
                        <Input
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-8 bg-neutral-900 border-white/10 text-xs"
                        />
                    </div>
                    <div className="col-span-2">
                        <Input
                            placeholder="Day"
                            value={formData.day_of_week}
                            onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                            className="h-8 bg-neutral-900 border-white/10 text-xs"
                        />
                    </div>
                    <div className="col-span-2">
                        <Input
                            placeholder="Time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="h-8 bg-neutral-900 border-white/10 text-xs"
                        />
                    </div>
                    <div className="col-span-5">
                        <Input
                            placeholder="Standings URL"
                            value={formData.standings_url}
                            onChange={(e) => setFormData({ ...formData, standings_url: e.target.value })}
                            className="h-8 bg-neutral-900 border-white/10 text-xs"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving} className="h-7 text-xs">
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-7 text-xs bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
                        <Save className="w-3 h-3 mr-1" /> Save
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="flex items-center gap-4 flex-1">
                <span className="text-white font-medium text-sm min-w-[100px]">{flight.name}</span>

                <div className="flex items-center gap-4 text-xs text-neutral-400">
                    {(flight.day_of_week || flight.time) && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 opacity-70" />
                            <span>{flight.day_of_week} {flight.time}</span>
                        </div>
                    )}

                    {flight.standings_url && (
                        <a
                            href={flight.standings_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[var(--color-primary)] hover:underline opacity-80 hover:opacity-100"
                        >
                            <LinkIcon className="w-3 h-3" />
                            Report
                        </a>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400 hover:text-white" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400 hover:text-red-400" onClick={handleDelete}>
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
}
