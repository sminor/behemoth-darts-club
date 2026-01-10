'use client'

import { createDataSource } from "@/app/actions/data-sources"
import { Button } from "@/components/ui/button"
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
                        <label htmlFor="title" className="block text-xs uppercase tracking-wider font-bold text-neutral-400 mb-1.5">Report Title</label>
                        <input
                            id="title"
                            name="title"
                            placeholder="e.g. 2026 Season Stats or January 2026"
                            required
                            className="flex h-10 w-full bg-[#0A0A0A] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[var(--color-primary)] placeholder:text-neutral-400 transition-all font-sans"
                        />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <label htmlFor="url" className="block text-xs uppercase tracking-wider font-bold text-neutral-400 mb-1.5">LeagueLeader URL</label>
                        <input
                            id="url"
                            name="url"
                            placeholder="https://leagueleader.net/sharedreport.php?..."
                            required
                            type="url"
                            className="flex h-10 w-full bg-[#0A0A0A] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[var(--color-primary)] placeholder:text-neutral-400 transition-all font-sans"
                        />
                        <p className="text-xs text-neutral-500">Paste the full 'Shared Report' URL from LeagueLeader.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-xs uppercase tracking-wider font-bold text-neutral-400 mb-1.5">Category</label>
                            <Select name="category" required defaultValue="Yearly">
                                <SelectTrigger className="flex h-10 w-full bg-[#0A0A0A] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-transparent focus:ring-1 focus:ring-[var(--color-primary)] placeholder:text-neutral-400 transition-all font-sans">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="All Time">All Time</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_default"
                                name="is_default"
                                className="w-4 h-4 rounded border-white/10 bg-[#0A0A0A] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                            <label htmlFor="is_default" className="text-sm font-medium text-white cursor-pointer select-none">Default Report (First visible)</label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                defaultChecked
                                className="w-4 h-4 rounded border-white/10 bg-[#0A0A0A] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-white cursor-pointer select-none">Active (Visible on site)</label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
