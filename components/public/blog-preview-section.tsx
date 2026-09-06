import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { getBlogPosts } from '@/actions/blog'
import { getBlogPostHref } from '@/lib/utils'

export async function BlogPreviewSection() {
  const posts = (await getBlogPosts('published')).slice(0, 3)

  if (posts.length === 0) return null

  return (
    <section className="border-t border-white/5 bg-slate-950 py-20">
      <div className="section-container">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">From our journal</p>
            <h2 className="text-3xl font-black text-white sm:text-4xl">Latest insights</h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300">
            View all articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 transition-colors hover:border-emerald-500/40">
              {post.featured_image && (
                <Link href={getBlogPostHref(post)} className="block aspect-video overflow-hidden bg-slate-900">
                  <img src={post.featured_image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
                  {post.category && <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-400">{post.category}</span>}
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold leading-snug text-white transition-colors group-hover:text-emerald-400">
                  <Link href={getBlogPostHref(post)}>{post.title}</Link>
                </h3>
                {post.excerpt && <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-400">{post.excerpt}</p>}
                <Link href={getBlogPostHref(post)} className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                  Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
