import Link from 'next/link'
import { Leaf, Home } from 'lucide-react'
import { ROUTES } from '@/constants'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 mx-auto mb-8">
          <Leaf className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-8xl font-black text-slate-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-slate-400 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href={ROUTES.HOME} className="btn-primary">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
