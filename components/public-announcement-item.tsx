"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

type Announcement = {
    id: string;
    title: string;
    content: string;
    display_order: number;
    is_active: boolean;
    is_featured?: boolean;
};

export function PublicAnnouncementItem({ announcement }: { announcement: Announcement }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Sanitize content
    // Sanitize content
    // Replace &nbsp; with regular spaces to prevent splitting issues caused by copy-pasted data
    const contentWithFixedSpaces = announcement.content.replace(/&nbsp;/g, ' ');
    const sanitizedContent = DOMPurify.sanitize(contentWithFixedSpaces);

    // Use a temporary div to get text length for "Read More" check
    // This is a rough estimation. For HTML, simple length check might be misleading if lots of tags.
    // Ideally, we check height, but for static generation string length is safer/easier.
    // We'll trust the string length of the raw HTML for now, or strip tags to count chars.
    const strippingDiv = typeof document !== 'undefined' ? document.createElement("div") : null;
    if (strippingDiv) strippingDiv.innerHTML = sanitizedContent;
    const textContent = strippingDiv ? strippingDiv.textContent || "" : announcement.content;
    const isLongContent = textContent.length > 150;

    return (
        <Card className="border-white/10 bg-white/5 transition-colors hover:bg-white/10">
            <CardHeader>
                <CardTitle className="text-lg text-[var(--color-primary)]">{announcement.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className={`text-neutral-300 prose prose-invert max-w-none ${!isExpanded && isLongContent ? 'line-clamp-3' : ''}`}
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />

                {isLongContent && (
                    <div className="flex justify-end mt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] p-0 h-auto font-normal hover:bg-transparent"
                        >
                            {isExpanded ? (
                                <span className="flex items-center gap-1">Show Less <ChevronUp className="w-4 h-4" /></span>
                            ) : (
                                <span className="flex items-center gap-1">Show More <ChevronDown className="w-4 h-4" /></span>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
