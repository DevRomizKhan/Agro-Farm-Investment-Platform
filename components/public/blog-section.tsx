import Link from 'next/link'
import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react'
import { getBlogPosts } from '@/actions/blog'
import { getBlogPostHref } from '@/lib/utils'
import type { BlogPostWithAuthor } from '@/types'

function formatPostDate(post: BlogPostWithAuthor) {
  const date = post.published_at || post.created_at

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function PostImage({ post, featured = false }: { post: BlogPostWithAuthor; featured?: boolean }) {
  if (!post.featured_image) {
    return (
      <div className={`flex h-full items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 ${featured ? 'min-h-[280px]' : 'min-h-[160px]'}`}>
        <BookOpen className="h-12 w-12 text-emerald-500/40" />
      </div>
    )
  }

  return (
    <img
      src={post.featured_image}
      alt={post.title}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  )
}

function Author({ post }: { post: BlogPostWithAuthor }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {post.author?.avatar_url ? (
        <img
          src={post.author.avatar_url}
          alt={post.author.full_name || 'Author'}
          className="h-8 w-8 rounded-full object-cover ring-1 ring-emerald-500/30"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          <User className="h-3.5 w-3.5" />
        </div>
      )}
      <span className="truncate text-xs font-medium text-slate-300">
        {post.author?.full_name || 'Amanah Farm Editorial'}
      </span>
    </div>
  )
}

export async function BlogSection() {
  const posts = await getBlogPosts('published')
  const featuredPost = posts[0]
  const additionalPosts = posts.slice(1, 4)

  return (
    <section id="blog" className="border-t border-white/5 bg-slate-900/40 py-24">
      <div className="section-container">
        <div className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <BookOpen className="h-3.5 w-3.5" />
              Insights &amp; News
            </div>
            <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
              Knowledge Hub for <span className="gradient-text">Smart Investors</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
          >
            All Articles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {!featuredPost ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/50 px-6 py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-emerald-500/50" />
            <h3 className="mb-2 text-xl font-bold text-white">New insights are on the way</h3>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-400">
              Our team is preparing practical insights about agriculture, ethical investing, and sustainable growth.
            </p>
          </div>
        ) : (
          <>
            <article className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="flex flex-col justify-between space-y-8 rounded-3xl border border-white/10 bg-slate-900/60 p-8 lg:col-span-6">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    {featuredPost.category && (
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        {featuredPost.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatPostDate(featuredPost)}
                    </span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold leading-snug text-white sm:text-3xl">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.excerpt && (
                    <p className="line-clamp-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                      {featuredPost.excerpt}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <Author post={featuredPost} />
                  <Link
                    href={getBlogPostHref(featuredPost)}
                    className="btn-primary h-10 px-4 text-xs group"
                  >
                    Read Article
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              <Link
                href={getBlogPostHref(featuredPost)}
                className="group relative min-h-[280px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:col-span-6"
              >
                <PostImage post={featuredPost} featured />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 backdrop-blur-md">
                  <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">Featured insight</p>
                  <p className="line-clamp-1 text-xs text-slate-200">{featuredPost.title}</p>
                </div>
              </Link>
            </article>

            {additionalPosts.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {additionalPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={getBlogPostHref(post)}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 transition-colors hover:border-emerald-500/30"
                  >
                    <div className="h-40 overflow-hidden">
                      <PostImage post={post} />
                    </div>
                    <div className="p-5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="truncate text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {post.category || 'Agriculture'}
                        </span>
                        <span className="shrink-0 text-[10px] text-slate-500">{formatPostDate(post)}</span>
                      </div>
                      <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-white">{post.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
