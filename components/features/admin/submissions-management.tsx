'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Archive, Clock3, Mail, MessageSquare, Phone, Save, Search, Trash2, UserRound, type LucideIcon } from 'lucide-react'
import { deleteContactSubmission, updateContactSubmission, type SubmissionStatus } from '@/actions/contact-submissions'
import type { ContactSubmission } from '@/types'
import { formatDate } from '@/lib/utils'

const statusOptions: { value: SubmissionStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'archived', label: 'Archived' },
]

const statusStyles: Record<SubmissionStatus, string> = {
  new: 'badge-green',
  in_progress: 'badge-yellow',
  contacted: 'badge-blue',
  resolved: 'badge-gray',
  unsubscribed: 'badge-red',
  archived: 'badge-gray',
}

export function SubmissionsManagement({ submissions: initialSubmissions }: { submissions: ContactSubmission[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'contact' | 'newsletter'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all')
  const [drafts, setDrafts] = useState<Record<string, { status: SubmissionStatus; notes: string }>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const filtered = useMemo(() => submissions.filter((submission) => {
    const haystack = [submission.name, submission.email, submission.phone, submission.message].filter(Boolean).join(' ').toLowerCase()
    return (typeFilter === 'all' || submission.type === typeFilter) &&
      (statusFilter === 'all' || submission.status === statusFilter) &&
      (!query.trim() || haystack.includes(query.trim().toLowerCase()))
  }), [query, statusFilter, submissions, typeFilter])

  const getDraft = (submission: ContactSubmission) => drafts[submission.id] || { status: submission.status, notes: submission.notes || '' }

  const updateDraft = (submission: ContactSubmission, patch: Partial<{ status: SubmissionStatus; notes: string }>) => {
    setDrafts((current) => ({ ...current, [submission.id]: { ...getDraft(submission), ...patch } }))
  }

  const save = async (submission: ContactSubmission) => {
    const draft = getDraft(submission)
    setSavingId(submission.id)
    const result = await updateContactSubmission({ id: submission.id, ...draft })
    setSavingId(null)
    if (!result.success) return toast.error(result.error)
    setSubmissions((current) => current.map((item) => item.id === submission.id ? { ...item, ...draft } : item))
    toast.success('Submission updated')
  }

  const archive = async (submission: ContactSubmission) => {
    const result = await updateContactSubmission({ id: submission.id, status: 'archived', notes: getDraft(submission).notes })
    if (!result.success) return toast.error(result.error)
    setSubmissions((current) => current.map((item) => item.id === submission.id ? { ...item, status: 'archived' } : item))
    toast.success('Submission archived')
  }

  const remove = async (submission: ContactSubmission) => {
    if (!window.confirm('Delete this submission permanently?')) return
    const result = await deleteContactSubmission(submission.id)
    if (!result.success) return toast.error(result.error)
    setSubmissions((current) => current.filter((item) => item.id !== submission.id))
    toast.success('Submission deleted')
  }

  const counts = {
    total: submissions.length,
    new: submissions.filter((item) => item.status === 'new').length,
    contacts: submissions.filter((item) => item.type === 'contact').length,
    subscribers: submissions.filter((item) => item.type === 'newsletter').length,
  }

  const statCards: { label: string; value: number; Icon: LucideIcon }[] = [
    { label: 'Total submissions', value: counts.total, Icon: MessageSquare },
    { label: 'Needs attention', value: counts.new, Icon: Clock3 },
    { label: 'Contact requests', value: counts.contacts, Icon: UserRound },
    { label: 'Newsletter subscribers', value: counts.subscribers, Icon: Mail },
  ]

  return (
    <div className="fade-in space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads & Subscribers</h1>
          <p className="page-subtitle">Manage contact requests and newsletter subscribers from your website.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map(({ label, value, Icon }) => (
          <div key={label} className="stat-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-400">{label}</p>
              <Icon className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, phone, or message" className="input-base pl-10" />
          </div>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)} className="input-base lg:w-48">
            <option value="all">All types</option>
            <option value="contact">Contact requests</option>
            <option value="newsletter">Newsletter</option>
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="input-base lg:w-44">
            <option value="all">All statuses</option>
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <InboxEmpty />
          <h2 className="mt-4 text-lg font-semibold text-white">No submissions found</h2>
          <p className="mt-1 text-sm text-slate-400">New contact requests and newsletter signups will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((submission) => {
            const draft = getDraft(submission)
            return (
              <article key={submission.id} className="glass-card p-5">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={submission.type === 'contact' ? 'badge-blue' : 'badge-green'}>{submission.type === 'contact' ? 'Contact request' : 'Newsletter'}</span>
                      <span className={statusStyles[draft.status]}>{statusOptions.find((option) => option.value === draft.status)?.label}</span>
                      <span className="text-xs text-slate-500">{formatDate(submission.created_at)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      {submission.name && <span className="flex items-center gap-2 font-semibold text-white"><UserRound className="h-4 w-4 text-emerald-400" />{submission.name}</span>}
                      <a href={`mailto:${submission.email}`} className="flex items-center gap-2 text-slate-300 hover:text-emerald-400"><Mail className="h-4 w-4 text-emerald-400" />{submission.email}</a>
                      {submission.phone && <a href={`tel:${submission.phone}`} className="flex items-center gap-2 text-slate-300 hover:text-emerald-400"><Phone className="h-4 w-4 text-emerald-400" />{submission.phone}</a>}
                    </div>
                    {submission.message && <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{submission.message}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <select value={draft.status} onChange={(event) => updateDraft(submission, { status: event.target.value as SubmissionStatus })} className="input-base h-10 w-40 py-2 text-xs">
                      {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <button onClick={() => save(submission)} disabled={savingId === submission.id} className="btn-primary h-10 px-4 text-xs"><Save className="h-3.5 w-3.5" />Save</button>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-end">
                  <label className="flex-1"><span className="mb-1.5 block text-xs font-semibold text-slate-400">Internal notes</span><textarea value={draft.notes} onChange={(event) => updateDraft(submission, { notes: event.target.value })} rows={2} placeholder="Add follow-up notes for your team..." className="input-base resize-y text-sm" /></label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => archive(submission)} className="btn-secondary h-10 px-3 text-xs"><Archive className="h-3.5 w-3.5" />Archive</button>
                    <button onClick={() => remove(submission)} className="h-10 w-10 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20" title="Delete submission"><Trash2 className="mx-auto h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function InboxEmpty() {
  return <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-slate-600"><MessageSquare className="h-6 w-6" /></div>
}
