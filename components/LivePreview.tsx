import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Phone, Globe, Instagram, Youtube, Video, Mail, Link as LinkIcon, Facebook, Linkedin, Twitter, Music, Play, Pause, SkipForward, SkipBack, Mic2 } from 'lucide-react';
import { Profile, LinkItem, ContactType, MusicTrack } from '../types';

interface LivePreviewProps {
  profile: Profile;
  links: LinkItem[];
}

const GoatLogo: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <path d="M12 2C8 2 8 5 8 5C8 5 5.5 6 5.5 9.5C5.5 11.5 7 12 7 12L8 14C8 14 8.5 16 6.5 17.5C4.5 19 5.5 21 5.5 21H18.5C18.5 21 19.5 19 17.5 17.5C15.5 16 16 14 16 14L17 12C17 12 18.5 11.5 18.5 9.5C18.5 6 16 5 16 5C16 5 16 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-90" />
    <path d="M12 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white opacity-90" />
    <path d="M15 9L16.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white opacity-90" />
    <path d="M9 9L7.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white opacity-90" />
    <path d="M12 13L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white opacity-90" />
  </svg>
);

const MiniMusicPlayer: React.FC<{ tracks: MusicTrack[] }> = ({ tracks }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!tracks || tracks.length === 0) {
      return (
        <div className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-center">
            <span className="text-xs text-gray-500">No tracks available</span>
        </div>
      );
  }

  const track = tracks[currentTrackIndex];

  // Ensure track exists before rendering (handling deletions)
  if (!track) {
      setCurrentTrackIndex(0);
      return null;
  }

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, track]);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center space-x-3 shadow-lg overflow-hidden">
      {/* Cover Art */}
      <div className="w-12 h-12 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden relative">
        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
        {/* Rotating Vinyl Effect */}
        <div className={`absolute inset-0 rounded-full border-2 border-white/10 ${isPlaying ? 'animate-spin' : ''} opacity-20 scale-75`}></div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white font-bold truncate">{track.title}</p>
        <p className="text-[10px] text-gray-400 truncate">{track.artist}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 text-white">
        <button onClick={prevTrack} className="p-1 hover:text-purple-400 transition-colors"><SkipBack size={14} /></button>
        <button onClick={togglePlay} className="p-1.5 bg-white text-black rounded-full hover:scale-105 transition-transform">
          {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
        </button>
        <button onClick={nextTrack} className="p-1 hover:text-purple-400 transition-colors"><SkipForward size={14} /></button>
      </div>
      
      <audio ref={audioRef} src={track.audioUrl} onEnded={nextTrack} />
    </div>
  );
};

