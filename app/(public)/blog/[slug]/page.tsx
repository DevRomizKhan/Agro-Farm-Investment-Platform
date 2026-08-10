import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import { getBlogPostBySlug, getBlogPosts } from '@/actions/blog'
import BlogJsonLd from '@/components/blog/blog-json-ld'
import PostShareActions from '@/components/blog/post-share-actions'
import { APP_NAME } from '@/constants'
import { getBlogPostHref } from '@/lib/utils'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(date))

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) return { title: 'Post Not Found' }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || `Read ${post.title} on ${APP_NAME}`

  return {
    title: `${title} - ${APP_NAME}`,
    description,
    keywords: post.meta_keywords?.join(', ') || post.tags?.join(', ') || '',
    authors: post.author?.full_name ? [{ name: post.author.full_name }] : [],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      authors: post.author?.full_name ? [post.author.full_name] : [],
      images: post.featured_image ? [{ url: post.featured_image, width: 1200, height: 630 }] : [],
    },
    twitter: { card: 'summary_large_image', title, description, images: post.featured_image ? [post.featured_image] : [] },
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  const relatedPosts = (await getBlogPosts('published'))
    .filter((item) => item.id !== post.id && (item.category === post.category || item.tags?.some((tag) => post.tags?.includes(tag))))
    .slice(0, 3)
  const publishedOn = post.published_at || post.created_at
  const readTime = Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 220))
  const authorName = post.author?.full_name || APP_NAME

  return (
    <div className="article-page">
      <BlogJsonLd post={post} />

      <header className="article-hero">
        <div className="article-hero__glow" aria-hidden="true" />
        <div className="article-shell article-hero__inner">
          <Link href="/blog" className="article-back-link">
            <ArrowLeft className="h-4 w-4" />
            All insights
          </Link>

          <div className="article-hero__copy">
            <div className="article-eyebrow">
              {post.category && <span className="article-category">{post.category}</span>}
              <span className="article-meta"><Calendar className="h-3.5 w-3.5" /> {formatDate(publishedOn)}</span>
              <span className="article-meta"><Clock className="h-3.5 w-3.5" /> {readTime} min read</span>
            </div>
            <h1>{post.title}</h1>
            {post.excerpt && <p className="article-dek">{post.excerpt}</p>}
          </div>

          <div className="article-byline">
            {post.author?.avatar_url ? (
              <img src={post.author.avatar_url} alt={authorName} className="article-avatar" />
            ) : (
              <span className="article-avatar article-avatar--initial">{authorName.charAt(0)}</span>
            )}
            <span>
              <span className="article-byline__label">Written by</span>
              <span className="article-byline__name">{authorName}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="article-shell">
        {post.featured_image && (
          <figure className="article-featured-image">
            <img src={post.featured_image} alt={post.title} />
          </figure>
        )}

        <div className="article-reading-layout">
          <aside className="article-rail">
            <span>Share</span>
            <PostShareActions title={post.title} />
          </aside>

          <article className="article-body">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />

            {(post.tags?.length || 0) > 0 && (
              <footer className="article-tags">
                <span className="article-tags__label"><Tag className="h-4 w-4" /> Filed under</span>
                <div>
                  {post.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </footer>
            )}
          </article>
        </div>
      </main>

      {relatedPosts.length > 0 && (
        <section className="related-section">
          <div className="article-shell">
            <div className="related-section__heading">
              <div>
                <p>Keep exploring</p>
                <h2>More from the journal</h2>
              </div>
              <Link href="/blog" className="article-back-link">View all articles <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="related-grid">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="related-card">
                  <Link href={getBlogPostHref(relatedPost)} className="related-card__image">
                    {relatedPost.featured_image ? <img src={relatedPost.featured_image} alt={relatedPost.title} /> : <span />}
                  </Link>
                  <div className="related-card__copy">
                    <div className="related-card__meta">
                      {relatedPost.category && <span>{relatedPost.category}</span>}
                      <time>{formatDate(relatedPost.published_at || relatedPost.created_at)}</time>
                    </div>
                    <h3><Link href={getBlogPostHref(relatedPost)}>{relatedPost.title}</Link></h3>
                    {relatedPost.excerpt && <p>{relatedPost.excerpt}</p>}
                    <Link href={getBlogPostHref(relatedPost)} className="related-card__link">Read article <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
