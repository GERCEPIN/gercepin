'use client'

import { useState } from 'react'
import type { WizardFormData, AdCopyVariant, WizardStep } from '@/types/wizard'
import StepProduct from './StepProduct'
import StepBudgetTarget from './StepBudgetTarget'
import StepGenerate from './StepGenerate'
import StepPreview from './StepPreview'

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 'product', label: 'Produk' },
  { id: 'budget-target', label: 'Budget & Target' },
  { id: 'generate', label: 'Generate' },
  { id: 'preview', label: 'Preview' },
]

const DEFAULT_FORM: WizardFormData = {
  productName: '',
  productDescription: '',
  productImage: null,
  dailyBudget: 50000,
  targetCities: [],
  targetAgeMin: 18,
  targetAgeMax: 45,
  targetGender: 'all',
}

export default function WizardShell() {
  const [step, setStep] = useState<WizardStep>('product')
  const [form, setForm] = useState<WizardFormData>(DEFAULT_FORM)
  const [variants, setVariants] = useState<AdCopyVariant[]>([])

  const patch = (p: Partial<WizardFormData>) => setForm(f => ({ ...f, ...p }))
  const stepIndex = STEPS.findIndex(s => s.id === step)

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gercepin</h1>
          <p className="text-gray-500 text-sm mt-1">Iklan Meta dalam 5 menit, tanpa keahlian teknis</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < stepIndex ? 'bg-blue-600 text-white' :
                i === stepIndex ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                'bg-gray-200 text-gray-400'
              }`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            {step === 'product' && 'Info Produk'}
            {step === 'budget-target' && 'Budget & Target Audiens'}
            {step === 'generate' && 'Membuat Iklan...'}
            {step === 'preview' && 'Pilih & Preview Iklan'}
          </h2>

          {step === 'product' && (
            <StepProduct data={form} onChange={patch} onNext={() => setStep('budget-target')} />
          )}
          {step === 'budget-target' && (
            <StepBudgetTarget
              data={form}
              onChange={patch}
              onNext={() => setStep('generate')}
              onBack={() => setStep('product')}
            />
          )}
          {step === 'generate' && (
            <StepGenerate
              data={form}
              onDone={v => { setVariants(v); setStep('preview') }}
              onBack={() => setStep('budget-target')}
            />
          )}
          {step === 'preview' && (
            <StepPreview data={form} variants={variants} onBack={() => setStep('generate')} />
          )}
        </div>
      </div>
    </div>
  )
}
