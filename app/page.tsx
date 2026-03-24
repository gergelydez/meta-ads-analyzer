'use client'

import { useState, useCallback, useEffect } from 'react'

interface VideoFile {
  id: string; name: string; size: number; objectUrl: string; transcript: string; file?: File
}
interface AnalysisResult {
  productBrief: { detectedName: string; detectedPrice: string; detectedAudience: string; detectedBenefits: string[]; emotionalTriggers: string[]; competitiveAngle: string; conversionPotential: number; marketAlert: string; alertType: string }
  videos: Array<{ rank: number; name: string; cpaScore: number; cpaEstimate: string; winnerVerdict: string; hookScore: number; audioScore: number; captionsScore: number; retentionScore: number; conversionScore: number; platformScore: number; hookAnalysis: string; audioAnalysis: string; captionsAnalysis: string; strengths: string[]; weaknesses: string[]; quickFix: string; bestForFormat: string }>
  copy: { primaryTexts: Array<{ variant: string; approach: string; text: string; whyItWorks: string; bestPairedWith: string }>; headlines: Array<{ text: string; score: number; type: string }>; descriptions: Array<{ text: string; type: string }>; videoHooks: Array<{ text: string; score: number; type: string; audioHook: string }> }
  strategy: { winnerRationale: string; targetingRecommendation: string; budgetStrategy: string; creativeRotation: string; abTestingPlan: string; scalingRoadmap: string; quickWins: string[] }
}

