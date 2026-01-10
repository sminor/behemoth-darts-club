"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLeague } from "@/app/actions/leagues";

export function LeagueForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Default values
    const [formData, setFormData] = useState({
        name: "",
        season: "",
        year: new Date().getFullYear().toString(),
    });

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createLeague({
                name: formData.name,
                season: formData.season,
                year: parseInt(formData.year),
                is_active: true,
            });
            router.push("/admin/leagues");
        } catch (error) {
            console.error("Failed to create league:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
                <div className="grid gap-6 p-6 border border-white/10 rounded-lg bg-white/5">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Info className="w-4 h-4 text-[var(--color-primary)]" />
                        Season Information
                    </h2>

                    <div className="space-y-2">
                        <Label htmlFor="name">League Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Fall 2024 Singles"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-neutral-800 border-white/10"
                            required
                        />
                        <p className="text-[10px] text-neutral-400">The full display name of the league/season.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="season">Season</Label>
                            <Input
                                id="season"
                                placeholder="e.g. Fall"
                                value={formData.season}
                                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                                className="bg-neutral-800 border-white/10"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="number"
                                placeholder="e.g. 2024"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="bg-neutral-800 border-white/10"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-white/10 pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    asChild
                >
                    <Link href="/admin/leagues">Cancel</Link>
                </Button>
                <Button
                    type="submit"
                    className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] min-w-[150px]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create League"}
                </Button>
            </div>
        </form>
    );
}
