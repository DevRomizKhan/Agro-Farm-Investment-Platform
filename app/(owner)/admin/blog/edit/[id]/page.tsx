'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Save, Eye, Upload, X, Image as ImageIcon, FileText, Video, Loader2 } from 'lucide-react'
import { getBlogPostById, updateBlogPost, uploadBlogMedia, deleteBlogMedia } from '@/actions/blog'
import { ROUTES, ALLOWED_BLOG_MEDIA_TYPES, MAX_FILE_SIZE } from '@/constants'
import { blogPostSchema, type BlogPostFormData } from '@/schemas'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [post, setPost] = useState<any>(null)
  const [submitStatus, setSubmitStatus] = useState<'draft' | 'published'>('draft')

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
  })

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    setIsLoading(true)
    try {
      const data = await getBlogPostById(postId)
      if (data) {
        setPost(data)
        reset({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          featured_image: data.featured_image || '',
          category: data.category || '',
          tags: data.tags || [],
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || [],
          status: data.status,
        })
      } else {
        toast.error('Blog post not found')
        router.push(ROUTES.ADMIN_BLOG)
      }
    } catch (error) {
      toast.error('Failed to load blog post')
      router.push(ROUTES.ADMIN_BLOG)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: BlogPostFormData) => {
    setIsSaving(true)
    try {
      const result = await updateBlogPost(postId, data)
      if (result.success) {
        toast.success(result.message)
        await loadPost() // Reload to get updated data
      } else {
        toast.error(result.error || 'Failed to update blog post')
      }
    } catch (error) {
      toast.error('Failed to update blog post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDraft = handleSubmit(async (data) => {
    await onSubmit({ ...data, status: 'draft' })
  })

  const handlePublish = handleSubmit(async (data) => {
    await onSubmit({ ...data, status: 'published' })
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!ALLOWED_BLOG_MEDIA_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Allowed: images, PDF, and videos')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 5MB limit')
      return
    }

    setIsUploading(true)
    try {
      const fileType = file.type.startsWith('image') ? 'image' : 
                      file.type.startsWith('video') ? 'video' : 'document'
      
      const result = await uploadBlogMedia(file, postId, fileType)
      
      if (result.success) {
        toast.success(result.message)
        await loadPost() // Reload to show new media
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      const result = await deleteBlogMedia(mediaId)
      if (result.success) {
        toast.success(result.message)
        await loadPost()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to delete media')
    }
  }

  const handleSetFeaturedImage = (url: string) => {
    reset({ ...watch(), featured_image: url })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(ROUTES.ADMIN_BLOG)}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Blog Post</h1>
            <p className="text-slate-400 mt-1">Update your content</p>
          </div>
        </div>
        <div className="flex gap-3">
          {post?.status === 'published' && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View
            </a>
          )}
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="btn-primary gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="glass-card p-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                {...register('title')}
                type="text"
                placeholder="Enter post title"
                className="input-base text-lg font-medium"
              />
              {errors.title && <p className="mt-1.5 text-xs text-red-400">{errors.title.message}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Slug (URL)</label>
              <input
                {...register('slug')}
                type="text"
                placeholder="post-title-url"
                className="input-base"
              />
              {errors.slug && <p className="mt-1.5 text-xs text-red-400">{errors.slug.message}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt</label>
              <textarea
                {...register('excerpt')}
                placeholder="Brief summary of the post (shown in listings)"
                rows={3}
                className="input-base resize-none"
              />
              {errors.excerpt && <p className="mt-1.5 text-xs text-red-400">{errors.excerpt.message}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
              <textarea
                {...register('content')}
                placeholder="Write your blog post content here..."
                rows={15}
                className="input-base resize-none font-mono text-sm"
              />
              {errors.content && <p className="mt-1.5 text-xs text-red-400">{errors.content.message}</p>}
              <p className="mt-2 text-xs text-slate-500">Supports plain text. For rich content, use HTML tags.</p>
            </div>
          </div>

          {/* Media Upload */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Media</h3>
            
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-green-500/50 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                accept={ALLOWED_BLOG_MEDIA_TYPES.join(',')}
                disabled={isUploading}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-slate-400" />
                )}
                <div>
                  <p className="text-sm text-slate-300">
                    {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Images, PDF, or video (max 5MB)
                  </p>
                </div>
              </label>
            </div>

            {post?.media && post.media.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {post.media.map((media: any) => (
                  <div key={media.id} className="relative group">
                    {media.mime_type?.startsWith('image') ? (
                      <img
                        src={media.file_url}
                        alt={media.alt_text || media.file_name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : media.mime_type?.startsWith('video') ? (
                      <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center">
                        <Video className="h-8 w-8 text-slate-400" />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center">
                        <FileText className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(media.id)}
                      className="absolute top-2 right-2 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetFeaturedImage(media.file_url)}
                      className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs transition-opacity ${
                        watch('featured_image') === media.file_url
                          ? 'bg-green-500 text-white'
                          : 'bg-black/60 text-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {watch('featured_image') === media.file_url ? 'Featured' : 'Set as Featured'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {watch('featured_image') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Featured Image</label>
                <div className="relative">
                  <img
                    src={watch('featured_image')}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => reset({ ...watch(), featured_image: '' })}
                    className="absolute top-2 right-2 p-2 rounded bg-red-500/80 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Publish Status</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select {...register('status')} className="input-base">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                Created: {new Date(post?.created_at).toLocaleDateString()}
              </p>
              {post?.published_at && (
                <p className="text-xs text-slate-500 mt-1">
                  Published: {new Date(post.published_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Category</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <input
                {...register('category')}
                type="text"
                placeholder="e.g., Agriculture, Investment"
                className="input-base"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma-separated)</label>
              <input
                {...register('tags')}
                type="text"
                placeholder="farming, investment, growth"
                className="input-base"
              />
              <p className="mt-2 text-xs text-slate-500">Separate tags with commas</p>
            </div>
          </div>

          {/* SEO */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Meta Title</label>
                <input
                  {...register('meta_title')}
                  type="text"
                  placeholder="SEO title (optional)"
                  className="input-base"
                />
                <p className="mt-1 text-xs text-slate-500">Leave empty to use post title</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Meta Description</label>
                <textarea
                  {...register('meta_description')}
                  placeholder="SEO description (optional)"
                  rows={3}
                  className="input-base resize-none"
                />
                <p className="mt-1 text-xs text-slate-500">Leave empty to use excerpt</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Meta Keywords</label>
                <input
                  {...register('meta_keywords')}
                  type="text"
                  placeholder="keyword1, keyword2, keyword3"
                  className="input-base"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
