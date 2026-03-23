import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const maxDuration = 120 // 2 min timeout for Vercel

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productUrl, productName, productPrice, productDesc, audience, niche,
      usp, objective, budget, reviews, videos } = body

    // videos: Array<{ name: string, frames: string[], transcript: string }>

    const parts: Anthropic.MessageParam['content'] = []

    parts.push({
      type: 'text',
      text: `Ești un expert top-tier în Meta Ads eCommerce cu experiență directă în campanii de 7-8 figuri. Ai analizat milioane de video creatives și știi exact ce face un clip să aibă CPA minim.

═══════════════════════════════════════
DATELE PRODUSULUI
═══════════════════════════════════════
URL: ${productUrl || 'Nedisponibil'}
Nume Produs: ${productName || 'Nespecificat'}
Preț: ${productPrice || 'Nespecificat'}
Descriere: ${productDesc || 'Nespecificată'}
Public Țintă: ${audience || 'De detectat din clipuri'}
Nișă: ${niche || 'Nespecificată'}
USP: ${usp || 'Nespecificat'}
Obiectiv Campanie: ${objective || 'Conversii'}
Buget Zilnic: ${budget || 'Nespecificat'}
Recenzii/Social Proof: ${reviews || 'Nespecificat'}
Număr clipuri: ${videos?.length || 0}

═══════════════════════════════════════
FRAMEWORK ANALIZĂ (bazat pe 50M+ reclame Meta)
═══════════════════════════════════════
Analizezi fiecare clip pe 3 straturi:

1. VIZUAL (frame-uri): hook vizual primele 3-5s, flow narativ, demonstrație produs, CTA vizibil, calitate producție vs UGC
2. AUDIO/VOICEOVER: primele 5 cuvinte, problem-agitate-solve, emotional triggers, ritm și pacing, CTA verbal
3. CAPTIONS/TEXT OVERLAYS: reinforcement mesaj, beneficii highlight, pattern interrupt, lizibilitate

Evaluezi și: audience signal din conținut, platform fit Meta Feed/Reels, CPA prediction

Returnează STRICT JSON valid (fără markdown, fără backtick-uri):
`
    })

    // Add each video's frames + transcript
    if (videos && videos.length > 0) {
      const frameLabels = ['Hook/Intro (0-5s)', 'Act 1 (20%)', 'Act 2 (45%)', 'Act 3 (70%)', 'Final/CTA (88%)']

      for (let i = 0; i < videos.length; i++) {
        const v = videos[i]
        parts.push({ type: 'text', text: `\n══ CLIP ${i + 1}: "${v.name}" ══` })

        if (v.transcript) {
          parts.push({ type: 'text', text: `🎙 VOICEOVER + CAPTIONS:\n"${v.transcript}"\n` })
        } else {
          parts.push({ type: 'text', text: `🎙 VOICEOVER/CAPTIONS: Nefurnizate — analizează doar vizual.\n` })
        }

        if (v.frames && v.frames.length > 0) {
          parts.push({ type: 'text', text: `📸 FRAME-URI (${v.frames.length} frame-uri):` })
          for (let f = 0; f < v.frames.length; f++) {
            parts.push({ type: 'text', text: `Frame ${f + 1} — ${frameLabels[f] || ''}:` })
            parts.push({
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: v.frames[f] }
            })
          }
        } else {
          parts.push({ type: 'text', text: `📸 Frame-urile nu au putut fi extrase.` })
        }
      }
    }

    parts.push({
      type: 'text',
      text: `

Returnează STRICT JSON cu această structură exactă:
{
  "productBrief": {
    "detectedName": "<numele produsului>",
    "detectedPrice": "<prețul>",
    "detectedAudience": "<publicul țintă precis: gen, vârstă, interese, pain points>",
    "detectedBenefits": ["<beneficiu 1>","<beneficiu 2>","<beneficiu 3>","<beneficiu 4>","<beneficiu 5>"],
    "emotionalTriggers": ["<trigger 1>","<trigger 2>","<trigger 3>"],
    "competitiveAngle": "<avantaj competitiv real>",
    "conversionPotential": <1-100>,
    "marketAlert": "<cel mai important insight>",
    "alertType": "success"
  },
  "videos": [
    {
      "rank": <1=winner>,
      "name": "<numele exact al clipului>",
      "cpaScore": <1-100>,
      "cpaEstimate": "<ex: 8-18 EUR la 50EUR/zi buget>",
      "winnerVerdict": "<de ce e pe acest loc — 1-2 propoziții concrete>",
      "hookScore": <1-10>,
      "audioScore": <1-10>,
      "captionsScore": <1-10>,
      "retentionScore": <1-10>,
      "conversionScore": <1-10>,
      "platformScore": <1-10>,
      "hookAnalysis": "<analiza hook-ului vizual și verbal>",
      "audioAnalysis": "<analiza voiceover-ului>",
      "captionsAnalysis": "<analiza textelor din clip>",
      "strengths": ["<punct forte 1>","<punct forte 2>","<punct forte 3>"],
      "weaknesses": ["<slăbiciune 1>","<slăbiciune 2>"],
      "quickFix": "<cel mai important lucru de schimbat>",
      "bestForFormat": "<Feed/Reels/Stories>"
    }
  ],
  "copy": {
    "primaryTexts": [
      {
        "variant": "Varianta 1 — Problem Hook",
        "approach": "<strategia psihologică folosită>",
        "text": "<primary text complet 130-200 cuvinte cu emoji, bullet points, social proof, CTA — în română>",
        "whyItWorks": "<de ce convertește>",
        "bestPairedWith": "<cu ce tip de clip>"
      },
      {
        "variant": "Varianta 2 — Testimonial Social Proof",
        "approach": "<strategie>",
        "text": "<primary text complet — în română>",
        "whyItWorks": "<explicație>",
        "bestPairedWith": "<tip clip>"
      },
      {
        "variant": "Varianta 3 — Benefit-Led Curiosity",
        "approach": "<strategie>",
        "text": "<primary text complet — în română>",
        "whyItWorks": "<explicație>",
        "bestPairedWith": "<tip clip>"
      },
      {
        "variant": "Varianta 4 — Urgency + Scarcity",
        "approach": "<strategie>",
        "text": "<primary text complet — în română>",
        "whyItWorks": "<explicație>",
        "bestPairedWith": "<tip clip>"
      },
      {
        "variant": "Varianta 5 — Story Narrative",
        "approach": "<strategie>",
        "text": "<primary text complet — în română>",
        "whyItWorks": "<explicație>",
        "bestPairedWith": "<tip clip>"
      }
    ],
    "headlines": [
      {"text":"<max 40 caractere>","score":<1-10>,"type":"<tipul>"},
      {"text":"<headline>","score":<1-10>,"type":"<tipul>"},
      {"text":"<headline>","score":<1-10>,"type":"<tipul>"},
      {"text":"<headline>","score":<1-10>,"type":"<tipul>"},
      {"text":"<headline>","score":<1-10>,"type":"<tipul>"},
      {"text":"<headline>","score":<1-10>,"type":"<tipul>"}
    ],
    "descriptions": [
      {"text":"<20-30 cuvinte>","type":"<tipul>"},
      {"text":"<description>","type":"<tipul>"},
      {"text":"<description>","type":"<tipul>"},
      {"text":"<description>","type":"<tipul>"}
    ],
    "videoHooks": [
      {"text":"<primele 3-5 sec>","score":<1-10>,"type":"Pattern Interrupt","audioHook":"<primele cuvinte exacte rostite>"},
      {"text":"<hook>","score":<1-10>,"type":"Problem Agitate","audioHook":"<cuvinte>"},
      {"text":"<hook>","score":<1-10>,"type":"Curiosity Gap","audioHook":"<cuvinte>"},
      {"text":"<hook>","score":<1-10>,"type":"Result-First","audioHook":"<cuvinte>"},
      {"text":"<hook>","score":<1-10>,"type":"Social Proof","audioHook":"<cuvinte>"},
      {"text":"<hook>","score":<1-10>,"type":"Contrarian","audioHook":"<cuvinte>"}
    ]
  },
  "strategy": {
    "winnerRationale": "<de ce winnerul câștigă — analiza completă>",
    "targetingRecommendation": "<targeting Meta precis: interese, comportamente, lookalike, excluderi>",
    "budgetStrategy": "<CBO vs ABO, buget split, faza test vs scale>",
    "creativeRotation": "<cum rotești clipurile, când scoți, când scalezi>",
    "abTestingPlan": "<primele 7 zile: ce testezi, cum măsori>",
    "scalingRoadmap": "<de la test la 7 figuri: milestone-uri, metrici>",
    "quickWins": ["<acțiune imediată 1>","<acțiune 2>","<acțiune 3>","<acțiune 4>"]
  }
}`
    })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 6000,
      messages: [{ role: 'user', content: parts }]
    })

    const raw = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')

    const clean = raw.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m =>
      m.replace(/```json|```/g, '')
    ).trim()

    const start = clean.indexOf('{')
    const end = clean.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON in response')

    const result = JSON.parse(clean.substring(start, end + 1))
    return NextResponse.json(result)
  } catch (err) {
    console.error('analyze error:', err)
    return NextResponse.json({ error: 'Analysis failed', detail: String(err) }, { status: 500 })
  }
}
