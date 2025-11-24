
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LivePreview from './components/LivePreview';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';
import LinksManager from './components/LinksManager';
import Leads from './components/Leads';
import UserDirectory from './components/UserDirectory';
import Analytics from './components/Analytics';
import Store from './components/Store'; 
import CommunityGlobe from './components/CommunityGlobe'; 
import BulletinBoard from './components/BulletinBoard'; 
import Login from './components/Login';
import { ViewState, Profile, LinkItem } from './types';
import { INITIAL_PROFILE, INITIAL_LINKS, BLANK_PROFILE } from './constants';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // App State
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Loads the Demo Profile (McClary)
  const handleLogin = () => {
    setProfile(INITIAL_PROFILE);
    setLinks(INITIAL_LINKS);
    setIsAuthenticated(true);
  };

  // Loads a Fresh Blank Profile
  const handleSignup = (username: string) => {
    setProfile({
      ...BLANK_PROFILE,
      username: username,
      displayName: username, 
    });
    setLinks([]); // Start with no links
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard'); // Reset view on logout
  };

  const renderCenterPanel = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard profile={profile} activeLinksCount={links.filter(l => l.isActive).length} />;
      case 'edit-profile':
        return <EditProfile profile={profile} onUpdateProfile={setProfile} />;
      case 'links':
        return <LinksManager links={links} setLinks={setLinks} />;
      case 'leads':
        return <Leads />;
      case 'users':
        return <UserDirectory />;
      case 'analytics':
        return <Analytics />;
      case 'store':
        return <Store profile={profile} onUpdateProfile={setProfile} />;
      case 'community':
        return (
          <CommunityGlobe 
            profile={profile}
            onUpdateProfile={setProfile}
          />
        );
      case 'bulletin':
        return (
          <BulletinBoard 
            profile={profile}
            onUpdateProfile={setProfile}
          />
        );
      case 'options':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Card Options Coming Soon
          </div>
        );
      default:
        return <Dashboard profile={profile} activeLinksCount={links.filter(l => l.isActive).length} />;
    }
  };

  // If not logged in, show Login Screen
  if (!isAuthenticated) {
    return (
      <Login 
        onLogin={handleLogin} 
        onSignup={handleSignup}
      />
    );
  }

  // If logged in, show Main App
  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden relative">
      
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-[#0a0a0a] border-b border-gray-800 flex items-center px-4 z-40 justify-between">
        <div className="flex items-center space-x-2">
            <img 
               src={profile.dashboardLogoUrl || "https://placehold.co/400x400/0a0a0a/ffffff.png?text=GOAT+UNIT"} 
               alt="Logo" 
               className="h-8 w-auto object-contain"
            />
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2">
            <Menu size={24} />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Panel: Sidebar (Responsive) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          currentView={currentView} 
          onChangeView={setCurrentView} 
          profile={profile} 
          onLogout={handleLogout}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Center Panel: Main Content */}
      <main className="flex-1 bg-[#0f0f0f] relative overflow-hidden border-l border-r border-gray-800 flex flex-col pt-16 md:pt-0">
        {renderCenterPanel()}
      </main>

      {/* Right Panel: Live Preview */}
      <aside className="w-[420px] bg-black flex-shrink-0 hidden xl:block z-20">
        <LivePreview profile={profile} links={links} />
      </aside>
    </div>
  );
};

export default App;
