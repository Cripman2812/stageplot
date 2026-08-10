import type { EquipmentTemplate } from '../types';

export const EQUIPMENT_LIBRARY: EquipmentTemplate[] = [
  // Speakers
  { id: 'sp-line-array', category: 'speaker', name: 'Line Array Element', defaultWidth: 1.0, defaultHeight: 0.4, defaultDepth: 0.5, color: '#3b82f6', powerWatts: 800, weightKg: 35, description: 'Active line array box' },
  { id: 'sp-point-source', category: 'speaker', name: 'Point Source 15"', defaultWidth: 0.5, defaultHeight: 0.7, defaultDepth: 0.45, color: '#2563eb', powerWatts: 600, weightKg: 28 },
  { id: 'sp-full-range', category: 'speaker', name: 'Full Range 12"', defaultWidth: 0.4, defaultHeight: 0.55, defaultDepth: 0.35, color: '#1d4ed8', powerWatts: 400, weightKg: 18 },
  // Subwoofers
  { id: 'sub-18', category: 'subwoofer', name: 'Subwoofer 18"', defaultWidth: 0.7, defaultHeight: 0.6, defaultDepth: 0.7, color: '#1e3a8a', powerWatts: 1200, weightKg: 55 },
  { id: 'sub-dual-18', category: 'subwoofer', name: 'Dual 18" Sub', defaultWidth: 1.2, defaultHeight: 0.6, defaultDepth: 0.7, color: '#172554', powerWatts: 2400, weightKg: 95 },
  // Monitors
  { id: 'mon-wedge-12', category: 'monitor', name: 'Wedge Monitor 12"', defaultWidth: 0.5, defaultHeight: 0.35, defaultDepth: 0.45, color: '#059669', powerWatts: 350, weightKg: 16 },
  { id: 'mon-wedge-15', category: 'monitor', name: 'Wedge Monitor 15"', defaultWidth: 0.55, defaultHeight: 0.4, defaultDepth: 0.5, color: '#047857', powerWatts: 500, weightKg: 22 },
  { id: 'mon-sidefill', category: 'monitor', name: 'Sidefill', defaultWidth: 0.5, defaultHeight: 0.7, defaultDepth: 0.45, color: '#065f46', powerWatts: 600, weightKg: 30 },
  // Microphones
  { id: 'mic-vocal', category: 'microphone', name: 'Vocal Mic', defaultWidth: 0.05, defaultHeight: 0.18, defaultDepth: 0.05, color: '#a855f7', channels: 1 },
  { id: 'mic-instrument', category: 'microphone', name: 'Instrument Mic', defaultWidth: 0.04, defaultHeight: 0.15, defaultDepth: 0.04, color: '#9333ea', channels: 1 },
  { id: 'mic-drum', category: 'microphone', name: 'Drum Mic Kit', defaultWidth: 0.3, defaultHeight: 0.2, defaultDepth: 0.3, color: '#7e22ce', channels: 8 },
  { id: 'mic-wireless', category: 'microphone', name: 'Wireless Handheld', defaultWidth: 0.05, defaultHeight: 0.25, defaultDepth: 0.05, color: '#6b21a8', channels: 1 },
  // Stageboxes
  { id: 'sb-32ch', category: 'stagebox', name: 'Stagebox 32ch', defaultWidth: 0.5, defaultHeight: 0.15, defaultDepth: 0.4, color: '#ea580c', channels: 32, powerWatts: 50 },
  { id: 'sb-16ch', category: 'stagebox', name: 'Stagebox 16ch', defaultWidth: 0.4, defaultHeight: 0.12, defaultDepth: 0.3, color: '#c2410c', channels: 16, powerWatts: 30 },
  { id: 'sb-digital', category: 'stagebox', name: 'Digital Stagebox', defaultWidth: 0.48, defaultHeight: 0.09, defaultDepth: 0.35, color: '#9a3412', channels: 48, powerWatts: 40 },
  // Consoles
  { id: 'con-digital-48', category: 'console', name: 'Digital Console 48ch', defaultWidth: 1.2, defaultHeight: 0.25, defaultDepth: 0.8, color: '#dc2626', channels: 48, powerWatts: 200, weightKg: 35 },
  { id: 'con-digital-32', category: 'console', name: 'Digital Console 32ch', defaultWidth: 1.0, defaultHeight: 0.22, defaultDepth: 0.7, color: '#b91c1c', channels: 32, powerWatts: 150, weightKg: 28 },
  { id: 'con-analog', category: 'console', name: 'Analog Console 24ch', defaultWidth: 0.9, defaultHeight: 0.2, defaultDepth: 0.65, color: '#991b1b', channels: 24, powerWatts: 80, weightKg: 22 },
  // Truss
  { id: 'truss-2m', category: 'truss', name: 'Truss Section 2m', defaultWidth: 2.0, defaultHeight: 0.3, defaultDepth: 0.3, color: '#64748b', weightKg: 18 },
  { id: 'truss-3m', category: 'truss', name: 'Truss Section 3m', defaultWidth: 3.0, defaultHeight: 0.3, defaultDepth: 0.3, color: '#475569', weightKg: 25 },
  { id: 'truss-corner', category: 'truss', name: 'Truss Corner', defaultWidth: 0.4, defaultHeight: 0.3, defaultDepth: 0.4, color: '#334155', weightKg: 8 },
  // Lighting
  { id: 'light-led-par', category: 'lighting', name: 'LED PAR', defaultWidth: 0.25, defaultHeight: 0.25, defaultDepth: 0.25, color: '#eab308', powerWatts: 150, weightKg: 4 },
  { id: 'light-moving-head', category: 'lighting', name: 'Moving Head Spot', defaultWidth: 0.35, defaultHeight: 0.5, defaultDepth: 0.35, color: '#ca8a04', powerWatts: 300, weightKg: 18 },
  { id: 'light-bar', category: 'lighting', name: 'LED Bar', defaultWidth: 1.0, defaultHeight: 0.1, defaultDepth: 0.1, color: '#a16207', powerWatts: 120, weightKg: 5 },
  { id: 'light-wash', category: 'lighting', name: 'Wash Light', defaultWidth: 0.3, defaultHeight: 0.35, defaultDepth: 0.3, color: '#854d0e', powerWatts: 200, weightKg: 8 },
  // Instruments
  { id: 'inst-drums', category: 'instrument', name: 'Drum Kit', defaultWidth: 2.0, defaultHeight: 1.0, defaultDepth: 1.5, color: '#78716c', weightKg: 50 },
  { id: 'inst-guitar', category: 'instrument', name: 'Guitar Amp', defaultWidth: 0.6, defaultHeight: 0.5, defaultDepth: 0.3, color: '#57534e', powerWatts: 100, weightKg: 20 },
  { id: 'inst-bass', category: 'instrument', name: 'Bass Amp', defaultWidth: 0.6, defaultHeight: 0.7, defaultDepth: 0.4, color: '#44403c', powerWatts: 500, weightKg: 35 },
  { id: 'inst-keys', category: 'instrument', name: 'Keyboard Stand', defaultWidth: 1.2, defaultHeight: 0.9, defaultDepth: 0.4, color: '#292524' },
  // FOH
  { id: 'foh-position', category: 'foh', name: 'FOH Position', defaultWidth: 2.0, defaultHeight: 0.1, defaultDepth: 1.5, color: '#0ea5e9', description: 'Front of House mixing position' },
  // Power
  { id: 'pwr-distro', category: 'power', name: 'Power Distro', defaultWidth: 0.5, defaultHeight: 0.4, defaultDepth: 0.4, color: '#ef4444', powerWatts: 0, weightKg: 15 },
  { id: 'pwr-cable', category: 'cable', name: 'Power Cable Run', defaultWidth: 0.1, defaultHeight: 0.05, defaultDepth: 5.0, color: '#f87171' },
];

