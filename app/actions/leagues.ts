'use server';

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type League = {
    id: string;
    name: string;
    season: string;
    year: number;
    is_active: boolean;
};

export type Division = {
    id: string;
    league_id: string;
    name: string;
    display_order: number;
};

export type Flight = {
    id: string;
    division_id: string;
    name: string;
    day_of_week: string | null;
    time: string | null;
    standings_url: string | null;
    schedule_url: string | null;
};

// --- Leagues ---

export async function getLeagues() {
    const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .order('year', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as League[];
}

// --- Hierarchical Data Fetching ---

export type DivisionStructure = Division & {
    flights: Flight[];
};

export type LeagueStructure = League & {
    divisions: DivisionStructure[];
};

export async function getLeaguesStructure() {
    const { data, error } = await supabase
        .from('leagues')
        .select(`
            *,
            divisions (
                *,
                flights (*)
            )
        `)
        .order('name', { ascending: true }); // Alphabetical sort for Leagues

    if (error) throw new Error(error.message);

    // Sort divisions and flights manually
    const sortedData = data?.map(league => ({
        ...league,
        divisions: league.divisions
            .sort((a: Division, b: Division) => a.name.localeCompare(b.name)) // Alphabetical sort for Divisions
            .map((division: any) => ({
                ...division,
                flights: division.flights.sort((a: Flight, b: Flight) => a.name.localeCompare(b.name))
            }))
    }));

    return sortedData as LeagueStructure[];
}

export async function createLeague(data: Partial<League>) {
    const { error } = await supabase
        .from('leagues')
        .insert(data);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/leagues');
}

export async function deleteLeague(id: string) {
    const { error } = await supabase
        .from('leagues')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/leagues');
}

// --- Divisions ---

export async function getDivisions(leagueId: string) {
    const { data, error } = await supabase
        .from('divisions')
        .select('*')
        .eq('league_id', leagueId)
        .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Division[];
}

export async function createDivision(data: Partial<Division>) {
    const { error } = await supabase
        .from('divisions')
        .insert(data);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/leagues');
}

export async function deleteDivision(id: string) {
    const { error } = await supabase
        .from('divisions')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/leagues');
}


// --- Flights ---

export async function getFlights(divisionId: string) {
    const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('division_id', divisionId)
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Flight[];
}

export async function createFlight(data: Partial<Flight>) {
    const { error } = await supabase
        .from('flights')
        .insert(data);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/leagues');
}

export async function deleteFlight(id: string) {
    const { error } = await supabase
        .from('flights')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/leagues');
}

export async function updateFlight(id: string, data: Partial<Flight>) {
    const { error } = await supabase
        .from('flights')
        .update(data)
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/leagues');
}
