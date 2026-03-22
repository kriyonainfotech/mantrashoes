'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Save, Plus, Trash2, Upload, X, ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';

import { API_URL } from '@/lib/config';
import { toast } from 'react-hot-toast';


// ─── Image Upload Button ──────────────────────────────────────────────────────
function ImageUpload({
  label,
  currentUrl,
  onUploaded,
  hint,
}: {
  label: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch(`${API_URL}/settings/upload-image`, { method: 'POST', body: form });
      const data = await res.json();
      if (data.success) {
        onUploaded(data.url);
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (e) {
      toast.error('Upload failed. Check your connection.');
    }
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-3">{hint}</p>}

      {/* Preview */}
      {currentUrl && (
        <div className="relative mb-3 inline-block">
          <img src={currentUrl} alt="Preview" className="h-28 object-cover rounded-lg border border-gray-200" />
          <button
            onClick={() => onUploaded('')}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : currentUrl ? 'Change Image' : 'Upload Image'}
        </button>
        {currentUrl && !uploading && <CheckCircle className="w-4 h-4 text-green-500" />}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ─── Gallery Upload (multiple images) ────────────────────────────────────────
function GalleryUpload({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (file: File): Promise<string | null> => {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(`${API_URL}/settings/upload-image`, { method: 'POST', body: form });
    const data = await res.json();
    return data.success ? data.url : null;
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    setError('');
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    if (urls.length) onChange([...images, ...urls]);
    else setError('Upload failed for some files.');
    setUploading(false);
  };

  const remove = (idx: number) => {
    const updated = [...images];
    updated.splice(idx, 1);
    onChange(updated);
  };

  return (
    <div>
      {/* Grid preview */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
        {images.map((url, i) => (
          <div key={i} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => remove(i)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
            <span className="absolute bottom-0 left-0 right-0 text-center text-white text-xs py-0.5 bg-black/40">
              {i + 1}
            </span>
          </div>
        ))}

        {/* Upload placeholder */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-gray-400 transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          <span className="text-xs mt-1">{uploading ? 'Uploading' : 'Add'}</span>
        </button>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? 'Uploading...' : 'Upload Images'}
      </button>
      <p className="text-xs text-gray-400 mt-1">You can select multiple images at once.</p>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
      />
    </div>
  );
}

// ─── Section Card wrapper ─────────────────────────────────────────────────────
function SectionCard({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {badge && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer select-none">
      <div
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-black' : 'bg-gray-300'}`}
        onClick={() => onChange(!checked)}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, textarea, rows, placeholder }: any) {
  const cls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows || 3} placeholder={placeholder} className={cls} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data, fetchData, setData } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { if (data) setFormData(data); }, [data]);

  if (!formData) {
    return (
      <div className="p-8 flex items-center gap-3 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading settings...
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const sec = (field: string, val: any) =>
    setFormData((prev: any) => ({ ...prev, sections: { ...prev.sections, [field]: val } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setData(formData);
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch {
      toast.error('Failed to save settings');
    }
    setSaving(false);
  };

  const hero = formData.sections?.hero || {};
  const brandStory = formData.sections?.brandStory || {};
  const instagram = formData.sections?.instagram || {};

  return (
    <div className="space-y-6 max-w-4xl pb-20">

      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-3 z-10 border-b border-gray-200 -mx-6 px-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your homepage sections and content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium text-sm"
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> Save Changes</>
          }
        </button>
      </div>

      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <SectionCard title="Hero Section" badge="Live on Homepage">
        <p className="text-xs text-gray-400 -mt-2">This fallback content shows when no products are pinned to the hero slider.</p>
        <Toggle
          id="heroEnabled"
          label="Enable Hero Section"
          checked={hero.enabled ?? true}
          onChange={(v) => sec('hero', { ...hero, enabled: v })}
        />
        <Field label="Title" value={hero.title || ''} onChange={(v: string) => sec('hero', { ...hero, title: v })} placeholder="e.g. Walk with Confidence" />
        <Field label="Subtitle" value={hero.subtitle || ''} onChange={(v: string) => sec('hero', { ...hero, subtitle: v })} placeholder="A short tagline..." />
        <ImageUpload
          label="Background Image"
          currentUrl={hero.image || ''}
          onUploaded={(url) => sec('hero', { ...hero, image: url })}
          hint="Recommended: 1920×1080px. Shown behind the hero text."
        />
      </SectionCard>

      {/* ── 2. Brand Story Section ───────────────────────────────────────────── */}
      <SectionCard title="Brand Story Section" badge="Live on Homepage">
        <Toggle
          id="brandStoryEnabled"
          label="Enable Brand Story Section"
          checked={brandStory.enabled ?? true}
          onChange={(v) => sec('brandStory', { ...brandStory, enabled: v })}
        />
        <Field
          label="Title"
          value={brandStory.title || ''}
          onChange={(v: string) => sec('brandStory', { ...brandStory, title: v })}
          placeholder="e.g. Crafted for Comfort"
        />
        <Field
          label="Description"
          value={brandStory.description || ''}
          onChange={(v: string) => sec('brandStory', { ...brandStory, description: v })}
          textarea
          rows={4}
          placeholder="Tell your brand's story..."
        />
        <ImageUpload
          label="Story Image"
          currentUrl={brandStory.image || ''}
          onUploaded={(url) => sec('brandStory', { ...brandStory, image: url })}
          hint="Recommended: 800×1000px portrait. Displayed next to the story text."
        />
      </SectionCard>

      {/* ── 3. Instagram / Photo Gallery Section ─────────────────────────────── */}
      <SectionCard title="Instagram Gallery Section" badge="Live on Homepage">
        <Toggle
          id="instagramEnabled"
          label="Enable Gallery Section"
          checked={instagram.enabled ?? true}
          onChange={(v) => sec('instagram', { ...instagram, enabled: v })}
        />
        <Field
          label="Section Title"
          value={instagram.title || ''}
          onChange={(v: string) => sec('instagram', { ...instagram, title: v })}
          placeholder="e.g. Follow Us @MantraShoes"
        />
        <Field
          label="Instagram Profile URL"
          value={instagram.profileLink || ''}
          onChange={(v: string) => sec('instagram', { ...instagram, profileLink: v })}
          placeholder="https://instagram.com/youraccount"
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">Gallery Images</p>
          <p className="text-xs text-gray-400 mb-3">Upload square images (1:1). Shown as a photo grid on the homepage. Hover over a photo to delete it.</p>
          <GalleryUpload
            images={instagram.images || []}
            onChange={(imgs) => sec('instagram', { ...instagram, images: imgs })}
          />
        </div>
      </SectionCard>

      {/* ── 4. Customer Reviews ───────────────────────────────────────────────── */}
      <SectionCard title="Customer Reviews">
        <Toggle
          id="reviewsEnabled"
          label="Enable Reviews Section"
          checked={formData.sections?.reviews?.enabled ?? true}
          onChange={(v) => sec('reviews', { ...formData.sections?.reviews, enabled: v })}
        />
        <Field
          label="Section Title"
          value={formData.sections?.reviews?.title || ''}
          onChange={(v: string) => sec('reviews', { ...formData.sections?.reviews, title: v })}
          placeholder="e.g. What Our Customers Say"
        />

        <div className="space-y-4">
          {(formData.reviews || []).map((review: any, idx: number) => (
            <div key={review.id} className="p-4 border border-gray-200 rounded-lg space-y-3 relative">
              <button
                onClick={() => {
                  const r = [...formData.reviews];
                  r.splice(idx, 1);
                  setFormData((p: any) => ({ ...p, reviews: r }));
                }}
                className="absolute top-3 right-3 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <Field label="Customer Name" value={review.name} onChange={(v: string) => {
                  const r = [...formData.reviews]; r[idx] = { ...r[idx], name: v };
                  setFormData((p: any) => ({ ...p, reviews: r }));
                }} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (1–5)</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => {
                        const r = [...formData.reviews]; r[idx] = { ...r[idx], rating: star };
                        setFormData((p: any) => ({ ...p, reviews: r }));
                      }} className={`text-xl transition-colors ${star <= review.rating ? 'text-black' : 'text-gray-300'}`}>★</button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Review Text" value={review.review} textarea rows={2} onChange={(v: string) => {
                    const r = [...formData.reviews]; r[idx] = { ...r[idx], review: v };
                    setFormData((p: any) => ({ ...p, reviews: r }));
                  }} />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload
                    label="Customer Avatar"
                    currentUrl={review.image || ''}
                    onUploaded={(url) => {
                      const r = [...formData.reviews]; r[idx] = { ...r[idx], image: url };
                      setFormData((p: any) => ({ ...p, reviews: r }));
                    }}
                    hint="Small square photo of the customer."
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setFormData((p: any) => ({
              ...p,
              reviews: [...(p.reviews || []), { id: Date.now().toString(), name: '', rating: 5, review: '', image: '' }]
            }))}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors text-sm font-medium w-full justify-center"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>
      </SectionCard>

      {/* Save at bottom too */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save All Changes</>}
        </button>
      </div>
    </div>
  );
}
