'use client'
import { useEffect, useState } from 'react'

const LOG_STEPS = [
  { delay: 0,    msg: 'Motor de analiză AI inițializat...' },
  { delay: 600,  msg: 'Extrag frame-uri din clipuri...' },
  { delay: 1800, msg: 'Frame-uri procesate — trimit la Claude...' },
  { delay: 2800, msg: 'Analizez hook-urile (primele 3 secunde)...' },
  { delay: 4000, msg: 'Evaluez voiceover și captions...' },
  { delay: 5500, msg: 'Calculez CPA prediction per clip...' },
  { delay: 7000, msg: 'Detectez public țintă & beneficii...' },
  { delay: 9000, msg: 'Generez copy premium Meta Ads...' },
  { delay: 11000, msg: 'Finalizez raportul winner...' },
]

interface Props {
  progress: number
  statusMsg: string
}

export default function LoadingView({ progress, statusMsg }: Props) {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([])

  useEffect(() => {
    const timers = LOG_STEPS.map(s =>
      setTimeout(() => setVisibleLogs(prev => [...prev, s.msg]), s.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="py-20 text-center animate-fade-up">
      {/* Spinner */}
      <div className="w-20 h-20 mx-auto mb-8 rounded-full border-[3px] border-white/10 border-t-neon border-r-sky spin-ring" />

      <h2 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: 'Clash Display, sans-serif' }}>
        AI PROCESEAZĂ TOTUL
      </h2>
      <p className="text-sm text-dim mb-8">{statusMsg}</p>

      {/* Progress bar */}
      <div className="max-w-md mx-auto h-[3px] bg-white/8 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-neon to-sky rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Log lines */}
      <div className="max-w-sm mx-auto flex flex-col gap-1.5 text-left">
        {visibleLogs.map((log, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-[11px] font-mono text-dim animate-log-in"
            style={{ animationDelay: '0s' }}
          >
            <span className="text-neon flex-shrink-0">›</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
