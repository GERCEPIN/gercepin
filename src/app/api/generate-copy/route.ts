import { NextRequest, NextResponse } from 'next/server'
import { generateAdCopy } from '@/lib/generate-copy'
import type { WizardFormData } from '@/types/wizard'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Omit<WizardFormData, 'productImage'>

    if (!body.productName || !body.productDescription) {
      return NextResponse.json({ error: 'Nama dan deskripsi produk wajib diisi' }, { status: 400 })
    }

    const variants = await generateAdCopy({ ...body, productImage: null })
    return NextResponse.json({ variants })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('generate-copy error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
