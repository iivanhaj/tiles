/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Tile, MoodType, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TileModalProps {
  tile: Tile;
  currentUser: User;
  onClose: () => void;
  onReact: (tileId: string, emoji: '❤️' | '🌱' | '☀️' | '💤') => void;
}

interface FloatingParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export default function TileModal({ tile, currentUser, onClose, onReact }: TileModalProps) {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const triggerReactionAnimation = (emoji: '❤️' | '🌱' | '☀️' | '💤', clientX: number, clientY: number) => {
    // Generate 4-5 floating particles drifting upwards
    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      emoji,
      x: clientX + (Math.random() * 40 - 20),
      y: clientY - (Math.random() * 20),
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    onReact(tile.id, emoji);

    // Clean up particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1100);
  };

  const activeReactions = tile.reactions || [];
  // Count counts of different reactions
  const reactionCounts = activeReactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodToEmoji = (mood: MoodType) => {
    switch (mood) {
      case 'heart': return '❤️';
      case 'sprout': return '🌱';
      case 'sun': return '☀️';
      case 'zzz': return '💤';
      default: return '✨';
    }
  };

  const getMoodLabel = (mood: MoodType) => {
    switch (mood) {
      case 'heart': return 'Warm';
      case 'sprout': return 'Fresh';
      case 'sun': return 'Radiant';
      case 'zzz': return 'Quiet';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden bg-black/60 backdrop-blur-md select-none">
      
      {/* Absolute background close area */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Floating physical particles container */}
      <div className="fixed inset-0 pointer-events-none z-[60]">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.8, x: p.x, y: p.y }}
              animate={{
                opacity: 0,
                scale: 1.5,
                y: p.y - 140 - Math.random() * 50,
                x: p.x + (Math.random() * 60 - 30),
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute text-2xl"
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Container */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-2xl h-[85vh] md:h-[750px] flex flex-col rounded-2xl overflow-hidden bg-custard shadow-2xl border border-clay-outline/10 z-10"
      >
        {/* Full Image background container */}
        <div className="relative flex-1 w-full h-full overflow-hidden bg-black/90">
          <img 
            alt={tile.caption} 
            className="w-full h-full object-cover opacity-95 transition-transform duration-[6s] hover:scale-105" 
            src={tile.image_url} 
          />

          {/* Glowing aura or gradient behind details */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none"></div>

          {/* Top Floating Action Header */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
            <button 
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined font-light text-2xl">close</span>
            </button>
            <div className="flex gap-2">
              <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 active:scale-95 transition-all cursor-pointer">
                <span className="material-symbols-outlined font-light text-2xl">share</span>
              </button>
              <button 
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined font-light text-2xl">more_vert</span>
              </button>
            </div>
          </div>

          {/* Glassmorphic Description Overlay block at the bottom */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/15 backdrop-blur-xl border border-white/25 px-6 py-6 rounded-2xl z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-white/40">
                  <img alt={tile.username} className="w-full h-full object-cover" src={tile.avatar_url} />
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90 font-sans">
                  {tile.username} • {new Date(tile.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h1 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-white leading-tight">
                {getMoodLabel(tile.mood)} moment {moodToEmoji(tile.mood)}
              </h1>
              <p className="font-serif text-lg text-white/80 leading-relaxed italic pr-4">
                "{tile.caption}"
              </p>

              {/* Shared with Circle list */}
              <div className="flex items-center gap-2 pt-1 font-sans">
                <div className="flex -space-x-2">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzjGzJ0wMlpLwMLenVYCN-k0PPw2PAGt-6SYIIH7BWgZdB9WiQNPL-WSYebU2RQrd0AMOO8F02_1TW3PO7sLSRCLgm9_AmrVh-DsKRd77K9ypi6llIaqb7a-N-Z0koyGjlv3Qxp8UNDsp8enYp7H2bfDK5I7Pd53u0Moi3WAfyJW26i_2l6_IjH-YDPOs5ICBAiV8KMgnE0UYFy-wOeOzhqP0rZwbxX1ofmqKlDtntLcVHgsRrCK1toRmcnx_tLfPTLUpGbCtYc4vh" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="friend" />
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfwzGEXqxW966npU1rVxBHFcZ17M1WVquPgDn3LCwwNAiaqmnju-ceftckN1Eqy-Fk3X4keHmzGB1YT6w58D0K7YJMnvc3pMdY0rRPR1FWQtAys-wfOsEtB_pxgkTfDR_wgx2KQma6K3wbqm1bLaxahhOhWOLWvXOLV9UBEJFWm_BS7nqKmNYdFYROfjNOt2UY1WIaKGi2yfm8--x3xBzrwUCGS3w28-Ho3nUouko9TS4i_ovgIBekGuijeTsAPUz07tlosRrZIqZS" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="friend" />
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-peach-fuzz text-[10px] flex items-center justify-center text-primary-brand font-semibold">
                    +2
                  </div>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">Inner Circle</span>
              </div>
            </div>

            {/* Reactions Block */}
            <div className="flex items-center gap-2 self-start sm:self-end">
              <div className="flex items-center gap-4 bg-white/70 px-4 py-2.5 rounded-full border border-white/40 shadow-sm font-sans">
                {/* Heart React */}
                <button 
                  onClick={(e) => triggerReactionAnimation('❤️', e.clientX, e.clientY)}
                  className="flex items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[19px] ${reactionCounts['❤️'] ? 'text-secondary-brand font-fill-1' : 'text-stone-400 group-hover:text-secondary-brand'}`}>favorite</span>
                  <span className="text-xs font-semibold text-dark-charcoal">{reactionCounts['❤️'] || 0}</span>
                </button>
                <div className="w-[1.5px] h-4 bg-[#8d4e2a]/15"></div>

                {/* Sprout React */}
                <button 
                  onClick={(e) => triggerReactionAnimation('🌱', e.clientX, e.clientY)}
                  className="flex items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[19px] ${reactionCounts['🌱'] ? 'text-tertiary-brand font-fill-1' : 'text-stone-400 group-hover:text-tertiary-brand'}`}>eco</span>
                  <span className="text-xs font-semibold text-dark-charcoal">{reactionCounts['🌱'] || 0}</span>
                </button>
                <div className="w-[1.5px] h-4 bg-[#8d4e2a]/15"></div>

                {/* Sun React */}
                <button 
                  onClick={(e) => triggerReactionAnimation('☀️', e.clientX, e.clientY)}
                  className="flex items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[19px] ${reactionCounts['☀️'] ? 'text-amber-600 font-fill-1' : 'text-stone-400 group-hover:text-amber-600'}`}>light_mode</span>
                  <span className="text-xs font-semibold text-dark-charcoal">{reactionCounts['☀️'] || 0}</span>
                </button>
              </div>

              {/* Add Custom Reaction plus picker */}
              <div className="relative">
                <button 
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-brand text-white shadow-md hover:bg-[#703715] active:scale-90 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>

                {showReactionPicker && (
                  <div className="absolute bottom-12 right-0 bg-white border border-clay-outline/10 shadow-lg rounded-full p-2 flex gap-2 z-55 animate-slide-up">
                    {(['❤️', '🌱', '☀️', '💤'] as const).map((emoji) => (
                      <button
                        key={emoji}
                        onClick={(e) => {
                          triggerReactionAnimation(emoji, e.clientX, e.clientY);
                          setShowReactionPicker(false);
                        }}
                        className="w-8 h-8 rounded-full hover:bg-[#fffadf] flex items-center justify-center text-lg active:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.main>
    </div>
  );
}
