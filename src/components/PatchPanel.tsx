import React, { useState } from 'react';
import { useProject } from '../store/ProjectContext';
import type { PatchItem } from '../types';

export function PatchPanel() {
  const { project, dispatch } = useProject();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [cable, setCable] = useState('XLR');
  const [length, setLength] = useState('');

  const addPatch = () => {
    if (!from.trim() || !to.trim()) return;
    const p: PatchItem = {
      id: crypto.randomUUID(),
      from: from.trim(),
      to: to.trim(),
      cableType: cable,
      lengthM: length ? parseFloat(length) : undefined,
    };
    dispatch({ type: 'ADD_PATCH', payload: p });
    setFrom('');
    setTo('');
    setLength('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sheet-header">
        <strong>Patch / Cable Routing</strong>
      </div>
      <div style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
        <div className="form-row">
          <label>From</label>
          <input value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Stage L Vocal" />
        </div>
        <div className="form-row">
          <label>To</label>
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Console Ch 1" />
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
          <select value={cable} onChange={e => setCable(e.target.value)} style={{ flex: 1 }}>
            <option>XLR</option>
            <option>TRS</option>
            <option>Speakon</option>
            <option>PowerCON</option>
            <option>Cat6 / AES</option>
            <option>DMX</option>
            <option>Other</option>
          </select>
          <input
            style={{ width: 80 }}
            type="number"
            placeholder="m"
            value={length}
            onChange={e => setLength(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addPatch}>
            Add
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {project.patches.length === 0 && (
          <div className="empty-state">No patch lines yet. Document cable runs here.</div>
        )}
        {project.patches.map(p => (
          <div key={p.id} className="list-item">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>
                {p.from} → {p.to}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {p.cableType}
                {p.lengthM ? ` · ${p.lengthM}m` : ''}
              </div>
            </div>
            <button
              className="icon-btn"
              style={{ color: 'var(--danger)' }}
              onClick={() => dispatch({ type: 'DELETE_PATCH', payload: p.id })}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
