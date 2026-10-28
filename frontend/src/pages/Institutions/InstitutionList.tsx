import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchInstitutions } from '../../api';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, MapPin } from 'lucide-react';
import { mockRegionStats } from '../../mocks/data';

export default function InstitutionList() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  const { data: institutions = [], isLoading } = useQuery({
    queryKey: ['institutions', q],
    queryFn: () => fetchInstitutions(q),
  });

  const regions = [...new Set(mockRegionStats.map((r) => r.region))];

  const filtered = regionFilter
    ? institutions.filter((i) => i.region === regionFilter)
    : institutions;

  return (
    <div className="space-y-4">
      <div className="page-header">
        <div>
          <h1 className="page-title">Institutions</h1>
          <p className="page-subtitle">{filtered.length} AICTE-registered institutions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="institution-search"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, alias, or AICTE ID…"
              className="form-input pl-9"
            />
          </div>
          <select
            id="filter-region"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="form-select w-40"
          >
            <option value="">All Regions</option>
            {regions.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading institutions…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((inst) => (
            <button
              key={inst.id}
              id={`inst-card-${inst.id}`}
              onClick={() => navigate(`/institutions/${inst.id}`)}
              className="card p-4 text-left hover:shadow-card-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                  <Building2 size={17} className="text-brand-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-snug mb-0.5">{inst.name}</p>
                  <p className="text-2xs font-mono text-slate-400 mb-1">{inst.aicte_permanent_id}</p>
                  <div className="flex items-center gap-1 text-2xs text-slate-500">
                    <MapPin size={10} /> {inst.state} · {inst.region}
                  </div>
                  {inst.aliases.length > 0 && (
                    <p className="text-2xs text-slate-400 mt-1 truncate">
                      aka: {inst.aliases.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
