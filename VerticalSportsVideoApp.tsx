import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown, BarChart2, Users, Activity, Trophy, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Vertical Sports Video App — Single-file React demo
 * - 100% vertical video (full viewport), with overlay sports stats
 * - Clean Tailwind UI, shadcn/ui components, lucide-react icons, Framer Motion animations
 * - No external state management, easy to drop into any project
 *
 * Tips
 * - Replace the videoSrc with your own 9:16 clip for a perfect fit
 * - Stats are mocked; wire these to your feed (Opta, StatsBomb, Sportradar, etc.)
 */

// --- Mock data ---------------------------------------------------------------
const MOCK_FEEDS = {
  basketball: {
    league: "EuroLeague",
    matchup: { home: "Antwerp Giants", away: "Leuven Bears" },
    score: { home: 76, away: 73 },
    period: "Q4",
    clock: "03:24",
    possession: "home" as const,
    topPlayers: [
      { name: "J. Van Aken", team: "Antwerp", pts: 22, reb: 7, ast: 5, fg: "8/14" },
      { name: "M. Dupont", team: "Leuven", pts: 19, reb: 4, ast: 6, fg: "7/12" },
    ],
    teamStats: [
      { label: "FG%", home: 48, away: 44, unit: "%" },
      { label: "3PT%", home: 36, away: 33, unit: "%" },
      { label: "REB", home: 34, away: 31 },
      { label: "AST", home: 19, away: 18 },
      { label: "TOV", home: 11, away: 13 },
    ],
  },
  football: {
    league: "Jupiler Pro League",
    matchup: { home: "Union SG", away: "Genk" },
    score: { home: 2, away: 1 },
    period: "2nd Half",
    clock: "71:42",
    possession: "away" as const,
    topPlayers: [
      { name: "A. Amoura", team: "USG", g: 1, xg: 0.6, shots: 3, key: 2 },
      { name: "B. Heynen", team: "Genk", g: 1, xg: 0.4, shots: 2, key: 3 },
    ],
    teamStats: [
      { label: "xG", home: 1.4, away: 1.1 },
      { label: "Shots", home: 9, away: 7 },
      { label: "On Target", home: 5, away: 3 },
      { label: "Possession", home: 54, away: 46, unit: "%" },
      { label: "Corners", home: 6, away: 4 },
    ],
  },
};

const SAMPLE_VERTICALS = [
  {
    id: "hoops",
    label: "Basketball (9:16)",
    // Free demo clip (portrait). Replace with your own CDN/asset.
    src: "https://cdn.coverr.co/videos/coverr-basketball-shoot-9992/1080p.mp4",
    sport: "basketball" as const,
  },
  {
    id: "football",
    label: "Football (9:16)",
    src: "https://cdn.coverr.co/videos/coverr-soccer-dribble-9602/1080p.mp4",
    sport: "football" as const,
  },
];

// Utility to clamp values 0..100 for simple stat bars
const pct = (v: number) => Math.max(0, Math.min(100, v));

