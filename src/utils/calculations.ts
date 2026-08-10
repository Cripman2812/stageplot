import type { Project, StageObject } from '../types';

/**
 * PLANNING / ESTIMATION TOOLS ONLY
 * These calculations are approximate and for planning purposes.
 * They are NOT certified engineering results.
 * Always consult qualified professionals for electrical, structural,
 * and acoustic design. Safety first.
 */

export function calculateTotalPower(objects: StageObject[]): {
  totalWatts: number;
  estimatedAmps230V: number;
  estimatedAmps120V: number;
  warning: string | null;
} {
  const totalWatts = objects.reduce((sum, o) => sum + (o.powerWatts || 0), 0);
  const estimatedAmps230V = totalWatts / 230;
  const estimatedAmps120V = totalWatts / 120;
  let warning: string | null = null;
  if (totalWatts > 10000) {
    warning = 'High power draw estimated. Verify distribution and circuit capacity with a qualified electrician.';
  } else if (totalWatts > 5000) {
    warning = 'Moderate-high power. Plan dedicated circuits.';
  }
  return { totalWatts, estimatedAmps230V, estimatedAmps120V, warning };
}

export function calculateTotalWeight(objects: StageObject[]): {
  totalKg: number;
  warning: string | null;
} {
  const totalKg = objects.reduce((sum, o) => sum + (o.weightKg || 0), 0);
  let warning: string | null = null;
  if (totalKg > 500) {
    warning = 'Significant suspended/stage load estimated. Rigging and floor loading must be verified by a qualified rigger/structural engineer.';
  }
  return { totalKg, warning };
}

/**
 * Very rough SPL estimation at 1m (not a real prediction).
 * Based on simple summation of nominal power with crude sensitivity assumption.
 * NOT for system design or safety-critical use.
 */
export function estimateRoughSPL(objects: StageObject[]): {
  value: number | null;
  note: string;
} {
  const speakers = objects.filter(o => o.type === 'speaker' || o.type === 'subwoofer' || o.type === 'monitor');
  if (speakers.length === 0) {
    return { value: null, note: 'No loudspeakers placed.' };
  }
  // Crude: assume ~95 dB @ 1W/1m average and +3dB per doubling of power (very approximate)
  const totalPower = speakers.reduce((s, o) => s + (o.powerWatts || 100), 0);
  const estimated = 95 + 10 * Math.log10(Math.max(totalPower, 1));
  return {
    value: Math.round(estimated * 10) / 10,
    note: 'ROUGH ESTIMATE ONLY at 1 m. Real coverage depends on array design, room acoustics, and measurement. Not a certified prediction.',
  };
}

export function validateProject(project: Project): string[] {
  const issues: string[] = [];
  if (!project.meta.name.trim()) issues.push('Project name is required.');
  if (project.stage.widthM <= 0 || project.stage.depthM <= 0) issues.push('Stage dimensions must be positive.');
  if (project.objects.length === 0) issues.push('No equipment placed on stage.');
  const power = calculateTotalPower(project.objects);
  if (power.warning) issues.push(power.warning);
  const weight = calculateTotalWeight(project.objects);
  if (weight.warning) issues.push(weight.warning);
  const inputNums = new Set<number>();
  for (const i of project.inputs) { if (inputNums.has(i.number)) issues.push(`Duplicate input channel ${i.number}.`); inputNums.add(i.number); }
  const outputNums = new Set<number>();
  for (const o of project.outputs) { if (outputNums.has(o.number)) issues.push(`Duplicate output channel ${o.number}.`); outputNums.add(o.number); }
  const dmx = validateDMX(project); issues.push(...dmx);
  // Check for overlapping critical objects (simple)
  const foh = project.objects.filter(o => o.type === 'foh');
  if (foh.length > 1) issues.push('Multiple FOH positions defined.');
  return issues;
}

export function generateInputListCSV(project: Project): string {
  const header = 'Ch,Name,Source,Mic Type,Phantom,Notes\n';
  const rows = project.inputs
    .sort((a, b) => a.number - b.number)
    .map(i => `${i.number},"${i.name}","${i.source}","${i.micType || ''}",${i.phantom ? 'Yes' : 'No'},"${i.notes || ''}"`)
    .join('\n');
  return header + rows;
}

export function generateOutputListCSV(project: Project): string {
  const header = 'Ch,Name,Destination,Type,Notes\n';
  const rows = project.outputs
    .sort((a, b) => a.number - b.number)
    .map(o => `${o.number},"${o.name}","${o.destination}","${o.type}","${o.notes || ''}"`)
    .join('\n');
  return header + rows;
}

export function generateMonitorListCSV(project: Project): string {
  const header = 'Name,Type,Channels,Notes\n';
  const rows = project.monitors
    .map(m => `"${m.name}","${m.type}","${m.channels.join(';')}","${m.notes || ''}"`)
    .join('\n');
  return header + rows;
}

export function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface DistanceSPLInput { referenceDb: number; referenceDistanceM: number; targetDistanceM: number; sourceCount?: number; }
export function estimateDistanceSPL(input: DistanceSPLInput): number {
  const n = Math.max(1, input.sourceCount || 1);
  const distanceLoss = 20 * Math.log10(Math.max(input.targetDistanceM, 0.1) / Math.max(input.referenceDistanceM, 0.1));
  const sourceGain = 10 * Math.log10(n);
  return input.referenceDb - distanceLoss + sourceGain;
}

export function estimateCableTotal(project: Project): { count:number; totalM:number } {
  return { count: project.patches.length, totalM: project.patches.reduce((s,p)=>s+(p.lengthM||0),0) };
}

export function validateDMX(project: Project): string[] {
  const issues:string[]=[]; const used=new Map<string,string>();
  for(const f of project.lighting||[]) for(let i=0;i<f.channels;i++) {
    const address=f.address+i; if(address>512) issues.push(`${f.model||f.type}: DMX address exceeds 512.`);
    const key=`${f.universe}:${address}`; const previous=used.get(key); if(previous) issues.push(`DMX conflict U${f.universe} A${address}: ${previous} / ${f.model||f.type}`); else used.set(key,f.model||f.type);
  }
  return [...new Set(issues)];
}
