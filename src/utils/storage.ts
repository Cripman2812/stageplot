import type { Project } from '../types';
import { createEmptyProject } from '../data/equipmentLibrary';

const STORAGE_KEY = 'stageforge_project';
const AUTOSAVE_KEY = 'stageforge_autosave';
const SETTINGS_KEY = 'stageforge_settings';
const DB_NAME = 'stageforge-db';
const STORE = 'projects';

function idbPut(project: Project) {
  if (!('indexedDB' in window)) return;
  try {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'meta.id' });
    req.onsuccess = () => { const db=req.result; const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(project); tx.oncomplete=()=>db.close(); };
  } catch {}
}

export function loadProjectFromIndexedDB(): Promise<Project|null> {
  return new Promise(resolve=>{
    if (!('indexedDB' in window)) return resolve(null);
    try { const req=indexedDB.open(DB_NAME,1); req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'meta.id'}); req.onsuccess=()=>{const db=req.result; const tx=db.transaction(STORE,'readonly'); const cur=tx.objectStore(STORE).getAll(); cur.onsuccess=()=>resolve((cur.result?.[0] as Project)||null); cur.onerror=()=>resolve(null);}; req.onerror=()=>resolve(null); } catch { resolve(null); }
  });
}

export function saveProject(project: Project): void {
  try {
    const data = JSON.stringify(project);
    localStorage.setItem(STORAGE_KEY, data);
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ project, timestamp: new Date().toISOString() }));
    idbPut(project);
  } catch (e) {
    console.error('Failed to save project', e);
  }
}

export function loadProject(): Project | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Project;
  } catch {
    return null;
  }
}

export function loadAutosave(): { project: Project; timestamp: string } | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function exportProjectJSON(project: Project): void {
  const data = JSON.stringify(project, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.meta.name.replace(/\s+/g, '_') || 'project'}_stageforge.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProjectJSON(file: File): Promise<Project> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const project = JSON.parse(reader.result as string) as Project;
        if (!project.meta || !project.stage || !Array.isArray(project.objects)) {
          reject(new Error('Invalid project file structure'));
          return;
        }
        project.meta.updatedAt = new Date().toISOString();
        resolve(project);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function getOrCreateProject(): Project {
  const existing = loadProject();
  if (existing) return existing;
  const p = createEmptyProject('Untitled Stage');
  saveProject(p);
  return p;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  language: 'en' | 'tr';
  autosaveIntervalSec: number;
  showGrid: boolean;
  showLabels: boolean;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'en',
  autosaveIntervalSec: 30,
  showGrid: true,
  showLabels: true,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
