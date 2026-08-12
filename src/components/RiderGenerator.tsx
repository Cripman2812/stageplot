import React, { useMemo, useRef } from 'react';
import { useProject } from '../store/ProjectContext';
import {
  calculateTotalPower,
  calculateTotalWeight,
  estimateRoughSPL,
} from '../utils/calculations';
import { exportElementAsPdf, exportElementAsJpeg } from '../utils/export';

export function RiderGenerator() {
  const { project, validationIssues } = useProject();
  const contentRef = useRef<HTMLDivElement>(null);

  const power = useMemo(() => calculateTotalPower(project.objects), [project.objects]);
  const weight = useMemo(() => calculateTotalWeight(project.objects), [project.objects]);
  const spl = useMemo(() => estimateRoughSPL(project.objects), [project.objects]);

  const equipmentSummary = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of project.objects) {
      map.set(o.name, (map.get(o.name) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [project.objects]);

  const baseName = (project.meta.name || 'rider').replace(/\s+/g, '_');

  const onJpeg = async () => {
    if (!contentRef.current) return;
    try {
      await exportElementAsJpeg(contentRef.current, `${baseName}_rider.jpg`);
    } catch {
      alert('JPEG export failed in this browser. Use PDF instead.');
    }
  };

  const onPdf = async () => {
    if (!contentRef.current) return;
    try {
      await exportElementAsPdf(contentRef.current, `${baseName}_rider.pdf`);
    } catch {
      alert('PDF export failed. Try JPEG instead.');
    }
  };

  return (
    <div style={{ overflowY: 'auto', height: '100%', paddingBottom: 24 }}>
      <div className="sheet-header">
        <strong>Technical Rider</strong>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost" onClick={onPdf} style={{ minHeight: 36, padding: '6px 12px' }}>
            PDF
          </button>
          <button className="btn btn-primary" onClick={onJpeg} style={{ minHeight: 36, padding: '6px 12px' }}>
            JPEG
          </button>
        </div>
      </div>

      <div id="rider-content" ref={contentRef}>
      {validationIssues.length > 0 && (
        <div className="warning-box">
          <strong>Validation notes:</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            {validationIssues.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Project Info</h3>
        <p style={{ margin: 4 }}>
          <strong>{project.meta.name}</strong>
        </p>
        <p style={{ margin: 4, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Client: {project.meta.client || '—'} · Venue: {project.meta.venue || '—'}
          <br />
          Date: {project.meta.date} · Engineer: {project.meta.engineer || '—'}
        </p>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Stage</h3>
        <p style={{ margin: 0 }}>
          {project.stage.widthM} m (W) × {project.stage.depthM} m (D) × {project.stage.heightM} m (H)
        </p>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Equipment List</h3>
        {equipmentSummary.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No equipment placed.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {equipmentSummary.map(e => (
              <li key={e.name}>
                {e.count}× {e.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Power Estimate</h3>
        <p style={{ margin: 0 }}>
          Total: <strong>{power.totalWatts} W</strong>
          <br />
          ≈ {power.estimatedAmps230V.toFixed(1)} A @ 230 V · ≈ {power.estimatedAmps120V.toFixed(1)} A @ 120 V
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: 8 }}>
          ⚠ PLANNING ESTIMATE ONLY. Not a certified electrical calculation. Verify with a qualified electrician.
        </p>
        {power.warning && <p style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{power.warning}</p>}
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Weight / Rigging Note</h3>
        <p style={{ margin: 0 }}>
          Estimated equipment mass: <strong>{weight.totalKg.toFixed(0)} kg</strong>
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: 8 }}>
          ⚠ NOT a structural or rigging calculation. All flown / elevated loads must be designed and signed off by a
          qualified rigger and structural engineer. Observe local safety regulations.
        </p>
        {weight.warning && <p style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{weight.warning}</p>}
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Rough SPL Indicator</h3>
        {spl.value !== null ? (
          <p style={{ margin: 0 }}>
            Approx. indicator: <strong>{spl.value} dB</strong> (very rough @1 m assumption)
          </p>
        ) : (
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>{spl.note}</p>
        )}
        <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: 8 }}>
          ⚠ NOT a predictive acoustic model. Coverage, array design and real SPL require measurement and professional
          design. This is a planning aid only.
        </p>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Input / Mic List ({project.inputs.length})</h3>
        {project.inputs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>None defined.</p>
        ) : (
          <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                <th>Ch</th>
                <th>Name</th>
                <th>Source</th>
                <th>Mic / DI</th>
                <th>48V</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {project.inputs
                .slice()
                .sort((a, b) => a.number - b.number)
                .map(i => (
                  <tr key={i.id}>
                    <td>{i.number}</td>
                    <td>{i.name}</td>
                    <td>{i.source}</td>
                    <td>{i.micType || ''}</td>
                    <td>{i.phantom ? 'Y' : ''}</td>
                    <td>{i.notes || ''}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Notes</h3>
        <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{project.notes || '—'}</p>
      </div>

      <div className="warning-box" style={{ marginTop: 16 }}>
        StageForge is a planning and documentation tool. Electrical, structural, acoustic and safety designs must be
        performed and approved by qualified professionals according to applicable regulations and standards.
      </div>
      </div>
    </div>
  );
}
