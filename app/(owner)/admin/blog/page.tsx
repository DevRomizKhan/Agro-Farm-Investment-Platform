'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Eye, Calendar, FolderOpen, Search, Filter } from 'lucide-react'
import { getBlogPosts, deleteBlogPost } from '@/actions/blog'
import { ROUTES } from '@/constants'

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  featured_image?: string | null
  author_id?: string | null
  category?: string | null
  tags?: string[] | null
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string[] | null
  status: 'published' | 'draft' | 'archived'
  published_at?: string | null
  created_at: string
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; post: BlogPost | null }>({ show: false, post: null })

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchQuery, statusFilter])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const data = await getBlogPosts()
      setPosts(data)
    } catch (error) {
      toast.error('Failed to load blog posts')
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = [...posts]

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query)
      )
    }

    setFilteredPosts(filtered)
  }

  const handleDelete = async (post: BlogPost) => {
    setDeleteDialog({ show: true, post })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.post) return

    try {
      const result = await deleteBlogPost(deleteDialog.post.id)
      if (result.success) {
        toast.success(result.message)
        setDeleteDialog({ show: false, post: null })
        loadPosts()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to delete blog post')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'archived':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Management</h1>
          <p className="text-slate-400 mt-1">Create and manage your blog posts</p>
        </div>
        <Link href={ROUTES.ADMIN_BLOG_NEW} className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="input-base sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FolderOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No blog posts found</h3>
          <p className="text-slate-400 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Get started by creating your first blog post'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link href={ROUTES.ADMIN_BLOG_NEW} className="btn-primary gap-2">
              <Plus className="h-4 w-4" />
              Create Post
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="glass-card p-5 hover:border-green-500/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{post.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    {post.category && (
                      <div className="flex items-center gap-1">
                        <FolderOpen className="h-3 w-3" />
                        {post.category}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {post.status === 'published' && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                      title="View post"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={`${ROUTES.ADMIN_BLOG_EDIT}/${post.id}`}
                    className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                    title="Edit post"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Delete Blog Post</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete "{deleteDialog.post?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteDialog({ show: false, post: null })}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
