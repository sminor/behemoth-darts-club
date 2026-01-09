import { AnnouncementForm } from "@/components/admin/announcement-form";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateAnnouncementPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/announcements">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-white">New Announcement</h1>
            </div>

            <div className="border border-white/10 bg-white/5 rounded-lg p-6">
                <AnnouncementForm />
            </div>
        </div>
    );
}
