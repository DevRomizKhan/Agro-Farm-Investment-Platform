'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Save, Eye, Upload, X, Image as ImageIcon, FileText, Video } from 'lucide-react'
import { createBlogPost, uploadBlogMedia } from '@/actions/blog'
import { ROUTES, ALLOWED_BLOG_MEDIA_TYPES, MAX_FILE_SIZE } from '@/constants'
import { blogPostSchema, type BlogPostFormData } from '@/schemas'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedMedia, setUploadedMedia] = useState<Array<{ url: string; type: string; name: string }>>([])
  const [featuredImage, setFeaturedImage] = useState<string>('')
  const [submitStatus, setSubmitStatus] = useState<'draft' | 'published'>('draft')

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      status: 'draft',
      tags: [],
      meta_keywords: [],
    },
  })

  const content = watch('content')
  const slug = watch('slug')
  const title = watch('title')

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      // We'll let the server handle uniqueness
    }
  }, [title, slug])

  const onSubmit = async (data: BlogPostFormData) => {
    setIsLoading(true)
    try {
      // Generate slug from title if not provided
      if (!data.slug || data.slug === '') {
        data.slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      }

      const result = await createBlogPost({
        ...data,
        featured_image: featuredImage,
      })

      if (result.success) {
        toast.success(result.message)
        router.push(ROUTES.ADMIN_BLOG)
      } else {
        toast.error(result.error || 'Failed to create blog post')
      }
    } catch (error) {
      toast.error('Failed to create blog post')
    } finally {
      setIsLoading(false)
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
      // For now, we'll upload after the post is created
      // This is a temporary solution - ideally we'd create the post first or use a temp upload
      toast.info('Please save the post first before uploading media')
    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index))
  }

  const handleSetFeaturedImage = (url: string) => {
    setFeaturedImage(url)
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
            <h1 className="text-2xl font-bold text-white">Create New Blog Post</h1>
            <p className="text-slate-400 mt-1">Write and publish your content</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="btn-primary gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Publishing...' : 'Publish'}
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
                <Upload className="h-8 w-8 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-300">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Images, PDF, or video (max 5MB)
                  </p>
                </div>
              </label>
            </div>

            {uploadedMedia.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {uploadedMedia.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.type.startsWith('image') ? (
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : media.type.startsWith('video') ? (
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
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-2 right-2 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetFeaturedImage(media.url)}
                      className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Set as Featured
                    </button>
                  </div>
                ))}
              </div>
            )}

            {featuredImage && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Featured Image</label>
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
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
