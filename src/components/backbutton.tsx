"use client"

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="-ml-1.5 shrink-0 p-1.5 text-muted-foreground transition-colors hover:text-ink"
    >
      <ArrowLeft className="size-5" />
    </button>
  )
}
