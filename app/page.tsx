'use client'

import { useEffect, useMemo, useState } from 'react'
import { BriefcaseBusiness, CalendarDays, ChevronDown, CircleCheck, FileText, Filter, LayoutDashboard, Link2, Menu, MoreHorizontal, Pencil, Plus, Search, Sparkles, Target, Trash2, TrendingUp, X } from 'lucide-react'

type Status = 'Applied' | 'Interview' | 'Assessment' | 'Offer' | 'Rejected'
type Application = { id: string; company: string; title: string; date: string; link: string; notes: string; status: Status }

const statuses: Status[] = ['Applied', 'Interview', 'Assessment', 'Offer', 'Rejected']
const statusStyles: Record<Status, string> = { Applied: 'status-applied', Interview: 'status-interview', Assessment: 'status-assessment', Offer: 'status-offer', Rejected: 'status-rejected' }
const sampleApplications: Application[] = [
  { id: '1', company: 'Northstar Labs', title: 'Product Designer', date: '2026-10-24', link: 'https://northstar.example/jobs/1', notes: 'Referred by Maya. Portfolio tailored to product-led growth.', status: 'Interview' },
  { id: '2', company: 'Sonder Studio', title: 'Senior UX Researcher', date: '2026-10-20', link: 'https://sonder.example/jobs/2', notes: 'Strong match for qualitative research and systems thinking.', status: 'Assessment' },
  { id: '3', company: 'Vercel', title: 'Product Marketing Manager', date: '2026-10-16', link: 'https://vercel.example/jobs/3', notes: 'Follow up with recruiting after the first week.', status: 'Applied' },
  { id: '4', company: 'Arc & Co.', title: 'Design Systems Lead', date: '2026-10-11', link: 'https://arc.example/jobs/4', notes: 'Final round completed. Waiting on team decision.', status: 'Offer' },
  { id: '5', company: 'Lattice', title: 'Product Designer', date: '2026-09-28', link: 'https://lattice.example/jobs/5', notes: 'Role shifted toward people management.', status: 'Rejected' },
]

function formatDate(value: string) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) }
function initialForm(): Omit<Application, 'id'> { return { company: '', title: '', date: new Date().toISOString().slice(0, 10), link: '', notes: '', status: 'Applied' } }

