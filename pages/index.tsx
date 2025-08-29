import { useState, useRef, useEffect } from 'react'

const MOCK_MATCH = {
  league: "Premier League",
  matchup: { home: "Arsenal", away: "Chelsea" },
  score: { home: 2, away: 1 },
  period: "90'",
  status: "FT",
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
    { label: "Possession", home: 58, away: 42, unit: "%" },
  ],
}

export default function ForzaFootballApp() {
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [spoilersHidden, setSpoilersHidden] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = muted
    if (playing) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [muted, playing])

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Minimal top bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">F</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSpoilersHidden(s => !s)}
            className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs hover:bg-black/70 transition-colors"
          >
            {spoilersHidden ? "Show" : "Hide"}
          </button>
        </div>
      </div>

      {/* Full-screen vertical video */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted={muted}
          loop
          autoPlay
        />

        {/* Subtle gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Score display */}
        <div className="absolute top-16 left-4 right-4 z-40 transition-all duration-300 ease-out">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-400">{MOCK_MATCH.status}</span>
                <span className="text-xs text-gray-400">{MOCK_MATCH.league}</span>
              </div>
              <span className="text-xs text-gray-400">{MOCK_MATCH.period}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">{MOCK_MATCH.matchup.away}</span>
                <span className="text-2xl font-bold text-white">{spoilersHidden ? "—" : MOCK_MATCH.score.away}</span>
              </div>
              <span className="text-gray-400 text-sm">-</span>
              <div className="flex items-center gap-3 flex-row-reverse">
                <span className="text-white font-semibold">{MOCK_MATCH.matchup.home}</span>
                <span className="text-2xl font-bold text-white">{spoilersHidden ? "—" : MOCK_MATCH.score.home}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute right-4 bottom-8 z-40 flex flex-col gap-3">
          <button
            onClick={() => setPlaying(p => !p)}
            className="w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:bg-black/90 transition-colors"
          >
            {playing ? (
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="h-5 w-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="m7 4 10 6-10 6V4z"/>
              </svg>
            )}
          </button>
          <button
            onClick={() => setMuted(m => !m)}
            className="w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:bg-black/90 transition-colors"
          >
            {muted ? (
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowStats(s => !s)}
            className="w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:bg-black/90 transition-colors"
          >
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 21H2v-2h1.5v-4H2v-2h1.5V9H2V7h1.5V3H2V1h20v2h-1.5v4H22v2h-1.5v4H22v2h-1.5v4H22v2zM5.5 3v16H7V3H5.5zm3 4v12h1.5V7H8.5zm3 2v10H13V9h-1.5zm3-4v14H15V5h-1.5zm3 6v8h1.5v-8H17z"/>
            </svg>
          </button>
        </div>

        {/* Stats overlay */}
        {showStats && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-64 transform transition-all duration-300 ease-out">
            <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-4 space-y-4">
              {/* Key moments */}
              <div>
                <h3 className="text-green-400 text-sm font-semibold mb-2">Key Moments</h3>
                <div className="space-y-2">
                  {MOCK_MATCH.keyMoments.map((moment, i) => (
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
                  {MOCK_MATCH.topPlayers.map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">{p.name}</div>
                        <div className="text-gray-400 text-xs">{p.team}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-300">★{p.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div>
                <h3 className="text-green-400 text-sm font-semibold mb-2">Match Stats</h3>
                <div className="space-y-2">
                  {MOCK_MATCH.teamStats.map((stat, i) => (
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
          </div>
        )}
      </div>
    </div>
  )
}