import { Metadata } from 'next'
import { getBlogPosts } from '@/actions/blog'
import { APP_NAME, APP_DESCRIPTION } from '@/constants'
import { getBlogPostHref } from '@/lib/utils'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: `Blog - ${APP_NAME}`,
  description: `Insights, news, and updates about agricultural investments and sustainable farming. ${APP_DESCRIPTION}`,
  keywords: ['agriculture blog', 'farming insights', 'investment tips', 'sustainable agriculture', 'Bangladesh farming'],
  openGraph: {
    title: `Blog - ${APP_NAME}`,
    description: `Insights, news, and updates about agricultural investments and sustainable farming.`,
    type: 'website',
  },
}

export default async function BlogPage() {
  const posts = await getBlogPosts('published')

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Agricultural Investment Insights
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Expert perspectives on sustainable farming, investment opportunities, and the future of agriculture in Bangladesh.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {posts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <div className="glass-card overflow-hidden rounded-3xl border border-white/10">
            {posts[0].featured_image && (
              <div className="aspect-video md:aspect-[21/9] overflow-hidden">
                <img
                  src={posts[0].featured_image}
                  alt={posts[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                {posts[0].category && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                    {posts[0].category}
                  </span>
                )}
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(posts[0].published_at || posts[0].created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 hover:text-emerald-400 transition-colors">
                <Link href={getBlogPostHref(posts[0])}>
                  {posts[0].title}
                </Link>
              </h2>
              {posts[0].excerpt && (
                <p className="text-slate-400 text-lg mb-6 line-clamp-2">
                  {posts[0].excerpt}
                </p>
              )}
              <Link
                href={getBlogPostHref(posts[0])}
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Read More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8">Latest Articles</h2>
        
        {posts.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl">
            <p className="text-slate-400">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <article key={post.id} className="glass-card overflow-hidden rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-colors group">
                {post.featured_image && (
                  <Link href={getBlogPostHref(post)} className="block aspect-video overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                        {post.category}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock className="h-3 w-3" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    <Link href={getBlogPostHref(post)}>
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={getBlogPostHref(post)}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                  >
                    Read More
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
