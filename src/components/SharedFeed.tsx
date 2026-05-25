/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tile, Friend, MoodType, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SharedFeedProps {
  tiles: Tile[];
  friends: Friend[];
  currentUser: User;
  onTileClick: (tile: Tile) => void;
  onAddFriend: (username: string) => void;
  onRemoveFriend: (friendId: string) => void;
  onNavigateToJournal: () => void;
  onReact: (tileId: string, emoji: '❤️' | '🌱' | '☀️' | '💤') => void;
}

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export default function SharedFeed({
  tiles,
  friends,
  currentUser,
  onTileClick,
  onAddFriend,
  onRemoveFriend,
  onNavigateToJournal,
  onReact,
}: SharedFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  // Count active friends
  const activeFriends = friends.filter((f) => f.status === 'friends');
  const pendingFriends = friends.filter((f) => f.status === 'pending');
  const requestedFriends = friends.filter((f) => f.status === 'requested');

  const todayDateStr = new Date().toISOString().slice(0, 10);
  const userHasPostedToday = tiles.some(
    (tile) => tile.user_id === currentUser.id && tile.date === todayDateStr
  );

  // Group tiles by date (reverse-chronological)
  // Only display friends' tiles
  const friendTileDates = Array.from(
    new Set(
      tiles
        .filter((t) => t.user_id !== currentUser.id)
        .map((t) => t.date)
    )
  ).sort((a, b) => b.localeCompare(a)); // Sort latest first

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onAddFriend(searchQuery.trim());
    setToastMessage(`Sent a soft circle request to @${searchQuery.trim()}`);
    setSearchQuery('');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleFloatingReact = (e: React.MouseEvent, tileId: string, emoji: '❤️' | '🌱' | '☀️' | '💤') => {
    e.stopPropagation();
    onReact(tileId, emoji);

    // Create drifting floaters
    const newParticles = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      emoji,
      x: e.clientX + (Math.random() * 40 - 20),
      y: e.clientY - 15,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);
  };

  const moodToEmoji = (mood: MoodType) => {
    switch (mood) {
      case 'heart': return '❤️';
      case 'sprout': return '🌱';
      case 'sun': return '☀️';
      case 'zzz': return '💤';
      default: return '✨';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-5 pb-32 pt-4 select-none animate-fade-in font-serif">
      <div className="grain-overlay"></div>

      {/* FLOATING PARTICLES INTERACTIVE LAYER */}
      <div className="fixed inset-0 pointer-events-none z-[110]">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.8, x: p.x, y: p.y }}
              animate={{
                opacity: 0,
                scale: 1.6,
                y: p.y - 120 - Math.random() * 40,
                x: p.x + (Math.random() * 50 - 25),
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute text-2xl"
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Toast Notification for premium interactions */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#fec3a6] border border-clay-outline/10 text-dark-charcoal px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide shadow-md z-50 font-sans"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-6 flex flex-col items-center">
        <h1 className="text-3xl font-semibold tracking-tight text-primary-brand text-center mb-1">Circle Feed</h1>
        <p className="font-sans text-[10px] text-muted-coffee/70 uppercase tracking-widest text-center mt-1">
          {activeFriends.length} friends connected softly
        </p>

        {/* Tab Switcher */}
        <div className="flex bg-[#ebe5aa]/25 p-1 rounded-full items-center mt-6 w-full max-w-xs justify-between border border-[#86736b]/15 font-sans">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-primary-brand text-white shadow-sm'
                : 'text-muted-coffee hover:text-primary-brand'
            }`}
          >
            Moments
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 text-center py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
              activeTab === 'friends'
                ? 'bg-primary-brand text-white shadow-sm'
                : 'text-muted-coffee hover:text-primary-brand'
            }`}
          >
            Connection
          </button>
        </div>
      </header>

      {/* FEED TAB DISPLAY */}
      {activeTab === 'feed' && (
        <div className="space-y-12 mt-6">
          {friendTileDates.map((dateStr) => {
            const isTodayDateStr = dateStr === todayDateStr;
            const dayTiles = tiles.filter(
              (t) => t.date === dateStr && t.user_id !== currentUser.id
            );

            if (dayTiles.length === 0) return null;

            const printDate = new Date(dateStr).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div key={dateStr} className="space-y-4 relative">
                <div className="flex justify-between items-center border-b border-clay-outline/10 pb-2">
                  <h3 className="font-serif italic text-xl text-primary-brand">
                    {printDate}
                    {isTodayDateStr && (
                      <span className="font-sans font-semibold text-[10px] tracking-widest uppercase text-secondary-brand bg-[#ffdad7] px-2 py-0.5 rounded-full ml-2">Today</span>
                    )}
                  </h3>
                  <span className="font-sans text-[10px] text-muted-coffee/50 uppercase tracking-widest font-semibold">
                    {dayTiles.length} {dayTiles.length === 1 ? 'snapshot' : 'snapshots'}
                  </span>
                </div>

                {/* TODAY FEED ENFORCING TILE LOCK SYSTEM */}
                {isTodayDateStr && !userHasPostedToday ? (
                  <div className="relative rounded-2xl overflow-hidden border border-clay-outline/15 shadow-sm p-8 bg-[#fdfae7]/60">
                    {/* Simulated Blurred locked card background */}
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-md z-10 flex flex-col justify-center items-center p-6 text-center select-none animate-pulse-slow">
                      <span className="material-symbols-outlined text-4xl text-primary-brand mb-3 font-fill-1">lock</span>
                      <h4 className="font-serif text-xl font-semibold mb-1 text-dark-charcoal">
                        Today's circle moments are tucked.
                      </h4>
                      <p className="font-serif text-sm italic text-muted-coffee max-w-sm mb-6 leading-relaxed">
                        To encourage slow reciprocity, write your own soft tile for today to unlock sienna_gold and julian_breeze's moments!
                      </p>
                      <button
                        onClick={onNavigateToJournal}
                        className="bg-primary-brand text-white text-xs font-semibold px-6 py-3 rounded-full uppercase tracking-widest hover:bg-[#703715] shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        Post today softly
                      </button>
                    </div>

                    {/* Previews under the blur to trigger nostalgic yearning */}
                    <div className="grid grid-cols-2 gap-4 filter blur-[6px] select-none pointer-events-none">
                      {dayTiles.map((t) => (
                        <div key={t.id} className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm p-2 flex flex-col">
                          <div className="w-full h-34 bg-stone-300 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Standard Unlocked Feed cards row */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {dayTiles.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onTileClick(t)}
                        className="bg-white border border-clay-outline/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col"
                      >
                        {/* Memory photo content */}
                        <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                          <img
                            alt="Friend micro snapshot"
                            src={t.image_url}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-white">
                            <img src={t.avatar_url} className="w-4 h-4 rounded-full object-cover border border-white" alt="friend" />
                            <span className="font-sans text-[10px] font-semibold tracking-wider">@{t.username}</span>
                          </div>

                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-sm">
                            {moodToEmoji(t.mood)}
                          </div>
                        </div>

                        {/* Caption & Quick reactions */}
                        <div className="p-4 flex flex-col justify-between flex-1 space-y-3 bg-[#fdfae7]/30">
                          <p className="font-serif italic text-dark-charcoal text-sm leading-relaxed">
                            "{t.caption}"
                          </p>

                          <div className="flex items-center justify-between border-t border-clay-outline/5 pt-3">
                            <span className="font-sans text-[9px] uppercase tracking-widest text-muted-coffee/50">
                              {new Date(t.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </span>

                            {/* Easy tap-to-react float icons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleFloatingReact(e, t.id, '❤️')}
                                className="w-7 h-7 bg-white hover:bg-[#ffdad7] border border-clay-outline/10 text-stone-400 hover:text-secondary-brand flex items-center justify-center rounded-full text-xs active:scale-125 transition-all shadow-sm cursor-pointer"
                              >
                                ❤️
                              </button>
                              <button
                                onClick={(e) => handleFloatingReact(e, t.id, '🌱')}
                                className="w-7 h-7 bg-white hover:bg-[#ceebc1] border border-clay-outline/10 text-stone-400 hover:text-tertiary-brand flex items-center justify-center rounded-full text-xs active:scale-125 transition-all shadow-sm cursor-pointer"
                              >
                                🌱
                              </button>
                              <button
                                onClick={(e) => handleFloatingReact(e, t.id, '☀️')}
                                className="w-7 h-7 bg-white hover:bg-amber-100 border border-clay-outline/10 text-stone-400 hover:text-amber-500 flex items-center justify-center rounded-full text-xs active:scale-125 transition-all shadow-sm cursor-pointer"
                              >
                                ☀️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FRIEND DIRECTORY TAB */}
      {activeTab === 'friends' && (
        <div className="space-y-8 mt-6">
          {/* Add friend search form */}
          <form onSubmit={handleSearchSubmit} className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider font-semibold text-primary-brand ml-1 font-sans">
              Add someone softly
            </label>
            <div className="flex gap-2.5">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search username... (e.g. lucas_wild)"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-b border-clay-outline/25 focus:border-primary-brand focus:outline-none focus:ring-0 py-2.5 font-serif text-[#1e1c00]"
              />
              <button
                type="submit"
                className="bg-primary-brand text-white hover:bg-[#703715] px-6 py-2 rounded-full font-sans text-xs uppercase tracking-widest font-semibold cursor-pointer"
              >
                Send
              </button>
            </div>
          </form>

          {/* Incoming requests (Elena has requested!) */}
          {requestedFriends.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-sans text-[11px] uppercase tracking-widest text-secondary-brand font-semibold">
                Incoming Sanctuary Invites ({requestedFriends.length})
              </h3>
              {requestedFriends.map((f) => (
                <div key={f.id} className="bg-[#ffdad7]/30 border border-[#ffb3ae]/30 rounded-xl p-3 flex justify-between items-center bg-white/50">
                  <div className="flex items-center gap-3">
                    <img src={f.avatar_url} className="w-10 h-10 rounded-full object-cover border border-white" alt="avatar" />
                    <div>
                      <p className="font-sans text-sm font-semibold">@{f.username}</p>
                      <p className="font-serif text-xs italic text-muted-coffee">Wants to observe together</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        f.status = 'friends';
                        setToastMessage(`Accepted @${f.username}'s circle request!`);
                        setTimeout(() => setToastMessage(''), 3000);
                      }}
                      className="bg-[#4c6544] hover:bg-[#32452c] text-white px-4 py-1.5 rounded-full font-sans text-2xs uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending outgoing request */}
          {pendingFriends.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-sans text-[11px] uppercase tracking-widest text-[#86736b]/60 font-semibold">
                Pending invitations ({pendingFriends.length})
              </h3>
              {pendingFriends.map((f) => (
                <div key={f.id} className="flex justify-between items-center p-3 border-b border-clay-outline/5 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={f.avatar_url} className="w-9 h-9 rounded-full object-cover" alt="avatar" />
                    <span className="font-sans text-sm font-semibold">@{f.username}</span>
                  </div>
                  <span className="font-sans text-[10px] uppercase font-semibold tracking-wider text-muted-coffee/50">Waiting...</span>
                </div>
              ))}
            </div>
          )}

          {/* Active Friends List */}
          <div className="space-y-3 mt-6">
            <h3 className="font-sans text-[11px] uppercase tracking-widest text-primary-brand font-semibold">
              Slow Observers ({activeFriends.length})
            </h3>
            {activeFriends.map((f) => (
              <div
                key={f.id}
                className="flex justify-between items-center p-4 bg-white/40 border border-clay-outline/10 rounded-xl hover:bg-white/60 transition-all shadow-2-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={f.avatar_url} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" alt="profile" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-dark-charcoal">@{f.username}</p>
                    <p className="font-serif text-xs text-muted-coffee italic">Observing since May 2026</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onRemoveFriend(f.id);
                    setToastMessage(`Disconnected softly from @${f.username}`);
                    setTimeout(() => setToastMessage(''), 3000);
                  }}
                  className="text-stone-400 hover:text-secondary-brand p-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">no_accounts</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
