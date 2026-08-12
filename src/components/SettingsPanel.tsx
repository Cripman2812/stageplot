import React, { useRef } from 'react';
import { useProject } from '../store/ProjectContext';
import { TEMPLATES } from '../data/equipmentLibrary';
import { importProjectJSON } from '../utils/storage';
import { createEmptyProject } from '../data/equipmentLibrary';

export function SettingsPanel() {
  const { project, dispatch, save, isDirty, lastSaved, validationIssues } = useProject();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const p = await importProjectJSON(file);
      dispatch({ type: 'SET_PROJECT', payload: p });
      alert('Project imported successfully.');
    } catch (err) {
      alert('Import failed: invalid file.');
    }
    e.target.value = '';
  };

  const applyTemplate = (tplId: string) => {
    const tpl = TEMPLATES.find(t => t.id === tplId);
    if (!tpl) return;
    if (!confirm(`Apply template "${tpl.name}"? Current stage size will be replaced.`)) return;
    dispatch({ type: 'SET_STAGE', payload: tpl.stage });
  };

  return (
    <div style={{ overflowY: 'auto', height: '100%', paddingBottom: 24 }}>
      <div className="sheet-header">
        <strong>Project & Settings</strong>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Project Info</h3>
        <div className="form-row">
          <label>Name</label>
          <input
            value={project.meta.name}
            onChange={e => dispatch({ type: 'UPDATE_META', payload: { name: e.target.value } })}
          />
        </div>
        <div className="form-row">
          <label>Client</label>
          <input
            value={project.meta.client}
            onChange={e => dispatch({ type: 'UPDATE_META', payload: { client: e.target.value } })}
          />
        </div>
        <div className="form-row">
          <label>Venue</label>
          <input
            value={project.meta.venue}
            onChange={e => dispatch({ type: 'UPDATE_META', payload: { venue: e.target.value } })}
          />
        </div>
        <div className="form-row">
          <label>Date</label>
          <input
            type="date"
            value={project.meta.date}
            onChange={e => dispatch({ type: 'UPDATE_META', payload: { date: e.target.value } })}
          />
        </div>
        <div className="form-row">
          <label>Engineer</label>
          <input
            value={project.meta.engineer}
            onChange={e => dispatch({ type: 'UPDATE_META', payload: { engineer: e.target.value } })}
          />
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Stage Dimensions (m)</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Width</label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={project.stage.widthM}
              onChange={e =>
                dispatch({
                  type: 'SET_STAGE',
                  payload: { ...project.stage, widthM: +e.target.value },
                })
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Depth</label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={project.stage.depthM}
              onChange={e =>
                dispatch({
                  type: 'SET_STAGE',
                  payload: { ...project.stage, depthM: +e.target.value },
                })
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Height</label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={project.stage.heightM}
              onChange={e =>
                dispatch({
                  type: 'SET_STAGE',
                  payload: { ...project.stage, heightM: +e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Grid</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label>Grid size (m)</label>
            <input
              type="number"
              step="0.25"
              min="0.25"
              value={project.gridSize}
              onChange={e =>
                dispatch({ type: 'SET_GRID', payload: { gridSize: +e.target.value } })
              }
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18 }}>
            <input
              type="checkbox"
              checked={project.snapEnabled}
              onChange={e =>
                dispatch({ type: 'SET_GRID', payload: { snapEnabled: e.target.checked } })
              }
            />
            Snap
          </label>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Templates</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TEMPLATES.map(t => (
            <button key={t.id} className="btn btn-ghost" onClick={() => applyTemplate(t.id)}>
              {t.name} ({t.stage.widthM}×{t.stage.depthM}m)
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Notes</h3>
        <textarea
          rows={4}
          value={project.notes}
          onChange={e => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
          placeholder="Production notes, special requirements…"
        />
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Save / Backup</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
          Status: {isDirty ? 'Unsaved changes' : 'Saved'}
          {lastSaved ? ` · Last: ${new Date(lastSaved).toLocaleTimeString()}` : ''}
          <br />
          Autosave every 30s · Offline-capable (localStorage)
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button className="btn btn-primary" onClick={save}>
            Save Now
          </button>
          <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            Import Project
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={handleImport} />
          <button
            className="btn btn-ghost"
            style={{ color: 'var(--danger)' }}
            onClick={() => {
              if (confirm('Create a new empty project? Unsaved data may be lost.')) {
                dispatch({ type: 'NEW_PROJECT', payload: 'New Project' });
              }
            }}
          >
            New Project
          </button>
        </div>
      </div>

      {validationIssues.length > 0 && (
        <div className="warning-box">
          <strong>Checks:</strong>
          <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
            {validationIssues.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <strong>StageForge v1.0</strong>
        <br />
        Mobile-first stage planning · Offline PWA · Planning estimates only
        <br />
        Package: com.stageforge.app
      </div>
    </div>
  );
}
