import type { WizardFormData, AdCopyVariant } from '@/types/wizard'

export async function generateAdCopy(form: WizardFormData): Promise<AdCopyVariant[]> {
  const genderLabel = form.targetGender === 'all' ? 'semua gender' : form.targetGender === 'male' ? 'pria' : 'wanita'
  const citiesLabel = form.targetCities.length > 0 ? form.targetCities.join(', ') : 'seluruh Indonesia'

  const prompt = `Kamu adalah copywriter iklan Meta (Facebook & Instagram) terbaik untuk pasar Indonesia.

Buat 3 variasi iklan untuk produk berikut:
- Nama produk: ${form.productName}
- Deskripsi: ${form.productDescription}
- Budget harian: Rp ${form.dailyBudget.toLocaleString('id-ID')}
- Target lokasi: ${citiesLabel}
- Target usia: ${form.targetAgeMin}–${form.targetAgeMax} tahun
- Target gender: ${genderLabel}

Untuk setiap variasi, buat:
1. Headline (maks 40 karakter, kuat dan menarik perhatian)
2. Body copy (maks 125 karakter, benefit-focused, casual Bahasa Indonesia)
3. CTA (call-to-action, maks 20 karakter)

Kembalikan dalam format JSON array berikut, tanpa teks lain:
[
  {
    "id": "variant-1",
    "headline": "...",
    "body": "...",
    "cta": "..."
  },
  {
    "id": "variant-2",
    "headline": "...",
    "body": "...",
    "cta": "..."
  },
  {
    "id": "variant-3",
    "headline": "...",
    "body": "...",
    "cta": "..."
  }
]

Variasi harus berbeda tone: satu urgency, satu benefit, satu social proof.`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-haiku-4-5',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`)

  const data = await res.json()
  const text: string = data.choices?.[0]?.message?.content ?? ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Format respons AI tidak valid')

  return JSON.parse(jsonMatch[0]) as AdCopyVariant[]
}
