"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, MapPin, Calendar, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarLink = {
    href: string;
    label: string;
    icon: any;
    disabled?: boolean;
};

const links: SidebarLink[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/locations", label: "Locations", icon: MapPin },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/leagues", label: "Leagues", icon: Users },
    { href: "/admin/reports", label: "Stat Reports", icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-neutral-900 border-r border-white/10 flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-xl font-bold text-white tracking-wider uppercase">Behemoth<br /><span className="text-[var(--color-primary)]">Admin</span></h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Button
                            key={link.href}
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3",
                                isActive ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]" : "text-neutral-400 hover:text-white hover:bg-white/5",
                                link.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                            )}
                            asChild={!link.disabled}
                        >
                            {link.disabled ? (
                                <>
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </>
                            ) : (
                                <Link href={link.href}>
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            )}
                        </Button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Link href="/" className="text-sm text-neutral-500 hover:text-white flex items-center gap-2">
                    &larr; Back to Site
                </Link>
            </div>
        </aside>
    );
}
