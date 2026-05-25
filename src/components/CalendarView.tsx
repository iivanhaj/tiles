/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tile, User, MoodType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarViewProps {
  tiles: Tile[];
  currentUser: User;
  onTileClick: (tile: Tile) => void;
  onNavigateToJournal: () => void;
  onNavigateToTab: (tab: 'gallery' | 'journal' | 'circle' | 'self') => void;
}

const FILLER_LABELS = ['quiet', 'rest', 'none', '—', 'quiet', 'rest'];

// Highly accurate, beautiful styling configurations for the emotional moods
const MOOD_METRICS: Record<MoodType, {
  label: string;
  color: string;
  borderColor: string;
  activeText: string;
  gradient: string;
  emoji: string;
  sentiment: string;
  bg: string;
}> = {
  heart: {
    label: 'Warm',
    color: '#ffb3ae',
    borderColor: '#ffdad7',
    activeText: '#9a433f',
    gradient: 'linear-gradient(135deg, #fffadf 30%, #fff1ef 70%, #ffdad7 100%)',
    emoji: '❤️',
    sentiment: 'heartfelt connection, cozy rituals, and comforting warmth',
    bg: 'rgba(255, 179, 174, 0.15)',
  },
  sprout: {
    label: 'Fresh',
    color: '#acc8a0',
    borderColor: '#ceebc1',
    activeText: '#3c5435',
    gradient: 'linear-gradient(135deg, #fffadf 30%, #f4faed 70%, #edf5e6 100%)',
    emoji: '🌱',
    sentiment: 'creative energy, fresh perspectives, and slow growth',
    bg: 'rgba(172, 200, 160, 0.18)',
  },
  sun: {
    label: 'Radiant',
    color: '#fec3a6',
    borderColor: '#fdf3e7',
    activeText: '#8d4e2a',
    gradient: 'linear-gradient(135deg, #fffadf 30%, #fff6e2 70%, #fff0d4 100%)',
    emoji: '☀️',
    sentiment: 'radiant focus, sun-kissed strolls, and deep contentment',
    bg: 'rgba(254, 195, 166, 0.15)',
  },
  zzz: {
    label: 'Quiet',
    color: '#d8c2b8',
    borderColor: '#f2eae6',
    activeText: '#53433c',
    gradient: 'linear-gradient(135deg, #fffadf 30%, #f6f2eb 70%, #ebdccf 100%)',
    emoji: '💤',
    sentiment: 'peaceful reflection, sound rest, and quiet amber shadows',
    bg: 'rgba(216, 194, 184, 0.2)',
  },
};

