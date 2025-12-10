import type { Venue, ServiceBar } from '../types';

export const mockVenues: Venue[] = [
  {
    id: 'venue-001',
    name: 'The Grand Casino',
    address: '123 Las Vegas Blvd, Las Vegas, NV 89109',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
  },
  {
    id: 'venue-002',
    name: 'Royal Palace Casino',
    address: '456 Casino Drive, Atlantic City, NJ 08401',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
  },
  {
    id: 'venue-003',
    name: 'Diamond Resort & Casino',
    address: '789 Fortune Way, Reno, NV 89501',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  },
];

export const mockServiceBars: ServiceBar[] = [
  // The Grand Casino bars
  {
    id: 'bar-001',
    venueId: 'venue-001',
    name: 'High Roller Lounge',
    location: 'Main Floor - Near Poker Tables',
    activeOrders: 3,
    availableServers: 2,
    estimatedWaitMinutes: 8,
    status: 'low',
  },
  {
    id: 'bar-002',
    venueId: 'venue-001',
    name: 'Slots Paradise Bar',
    location: 'Slot Machine Area - Section A',
    activeOrders: 12,
    availableServers: 3,
    estimatedWaitMinutes: 15,
    status: 'medium',
  },
  {
    id: 'bar-003',
    venueId: 'venue-001',
    name: 'VIP Sky Lounge',
    location: '2nd Floor - VIP Section',
    activeOrders: 2,
    availableServers: 4,
    estimatedWaitMinutes: 5,
    status: 'low',
  },
  {
    id: 'bar-004',
    venueId: 'venue-001',
    name: 'Sports Book Bar',
    location: 'Sports Betting Area',
    activeOrders: 25,
    availableServers: 2,
    estimatedWaitMinutes: 25,
    status: 'high',
  },
  // Royal Palace Casino bars
  {
    id: 'bar-005',
    venueId: 'venue-002',
    name: 'Crown Jewel Bar',
    location: 'Main Gaming Floor',
    activeOrders: 8,
    availableServers: 3,
    estimatedWaitMinutes: 10,
    status: 'medium',
  },
  {
    id: 'bar-006',
    venueId: 'venue-002',
    name: 'Roulette Lounge',
    location: 'Table Games Section',
    activeOrders: 5,
    availableServers: 2,
    estimatedWaitMinutes: 12,
    status: 'medium',
  },
  // Diamond Resort bars
  {
    id: 'bar-007',
    venueId: 'venue-003',
    name: 'Diamond Edge Bar',
    location: 'Main Entrance Area',
    activeOrders: 4,
    availableServers: 2,
    estimatedWaitMinutes: 7,
    status: 'low',
  },
  {
    id: 'bar-008',
    venueId: 'venue-003',
    name: 'Lucky Strike Lounge',
    location: 'Bowling Alley Adjacent',
    activeOrders: 18,
    availableServers: 2,
    estimatedWaitMinutes: 20,
    status: 'high',
  },
];

export function getServiceBarsForVenue(venueId: string): ServiceBar[] {
  return mockServiceBars.filter((bar) => bar.venueId === venueId);
}

export function getVenueById(venueId: string): Venue | undefined {
  return mockVenues.find((venue) => venue.id === venueId);
}
