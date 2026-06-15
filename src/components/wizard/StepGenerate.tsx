'use client'

import { useEffect, useState } from 'react'
import type { WizardFormData, AdCopyVariant } from '@/types/wizard'

interface Props {
  data: WizardFormData
  onDone: (variants: AdCopyVariant[]) => void
  onBack: () => void
}

export default function StepGenerate({ data, onDone, onBack }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/generate-copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: data.productName,
            productDescription: data.productDescription,
            dailyBudget: data.dailyBudget,
            targetCities: data.targetCities,
            targetAgeMin: data.targetAgeMin,
            targetAgeMax: data.targetAgeMax,
            targetGender: data.targetGender,
          }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Gagal generate')
        onDone(json.variants)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        setLoading(false)
      }
    }
    run()
  }, [])

  if (error) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-4xl">⚠️</div>
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={onBack} className="text-blue-600 underline text-sm">Coba lagi</button>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4 py-12">
      <div className="text-5xl animate-bounce">✨</div>
      <p className="text-gray-700 font-medium">Membuat copy iklan untukmu...</p>
      <p className="text-gray-400 text-sm">Biasanya butuh 5–10 detik</p>
      <div className="flex justify-center gap-1 mt-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
