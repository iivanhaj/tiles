/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../types';
import { DEFAULT_USER } from '../data/mockData';

interface OnboardingProps {
  onLogin: (user: User) => void;
}

export default function Onboarding({ onLogin }: OnboardingProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(DEFAULT_USER);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide a soft email address.');
      return;
    }
    const finalUsername = username.trim() || email.split('@')[0];
    onLogin({
      id: `user_${Date.now()}`,
      username: finalUsername,
      avatar_url: DEFAULT_USER.avatar_url, // fallback beautiful avatar
      email: email,
    });
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-stretch overflow-hidden bg-custard text-dark-charcoal font-sans select-none animate-fade-in">
      <div className="grain-overlay"></div>

      {/* Left pane: Artisanal Showcase (Desktop Only) */}
      <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 bg-[#ebe5aa]/45 p-12 items-center justify-center border-r border-[#86736b]/15 overflow-hidden">
        <div className="relative w-full max-w-xl aspect-[4/5] grid grid-cols-12 grid-rows-12 gap-6">
          
          {/* Bento grid layout for aesthetic preview */}
          <div className="col-span-8 row-span-7 overflow-hidden rounded-xl border border-clay-outline/10 bg-peach-fuzz shadow-sm transition-transform duration-700 hover:scale-[1.01]">
            <img 
              alt="Mediterranean stone balcony" 
              className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Wt-9gyuriYhaX611Sa2ax9VxB33_9i4sp8xUiAFVVY6-2S61XDY9zvQ7mD_oQF3fcZFCJNMtXDRBCuGXhgsGredpzY-Dqf-oNb6Ggz139q3Evpxu86eC_jQmUwOx3e5W2PwDPBvPoMq8gobOwoVkqdkFgHzBbBuVha_auHiodPJt5qJuMvOwN4UwSyl3BHhModokiWLEhWlmm7FJ-Q7Up4KRNIem_AA0ZZc7Y6L8M_RZdd9SzjsPH_VZzMZcXQlBaWbQyIOXUW8H" 
            />
          </div>

          <div className="col-span-4 row-span-4 col-start-9 overflow-hidden rounded-xl bg-primary-container border border-clay-outline/10 shadow-sm transition-all duration-300 hover:rotate-1">
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-on-primary-container">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#793e1c]">auto_awesome</span>
              <p className="font-serif text-lg leading-tight italic font-medium">Moments caught in amber.</p>
            </div>
          </div>

          <div className="col-span-4 row-span-5 col-start-9 row-start-5 overflow-hidden rounded-xl border border-clay-outline/10 bg-peach-fuzz shadow-sm">
            <img 
              alt="Artisanal fountain notebook" 
              className="w-full h-full object-cover opacity-90 transition-transform duration-[4s] hover:scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPaqrLYvDiDiuUdISCP2J-j9jKGhouTZGop3HAjc3AUdTNJV8fYNHD4yZT6SzxAPIkSTj8I_1QmCUU9PjqzVz6alu1DYpfR3cm9YbuWaBIW-LagaI47pRUt5_sh8vTZTFwcZUs-usvbicFlb-kq8tCOu2tcMahYAvxxRSUNwsLVa9zuFmxUF75dzss7xexSNYinJxKxeqF7ZrpLLVU0JADdxBksdvTKzVgiOJQOcb7egyK6z5AFAj4zYiQsRqg4MvVkFrJ1Ycyh4st" 
            />
          </div>

          <div className="col-span-6 row-span-5 row-start-8 overflow-hidden rounded-xl border border-clay-outline/10 bg-white/70 shadow-sm p-6 flex flex-col justify-end transition-all hover:-translate-y-1">
            <p className="text-xs uppercase tracking-widest text-primary-brand font-medium mb-1">Today's Reflection</p>
            <p className="font-serif text-xl italic font-medium text-dark-charcoal leading-snug">"A quiet afternoon by the citrus groves."</p>
          </div>

          <div className="col-span-6 row-span-3 col-start-7 row-start-10 overflow-hidden rounded-xl border border-clay-outline/10 bg-tertiary-container shadow-sm flex items-center px-4 transition-all">
            <div className="flex items-center gap-3 text-[#3c5435]">
              <div className="w-9 h-9 rounded-full border border-[#3c5435]/40 flex items-center justify-center bg-white/30">
                <span className="material-symbols-outlined text-xl">play_gravity</span>
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold uppercase tracking-wider">Atmospheric sound</p>
                <p className="font-serif text-sm italic">Cicadas & Coastline</p>
              </div>
            </div>
          </div>

        </div>

        {/* Floating eco accent */}
        <div className="absolute top-8 right-8 text-[#4c6544]/5 select-none pointer-events-none">
          <span className="material-symbols-outlined text-[150px] font-thin">eco</span>
        </div>
      </section>

      {/* Right pane: Core Onboarding Flow */}
      <section className="flex-1 flex flex-col justify-between px-6 py-12 md:px-16 md:py-16 relative">
        <header className="flex justify-between items-center w-full max-w-md mx-auto">
          <div className="flex items-center gap-1.5 text-primary-brand">
            <span className="material-symbols-outlined text-2xl fill-1">grid_view</span>
            <span className="font-serif text-2xl font-semibold tracking-tight">Tiles</span>
          </div>
          <button className="text-xs font-semibold uppercase tracking-wider text-muted-coffee hover:text-primary-brand transition-colors">
            Language: EN
          </button>
        </header>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="space-y-2 mb-8 animate-slide-up">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-dark-charcoal leading-[1.1] tracking-tight">
              save today softly
            </h1>
            <p className="font-serif text-lg text-muted-coffee leading-relaxed">
              A sanctuary for your daily observations. Collect textures, colors, and memories in an artisanal grid designed for the slow life.
            </p>
          </div>

          <div className="space-y-6">
            {/* Google continue button */}
            <button 
              onClick={handleGoogleSubmit}
              className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-clay-outline/15 rounded-full hover:bg-white/90 active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M12 5.04c1.73 0 3.01.73 3.68 1.37l2.74-2.74C16.63 2.1 14.53 1 12 1 7.73 1 4.15 3.39 2.45 6.89l3.14 2.43C6.34 7.03 8.95 5.04 12 5.04z" fill="#EA4335"></path>
                <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.14 2.43c1.84-1.7 2.28-4.25 2.28-8.25z" fill="#4285F4"></path>
                <path d="M5.59 14.71c-.24-.73-.37-1.51-.37-2.31s.13-1.58.37-2.31L2.45 7.66C1.64 9.16 1.2 10.87 1.2 12.7s.44 3.54 1.25 5.04l3.14-3.03z" fill="#FBBC05"></path>
                <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.14-2.43c-1.03.69-2.35 1.1-4.14 1.1-3.05 0-5.66-1.98-6.59-4.73L2.45 17.68C4.15 21.18 7.73 23.5 12 23z" fill="#34A853"></path>
              </svg>
              <span className="text-sm font-semibold tracking-wide text-dark-charcoal">Continue with Google</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-clay-outline/10"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-widest text-[#86736b]/40">or</span>
              <div className="flex-grow border-t border-clay-outline/10"></div>
            </div>

            {/* Email simple forms */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-primary-brand ml-1">Username (Optional)</label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b border-clay-outline/25 focus:border-primary-brand focus:outline-none focus:ring-0 py-2.5 font-serif text-[#1e1c00]"
                  placeholder="e.g. wanderer"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-primary-brand ml-1">Email address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-transparent border-b border-clay-outline/25 focus:border-primary-brand focus:outline-none focus:ring-0 py-2.5 font-serif text-[#1e1c00]"
                  placeholder="example@studio.com"
                />
              </div>

              {error && (
                <p className="text-xs text-secondary-brand font-semibold italic">{error}</p>
              )}

              <button 
                type="submit"
                className="w-full h-14 bg-primary-brand hover:bg-[#703715] text-white rounded-full text-sm font-semibold tracking-wide shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                Create your sanctuary
              </button>
            </form>
          </div>
        </div>

        <footer className="w-full max-w-md mx-auto text-center">
          <p className="text-xs text-muted-coffee">
            Already have a grid? <span onClick={() => onLogin(DEFAULT_USER)} className="text-primary-brand font-bold hover:underline cursor-pointer">Log in</span>
          </p>
          <div className="mt-6 flex justify-center gap-6">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-coffee/60 hover:text-primary-brand cursor-pointer">Privacy</span>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-coffee/60 hover:text-primary-brand cursor-pointer">Terms</span>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-coffee/60 hover:text-primary-brand cursor-pointer">Curation</span>
          </div>
        </footer>

        {/* Mobile bottom banner matching the design mockup */}
        <div className="md:hidden mt-8 pt-6 border-t border-clay-outline/10">
          <div onClick={() => onLogin(DEFAULT_USER)} className="bg-[#fec3a6]/30 hover:bg-[#fec3a6]/50 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer">
            <img 
              alt="Golden sun sea reflection" 
              className="w-16 h-16 rounded-lg object-cover shadow-sm border border-white/20" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF2D-fLwxlU3l3Fq9rA5DjV2fkhfOO6VQcBYAoVqFZV_qeoLEQoOucpYQdJqQziDVnh_g-e6D78CywkTIroLSfSwn2c_HaaEiQurHW4yOs8UsLUUvyzP6Ojh8WIv1nREVqy5Uxxq6YkWXBCQgZ01SkD25Mpnw5rl-QgyyM8UQToDyFAmE1LRvudt3oET1z5aYXvFUvT5XLwGTX7vGFnwUT0pKgV3Xw2II3uzvtNd9Jov9kdJBiuQJtaTjNEnORiX7uc8MdmJcL9SKa" 
            />
            <div>
              <p className="font-serif italic font-semibold text-primary-brand">Gentle archives.</p>
              <p className="text-xs tracking-wider uppercase font-semibold text-muted-coffee/70">Tap to explore the philosophy</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