export default function CalendarView({
  tiles,
  currentUser,
  onTileClick,
  onNavigateToJournal,
  onNavigateToTab,
}: CalendarViewProps) {
  // Current local date is programmed in May 2026 for the prototype.
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const todayDateStr = new Date().toISOString().slice(0, 10);

  // Feature specific local states
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayTab, setReplayTab] = useState<'timelapse' | 'collage'>('timelapse');
  const [timelapseIndex, setTimelapseIndex] = useState(0);
  const [isTimelapsePlaying, setIsTimelapsePlaying] = useState(true);
  const [timelapseSpeed, setTimelapseSpeed] = useState(3000); // ms speed rate
  const [isCratingMockImage, setIsCratingMockImage] = useState(false);
  const [creationStep, setCreationStep] = useState('');
  const [isSoundPulsing, setIsSoundPulsing] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
    setTimelapseIndex(0);
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
    setTimelapseIndex(0);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Day of week of the first day
  const startDayOfWeek = new Date(year, month, 1).getDay();

  // Find user tiles for this specific year/month
  const currentMonthTiles = tiles.filter((t) => {
    if (t.user_id !== currentUser.id) return false;
    const tileDate = new Date(t.date);
    return tileDate.getFullYear() === year && tileDate.getMonth() === month;
  });

  const momentsCount = currentMonthTiles.length;
  const sortedTimelineTiles = [...currentMonthTiles].sort((a, b) => a.date.localeCompare(b.date));

  // --- 1. MOOD HEATMAP SENTIMENT CALCULATIONS ---
  const hasTiles = currentMonthTiles.length > 0;
  const moodTotals = currentMonthTiles.reduce((acc, tile) => {
    acc[tile.mood] = (acc[tile.mood] || 0) + 1;
    return acc;
  }, { heart: 0, sprout: 0, sun: 0, zzz: 0 } as Record<MoodType, number>);

  // Determine dominant mood
  let dominantMood: MoodType | null = null;
  let maxCount = 0;
  if (momentsCount > 0) {
    (Object.keys(moodTotals) as MoodType[]).forEach((m) => {
      if (moodTotals[m] > maxCount) {
        maxCount = moodTotals[m];
        dominantMood = m;
      }
    });
  }

  // Get dynamic background linear gradient styled token based on the sentiments matching the spec
  const calendarCardStyle = dominantMood
    ? { background: MOOD_METRICS[dominantMood].gradient }
    : { background: 'white' };

  // Bulid grid days
  const calendarDays: { dayNum: number | null; dateString: string | null }[] = [];

  // Padding offset
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push({ dayNum: null, dateString: null });
  }

  // Active days
  for (let d = 1; d <= totalDays; d++) {
    const formatDay = d < 10 ? `0${d}` : `${d}`;
    const formatMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    calendarDays.push({
      dayNum: d,
      dateString: `${year}-${formatMonth}-${formatDay}`
    });
  }

  const isTodayStr = (dateString: string | null) => {
    return dateString === todayDateStr;
  };

  const getFillerLabel = (dayNum: number) => {
    return FILLER_LABELS[dayNum % FILLER_LABELS.length];
  };

  // Autoplay function for the Timelapse Memory slideshow
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isReplaying && replayTab === 'timelapse' && isTimelapsePlaying && sortedTimelineTiles.length > 0) {
      timer = setInterval(() => {
        setTimelapseIndex((prev) => (prev + 1) % sortedTimelineTiles.length);
      }, timelapseSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isReplaying, replayTab, isTimelapsePlaying, sortedTimelineTiles.length, timelapseSpeed]);

  const handleCreateMockCollageExport = () => {
    if (isCratingMockImage) return;
    setIsCratingMockImage(true);
    
    const steps = [
      'Blending slow snapshots together...',
      'Applying artisanal vintage grain texture...',
      'Embedding emotional sentiment metadata...',
      'JPEG beautifully locked and saved!'
    ];

    let currentStep = 0;
    setCreationStep(steps[currentStep]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setCreationStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        setIsCratingMockImage(false);
        setToastMessage(`Preserved May collage softly to your device catalog! 🌲`);
        setTimeout(() => setToastMessage(''), 3500);
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-5 mt-4 select-none pb-32 font-serif relative">
      
      {/* Dynamic Heatmap-derived Ambient Badge */}
      {dominantMood && (
        <div 
          className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider font-sans animate-fade-in shadow-2-xs self-start"
          style={{
            borderColor: MOOD_METRICS[dominantMood].color,
            backgroundColor: MOOD_METRICS[dominantMood].bg,
            color: MOOD_METRICS[dominantMood].activeText
          }}
        >
          <span className="animate-pulse">●</span>
          <span>{monthNames[month]} mood: {MOOD_METRICS[dominantMood].label} vibe {MOOD_METRICS[dominantMood].emoji}</span>
        </div>
      )}

      {/* Month Navigation Title & Cinematic Replay Button */}
      <div className="flex items-end justify-between mb-6">
        <div className="flex flex-col">
          <h2 className="text-3xl font-medium tracking-tight text-primary-brand leading-tight">
            {monthNames[month]} {year}
          </h2>
          <p className="font-sans text-xs text-muted-coffee/70 uppercase tracking-widest mt-1">
            {momentsCount} {momentsCount === 1 ? 'moment' : 'moments'} saved
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Renders Replay Trigger only if user has logged moments */}
          {momentsCount > 0 && (
            <button
              onClick={() => {
                setTimelapseIndex(0);
                setIsReplaying(true);
              }}
              className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-primary-brand hover:bg-[#703715] text-white text-xs font-semibold uppercase tracking-wider font-sans shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-fill-1">play_arrow</span>
              <span>Replay</span>
            </button>
          )}

          <div className="flex gap-1.5">
            <button 
              onClick={handlePrevMonth}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#fcf6ba]/60 hover:bg-[#f6f0b4] transition-colors border border-clay-variant/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary-brand text-xl">keyboard_arrow_left</span>
            </button>
            <button 
              onClick={handleNextMonth}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#fcf6ba]/60 hover:bg-[#f6f0b4] transition-colors border border-clay-variant/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary-brand text-xl">keyboard_arrow_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. THE MOOD HEATMAP DATA VISUALIZATION CANVAS --- */}
      <div 
        className="mb-8 p-6 rounded-3xl border border-clay-outline/10 shadow-sm transition-all duration-1000 ease-in-out"
        style={calendarCardStyle}
      >
        <div className="relative">
          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-4 text-center font-sans">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <span key={idx} className="text-xs font-semibold uppercase tracking-widest text-[#86736b]/40">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cell, idx) => {
              if (cell.dayNum === null) {
                return (
                  <div 
                    key={`empty-${idx}`} 
                    className="aspect-square bg-[#ebe5aa]/10 border border-clay-outline/5 rounded-md"
                  />
                );
              }

              // Check if user has posted on this date
              const postedTile = currentMonthTiles.find((t) => t.date === cell.dateString);
              const isToday = isTodayStr(cell.dateString);

              if (postedTile) {
                // Dynamic border glow matching that tile's sentiment color to visually mapping the heatmap
                const activeMoodMetric = MOOD_METRICS[postedTile.mood];
                return (
                  <div
                    key={cell.dateString}
                    onClick={() => onTileClick(postedTile)}
                    className="aspect-square bg-white rounded-md shadow-sm relative flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.07] hover:rotate-1 active:scale-95 group overflow-hidden border"
                    style={{ borderColor: activeMoodMetric.color }}
                  >
                    {/* Micro Image thumbnail circle */}
                    <div className="w-[78%] h-[78%] rounded-full overflow-hidden border-2 border-white shadow-inner">
                      <img 
                        alt="Memory" 
                        src={postedTile.image_url} 
                        className="w-full h-full object-cover grayscale-[0.03] contrast-[0.98] transition-transform duration-300 group-hover:scale-110" 
                      />
                    </div>
                    {/* Small visual mood stamp on top-right of the cell */}
                    <span className="absolute top-1 right-1 text-[8px] filter saturate-[0.8]">
                      {activeMoodMetric.emoji}
                    </span>
                    {/* Secondary index day printed softly */}
                    <span className="absolute top-1 left-1.5 font-sans text-[10px] text-muted-coffee/40">
                      {cell.dayNum}
                    </span>
                  </div>
                );
              }

              // If it is today and we have NOT posted yet, show premium visual glow invitations!
              if (isToday) {
                return (
                  <div
                    key={cell.dateString}
                    onClick={onNavigateToJournal}
                    className="aspect-square border-2 border-primary-brand bg-primary-container/10 rounded-md flex items-center justify-center relative cursor-pointer group shadow-sm transition-all hover:scale-[1.03]"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary-brand text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-xl">add</span>
                    </div>
                    <span className="absolute top-1 left-1.5 font-sans text-[10px] text-primary-brand font-bold">
                      {cell.dayNum}
                    </span>
                    <span className="absolute bottom-1 right-1.5 w-1.5 h-1.5 bg-primary-brand rounded-full animate-ping"></span>
                    <span className="absolute bottom-1 right-1.5 w-1.5 h-1.5 bg-primary-brand rounded-full"></span>
                  </div>
                );
              }

              // For empty days, show soft placeholders
              return (
                <div
                  key={cell.dateString}
                  onClick={onNavigateToJournal}
                  className="aspect-square bg-[#fcf6ba]/25 hover:bg-[#f6f0b4]/40 border border-clay-outline/5 rounded-md flex flex-col justify-center items-center relative cursor-pointer opacity-75 hover:opacity-100 transition-all text-center"
                >
                  <span className="absolute top-1 left-1.5 font-sans text-[10px] text-muted-coffee/35">
                    {cell.dayNum}
                  </span>
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-[9px] font-sans font-semibold text-[#8d4e2a]/30 uppercase tracking-tighter">
                      {getFillerLabel(cell.dayNum)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- 3. THE MONTHLY EMOTIONAL BAR CHART/PALETTE BREAKDOWN --- */}
      {hasTiles && (
        <section className="bg-white/40 border border-clay-outline/10 p-5 rounded-2xl animate-fade-in font-sans">
          <div className="flex justify-between items-center mb-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-brand">Sentiment Balance</h4>
            <span className="text-[11px] font-serif italic text-muted-coffee">
              {dominantMood ? `Dominated by ${MOOD_METRICS[dominantMood].sentiment}` : 'Balanced moments'}
            </span>
          </div>

          {/* Elegant segmented proportions bar */}
          <div className="h-3.5 rounded-full overflow-hidden flex bg-stone-100 border border-stone-200">
            {(Object.keys(MOOD_METRICS) as MoodType[]).map((m) => {
              const count = moodTotals[m];
              const percentage = momentsCount > 0 ? (count / momentsCount) * 100 : 0;
              if (count === 0) return null;
              return (
                <div
                  key={m}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: MOOD_METRICS[m].color
                  }}
                  className="h-full relative group transition-all cursor-help"
                  title={`${MOOD_METRICS[m].label}: ${count} ${count === 1 ? 'day' : 'days'}`}
                >
                  {/* Subtle hover highlights */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100"></div>
                </div>
              );
            })}
          </div>

          {/* Interactive Legend with Day Counts */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-center">
            {(Object.keys(MOOD_METRICS) as MoodType[]).map((m) => {
              const count = moodTotals[m];
              const isActive = count > 0;
              return (
                <div 
                  key={m} 
                  className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                    isActive ? 'bg-white/30 border-stone-100' : 'opacity-40 border-transparent'
                  }`}
                >
                  <span className="text-sm">{MOOD_METRICS[m].emoji}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-coffee mt-0.5">{MOOD_METRICS[m].label}</span>
                  <span className="text-xs font-serif italic font-semibold text-dark-charcoal mt-1">
                    {count} {count === 1 ? 'day' : 'days'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Atmospheric Quote */}
      <section className="mt-12 text-center">
        <p className="font-serif italic text-primary-brand/60 text-lg max-w-[290px] mx-auto leading-relaxed">
          "We do not remember days, we remember moments."
        </p>
        <div className="mt-6 flex justify-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
        </div>
      </section>

      {/* --- 4. THE CINEMATIC MONTHLY REPLAY IMMERSIVE OVERLAY (THEATER) --- */}
      <AnimatePresence>
        {isReplaying && sortedTimelineTiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#fffdf0]/98 backdrop-blur-xl flex flex-col justify-between p-6 select-none overflow-y-auto"
          >
            {/* Grain filter specifically for nostalgia look */}
            <div className="grain-overlay opacity-25"></div>

            {/* Replay Toast Alerts */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: -20, x: '-50%' }}
                  className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#ffac81] border border-[#8d4e2a]/20 text-dark-charcoal px-6 py-3 rounded-full text-xs font-bold tracking-wide shadow-md z-50 font-sans text-center"
                >
                  {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header section with Toggle Tab for Timelapse vs Grid Collage */}
            <header className="flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl mx-auto border-b border-[#86736b]/15 pb-4 gap-4 z-10">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-semibold tracking-tight text-primary-brand leading-none">
                  {monthNames[month]} Replay Reel
                </h3>
                <p className="font-sans text-[10px] text-muted-coffee/65 uppercase tracking-widest mt-1">
                  Reliving {sortedTimelineTiles.length} caught moments slowly
                </p>
              </div>

              {/* Modes Toggle Segment */}
              <div className="flex bg-[#ebe5aa]/20 border border-[#86736b]/15 p-1 rounded-full items-center font-sans w-64 justify-between">
                <button
                  onClick={() => {
                    setReplayTab('timelapse');
                    setTimelapseIndex(0);
                    setIsTimelapsePlaying(true);
                  }}
                  className={`flex-1 text-center py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    replayTab === 'timelapse'
                      ? 'bg-primary-brand text-white'
                      : 'text-muted-coffee hover:text-primary-brand'
                  }`}
                >
                  Timelapse
                </button>
                <button
                  onClick={() => {
                    setReplayTab('collage');
                    setIsTimelapsePlaying(false);
                  }}
                  className={`flex-1 text-center py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    replayTab === 'collage'
                      ? 'bg-primary-brand text-white'
                      : 'text-muted-coffee hover:text-primary-brand'
                  }`}
                >
                  Scrapbook
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsReplaying(false);
                  setIsTimelapsePlaying(false);
                }}
                className="w-10 h-10 rounded-full border border-clay-outline/15 text-[#86736b] hover:text-primary-brand flex items-center justify-center hover:bg-white/40 active:scale-90 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </header>

            {/* --- TIMELAPSE TAB SLIDESHOW PLAYBACK --- */}
            {replayTab === 'timelapse' && (
              <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto py-8">
                <AnimatePresence mode="wait">
                  {sortedTimelineTiles[timelapseIndex] && (
                    <motion.div
                      key={sortedTimelineTiles[timelapseIndex].id}
                      initial={{ opacity: 0, scale: 0.96, rotate: -0.5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.96, rotate: 0.5 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      className="w-full bg-white p-5 pb-8 rounded-2xl shadow-xl border border-clay-outline/10 text-center relative group"
                    >
                      {/* Analog picture frame */}
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-stone-100 shadow-inner">
                        <img
                          src={sortedTimelineTiles[timelapseIndex].image_url}
                          alt="Memory Timelapse"
                          className="w-full h-full object-cover"
                        />
                        {/* Static light leaks matching the mood */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/5 via-transparent to-rose-400/5 pointer-events-none blended-intensity"></div>
                        
                        {/* Dynamic Floating Stamp */}
                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-xs font-sans font-semibold tracking-wider flex items-center gap-1">
                          <span>{MOOD_METRICS[sortedTimelineTiles[timelapseIndex].mood].emoji}</span>
                          <span>{MOOD_METRICS[sortedTimelineTiles[timelapseIndex].mood].label}</span>
                        </div>
                      </div>

                      {/* Polaroid Handwriting Description Block */}
                      <div className="mt-6 space-y-3">
                        <h4 className="text-xl font-serif font-medium tracking-tight text-primary-brand italic leading-none">
                          {new Date(sortedTimelineTiles[timelapseIndex].date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </h4>
                        <p className="font-serif italic text-base text-dark-charcoal leading-relaxed max-w-md mx-auto h-12 flex items-center justify-center">
                          "{sortedTimelineTiles[timelapseIndex].caption}"
                        </p>
                      </div>

                      {/* Progress Dot Indicator bar */}
                      <div className="flex justify-center gap-1.5 mt-4">
                        {sortedTimelineTiles.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => setTimelapseIndex(dotIdx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              timelapseIndex === dotIdx ? 'w-5 bg-primary-brand' : 'w-1.5 bg-stone-200 hover:bg-stone-300'
                            }`}
                          ></button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sub-controls Block */}
                <section className="w-full mt-6 flex flex-col items-center gap-4">
                  {/* Playback Controls button cluster */}
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setTimelapseIndex((prev) => (prev - 1 + sortedTimelineTiles.length) % sortedTimelineTiles.length)}
                      className="w-11 h-11 rounded-full bg-[#fcf6ba]/60 hover:bg-[#f6f0b4] text-primary-brand flex items-center justify-center border border-clay-variant/20 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">skip_previous</span>
                    </button>

                    <button
                      onClick={() => setIsTimelapsePlaying(!isTimelapsePlaying)}
                      className="w-14 h-14 rounded-full bg-primary-brand hover:bg-[#703715] text-white flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-3xl font-fill-1">
                        {isTimelapsePlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    <button
                      onClick={() => setTimelapseIndex((prev) => (prev + 1) % sortedTimelineTiles.length)}
                      className="w-11 h-11 rounded-full bg-[#fcf6ba]/60 hover:bg-[#f6f0b4] text-primary-brand flex items-center justify-center border border-clay-variant/20 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">skip_next</span>
                    </button>
                  </div>

                  {/* Playback Serene Speeds */}
                  <div className="flex gap-2 bg-stone-100/60 p-1 border border-stone-200/55 rounded-full text-2xs font-bold font-sans uppercase tracking-widest text-[#86736b]">
                    {( [
                      { value: 5000, label: 'Serene' },
                      { value: 3000, label: 'Nostalgic' },
                      { value: 1500, label: 'Lively' },
                    ] as const).map((speedOption) => (
                      <button
                        key={speedOption.value}
                        onClick={() => setTimelapseSpeed(speedOption.value)}
                        className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                          timelapseSpeed === speedOption.value
                            ? 'bg-white text-primary-brand shadow-1-xs'
                            : 'hover:text-primary-brand'
                        }`}
                      >
                        {speedOption.label}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* --- ARTISANAL SCRAPBOOK SCRAPING COLLAGE GRID --- */}
            {replayTab === 'collage' && (
              <div className="flex-1 flex flex-col justify-between max-w-4xl w-full mx-auto py-6">
                
                {/* Visual Scrapbook Board Canvas */}
                <div className="flex-1 relative bg-[#eedfa5]/15 border-2 border-dashed border-[#8d4e2a]/15 rounded-3xl p-6 overflow-hidden flex items-center justify-center min-h-[360px]">
                  
                  {/* Scatter Polaroid grid design */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-3xl justify-center scale-[0.93] origin-center">
                    {sortedTimelineTiles.map((tile, tidx) => {
                      // Deterministic rotations for a highly realistic hand-scrapbook effect
                      const rotations = ['rotate-1', '-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3'];
                      const rotClass = rotations[tidx % rotations.length];

                      return (
                        <div
                          key={tile.id}
                          className={`bg-white p-3 pb-5 rounded-lg shadow-md border border-stone-100 hover:shadow-xl hover:scale-[1.06] hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center relative ${rotClass}`}
                          onClick={() => onTileClick(tile)}
                        >
                          {/* Aesthetic washi tape stuck segment */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4.5 bg-[#fec3a6]/25 border-l border-r border-[#8d4e2a]/5 shadow-2-xs rotate-2 flex items-center justify-center text-[7px] font-sans text-[#8d4e2a]/40 tracking-widest select-none">
                            TUCKED
                          </div>

                          <div className="aspect-square bg-stone-100 rounded overflow-hidden">
                            <img src={tile.image_url} className="w-full h-full object-cover" alt="Memory snippet" />
                          </div>

                          <span className="block font-sans text-[9px] text-[#8d4e2a]/60 uppercase tracking-wider font-semibold mt-3">
                            {new Date(tile.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Collage export action buttons */}
                <div className="flex flex-col items-center mt-6 gap-3">
                  <button
                    onClick={handleCreateMockCollageExport}
                    disabled={isCratingMockImage}
                    className="flex items-center gap-2.5 bg-primary-brand text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:bg-[#703715] hover:shadow-primary-brand/25 active:scale-95 transition-all outline-none cursor-pointer disabled:bg-stone-400 disabled:shadow-none"
                  >
                    {isCratingMockImage ? (
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                    )}
                    <span>{isCratingMockImage ? creationStep : 'Export Collage Sheet'}</span>
                  </button>
                  <p className="font-sans text-[9px] uppercase tracking-widest text-[#86736b]/60">
                    Artisanal assembly of memories for journaling
                  </p>
                </div>

              </div>
            )}

            {/* Cinematic Footer matching ambient sound ripple details */}
            <footer className="w-full max-w-4xl mx-auto border-t border-[#86736b]/15 pt-4 flex justify-between items-center z-10 font-sans text-xs">
              <div className="flex items-center gap-2">
                {/* Audio pulsing generator feedback */}
                <button
                  onClick={() => setIsSoundPulsing(!isSoundPulsing)}
                  className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200/50 flex items-center justify-center cursor-pointer text-stone-600 hover:text-primary-brand active:scale-90 transition-all"
                  title="Toggle slow wind sound"
                >
                  <span className={`material-symbols-outlined text-sm ${isSoundPulsing ? 'font-fill-1 text-primary-brand animate-pulse' : ''}`}>
                    {isSoundPulsing ? 'volume_up' : 'volume_mute'}
                  </span>
                </button>

                {isSoundPulsing ? (
                  <div className="flex items-center gap-1">
                    {/* Simulated visual dancing audio-waves */}
                    <span className="h-2.5 w-0.5 bg-primary-brand/65 animate-[bounce_1.2s_infinite_0.1s]"></span>
                    <span className="h-4.5 w-0.5 bg-primary-brand/65 animate-[bounce_1.2s_infinite_0.2s]"></span>
                    <span className="h-3 w-0.5 bg-primary-brand/65 animate-[bounce_1.2s_infinite_0.3s]"></span>
                    <span className="text-[10px] italic text-[#8d4e2a]/70 font-medium">Cicadas & Soft Ocean Waves</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-stone-400 italic">Soundscape muted</span>
                )}
              </div>

              <div className="text-[10px] tracking-widest uppercase font-semibold text-[#86736b]/60">
                Tiles No. 49 • May 2026
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
