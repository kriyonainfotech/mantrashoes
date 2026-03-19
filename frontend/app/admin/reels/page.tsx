'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Reel {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  order: number;
  isActive: boolean;
}

export default function AdminReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ caption: '', order: '', isActive: true });
  const fileRef = useRef<HTMLInputElement>(null);

  const token = Cookies.get('token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchReels = async () => {
    const res = await fetch(`${API_URL}/reels/all`, { headers: authHeaders });
    const d = await res.json();
    if (d.reels) setReels(d.reels);
  };

  useEffect(() => { fetchReels(); }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return flash('Select a video file first');
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('caption', caption);
    if (order.trim()) formData.append('order', order);

    try {
      // Use XHR for upload progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/reels`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          const d = JSON.parse(xhr.responseText);
          if (d.success) { flash('Reel uploaded'); resolve(); }
          else { flash(d.message || 'Upload failed'); reject(); }
        };
        xhr.onerror = () => { flash('Network error'); reject(); };
        xhr.send(formData);
      });
      setFile(null);
      setPreview('');
      setCaption('');
      setOrder('');
      if (fileRef.current) fileRef.current.value = '';
      fetchReels();
    } catch (_) {}
    setUploading(false);
    setProgress(0);
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`${API_URL}/reels/${id}`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption: editForm.caption,
        order: Number(editForm.order),
        isActive: editForm.isActive,
      }),
    });
    const d = await res.json();
    if (d.success) { flash('Updated'); setEditId(null); fetchReels(); }
    else flash(d.message || 'Error');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reel? This also removes it from Cloudinary.')) return;
    const res = await fetch(`${API_URL}/reels/${id}`, { method: 'DELETE', headers: authHeaders });
    const d = await res.json();
    if (d.success) { flash('Deleted'); fetchReels(); }
  };

  const toggleActive = async (r: Reel) => {
    await fetch(`${API_URL}/reels/${r._id}`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !r.isActive }),
    });
    fetchReels();
  };

  return (
    <div>
      <div className="mb-8">
        <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '11px', letterSpacing: '0.3em', color: '#888' }}>ADMIN</p>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.8rem', letterSpacing: '0.05em', color: '#0a0a0a' }}>
          Reels
        </h1>
      </div>

      {msg && (
        <div style={{ padding: '12px 18px', marginBottom: 16, border: '0.5px solid rgba(10,10,10,0.2)', fontFamily: 'var(--font-dm-sans)', fontSize: 15 }}>
          {msg}
        </div>
      )}

      {/* Upload form */}
      <form onSubmit={handleUpload} style={{ border: '0.5px solid rgba(10,10,10,0.15)', padding: 24, marginBottom: 32, backgroundColor: '#fff' }}>
        <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '11px', letterSpacing: '0.25em', marginBottom: 20, color: '#555' }}>
          UPLOAD NEW REEL
        </p>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: '0.5px dashed rgba(10,10,10,0.25)',
            padding: 32,
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: 16,
            backgroundColor: '#fafafa',
          }}
        >
          {preview ? (
            <video src={preview} style={{ maxHeight: 200, margin: '0 auto', display: 'block' }} controls />
          ) : (
            <div>
              <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '11px', letterSpacing: '0.2em', color: '#888', marginBottom: 6 }}>
                CLICK TO SELECT VIDEO
              </p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: '#aaa' }}>
                MP4, MOV, WEBM — max 100MB
              </p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="video/mp4,video/mov,video/webm,video/quicktime" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-dm-sans)', fontSize: '13px', letterSpacing: '0.05em', marginBottom: 6, color: '#555', fontWeight: 500 }}>
              Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Optional"
              style={{ width: '100%', padding: '10px 12px', border: '0.5px solid rgba(10,10,10,0.2)', fontFamily: 'var(--font-dm-sans)', fontSize: 15, outline: 'none', backgroundColor: '#fafafa' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-dm-sans)', fontSize: '13px', letterSpacing: '0.05em', marginBottom: 6, color: '#555', fontWeight: 500 }}>
              Order <span style={{ color: '#aaa', fontSize: 12, fontWeight: 400 }}>(leave blank = auto)</span>
            </label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(e.target.value)}
              placeholder="Auto"
              style={{ width: '100%', padding: '10px 12px', border: '0.5px solid rgba(10,10,10,0.2)', fontFamily: 'var(--font-dm-sans)', fontSize: 15, outline: 'none', backgroundColor: '#fafafa' }}
            />
          </div>
        </div>

        {/* Progress bar */}
        {uploading && (
          <div style={{ height: 2, backgroundColor: 'rgba(10,10,10,0.08)', marginBottom: 16 }}>
            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#0a0a0a', transition: 'width 200ms' }} />
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          style={{
            padding: '10px 28px',
            backgroundColor: uploading || !file ? 'rgba(10,10,10,0.3)' : '#0a0a0a',
            color: '#fff',
            fontFamily: 'var(--font-cinzel)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            border: 'none',
            cursor: uploading || !file ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? `UPLOADING ${progress}%` : 'UPLOAD'}
        </button>
      </form>

      {/* Reels list */}
      <div style={{ border: '0.5px solid rgba(10,10,10,0.15)', backgroundColor: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(10,10,10,0.1)' }}>
              {['#', 'PREVIEW', 'CAPTION', 'STATUS', 'ACTIONS'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-dm-sans)', fontSize: '12px', letterSpacing: '0.08em', color: '#888', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reels.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: '#aaa' }}>
                  No reels yet.
                </td>
              </tr>
            )}
            {reels.map(r => (
              <Fragment key={r._id}>
                <tr style={{ borderBottom: editId === r._id ? 'none' : '0.5px solid rgba(10,10,10,0.06)' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-dm-sans)', fontSize: 15, color: '#888' }}>{r.order}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <video
                      src={r.videoUrl}
                      style={{ width: 80, height: 80, objectFit: 'cover', display: 'block' }}
                      muted
                      preload="metadata"
                    />
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-dm-sans)', fontSize: 15, color: '#444' }}>
                    {r.caption || '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => toggleActive(r)}
                      style={{
                        padding: '4px 12px', fontSize: '12px', fontFamily: 'var(--font-dm-sans)', fontWeight: 500,
                        border: '0.5px solid', cursor: 'pointer', backgroundColor: 'transparent',
                        borderColor: r.isActive ? '#22c55e' : 'rgba(10,10,10,0.2)',
                        color: r.isActive ? '#22c55e' : '#aaa',
                      }}
                    >
                      {r.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setEditId(r._id); setEditForm({ caption: r.caption, order: String(r.order), isActive: r.isActive }); }}
                        style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, color: '#0a0a0a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Inline edit row */}
                {editId === r._id && (
                  <tr style={{ borderBottom: '0.5px solid rgba(10,10,10,0.06)', backgroundColor: '#fafafa' }}>
                    <td colSpan={5} style={{ padding: '16px' }}>
                      <div className="flex gap-4 items-end flex-wrap">
                        <div>
                          <label style={{ display: 'block', fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, marginBottom: 4, color: '#555' }}>Caption</label>
                          <input
                            value={editForm.caption}
                            onChange={e => setEditForm(f => ({ ...f, caption: e.target.value }))}
                            style={{ padding: '8px 12px', border: '0.5px solid rgba(10,10,10,0.2)', fontFamily: 'var(--font-dm-sans)', fontSize: 15, outline: 'none', width: 220 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, marginBottom: 4, color: '#555' }}>Order</label>
                          <input
                            type="number"
                            value={editForm.order}
                            onChange={e => setEditForm(f => ({ ...f, order: e.target.value }))}
                            style={{ padding: '8px 12px', border: '0.5px solid rgba(10,10,10,0.2)', fontFamily: 'var(--font-dm-sans)', fontSize: 15, outline: 'none', width: 80 }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id={`active-${r._id}`} checked={editForm.isActive} onChange={e => setEditForm(f => ({ ...f, isActive: e.target.checked }))} />
                          <label htmlFor={`active-${r._id}`} style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 15 }}>Active</label>
                        </div>
                        <button
                          onClick={() => handleUpdate(r._id)}
                          style={{ padding: '9px 22px', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          style={{ padding: '9px 18px', backgroundColor: 'transparent', fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, border: '0.5px solid rgba(10,10,10,0.2)', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
