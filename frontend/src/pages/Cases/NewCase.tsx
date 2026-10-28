import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCase } from '../../api';
import { ArrowLeft, Send, Info } from 'lucide-react';
import type { CaseCategory, Bureau } from '../../types';
import { useAuthStore } from '../../store/authStore';

const CATEGORIES: CaseCategory[] = ['Fees','Accreditation','Infrastructure','Faculty','Admission','Examination','Harassment','Other'];
const BUREAUS: Bureau[] = ['RB','PGRC','Regional'];
const SOURCES = ['Online Portal','Email','Walk-in','Post','Helpline'];

export default function NewCase() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    raw_institution_name: '',
    category: '' as CaseCategory | '',
    description: '',
    source: 'Online Portal',
    assigned_bureau: (user?.bureau !== 'Admin' ? user?.bureau : 'RB') as Bureau,
    assigned_officer: user?.full_name ?? '',
  });

  const [resolverResult, setResolverResult] = useState<{
    name: string; score: number; aicte_id: string; needs_mapping: boolean
  } | null>(null);

  const mutation = useMutation({
    mutationFn: () => createCase({ ...form, category: form.category || undefined }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      navigate(`/cases/${data.id}`);
    },
  });

  // Simulate name resolution when institution name changes (on blur)
  const handleNameBlur = () => {
    if (!form.raw_institution_name.trim()) return;
    const name = form.raw_institution_name.toLowerCase();
    // Mock resolver: simple keyword match
    const map: Record<string, { name: string; score: number; aicte_id: string }> = {
      'svit':    { name: 'Swami Vivekanand Institute of Technology', score: 0.92, aicte_id: 'AP100001' },
      'vit':     { name: 'Vellore Institute of Technology', score: 0.94, aicte_id: 'AP100011' },
      'nit':     { name: 'Maulana Azad National Institute of Technology', score: 0.87, aicte_id: 'AP100007' },
      'bits':    { name: 'Birla Institute of Technology and Science', score: 0.96, aicte_id: 'AP100008' },
      'thapar':  { name: 'Thapar Institute of Engineering and Technology', score: 0.95, aicte_id: 'AP100010' },
      'lpu':     { name: 'Lovely Professional University', score: 0.91, aicte_id: 'AP100014' },
      'kiit':    { name: 'Kalinga Institute of Industrial Technology', score: 0.93, aicte_id: 'AP100015' },
      'amrita':  { name: 'Amrita Vishwa Vidyapeetham', score: 0.88, aicte_id: 'AP100009' },
      'niem':    { name: 'National Institute of Engineering and Management', score: 0.91, aicte_id: 'AP100002' },
    };

    const matched = Object.entries(map).find(([k]) => name.includes(k));
    if (matched) {
      setResolverResult({ ...matched[1], needs_mapping: false });
    } else if (form.raw_institution_name.length > 5) {
      setResolverResult({ name: form.raw_institution_name, score: 0.35, aicte_id: '?', needs_mapping: true });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.raw_institution_name || !form.category || !form.description) return;
    mutation.mutate();
  };

  const isValid = form.raw_institution_name && form.category && form.description.length >= 20;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <button id="btn-back-from-new" onClick={() => navigate(-1)} className="btn-ghost btn-sm">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="page-title">Register New Complaint</h1>
          <p className="page-subtitle">All fields marked * are required</p>
        </div>
      </div>

      <div className="alert-banner-info">
        <Info size={15} className="shrink-0" />
        <span>The system will automatically attempt to resolve the institution name and check for overlapping complaints in other bureaus.</span>
      </div>

      <form id="new-case-form" onSubmit={handleSubmit} className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-slate-700">Complaint Details</h2>
        </div>
        <div className="card-body space-y-5">
          {/* Institution name */}
          <div>
            <label htmlFor="new-institution-name" className="form-label">
              Institution Name (as reported) <span className="text-red-500">*</span>
            </label>
            <input
              id="new-institution-name"
              type="text"
              value={form.raw_institution_name}
              onChange={(e) => { setForm((f) => ({ ...f, raw_institution_name: e.target.value })); setResolverResult(null); }}
              onBlur={handleNameBlur}
              className="form-input"
              placeholder="e.g. SVIT Surat, Natl Inst. Engg., VIT Vellore…"
              required
            />
            <p className="text-2xs text-slate-400 mt-1">Enter the name exactly as the complainant reported it. The system will resolve it.</p>

            {/* Resolver result */}
            {resolverResult && (
              <div className={`mt-2 p-3 rounded-lg border text-xs ${resolverResult.needs_mapping ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                {resolverResult.needs_mapping ? (
                  <p className="text-amber-800">
                    ⚠ Low confidence ({Math.round(resolverResult.score * 100)}%). This case will be placed in the <strong>manual mapping queue</strong> for an admin to resolve.
                  </p>
                ) : (
                  <p className="text-emerald-800">
                    ✓ Resolved to <strong>{resolverResult.name}</strong> (AICTE ID: {resolverResult.aicte_id}) — confidence {Math.round(resolverResult.score * 100)}%
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Category + Source */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-category" className="form-label">Category <span className="text-red-500">*</span></label>
              <select
                id="new-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as CaseCategory }))}
                className="form-select"
                required
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="new-source" className="form-label">Source</label>
              <select
                id="new-source"
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                className="form-select"
              >
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Bureau + Officer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-bureau" className="form-label">Assign to Bureau</label>
              <select
                id="new-bureau"
                value={form.assigned_bureau}
                onChange={(e) => setForm((f) => ({ ...f, assigned_bureau: e.target.value as Bureau }))}
                className="form-select"
                disabled={user?.role !== 'Admin'}
              >
                {BUREAUS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="new-officer" className="form-label">Assigned Officer</label>
              <input
                id="new-officer"
                type="text"
                value={form.assigned_officer}
                onChange={(e) => setForm((f) => ({ ...f, assigned_officer: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="new-description" className="form-label">
              Complaint Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="new-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="form-textarea"
              rows={5}
              placeholder="Describe the complaint in detail. Minimum 20 characters."
              required
              minLength={20}
            />
            <p className="text-2xs text-slate-400 mt-1">{form.description.length} characters</p>
          </div>

          <div className="flex gap-3 justify-end">
            <button id="btn-cancel-new-case" type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button
              id="btn-submit-case"
              type="submit"
              disabled={!isValid || mutation.isPending}
              className="btn-primary"
            >
              {mutation.isPending
                ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                : <Send size={14} />
              }
              {mutation.isPending ? 'Registering…' : 'Register Complaint'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
