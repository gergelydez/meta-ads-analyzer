import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'URL missing' }, { status: 400 })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ type: 'web_search_20250305', name: 'web_search' } as any],
      messages: [{
        role: 'user',
        content: `Caută și analizează această pagină de produs eCommerce: ${url}

Extrage informațiile și returnează STRICT JSON valid (fără backticks, fără markdown, fără text în afara JSON):
{
  "name": "<numele exact al produsului>",
  "price": "<prețul cu moneda>",
  "description": "<descrierea produsului, 2-3 propoziții>",
  "benefits": ["<beneficiu cheie 1>","<beneficiu 2>","<beneficiu 3>","<beneficiu 4>","<beneficiu 5>"],
  "audience": "<publicul țintă detaliat: gen, vârstă, interese, pain points>",
  "niche": "<nișa exactă a produsului>",
  "usp": "<ce face produsul unic față de competiție>",
  "reviews": "<rating și număr recenzii dacă există pe pagină>",
  "confidence": <1-10, cât de complet sunt datele>
}`
      }]
    })

    const textBlocks = response.content.filter(b => b.type === 'text')
    const raw = textBlocks.map(b => (b as { type: 'text'; text: string }).text).join('')
    const clean = raw.replace(/```json|```/g, '').trim()
    const start = clean.indexOf('{')
    const end = clean.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON found')

    const info = JSON.parse(clean.substring(start, end + 1))
    return NextResponse.json(info)
  } catch (err) {
    console.error('fetch-product error:', err)
    return NextResponse.json({ error: 'Could not analyze URL', detail: String(err) }, { status: 500 })
  }
}
