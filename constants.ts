
import { Profile, LinkItem, Lead, DirectoryUser, GlobeUser, BulletinPost } from './types';

export const INITIAL_PROFILE: Profile = {
  username: 'mcclary',
  displayName: 'McClary',
  headline: 'International Photographer',
  bio: '📸 Photographer | Videographer | Drone\n🌍 International creator — 20+ years experience\n🚀 Elevating brands & talent',
  phone: '+1 (555) 123-4567',
  email: 'contact@goatunit.com',
  website: 'www.goatunit.com',
  contactMethods: [
    { id: '1', type: 'phone', value: '+1 (555) 123-4567' },
    { id: '2', type: 'email', value: 'contact@goatunit.com' },
    { id: '3', type: 'website', value: 'www.goatunit.com' }
  ],
  avatarUrl: 'https://picsum.photos/400/400',
  backgroundUrl: null, // Null implies default gradient
  dashboardLogoUrl: 'https://placehold.co/400x400/0a0a0a/ffffff.png?text=GOAT+UNIT',
  featuredVideoUrl: null,
  primaryButtonText: 'Save Contact',
  showContactInfo: true,
  
  // Features default to ON with Demo Data
  showMusicPlayer: true,
  musicPlaylist: [
    {
      id: '1',
      title: "Goat Unit Anthem",
      artist: "McClary",
      coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: '2',
      title: "Hustle & Grind",
      artist: "Goat Unit",
      coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
    },
    {
      id: '3',
      title: "Legacy",
      artist: "The Unit",
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  ],
  showPodcastPlayer: true,
  podcastPlaylistId: "PLFgquLnL59alCl_2TQvOiD5Vvf14w0nSx", // Example Playlist

  // Store Defaults
  product1SquareUrl: 'https://squareup.com',
  product1ImageUrl: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&auto=format&fit=crop&q=60',
  product2SquareUrl: 'https://squareup.com',
  product2ImageUrl: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=800&auto=format&fit=crop&q=60',

  // Appearance Defaults
  cardBackgroundColor: '#ffffff',
  cardOpacity: 0, // Default to transparent as per user preference
  textColor: '#ffffff',
  buttonColor: '#ffffff',
  buttonTextColor: '#000000',
  linkColor: '#000000',
  linkOpacity: 40, // 40% opacity black default
  linkTextColor: '#ffffff',

  // Button Design Defaults
  buttonStyle: 'fill-rounded',
  buttonIconPosition: 'left',

  isLocationPinned: false,
  locationName: 'New York, USA',
  profession: 'Photographer',
  
  flyerPostHistory: [],
};

export const BLANK_PROFILE: Profile = {
  username: '',
  displayName: 'New Creator',
  headline: 'Digital Creator',
  bio: 'Welcome to my Goat Unit card!',
  phone: '',
  email: '',
  website: '',
  contactMethods: [],
  avatarUrl: 'https://placehold.co/400x400/333/fff?text=Avatar',
  backgroundUrl: null,
  dashboardLogoUrl: null,
  featuredVideoUrl: null,
  primaryButtonText: 'Save Contact',
  showContactInfo: true,
  
  // Features default to ON
  showMusicPlayer: true,
  musicPlaylist: [],
  showPodcastPlayer: true,
  podcastPlaylistId: null,

  // Store Defaults
  product1SquareUrl: '',
  product1ImageUrl: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&auto=format&fit=crop&q=60',
  product2SquareUrl: '',
  product2ImageUrl: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=800&auto=format&fit=crop&q=60',

  // Theme Defaults (Clean Slate)
  cardBackgroundColor: '#ffffff',
  cardOpacity: 10,
  textColor: '#ffffff',
  buttonColor: '#ffffff',
  buttonTextColor: '#000000',
  linkColor: '#ffffff',
  linkOpacity: 20,
  linkTextColor: '#ffffff',

  buttonStyle: 'fill-rounded',
  buttonIconPosition: 'left',
  
  isLocationPinned: false,
  locationName: '',
  profession: '',
  
  flyerPostHistory: [],
};

export const INITIAL_LINKS: LinkItem[] = [
  { id: '1', label: 'Website', url: 'https://example.com', isActive: true },
  { id: '2', label: 'Instagram', url: 'https://instagram.com', isActive: true },
  { id: '3', label: 'YouTube', url: 'https://youtube.com', isActive: true },
  { id: '4', label: 'Book Now', url: 'https://calendly.com', isActive: false },
];

export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', source: 'NFC Scan', date: '2023-10-24' },
  { id: '2', name: 'Bob Smith', email: 'bob.creative@agency.com', source: 'QR Code', date: '2023-10-23' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@startups.io', source: 'Link in Bio', date: '2023-10-22' },
  { id: '4', name: 'Diana Prince', email: 'diana@themyscira.gov', source: 'NFC Scan', date: '2023-10-20' },
];

export const MOCK_USERS: DirectoryUser[] = [
  { 
    id: '1', 
    username: 'mcclary', 
    displayName: 'McClary', 
    email: 'mcclary@goatunit.com', 
    avatarUrl: 'https://picsum.photos/id/1005/200/200', 
    joinedDate: '2023-09-15',
    status: 'active',
    plan: 'pro'
  },
  { 
    id: '2', 
    username: 'sarah_creative', 
    displayName: 'Sarah Jenkins', 
    email: 'sarah@design.co', 
    avatarUrl: 'https://picsum.photos/id/342/200/200', 
    joinedDate: '2023-10-02',
    status: 'active',
    plan: 'free'
  },
  { 
    id: '3', 
    username: 'dj_pulse', 
    displayName: 'DJ Pulse', 
    email: 'bookings@djpulse.com', 
    avatarUrl: 'https://picsum.photos/id/453/200/200', 
    joinedDate: '2023-10-10',
    status: 'active',
    plan: 'pro'
  },
  { 
    id: '4', 
    username: 'tech_guru', 
    displayName: 'Marcus Wright', 
    email: 'marcus@techreview.io', 
    avatarUrl: 'https://picsum.photos/id/65/200/200', 
    joinedDate: '2023-10-28',
    status: 'inactive',
    plan: 'free'
  },
  { 
    id: '5', 
    username: 'fitness_jane', 
    displayName: 'Jane Doe', 
    email: 'jane@fitness.com', 
    avatarUrl: 'https://picsum.photos/id/64/200/200', 
    joinedDate: '2023-11-01',
    status: 'active',
    plan: 'pro'
  }
];

export const MOCK_GLOBE_USERS: GlobeUser[] = [
  { id: '1', lat: 40.7128, lng: -74.0060, displayName: 'McClary', profession: 'Photographer', locationName: 'New York, USA', bio: 'Capturing the city lights.', avatarUrl: 'https://picsum.photos/id/1005/100/100' },
  { id: '2', lat: 51.5074, lng: -0.1278, displayName: 'Sarah J', profession: 'Designer', locationName: 'London, UK', bio: 'Minimalist design specialist.', avatarUrl: 'https://picsum.photos/id/342/100/100' },
  { id: '3', lat: 35.6762, lng: 139.6503, displayName: 'Kenji T', profession: 'Videographer', locationName: 'Tokyo, Japan', bio: 'Cinematic street stories.', avatarUrl: 'https://picsum.photos/id/453/100/100' },
  { id: '4', lat: 25.7617, lng: -80.1918, displayName: 'Elena R', profession: 'Model', locationName: 'Miami, USA', bio: 'Fashion and lifestyle.', avatarUrl: 'https://picsum.photos/id/64/100/100' },
  { id: '5', lat: 48.8566, lng: 2.3522, displayName: 'Jean P', profession: 'Photographer', locationName: 'Paris, France', bio: 'Fashion week editorial.', avatarUrl: 'https://picsum.photos/id/65/100/100' },
  { id: '6', lat: -33.8688, lng: 151.2093, displayName: 'Mike D', profession: 'Surfer', locationName: 'Sydney, AU', bio: 'Action sports content.', avatarUrl: 'https://picsum.photos/id/77/100/100' },
  { id: '7', lat: 34.0522, lng: -118.2437, displayName: 'Anna L', profession: 'Actor', locationName: 'Los Angeles, USA', bio: 'Film and TV.', avatarUrl: 'https://picsum.photos/id/91/100/100' },
  { id: '8', lat: 55.7558, lng: 37.6173, displayName: 'Dimitri', profession: 'Producer', locationName: 'Moscow, RU', bio: 'Electronic music production.', avatarUrl: 'https://picsum.photos/id/103/100/100' },
  { id: '9', lat: -22.9068, lng: -43.1729, displayName: 'Lucas', profession: 'Dancer', locationName: 'Rio, Brazil', bio: 'Movement artist.', avatarUrl: 'https://picsum.photos/id/128/100/100' },
  { id: '10', lat: 25.2048, lng: 55.2708, displayName: 'Amira', profession: 'Influencer', locationName: 'Dubai, UAE', bio: 'Luxury lifestyle.', avatarUrl: 'https://picsum.photos/id/177/100/100' }
];

export const MOCK_BULLETIN_POSTS: BulletinPost[] = [
  {
    id: '1',
    userId: '2',
    username: 'sarah_creative',
    userAvatar: 'https://picsum.photos/id/342/100/100',
    title: 'NYC Creative Meetup 📸',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&auto=format&fit=crop',
    linkUrl: 'https://meetup.com',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '3',
    username: 'dj_pulse',
    userAvatar: 'https://picsum.photos/id/453/100/100',
    title: 'Weekend Rooftop Set 🎧',
    imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=600&auto=format&fit=crop',
    linkUrl: 'https://soundcloud.com',
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    userId: '5',
    username: 'fitness_jane',
    userAvatar: 'https://picsum.photos/id/64/100/100',
    title: 'Community Yoga in the Park 🧘‍♀️',
    imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d895951?w=600&auto=format&fit=crop',
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    expiryDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
