import { getBlogPosts } from '@/actions/blog'
import { BlogSectionClient } from '@/components/public/blog-section-client'

export async function BlogSection() {
  const posts = await getBlogPosts('published')
  return <BlogSectionClient posts={posts} />
}
