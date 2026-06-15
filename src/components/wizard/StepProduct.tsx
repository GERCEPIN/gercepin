'use client'

import { useRef } from 'react'
import type { WizardFormData } from '@/types/wizard'

interface Props {
  data: WizardFormData
  onChange: (patch: Partial<WizardFormData>) => void
  onNext: () => void
}

export default function StepProduct({ data, onChange, onNext }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const previewUrl = data.productImage ? URL.createObjectURL(data.productImage) : null

  const valid = data.productName.trim().length > 0 && data.productDescription.trim().length > 0

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
        <input
          type="text"
          value={data.productName}
          onChange={e => onChange({ productName: e.target.value })}
          placeholder="contoh: Kopi Susu Gula Aren"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk *</label>
        <textarea
          value={data.productDescription}
          onChange={e => onChange({ productDescription: e.target.value })}
          placeholder="Ceritakan produkmu: apa keunggulannya, siapa yang cocok pakai, harga, dll."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Produk</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="mx-auto max-h-40 object-contain rounded" />
          ) : (
            <div className="text-gray-400 text-sm">
              <div className="text-3xl mb-2">📷</div>
              Klik untuk upload foto produk
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => onChange({ productImage: e.target.files?.[0] ?? null })}
        />
      </div>

      <button
        onClick={onNext}
        disabled={!valid}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        Lanjut →
      </button>
    </div>
  )
}
