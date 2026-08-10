import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import type { Project, StageObject, InputChannel, OutputChannel, MonitorMix, PatchItem, ViewMode, StageDimensions, LightingFixture, PowerCircuit } from '../types';
import { getOrCreateProject, saveProject, loadAutosave } from '../utils/storage';
import { createEmptyProject, EQUIPMENT_LIBRARY } from '../data/equipmentLibrary';
import { validateProject } from '../utils/calculations';

type Action =
  | { type: 'SET_PROJECT'; payload: Project }
  | { type: 'UPDATE_META'; payload: Partial<Project['meta']> }
  | { type: 'SET_STAGE'; payload: StageDimensions }
  | { type: 'ADD_OBJECT'; payload: StageObject }
  | { type: 'UPDATE_OBJECT'; payload: { id: string; changes: Partial<StageObject> } }
  | { type: 'DELETE_OBJECT'; payload: string }
  | { type: 'DUPLICATE_OBJECT'; payload: string }
  | { type: 'SET_OBJECTS'; payload: StageObject[] }
  | { type: 'ADD_INPUT'; payload: InputChannel }
  | { type: 'UPDATE_INPUT'; payload: { id: string; changes: Partial<InputChannel> } }
  | { type: 'DELETE_INPUT'; payload: string }
  | { type: 'SET_INPUTS'; payload: InputChannel[] }
  | { type: 'ADD_OUTPUT'; payload: OutputChannel }
  | { type: 'UPDATE_OUTPUT'; payload: { id: string; changes: Partial<OutputChannel> } }
  | { type: 'DELETE_OUTPUT'; payload: string }
  | { type: 'ADD_MONITOR'; payload: MonitorMix }
  | { type: 'DELETE_MONITOR'; payload: string }
  | { type: 'ADD_PATCH'; payload: PatchItem }
  | { type: 'DELETE_PATCH'; payload: string }
  | { type: 'ADD_LIGHTING'; payload: LightingFixture }
  | { type: 'UPDATE_LIGHTING'; payload: { id: string; changes: Partial<LightingFixture> } }
  | { type: 'DELETE_LIGHTING'; payload: string }
  | { type: 'ADD_CIRCUIT'; payload: PowerCircuit }
  | { type: 'UPDATE_CIRCUIT'; payload: { id: string; changes: Partial<PowerCircuit> } }
  | { type: 'DELETE_CIRCUIT'; payload: string }
  | { type: 'SET_VIEW'; payload: ViewMode }
  | { type: 'SELECT_OBJECT'; payload: string | null }
  | { type: 'SET_GRID'; payload: { gridSize?: number; snapEnabled?: boolean } }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'NEW_PROJECT'; payload?: string }
  | { type: 'MARK_CLEAN' };

interface State {
  project: Project;
  viewMode: ViewMode;
  selectedObjectId: string | null;
  isDirty: boolean;
  lastSaved: string | null;
  validationIssues: string[];
}

const rawInitialProject = getOrCreateProject();
const initialProject: Project = { ...rawInitialProject, lighting: rawInitialProject.lighting || [], circuits: rawInitialProject.circuits || [] };

const initialState: State = {
  project: initialProject,
  viewMode: '2d',
  selectedObjectId: null,
  isDirty: false,
  lastSaved: null,
  validationIssues: validateProject(initialProject),
};

