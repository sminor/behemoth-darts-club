import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

export default function LeaguesPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] px-4 pb-12 pt-8 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="w-full max-w-4xl mb-8">
                <Button variant="ghost" asChild>
                    <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center text-center max-w-lg mt-12">
                <div className="p-4 bg-white/5 rounded-full mb-6">
                    <Users className="h-16 w-16 text-[var(--color-primary)]" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Leagues</h1>
                <p className="text-neutral-400 text-lg">
                    League information, divisions, and schedules will be available here soon.
                    Check back for Fall/Winter season updates.
                </p>
            </div>
        </main>
    );
}
