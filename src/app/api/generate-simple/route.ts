import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { productName, productDescription, adBudget, targetAudience } = await req.json()

    if (!productName?.trim() || !productDescription?.trim()) {
      return NextResponse.json(
        { error: 'Nama dan deskripsi produk wajib diisi' },
        { status: 400 },
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY tidak ditemukan di .env.local' }, { status: 500 })
    }

    const prompt = `Kamu adalah copywriter iklan Meta (Facebook & Instagram) terbaik untuk pasar Indonesia.

Buat 3 variasi copy iklan untuk produk berikut:
- Nama produk: ${productName}
- Deskripsi: ${productDescription}
- Budget iklan: ${adBudget || 'tidak disebutkan'}
- Target audiens: ${targetAudience || 'umum'}

Untuk setiap variasi buat:
1. Headline (maks 40 karakter, kuat dan eye-catching)
2. Body copy (maks 125 karakter, fokus pada benefit, Bahasa Indonesia kasual)
3. CTA (call-to-action, maks 20 karakter)

Tiga variasi harus berbeda tone: satu urgency, satu benefit, satu social proof.

Kembalikan HANYA JSON array berikut, tanpa teks lain:
[
  { "id": "1", "tone": "Urgency", "headline": "...", "body": "...", "cta": "..." },
  { "id": "2", "tone": "Benefit", "headline": "...", "body": "...", "cta": "..." },
  { "id": "3", "tone": "Social Proof", "headline": "...", "body": "...", "cta": "..." }
]`

    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://gercepin.app',
        'X-Title': 'Gercepin',
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const orData = await orRes.json()

    if (!orRes.ok) {
      const msg = orData?.error?.message ?? `OpenRouter error ${orRes.status}`
      return NextResponse.json({ error: msg }, { status: 502 })
    }

    const text: string = orData?.choices?.[0]?.message?.content ?? ''
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('Format respons AI tidak valid')

    const variants = JSON.parse(jsonMatch[0])
    return NextResponse.json({ variants })
  } catch (err) {
    console.error('generate-simple error:', err)
    return NextResponse.json({ error: 'Gagal generate copy iklan. Coba lagi.' }, { status: 500 })
  }
}
