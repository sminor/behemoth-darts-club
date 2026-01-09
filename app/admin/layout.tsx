import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background)] pl-64">
            <Sidebar />
            <main className="p-8 max-w-6xl mx-auto">
                {children}
            </main>
        </div>
    );
}