export const TEMPLATES = [
  {
    id: 'tpl-small-club',
    name: 'Small Club / Cafe',
    description: 'Compact stage for clubs and cafes',
    stage: { widthM: 6, depthM: 4, heightM: 3 },
  },
  {
    id: 'tpl-theater',
    name: 'Theater / Hall',
    description: 'Medium theater stage',
    stage: { widthM: 12, depthM: 8, heightM: 6 },
  },
  {
    id: 'tpl-festival',
    name: 'Festival Main Stage',
    description: 'Large outdoor festival stage',
    stage: { widthM: 20, depthM: 12, heightM: 10 },
  },
  {
    id: 'tpl-corporate',
    name: 'Corporate Event',
    description: 'Conference / corporate stage',
    stage: { widthM: 10, depthM: 6, heightM: 4 },
  },
];

export function createEmptyProject(name = 'New Project'): import('../types').Project {
  const now = new Date().toISOString();
  return {
    meta: {
      id: crypto.randomUUID(),
      name,
      client: '',
      venue: '',
      date: new Date().toISOString().slice(0, 10),
      engineer: '',
      version: '1.0',
      createdAt: now,
      updatedAt: now,
    },
    stage: { widthM: 10, depthM: 6, heightM: 5 },
    objects: [],
    inputs: [],
    outputs: [],
    monitors: [],
    patches: [],
    lighting: [],
    circuits: [],
    gridSize: 0.5,
    snapEnabled: true,
    notes: '',
  };
}
