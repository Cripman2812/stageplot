import React, { useState } from 'react';
import { EQUIPMENT_LIBRARY } from '../data/equipmentLibrary';
import type { EquipmentCategory } from '../types';
import { useProject } from '../store/ProjectContext';

const CATEGORIES: { id: EquipmentCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'speaker', label: 'Speakers' },
  { id: 'subwoofer', label: 'Subs' },
  { id: 'monitor', label: 'Monitors' },
  { id: 'microphone', label: 'Mics' },
  { id: 'stagebox', label: 'Stageboxes' },
  { id: 'console', label: 'Consoles' },
  { id: 'truss', label: 'Truss' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'instrument', label: 'Instruments' },
  { id: 'foh', label: 'FOH' },
  { id: 'power', label: 'Power' },
  { id: 'cable', label: 'Cables' },
  { id: 'other', label: 'Other' },
];

export function EquipmentLibrary({ onClose }: { onClose?: () => void }) {
  const { addEquipment } = useProject();
  const [cat, setCat] = useState<EquipmentCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = EQUIPMENT_LIBRARY.filter(e => {
    if (cat !== 'all' && e.category !== cat) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sheet-header">
        <strong>Equipment Library</strong>
        {onClose && (
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}
      </div>
      <div style={{ padding: '8px 12px' }}>
        <input
          placeholder="Search equipment…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search equipment"
        />
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '0 8px 8px', overflowX: 'auto' }}>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={cat === c.id ? 'active' : ''}
            style={{
              minHeight: 32,
              padding: '4px 10px',
              borderRadius: 16,
              border: '1px solid var(--border)',
              background: cat === c.id ? 'var(--accent)' : 'var(--bg-card)',
              color: cat === c.id ? '#fff' : 'var(--text)',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(item => (
          <div
            key={item.id}
            className="list-item"
            onClick={() => {
              addEquipment(item.id, 1 + Math.random() * 2, 1 + Math.random() * 2);
              onClose?.();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                addEquipment(item.id);
                onClose?.();
              }
            }}
          >
            <div className="swatch" style={{ background: item.color }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {item.defaultWidth}×{item.defaultDepth}m
                {item.powerWatts ? ` · ${item.powerWatts}W` : ''}
                {item.channels ? ` · ${item.channels}ch` : ''}
              </div>
            </div>
            <span style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>＋</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">No equipment matches.</div>
        )}
      </div>
    </div>
  );
}
