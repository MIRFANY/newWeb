import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCases } from '../../api';
import type { CaseSearchParams } from '../../api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StatusBadge, BureauTag } from '../../components/shared/Badges';
import { Search, Plus, AlertCircle, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import type { CaseStatus, Bureau, CaseCategory } from '../../types';
import { useAuthStore } from '../../store/authStore';

const STATUSES: CaseStatus[] = ['Pending', 'Under Process', 'Disposed', 'Transferred', 'Escalated'];
const BUREAUS: Bureau[] = ['RB', 'PGRC', 'Regional'];
const CATEGORIES: CaseCategory[] = ['Fees', 'Accreditation', 'Infrastructure', 'Faculty', 'Admission', 'Examination', 'Harassment', 'Other'];

export default function CaseList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const [filters, setFilters] = useState<CaseSearchParams>({
    status: (searchParams.get('status') as CaseStatus) || '',
    bureau: '',
    category: '',
    q: '',
    page: 1,
    page_size: 15,
    needs_manual_mapping: searchParams.get('manual') === 'true' ? true : undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['cases', filters],
    queryFn: () => fetchCases(filters),
  });

  const canCreate = user?.role !== 'Senior_Management';

  const setFilter = (key: keyof CaseSearchParams, val: unknown) =>
    setFilters((f) => ({ ...f, [key]: val, page: 1 }));

  const clearFilters = () =>
    setFilters({ q: '', status: '', bureau: '', category: '', page: 1, page_size: 15 });

  const activeFilterCount = [filters.q, filters.status, filters.bureau, filters.category].filter(Boolean).length +
    (filters.needs_manual_mapping ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cases</h1>
          <p className="page-subtitle">
            {data ? `${data.total} complaint cases` : 'Loading…'}
            {filters.needs_manual_mapping && (
              <span className="ml-2 badge-pending">Manual Mapping Queue</span>
            )}
          </p>
        </div>
        {canCreate && (
          <button
            id="btn-new-case"
            onClick={() => navigate('/cases/new')}
            className="btn-primary"
          >
            <Plus size={15} /> New Case
          </button>
        )}
      </div>

      {/* Search + filters bar */}
      <div className="card">
        <div className="card-body flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="case-search-input"
              type="text"
              value={filters.q ?? ''}
              onChange={(e) => setFilter('q', e.target.value)}
              placeholder="Search by institution name, case ID, description…"
              className="form-input pl-9"
            />
          </div>

          <button
            id="btn-toggle-filters"
            onClick={() => setShowFilters((v) => !v)}
            className={`btn-secondary btn-sm flex items-center gap-1 ${activeFilterCount > 0 ? 'border-brand-400 text-brand-700' : ''}`}
          >
            <Filter size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-brand-700 text-white text-2xs rounded-full px-1.5">{activeFilterCount}</span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button id="btn-clear-filters" onClick={clearFilters} className="btn-ghost btn-sm">
              <X size={13} /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="px-5 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-4">
            <div>
              <label htmlFor="filter-status" className="form-label">Status</label>
              <select id="filter-status" value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className="form-select">
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="filter-bureau" className="form-label">Bureau</label>
              <select id="filter-bureau" value={filters.bureau} onChange={(e) => setFilter('bureau', e.target.value)} className="form-select">
                <option value="">All Bureaus</option>
                {BUREAUS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="filter-category" className="form-label">Category</label>
              <select id="filter-category" value={filters.category} onChange={(e) => setFilter('category', e.target.value)} className="form-select">
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="filter-date-from" className="form-label">From Date</label>
              <input id="filter-date-from" type="date" value={filters.date_from ?? ''} onChange={(e) => setFilter('date_from', e.target.value)} className="form-input" />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table" aria-label="Cases table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Institution</th>
                <th>Category</th>
                <th>Bureau</th>
                <th>Status</th>
                <th>Date</th>
                <th>Expected Disposal</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={8} className="text-center py-8 text-slate-400">Loading…</td></tr>
              )}
              {!isLoading && data?.items.length === 0 && (
                <tr><td colSpan={8} className="text-center py-8 text-slate-400">No cases match the current filters.</td></tr>
              )}
              {data?.items.map((c) => (
                <tr
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/cases/${c.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/cases/${c.id}`)}
                  aria-label={`Open case ${c.id}`}
                >
                  <td>
                    <span className="font-mono text-xs text-brand-700 font-medium">{c.id}</span>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{c.institution?.name ?? c.raw_institution_name}</p>
                      {c.raw_institution_name !== c.institution?.name && (
                        <p className="text-2xs text-slate-400 truncate max-w-[180px]">Raw: {c.raw_institution_name}</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{c.category}</span>
                  </td>
                  <td><BureauTag bureau={c.assigned_bureau} /></td>
                  <td><StatusBadge status={c.current_status} /></td>
                  <td className="text-xs text-slate-500">{format(new Date(c.date_received), 'dd MMM yyyy')}</td>
                  <td className="text-xs text-slate-500">{format(new Date(c.expected_disposal_date), 'dd MMM yyyy')}</td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {c.overlap_group_id && (
                        <span className="badge bg-orange-100 text-orange-700 text-2xs flex items-center gap-0.5">
                          <AlertCircle size={9} /> Overlap
                        </span>
                      )}
                      {c.needs_manual_mapping && (
                        <span className="badge bg-amber-100 text-amber-700 text-2xs">Map</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {((filters.page! - 1) * filters.page_size!) + 1}–{Math.min(filters.page! * filters.page_size!, data.total)} of {data.total}
            </span>
            <div className="flex gap-2">
              <button
                id="btn-prev-page"
                disabled={filters.page === 1}
                onClick={() => setFilter('page', (filters.page ?? 1) - 1)}
                className="btn-secondary btn-xs"
              >
                ← Prev
              </button>
              <span className="px-2 py-1">{filters.page} / {data.total_pages}</span>
              <button
                id="btn-next-page"
                disabled={filters.page === data.total_pages}
                onClick={() => setFilter('page', (filters.page ?? 1) + 1)}
                className="btn-secondary btn-xs"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
