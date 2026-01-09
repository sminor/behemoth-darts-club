'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function DeleteEventButton({ id, title }: { id: string, title?: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title || 'this event'}"? This cannot be undone.`)) {
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Error deleting event: ' + error.message);
            } else {
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            alert('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleDelete}
            disabled={loading}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    );
}
