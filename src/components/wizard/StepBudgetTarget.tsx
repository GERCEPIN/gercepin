'use client'

import type { WizardFormData } from '@/types/wizard'

const CITIES = [
  'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
  'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi',
  'Yogyakarta', 'Bali', 'Bogor', 'Malang', 'Pekanbaru',
]

interface Props {
  data: WizardFormData
  onChange: (patch: Partial<WizardFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepBudgetTarget({ data, onChange, onNext, onBack }: Props) {
  const toggleCity = (city: string) => {
    const current = data.targetCities
    onChange({
      targetCities: current.includes(city) ? current.filter(c => c !== city) : [...current, city],
    })
  }

  const valid = data.dailyBudget >= 10000

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Budget Harian *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
          <input
            type="number"
            min={10000}
            step={10000}
            value={data.dailyBudget}
            onChange={e => onChange({ dailyBudget: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Minimum Rp 10.000/hari</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Kota</label>
        <div className="flex flex-wrap gap-2">
          {CITIES.map(city => (
            <button
              key={city}
              onClick={() => toggleCity(city)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                data.targetCities.includes(city)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">Kosong = seluruh Indonesia</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rentang Usia: {data.targetAgeMin}–{data.targetAgeMax} tahun
        </label>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="range" min={18} max={64}
              value={data.targetAgeMin}
              onChange={e => onChange({ targetAgeMin: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Max</label>
            <input
              type="range" min={19} max={65}
              value={data.targetAgeMax}
              onChange={e => onChange({ targetAgeMax: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Gender</label>
        <div className="flex gap-3">
          {(['all', 'male', 'female'] as const).map(g => (
            <button
              key={g}
              onClick={() => onChange({ targetGender: g })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                data.targetGender === g
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {g === 'all' ? 'Semua' : g === 'male' ? 'Pria' : 'Wanita'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          ← Kembali
        </button>
        <button
          onClick={onNext}
          disabled={!valid}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Generate Copy →
        </button>
      </div>
    </div>
  )
}
