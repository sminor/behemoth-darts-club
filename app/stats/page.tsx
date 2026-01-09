import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function StatsPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] px-4 pb-12 pt-8 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="w-full max-w-4xl mb-8">
                <Button variant="ghost" asChild>
                    <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center text-center max-w-lg mt-8">
                <div className="p-4 bg-white/5 rounded-full mb-6">
                    <BarChart3 className="h-16 w-16 text-[var(--color-primary)]" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-8">Player Stats</h1>

                <div className="grid grid-cols-1 gap-4 w-full text-left">
                    <Card className="border-white/10 hover:bg-white/5 transition-colors">
                        <CardHeader>
                            <CardTitle>ADL Stats</CardTitle>
                            <CardDescription>American Darts League</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full justify-between" asChild>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    View Rankings <ExternalLink className="h-4 w-4 ml-2" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 hover:bg-white/5 transition-colors">
                        <CardHeader>
                            <CardTitle>NADO Stats</CardTitle>
                            <CardDescription>North American Darts Organization</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full justify-between" asChild>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    View Points <ExternalLink className="h-4 w-4 ml-2" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
