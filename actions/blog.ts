'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { blogPostSchema, type BlogPostFormData } from '@/schemas'
import { createBlogSlug } from '@/lib/utils'

export type ActionResult = {
  success: boolean
  error?: string
  message?: string
  data?: any
}

export async function getBlogPosts(status?: 'published' | 'draft' | 'archived') {
  const supabase = await createClient()
  
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles(full_name, avatar_url)
    `)
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  } else {
    // For public view, only show published
    query = query.eq('status', 'published')
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  
  return data
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient()

  const { data: posts, error: postsError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (postsError) {
    console.error('Error fetching blog post:', JSON.stringify(postsError, null, 2))
    return null
  }

  const normalizedRequestSlug = createBlogSlug(slug)
  const postData = posts?.find((post) => {
    const normalizedStoredSlug = createBlogSlug(post.slug, post.title)
    return post.slug === slug || post.id === slug || normalizedStoredSlug === normalizedRequestSlug || createBlogSlug(post.title) === normalizedRequestSlug
  })

  if (!postData) {
    return null
  }
  
  // Then fetch author separately
  let author = null
  if (postData.author_id) {
    const { data: authorData, error: authorError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', postData.author_id)
      .maybeSingle()

    if (authorError) {
      console.error('Error fetching blog post author:', JSON.stringify(authorError, null, 2))
    } else {
      author = authorData
    }
  }
  
  // Fetch media
  const { data: mediaData } = await supabase
    .from('blog_media')
    .select('*')
    .eq('blog_post_id', postData.id)
    .order('display_order', { ascending: true })
  
  return {
    ...postData,
    author,
    media: mediaData || [],
  }
}

export async function getBlogPostById(id: string) {
  const supabase = await createClient()
  
  // First try without author relationship
  const { data: postData, error: postError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  
  if (postError) {
    console.error('Error fetching blog post:', JSON.stringify(postError, null, 2))
    return null
  }
  
  if (!postData) {
    return null
  }
  
  // Then fetch author separately
  let author = null
  if (postData.author_id) {
    const { data: authorData, error: authorError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', postData.author_id)
      .maybeSingle()

    if (authorError) {
      console.error('Error fetching blog post author:', JSON.stringify(authorError, null, 2))
    } else {
      author = authorData
    }
  }
  
  // Fetch media
  const { data: mediaData } = await supabase
    .from('blog_media')
    .select('*')
    .eq('blog_post_id', postData.id)
    .order('display_order', { ascending: true })
  
  return {
    ...postData,
    author,
    media: mediaData || [],
  }
}

export async function createBlogPost(data: BlogPostFormData): Promise<ActionResult> {
  const validated = blogPostSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get author profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profileError) {
    console.error('Error fetching blog author profile:', profileError)
    return { success: false, error: profileError.message }
  }
  
  if (!profile) {
    return { success: false, error: 'Profile not found' }
  }

  const adminClient = createAdminClient()
  
  // Generate unique slug if not provided
  let slug = createBlogSlug(validated.data.slug, validated.data.title)
  const { data: existingPost, error: slugCheckError } = await adminClient
    .from('blog_posts')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()
  
  if (slugCheckError) {
    console.error('Error checking blog slug:', slugCheckError)
    return { success: false, error: slugCheckError.message }
  }

  if (existingPost) {
    // Append timestamp to make unique
    slug = `${slug}-${Date.now()}`
  }

  const { error } = await adminClient
    .from('blog_posts')
    .insert({
      title: validated.data.title,
      slug,
      excerpt: validated.data.excerpt,
      content: validated.data.content,
      featured_image: validated.data.featured_image,
      author_id: profile.id,
      category: validated.data.category,
      tags: validated.data.tags || [],
      meta_title: validated.data.meta_title,
      meta_description: validated.data.meta_description,
      meta_keywords: validated.data.meta_keywords || [],
      status: validated.data.status,
      published_at: validated.data.status === 'published' ? new Date().toISOString() : null,
    })

  if (error) {
    console.error('Error creating blog post:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  
  return { success: true, message: 'Blog post created successfully' }
}

export async function updateBlogPost(id: string, data: BlogPostFormData): Promise<ActionResult> {
  const validated = blogPostSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const adminClient = createAdminClient()
  
  // Get current post to check if status is changing to published
const { data: currentPost, error: currentPostError } = await adminClient
    .from('blog_posts')
    .select('status, published_at')
    .eq('id', id)
    .maybeSingle()

  if (currentPostError) {
    console.error('Error fetching current blog post:', currentPostError)
    return { success: false, error: currentPostError.message }
  }
  
  const isPublishing = currentPost?.status !== 'published' && validated.data.status === 'published'
  const nextSlug = createBlogSlug(validated.data.slug, validated.data.title)
  
  const { error } = await adminClient
    .from('blog_posts')
    .update({
      title: validated.data.title,
      slug: nextSlug,
      excerpt: validated.data.excerpt,
      content: validated.data.content,
      featured_image: validated.data.featured_image,
      category: validated.data.category,
      tags: validated.data.tags || [],
      meta_title: validated.data.meta_title,
      meta_description: validated.data.meta_description,
      meta_keywords: validated.data.meta_keywords || [],
      status: validated.data.status,
      published_at: isPublishing ? new Date().toISOString() : currentPost?.published_at,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating blog post:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  revalidatePath(`/blog/${validated.data.slug}`)
  
  return { success: true, message: 'Blog post updated successfully' }
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const adminClient = createAdminClient()
  
  // Get post slug for revalidation
  const { data: post, error: postError } = await adminClient
    .from('blog_posts')
    .select('slug')
    .eq('id', id)
    .maybeSingle()

  if (postError) {
    console.error('Error fetching blog post for deletion:', postError)
    return { success: false, error: postError.message }
  }
  
  const { error } = await adminClient
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  if (post?.slug) {
    revalidatePath(`/blog/${post.slug}`)
  }
  
  return { success: true, message: 'Blog post deleted successfully' }
}

export async function uploadBlogMedia(file: File, blogPostId: string, fileType: string, altText?: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const adminClient = createAdminClient()
  
  // Upload file to storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${blogPostId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
  const { error: uploadError } = await adminClient
    .storage
    .from('blog-media')
    .upload(fileName, file)
  
  if (uploadError) {
    console.error('Error uploading file:', uploadError)
    return { success: false, error: uploadError.message }
  }
  
  // Get public URL
  const { data: { publicUrl } } = adminClient
    .storage
    .from('blog-media')
    .getPublicUrl(fileName)
  
  // Get current max display order
  const { data: existingMedia } = await adminClient
    .from('blog_media')
    .select('display_order')
    .eq('blog_post_id', blogPostId)
    .order('display_order', { ascending: false })
    .limit(1)
  
  const nextOrder = (existingMedia?.[0]?.display_order || 0) + 1
  
  // Save media record
  const { error: dbError } = await adminClient
    .from('blog_media')
    .insert({
      blog_post_id: blogPostId,
      file_url: publicUrl,
      file_name: file.name,
      file_type: fileType,
      file_size: file.size,
      mime_type: file.type,
      alt_text: altText,
      display_order: nextOrder,
    })
  
  if (dbError) {
    console.error('Error saving media record:', dbError)
    // Clean up uploaded file
    await adminClient.storage.from('blog-media').remove([fileName])
    return { success: false, error: dbError.message }
  }
  
  return { success: true, message: 'Media uploaded successfully', data: { url: publicUrl } }
}

export async function deleteBlogMedia(mediaId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const adminClient = createAdminClient()
  
  // Get media record
  const { data: media, error: mediaError } = await adminClient
    .from('blog_media')
    .select('file_url')
    .eq('id', mediaId)
    .maybeSingle()
  
  if (mediaError) {
    console.error('Error fetching blog media:', mediaError)
    return { success: false, error: mediaError.message }
  }

  if (!media) {
    return { success: false, error: 'Media not found' }
  }
  
  // Delete from storage
  const filePath = media.file_url.split('/blog-media/')[1]
  if (filePath) {
    await adminClient.storage.from('blog-media').remove([filePath])
  }
  
  // Delete from database
  const { error } = await adminClient
    .from('blog_media')
    .delete()
    .eq('id', mediaId)
  
  if (error) {
    console.error('Error deleting media:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true, message: 'Media deleted successfully' }
}
