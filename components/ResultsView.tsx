'use client'
import { useState } from 'react'
import { AnalysisResult, CopyTab, VideoFile } from '@/lib/types'

interface Props {
  result: AnalysisResult
  videos: VideoFile[]
  onReset: () => void
}

const SCORE_COLORS: Record<string, string> = {
  top: 'text-neon',
  two: 'text-sky',
  thr: 'text-gold',
  rest: 'text-dim',
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className={`absolute top-4 right-4 px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all
        ${copied
          ? 'text-neon border-neon/30 bg-neon/8'
          : 'text-dim border-white/10 bg-white/4 hover:bg-white/8 hover:text-white'}`}
    >
      {copied ? '✓ Copiat!' : 'Copiază'}
    </button>
  )
}

export default function ResultsView({ result, videos, onReset }: Props) {
  const [tab, setTab] = useState<CopyTab>('primary')

  const { productBrief, copy, strategy } = result
  const sorted = [...result.videos].sort((a, b) => a.rank - b.rank)

  const TABS: { id: CopyTab; label: string }[] = [
    { id: 'primary', label: '📝 Primary Text' },
    { id: 'headlines', label: '💥 Headlines' },
    { id: 'descriptions', label: '📌 Descriptions' },
    { id: 'hooks', label: '🎣 Video Hooks' },
    { id: 'strategy', label: '📊 Strategie' },
  ]

  return (
    <div className="animate-fade-up space-y-6">

      {/* ── PRODUCT BRIEF ── */}
      <div className="relative bg-ink2 border border-white/7 rounded-2xl p-8 overflow-hidden card-glow">
        <h2 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2.5" style={{ fontFamily: 'Clash Display, sans-serif' }}>
          <span className="w-8 h-8 rounded-lg bg-neon/8 border border-neon/15 flex items-center justify-center text-sm">📋</span>
          Brief Produs — Detectat de AI
        </h2>
        <p className="text-sm text-dim mb-6">Tot ce AI-ul a extras și înțeles despre produsul tău.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Produs Detectat', val: productBrief.detectedName, hl: true },
            { label: 'Preț', val: productBrief.detectedPrice },
            { label: 'Potențial Conversie', val: `${productBrief.conversionPotential}/100`, hl: true },
            { label: 'Public Țintă', val: productBrief.detectedAudience },
            { label: 'Avantaj Competitiv', val: productBrief.competitiveAngle },
            { label: 'Trigger Emoțional', val: productBrief.emotionalTriggers?.[0] || '—' },
          ].map((b, i) => (
            <div key={i} className="bg-ink3 border border-white/7 rounded-xl p-4">
              <div className="text-[10px] font-mono tracking-[2px] uppercase text-dim mb-2">{b.label}</div>
              <div className={`text-sm font-semibold leading-snug ${b.hl ? 'text-neon' : 'text-white'}`}>{b.val || '—'}</div>
            </div>
          ))}
        </div>

        {productBrief.detectedBenefits?.length > 0 && (
          <div className="bg-ink3 border border-white/7 rounded-xl p-4">
            <div className="text-[10px] font-mono tracking-[2px] uppercase text-dim mb-3">Beneficii Detectate</div>
            <div className="flex flex-wrap gap-2">
              {productBrief.detectedBenefits.map((b, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-neon/8 border border-neon/15 text-neon text-xs font-semibold">{b}</span>
              ))}
            </div>
          </div>
        )}

        {productBrief.marketAlert && (
          <div className={`mt-4 flex gap-3 items-start p-4 rounded-xl border text-sm
            ${productBrief.alertType === 'success' ? 'bg-neon/5 border-neon/20 text-neon'
            : productBrief.alertType === 'warn' ? 'bg-gold/5 border-gold/20 text-gold'
            : 'bg-sky/5 border-sky/20 text-sky'}`}>
            <span>{productBrief.alertType === 'success' ? '✅' : productBrief.alertType === 'warn' ? '⚠️' : '💡'}</span>
            <span>{productBrief.marketAlert}</span>
          </div>
        )}
      </div>

      {/* ── VIDEO RANKINGS ── */}
      <div className="relative bg-ink2 border border-white/7 rounded-2xl p-8 overflow-hidden card-glow">
        <h2 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2.5" style={{ fontFamily: 'Clash Display, sans-serif' }}>
          <span className="w-8 h-8 rounded-lg bg-neon/8 border border-neon/15 flex items-center justify-center text-sm">🏆</span>
          Ranking Clipuri — CPA Winner
        </h2>
        <p className="text-sm text-dim mb-2">Rankuite după potențialul de CPA minim. Score mai mare = CPA mai mic.</p>
        <div className="font-mono text-[11px] text-dim/60 tracking-widest uppercase mb-5">// ranking final</div>

        <div className="space-y-4">
          {sorted.map((v, i) => {
            const rankLabel = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`
            const isTop = i === 0
            const vidFile = videos.find(x => x.name === v.name)
            const scoreClass = i === 0 ? SCORE_COLORS.top : i === 1 ? SCORE_COLORS.two : i === 2 ? SCORE_COLORS.thr : SCORE_COLORS.rest
            const hasAudio = !!vidFile?.transcript

            return (
              <div key={v.rank} className={`rounded-2xl overflow-hidden border transition-all
                ${isTop ? 'border-neon/35 shadow-[0_0_32px_rgba(57,255,159,0.08)]' : 'border-white/7'}`}>
                {isTop && <div className="h-[3px] bg-gradient-to-r from-neon to-sky" />}

                <div className="flex flex-col sm:flex-row">
                  {/* Rank badge */}
                  <div className={`w-full sm:w-16 flex sm:flex-col items-center justify-center gap-2 p-3 border-b sm:border-b-0 sm:border-r border-white/7
                    text-4xl font-bold ${scoreClass}`}
                    style={{ fontFamily: 'Clash Display, sans-serif', backgroundColor: 'rgba(21,21,40,0.8)' }}>
                    {rankLabel}
                  </div>

                  {/* Video preview */}
                  {vidFile?.objectUrl && (
                    <div className="w-full sm:w-24 bg-ink4 border-b sm:border-b-0 sm:border-r border-white/7 flex items-center justify-center overflow-hidden" style={{ minHeight: 80 }}>
                      <video src={vidFile.objectUrl} muted loop autoPlay playsInline className="w-full h-full object-cover" style={{ maxHeight: 160 }} />
                    </div>
                  )}

                  {/* Body */}
                  <div className="flex-1 p-5">
                    <div className="font-bold text-sm mb-1">{v.name}</div>
                    <div className="text-xs text-dim mb-3 font-light leading-relaxed">{v.winnerVerdict}</div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { label: `🎣 Hook ${v.hookScore}/10`, c: 'neon' },
                        { label: `🎙 Audio ${v.audioScore}/10`, c: 'sky' },
                        { label: `📝 Captions ${v.captionsScore}/10`, c: 'lav' },
                        { label: `⏱ Retention ${v.retentionScore}/10`, c: 'gold' },
                        { label: `💰 Conv. ${v.conversionScore}/10`, c: 'neon2' },
                      ].map((p, pi) => (
                        <span key={pi} className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold
                          ${p.c === 'neon' ? 'bg-neon/8 border border-neon/18 text-neon'
                          : p.c === 'sky' ? 'bg-sky/7 border border-sky/15 text-sky'
                          : p.c === 'lav' ? 'bg-lav/8 border border-lav/18 text-lav'
                          : p.c === 'gold' ? 'bg-gold/7 border border-gold/15 text-gold'
                          : 'bg-neon2/7 border border-neon2/15 text-neon2'}`}>
                          {p.label}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-1 mb-2">
                      {v.strengths?.map((s, si) => (
                        <div key={si} className="text-[11px] text-dim flex gap-2">
                          <span className="text-neon text-[10px] mt-0.5">✓</span>{s}
                        </div>
                      ))}
                      {v.weaknesses?.map((w, wi) => (
                        <div key={wi} className="text-[11px] text-neon2/70 flex gap-2">
                          <span className="text-[10px] mt-0.5">△</span>{w}
                        </div>
                      ))}
                    </div>

                    {v.quickFix && (
                      <div className="mt-2 flex gap-2 items-start p-2.5 rounded-lg bg-sky/5 border border-sky/15 text-[11px] text-sky">
                        <span>⚡</span><span><strong>Quick Fix:</strong> {v.quickFix}</span>
                      </div>
                    )}
                  </div>

                  {/* Score panel */}
                  <div className="w-full sm:w-32 flex sm:flex-col items-center justify-center gap-1 p-4 border-t sm:border-t-0 sm:border-l border-white/7 text-center">
                    <div className={`text-6xl font-bold leading-none ${scoreClass}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                      {v.cpaScore}
                    </div>
                    <div className="text-[9px] tracking-[2px] uppercase text-dim">CPA Score</div>
                    <div className="text-[10px] text-dim font-mono mt-2 leading-snug">{v.cpaEstimate}</div>
                    {hasAudio && (
                      <div className="mt-2 px-2 py-1 rounded-md bg-lav/10 border border-lav/20 text-[9px] font-bold tracking-wide text-lav uppercase">
                        🎙 Audio ✓
                      </div>
                    )}
                    <div className="text-[9px] text-dim/60 mt-1">{v.bestForFormat}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── COPY SECTION ── */}
      <div className="relative bg-ink2 border border-white/7 rounded-2xl p-8 overflow-hidden card-glow">
        <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: 'Clash Display, sans-serif' }}>
          ✍️ Copy Meta Ads — 5 Variante Premium
        </h2>
        <p className="text-sm text-dim mb-6">Generat pe framework-urile celor mai profitabile campanii eCommerce.</p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all
                ${tab === t.id
                  ? 'bg-neon/8 border-neon/25 text-neon'
                  : 'bg-transparent border-white/7 text-dim hover:border-white/15 hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* PRIMARY TEXTS */}
        {tab === 'primary' && (
          <div className="space-y-4 animate-fade-up">
            {copy.primaryTexts?.map((pt, i) => (
              <div key={i} className="relative bg-ink3 border border-white/7 rounded-xl p-6">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <span className="text-[10px] font-mono tracking-widest text-lav uppercase">{pt.variant}</span>
                  {pt.approach && <span className="px-2 py-0.5 rounded bg-lav/10 border border-lav/20 text-[9px] text-lav">{pt.approach}</span>}
                  {pt.bestPairedWith && <span className="px-2 py-0.5 rounded bg-neon/8 border border-neon/20 text-[9px] text-neon">Pair: {pt.bestPairedWith}</span>}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap pr-24">{pt.text}</div>
                {pt.whyItWorks && (
                  <div className="mt-3 text-[11px] text-dim font-mono">💡 {pt.whyItWorks}</div>
                )}
                <CopyButton text={pt.text} />
              </div>
            ))}
          </div>
        )}

        {/* HEADLINES */}
        {tab === 'headlines' && (
          <div className="space-y-3 animate-fade-up">
            {copy.headlines?.map((h, i) => (
              <div key={i} className="relative bg-ink3 border border-white/7 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono tracking-widest text-lav uppercase">{h.type || `Headline ${i + 1}`}</span>
                  <span className="px-2 py-0.5 rounded bg-neon/8 border border-neon/20 text-[9px] text-neon">Score: {h.score}/10</span>
                </div>
                <div className="text-xl font-bold tracking-tight pr-24" style={{ fontFamily: 'Clash Display, sans-serif' }}>{h.text}</div>
                <CopyButton text={h.text} />
              </div>
            ))}
          </div>
        )}

        {/* DESCRIPTIONS */}
        {tab === 'descriptions' && (
          <div className="space-y-3 animate-fade-up">
            {copy.descriptions?.map((d, i) => (
              <div key={i} className="relative bg-ink3 border border-white/7 rounded-xl p-5">
                <div className="text-[10px] font-mono tracking-widest text-lav uppercase mb-2">{d.type || `Description ${i + 1}`}</div>
                <div className="text-sm leading-relaxed pr-24">{d.text}</div>
                <CopyButton text={d.text} />
              </div>
            ))}
          </div>
        )}

        {/* HOOKS */}
        {tab === 'hooks' && (
          <div className="animate-fade-up">
            <div className="flex gap-3 items-start p-3.5 rounded-xl bg-sky/5 border border-sky/15 text-xs text-sky mb-4">
              💡 <span>Hook-ul = primele 3 secunde. Este factorul #1 care determină dacă clipul se oprește în feed. Testează toate variantele!</span>
            </div>
            <div className="space-y-3">
              {copy.videoHooks?.map((h, i) => (
                <div key={i} className="bg-ink3 border border-white/7 border-l-[3px] border-l-neon2 rounded-xl p-4 flex justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-[9px] font-mono tracking-widest text-neon2 uppercase mb-2">{h.type}</div>
                    <div className="text-sm leading-relaxed mb-2">{h.text}</div>
                    {h.audioHook && (
                      <div className="text-[11px] font-mono text-lav">🎙 Primele cuvinte: &ldquo;{h.audioHook}&rdquo;</div>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className="text-3xl font-bold text-neon2" style={{ fontFamily: 'Clash Display, sans-serif' }}>{h.score}/10</div>
                    <div className="text-[9px] text-dim">Impact</div>
                    <CopyButton text={`${h.text}\n\nAudio hook: ${h.audioHook}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STRATEGY */}
        {tab === 'strategy' && (
          <div className="animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[
                { icon: '🏆', title: 'De ce câștigă Winnerul', text: strategy.winnerRationale },
                { icon: '🎯', title: 'Targeting Recomandat', text: strategy.targetingRecommendation },
                { icon: '💰', title: 'Budget & Structura Campanie', text: strategy.budgetStrategy },
                { icon: '🔄', title: 'Rotație Creative', text: strategy.creativeRotation },
                { icon: '🔬', title: 'Plan A/B Testing (7 zile)', text: strategy.abTestingPlan },
                { icon: '📈', title: 'Scaling Roadmap', text: strategy.scalingRoadmap },
              ].map((s, i) => (
                <div key={i} className="bg-ink3 border border-white/7 rounded-xl p-5">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-bold text-sm mb-2" style={{ fontFamily: 'Clash Display, sans-serif' }}>{s.title}</div>
                  <div className="text-xs text-dim leading-relaxed font-light">{s.text}</div>
                </div>
              ))}
            </div>
            {strategy.quickWins?.length > 0 && (
              <div className="bg-neon/[0.03] border border-neon/15 rounded-xl p-5">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-bold text-sm text-neon mb-3" style={{ fontFamily: 'Clash Display, sans-serif' }}>Quick Wins — Acționează Acum</div>
                <div className="space-y-2">
                  {strategy.quickWins.map((q, i) => (
                    <div key={i} className="flex gap-2 text-xs text-dim">
                      <span className="text-neon text-[10px] mt-0.5">✓</span>{q}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-4 rounded-xl border border-white/10 bg-transparent text-dim hover:bg-ink2 hover:text-white hover:border-white/15 transition-all text-lg font-bold tracking-wide"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        ↩ Analizează Alt Produs & Clipuri
      </button>
    </div>
  )
}
