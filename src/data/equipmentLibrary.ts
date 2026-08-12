import type { EquipmentTemplate } from '../types';

export const EQUIPMENT_LIBRARY: EquipmentTemplate[] = [
  // ========== SPEAKERS / LINE ARRAY ==========
  { id: 'sp-line-array', category: 'speaker', name: 'Line Array Element', defaultWidth: 1.0, defaultHeight: 0.4, defaultDepth: 0.5, color: '#3b82f6', powerWatts: 800, weightKg: 35, description: 'Active line array box' },
  { id: 'sp-line-array-empty', category: 'speaker', name: 'Empty Line Array Frame', defaultWidth: 1.1, defaultHeight: 0.35, defaultDepth: 0.55, color: '#64748b', weightKg: 12, description: 'Empty flying frame / bumper for line array' },
  { id: 'sp-line-array-hang', category: 'speaker', name: 'Line Array Hang (4x)', defaultWidth: 1.1, defaultHeight: 1.8, defaultDepth: 0.55, color: '#2563eb', powerWatts: 3200, weightKg: 150, description: 'Typical 4-box line array hang' },
  { id: 'sp-point-source', category: 'speaker', name: 'Point Source 15"', defaultWidth: 0.5, defaultHeight: 0.7, defaultDepth: 0.45, color: '#2563eb', powerWatts: 600, weightKg: 28 },
  { id: 'sp-full-range', category: 'speaker', name: 'Full Range 12"', defaultWidth: 0.4, defaultHeight: 0.55, defaultDepth: 0.35, color: '#1d4ed8', powerWatts: 400, weightKg: 18 },
  { id: 'sp-front-fill', category: 'speaker', name: 'Front Fill', defaultWidth: 0.35, defaultHeight: 0.25, defaultDepth: 0.3, color: '#1e40af', powerWatts: 250, weightKg: 10 },
  { id: 'sp-delay', category: 'speaker', name: 'Delay Speaker', defaultWidth: 0.4, defaultHeight: 0.5, defaultDepth: 0.35, color: '#1e3a8a', powerWatts: 400, weightKg: 15 },

  // ========== SUBWOOFERS ==========
  { id: 'sub-18', category: 'subwoofer', name: 'Subwoofer 18"', defaultWidth: 0.7, defaultHeight: 0.6, defaultDepth: 0.7, color: '#1e3a8a', powerWatts: 1200, weightKg: 55, description: 'Single 18" subwoofer' },
  { id: 'sub-dual-18', category: 'subwoofer', name: 'Dual 18" Sub', defaultWidth: 1.2, defaultHeight: 0.6, defaultDepth: 0.7, color: '#172554', powerWatts: 2400, weightKg: 95, description: '2x18" dual subwoofer' },
  { id: 'sub-21', category: 'subwoofer', name: 'Subwoofer 21"', defaultWidth: 0.8, defaultHeight: 0.7, defaultDepth: 0.8, color: '#0f172a', powerWatts: 2000, weightKg: 75 },
  { id: 'sub-cardioid', category: 'subwoofer', name: 'Cardioid Sub Array', defaultWidth: 1.4, defaultHeight: 0.6, defaultDepth: 0.8, color: '#1e293b', powerWatts: 3600, weightKg: 140 },

  // ========== MONITORS / WEDGES ==========
  { id: 'mon-wedge-12', category: 'monitor', name: 'Wedge Monitor 12"', defaultWidth: 0.5, defaultHeight: 0.35, defaultDepth: 0.45, color: '#059669', powerWatts: 350, weightKg: 16 },
  { id: 'mon-wedge-15', category: 'monitor', name: 'Wedge Monitor 15"', defaultWidth: 0.55, defaultHeight: 0.4, defaultDepth: 0.5, color: '#047857', powerWatts: 500, weightKg: 22 },
  { id: 'mon-wedge-dual', category: 'monitor', name: 'Dual 12" Wedge', defaultWidth: 0.6, defaultHeight: 0.4, defaultDepth: 0.55, color: '#065f46', powerWatts: 700, weightKg: 28 },
  { id: 'mon-sidefill', category: 'monitor', name: 'Sidefill', defaultWidth: 0.5, defaultHeight: 0.7, defaultDepth: 0.45, color: '#064e3b', powerWatts: 600, weightKg: 30 },
  { id: 'mon-drumfill', category: 'monitor', name: 'Drum Fill / Butt Kicker', defaultWidth: 0.5, defaultHeight: 0.5, defaultDepth: 0.5, color: '#022c22', powerWatts: 800, weightKg: 35 },
  { id: 'mon-iem-rack', category: 'monitor', name: 'IEM Transmitter Rack', defaultWidth: 0.5, defaultHeight: 0.15, defaultDepth: 0.4, color: '#10b981', powerWatts: 100, weightKg: 8, channels: 8 },

  // ========== MICROPHONES ==========
  { id: 'mic-vocal', category: 'microphone', name: 'Vocal Mic (SM58)', defaultWidth: 0.05, defaultHeight: 0.18, defaultDepth: 0.05, color: '#a855f7', channels: 1 },
  { id: 'mic-instrument', category: 'microphone', name: 'Instrument Mic (SM57)', defaultWidth: 0.04, defaultHeight: 0.15, defaultDepth: 0.04, color: '#9333ea', channels: 1 },
  { id: 'mic-drum', category: 'microphone', name: 'Drum Mic Kit (8ch)', defaultWidth: 0.3, defaultHeight: 0.2, defaultDepth: 0.3, color: '#7e22ce', channels: 8 },
  { id: 'mic-wireless', category: 'microphone', name: 'Wireless Handheld', defaultWidth: 0.05, defaultHeight: 0.25, defaultDepth: 0.05, color: '#6b21a8', channels: 1 },
  { id: 'mic-lav', category: 'microphone', name: 'Lavalier / Headset', defaultWidth: 0.03, defaultHeight: 0.03, defaultDepth: 0.03, color: '#581c87', channels: 1 },
  { id: 'mic-shotgun', category: 'microphone', name: 'Shotgun Mic', defaultWidth: 0.04, defaultHeight: 0.3, defaultDepth: 0.04, color: '#4c1d95', channels: 1 },
  { id: 'mic-stand', category: 'microphone', name: 'Mic Stand (Boom)', defaultWidth: 0.4, defaultHeight: 1.5, defaultDepth: 0.4, color: '#7c3aed', weightKg: 3 },
  { id: 'mic-stand-short', category: 'microphone', name: 'Short Mic Stand', defaultWidth: 0.25, defaultHeight: 0.5, defaultDepth: 0.25, color: '#6d28d9', weightKg: 2 },

  // ========== STAGEBOXES ==========
  { id: 'sb-32ch', category: 'stagebox', name: 'Stagebox 32ch', defaultWidth: 0.5, defaultHeight: 0.15, defaultDepth: 0.4, color: '#ea580c', channels: 32, powerWatts: 50 },
  { id: 'sb-16ch', category: 'stagebox', name: 'Stagebox 16ch', defaultWidth: 0.4, defaultHeight: 0.12, defaultDepth: 0.3, color: '#c2410c', channels: 16, powerWatts: 30 },
  { id: 'sb-digital', category: 'stagebox', name: 'Digital Stagebox (Dante/AES)', defaultWidth: 0.48, defaultHeight: 0.09, defaultDepth: 0.35, color: '#9a3412', channels: 48, powerWatts: 40 },
  { id: 'sb-rio3224', category: 'stagebox', name: 'Yamaha Rio 3224-D', defaultWidth: 0.48, defaultHeight: 0.09, defaultDepth: 0.36, color: '#b45309', channels: 32, powerWatts: 45, description: '32 in / 24 out Dante stagebox' },
  { id: 'sb-rio1608', category: 'stagebox', name: 'Yamaha Rio 1608-D', defaultWidth: 0.48, defaultHeight: 0.09, defaultDepth: 0.36, color: '#92400e', channels: 16, powerWatts: 35 },

  // ========== AUDIO CONSOLES ==========
  { id: 'con-yamaha-cl5', category: 'console', name: 'Yamaha CL5', defaultWidth: 1.35, defaultHeight: 0.28, defaultDepth: 0.85, color: '#dc2626', channels: 72, powerWatts: 250, weightKg: 42, description: '72 mono + 8 stereo inputs' },
  { id: 'con-yamaha-ql5', category: 'console', name: 'Yamaha QL5', defaultWidth: 1.2, defaultHeight: 0.26, defaultDepth: 0.8, color: '#b91c1c', channels: 64, powerWatts: 220, weightKg: 38 },
  { id: 'con-yamaha-ql1', category: 'console', name: 'Yamaha QL1', defaultWidth: 0.9, defaultHeight: 0.22, defaultDepth: 0.65, color: '#991b1b', channels: 32, powerWatts: 150, weightKg: 25 },
  { id: 'con-digico-sd12', category: 'console', name: 'DiGiCo SD12', defaultWidth: 1.25, defaultHeight: 0.25, defaultDepth: 0.8, color: '#ef4444', channels: 72, powerWatts: 280, weightKg: 40, description: 'DiGiCo SD series' },
  { id: 'con-digico-sd9', category: 'console', name: 'DiGiCo SD9', defaultWidth: 1.1, defaultHeight: 0.24, defaultDepth: 0.75, color: '#dc2626', channels: 48, powerWatts: 220, weightKg: 32 },
  { id: 'con-digico-s31', category: 'console', name: 'DiGiCo S31', defaultWidth: 1.0, defaultHeight: 0.22, defaultDepth: 0.7, color: '#b91c1c', channels: 48, powerWatts: 180, weightKg: 28 },
  { id: 'con-avid-s6l', category: 'console', name: 'Avid S6L', defaultWidth: 1.5, defaultHeight: 0.3, defaultDepth: 0.9, color: '#7f1d1d', channels: 64, powerWatts: 350, weightKg: 55 },
  { id: 'con-allenheath-dlive', category: 'console', name: 'Allen & Heath dLive', defaultWidth: 1.3, defaultHeight: 0.27, defaultDepth: 0.82, color: '#991b1b', channels: 128, powerWatts: 300, weightKg: 45 },
  { id: 'con-midas-pro', category: 'console', name: 'Midas PRO Series', defaultWidth: 1.4, defaultHeight: 0.28, defaultDepth: 0.85, color: '#450a0a', channels: 64, powerWatts: 280, weightKg: 48 },
  { id: 'con-digital-48', category: 'console', name: 'Digital Console 48ch (Generic)', defaultWidth: 1.2, defaultHeight: 0.25, defaultDepth: 0.8, color: '#dc2626', channels: 48, powerWatts: 200, weightKg: 35 },
  { id: 'con-digital-32', category: 'console', name: 'Digital Console 32ch (Generic)', defaultWidth: 1.0, defaultHeight: 0.22, defaultDepth: 0.7, color: '#b91c1c', channels: 32, powerWatts: 150, weightKg: 28 },
  { id: 'con-analog', category: 'console', name: 'Analog Console 24ch', defaultWidth: 0.9, defaultHeight: 0.2, defaultDepth: 0.65, color: '#7f1d1d', channels: 24, powerWatts: 80, weightKg: 22 },

  // ========== LIGHTING CONSOLES ==========
  { id: 'ltcon-avolites-tiger', category: 'console', name: 'Avolites Tiger Touch', defaultWidth: 0.7, defaultHeight: 0.15, defaultDepth: 0.45, color: '#f59e0b', powerWatts: 80, weightKg: 12, description: 'Lighting console – Tiger Touch / Tiger Touch II' },
  { id: 'ltcon-avolites-arena', category: 'console', name: 'Avolites Arena', defaultWidth: 0.9, defaultHeight: 0.18, defaultDepth: 0.5, color: '#d97706', powerWatts: 120, weightKg: 18 },
  { id: 'ltcon-grandma2', category: 'console', name: 'grandMA2 Light', defaultWidth: 0.85, defaultHeight: 0.16, defaultDepth: 0.48, color: '#b45309', powerWatts: 150, weightKg: 20, description: 'MA Lighting grandMA2 Light' },
  { id: 'ltcon-grandma3', category: 'console', name: 'grandMA3 Light', defaultWidth: 0.9, defaultHeight: 0.17, defaultDepth: 0.5, color: '#92400e', powerWatts: 160, weightKg: 22 },
  { id: 'ltcon-etc-ion', category: 'console', name: 'ETC Ion / Eos', defaultWidth: 0.75, defaultHeight: 0.14, defaultDepth: 0.42, color: '#78350f', powerWatts: 90, weightKg: 14 },
  { id: 'ltcon-hedgehog', category: 'console', name: 'Elation / Hedgehog', defaultWidth: 0.55, defaultHeight: 0.12, defaultDepth: 0.35, color: '#a16207', powerWatts: 60, weightKg: 8 },

  // ========== TRUSS ==========
  { id: 'truss-2m', category: 'truss', name: 'Truss Section 2m', defaultWidth: 2.0, defaultHeight: 0.3, defaultDepth: 0.3, color: '#64748b', weightKg: 18 },
  { id: 'truss-3m', category: 'truss', name: 'Truss Section 3m', defaultWidth: 3.0, defaultHeight: 0.3, defaultDepth: 0.3, color: '#475569', weightKg: 25 },
  { id: 'truss-4m', category: 'truss', name: 'Truss Section 4m', defaultWidth: 4.0, defaultHeight: 0.3, defaultDepth: 0.3, color: '#334155', weightKg: 32 },
  { id: 'truss-corner', category: 'truss', name: 'Truss Corner', defaultWidth: 0.4, defaultHeight: 0.3, defaultDepth: 0.4, color: '#1e293b', weightKg: 8 },
  { id: 'truss-t', category: 'truss', name: 'Truss T-Junction', defaultWidth: 0.5, defaultHeight: 0.3, defaultDepth: 0.5, color: '#0f172a', weightKg: 10 },
  { id: 'truss-base', category: 'truss', name: 'Truss Base / Tower', defaultWidth: 0.6, defaultHeight: 0.4, defaultDepth: 0.6, color: '#475569', weightKg: 25, description: 'Ground support base' },
  { id: 'truss-motor', category: 'truss', name: 'Chain Motor 1t', defaultWidth: 0.35, defaultHeight: 0.4, defaultDepth: 0.35, color: '#64748b', powerWatts: 1500, weightKg: 45 },

  // ========== LIGHTING FIXTURES ==========
  { id: 'light-led-par', category: 'lighting', name: 'LED PAR', defaultWidth: 0.25, defaultHeight: 0.25, defaultDepth: 0.25, color: '#eab308', powerWatts: 150, weightKg: 4 },
  { id: 'light-moving-spot', category: 'lighting', name: 'Moving Head Spot', defaultWidth: 0.35, defaultHeight: 0.55, defaultDepth: 0.35, color: '#ca8a04', powerWatts: 400, weightKg: 20 },
  { id: 'light-moving-wash', category: 'lighting', name: 'Moving Head Wash', defaultWidth: 0.35, defaultHeight: 0.5, defaultDepth: 0.35, color: '#a16207', powerWatts: 350, weightKg: 18 },
  { id: 'light-moving-beam', category: 'lighting', name: 'Moving Head Beam', defaultWidth: 0.3, defaultHeight: 0.55, defaultDepth: 0.3, color: '#854d0e', powerWatts: 300, weightKg: 16, description: 'Narrow beam / aerial effect' },
  { id: 'light-bar', category: 'lighting', name: 'LED Bar / Batten', defaultWidth: 1.0, defaultHeight: 0.1, defaultDepth: 0.12, color: '#a16207', powerWatts: 120, weightKg: 5 },
  { id: 'light-wash', category: 'lighting', name: 'Wash Light (Static)', defaultWidth: 0.3, defaultHeight: 0.35, defaultDepth: 0.3, color: '#854d0e', powerWatts: 200, weightKg: 8 },
  { id: 'light-blinder', category: 'lighting', name: 'Audience Blinder', defaultWidth: 0.5, defaultHeight: 0.25, defaultDepth: 0.2, color: '#fbbf24', powerWatts: 400, weightKg: 6 },
  { id: 'light-strobe', category: 'lighting', name: 'Strobe / Atomic', defaultWidth: 0.4, defaultHeight: 0.2, defaultDepth: 0.2, color: '#fef08a', powerWatts: 1500, weightKg: 5 },
  { id: 'light-followspot', category: 'lighting', name: 'Followspot', defaultWidth: 0.5, defaultHeight: 0.6, defaultDepth: 1.2, color: '#ca8a04', powerWatts: 1200, weightKg: 35 },
  { id: 'light-haze', category: 'lighting', name: 'Haze Machine', defaultWidth: 0.4, defaultHeight: 0.3, defaultDepth: 0.5, color: '#78716c', powerWatts: 600, weightKg: 12 },
  { id: 'light-fog', category: 'lighting', name: 'Fog Machine', defaultWidth: 0.35, defaultHeight: 0.25, defaultDepth: 0.4, color: '#57534e', powerWatts: 1000, weightKg: 8 },

  // ========== INSTRUMENTS ==========
  { id: 'inst-drums-full', category: 'instrument', name: 'Full Drum Kit', defaultWidth: 2.2, defaultHeight: 1.2, defaultDepth: 1.8, color: '#78716c', weightKg: 65, description: 'Complete acoustic drum kit + hardware' },
  { id: 'inst-drums', category: 'instrument', name: 'Drum Kit (Compact)', defaultWidth: 1.8, defaultHeight: 1.0, defaultDepth: 1.4, color: '#6b7280', weightKg: 50 },
  { id: 'inst-guitar', category: 'instrument', name: 'Guitar Amp', defaultWidth: 0.6, defaultHeight: 0.5, defaultDepth: 0.3, color: '#57534e', powerWatts: 100, weightKg: 20 },
  { id: 'inst-bass', category: 'instrument', name: 'Bass Amp / Cab', defaultWidth: 0.6, defaultHeight: 0.7, defaultDepth: 0.4, color: '#44403c', powerWatts: 500, weightKg: 35 },
  { id: 'inst-keys', category: 'instrument', name: 'Keyboard + Stand', defaultWidth: 1.3, defaultHeight: 0.9, defaultDepth: 0.45, color: '#292524', weightKg: 15 },
  { id: 'inst-dj', category: 'instrument', name: 'DJ Booth / CDJs', defaultWidth: 1.5, defaultHeight: 0.9, defaultDepth: 0.7, color: '#1c1917', powerWatts: 200, weightKg: 25 },
  { id: 'inst-piano', category: 'instrument', name: 'Digital Piano', defaultWidth: 1.4, defaultHeight: 0.9, defaultDepth: 0.5, color: '#0c0a09', weightKg: 40 },

  // ========== FOH / OTHER ==========
  { id: 'foh-position', category: 'foh', name: 'FOH Position', defaultWidth: 2.0, defaultHeight: 0.1, defaultDepth: 1.5, color: '#0ea5e9', description: 'Front of House mixing position' },
  { id: 'foh-monitor-world', category: 'foh', name: 'Monitor World', defaultWidth: 2.0, defaultHeight: 0.1, defaultDepth: 1.2, color: '#0284c7', description: 'Side-stage monitor console position' },

  // ========== POWER ==========
  { id: 'pwr-distro', category: 'power', name: 'Power Distro', defaultWidth: 0.5, defaultHeight: 0.4, defaultDepth: 0.4, color: '#ef4444', powerWatts: 0, weightKg: 15 },
  { id: 'pwr-distro-3phase', category: 'power', name: '3-Phase Distro', defaultWidth: 0.6, defaultHeight: 0.5, defaultDepth: 0.5, color: '#dc2626', weightKg: 25 },
  { id: 'pwr-cable', category: 'cable', name: 'Power Cable Run', defaultWidth: 0.1, defaultHeight: 0.05, defaultDepth: 5.0, color: '#f87171' },
  { id: 'pwr-ups', category: 'power', name: 'UPS / Battery Backup', defaultWidth: 0.4, defaultHeight: 0.35, defaultDepth: 0.5, color: '#b91c1c', powerWatts: 0, weightKg: 30 },

  // ========== CABLES / STANDS / MISC ==========
  { id: 'cab-snake', category: 'cable', name: 'Multicore Snake', defaultWidth: 0.15, defaultHeight: 0.15, defaultDepth: 3.0, color: '#f97316' },
  { id: 'stand-speaker', category: 'other', name: 'Speaker Stand', defaultWidth: 0.4, defaultHeight: 1.8, defaultDepth: 0.4, color: '#94a3b8', weightKg: 8 },
  { id: 'stand-laptop', category: 'other', name: 'Laptop Stand / Table', defaultWidth: 0.6, defaultHeight: 0.8, defaultDepth: 0.5, color: '#64748b', weightKg: 5 },
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
