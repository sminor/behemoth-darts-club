"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Eye, EyeOff, Star, ChevronDown, ChevronUp } from "lucide-react";
import { deleteAnnouncement, toggleAnnouncementStatus, toggleAnnouncementFeatured } from "@/app/actions/announcements";
import DOMPurify from "isomorphic-dompurify";

type Announcement = {
    id: string;
    title: string;
    content: string;
    display_order: number;
    is_active: boolean;
    is_featured?: boolean;
};

export function AnnouncementItem({ announcement }: { announcement: Announcement }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Sanitize content
    // Sanitize content
    // Replace &nbsp; with regular spaces to prevent splitting issues caused by copy-pasted data
    const contentWithFixedSpaces = announcement.content.replace(/&nbsp;/g, ' ');
    const sanitizedContent = DOMPurify.sanitize(contentWithFixedSpaces);

    // Strip tags for preview length check only
    const stripDiv = typeof document !== 'undefined' ? document.createElement("div") : null;
    if (stripDiv) stripDiv.innerHTML = announcement.content;
    const rawText = stripDiv ? stripDiv.textContent || "" : announcement.content;

    const isLongContent = rawText.length > 100; // Arbitrary threshold

    return (
        <Card className="border-white/10 bg-white/5 mb-4">
            <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <h3 className="font-semibold text-[var(--color-primary)] text-lg">{announcement.title}</h3>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                            <form
                                action={toggleAnnouncementFeatured.bind(
                                    null,
                                    announcement.id,
                                    announcement.is_featured || false
                                )}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 hover:bg-white/10 ${announcement.is_featured ? "text-yellow-500 fill-yellow-500 hover:text-yellow-400" : "text-neutral-400 hover:text-white"}`}
                                    title={announcement.is_featured ? "Remove from Featured" : "Mark as Featured"}
                                >
                                    <Star className="h-4 w-4" />
                                </Button>
                            </form>

                            <form
                                action={toggleAnnouncementStatus.bind(
                                    null,
                                    announcement.id,
                                    announcement.is_active
                                )}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 hover:bg-white/10 ${announcement.is_active ? "text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" : "text-neutral-400 hover:text-white"}`}
                                    title={announcement.is_active ? "Deactivate Announcement" : "Activate Announcement"}
                                >
                                    {announcement.is_active ? (
                                        <Eye className="h-4 w-4" />
                                    ) : (
                                        <EyeOff className="h-4 w-4" />
                                    )}
                                </Button>
                            </form>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10"
                                title="Edit Announcement"
                                asChild
                            >
                                <Link href={`/admin/announcements/${announcement.id}`}>
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            </Button>

                            <form
                                action={deleteAnnouncement.bind(null, announcement.id)}
                                onSubmit={(e) => {
                                    if (!confirm("Are you sure you want to delete this announcement? This action cannot be undone.")) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    title="Delete Announcement"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="text-neutral-400 text-sm pl-0">
                        {isExpanded || !isLongContent ? (
                            <div className="prose prose-invert max-w-none text-neutral-300" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                        ) : (
                            <div className="line-clamp-2 prose prose-invert max-w-none text-neutral-300" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                        )}
                        {isLongContent && (
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-xs flex items-center gap-1"
                                >
                                    {isExpanded ? (
                                        <><ChevronUp className="w-3 h-3" /> Show Less</>
                                    ) : (
                                        <><ChevronDown className="w-3 h-3" /> Show More</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>


            </CardContent >
        </Card >
    );
}
