/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Tile, User } from '../types';

interface ProfileViewProps {
  currentUser: User;
  tiles: Tile[];
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
  onTileClick: (tile: Tile) => void;
}

export default function ProfileView({
  currentUser,
  tiles,
  onUpdateUser,
  onLogout,
  onTileClick,
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [newAvatar, setNewAvatar] = useState(currentUser.avatar_url);

  // Filter only user's tiles, ordered latest first
  const myTiles = tiles
    .filter((t) => t.user_id === currentUser.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalMoments = myTiles.length;
  // Calculate active streak count (using dates in May 2026, simple count for mock simulation)
  const streakCount = totalMoments > 0 ? Math.min(totalMoments + 2, 8) : 0;

  const handleSaveProfile = () => {
    if (newUsername.trim()) {
      onUpdateUser({
        ...currentUser,
        username: newUsername.trim(),
        avatar_url: newAvatar,
      });
      setIsEditing(false);
    }
  };

  const choosePresetAvatar = (url: string) => {
    setNewAvatar(url);
  };

  const presetAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDdC_o989ttA_KAXk6liAtjtvOrhpTmBrW45MPAVoVQETZK4KrdkRkonKLWYB1-odsMSUIc1Nhko7DU1iwhy2C161PdiLmEFqO99yPuIFjFzyjOC5bpBWmRDCAE2wtNj9iBmhLXgWVZArWUuh8VFjtxbx7Di0V3Hmgf9kgDPj5JYAQtbKneH5UsaHg99Yg-A2j1A1EoOyTFHpfNUY6skxvDAUaS03Cf1zVAC4CrlRSE5xiCvsf1gC1QeieSQUk39hsi-KmlgWgf0aD5',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBzjGzJ0wMlpLwMLenVYCN-k0PPw2PAGt-6SYIIH7BWgZdB9WiQNPL-WSYebU2RQrd0AMOO8F02_1TW3PO7sLSRCLgm9_AmrVh-DsKRd77K9ypi6llIaqb7a-N-Z0koyGjlv3Qxp8UNDsp8enYp7H2bfDK5I7Pd53u0Moi3WAfyJW26i_2l6_IjH-YDPOs5ICBAiV8KMgnE0UYFy-wOeOzhqP0rZwbxX1ofmqKlDtntLcVHgsRrCK1toRmcnx_tLfPTLUpGbCtYc4vh',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAfwzGEXqxW966npU1rVxBHFcZ17M1WVquPgDn3LCwwNAiaqmnju-ceftckN1Eqy-Fk3X4keHmzGB1YT6w58D0K7YJMnvc3pMdY0rRPR1FWQtAys-wfOsEtB_pxgkTfDR_wgx2KQma6K3wbqm1bLaxahhOhWOLWvXOLV9UBEJFWm_BS7nqKmNYdFYROfjNOt2UY1WIaKGi2yfm8--x3xBzrwUCGS3w28-Ho3nUouko9TS4i_ovgIBekGuijeTsAPUz07tlosRrZIqZS',
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-5 pb-32 pt-4 select-none animate-fade-in font-serif">
      <div className="grain-overlay"></div>

      {/* Profile Header card styled softly */}
      <section className="bg-white/40 border border-clay-outline/10 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-6 shadow-2-xs">
        
        {/* Profile picture */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md p-1 bg-peach-fuzz">
            <img src={currentUser.avatar_url} className="w-full h-full object-cover rounded-full" alt="avatar" />
          </div>
          <button 
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-brand text-white shadow-md flex items-center justify-center cursor-pointer hover:bg-[#703715] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
            <h2 className="text-2xl font-semibold tracking-tight text-primary-brand">@{currentUser.username}</h2>
            <span className="font-sans text-[10px] uppercase font-semibold tracking-widest bg-tertiary-container/30 text-[#3c5435] px-2.5 py-0.5 rounded-full inline-block self-center">
              Active observer
            </span>
          </div>
          <p className="font-sans text-xs text-muted-coffee/70">{currentUser.email || 'offline@sanctuary.com'}</p>
          <p className="font-serif italic text-xs text-[#8d4e2a]/80 pt-1">Observing May mornings caught in amber.</p>
        </div>

        {/* Logout action */}
        <button 
          onClick={onLogout}
          className="text-xs uppercase tracking-wider font-semibold hover:text-secondary-brand text-muted-coffee border border-[#85736b]/30 hover:border-secondary-brand/40 px-4 py-2 rounded-full cursor-pointer transition-colors font-sans"
        >
          Exit Sanctuary
        </button>
      </section>

      {/* Editing State fields */}
      {isEditing && (
        <section className="bg-white/80 border border-[#86736b]/20 p-5 rounded-xl mb-8 space-y-4 animate-slide-up">
          <h3 className="font-sans text-xs uppercase tracking-widest font-semibold text-primary-brand">Edit profile observations</h3>
          
          <div className="space-y-1 bg-transparent">
            <label className="block text-2xs uppercase tracking-wider font-semibold text-[#86736b]/70 font-sans ml-1">Observations moniker</label>
            <input 
              type="text" 
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-transparent border-b border-[#86736b]/30 focus:border-primary-brand focus:ring-0 py-2 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-2xs uppercase tracking-wider font-semibold text-[#86736b]/70 font-sans ml-1">Choose soft filter avatar</label>
            <div className="flex gap-4">
              {presetAvatars.map((url, index) => (
                <div 
                  key={index} 
                  onClick={() => choosePresetAvatar(url)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-transform duration-200 active:scale-95 ${newAvatar === url ? 'border-primary-brand scale-110' : 'border-transparent'}`}
                >
                  <img src={url} className="w-full h-full object-cover" alt="preset" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 font-sans text-xs">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-full text-muted-coffee"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveProfile}
              className="bg-primary-brand text-white hover:bg-[#703715] px-5 py-2 rounded-full font-semibold cursor-pointer shadow-2-xs"
            >
              Apply softly
            </button>
          </div>
        </section>
      )}

      {/* Statistics Row mimicking slow accomplishments */}
      <section className="grid grid-cols-2 gap-4 mb-8 font-sans">
        <div className="bg-[#fcf6ba]/45 border border-clay-outline/5 p-4 rounded-xl text-center space-y-1">
          <span className="material-symbols-outlined text-tertiary-brand text-2xl font-fill-1">eco</span>
          <p className="text-3xl font-serif italic text-tertiary-brand">{streakCount} days</p>
          <p className="text-[10px] uppercase font-semibold tracking-widest text-[#86736b]/60">Preservation Streak</p>
        </div>

        <div className="bg-[#fcf6ba]/45 border border-clay-outline/5 p-4 rounded-xl text-center space-y-1">
          <span className="material-symbols-outlined text-secondary-brand text-2xl font-fill-1">favorite</span>
          <p className="text-3xl font-serif italic text-secondary-brand">{totalMoments}</p>
          <p className="text-[10px] uppercase font-semibold tracking-widest text-[#86736b]/60">Caught Moments</p>
        </div>
      </section>

      {/* Personal Gallery Timeline grid */}
      <section className="space-y-4">
        <div className="border-b border-clay-outline/10 pb-2">
          <h3 className="font-serif italic text-xl text-[#8d4e2a]">My Tucked Moments</h3>
        </div>

        {myTiles.length === 0 ? (
          <div className="py-12 text-center text-muted-coffee/50 italic text-sm">
            <span className="material-symbols-outlined text-2xl mb-1 block">grid_off</span>
            No moments caught recently. Tap "Post" softly to start today.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {myTiles.map((t) => (
              <div 
                key={t.id}
                onClick={() => onTileClick(t)}
                className="aspect-square rounded-lg overflow-hidden border border-clay-outline/10 cursor-pointer shadow-sm relative group active:scale-95 transition-all"
              >
                <img src={t.image_url} className="w-full h-full object-cover grayscale-[0.05] contrast-[0.98] transition-all group-hover:scale-110 duration-500" alt="memory" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="absolute bottom-2 left-2 text-[10px] bg-white/55 backdrop-blur-md text-dark-charcoal px-1.5 py-0.5 rounded font-sans font-semibold">
                  {new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
