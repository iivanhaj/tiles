/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Tile, Friend, User, MoodType, ScreenState } from './types';
import { INITIAL_TILES, MOCK_FRIENDS, DEFAULT_USER } from './data/mockData';

// Component imports
import Onboarding from './components/Onboarding';
import CalendarView from './components/CalendarView';
import TileModal from './components/TileModal';
import CreateTile from './components/CreateTile';
import SharedFeed from './components/SharedFeed';
import ProfileView from './components/ProfileView';

import { motion, AnimatePresence } from 'motion/react';

const DAILY_QUOTES = [
  "“We do not remember days, we remember moments.” — Cesare Pavese",
  "“Collect moments, not things.”",
  "“The slow life is where the small colors shine the brightest.”",
  "“Soft focus, warm thoughts, slow days.”",
  "“Your life is a living collage of memories.”",
  "“Tuck today softly into your gallery.”"
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeTab, setActiveTab] = useState<ScreenState>('onboarding');
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  
  const [quoteToast, setQuoteToast] = useState('');

  // 1. Initial State Syncing
  useEffect(() => {
    // Sync User session
    const storedUser = localStorage.getItem('tiles_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        setActiveTab('gallery');
      } catch (e) {
        localStorage.removeItem('tiles_user');
      }
    } else {
      setActiveTab('onboarding');
    }

    // Sync Tiles list
    const storedTiles = localStorage.getItem('tiles_db');
    if (storedTiles) {
      try {
        setTiles(JSON.parse(storedTiles));
      } catch (e) {
        setTiles(INITIAL_TILES);
        localStorage.setItem('tiles_db', JSON.stringify(INITIAL_TILES));
      }
    } else {
      setTiles(INITIAL_TILES);
      localStorage.setItem('tiles_db', JSON.stringify(INITIAL_TILES));
    }

    // Sync Friends list
    const storedFriends = localStorage.getItem('friends_db');
    if (storedFriends) {
      try {
        setFriends(JSON.parse(storedFriends));
      } catch (e) {
        setFriends(MOCK_FRIENDS);
        localStorage.setItem('friends_db', JSON.stringify(MOCK_FRIENDS));
      }
    } else {
      setFriends(MOCK_FRIENDS);
      localStorage.setItem('friends_db', JSON.stringify(MOCK_FRIENDS));
    }
  }, []);

  // 2. Persist Helper
  const persistTiles = (updatedTiles: Tile[]) => {
    setTiles(updatedTiles);
    localStorage.setItem('tiles_db', JSON.stringify(updatedTiles));
  };

  const persistFriends = (updatedFriends: Friend[]) => {
    setFriends(updatedFriends);
    localStorage.setItem('friends_db', JSON.stringify(updatedFriends));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('tiles_user', JSON.stringify(user));
    setActiveTab('gallery');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tiles_user');
    setActiveTab('onboarding');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('tiles_user', JSON.stringify(updatedUser));
  };

  // 3. Save new memory tile
  const handleSaveTile = (data: { image_url: string; caption: string; mood: MoodType }) => {
    if (!currentUser) return;

    const todayDateStr = new Date().toISOString().slice(0, 10);

    // Clean any prior tile for this user on the same day (maintain 1 memory limit)
    const filtered = tiles.filter(
      (t) => !(t.user_id === currentUser.id && t.date === todayDateStr)
    );

    const newTile: Tile = {
      id: `tile_${Date.now()}`,
      user_id: currentUser.id,
      username: currentUser.username,
      avatar_url: currentUser.avatar_url,
      date: todayDateStr,
      image_url: data.image_url,
      caption: data.caption,
      mood: data.mood,
      created_at: new Date().toISOString(),
      reactions: [],
    };

    const nextTiles = [newTile, ...filtered];
    persistTiles(nextTiles);
    
    // Smooth transition back to Gallery
    setActiveTab('gallery');
    
    // Popup soft confirmation quote
    triggerQuoteToast();
  };

  // 4. Handle Emoji Reactions
  const handleReactToTile = (tileId: string, emoji: '❤️' | '🌱' | '☀️' | '💤') => {
    if (!currentUser) return;

    const nextTiles = tiles.map((t) => {
      if (t.id !== tileId) return t;

      // Filter existing user reaction with the same emoji (avoid duplicates)
      const alreadyHas = t.reactions.some(
        (r) => r.user_id === currentUser.id && r.emoji === emoji
      );
      if (alreadyHas) return t;

      const newReaction = {
        id: `react_${Date.now()}`,
        tile_id: tileId,
        user_id: currentUser.id,
        username: currentUser.username,
        emoji,
      };

      return {
        ...t,
        reactions: [...t.reactions, newReaction],
      };
    });

    persistTiles(nextTiles);

    // If active modal is open, sync modal state
    if (selectedTile && selectedTile.id === tileId) {
      const match = nextTiles.find((t) => t.id === tileId);
      if (match) setSelectedTile(match);
    }
  };

  // 5. Add / Remove Friends
  const handleAddFriend = (username: string) => {
    const cleanUsername = username.replaceAll('@', '').trim();
    if (!cleanUsername) return;

    // Check if friend was already added
    const alreadyExists = friends.some((f) => f.username === cleanUsername);
    if (alreadyExists) return;

    const newFriend: Friend = {
      id: `friend_${Date.now()}`,
      username: cleanUsername,
      avatar_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&w=150&q=80`,
      status: 'pending',
    };

    persistFriends([newFriend, ...friends]);
  };

  const handleRemoveFriend = (friendId: string) => {
    const nextFriends = friends.filter((f) => f.id !== friendId);
    persistFriends(nextFriends);
  };

  const triggerQuoteToast = () => {
    const randomQuote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
    setQuoteToast(randomQuote);
    setTimeout(() => {
      setQuoteToast('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-custard text-dark-charcoal font-serif antialiased selection:bg-primary-container selection:text-on-primary-container relative pb-12">
      <div className="grain-overlay"></div>

      {/* Atmospheric Quote Toast */}
      <AnimatePresence>
        {quoteToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-28 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bg-white/95 backdrop-blur-md border border-[#8d4e2a]/15 px-6 py-4 rounded-xl text-center shadow-lg font-serif italic text-primary-brand text-sm sm:w-96 text-center z-50 cursor-pointer"
            onClick={() => setQuoteToast('')}
          >
            {quoteToast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === 'onboarding' ? (
          <motion.div 
            key="onboarding" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Onboarding onLogin={handleLogin} />
          </motion.div>
        ) : (
          <div className="flex flex-col min-h-screen">
            
            {/* STICKY TOP APP BAR FOR THE SYSTEM */}
            <header className="sticky top-0 w-full z-40 flex justify-between items-center px-6 py-4 bg-custard/90 backdrop-blur-md border-b border-[#86736b]/15">
              <div 
                onClick={() => setActiveTab('gallery')}
                className="flex items-center gap-2 cursor-pointer text-primary-brand"
              >
                <span className="material-symbols-outlined font-light scale-115">brush</span>
                <span className="font-serif text-2xl font-semibold tracking-tight">Tiles</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    triggerQuoteToast();
                  }}
                  className="material-symbols-outlined text-muted-coffee hover:text-primary-brand transition-colors cursor-pointer text-xl"
                  title="Generate a cozy quote"
                >
                  eco
                </button>
                <div 
                  onClick={() => setActiveTab('self')}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#86736b]/40 p-0.5 cursor-pointer hover:border-primary-brand transition-all"
                >
                  <img 
                    alt="User Profile" 
                    className="w-full h-full object-cover rounded-full" 
                    src={currentUser?.avatar_url || DEFAULT_USER.avatar_url} 
                  />
                </div>
              </div>
            </header>

            {/* TAB CONTAINER BODY */}
            <main className="flex-1 mt-4">
              <AnimatePresence mode="wait">
                {activeTab === 'gallery' && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CalendarView
                      tiles={tiles}
                      currentUser={currentUser!}
                      onTileClick={setSelectedTile}
                      onNavigateToJournal={() => setActiveTab('journal')}
                      onNavigateToTab={setActiveTab}
                    />
                  </motion.div>
                )}

                {activeTab === 'journal' && (
                  <motion.div
                    key="journal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CreateTile
                      onSave={handleSaveTile}
                      onCancel={() => setActiveTab('gallery')}
                    />
                  </motion.div>
                )}

                {activeTab === 'circle' && (
                  <motion.div
                    key="circle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SharedFeed
                      tiles={tiles}
                      friends={friends}
                      currentUser={currentUser!}
                      onTileClick={setSelectedTile}
                      onAddFriend={handleAddFriend}
                      onRemoveFriend={handleRemoveFriend}
                      onNavigateToJournal={() => setActiveTab('journal')}
                      onReact={handleReactToTile}
                    />
                  </motion.div>
                )}

                {activeTab === 'self' && (
                  <motion.div
                    key="self"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProfileView
                      currentUser={currentUser!}
                      tiles={tiles}
                      onUpdateUser={handleUpdateProfile}
                      onLogout={handleLogout}
                      onTileClick={setSelectedTile}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* HIGH-END FIXED BOTTOM NAVIGATION TAB BAR */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-40 flex justify-between items-center p-2 bg-white/80 backdrop-blur-xl border border-clay-variant/50 shadow-2xl rounded-2xl">
              
              {/* Gallery button */}
              <button 
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${
                  activeTab === 'gallery' ? 'text-primary-brand font-medium' : 'text-muted-coffee/60 hover:text-primary-brand'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl ${activeTab === 'gallery' ? 'font-fill-1' : ''}`}>grid_view</span>
                <span className="text-[10px] uppercase font-sans tracking-widest mt-1 font-semibold">Gallery</span>
              </button>

              {/* Journal / post */}
              <button 
                onClick={() => setActiveTab('journal')}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${
                  activeTab === 'journal' ? 'text-primary-brand font-medium' : 'text-muted-coffee/60 hover:text-primary-brand'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl ${activeTab === 'journal' ? 'font-fill-1' : ''}`}>add_circle</span>
                <span className="text-[10px] uppercase font-sans tracking-widest mt-1 font-semibold font-medium">Journal</span>
              </button>

              {/* Center magic interactive sparkles button */}
              <div 
                onClick={() => {
                  triggerQuoteToast();
                  // redirect to journal if not posted
                }}
                className="w-12 h-12 bg-primary-brand rounded-xl flex items-center justify-center shadow-lg shadow-primary-brand/35 -mt-8 border-4 border-custard transform rotate-3 active:rotate-0 hover:rotate-6 transition-all cursor-pointer"
                title="Spark slow memory quotes"
              >
                <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
              </div>

              {/* Circle feed */}
              <button 
                onClick={() => setActiveTab('circle')}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${
                  activeTab === 'circle' ? 'text-primary-brand font-medium' : 'text-muted-coffee/60 hover:text-primary-brand'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl ${activeTab === 'circle' ? 'font-fill-1' : ''}`}>group</span>
                <span className="text-[10px] uppercase font-sans tracking-widest mt-1 font-semibold">Circle</span>
              </button>

              {/* Self / profile */}
              <button 
                onClick={() => setActiveTab('self')}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors cursor-pointer ${
                  activeTab === 'self' ? 'text-primary-brand font-medium' : 'text-muted-coffee/60 hover:text-[#8d4e2a]'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl ${activeTab === 'self' ? 'font-fill-1' : ''}`}>settings</span>
                <span className="text-[10px] uppercase font-sans tracking-widest mt-1 font-semibold">Self</span>
              </button>

            </nav>

          </div>
        )}
      </AnimatePresence>

      {/* DETAILED OVERLAY MODAL */}
      <AnimatePresence>
        {selectedTile && currentUser && (
          <TileModal
            tile={selectedTile}
            currentUser={currentUser}
            onClose={() => setSelectedTile(null)}
            onReact={handleReactToTile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
