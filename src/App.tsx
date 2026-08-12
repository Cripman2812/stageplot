import React, { useState, useEffect } from 'react';
import { ProjectProvider, useProject } from './store/ProjectContext';
import { Stage2D } from './components/Stage2D';
import { Stage3D } from './components/Stage3D';
import { EquipmentLibrary } from './components/EquipmentLibrary';
import { IOLists } from './components/IOLists';
import { PatchPanel } from './components/PatchPanel';
import { RiderGenerator } from './components/RiderGenerator';
import { SettingsPanel } from './components/SettingsPanel';
import { PlanningPanel } from './components/PlanningPanel';
import type { ViewMode } from './types';
import './styles/app.css';

function AppShell() {
  const { viewMode, dispatch, project, selectedObject, isDirty } = useProject();
  const [showLibrary, setShowLibrary] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const setView = (v: ViewMode) => dispatch({ type: 'SET_VIEW', payload: v });

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          <h1>StageForge</h1>
          <span className="meta">
            {project.meta.name}
            {isDirty ? ' •' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {!online && <span className="badge warning">Offline</span>}
          <button
            className="icon-btn"
            onClick={() => setShowLibrary(true)}
            aria-label="Add equipment"
            title="Add equipment"
          >
            ＋
          </button>
        </div>
      </header>

      <main className="main-content">
        {viewMode === '2d' && <Stage2D />}
        {viewMode === '3d' && <Stage3D />}
        {viewMode === 'list' && <IOLists />}
        {viewMode === 'patch' && <PatchPanel />}
        {viewMode === 'rider' && <RiderGenerator />}
        {viewMode === 'planning' && <PlanningPanel />}
        {viewMode === 'settings' && <SettingsPanel />}

        {(viewMode === '2d' || viewMode === '3d') && selectedObject && (
          <div
            className="panel"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '30%',
              zIndex: 10,
              borderTop: '1px solid var(--border)',
            }}
          >
            <div style={{ padding: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <strong style={{ fontSize: '0.9rem' }}>{selectedObject.name}</strong>
              <span className="badge">{selectedObject.type}</span>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(70px,1fr))',gap:6,width:'100%'}}>
                {(['x','y','z','rotation'] as const).map(k => <label key={k} style={{fontSize:'.7rem'}}>{k.toUpperCase()}<input type="number" step="0.1" value={selectedObject[k]} onChange={e=>dispatch({type:'UPDATE_OBJECT',payload:{id:selectedObject.id,changes:{[k]:+e.target.value}}})}/></label>)}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(70px,1fr))',gap:6,width:'100%'}}>
                {(['width','height','depth'] as const).map(k => <label key={k} style={{fontSize:'.7rem'}}>{k.toUpperCase()}<input type="number" min="0.01" step="0.05" value={selectedObject[k]} onChange={e=>dispatch({type:'UPDATE_OBJECT',payload:{id:selectedObject.id,changes:{[k]:Math.max(.01,+e.target.value)}}})}/></label>)}
              </div>
              <label style={{display:'flex',alignItems:'center',gap:6,fontSize:'.75rem'}}><input type="checkbox" checked={!!selectedObject.locked} onChange={e=>dispatch({type:'UPDATE_OBJECT',payload:{id:selectedObject.id,changes:{locked:e.target.checked}}})}/> Lock</label>
              {selectedObject.powerWatts ? <span style={{ fontSize: '0.8rem' }}>{selectedObject.powerWatts}W</span> : null}
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav" role="navigation" aria-label="Main">
        <button
          className={`nav-item ${viewMode === '2d' ? 'active' : ''}`}
          onClick={() => setView('2d')}
          aria-current={viewMode === '2d' ? 'page' : undefined}
        >
          <span className="icon">▣</span>
          2D
        </button>
        <button
          className={`nav-item ${viewMode === '3d' ? 'active' : ''}`}
          onClick={() => setView('3d')}
        >
          <span className="icon">▦</span>
          3D
        </button>
        <button
          className={`nav-item ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setView('list')}
        >
          <span className="icon">☰</span>
          I/O
        </button>
        <button
          className={`nav-item ${viewMode === 'patch' ? 'active' : ''}`}
          onClick={() => setView('patch')}
        >
          <span className="icon">⇄</span>
          Patch
        </button>
        <button
          className={`nav-item ${viewMode === 'rider' ? 'active' : ''}`}
          onClick={() => setView('rider')}
        >
          <span className="icon">📄</span>
          Rider
        </button>
        <button
          className={`nav-item ${viewMode === 'planning' ? 'active' : ''}`}
          onClick={() => setView('planning')}
        >
          <span className="icon">⚡</span>
          Plan
        </button>
        <button
          className={`nav-item ${viewMode === 'settings' ? 'active' : ''}`}
          onClick={() => setView('settings')}
        >
          <span className="icon">⚙</span>
          More
        </button>
      </nav>

      {showLibrary && (
        <div className="overlay" onClick={() => setShowLibrary(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()} style={{ height: '75vh' }}>
            <EquipmentLibrary onClose={() => setShowLibrary(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppShell />
    </ProjectProvider>
  );
}
