
export type ButtonStyle = 
  | 'fill-square' | 'fill-rounded' | 'fill-pill'
  | 'outline-square' | 'outline-rounded' | 'outline-pill'
  | 'hard-shadow-square' | 'hard-shadow-rounded' | 'hard-shadow-pill'
  | 'soft-shadow-square' | 'soft-shadow-rounded' | 'soft-shadow-pill';

export type ContactType = 'phone' | 'email' | 'website' | 'whatsapp' | 'linkedin' | 'x' | 'instagram' | 'facebook';

export interface ContactMethod {
  id: string;
  type: ContactType;
  value: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

export interface BulletinPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  imageUrl: string;
  linkUrl?: string; // Optional link for more info
  postedDate: string; // ISO string
  expiryDate: string; // ISO string
}

export interface Profile {
  username?: string; // New field for handle/slug
  displayName: string;
  headline: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
  contactMethods: ContactMethod[];
  avatarUrl: string;
  backgroundUrl: string | null;
  dashboardLogoUrl: string | null; // New field for custom sidebar logo
  featuredVideoUrl: string | null; // New field for YouTube embed
  primaryButtonText: string;
  showContactInfo: boolean;
  
  // Exclusive Admin Features
  showMusicPlayer: boolean;
  musicPlaylist: MusicTrack[]; // Editable playlist
  showPodcastPlayer: boolean;
  podcastPlaylistId: string | null; // Editable playlist ID

  // Store Configuration (Admin Only)
  product1SquareUrl: string;
  product1ImageUrl: string;
  product2SquareUrl: string;
  product2ImageUrl: string;

  // Appearance / Theme
  cardBackgroundColor: string;
  cardOpacity: number; // 0-100
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  linkColor: string;
  linkOpacity: number; // 0-100
  linkTextColor: string;

  // Button Design
  buttonStyle: ButtonStyle;
  buttonIconPosition: 'left' | 'right';

  // Community
  isLocationPinned?: boolean;
  locationName?: string; // City/Region name for the globe
  profession?: string;   // Profession label for the globe
  flyerPostHistory: string[]; // Track history of post dates to enforce limits (e.g., 2 per month)
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  date: string;
}

export interface DirectoryUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  joinedDate: string;
  status: 'active' | 'inactive';
  plan: 'free' | 'pro';
}

export interface GlobeUser {
  id: string;
  lat: number;
  lng: number;
  displayName: string;
  profession: string;
  locationName: string;
  bio: string;
  avatarUrl: string;
  isCurrentUser?: boolean; // To highlight the user's own pin
}

export type ViewState = 'dashboard' | 'edit-profile' | 'links' | 'leads' | 'users' | 'analytics' | 'store' | 'community' | 'bulletin' | 'options';
