import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, BarChart3 } from "lucide-react";
import { Logo } from "@/components/logo";
import { supabase } from '@/lib/supabase';
import { PublicAnnouncementItem } from "@/components/public-announcement-item";

type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: number;
  is_featured?: boolean;
};

export default async function Home() {
  // Fetch active announcements from Supabase
  let announcements = [];
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error);
    } else {
      announcements = data || [];
    }
  } catch (e) {
    console.error("Unexpected error fetching announcements:", e);
  }

  const displayAnnouncements = announcements;
  const featuredAnnouncement = announcements.find(a => a.is_featured);
  const regularAnnouncements = announcements.filter(a => !a.is_featured);

  return (
    <main className="flex min-h-screen flex-col items-center bg-[var(--background)] px-4 pb-12 pt-8 sm:px-6 lg:px-8">

      {/* Hero Section */}
      <div className="flex w-full max-w-4xl flex-col items-center text-center space-y-6 mb-12">
        {/* Logo Placeholder */}
        <div className="relative w-full max-w-md aspect-square mb-4">
          {/* In a real app, use next/image here. For now, we'll use an img tag with the uploaded asset if available, or a placeholder */}
          <Logo />
        </div>

        <p className="w-full max-w-4xl text-lg text-neutral-300">
          Soft tip darts across the Portland Metro area - Leagues, Tournaments, and More!
        </p>

        {featuredAnnouncement && (
          <div className="w-full bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent border-l-4 border-[var(--color-primary)] p-4 text-left rounded-r-lg mb-4">
            <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2">
              {featuredAnnouncement.title}
            </h3>
            <div dangerouslySetInnerHTML={{ __html: featuredAnnouncement.content.replace(/&nbsp;/g, ' ') }} className="text-sm text-neutral-200 mt-1 prose prose-invert max-w-none" />
          </div>
        )}

        <div className="flex flex-col w-full sm:flex-row gap-4 justify-center mt-6">
          <Button size="lg" className="w-full sm:w-auto text-lg font-bold" asChild>
            <Link href="/locations">Find a Location</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg font-bold text-white border-white/20 hover:bg-white/10" asChild>
            <Link href="/events">Upcoming Events</Link>
          </Button>
        </div>
      </div>

      {/* Quick Links Grid */}
      <section className="w-full max-w-4xl mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Quick Links</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/locations">
            <Card className="h-full hover:bg-white/5 transition-colors cursor-pointer border-white/10">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-xl">Locations</CardTitle>
                  <CardDescription className="text-xs text-neutral-400 font-normal">Find a board</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/events">
            <Card className="h-full hover:bg-white/5 transition-colors cursor-pointer border-white/10">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-xl">Events</CardTitle>
                  <CardDescription className="text-xs text-neutral-400 font-normal">Weekly & special</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/leagues">
            <Card className="h-full hover:bg-white/5 transition-colors cursor-pointer border-white/10">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-xl">Leagues</CardTitle>
                  <CardDescription className="text-xs text-neutral-400 font-normal">Divisions & schedules</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/stats">
            <Card className="h-full hover:bg-white/5 transition-colors cursor-pointer border-white/10">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-xl">Stats</CardTitle>
                  <CardDescription className="text-xs text-neutral-400 font-normal">ADL & NADO tracking</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* Announcements (Regular) */}
      <section className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Announcements</h2>
        <div className="space-y-4">
          {regularAnnouncements.length > 0 ? (
            regularAnnouncements.map((announcement) => (
              <PublicAnnouncementItem key={announcement.id} announcement={announcement} />
            ))
          ) : (
            <p className="text-center text-neutral-400">No active announcements.</p>
          )}
        </div>
      </section>

    </main>
  );
}
