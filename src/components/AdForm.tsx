'use client'

import { useState } from 'react'

interface AdVariant {
  id: string
  tone: string
  headline: string
  body: string
  cta: string
}

export default function AdForm() {
  const [form, setForm] = useState({
    productName: '',
    productDescription: '',
    adBudget: '',
    targetAudience: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [variants, setVariants] = useState<AdVariant[]>([])

  const valid = form.productName.trim().length > 0 && form.productDescription.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return

    setLoading(true)
    setError(null)
    setVariants([])

    try {
      const res = await fetch('/api/generate-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Gagal generate')
      setVariants(json.variants)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const toneColor: Record<string, string> = {
    Urgency: 'bg-red-100 text-red-700',
    Benefit: 'bg-green-100 text-green-700',
    'Social Proof': 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Gercepin</h1>
          <p className="mt-1 text-sm text-gray-500">Generator copy iklan Meta dengan AI</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">Info Iklan</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
                placeholder="contoh: Kopi Susu Gula Aren"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Deskripsi Produk <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.productDescription}
                onChange={e => setForm(f => ({ ...f, productDescription: e.target.value }))}
                placeholder="Ceritakan keunggulan produkmu, harga, manfaat, dll."
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Budget Iklan</label>
              <input
                type="text"
                value={form.adBudget}
                onChange={e => setForm(f => ({ ...f, adBudget: e.target.value }))}
                placeholder="contoh: Rp 50.000/hari atau Rp 1.500.000/bulan"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Target Audiens</label>
              <input
                type="text"
                value={form.targetAudience}
                onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                placeholder="contoh: Ibu rumah tangga 25-40 tahun di Jakarta"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={!valid || loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? 'Sedang generate...' : 'Generate Copy Iklan'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">✨</div>
            <p className="mt-3 font-medium text-gray-700">Membuat copy iklan untukmu...</p>
            <p className="mt-1 text-sm text-gray-400">Biasanya 5–10 detik</p>
            <div className="mt-4 flex justify-center gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-center shadow-sm">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {variants.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Hasil Copy Iklan</h2>
            {variants.map(v => (
              <div
                key={v.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">Variasi {v.id}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${toneColor[v.tone] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {v.tone}
                  </span>
                </div>
                <p className="font-bold text-gray-900">{v.headline}</p>
                <p className="mt-1 text-sm text-gray-600">{v.body}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    {v.cta}
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(`${v.headline}\n\n${v.body}\n\n${v.cta}`)
                    }
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Salin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
