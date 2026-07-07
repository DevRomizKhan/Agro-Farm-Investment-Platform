import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getBlogPosts } from '@/actions/blog'
import { APP_NAME } from '@/constants'
import { getBlogPostHref } from '@/lib/utils'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowRight, Share2, FolderOpen, Tag } from 'lucide-react'
import BlogJsonLd from '@/components/blog/blog-json-ld'
import PostShareActions from '@/components/blog/post-share-actions'

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || `Read ${post.title} on ${APP_NAME}`
  const keywords = post.meta_keywords?.join(', ') || post.tags?.join(', ') || ''

  return {
    title: `${title} - ${APP_NAME}`,
    description,
    keywords,
    authors: post.author?.full_name ? [{ name: post.author.full_name }] : [],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      authors: post.author?.full_name ? [post.author.full_name] : [],
      images: post.featured_image ? [{ url: post.featured_image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getBlogPosts('published')
  const filteredRelated = relatedPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags?.some((tag: string) => post.tags?.includes(tag))))
    .slice(0, 3)

  return (
    <div className="min-h-screen">
      <BlogJsonLd post={post} />

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-400">
            <li>
              <Link href="/" className="hover:text-green-400 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-green-400 transition-colors">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-300 line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full aspect-[21/9] object-cover"
            />
          </div>
        )}

        {/* Article Meta */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {post.category && (
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20">
                {post.category}
              </span>
            )}
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <Clock className="h-4 w-4" />
              {Math.ceil(post.content.length / 500)} min read
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-slate-400 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author Info */}
          {post.author && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-800">
              {post.author.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                  {post.author.full_name?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-white font-medium">{post.author.full_name}</p>
                <p className="text-slate-500 text-sm">Author</p>
              </div>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div
            className="text-slate-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-sm border border-slate-700 hover:border-green-500/50 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">Share this article</span>
            </div>
            <PostShareActions title={post.title} />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {filteredRelated.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {filteredRelated.map((relatedPost) => (
              <article key={relatedPost.id} className="glass-card overflow-hidden hover:border-green-500/30 transition-colors group">
                {relatedPost.featured_image && (
                  <Link href={getBlogPostHref(relatedPost)} className="block aspect-video overflow-hidden">
                    <img
                      src={relatedPost.featured_image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {relatedPost.category && (
                      <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                        {relatedPost.category}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock className="h-3 w-3" />
                      {new Date(relatedPost.published_at || relatedPost.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
                    <Link href={getBlogPostHref(relatedPost)}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  {relatedPost.excerpt && (
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                      {relatedPost.excerpt}
                    </p>
                  )}
                  <Link
                    href={getBlogPostHref(relatedPost)}
                    className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                  >
                    Read More
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="glass-card p-8 md:p-12 text-center bg-gradient-to-br from-green-500/10 to-transparent">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Investing?
          </h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Join thousands of investors growing wealth through sustainable agricultural investments in Bangladesh.
          </p>
          <Link
            href="/plans"
            className="btn-primary inline-flex items-center gap-2"
          >
            View Investment Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
