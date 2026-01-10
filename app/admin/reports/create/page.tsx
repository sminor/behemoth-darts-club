'use client'

import { createDataSource } from "@/app/actions/data-sources"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full font-bold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]">
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                </>
            ) : (
                'Create Report'
            )}
        </Button>
    )
}

export default function CreateReportPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/reports" className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white tracking-tight">New Report</h1>
            </div>

            <div className="border border-white/10 bg-white/5 rounded-lg p-6">
                <form action={createDataSource} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Report Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. 2026 Season Stats or January 2026"
                            required
                            className="bg-black/20 border-white/10 text-white focus:border-[var(--color-primary)] input-dark"
                        />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="url" className="text-white">LeagueLeader URL</Label>
                        <Input
                            id="url"
                            name="url"
                            placeholder="https://leagueleader.net/sharedreport.php?..."
                            required
                            type="url"
                            className="bg-black/20 border-white/10 text-white focus:border-[var(--color-primary)] input-dark"
                        />
                        <p className="text-xs text-neutral-500">Paste the full 'Shared Report' URL from LeagueLeader.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-white">Category</Label>
                            <Select name="category" required defaultValue="Yearly">
                                <SelectTrigger className="bg-black/20 border-white/10 text-white select-trigger-dark">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="All Time">All Time</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_default"
                            name="is_default"
                            className="w-4 h-4 rounded border-white/10 bg-black/20 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <Label htmlFor="is_default" className="text-white">Default Report (First visible)</Label>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