function reducer(state: State, action: Action): State {
  let next = { ...state };
  switch (action.type) {
    case 'SET_PROJECT':
      next.project = { ...action.payload, lighting: action.payload.lighting || [], circuits: action.payload.circuits || [] };
      next.isDirty = true;
      break;
    case 'UPDATE_META':
      next.project = {
        ...state.project,
        meta: { ...state.project.meta, ...action.payload, updatedAt: new Date().toISOString() },
      };
      next.isDirty = true;
      break;
    case 'SET_STAGE':
      next.project = { ...state.project, stage: action.payload };
      next.isDirty = true;
      break;
    case 'ADD_OBJECT':
      next.project = { ...state.project, objects: [...state.project.objects, action.payload] };
      next.isDirty = true;
      break;
    case 'UPDATE_OBJECT': {
      const objects = state.project.objects.map(o =>
        o.id === action.payload.id ? { ...o, ...action.payload.changes } : o
      );
      next.project = { ...state.project, objects };
      next.isDirty = true;
      break;
    }
    case 'DELETE_OBJECT':
      next.project = {
        ...state.project,
        objects: state.project.objects.filter(o => o.id !== action.payload),
      };
      if (state.selectedObjectId === action.payload) next.selectedObjectId = null;
      next.isDirty = true;
      break;
    case 'DUPLICATE_OBJECT': {
      const src = state.project.objects.find(o => o.id === action.payload);
      if (!src) return state;
      const dup: StageObject = {
        ...src,
        id: crypto.randomUUID(),
        x: src.x + 0.5,
        y: src.y + 0.5,
        name: src.name + ' (copy)',
      };
      next.project = { ...state.project, objects: [...state.project.objects, dup] };
      next.selectedObjectId = dup.id;
      next.isDirty = true;
      break;
    }
    case 'SET_OBJECTS':
      next.project = { ...state.project, objects: action.payload };
      next.isDirty = true;
      break;
    case 'ADD_INPUT':
      next.project = { ...state.project, inputs: [...state.project.inputs, action.payload] };
      next.isDirty = true;
      break;
    case 'UPDATE_INPUT': {
      const inputs = state.project.inputs.map(i =>
        i.id === action.payload.id ? { ...i, ...action.payload.changes } : i
      );
      next.project = { ...state.project, inputs };
      next.isDirty = true;
      break;
    }
    case 'DELETE_INPUT':
      next.project = {
        ...state.project,
        inputs: state.project.inputs.filter(i => i.id !== action.payload),
      };
      next.isDirty = true;
      break;
    case 'SET_INPUTS':
      next.project = { ...state.project, inputs: action.payload };
      next.isDirty = true;
      break;
    case 'ADD_OUTPUT':
      next.project = { ...state.project, outputs: [...state.project.outputs, action.payload] };
      next.isDirty = true;
      break;
    case 'UPDATE_OUTPUT': {
      const outputs = state.project.outputs.map(o =>
        o.id === action.payload.id ? { ...o, ...action.payload.changes } : o
      );
      next.project = { ...state.project, outputs };
      next.isDirty = true;
      break;
    }
    case 'DELETE_OUTPUT':
      next.project = {
        ...state.project,
        outputs: state.project.outputs.filter(o => o.id !== action.payload),
      };
      next.isDirty = true;
      break;
    case 'ADD_MONITOR':
      next.project = { ...state.project, monitors: [...state.project.monitors, action.payload] };
      next.isDirty = true;
      break;
    case 'DELETE_MONITOR':
      next.project = {
        ...state.project,
        monitors: state.project.monitors.filter(m => m.id !== action.payload),
      };
      next.isDirty = true;
      break;
    case 'ADD_PATCH':
      next.project = { ...state.project, patches: [...state.project.patches, action.payload] };
      next.isDirty = true;
      break;
    case 'DELETE_PATCH':
      next.project = { ...state.project, patches: state.project.patches.filter(p => p.id !== action.payload) };
      next.isDirty = true;
      break;
    case 'ADD_LIGHTING':
      next.project = { ...state.project, lighting: [...(state.project.lighting || []), action.payload] };
      next.isDirty = true;
      break;
    case 'UPDATE_LIGHTING':
      next.project = { ...state.project, lighting: (state.project.lighting || []).map(l => l.id === action.payload.id ? { ...l, ...action.payload.changes } : l) };
      next.isDirty = true;
      break;
    case 'DELETE_LIGHTING':
      next.project = { ...state.project, lighting: (state.project.lighting || []).filter(l => l.id !== action.payload) };
      next.isDirty = true;
      break;
    case 'ADD_CIRCUIT':
      next.project = { ...state.project, circuits: [...(state.project.circuits || []), action.payload] };
      next.isDirty = true;
      break;
    case 'UPDATE_CIRCUIT':
      next.project = { ...state.project, circuits: (state.project.circuits || []).map(c => c.id === action.payload.id ? { ...c, ...action.payload.changes } : c) };
      next.isDirty = true;
      break;
    case 'DELETE_CIRCUIT':
      next.project = { ...state.project, circuits: (state.project.circuits || []).filter(c => c.id !== action.payload) };
      next.isDirty = true;
      break;
    case 'SET_VIEW':
      next.viewMode = action.payload;
      break;
    case 'SELECT_OBJECT':
      next.selectedObjectId = action.payload;
      break;
    case 'SET_GRID':
      next.project = {
        ...state.project,
        gridSize: action.payload.gridSize ?? state.project.gridSize,
        snapEnabled: action.payload.snapEnabled ?? state.project.snapEnabled,
      };
      next.isDirty = true;
      break;
    case 'SET_NOTES':
      next.project = { ...state.project, notes: action.payload };
      next.isDirty = true;
      break;
    case 'NEW_PROJECT':
      next.project = createEmptyProject(action.payload || 'New Project');
      next.selectedObjectId = null;
      next.isDirty = true;
      break;
    case 'MARK_CLEAN':
      next.isDirty = false;
      next.lastSaved = new Date().toISOString();
      break;
    default:
      return state;
  }
  next.validationIssues = validateProject(next.project);
  return next;
}

interface ProjectContextValue extends State {
  dispatch: React.Dispatch<Action>;
  save: () => void;
  addEquipment: (templateId: string, x?: number, y?: number) => void;
  selectedObject: StageObject | null;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const autosaveRef = useRef<number | null>(null);

  const save = useCallback(() => {
    saveProject(state.project);
    dispatch({ type: 'MARK_CLEAN' });
  }, [state.project]);

  // Autosave every 30s if dirty
  useEffect(() => {
    if (autosaveRef.current) window.clearInterval(autosaveRef.current);
    autosaveRef.current = window.setInterval(() => {
      if (state.isDirty) {
        saveProject(state.project);
        dispatch({ type: 'MARK_CLEAN' });
      }
    }, 30000);
    return () => {
      if (autosaveRef.current) window.clearInterval(autosaveRef.current);
    };
  }, [state.isDirty, state.project]);

  // Check for autosave recovery on mount
  useEffect(() => {
    const auto = loadAutosave();
    if (auto && auto.project.meta.id !== state.project.meta.id) {
      // optional recovery UI could be added
    }
  }, []);

  const addEquipment = useCallback((templateId: string, x = 1, y = 1) => {
    const tpl = EQUIPMENT_LIBRARY.find(t => t.id === templateId);
    if (!tpl) return;
    const obj: StageObject = {
      id: crypto.randomUUID(),
      type: tpl.category,
      name: tpl.name,
      x,
      y,
      z: 0,
      rotation: 0,
      width: tpl.defaultWidth,
      height: tpl.defaultHeight,
      depth: tpl.defaultDepth,
      color: tpl.color,
      powerWatts: tpl.powerWatts,
      weightKg: tpl.weightKg,
      channels: tpl.channels,
    };
    dispatch({ type: 'ADD_OBJECT', payload: obj });
    dispatch({ type: 'SELECT_OBJECT', payload: obj.id });
  }, []);

  const selectedObject = state.project.objects.find(o => o.id === state.selectedObjectId) || null;

  return (
    <ProjectContext.Provider value={{ ...state, dispatch, save, addEquipment, selectedObject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