export default function Page() {
  const [applications, setApplications] = useState<Application[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All' | Status>('All')
  const [sort, setSort] = useState('date')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [form, setForm] = useState(initialForm())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mobileNav, setMobileNav] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => { try { const saved = localStorage.getItem('careerpath-applications'); setApplications(saved ? JSON.parse(saved) : sampleApplications) } catch { setApplications(sampleApplications); setNotice('We could not access saved data, so sample data is shown.') } finally { setHydrated(true) } }, [])
  useEffect(() => { if (!hydrated) return; try { localStorage.setItem('careerpath-applications', JSON.stringify(applications)) } catch { setNotice('Changes are visible here but could not be saved to this browser.') } }, [applications, hydrated])

  const metrics = useMemo(() => ({ total: applications.length, interviews: applications.filter(a => a.status === 'Interview' || a.status === 'Assessment').length, offers: applications.filter(a => a.status === 'Offer').length, rejected: applications.filter(a => a.status === 'Rejected').length }), [applications])
  const filtered = useMemo(() => applications.filter(a => (filter === 'All' || a.status === filter) && `${a.company} ${a.title}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'company' ? a.company.localeCompare(b.company) : sort === 'status' ? a.status.localeCompare(b.status) : b.date.localeCompare(a.date)), [applications, filter, query, sort])

  function openAdd() { setEditing(null); setForm(initialForm()); setErrors({}); setIsFormOpen(true) }
  function openEdit(item: Application) { setEditing(item); setForm({ company: item.company, title: item.title, date: item.date, link: item.link, notes: item.notes, status: item.status }); setErrors({}); setIsFormOpen(true) }
  function save(event: React.FormEvent) { event.preventDefault(); const next: Record<string, string> = {}; if (!form.company.trim()) next.company = 'Company name is required'; if (!form.title.trim()) next.title = 'Job title is required'; if (!form.date) next.date = 'Application date is required'; if (form.link && !/^https?:\/\//i.test(form.link)) next.link = 'Use a full URL starting with http:// or https://'; if (Object.keys(next).length) { setErrors(next); return } const item = { ...form, company: form.company.trim(), title: form.title.trim(), id: editing?.id ?? crypto.randomUUID() }; setApplications(current => editing ? current.map(a => a.id === editing.id ? item : a) : [item, ...current]); setIsFormOpen(false); setNotice(editing ? 'Application updated.' : 'Application added.') }
  function remove(id: string) { const item = applications.find(a => a.id === id); if (item && window.confirm(`Delete the ${item.title} application at ${item.company}?`)) { setApplications(current => current.filter(a => a.id !== id)); setNotice('Application deleted.') } }
  function clearSamples() { if (window.confirm('Clear all sample applications?')) { setApplications([]); setNotice('Sample data cleared.') } }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Sparkles /></div><div><strong>CareerPath <span>AI</span></strong><small>Career command center</small></div><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X /></button></div>
      <nav aria-label="Primary navigation"><p className="nav-label">Workspace</p><button className="nav-item active"><LayoutDashboard /> Overview</button><button className="nav-item"><BriefcaseBusiness /> Applications <span className="nav-count">{applications.length}</span></button><button className="nav-item"><Target /> Career goals</button><button className="nav-item"><FileText /> Resources</button></nav>
      <div className="sidebar-bottom"><div className="tip-card"><Sparkles /><strong>Make progress visible</strong><p>Keep your next step in view and build momentum every week.</p></div><div className="profile"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><small>Product designer</small></div><MoreHorizontal /></div></div>
    </aside>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation overlay" />}
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu /></button><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>Overview</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications"><CircleCheck /></button><div className="top-avatar">JD</div></div></header>
      <div className="content-wrap">
        <section className="welcome"><div><p className="eyebrow">Tuesday, October 27, 2026</p><h1>Good morning, Jordan <span>👋</span></h1><p className="subtitle">Your career progress at a glance. Keep the momentum going.</p></div><button className="primary-button" onClick={openAdd}><Plus /> Add application</button></section>
        {notice && <div className="notice" role="status"><CircleCheck /> {notice}<button onClick={() => setNotice('')} aria-label="Dismiss notice"><X /></button></div>}
        <section className="metric-grid" aria-label="Application summary"><Metric label="Total applications" value={metrics.total} hint="All time" icon={<BriefcaseBusiness />} tone="blue" /><Metric label="Active interviews" value={metrics.interviews} hint="Keep them moving" icon={<CalendarDays />} tone="violet" /><Metric label="Offers received" value={metrics.offers} hint="Great work" icon={<TrendingUp />} tone="green" /><Metric label="Rejected" value={metrics.rejected} hint="Part of the process" icon={<Target />} tone="orange" /></section>
        <section className="board-section"><div className="section-heading"><div><h2>Application board</h2><p>Track every opportunity from first click to final decision.</p></div><button className="text-button" onClick={clearSamples}>Clear sample data</button></div>
          <div className="toolbar"><div className="search-wrap"><Search /><input aria-label="Search applications" placeholder="Search company or job title..." value={query} onChange={e => setQuery(e.target.value)} />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X /></button>}</div><div className="toolbar-controls"><div className="select-wrap"><Filter /><select aria-label="Filter by status" value={filter} onChange={e => setFilter(e.target.value as 'All' | Status)}><option value="All">All statuses</option>{statuses.map(s => <option key={s}>{s}</option>)}</select><ChevronDown /></div><div className="select-wrap"><select aria-label="Sort applications" value={sort} onChange={e => setSort(e.target.value)}><option value="date">Newest first</option><option value="company">Company A–Z</option><option value="status">Status</option></select><ChevronDown /></div></div></div>
          <div className="table-card"><div className="table-head"><span>Company & role</span><span>Applied</span><span>Status</span><span>Notes</span><span className="sr-only">Actions</span></div>{filtered.length ? filtered.map(item => <article className="application-row" key={item.id}><div className="company-cell"><div className="company-logo">{item.company.slice(0, 1)}</div><div><strong>{item.company}</strong><span>{item.title}</span></div></div><div className="date-cell">{formatDate(item.date)}</div><div><span className={`status-pill ${statusStyles[item.status]}`}><i />{item.status}</span></div><div className="notes-cell" title={item.notes}>{item.notes || '—'}</div><div className="row-actions"><a href={item.link || '#'} target={item.link ? '_blank' : undefined} rel="noreferrer" aria-label={`Open ${item.company} job link`}><Link2 /></a><button onClick={() => openEdit(item)} aria-label={`Edit ${item.company} application`}><Pencil /></button><button onClick={() => remove(item.id)} aria-label={`Delete ${item.company} application`}><Trash2 /></button></div></article>) : <div className="empty-state"><div className="empty-icon"><BriefcaseBusiness /></div><h3>{query || filter !== 'All' ? 'No applications match' : 'Your board is ready'}</h3><p>{query || filter !== 'All' ? 'Try a different search or status filter.' : 'Add your first application to start building your career momentum.'}</p>{!query && filter === 'All' && <button className="primary-button" onClick={openAdd}><Plus /> Add application</button>}</div>}</div>
          <div className="board-footer"><span>Showing {filtered.length} of {applications.length} applications</span><span>Saved automatically in this browser</span></div>
        </section>
      </div>
    </main>
    {isFormOpen && <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><div className="modal-heading"><div><p className="eyebrow">{editing ? 'Update details' : 'New opportunity'}</p><h2 id="form-title">{editing ? 'Edit application' : 'Add application'}</h2></div><button className="icon-button" onClick={() => setIsFormOpen(false)} aria-label="Close form"><X /></button></div><form onSubmit={save} noValidate><div className="form-grid"><FormField label="Company name" id="company" value={form.company} error={errors.company} onChange={v => setForm({ ...form, company: v })} placeholder="e.g. Northstar Labs" /><FormField label="Job title" id="title" value={form.title} error={errors.title} onChange={v => setForm({ ...form, title: v })} placeholder="e.g. Product Designer" /><FormField label="Application date" id="date" type="date" value={form.date} error={errors.date} onChange={v => setForm({ ...form, date: v })} /><div className="field"><label htmlFor="status">Status</label><select id="status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Status })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></div><FormField label="Job link" id="link" value={form.link} error={errors.link} onChange={v => setForm({ ...form, link: v })} placeholder="https://..." /><div className="field full"><label htmlFor="notes">Notes <span>(optional)</span></label><textarea id="notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Add a reminder, contact, or next step..." rows={4} /></div></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setIsFormOpen(false)}>Cancel</button><button type="submit" className="primary-button">{editing ? 'Save changes' : 'Add application'}</button></div></form></div></div>}
  </div>
}

function Metric({ label, value, hint, icon, tone }: { label: string; value: number; hint: string; icon: React.ReactNode; tone: string }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{hint}</small></div></div> }
function FormField({ label, id, value, error, onChange, placeholder, type = 'text' }: { label: string; id: string; value: string; error?: string; onChange: (value: string) => void; placeholder?: string; type?: string }) { return <div className={`field ${error ? 'has-error' : ''}`}><label htmlFor={id}>{label}</label><input id={id} type={type} value={value} placeholder={placeholder} aria-invalid={!!error} onChange={e => onChange(e.target.value)} />{error && <small>{error}</small>}</div> }
