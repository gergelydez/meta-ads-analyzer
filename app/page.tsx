'use client'
import { useState, useCallback } from 'react'
import StepTrack from '@/components/StepTrack'
import VideoDropzone from '@/components/VideoDropzone'
import LoadingView from '@/components/LoadingView'
import ResultsView from '@/components/ResultsView'
import { VideoFile, Step, AnalysisResult } from '@/lib/types'
import { extractFrames } from '@/lib/extractFrames'

const NICHES = [
  '', 'Beauty & Skincare', 'Fashion & Îmbrăcăminte', 'Fitness & Sport',
  'Home & Living', 'Tech & Gadgets', 'Pet Products', 'Suplimente & Sănătate',
  'Copii & Familie', 'Food & Gourmet', 'Jewellery & Accesorii', 'Hobby & Lifestyle', 'Alt produs',
]

export default function Home() {
  const [step, setStep] = useState<Step>(1)
  const [videos, setVideos] = useState<VideoFile[]>([])
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [fetchingUrl, setFetchingUrl] = useState(false)
  const [urlFetched, setUrlFetched] = useState(false)

  // Form fields
  const [productUrl, setProductUrl] = useState('')
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productDesc, setProductDesc] = useState('')
  const [audience, setAudience] = useState('')
  const [niche, setNiche] = useState('')
  const [usp, setUsp] = useState('')
  const [objective, setObjective] = useState('Conversii (Purchase)')
  const [budget, setBudget] = useState('')
  const [reviews, setReviews] = useState('')

  const addVideos = useCallback((files: File[]) => {
    const toAdd = files.slice(0, 8 - videos.length)
    const newVids: VideoFile[] = toAdd.map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      objectUrl: URL.createObjectURL(f),
      frames: [],
      transcript: '',
      file: f,
    } as VideoFile & { file: File }))
    setVideos(prev => [...prev, ...newVids])
  }, [videos.length])

  const removeVideo = useCallback((id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id))
  }, [])

  const updateTranscript = useCallback((id: string, val: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, transcript: val } : v))
  }, [])

  async function fetchProductUrl() {
    if (!productUrl.trim()) return
    setFetchingUrl(true)
    try {
      const res = await fetch('/api/fetch-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: productUrl }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (data.name) setProductName(data.name)
      if (data.price) setProductPrice(data.price)
      if (data.description) setProductDesc(data.description + (data.benefits?.length ? '\n\nBeneficii: ' + data.benefits.join(', ') : ''))
      if (data.audience) setAudience(data.audience)
      if (data.usp) setUsp(data.usp)
      if (data.reviews) setReviews(data.reviews)
      if (data.niche) {
        const match = NICHES.find(n => n && n.toLowerCase().includes(data.niche.toLowerCase().split(' ')[0].toLowerCase()))
        if (match) setNiche(match)
      }
      setUrlFetched(true)
    } catch (e) {
      console.error(e)
      setUrlFetched(true) // still mark as attempted
    }
    setFetchingUrl(false)
  }

  async function runAnalysis() {
    setLoading(true)
    setStep(3)
    setProgress(5)
    setStatusMsg('Extrag frame-uri din clipuri...')

    // Extract frames from all videos
    const videosWithFrames = []
    for (let i = 0; i < videos.length; i++) {
      setProgress(5 + (i + 1) * (25 / Math.max(videos.length, 1)))
      const vFile = (videos[i] as VideoFile & { file?: File })
      const file = vFile.file || null
      let frames: string[] = []
      if (file) {
        try { frames = await extractFrames(file, 5) } catch (_) {}
      }
      videosWithFrames.push({
        name: videos[i].name,
        frames,
        transcript: videos[i].transcript,
      })
    }

    setProgress(35)
    setStatusMsg('AI analizează vizual + audio + captions...')

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productUrl,
          productName,
          productPrice,
          productDesc,
          audience,
          niche,
          usp,
          objective,
          budget,
          reviews,
          videos: videosWithFrames,
        }),
      })

      setProgress(88)
      setStatusMsg('Finalizez raportul...')

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setResult(data)
      setProgress(100)
      setStep(4)
      setTimeout(() => setLoading(false), 400)
    } catch (err) {
      console.error(err)
      setLoading(false)
      setStep(1)
      setProgress(0)
      alert('Eroare la analiză. Verifică că ai setat ANTHROPIC_API_KEY și încearcă din nou.')
    }
  }

  function resetAll() {
    setStep(1)
    setVideos([])
    setResult(null)
    setLoading(false)
    setProgress(0)
    setUrlFetched(false)
    setProductUrl(''); setProductName(''); setProductPrice(''); setProductDesc('')
    setAudience(''); setNiche(''); setUsp(''); setBudget(''); setReviews('')
  }

  const inputCls = "w-full bg-ink border border-white/12 rounded-xl text-white font-[Satoshi] text-sm px-4 py-3 outline-none focus:border-neon/40 focus:shadow-[0_0_0_3px_rgba(57,255,159,0.07)] transition-all placeholder:text-dim2"
  const labelCls = "block text-[10px] font-mono tracking-[2px] uppercase text-dim mb-2 font-bold"

  return (
    <>
      <div className="ambient" />
      <div className="grid-bg" />

      <div className="relative z-10">
        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-white/7 bg-ink/90 backdrop-blur-2xl">
          <div className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neon to-sky flex items-center justify-center text-xl shadow-[0_0_24px_rgba(57,255,159,0.35)] flex-shrink-0">
                🏆
              </div>
              <div>
                <div className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  AdWinner <span className="text-neon">PRO</span>
                </div>
                <div className="text-[10px] text-dim tracking-[2px] uppercase">Full AI Meta Ads Engine</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-neon/25 bg-neon/4 text-neon text-[11px] font-semibold tracking-wide">
              <div className="w-2 h-2 rounded-full bg-neon pulse-dot" />
              AI Live
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-5 pb-20">
          {/* HERO */}
          {!loading && !result && (
            <section className="py-16 pb-10">
              <div className="flex items-center gap-2.5 text-sky text-[11px] font-mono tracking-[2px] uppercase mb-5">
                <span className="opacity-40">//</span>
                eCommerce Performance Intelligence
                <span className="opacity-40">//</span>
              </div>
              <h1 className="text-[clamp(44px,8vw,90px)] font-bold leading-[0.92] tracking-[-2px] mb-5"
                style={{ fontFamily: 'Clash Display, sans-serif' }}>
                <span className="bg-gradient-to-r from-neon to-sky bg-clip-text text-transparent">ANALIZĂ</span><br />
                <span className="bg-gradient-to-r from-neon2 to-gold bg-clip-text text-transparent">COMPLETĂ.</span><br />
                COPY PERFECT.
              </h1>
              <p className="text-base text-dim max-w-xl leading-relaxed font-light">
                AI-ul citește pagina produsului, analizează clipurile <strong className="text-white/70">vizual + audio + captions</strong>,
                identifică publicul țintă și generează copy Meta Ads care convertește la CPA minim.
              </p>
            </section>
          )}

          {/* STEP TRACK */}
          {!loading && <StepTrack current={result ? 4 : step} />}

          {/* LOADING */}
          {loading && <LoadingView progress={progress} statusMsg={statusMsg} />}

          {/* RESULTS */}
          {!loading && result && (
            <ResultsView result={result} videos={videos} onReset={resetAll} />
          )}

          {/* FORM */}
          {!loading && !result && (
            <div className="space-y-5">

              {/* ── STEP 1: PRODUCT URL ── */}
              <div className="relative bg-ink2 border border-white/7 rounded-2xl p-8 overflow-hidden card-glow">
                <h2 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2.5"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  <span className="w-8 h-8 rounded-lg bg-neon/8 border border-neon/15 flex items-center justify-center text-sm">🔗</span>
                  Link Produs
                </h2>
                <p className="text-sm text-dim mb-6 font-light">
                  Adaugă URL-ul produsului. AI-ul citește pagina server-side și extrage automat toate informațiile.
                  Completează manual câmpurile dacă vrei precizie maximă.
                </p>

                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={productUrl}
                    onChange={e => setProductUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && fetchProductUrl()}
                    placeholder="https://magazinul-tau.ro/produs-amazing..."
                    className={inputCls + ' flex-1'}
                  />
                  <button
                    onClick={fetchProductUrl}
                    disabled={fetchingUrl || !productUrl.trim()}
                    className="px-5 py-3 rounded-xl border border-sky/30 bg-sky/6 text-sky text-sm font-semibold whitespace-nowrap hover:bg-sky/12 hover:border-sky/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {fetchingUrl ? '⏳ Se citește...' : '⚡ Analizează URL'}
                  </button>
                </div>

                {urlFetched && (
                  <div className="mb-5 p-3 rounded-xl bg-neon/4 border border-neon/15 text-xs text-neon font-mono">
                    ✓ URL analizat — câmpurile au fost completate. Verifică și corectează dacă e nevoie.
                  </div>
                )}

                <div className="h-px bg-white/6 my-5" />
                <div className="text-[10px] font-mono tracking-[2px] uppercase text-dim mb-4">↓ Completează sau corectează manual</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Nume Produs</label>
                    <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
                      placeholder="ex: Serum Vitamina C Pro" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Preț (RON/EUR)</label>
                    <input type="text" value={productPrice} onChange={e => setProductPrice(e.target.value)}
                      placeholder="ex: 189 RON" className={inputCls} />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={labelCls}>Descriere & Beneficii Principale</label>
                  <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)}
                    placeholder="ex: Serum cu 20% Vitamina C pură + Niacinamidă. Reduce petele pigmentare în 21 zile, luminozitate instantă..."
                    rows={3} className={inputCls + ' resize-none'} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={labelCls}>Public Țintă</label>
                    <input type="text" value={audience} onChange={e => setAudience(e.target.value)}
                      placeholder="ex: Femei 28-50, beauty conscious" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Nișă</label>
                    <select value={niche} onChange={e => setNiche(e.target.value)} className={inputCls}>
                      {NICHES.map(n => <option key={n} value={n}>{n || 'Selectează nișa...'}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={labelCls}>USP — Ce îl face unic?</label>
                    <input type="text" value={usp} onChange={e => setUsp(e.target.value)}
                      placeholder="ex: Formula patentată, livrare gratis, 30 zile retur" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Obiectiv Campanie</label>
                    <select value={objective} onChange={e => setObjective(e.target.value)} className={inputCls}>
                      <option>Conversii (Purchase)</option>
                      <option>Add to Cart</option>
                      <option>Lead Generation</option>
                      <option>Awareness + Retargeting</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={labelCls}>Buget Zilnic Estimat</label>
                    <input type="text" value={budget} onChange={e => setBudget(e.target.value)}
                      placeholder="ex: 50 EUR/zi" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Recenzii / Social Proof</label>
                    <input type="text" value={reviews} onChange={e => setReviews(e.target.value)}
                      placeholder="ex: 4.8★ din 1200 recenzii" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* ── STEP 2: VIDEOS ── */}
              <div className="relative bg-ink2 border border-white/7 rounded-2xl p-8 overflow-hidden card-glow">
                <h2 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2.5"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  <span className="w-8 h-8 rounded-lg bg-neon/8 border border-neon/15 flex items-center justify-center text-sm">🎬</span>
                  Clipuri Marketing
                </h2>
                <p className="text-sm text-dim mb-6 font-light">
                  Încarcă până la 8 clipuri. AI analizează: <strong className="text-white/70">vizualul frame-by-frame</strong> +{' '}
                  <strong className="text-white/70">voiceoverul</strong> + <strong className="text-white/70">captionsurile</strong>.
                  Completează câmpul de transcript per clip pentru precizie maximă.
                </p>
                <VideoDropzone
                  videos={videos}
                  onAdd={addVideos}
                  onRemove={removeVideo}
                  onTranscriptChange={updateTranscript}
                />
              </div>

              {/* ── CTA ── */}
              <div className="relative bg-gradient-to-br from-neon/[0.04] to-sky/[0.03] border border-neon/15 rounded-2xl p-8 card-glow">
                <h2 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2.5"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  <span className="w-8 h-8 rounded-lg bg-neon/8 border border-neon/15 flex items-center justify-center text-sm">🚀</span>
                  Lansează Analiza Completă
                </h2>
                <p className="text-sm text-dim mb-6 font-light">
                  AI-ul citește produsul, analizează fiecare clip (vizual + audio + captions), rankuiește după CPA estimat și generează 5 variante de copy premium.
                </p>
                <button
                  onClick={runAnalysis}
                  className="w-full py-5 rounded-xl font-bold text-xl tracking-wide text-black
                    bg-gradient-to-r from-neon to-sky
                    shadow-[0_8px_36px_rgba(57,255,159,0.2)]
                    hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(57,255,159,0.35)]
                    active:translate-y-0 transition-all"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  ⚡ ANALIZEAZĂ TOT — GĂSEȘTE WINNERUL + GENEREAZĂ COPY
                </button>
              </div>

            </div>
          )}
        </main>

        <footer className="border-t border-white/7 py-8 text-center text-[11px] font-mono text-dim2 tracking-widest">
          AdWinner <span className="text-neon">PRO</span> — Full AI Meta Ads Engine — Next.js + Anthropic Claude
        </footer>
      </div>
    </>
  )
}
