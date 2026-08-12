import React, { useState } from 'react';
import { useProject } from '../store/ProjectContext';
import type { InputChannel, OutputChannel, MonitorMix } from '../types';
import { generateInputListCSV, generateOutputListCSV, generateMonitorListCSV, downloadBlob } from '../utils/calculations';

export function IOLists() {
  const { project, dispatch } = useProject();
  const [tab, setTab] = useState<'inputs' | 'outputs' | 'monitors'>('inputs');

  const addInput = () => {
    const nextNum = project.inputs.length
      ? Math.max(...project.inputs.map(i => i.number)) + 1
      : 1;
    const ch: InputChannel = {
      id: crypto.randomUUID(),
      number: nextNum,
      name: `Input ${nextNum}`,
      source: '',
      phantom: false,
    };
    dispatch({ type: 'ADD_INPUT', payload: ch });
  };

  const addOutput = () => {
    const nextNum = project.outputs.length
      ? Math.max(...project.outputs.map(o => o.number)) + 1
      : 1;
    const ch: OutputChannel = {
      id: crypto.randomUUID(),
      number: nextNum,
      name: `Output ${nextNum}`,
      destination: '',
      type: 'main',
    };
    dispatch({ type: 'ADD_OUTPUT', payload: ch });
  };

  const addMonitor = () => {
    const m: MonitorMix = {
      id: crypto.randomUUID(),
      name: `Mix ${project.monitors.length + 1}`,
      type: 'wedge',
      channels: [],
    };
    dispatch({ type: 'ADD_MONITOR', payload: m });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="toolbar">
        <button className={tab === 'inputs' ? 'active' : ''} onClick={() => setTab('inputs')}>
          Inputs ({project.inputs.length})
        </button>
        <button className={tab === 'outputs' ? 'active' : ''} onClick={() => setTab('outputs')}>
          Outputs ({project.outputs.length})
        </button>
        <button className={tab === 'monitors' ? 'active' : ''} onClick={() => setTab('monitors')}>
          Monitors ({project.monitors.length})
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {tab === 'inputs' && (
          <>
            {project.inputs
              .sort((a, b) => a.number - b.number)
              .map(ch => (
                <div key={ch.id} className="card" style={{ margin: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <input
                      style={{ width: 56 }}
                      type="number"
                      value={ch.number}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_INPUT',
                          payload: { id: ch.id, changes: { number: +e.target.value } },
                        })
                      }
                    />
                    <input
                      style={{ flex: 1 }}
                      value={ch.name}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_INPUT',
                          payload: { id: ch.id, changes: { name: e.target.value } },
                        })
                      }
                      placeholder="Name"
                    />
                    <button
                      className="icon-btn"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => dispatch({ type: 'DELETE_INPUT', payload: ch.id })}
                      aria-label="Delete"
                    >
                      🗑
                    </button>
                  </div>
                  <input
                    value={ch.source}
                    onChange={e =>
                      dispatch({
                        type: 'UPDATE_INPUT',
                        payload: { id: ch.id, changes: { source: e.target.value } },
                      })
                    }
                    placeholder="Source / instrument"
                    style={{ marginBottom: 6 }}
                  />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={!!ch.phantom}
                        onChange={e =>
                          dispatch({
                            type: 'UPDATE_INPUT',
                            payload: { id: ch.id, changes: { phantom: e.target.checked } },
                          })
                        }
                      />
                      48V
                    </label>
                    <input
                      value={ch.micType || ''}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_INPUT',
                          payload: { id: ch.id, changes: { micType: e.target.value } },
                        })
                      }
                      placeholder="Mic type"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              ))}
            {project.inputs.length === 0 && (
              <div className="empty-state">No inputs yet. Add channels for your patch.</div>
            )}
          </>
        )}

        {tab === 'outputs' && (
          <>
            {project.outputs
              .sort((a, b) => a.number - b.number)
              .map(ch => (
                <div key={ch.id} className="card" style={{ margin: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <input
                      style={{ width: 56 }}
                      type="number"
                      value={ch.number}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_OUTPUT',
                          payload: { id: ch.id, changes: { number: +e.target.value } },
                        })
                      }
                    />
                    <input
                      style={{ flex: 1 }}
                      value={ch.name}
                      onChange={e =>
                        dispatch({
                          type: 'UPDATE_OUTPUT',
                          payload: { id: ch.id, changes: { name: e.target.value } },
                        })
                      }
                    />
                    <button
                      className="icon-btn"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => dispatch({ type: 'DELETE_OUTPUT', payload: ch.id })}
                    >
                      🗑
                    </button>
                  </div>
                  <input
                    value={ch.destination}
                    onChange={e =>
                      dispatch({
                        type: 'UPDATE_OUTPUT',
                        payload: { id: ch.id, changes: { destination: e.target.value } },
                      })
                    }
                    placeholder="Destination"
                    style={{ marginBottom: 6 }}
                  />
                  <select
                    value={ch.type}
                    onChange={e =>
                      dispatch({
                        type: 'UPDATE_OUTPUT',
                        payload: {
                          id: ch.id,
                          changes: { type: e.target.value as OutputChannel['type'] },
                        },
                      })
                    }
                  >
                    <option value="main">Main</option>
                    <option value="monitor">Monitor</option>
                    <option value="aux">Aux</option>
                    <option value="matrix">Matrix</option>
                    <option value="iem">IEM</option>
                  </select>
                </div>
              ))}
            {project.outputs.length === 0 && (
              <div className="empty-state">No outputs defined.</div>
            )}
          </>
        )}

        {tab === 'monitors' && (
          <>
            {project.monitors.map(m => (
              <div key={m.id} className="card" style={{ margin: 8 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    style={{ flex: 1 }}
                    value={m.name}
                    onChange={e => {
                      // simple replace for now
                      const updated = project.monitors.map(x =>
                        x.id === m.id ? { ...x, name: e.target.value } : x
                      );
                      // use a full set via multiple updates not ideal; for simplicity keep as is
                      dispatch({ type: 'DELETE_MONITOR', payload: m.id });
                      dispatch({
                        type: 'ADD_MONITOR',
                        payload: { ...m, name: e.target.value },
                      });
                    }}
                  />
                  <select
                    value={m.type}
                    onChange={e => {
                      dispatch({ type: 'DELETE_MONITOR', payload: m.id });
                      dispatch({
                        type: 'ADD_MONITOR',
                        payload: { ...m, type: e.target.value as 'wedge' | 'iem' },
                      });
                    }}
                  >
                    <option value="wedge">Wedge</option>
                    <option value="iem">IEM</option>
                  </select>
                  <button
                    className="icon-btn"
                    style={{ color: 'var(--danger)' }}
                    onClick={() => dispatch({ type: 'DELETE_MONITOR', payload: m.id })}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
            {project.monitors.length === 0 && (
              <div className="empty-state">No monitor mixes.</div>
            )}
          </>
        )}
      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: 12,
          background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {tab === 'inputs' && (
          <>
            <button className="btn btn-primary" onClick={addInput}>
              ＋ Input
            </button>
            <button
              className="btn btn-ghost"
              onClick={() =>
                downloadBlob(
                  generateInputListCSV(project),
                  'input_list.csv',
                  'text/csv'
                )
              }
            >
              Export CSV
            </button>
          </>
        )}
        {tab === 'outputs' && (
          <>
            <button className="btn btn-primary" onClick={addOutput}>
              ＋ Output
            </button>
            <button
              className="btn btn-ghost"
              onClick={() =>
                downloadBlob(
                  generateOutputListCSV(project),
                  'output_list.csv',
                  'text/csv'
                )
              }
            >
              Export CSV
            </button>
          </>
        )}
        {tab === 'monitors' && (
          <>
            <button className="btn btn-primary" onClick={addMonitor}>
              ＋ Monitor Mix
            </button>
            <button
              className="btn btn-ghost"
              onClick={() =>
                downloadBlob(
                  generateMonitorListCSV(project),
                  'monitor_list.csv',
                  'text/csv'
                )
              }
            >
              Export CSV
            </button>
          </>
        )}
      </div>
    </div>
  );
}
