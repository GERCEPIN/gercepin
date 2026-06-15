'use client'

import { useState } from 'react'
import type { WizardFormData, AdCopyVariant } from '@/types/wizard'

interface Props {
  data: WizardFormData
  variants: AdCopyVariant[]
  onBack: () => void
}

export default function StepPreview({ data, variants, onBack }: Props) {
  const [selected, setSelected] = useState<string>(variants[0]?.id ?? '')
  const previewUrl = data.productImage ? URL.createObjectURL(data.productImage) : null
  const chosen = variants.find(v => v.id === selected)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Pilih variasi copy iklan:</p>
        <div className="space-y-3">
          {variants.map(v => (
            <button
              key={v.id}
              onClick={() => setSelected(v.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selected === v.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900 text-sm">{v.headline}</p>
              <p className="text-gray-600 text-xs mt-1">{v.body}</p>
              <span className="inline-block mt-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                {v.cta}
              </span>
            </button>
          ))}
        </div>
      </div>

      {chosen && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Preview iklan:</p>
          <div className="border border-gray-200 rounded-xl overflow-hidden max-w-sm mx-auto shadow-sm">
            {previewUrl ? (
              <img src={previewUrl} alt="produk" className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Tidak ada foto
              </div>
            )}
            <div className="p-3 bg-white">
              <p className="text-xs text-gray-400 mb-1">Iklan · Disponsori</p>
              <p className="font-bold text-sm text-gray-900">{chosen.headline}</p>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{chosen.body}</p>
              <button className="mt-3 w-full text-center text-xs font-semibold text-white bg-blue-600 py-2 rounded-lg">
                {chosen.cta}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <strong>Phase 1 selesai.</strong> Integrasi Meta API (Phase 2) akan menambahkan tombol "Publish Sekarang" di sini.
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50"
        >
          ← Ganti Copy
        </button>
        <button
          disabled
          className="flex-1 bg-gray-200 text-gray-400 py-3 rounded-lg font-medium cursor-not-allowed"
        >
          Publish (Phase 2)
        </button>
      </div>
    </div>
  )
}