const NICHES = ['','Beauty & Skincare','Fashion & Îmbrăcăminte','Fitness & Sport','Home & Living','Tech & Gadgets','Pet Products','Suplimente & Sănătate','Copii & Familie','Food & Gourmet','Jewellery & Accesorii','Hobby & Lifestyle','Alt produs']

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(()=>setOk(false),2000) }}
      className={`absolute top-4 right-4 px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all ${ok?'text-emerald-400 border-emerald-400/30':'text-slate-500 border-white/10 bg-white/4 hover:bg-white/8 hover:text-white'}`}>
      {ok ? '✓ Copiat!' : 'Copiază'}
    </button>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [videos, setVideos] = useState<VideoFile[]>([])
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [fetchingUrl, setFetchingUrl] = useState(false)
  const [urlFetched, setUrlFetched] = useState(false)
  const [copyTab, setCopyTab] = useState('primary')
  const [logLines, setLogLines] = useState<string[]>([])
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

  useEffect(() => { setMounted(true) }, [])

  const addVideos = useCallback((files: File[]) => {
    setVideos(prev => {
      const rem = 8 - prev.length
      return [...prev, ...files.filter(f=>f.type.startsWith('video/')).slice(0,rem).map(f => ({
        id: Math.random().toString(36).slice(2), name: f.name, size: f.size,
        objectUrl: URL.createObjectURL(f), transcript: '', file: f
      }))]
    })
  }, [])

  async function fetchProductUrl() {
    if (!productUrl.trim()) return
    setFetchingUrl(true)
    try {
      const res = await fetch('/api/fetch-product', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({url:productUrl}) })
      const d = await res.json()
      if (d.name) setProductName(d.name)
      if (d.price) setProductPrice(d.price)
      if (d.description) setProductDesc(d.description + (d.benefits?.length ? '\n\nBeneficii: '+d.benefits.join(', ') : ''))
      if (d.audience) setAudience(d.audience)
      if (d.usp) setUsp(d.usp)
      if (d.reviews) setReviews(d.reviews)
      if (d.niche) { const m=NICHES.find(n=>n&&n.toLowerCase().includes(d.niche.toLowerCase().split(' ')[0])); if(m) setNiche(m) }
      setUrlFetched(true)
    } catch { setUrlFetched(true) }
    setFetchingUrl(false)
  }

  async function runAnalysis() {
    setLoading(true); setStep(3); setProgress(5); setStatusMsg('Procesez datele...'); setLogLines([])
    setLogLines(['Motor AI inițializat...'])
    setProgress(30)
    const videosData = videos.slice(0,3).map(v => ({ name: v.name, transcript: v.transcript }))
    setLogLines(p => [...p, 'Trimit la Claude AI...', 'Analizez voiceover și captions...', 'Generez copy premium Meta Ads...'])
    setProgress(55); setStatusMsg('AI analizează...')
    try {
      const res = await fetch('/api/analyze', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ productUrl, productName, productPrice, productDesc, audience, niche, usp, objective, budget, reviews, videos: videosData })
      })
      setProgress(90)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data); setProgress(100); setStep(4)
      setTimeout(() => setLoading(false), 300)
    } catch (err) {
      setLoading(false); setStep(1); setProgress(0)
      alert('Eroare la analiză: ' + String(err))
    }
  }

  function reset() {
    setStep(1); setVideos([]); setResult(null); setLoading(false); setProgress(0)
    setUrlFetched(false); setLogLines([])
    setProductUrl(''); setProductName(''); setProductPrice(''); setProductDesc('')
    setAudience(''); setNiche(''); setUsp(''); setBudget(''); setReviews('')
  }

  const inp = "w-full bg-[#08080f] border border-white/12 rounded-xl text-white text-sm px-4 py-3 outline-none focus:border-emerald-400/40 focus:shadow-[0_0_0_3px_rgba(57,255,159,0.07)] transition-all placeholder:text-slate-600"
  const lbl = "block text-[10px] font-mono tracking-[2px] uppercase text-slate-500 mb-2"

  if (!mounted) return null

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0" style={{background:'radial-gradient(ellipse 70% 50% at 15% 20%,rgba(57,255,159,0.07) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 85% 70%,rgba(255,57,119,0.06) 0%,transparent 60%)'}} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/7 bg-[#08080f]/90 backdrop-blur-2xl">
          <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background:'linear-gradient(135deg,#39ff9f,#38b6ff)',boxShadow:'0 0 24px rgba(57,255,159,0.35)'}}>🏆</div>
              <div>
                <div className="text-lg font-bold">AdWinner <span className="text-emerald-400">PRO</span></div>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase">Full AI Meta Ads Engine</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/25 bg-emerald-400/4 text-emerald-400 text-[11px] font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />AI Live
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-5 pb-20">
          {!loading && !result && (
            <section className="py-14 pb-8">
              <div className="text-sky-400 text-[11px] font-mono tracking-widest uppercase mb-4">// eCommerce Performance Intelligence //</div>
              <h1 className="text-[clamp(40px,8vw,80px)] font-black leading-[0.92] tracking-[-2px] mb-5">
                <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">ANALIZĂ</span><br/>
                <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">COMPLETĂ.</span><br/>
                COPY PERFECT.
              </h1>
              <p className="text-base text-slate-500 max-w-xl leading-relaxed font-light">AI-ul citește pagina produsului, analizează clipurile <strong className="text-slate-300">vizual + audio + captions</strong> și generează copy Meta Ads optimizat pentru CPA minim.</p>
            </section>
          )}

          {!loading && (
            <div className="flex overflow-hidden rounded-xl border border-white/7 bg-[#0e0e1c] mb-8">
              {[{n:1,l:'Produs URL',s:'AI scrape'},{n:2,l:'Clipuri Video',s:'audio+captions'},{n:3,l:'Analiză AI',s:'scoring'},{n:4,l:'Rezultate',s:'5 copy'}].map(st => {
                const cur=result?4:step; const done=st.n<cur; const active=st.n===cur
                return (
                  <div key={st.n} className={`flex flex-1 items-center gap-2 px-3 py-3 border-r border-white/7 last:border-r-0 ${active?'bg-emerald-400/5':done?'bg-sky-400/3':''}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${active?'bg-emerald-400 text-black':done?'bg-sky-400 text-black':'bg-slate-800 text-slate-500'}`}>{done?'✓':st.n}</div>
                    <div className="hidden sm:block min-w-0">
                      <div className={`text-xs font-semibold truncate ${active||done?'text-white':'text-slate-500'}`}>{st.l}</div>
                      <div className="text-[10px] text-slate-600 truncate">{st.s}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {loading && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border-[3px] border-white/10 border-t-emerald-400 border-r-sky-400 animate-spin" />
              <h2 className="text-2xl font-black tracking-tight mb-2">AI PROCESEAZĂ TOTUL</h2>
              <p className="text-sm text-slate-500 mb-6">{statusMsg}</p>
              <div className="max-w-sm mx-auto h-[3px] bg-white/8 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full transition-all duration-500" style={{width:`${progress}%`}} />
              </div>
              <div className="max-w-xs mx-auto flex flex-col gap-1 text-left">
                {logLines.map((l,i) => <div key={i} className="flex gap-2 text-[11px] font-mono text-slate-500"><span className="text-emerald-400">›</span>{l}</div>)}
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-5">
              <div className="bg-[#0e0e1c] border border-white/7 rounded-2xl p-6">
                <h2 className="text-lg font-black mb-4">📋 Brief Produs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {[{l:'Produs',v:result.productBrief.detectedName,hl:true},{l:'Preț',v:result.productBrief.detectedPrice},{l:'Potențial',v:`${result.productBrief.conversionPotential}/100`,hl:true},{l:'Public Țintă',v:result.productBrief.detectedAudience},{l:'Avantaj',v:result.productBrief.competitiveAngle},{l:'Trigger',v:result.productBrief.emotionalTriggers?.[0]}].map((b,i) => (
                    <div key={i} className="bg-[#151528] border border-white/7 rounded-xl p-3">
                      <div className="text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-1">{b.l}</div>
                      <div className={`text-sm font-semibold leading-snug ${b.hl?'text-emerald-400':'text-white'}`}>{b.v||'—'}</div>
                    </div>
                  ))}
                </div>
                {result.productBrief.detectedBenefits?.length > 0 && (
                  <div className="flex flex-wrap gap-2">{result.productBrief.detectedBenefits.map((b,i) => <span key={i} className="px-3 py-1 rounded-lg bg-emerald-400/8 border border-emerald-400/15 text-emerald-400 text-xs font-semibold">{b}</span>)}</div>
                )}
                {result.productBrief.marketAlert && <div className="mt-4 flex gap-3 p-3.5 rounded-xl bg-emerald-400/5 border border-emerald-400/20 text-sm text-emerald-400">✅ <span>{result.productBrief.marketAlert}</span></div>}
              </div>

              <div className="bg-[#0e0e1c] border border-white/7 rounded-2xl p-6">
                <h2 className="text-lg font-black mb-1">🏆 Ranking Clipuri</h2>
                <p className="text-xs text-slate-500 mb-5">Score mai mare = CPA mai mic estimat</p>
                <div className="space-y-4">
                  {[...result.videos].sort((a,b)=>a.rank-b.rank).map((v,i) => {
                    const badge=i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`
                    const sc=i===0?'text-emerald-400':i===1?'text-sky-400':i===2?'text-amber-400':'text-slate-500'
                    const vf=videos.find(x=>x.name===v.name)
                    return (
                      <div key={v.rank} className={`rounded-2xl overflow-hidden border ${i===0?'border-emerald-400/35':'border-white/7'}`}>
                        {i===0 && <div className="h-[3px] bg-gradient-to-r from-emerald-400 to-sky-400" />}
                        <div className="flex flex-col sm:flex-row">
                          <div className={`w-full sm:w-14 flex sm:flex-col items-center justify-center p-3 bg-[#151528] border-b sm:border-b-0 sm:border-r border-white/7 text-3xl font-black ${sc}`}>{badge}</div>
                          {vf?.objectUrl && <div className="w-full sm:w-20 bg-[#1c1c35] border-b sm:border-b-0 sm:border-r border-white/7 overflow-hidden" style={{minHeight:80}}><video src={vf.objectUrl} muted loop autoPlay playsInline className="w-full h-full object-cover" /></div>}
                          <div className="flex-1 p-4">
                            <div className="font-bold text-sm mb-1">{v.name}</div>
                            <div className="text-xs text-slate-400 mb-3 leading-relaxed">{v.winnerVerdict}</div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {[{l:`🎣 Hook ${v.hookScore}/10`,c:'emerald'},{l:`🎙 Audio ${v.audioScore}/10`,c:'sky'},{l:`📝 Captions ${v.captionsScore}/10`,c:'violet'},{l:`⏱ Retention ${v.retentionScore}/10`,c:'amber'},{l:`💰 Conv. ${v.conversionScore}/10`,c:'rose'}].map((p,pi) => (
                                <span key={pi} className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold ${p.c==='emerald'?'bg-emerald-400/8 border border-emerald-400/18 text-emerald-400':p.c==='sky'?'bg-sky-400/7 border border-sky-400/15 text-sky-400':p.c==='violet'?'bg-violet-400/8 border border-violet-400/18 text-violet-400':p.c==='amber'?'bg-amber-400/7 border border-amber-400/15 text-amber-400':'bg-rose-400/7 border border-rose-400/15 text-rose-400'}`}>{p.l}</span>
                              ))}
                            </div>
                            <div className="space-y-1">
                              {v.strengths?.map((s,si) => <div key={si} className="text-[11px] text-slate-400 flex gap-2"><span className="text-emerald-400">✓</span>{s}</div>)}
                              {v.weaknesses?.map((w,wi) => <div key={wi} className="text-[11px] text-rose-400/70 flex gap-2"><span>△</span>{w}</div>)}
                            </div>
                            {v.quickFix && <div className="mt-2 p-2.5 rounded-lg bg-sky-400/5 border border-sky-400/15 text-[11px] text-sky-400">⚡ <strong>Quick Fix:</strong> {v.quickFix}</div>}
                          </div>
                          <div className={`w-full sm:w-28 flex sm:flex-col items-center justify-center gap-1 p-4 border-t sm:border-t-0 sm:border-l border-white/7 text-center`}>
                            <div className={`text-5xl font-black leading-none ${sc}`}>{v.cpaScore}</div>
                            <div className="text-[9px] tracking-widest uppercase text-slate-500">CPA Score</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-1">{v.cpaEstimate}</div>
                            <div className="text-[9px] text-slate-600 mt-1">{v.bestForFormat}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-[#0e0e1c] border border-white/7 rounded-2xl p-6">
                <h2 className="text-xl font-black mb-1">✍️ Copy Meta Ads — 5 Variante Premium</h2>
                <p className="text-xs text-slate-500 mb-5">Generat pe framework-urile celor mai profitabile campanii eCommerce.</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {[{id:'primary',l:'📝 Primary Text'},{id:'headlines',l:'💥 Headlines'},{id:'descriptions',l:'📌 Descriptions'},{id:'hooks',l:'🎣 Video Hooks'},{id:'strategy',l:'📊 Strategie'}].map(t => (
                    <button key={t.id} onClick={()=>setCopyTab(t.id)} className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${copyTab===t.id?'bg-emerald-400/8 border-emerald-400/25 text-emerald-400':'bg-transparent border-white/7 text-slate-500 hover:text-white hover:border-white/15'}`}>{t.l}</button>
                  ))}
                </div>

                {copyTab==='primary' && <div className="space-y-4">{result.copy.primaryTexts?.map((pt,i) => <div key={i} className="relative bg-[#151528] border border-white/7 rounded-xl p-5"><div className="flex flex-wrap gap-2 items-center mb-3"><span className="text-[10px] font-mono tracking-widest text-violet-400 uppercase">{pt.variant}</span>{pt.approach&&<span className="px-2 py-0.5 rounded bg-violet-400/10 border border-violet-400/20 text-[9px] text-violet-400">{pt.approach}</span>}</div><div className="text-sm leading-relaxed whitespace-pre-wrap pr-20 text-slate-200">{pt.text}</div>{pt.whyItWorks&&<div className="mt-3 text-[11px] text-slate-500 font-mono">💡 {pt.whyItWorks}</div>}<CopyBtn text={pt.text}/></div>)}</div>}
                {copyTab==='headlines' && <div className="space-y-3">{result.copy.headlines?.map((h,i) => <div key={i} className="relative bg-[#151528] border border-white/7 rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><span className="text-[10px] font-mono tracking-widest text-violet-400 uppercase">{h.type}</span><span className="px-2 py-0.5 rounded bg-emerald-400/8 border border-emerald-400/20 text-[9px] text-emerald-400">Score: {h.score}/10</span></div><div className="text-xl font-black tracking-tight pr-20">{h.text}</div><CopyBtn text={h.text}/></div>)}</div>}
                {copyTab==='descriptions' && <div className="space-y-3">{result.copy.descriptions?.map((d,i) => <div key={i} className="relative bg-[#151528] border border-white/7 rounded-xl p-5"><div className="text-[10px] font-mono tracking-widest text-violet-400 uppercase mb-2">{d.type}</div><div className="text-sm leading-relaxed pr-20 text-slate-200">{d.text}</div><CopyBtn text={d.text}/></div>)}</div>}
                {copyTab==='hooks' && <div className="space-y-3"><div className="flex gap-3 p-3.5 rounded-xl bg-sky-400/5 border border-sky-400/15 text-xs text-sky-400 mb-2">💡 <span>Hook-ul = primele 3 secunde. Factorul #1 pentru stop-scroll!</span></div>{result.copy.videoHooks?.map((h,i) => <div key={i} className="relative bg-[#151528] border border-white/7 border-l-[3px] border-l-rose-400 rounded-xl p-4 flex justify-between gap-4"><div className="flex-1"><div className="text-[9px] font-mono tracking-widest text-rose-400 uppercase mb-2">{h.type}</div><div className="text-sm leading-relaxed mb-2">{h.text}</div>{h.audioHook&&<div className="text-[11px] font-mono text-violet-400">🎙 &ldquo;{h.audioHook}&rdquo;</div>}</div><div className="flex flex-col items-center gap-1 flex-shrink-0"><div className="text-2xl font-black text-rose-400">{h.score}/10</div><div className="text-[9px] text-slate-500">Impact</div><CopyBtn text={h.text}/></div></div>)}</div>}
                {copyTab==='strategy' && <div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">{[{icon:'🏆',title:'De ce câștigă Winnerul',text:result.strategy.winnerRationale},{icon:'🎯',title:'Targeting Recomandat',text:result.strategy.targetingRecommendation},{icon:'💰',title:'Budget & Campanie',text:result.strategy.budgetStrategy},{icon:'🔄',title:'Rotație Creative',text:result.strategy.creativeRotation},{icon:'🔬',title:'A/B Testing 7 zile',text:result.strategy.abTestingPlan},{icon:'📈',title:'Scaling Roadmap',text:result.strategy.scalingRoadmap}].map((s,i) => <div key={i} className="bg-[#151528] border border-white/7 rounded-xl p-4"><div className="text-xl mb-2">{s.icon}</div><div className="font-bold text-sm mb-2">{s.title}</div><div className="text-xs text-slate-400 leading-relaxed">{s.text}</div></div>)}</div>{result.strategy.quickWins?.length>0&&<div className="bg-emerald-400/3 border border-emerald-400/15 rounded-xl p-4"><div className="text-xl mb-2">⚡</div><div className="font-bold text-sm text-emerald-400 mb-3">Quick Wins</div><div className="space-y-2">{result.strategy.quickWins.map((q,i)=><div key={i} className="flex gap-2 text-xs text-slate-400"><span className="text-emerald-400">✓</span>{q}</div>)}</div></div>}</div>}
              </div>

              <button onClick={reset} className="w-full py-4 rounded-xl border border-white/10 bg-transparent text-slate-500 hover:bg-[#0e0e1c] hover:text-white transition-all text-lg font-bold">↩ Analizează Alt Produs & Clipuri</button>
            </div>
          )}

          {!loading && !result && (
            <div className="space-y-5">
              <div className="relative bg-[#0e0e1c] border border-white/7 rounded-2xl p-6 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30" />
                <h2 className="text-lg font-black mb-1 flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-emerald-400/8 border border-emerald-400/15 flex items-center justify-center text-sm">🔗</span>Link Produs</h2>
                <p className="text-xs text-slate-500 mb-5 font-light">AI-ul citește pagina și extrage automat toate informațiile.</p>
                <div className="flex gap-3 mb-4">
                  <input type="text" value={productUrl} onChange={e=>setProductUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchProductUrl()} placeholder="https://magazinul-tau.ro/produs..." className={inp+' flex-1'} />
                  <button onClick={fetchProductUrl} disabled={fetchingUrl||!productUrl.trim()} className="px-5 py-3 rounded-xl border border-sky-400/30 bg-sky-400/6 text-sky-400 text-sm font-semibold whitespace-nowrap hover:bg-sky-400/12 transition-all disabled:opacity-40">{fetchingUrl?'⏳...':'⚡ Analizează'}</button>
                </div>
                {urlFetched && <div className="mb-4 p-3 rounded-xl bg-emerald-400/4 border border-emerald-400/15 text-xs text-emerald-400 font-mono">✓ URL analizat — verifică câmpurile</div>}
                <div className="h-px bg-white/6 my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={lbl}>Nume Produs</label><input type="text" value={productName} onChange={e=>setProductName(e.target.value)} placeholder="ex: Serum Vitamina C Pro" className={inp}/></div>
                  <div><label className={lbl}>Preț (RON/EUR)</label><input type="text" value={productPrice} onChange={e=>setProductPrice(e.target.value)} placeholder="ex: 189 RON" className={inp}/></div>
                </div>
                <div className="mt-4"><label className={lbl}>Descriere & Beneficii</label><textarea value={productDesc} onChange={e=>setProductDesc(e.target.value)} placeholder="ex: Serum cu 20% Vitamina C. Reduce petele în 21 zile..." rows={3} className={inp+' resize-none'} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div><label className={lbl}>Public Țintă</label><input type="text" value={audience} onChange={e=>setAudience(e.target.value)} placeholder="ex: Femei 28-50, beauty" className={inp}/></div>
                  <div><label className={lbl}>Nișă</label><select value={niche} onChange={e=>setNiche(e.target.value)} className={inp}>{NICHES.map(n=><option key={n} value={n}>{n||'Selectează...'}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div><label className={lbl}>USP</label><input type="text" value={usp} onChange={e=>setUsp(e.target.value)} placeholder="ex: Livrare gratis, 30 zile retur" className={inp}/></div>
                  <div><label className={lbl}>Obiectiv</label><select value={objective} onChange={e=>setObjective(e.target.value)} className={inp}><option>Conversii (Purchase)</option><option>Add to Cart</option><option>Lead Generation</option><option>Awareness + Retargeting</option></select></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div><label className={lbl}>Buget Zilnic</label><input type="text" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="ex: 50 EUR/zi" className={inp}/></div>
                  <div><label className={lbl}>Recenzii / Social Proof</label><input type="text" value={reviews} onChange={e=>setReviews(e.target.value)} placeholder="ex: 4.8★ din 1200 recenzii" className={inp}/></div>
                </div>
              </div>

              <div className="relative bg-[#0e0e1c] border border-white/7 rounded-2xl p-6 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30" />
                <h2 className="text-lg font-black mb-1 flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-emerald-400/8 border border-emerald-400/15 flex items-center justify-center text-sm">🎬</span>Clipuri Marketing</h2>
                <p className="text-xs text-slate-500 mb-5 font-light">Încarcă până la 8 clipuri. Completează <strong className="text-slate-300">voiceover + captions</strong> per clip.</p>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-violet-400/25 rounded-2xl p-10 text-center cursor-pointer hover:border-violet-400/50 hover:bg-violet-400/3 transition-all bg-violet-400/[0.02]">
                  <div className="text-4xl mb-3">🎥</div>
                  <div className="text-base font-bold mb-1">Drag & Drop sau <span className="text-violet-400">Browse</span></div>
                  <div className="text-xs text-slate-500 font-mono">Până la 8 clipuri — MP4, MOV, WEBM, AVI</div>
                  <input type="file" multiple accept="video/*" className="hidden" onChange={e=>addVideos(Array.from(e.target.files||[]))} />
                </label>
                {videos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {videos.map((v) => (
                      <div key={v.id} className="bg-[#151528] border border-white/7 rounded-2xl overflow-hidden">
                        <div className="relative">
                          <video src={v.objectUrl} muted preload="metadata" className="w-full aspect-video object-cover bg-[#1c1c35]" />
                          <button onClick={()=>setVideos(p=>p.filter(x=>x.id!==v.id))} className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/70 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all text-sm">✕</button>
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-emerald-400">READY</div>
                        </div>
                        <div className="p-3"><div className="text-xs font-semibold truncate">{v.name}</div><div className="text-[10px] text-slate-500 font-mono mt-1">{(v.size/1024/1024).toFixed(1)} MB</div></div>
                        <div className="px-3 pb-3">
                          <div className="text-[10px] font-mono tracking-widest text-violet-400 mb-1.5 uppercase">🎙 Voiceover + Captions</div>
                          <textarea value={v.transcript} onChange={e=>{const val=e.target.value;setVideos(p=>p.map(x=>x.id===v.id?{...x,transcript:val}:x))}} placeholder={`Ce se aude și ce apare scris în clip...`} rows={3} className="w-full bg-[#08080f] border border-white/10 rounded-lg text-[11px] font-mono text-white/80 p-2.5 outline-none resize-none focus:border-emerald-400/30 transition-colors placeholder:text-slate-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative bg-gradient-to-br from-emerald-400/[0.04] to-sky-400/[0.03] border border-emerald-400/15 rounded-2xl p-6">
                <h2 className="text-lg font-black mb-1 flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-emerald-400/8 border border-emerald-400/15 flex items-center justify-center text-sm">🚀</span>Lansează Analiza Completă</h2>
                <p className="text-xs text-slate-500 mb-5 font-light">AI analizează produsul + clipurile și generează 5 variante copy premium.</p>
                <button onClick={runAnalysis} className="w-full py-5 rounded-xl font-black text-xl tracking-wide text-black transition-all hover:-translate-y-1 active:translate-y-0" style={{background:'linear-gradient(120deg,#39ff9f,#38b6ff)',boxShadow:'0 8px 36px rgba(57,255,159,0.2)'}}>
                  ⚡ ANALIZEAZĂ TOT — GĂSEȘTE WINNERUL + COPY
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-white/7 py-6 text-center text-[11px] font-mono text-slate-700 tracking-widest">
          AdWinner <span className="text-emerald-400">PRO</span> — Full AI Meta Ads Engine
        </footer>
      </div>
    </>
  )
}

