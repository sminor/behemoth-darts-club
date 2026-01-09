'use server'

import * as cheerio from 'cheerio';

export interface PlayerStats {
    id: string;
    name: string;
    startRating: string;
    rollRating: string;
    isNew?: boolean;
}

export interface PlayerDetails {
    id: string;
    name: string;
    stats: {
        games01: string;
        gamesCricket: string;
        ppd: string;
        mpr: string;
    };
}

export async function searchADLPlayers(query: string): Promise<PlayerStats[]> {
    if (!query) return [];

    try {
        const response = await fetch(`https://actiondartleague.com/player_search.php?search=${encodeURIComponent(query)}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        const results: PlayerStats[] = [];

        $('a.custom-list-item').each((_, element) => {
            const el = $(element);
            const href = el.attr('href') || '';
            const id = href.split('id=')[1];

            // Name can be in .player-name-normal or .player-name-new
            const name = el.find('.player-name-normal, .player-name-new').text().trim();
            const isNew = el.find('.badge-new').length > 0;

            // Ratings are in .rating-badge-search
            // Assuming order is always START then ROLL
            const badges = el.find('.rating-badge-search');
            // Second child div contains the value
            const startRating = $(badges[0]).find('div').eq(1).text().trim();
            const rollRating = $(badges[1]).find('div').eq(1).text().trim();

            if (id && name) {
                results.push({
                    id,
                    name,
                    startRating,
                    rollRating,
                    isNew
                });
            }
        });

        return results;

    } catch (error) {
        console.error('Error fetching ADL players:', error);
        return [];
    }
}

export async function getADLPlayerDetails(id: string): Promise<PlayerDetails | null> {
    try {
        const response = await fetch(`https://actiondartleague.com/player.php?id=${id}`);
        const html = await response.text();
        const $ = cheerio.load(html);

        const name = $('.player-name-normal').first().text().trim();

        // Parse generic stats boxes
        // Expected order/labels: 01 Games, Cricket Games, 01 Avg, Cricket Avg
        // We can look for .stat-label and map them
        let games01 = '-';
        let gamesCricket = '-';
        let avg01 = '-';
        let avgCricket = '-';

        $('.profile-stat-box').each((_, el) => {
            const label = $(el).find('.stat-label').text().trim();
            const value = $(el).find('.stat-value').text().trim();

            if (label.includes('01 Games')) games01 = value;
            if (label.includes('Cricket Games')) gamesCricket = value;
            if (label.includes('01 Avg')) avg01 = value;
            if (label.includes('Cricket Avg')) avgCricket = value;
        });

        return {
            id,
            name,
            stats: {
                games01,
                gamesCricket,
                ppd: avg01,
                mpr: avgCricket
            }
        };
    } catch (error) {
        console.error('Error fetching ADL player details:', error);
        return null;
    }
}