export default function VerticalSportsVideoApp() {
  const [selected, setSelected] = useState(SAMPLE_VERTICALS[0]);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [showPanel, setShowPanel] = useState(true);
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
    <div className="w-full min-h-screen bg-neutral-900 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-3 py-2 bg-neutral-900/70 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          <span className="font-semibold">Vertical Sports</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-1 text-sm"
            value={selected.id}
            onChange={(e) => setSelected(SAMPLE_VERTICALS.find(v => v.id === e.target.value) || SAMPLE_VERTICALS[0])}
          >
            {SAMPLE_VERTICALS.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
          <Button size="sm" variant="secondary" onClick={() => setSpoilersHidden(s => !s)} className="rounded-xl">
            <RotateCcw className="h-4 w-4 mr-1" /> {spoilersHidden ? "Show score" : "Hide score"}
          </Button>
        </div>
      </div>

      {/* Full-viewport vertical video stage */}
      <div className="relative h-[calc(100dvh-52px)] w-full overflow-hidden bg-black">
        {/* The video fully covers the viewport, ideal for 9:16 clips */}
        <video
          ref={videoRef}
          src={selected.src}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted={muted}
          loop
          autoPlay
        />

        {/* Gradient scrim for text legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent" />

        {/* Live score ribbon */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute left-3 right-3 top-3 z-30"
        >
          <Card className="bg-black/60 backdrop-blur-md border-white/10 text-white rounded-2xl">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-rose-600">LIVE</Badge>
                  <span className="text-sm opacity-80">{data.league}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock chip={data.clock} period={data.period} />
                  <Possession poss={data.possession} />
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between font-semibold">
                <TeamScore name={data.matchup.away} val={spoilersHidden ? "—" : String(data.score.away)} align="left" />
                <span className="text-xs opacity-70">vs</span>
                <TeamScore name={data.matchup.home} val={spoilersHidden ? "—" : String(data.score.home)} align="right" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <div className="absolute right-3 bottom-3 z-30 flex flex-col gap-2">
          <ControlButton
            label={playing ? "Pause" : "Play"}
            icon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            onClick={() => setPlaying(p => !p)}
          />
          <ControlButton
            label={muted ? "Unmute" : "Mute"}
            icon={muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            onClick={() => setMuted(m => !m)}
          />
          <ControlButton
            label={showPanel ? "Hide Stats" : "Show Stats"}
            icon={showPanel ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            onClick={() => setShowPanel(s => !s)}
          />
        </div>

        {/* Bottom stats panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ y: 280, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="absolute inset-x-0 bottom-0 z-30 p-3"
            >
              <Card className="rounded-2xl bg-neutral-950/90 backdrop-blur-xl border-white/10">
                <CardContent className="p-3">
                  <Tabs defaultValue="game">
                    <TabsList className="grid grid-cols-3 gap-2 bg-white/5">
                      <TabsTrigger value="game" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl">
                        <Activity className="h-4 w-4 mr-1" /> Game
                      </TabsTrigger>
                      <TabsTrigger value="players" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl">
                        <Users className="h-4 w-4 mr-1" /> Players
                      </TabsTrigger>
                      <TabsTrigger value="teams" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-xl">
                        <BarChart2 className="h-4 w-4 mr-1" /> Teams
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="game" className="mt-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {data.teamStats.slice(0, 4).map((s, i) => (
                          <StatCompare key={i} label={s.label} home={s.home} away={s.away} unit={s.unit} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="players" className="mt-3">
                      <div className="grid grid-cols-1 gap-2">
                        {data.topPlayers.map((p, i) => (
                          <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                            <div className="flex flex-col">
                              <span className="font-medium">{p.name}</span>
                              <span className="text-xs opacity-70">{(p as any).team || ""}</span>
                            </div>
                            <div className="text-xs text-right opacity-90">
                              {selected.sport === "basketball" ? (
                                <span>PTS {(p as any).pts} • REB {(p as any).reb} • AST {(p as any).ast} • FG {(p as any).fg}</span>
                              ) : (
                                <span>G {(p as any).g} • xG {(p as any).xg} • Shots {(p as any).shots} • Key {(p as any).key}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="teams" className="mt-3">
                      <div className="flex flex-col gap-3">
                        {data.teamStats.map((s, i) => (
                          <StatCompare key={i} label={s.label} home={s.home} away={s.away} unit={s.unit} />
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer — notes */}
      <div className="px-4 py-6 text-sm text-white/70 max-w-screen-sm mx-auto">
        <p className="mb-1">Demo notes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>This layout is <strong>video-first</strong>: overlays are lightweight and legible over moving backgrounds.</li>
          <li>To integrate real data, connect your WebSocket/feed and map it into the <code>MOCK_FEEDS</code> shape.</li>
          <li>Swap in a real 9:16 clip to perfectly fill modern phone screens.</li>
        </ul>
      </div>
    </div>
  );
}

// --- UI bits ----------------------------------------------------------------
function ControlButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 text-xs hover:bg-white/15 active:scale-[0.98]"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function TeamScore({ name, val, align }: { name: string; val: string; align: "left" | "right" }) {
  return (
    <div className={`flex ${align === "left" ? "flex-row" : "flex-row-reverse"} items-baseline gap-2`}>
      <span className="text-base opacity-80">{name}</span>
      <span className="text-2xl font-extrabold tracking-tight">{val}</span>
    </div>
  );
}

function Clock({ chip, period }: { chip: string; period: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge className="bg-white/10 text-white border-white/10">{period}</Badge>
      <span className="font-mono tracking-tight">{chip}</span>
    </div>
  );
}

function Possession({ poss }: { poss: "home" | "away" }) {
  return (
    <div className="text-[10px] uppercase opacity-80">Possession: <span className="font-semibold">{poss === "home" ? "Home" : "Away"}</span></div>
  );
}

function StatCompare({ label, home, away, unit }: { label: string; home: number; away: number; unit?: string }) {
  const total = Math.max(1, (home || 0) + (away || 0));
  const left = Math.round((home / total) * 100);
  const right = 100 - left;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs opacity-80">{label}</span>
        <span className="text-xs opacity-80">
          <strong>{home}{unit ?? ""}</strong> • <strong>{away}{unit ?? ""}</strong>
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-white/70" style={{ width: `${pct(left)}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] opacity-60">
        <span>Home</span>
        <span>Away</span>
      </div>
    </div>
  );
}