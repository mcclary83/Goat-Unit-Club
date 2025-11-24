
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, User, Mail, X, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { MOCK_GLOBE_USERS } from '../constants';
import { GlobeUser, Profile } from '../types';

interface CommunityGlobeProps {
    profile: Profile;
    onUpdateProfile: (updated: Profile) => void;
}

const CommunityGlobe: React.FC<CommunityGlobeProps> = ({ profile, onUpdateProfile }) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchProfession, setSearchProfession] = useState('');
  const [selectedUser, setSelectedUser] = useState<GlobeUser | null>(null);
  
  // Canvas & Animation Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const rotationRef = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef<{x: number, y: number}>({ x: 0, y: 0 });

  // Create a GlobeUser object for the current user if pinned
  const currentUserGlobeUser: GlobeUser | null = profile.isLocationPinned ? {
      id: 'current-user',
      // Mock coordinates for demo purposes (e.g. somewhere in Atlantic or generic user location)
      // In a real app, you'd geocode profile.locationName to lat/lng
      lat: 40.7, 
      lng: -74.0,
      displayName: profile.displayName,
      profession: profile.profession || 'Creator',
      locationName: profile.locationName || 'Unknown',
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      isCurrentUser: true
  } : null;

  // Combine Mock Users + Current User (if pinned)
  const allUsers = currentUserGlobeUser ? [currentUserGlobeUser, ...MOCK_GLOBE_USERS] : MOCK_GLOBE_USERS;

  // Filtered users based on search
  const filteredUsers = allUsers.filter(u => {
      const locMatch = u.locationName.toLowerCase().includes(searchLocation.toLowerCase());
      const jobMatch = u.profession.toLowerCase().includes(searchProfession.toLowerCase());
      return locMatch && jobMatch;
  });

  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = canvas.offsetWidth;
      let height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;

      const GLOBE_RADIUS = Math.min(width, height) * 0.35;
      
      // Generate Sphere Dots (Static background dots)
      const dots: {x: number, y: number, z: number}[] = [];
      for (let i = 0; i < 600; i++) {
          const phi = Math.acos(-1 + (2 * i) / 600);
          const theta = Math.sqrt(600 * Math.PI) * phi;
          dots.push({
              x: GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi),
              y: GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi),
              z: GLOBE_RADIUS * Math.cos(phi)
          });
      }

      const render = () => {
          // Clear
          ctx.fillStyle = '#050505'; // Dark bg
          ctx.fillRect(0, 0, width, height);

          const cx = width / 2;
          const cy = height / 2;

          // Auto Rotation
          if (!isDraggingRef.current) {
              rotationRef.current.y += 0.002;
          }

          // Rotation Matrix
          const rx = rotationRef.current.x;
          const ry = rotationRef.current.y;

          // Draw Sphere Dots
          ctx.fillStyle = '#1f2937'; // Dark gray dots
          dots.forEach(dot => {
             // Rotate Y
             let x = dot.x * Math.cos(ry) - dot.z * Math.sin(ry);
             let z = dot.z * Math.cos(ry) + dot.x * Math.sin(ry);
             // Rotate X
             let y = dot.y * Math.cos(rx) - z * Math.sin(rx);
             z = z * Math.cos(rx) + dot.y * Math.sin(rx);

             const scale = 300 / (300 + z); // Perspective
             const size = 1.5 * scale;
             const alpha = (z + GLOBE_RADIUS) / (2 * GLOBE_RADIUS); // Fade back dots

             if (z > -GLOBE_RADIUS) {
                 ctx.globalAlpha = Math.max(0.1, alpha * 0.3);
                 ctx.beginPath();
                 ctx.arc(cx + x * scale, cy + y * scale, size, 0, Math.PI * 2);
                 ctx.fill();
             }
          });

          // Draw Filtered Users (Pins)
          filteredUsers.forEach(user => {
              // Convert Lat/Lng to 3D
              const phi = (90 - user.lat) * (Math.PI / 180);
              const theta = (user.lng + 180) * (Math.PI / 180);
              
              const rawX = -(GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta));
              const rawZ = (GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta));
              const rawY = (GLOBE_RADIUS * Math.cos(phi));

              // Rotate
              let x = rawX * Math.cos(ry) - rawZ * Math.sin(ry);
              let z = rawZ * Math.cos(ry) + rawX * Math.sin(ry);
              let y = rawY * Math.cos(rx) - z * Math.sin(rx);
              z = z * Math.cos(rx) + rawY * Math.sin(rx);

              const scale = 300 / (300 + z);
              
              // Only draw if on front side
              if (z > 20) {
                  // Draw Pin
                  const pinX = cx + x * scale;
                  const pinY = cy + y * scale;

                  // Colors
                  const glowColor = user.isCurrentUser ? '#10b981' : '#3b82f6'; // Green for self, Blue for others
                  const coreColor = user.isCurrentUser ? '#34d399' : '#60a5fa';

                  // Glow
                  ctx.globalAlpha = 0.6;
                  ctx.fillStyle = glowColor;
                  ctx.beginPath();
                  ctx.arc(pinX, pinY, (user.isCurrentUser ? 10 : 8) * scale, 0, Math.PI * 2);
                  ctx.fill();

                  // Core
                  ctx.globalAlpha = 1;
                  ctx.fillStyle = coreColor;
                  ctx.beginPath();
                  ctx.arc(pinX, pinY, (user.isCurrentUser ? 4 : 3) * scale, 0, Math.PI * 2);
                  ctx.fill();
              }
          });

          requestRef.current = requestAnimationFrame(render);
      };

      render();

      return () => cancelAnimationFrame(requestRef.current);
  }, [filteredUsers]);

  const handleMouseDown = (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      
      rotationRef.current.y += dx * 0.005;
      rotationRef.current.x += dy * 0.005;
      
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
      isDraggingRef.current = false;
  };

  // Simple Hit Test Logic (Mocked via list selection for now for reliability in canvas)
  const handleUserSelect = (user: GlobeUser) => {
      setSelectedUser(user);
  };

  const togglePin = (val: boolean) => {
      onUpdateProfile({ ...profile, isLocationPinned: val });
  };

  return (
    <div className="h-full flex flex-col relative bg-[#050505]">
        {/* Header & Search */}
        <div className="p-8 border-b border-gray-800 bg-black/50 backdrop-blur-sm z-20 relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Global Network</h2>
                    <p className="text-gray-400 text-sm mt-1">Find and connect with creators worldwide.</p>
                </div>
                
                {/* Privacy Toggle */}
                <div className="flex flex-col items-end">
                   <div className="flex items-center space-x-3 bg-gray-900 p-2 rounded-xl border border-gray-800">
                       <div className="flex items-center space-x-2 px-2">
                           <MapPin size={16} className={profile.isLocationPinned ? "text-green-400" : "text-gray-500"} />
                           <span className={`text-sm font-medium ${profile.isLocationPinned ? 'text-white' : 'text-gray-500'}`}>
                               {profile.isLocationPinned ? 'Location Pinned' : 'Location Hidden'}
                           </span>
                       </div>
                       <button 
                        onClick={() => togglePin(!profile.isLocationPinned)}
                        className="text-gray-400 hover:text-white transition-colors"
                       >
                           {profile.isLocationPinned ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} />}
                       </button>
                   </div>
                </div>
            </div>

            {/* User Map Profile Editor (Visible when Pinned) */}
            {profile.isLocationPinned && (
                <div className="mb-6 bg-green-900/10 border border-green-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                   <div className="flex items-center space-x-2 mb-3">
                      <MapPin size={14} className="text-green-400" />
                      <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider">My Map Card</h4>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">My Profession</label>
                          <input 
                            type="text" 
                            value={profile.profession || ''} 
                            onChange={(e) => onUpdateProfile({ ...profile, profession: e.target.value })}
                            placeholder="e.g. Photographer"
                            className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-green-500"
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">My Location (City/Region)</label>
                          <input 
                            type="text" 
                            value={profile.locationName || ''} 
                            onChange={(e) => onUpdateProfile({ ...profile, locationName: e.target.value })}
                            placeholder="e.g. New York, USA"
                            className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-green-500"
                          />
                       </div>
                   </div>
                   <p className="text-[10px] text-gray-500 mt-2 italic">
                       *Updating location will move your pin on the map (simulated for demo).
                   </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search city or region (e.g. Miami)" 
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search profession (e.g. Photographer)" 
                        value={searchProfession}
                        onChange={(e) => setSearchProfession(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Privacy Disclaimer */}
            <div className="mt-4 flex items-start space-x-2 text-[11px] text-gray-500 bg-blue-900/10 p-3 rounded-lg border border-blue-500/20">
                <Shield size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <p>
                    <span className="font-bold text-blue-400">Privacy Notice:</span> By pinning your location, other users can see your profile and contact you via email form only. 
                    Your personal phone number and direct contact details are never shared publicly. You can opt-out anytime.
                </p>
            </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Overlay List (To make selection easier than clicking 3D dots in this demo) */}
            <div className="absolute top-4 right-4 w-64 max-h-[60%] overflow-y-auto bg-black/80 backdrop-blur border border-gray-800 rounded-xl p-2 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 px-2 py-1 uppercase flex justify-between">
                    <span>Visible Users</span>
                    <span className="text-gray-600">{filteredUsers.length}</span>
                </h4>
                {filteredUsers.map(user => (
                    <div 
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors group ${user.isCurrentUser ? 'bg-green-900/20 border border-green-500/30' : 'hover:bg-gray-800'}`}
                    >
                        <img src={user.avatarUrl} alt={user.displayName} className={`w-8 h-8 rounded-full object-cover ${user.isCurrentUser ? 'border-2 border-green-500' : 'border border-gray-600'}`} />
                        <div className="min-w-0">
                            <div className={`text-sm font-medium truncate group-hover:text-blue-400 ${user.isCurrentUser ? 'text-green-400' : 'text-white'}`}>
                                {user.displayName} {user.isCurrentUser && '(You)'}
                            </div>
                            <div className="text-xs text-gray-500 truncate">{user.locationName}</div>
                        </div>
                    </div>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="text-xs text-gray-500 p-2 text-center">No users found in this area.</div>
                )}
            </div>
        </div>

        {/* Selected User Modal */}
        {selectedUser && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-[#111] border border-gray-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                    <button 
                        onClick={() => setSelectedUser(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-24 h-24 rounded-full border-2 p-1 mb-4 ${selectedUser.isCurrentUser ? 'border-green-500' : 'border-blue-500'}`}>
                            <img src={selectedUser.avatarUrl} alt={selectedUser.displayName} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{selectedUser.displayName}</h3>
                        <span className={`${selectedUser.isCurrentUser ? 'text-green-400' : 'text-blue-400'} text-sm font-medium uppercase tracking-wide mt-1`}>
                            {selectedUser.profession}
                        </span>
                        
                        <div className="flex items-center space-x-1 text-gray-400 text-xs mt-2 mb-4">
                            <MapPin size={12} />
                            <span>{selectedUser.locationName}</span>
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            {selectedUser.bio}
                        </p>

                        {selectedUser.isCurrentUser ? (
                            <div className="w-full bg-gray-900/50 p-4 rounded-xl border border-gray-800 text-gray-400 text-xs">
                                This is your public card preview.
                            </div>
                        ) : (
                            <form className="w-full space-y-3 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                <h4 className="text-xs font-bold text-white uppercase text-left mb-1">Send Message</h4>
                                <input type="text" placeholder="Your Email" className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-blue-500" />
                                <textarea rows={3} placeholder="Hi, I'd like to connect..." className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-blue-500 resize-none"></textarea>
                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors">
                                    <Mail size={14} />
                                    <span>Send Email</span>
                                </button>
                            </form>
                        )}
                        
                        {!selectedUser.isCurrentUser && (
                            <p className="text-[10px] text-gray-500 mt-3">
                                Private & Secure. Your email is sent via Goat Unit Relay.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default CommunityGlobe;