const LivePreview: React.FC<LivePreviewProps> = ({ profile, links }) => {
  // Helper to determine icon based on label text (simple heuristic)
  const getIconForLabel = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('instagram')) return <Instagram size={20} />;
    if (lower.includes('youtube')) return <Youtube size={20} />;
    if (lower.includes('web') || lower.includes('site')) return <Globe size={20} />;
    if (lower.includes('mail')) return <Mail size={20} />;
    if (lower.includes('video')) return <Video size={20} />;
    if (lower.includes('call') || lower.includes('phone')) return <Phone size={20} />;
    return <LinkIcon size={20} />;
  };

  // Helper for Contact Method Icons
  const getIconForContactType = (type: ContactType) => {
    switch (type) {
      case 'phone': return <Phone size={16} />;
      case 'email': return <Mail size={16} />;
      case 'website': return <Globe size={16} />;
      case 'instagram': return <Instagram size={16} />;
      case 'facebook': return <Facebook size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'x': return <Twitter size={16} />; // Using Twitter icon for X
      case 'whatsapp': return <Phone size={16} />; // Fallback or use MessageCircle if available
      default: return <LinkIcon size={16} />;
    }
  };

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  };

  // Helper to extract YouTube Video ID Robustly
  const getYouTubeVideoId = (url: string | null): string | null => {
    if (!url) return null;
    const cleanUrl = url.trim();
    if (!cleanUrl) return null;

    try {
      // 1. Try URL object parsing (Most robust)
      const safeUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
      const urlObj = new URL(safeUrl);
      const hostname = urlObj.hostname.replace('www.', '').toLowerCase();

      if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
        if (urlObj.searchParams.has('v')) {
          return urlObj.searchParams.get('v');
        }
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2 && ['shorts', 'embed', 'live', 'v'].includes(pathParts[0])) {
            return pathParts[1];
        }
      }
      
      if (hostname === 'youtu.be') {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          return pathParts[0];
        }
      }
    } catch (e) {
      // ignore
    }
    // Fallback
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Filter only active links
  const activeLinks = links.filter(l => l.isActive);

  const cardStyle = {
    backgroundColor: hexToRgba(profile.cardBackgroundColor, profile.cardOpacity),
    borderColor: `rgba(255, 255, 255, ${Math.max(0.1, profile.cardOpacity / 200)})`, // Dynamic border opacity
  };

  const textStyle = { color: profile.textColor };
  const buttonStyle = { backgroundColor: profile.buttonColor, color: profile.buttonTextColor };

  // --- DYNAMIC LINK STYLE LOGIC ---
  const getLinkStyles = () => {
    const style = profile.buttonStyle || 'fill-rounded';
    
    // Shape
    let borderRadius = '0px';
    if (style.includes('rounded')) borderRadius = '12px';
    if (style.includes('pill')) borderRadius = '9999px';

    // Colors
    const linkColorRgba = hexToRgba(profile.linkColor, profile.linkOpacity);
    const linkText = profile.linkTextColor;
    const borderColor = `rgba(255, 255, 255, ${Math.max(0.1, profile.linkOpacity / 200)})`;

    const common = { borderRadius, color: linkText, transition: 'all 0.2s ease' };

    if (style.includes('outline')) {
      return {
        ...common,
        backgroundColor: 'transparent',
        border: `2px solid ${profile.linkColor}`,
        color: profile.linkColor,
      };
    }
    
    if (style.includes('hard-shadow')) {
      return {
        ...common,
        backgroundColor: linkColorRgba,
        border: `1px solid ${borderColor}`,
        boxShadow: '4px 4px 0px 0px #000000',
        transform: 'translate(-2px, -2px)',
      };
    }

    // Default: Fill
    return {
      ...common,
      backgroundColor: linkColorRgba,
      border: `1px solid ${borderColor}`,
    };
  };

  const linkDynamicStyles = getLinkStyles();
  const isRightIcon = profile.buttonIconPosition === 'right';
  const youtubeId = getYouTubeVideoId(profile.featuredVideoUrl);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const contactMethodsToShow = profile.contactMethods && profile.contactMethods.length > 0
    ? profile.contactMethods
    : [
        ...(profile.phone ? [{ id: 'phone', type: 'phone' as ContactType, value: profile.phone }] : []),
        ...(profile.email ? [{ id: 'email', type: 'email' as ContactType, value: profile.email }] : []),
        ...(profile.website ? [{ id: 'web', type: 'website' as ContactType, value: profile.website }] : []),
      ];

  return (
    <div className="h-full w-full bg-[#050505] flex flex-col relative overflow-hidden">
      <div className="absolute top-6 right-6 z-10 flex items-center space-x-2">
        <h3 className="text-gray-400 text-sm font-medium tracking-wide">Live Preview</h3>
        <span className="text-blue-400 text-xs cursor-pointer hover:text-blue-300 border-b border-blue-400">View Full</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        {/* Phone Frame */}
        <div className="w-[340px] h-[700px] rounded-[3rem] border-[12px] border-gray-900 bg-black shadow-2xl relative overflow-hidden ring-1 ring-gray-800 flex flex-col">
          
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-30"></div>

          {/* Dynamic Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
            style={{
              backgroundImage: profile.backgroundUrl 
                ? `url(${profile.backgroundUrl})` 
                : 'linear-gradient(to bottom, #1e1b4b, #0f172a, #000000)',
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col h-full overflow-y-auto no-scrollbar px-4 pt-14 pb-20">
            
            {/* TRANSPARENT CARD */}
            <div 
              className="shadow-xl rounded-3xl p-6 mb-5 flex flex-col items-start text-left relative overflow-hidden isolate w-full border flex-shrink-0"
              style={cardStyle}
            >
              
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-2 border-white/50 shadow-lg overflow-hidden mb-4 bg-gray-800/50 self-start flex-shrink-0 aspect-square">
                <img 
                  src={profile.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 
                className="text-xl font-bold mb-1 drop-shadow-md tracking-tight"
                style={textStyle}
              >
                {profile.displayName}
              </h2>
              <p 
                className="text-xs font-semibold mb-3 drop-shadow-sm tracking-wide uppercase opacity-90"
                style={textStyle}
              >
                {profile.headline}
              </p>
              <p 
                className="text-[11px] leading-relaxed w-full whitespace-pre-line opacity-90 font-light text-left"
                style={textStyle}
              >
                {profile.bio}
              </p>
              
              {/* Contact Row */}
              {profile.showContactInfo && contactMethodsToShow.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4 mb-4 w-full justify-start">
                  {contactMethodsToShow.map((method) => (
                     <button 
                      key={method.id} 
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm"
                      style={{ backgroundColor: profile.buttonColor, color: profile.buttonTextColor, opacity: 0.9 }}
                      title={method.value}
                     >
                       {getIconForContactType(method.type)}
                     </button>
                  ))}
                </div>
              )}

              {/* Featured Video */}
              {youtubeId && (
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-5 shadow-inner border border-white/10 bg-black/20">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0&showinfo=0&color=white&origin=${origin}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Main CTA */}
              <button 
                className="w-full font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 text-sm"
                style={buttonStyle}
              >
                {profile.primaryButtonText}
              </button>
            </div>

            {/* Links List */}
            <div className="space-y-3 w-full flex-1">
              {activeLinks.map((link) => (
                <a 
                  key={link.id}
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  className="block w-full backdrop-blur-sm group hover:opacity-90 active:scale-[0.99]"
                  style={linkDynamicStyles}
                >
                  <div className={`flex items-center px-4 py-3 ${isRightIcon ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 transition-colors opacity-80 group-hover:opacity-100 ${isRightIcon ? 'ml-3' : 'mr-3'}`}>
                      {getIconForLabel(link.label)}
                    </div>
                    <div className={`flex-1 flex ${isRightIcon ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-sm font-medium">{link.label}</span>
                    </div>
                  </div>
                </a>
              ))}
              
              {activeLinks.length === 0 && (
                <div className="text-center text-gray-500 text-xs py-4 italic">
                  No active links
                </div>
              )}
            </div>
            
            {/* --- EXCLUSIVE FEATURES (Dynamic) --- */}
            <div className="mt-8 w-full space-y-4">
              {/* Music Player */}
              {profile.showMusicPlayer && profile.musicPlaylist && profile.musicPlaylist.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <MiniMusicPlayer tracks={profile.musicPlaylist} />
                </div>
              )}

              {/* YouTube Podcast Playlist Embed */}
              {profile.showPodcastPlayer && profile.podcastPlaylistId && (
                <div className="w-full mb-2 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="flex items-center space-x-1.5 mb-2 text-xs text-white/90 uppercase font-bold tracking-wider drop-shadow-md">
                    <Mic2 size={12} className="text-red-400" />
                    <span>Latest Podcast</span>
                  </div>
                  <div className="w-full aspect-video rounded-xl overflow-hidden shadow-xl border border-white/10 bg-black/40 backdrop-blur-sm">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/videoseries?list=${profile.podcastPlaylistId}&modestbranding=1&rel=0&color=white&origin=${origin}`}
                      title="YouTube Podcast Playlist" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Branding */}
            <div className="mt-8 flex flex-col items-center justify-center opacity-50 hover:opacity-70 transition-opacity pb-6">
               <div className="flex flex-col items-center space-y-1">
                 <GoatLogo />
                 <span className="text-[10px] font-bold text-white tracking-[0.2em] mt-2">GOAT UNIT</span>
               </div>
            </div>

          </div>

          {/* Floating Options */}
          <button className="absolute bottom-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-lg rounded-full flex items-center justify-center text-white shadow-lg border border-white/5 z-40 hover:bg-black/80 transition-colors">
            <MoreHorizontal size={20} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default LivePreview;