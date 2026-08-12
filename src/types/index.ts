export type EquipmentCategory =
  | 'speaker'
  | 'subwoofer'
  | 'monitor'
  | 'microphone'
  | 'stagebox'
  | 'console'
  | 'truss'
  | 'lighting'
  | 'instrument'
  | 'foh'
  | 'cable'
  | 'power'
  | 'other';

export interface StageObject {
  id: string;
  type: EquipmentCategory;
  name: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  width: number;
  height: number;
  depth: number;
  color: string;
  powerWatts?: number;
  weightKg?: number;
  channels?: number;
  notes?: string;
  locked?: boolean;
  groupId?: string;
}

export interface InputChannel {
  id: string;
  number: number;
  name: string;
  source: string;
  micType?: string;
  phantom?: boolean;
  notes?: string;
  stageObjectId?: string;
}

export interface OutputChannel {
  id: string;
  number: number;
  name: string;
  destination: string;
  type: 'main' | 'monitor' | 'aux' | 'matrix' | 'iem';
  notes?: string;
}

export interface MonitorMix {
  id: string;
  name: string;
  type: 'wedge' | 'iem';
  channels: string[];
  notes?: string;
}

export interface PatchItem {
  id: string;
  from: string;
  to: string;
  cableType: string;
  lengthM?: number;
  connector?: string;
  notes?: string;
}

export interface LightingFixture {
  id: string;
  brand: string;
  model: string;
  type: string;
  mode: string;
  universe: number;
  address: number;
  channels: number;
  quantity: number;
  position: string;
  notes?: string;
}

export interface PowerCircuit {
  id: string;
  name: string;
  voltage: number;
  capacityA: number;
  phase: string;
  objectIds: string[];
}

export interface StageDimensions {
  widthM: number;
  depthM: number;
  heightM: number;
}

export interface ProjectMeta {
  id: string;
  name: string;
  client: string;
  venue: string;
  date: string;
  engineer: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  meta: ProjectMeta;
  stage: StageDimensions;
  objects: StageObject[];
  inputs: InputChannel[];
  outputs: OutputChannel[];
  monitors: MonitorMix[];
  patches: PatchItem[];
  lighting: LightingFixture[];
  circuits: PowerCircuit[];
  gridSize: number;
  snapEnabled: boolean;
  notes: string;
  templateId?: string;
}

export interface EquipmentTemplate {
  id: string;
  category: EquipmentCategory;
  name: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  color: string;
  powerWatts?: number;
  weightKg?: number;
  channels?: number;
  description?: string;
}

export type ViewMode = '2d' | '3d' | 'list' | 'patch' | 'rider' | 'planning' | 'settings';

export interface AppState {
  project: Project | null;
  viewMode: ViewMode;
  selectedObjectId: string | null;
  isDirty: boolean;
  offline: boolean;
  lastSaved: string | null;
}
