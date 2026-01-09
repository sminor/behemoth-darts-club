export type Location = {
    id: string;
    name: string;
    address: string;
    imageUrl?: string;
    boardCount: number;
    websiteUrl?: string;
};

export type Event = {
    id: string;
    title: string;
    date: string;
    time: string;
    locationId: string;
    description: string;
    type: 'tournament' | 'league' | 'special';
};

export type Announcement = {
    id: string;
    title: string;
    content: string;
    priority: number;
};

export const MOCK_LOCATIONS: Location[] = [
    {
        id: '1',
        name: "Silver Star Saloon",
        address: "6718 NE 4th Plain Blvd, Vancouver, WA 98661",
        boardCount: 4,
        websiteUrl: "https://silverstarsaloon.com",
        imageUrl: "/placeholder-location.jpg"
    },
    {
        id: '2',
        name: "The Tank",
        address: "123 Fake St, Portland, OR 97204",
        boardCount: 2,
        imageUrl: "/placeholder-location-2.jpg"
    }
];

export const MOCK_EVENTS: Event[] = [
    {
        id: '1',
        title: "Friday Night Draws",
        date: "2024-10-25",
        time: "7:00 PM",
        locationId: '1',
        description: "Weekly blind draw. $10 entry.",
        type: 'special'
    },
    {
        id: '2',
        title: "Fall League Week 1",
        date: "2024-09-15",
        time: "6:00 PM",
        locationId: '1',
        description: "Start of the fall season.",
        type: 'league'
    }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: '1',
        title: "Fall/Winter League Signups Open!",
        content: "Get your teams ready! Signups close on Sept 1st.",
        priority: 1
    },
    {
        id: '2',
        title: "Friday Night Draws at Silver Star",
        content: "Join us every Friday for blind draws.",
        priority: 2
    }
];
