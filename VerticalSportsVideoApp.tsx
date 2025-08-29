"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown, BarChart2, Users, Activity, Trophy, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Forza Football Style Video App — Single-file React demo
 * - Vertical video with minimal overlay stats inspired by Forza Football
 * - Clean, minimalist UI with bold typography and subtle animations
 * - Mobile-first design optimized for portrait video consumption
 *
 * Tips
 * - Replace the videoSrc with your own 9:16 clip for a perfect fit
 * - Stats are mocked; wire these to your sports data provider
 */

// --- Mock data ---------------------------------------------------------------
const MOCK_FEEDS = {
  football: {
    league: "Premier League",
    matchup: { home: "Arsenal", away: "Chelsea" },
    score: { home: 2, away: 1 },
    period: "90'",
    clock: "90:00",
    status: "FT",
    possession: "away" as const,
    keyMoments: [
      { time: "23'", type: "goal", player: "Odegaard", team: "home" },
      { time: "67'", type: "goal", player: "Sterling", team: "away" },
      { time: "89'", type: "goal", player: "Jesus", team: "home" },
    ],
    topPlayers: [
      { name: "M. Ødegaard", team: "ARS", rating: 8.7, g: 1, a: 1 },
      { name: "R. Sterling", team: "CHE", rating: 8.2, g: 1, a: 0 },
    ],
    teamStats: [
      { label: "xG", home: 1.8, away: 1.2 },
      { label: "Shots", home: 12, away: 8 },
      { label: "On Target", home: 6, away: 4 },
      { label: "Possession", home: 58, away: 42, unit: "%" },
      { label: "Passes", home: 487, away: 362 },
      { label: "Pass Accuracy", home: 88, away: 84, unit: "%" },
    ],
  },
  basketball: {
    league: "NBA",
    matchup: { home: "Lakers", away: "Warriors" },
    score: { home: 118, away: 112 },
    period: "Q4",
    clock: "00:00",
    status: "Final",
    possession: "home" as const,
    keyMoments: [
      { time: "Q1 8:45", type: "dunk", player: "LeBron", team: "home" },
      { time: "Q3 2:15", type: "3pt", player: "Curry", team: "away" },
      { time: "Q4 0:24", type: "dunk", player: "Davis", team: "home" },
    ],
    topPlayers: [
      { name: "L. James", team: "LAL", pts: 32, reb: 8, ast: 11 },
      { name: "S. Curry", team: "GSW", pts: 28, reb: 4, ast: 7 },
    ],
    teamStats: [
      { label: "FG%", home: 48, away: 44, unit: "%" },
      { label: "3PT%", home: 38, away: 42, unit: "%" },
      { label: "REB", home: 46, away: 39 },
      { label: "AST", home: 27, away: 22 },
      { label: "TOV", home: 12, away: 15 },
    ],
  },
};

const SAMPLE_VERTICALS = [
  {
    id: "football",
    label: "Arsenal vs Chelsea",
    src: "https://cdn.coverr.co/videos/coverr-soccer-dribble-9602/1080p.mp4",
    sport: "football" as const,
  },
  {
    id: "basketball",
    label: "Lakers vs Warriors",
    src: "https://cdn.coverr.co/videos/coverr-basketball-shoot-9992/1080p.mp4",
    sport: "basketball" as const,
  },
];

// Utility to clamp values 0..100 for simple stat bars
const pct = (v: number) => Math.max(0, Math.min(100, v));

export default function ForzaFootballApp() {
  const [selected, setSelected] = useState(SAMPLE_VERTICALS[0]);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [spoilersHidden, setSpoilersHidden] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const data = useMemo(() => MOCK_FEEDS[selected.sport], [selected]);

  // Auto-play/pause control
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    const run = async () => {
      try {
        if (playing) await v.play();
        else v.pause();
      } catch {}
    };
    run();
  }, [muted, playing, selected]);

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Minimal top bar - Forza style */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">F</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSpoilersHidden(s => !s)}
            className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs"
          >
            {spoilersHidden ? "Show" : "Hide"}
          </button>
        </div>
      </div>

      {/* Full-screen vertical video */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={selected.src}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted={muted}
          loop
          autoPlay
        />

        {/* Subtle gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Forza-style minimal score display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-16 left-4 right-4 z-40"
        >
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-400">{(data as any).status || "LIVE"}</span>
                <span className="text-xs text-gray-400">{data.league}</span>
              </div>
              <span className="text-xs text-gray-400">{data.period}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">{data.matchup.away}</span>
                <span className="text-2xl font-bold text-white">{spoilersHidden ? "—" : data.score.away}</span>
              </div>
              <span className="text-gray-400 text-sm">-</span>
              <div className="flex items-center gap-3 flex-row-reverse">
                <span className="text-white font-semibold">{data.matchup.home}</span>
                <span className="text-2xl font-bold text-white">{spoilersHidden ? "—" : data.score.home}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Forza-style controls */}
        <div className="absolute right-4 bottom-8 z-40 flex flex-col gap-3">
          <button
            onClick={() => setPlaying(p => !p)}
            className="w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10"
          >
            {playing ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white ml-1" />}
          </button>
          <button
            onClick={() => setMuted(m => !m)}
            className="w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10"
          >
            {muted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
          </button>
          <button
            onClick={() => setShowStats(s => !s)}
            className="w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10"
          >
            <BarChart2 className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Forza-style stats overlay */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-64"
            >
              <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-4 space-y-4">
                {/* Key moments */}
                <div>
                  <h3 className="text-green-400 text-sm font-semibold mb-2">Key Moments</h3>
                  <div className="space-y-2">
                    {(data as any).keyMoments?.map((moment: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400 w-10">{moment.time}</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-white">{moment.player}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top performers */}
                <div>
                  <h3 className="text-green-400 text-sm font-semibold mb-2">Top Performers</h3>
                  <div className="space-y-2">
                    {data.topPlayers.map((p, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-sm font-medium">{p.name}</div>
                          <div className="text-gray-400 text-xs">{(p as any).team}</div>
                        </div>
                        <div className="text-right">
                          {selected.sport === "basketball" ? (
                            <div className="text-xs text-gray-300">{(p as any).pts}pts</div>
                          ) : (
                            <div className="text-xs text-gray-300">★{(p as any).rating}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick stats */}
                <div>
                  <h3 className="text-green-400 text-sm font-semibold mb-2">Match Stats</h3>
                  <div className="space-y-2">
                    {data.teamStats.slice(0, 3).map((stat, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{stat.label}</span>
                        <span className="text-white">
                          {stat.home}{stat.unit ?? ""} - {stat.away}{stat.unit ?? ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom match selector */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex gap-2">
          {SAMPLE_VERTICALS.map(video => (
            <button
              key={video.id}
              onClick={() => setSelected(video)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selected.id === video.id 
                  ? 'bg-green-500 text-black' 
                  : 'bg-black/60 text-white border border-white/20'
              }`}
            >
              {video.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

