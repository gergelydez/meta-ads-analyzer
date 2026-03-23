'use client'
import { Step } from '@/lib/types'

const STEPS = [
  { n: 1, label: 'Produs URL', sub: 'AI scrape automat' },
  { n: 2, label: 'Clipuri Video', sub: 'visual + audio + captions' },
  { n: 3, label: 'Analiză AI', sub: 'scoring complet' },
  { n: 4, label: 'Rezultate + Copy', sub: '5 variante premium' },
]

export default function StepTrack({ current }: { current: Step }) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-white/7 bg-ink2 mb-10">
      {STEPS.map((s, i) => {
        const done = s.n < current
        const active = s.n === current
        return (
          <div
            key={s.n}
            className={`flex flex-1 items-center gap-2.5 px-4 py-3.5 border-r border-white/7 last:border-r-0 transition-colors
              ${active ? 'bg-neon/5' : done ? 'bg-sky/[0.03]' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
              ${active ? 'bg-neon text-black' : done ? 'bg-sky text-black' : 'bg-ink4 text-dim'}`}>
              {done ? '✓' : s.n}
            </div>
            <div className="min-w-0 hidden sm:block">
              <div className={`text-xs font-semibold ${active || done ? 'text-white' : 'text-dim'}`}>{s.label}</div>
              <div className="text-[10px] text-dim2">{s.sub}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
