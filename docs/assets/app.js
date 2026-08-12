// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// src/App.tsx
import { useState as useState6, useEffect as useEffect4 } from "react";

// src/store/ProjectContext.tsx
import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";

// src/data/equipmentLibrary.ts
var EQUIPMENT_LIBRARY = [
  // Speakers
  { id: "sp-line-array", category: "speaker", name: "Line Array Element", defaultWidth: 1, defaultHeight: 0.4, defaultDepth: 0.5, color: "#3b82f6", powerWatts: 800, weightKg: 35, description: "Active line array box" },
  { id: "sp-point-source", category: "speaker", name: 'Point Source 15"', defaultWidth: 0.5, defaultHeight: 0.7, defaultDepth: 0.45, color: "#2563eb", powerWatts: 600, weightKg: 28 },
  { id: "sp-full-range", category: "speaker", name: 'Full Range 12"', defaultWidth: 0.4, defaultHeight: 0.55, defaultDepth: 0.35, color: "#1d4ed8", powerWatts: 400, weightKg: 18 },
  // Subwoofers
  { id: "sub-18", category: "subwoofer", name: 'Subwoofer 18"', defaultWidth: 0.7, defaultHeight: 0.6, defaultDepth: 0.7, color: "#1e3a8a", powerWatts: 1200, weightKg: 55 },
  { id: "sub-dual-18", category: "subwoofer", name: 'Dual 18" Sub', defaultWidth: 1.2, defaultHeight: 0.6, defaultDepth: 0.7, color: "#172554", powerWatts: 2400, weightKg: 95 },
  // Monitors
  { id: "mon-wedge-12", category: "monitor", name: 'Wedge Monitor 12"', defaultWidth: 0.5, defaultHeight: 0.35, defaultDepth: 0.45, color: "#059669", powerWatts: 350, weightKg: 16 },
  { id: "mon-wedge-15", category: "monitor", name: 'Wedge Monitor 15"', defaultWidth: 0.55, defaultHeight: 0.4, defaultDepth: 0.5, color: "#047857", powerWatts: 500, weightKg: 22 },
  { id: "mon-sidefill", category: "monitor", name: "Sidefill", defaultWidth: 0.5, defaultHeight: 0.7, defaultDepth: 0.45, color: "#065f46", powerWatts: 600, weightKg: 30 },
  // Microphones
  { id: "mic-vocal", category: "microphone", name: "Vocal Mic", defaultWidth: 0.05, defaultHeight: 0.18, defaultDepth: 0.05, color: "#a855f7", channels: 1 },
  { id: "mic-instrument", category: "microphone", name: "Instrument Mic", defaultWidth: 0.04, defaultHeight: 0.15, defaultDepth: 0.04, color: "#9333ea", channels: 1 },
  { id: "mic-drum", category: "microphone", name: "Drum Mic Kit", defaultWidth: 0.3, defaultHeight: 0.2, defaultDepth: 0.3, color: "#7e22ce", channels: 8 },
  { id: "mic-wireless", category: "microphone", name: "Wireless Handheld", defaultWidth: 0.05, defaultHeight: 0.25, defaultDepth: 0.05, color: "#6b21a8", channels: 1 },
  // Stageboxes
  { id: "sb-32ch", category: "stagebox", name: "Stagebox 32ch", defaultWidth: 0.5, defaultHeight: 0.15, defaultDepth: 0.4, color: "#ea580c", channels: 32, powerWatts: 50 },
  { id: "sb-16ch", category: "stagebox", name: "Stagebox 16ch", defaultWidth: 0.4, defaultHeight: 0.12, defaultDepth: 0.3, color: "#c2410c", channels: 16, powerWatts: 30 },
  { id: "sb-digital", category: "stagebox", name: "Digital Stagebox", defaultWidth: 0.48, defaultHeight: 0.09, defaultDepth: 0.35, color: "#9a3412", channels: 48, powerWatts: 40 },
  // Consoles
  { id: "con-digital-48", category: "console", name: "Digital Console 48ch", defaultWidth: 1.2, defaultHeight: 0.25, defaultDepth: 0.8, color: "#dc2626", channels: 48, powerWatts: 200, weightKg: 35 },
  { id: "con-digital-32", category: "console", name: "Digital Console 32ch", defaultWidth: 1, defaultHeight: 0.22, defaultDepth: 0.7, color: "#b91c1c", channels: 32, powerWatts: 150, weightKg: 28 },
  { id: "con-analog", category: "console", name: "Analog Console 24ch", defaultWidth: 0.9, defaultHeight: 0.2, defaultDepth: 0.65, color: "#991b1b", channels: 24, powerWatts: 80, weightKg: 22 },
  // Truss
  { id: "truss-2m", category: "truss", name: "Truss Section 2m", defaultWidth: 2, defaultHeight: 0.3, defaultDepth: 0.3, color: "#64748b", weightKg: 18 },
  { id: "truss-3m", category: "truss", name: "Truss Section 3m", defaultWidth: 3, defaultHeight: 0.3, defaultDepth: 0.3, color: "#475569", weightKg: 25 },
  { id: "truss-corner", category: "truss", name: "Truss Corner", defaultWidth: 0.4, defaultHeight: 0.3, defaultDepth: 0.4, color: "#334155", weightKg: 8 },
  // Lighting
  { id: "light-led-par", category: "lighting", name: "LED PAR", defaultWidth: 0.25, defaultHeight: 0.25, defaultDepth: 0.25, color: "#eab308", powerWatts: 150, weightKg: 4 },
  { id: "light-moving-head", category: "lighting", name: "Moving Head Spot", defaultWidth: 0.35, defaultHeight: 0.5, defaultDepth: 0.35, color: "#ca8a04", powerWatts: 300, weightKg: 18 },
  { id: "light-bar", category: "lighting", name: "LED Bar", defaultWidth: 1, defaultHeight: 0.1, defaultDepth: 0.1, color: "#a16207", powerWatts: 120, weightKg: 5 },
  { id: "light-wash", category: "lighting", name: "Wash Light", defaultWidth: 0.3, defaultHeight: 0.35, defaultDepth: 0.3, color: "#854d0e", powerWatts: 200, weightKg: 8 },
  // Instruments
  { id: "inst-drums", category: "instrument", name: "Drum Kit", defaultWidth: 2, defaultHeight: 1, defaultDepth: 1.5, color: "#78716c", weightKg: 50 },
  { id: "inst-guitar", category: "instrument", name: "Guitar Amp", defaultWidth: 0.6, defaultHeight: 0.5, defaultDepth: 0.3, color: "#57534e", powerWatts: 100, weightKg: 20 },
  { id: "inst-bass", category: "instrument", name: "Bass Amp", defaultWidth: 0.6, defaultHeight: 0.7, defaultDepth: 0.4, color: "#44403c", powerWatts: 500, weightKg: 35 },
  { id: "inst-keys", category: "instrument", name: "Keyboard Stand", defaultWidth: 1.2, defaultHeight: 0.9, defaultDepth: 0.4, color: "#292524" },
  // FOH
  { id: "foh-position", category: "foh", name: "FOH Position", defaultWidth: 2, defaultHeight: 0.1, defaultDepth: 1.5, color: "#0ea5e9", description: "Front of House mixing position" },
  // Power
  { id: "pwr-distro", category: "power", name: "Power Distro", defaultWidth: 0.5, defaultHeight: 0.4, defaultDepth: 0.4, color: "#ef4444", powerWatts: 0, weightKg: 15 },
  { id: "pwr-cable", category: "cable", name: "Power Cable Run", defaultWidth: 0.1, defaultHeight: 0.05, defaultDepth: 5, color: "#f87171" }
];
var TEMPLATES = [
  {
    id: "tpl-small-club",
    name: "Small Club / Cafe",
    description: "Compact stage for clubs and cafes",
    stage: { widthM: 6, depthM: 4, heightM: 3 }
  },
  {
    id: "tpl-theater",
    name: "Theater / Hall",
    description: "Medium theater stage",
    stage: { widthM: 12, depthM: 8, heightM: 6 }
  },
  {
    id: "tpl-festival",
    name: "Festival Main Stage",
    description: "Large outdoor festival stage",
    stage: { widthM: 20, depthM: 12, heightM: 10 }
  },
  {
    id: "tpl-corporate",
    name: "Corporate Event",
    description: "Conference / corporate stage",
    stage: { widthM: 10, depthM: 6, heightM: 4 }
  }
];
function createEmptyProject(name = "New Project") {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    meta: {
      id: crypto.randomUUID(),
      name,
      client: "",
      venue: "",
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      engineer: "",
      version: "1.0",
      createdAt: now,
      updatedAt: now
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
    notes: ""
  };
}

// src/utils/storage.ts
var STORAGE_KEY = "stageforge_project";
var AUTOSAVE_KEY = "stageforge_autosave";
var DB_NAME = "stageforge-db";
var STORE = "projects";
function idbPut(project) {
  if (!("indexedDB" in window)) return;
  try {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "meta.id" });
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(project);
      tx.oncomplete = () => db.close();
    };
  } catch {
  }
}
function saveProject(project) {
  try {
    const data = JSON.stringify(project);
    localStorage.setItem(STORAGE_KEY, data);
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ project, timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
    idbPut(project);
  } catch (e) {
    console.error("Failed to save project", e);
  }
}
function loadProject() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function loadAutosave() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function importProjectJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const project = JSON.parse(reader.result);
        if (!project.meta || !project.stage || !Array.isArray(project.objects)) {
          reject(new Error("Invalid project file structure"));
          return;
        }
        project.meta.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        resolve(project);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
function getOrCreateProject() {
  const existing = loadProject();
  if (existing) return existing;
  const p = createEmptyProject("Untitled Stage");
  saveProject(p);
  return p;
}

// src/utils/calculations.ts
function calculateTotalPower(objects) {
  const totalWatts = objects.reduce((sum, o) => sum + (o.powerWatts || 0), 0);
  const estimatedAmps230V = totalWatts / 230;
  const estimatedAmps120V = totalWatts / 120;
  let warning = null;
  if (totalWatts > 1e4) {
    warning = "High power draw estimated. Verify distribution and circuit capacity with a qualified electrician.";
  } else if (totalWatts > 5e3) {
    warning = "Moderate-high power. Plan dedicated circuits.";
  }
  return { totalWatts, estimatedAmps230V, estimatedAmps120V, warning };
}
function calculateTotalWeight(objects) {
  const totalKg = objects.reduce((sum, o) => sum + (o.weightKg || 0), 0);
  let warning = null;
  if (totalKg > 500) {
    warning = "Significant suspended/stage load estimated. Rigging and floor loading must be verified by a qualified rigger/structural engineer.";
  }
  return { totalKg, warning };
}
function estimateRoughSPL(objects) {
  const speakers = objects.filter((o) => o.type === "speaker" || o.type === "subwoofer" || o.type === "monitor");
  if (speakers.length === 0) {
    return { value: null, note: "No loudspeakers placed." };
  }
  const totalPower = speakers.reduce((s, o) => s + (o.powerWatts || 100), 0);
  const estimated = 95 + 10 * Math.log10(Math.max(totalPower, 1));
  return {
    value: Math.round(estimated * 10) / 10,
    note: "ROUGH ESTIMATE ONLY at 1 m. Real coverage depends on array design, room acoustics, and measurement. Not a certified prediction."
  };
}
function validateProject(project) {
  const issues = [];
  if (!project.meta.name.trim()) issues.push("Project name is required.");
  if (project.stage.widthM <= 0 || project.stage.depthM <= 0) issues.push("Stage dimensions must be positive.");
  if (project.objects.length === 0) issues.push("No equipment placed on stage.");
  const power = calculateTotalPower(project.objects);
  if (power.warning) issues.push(power.warning);
  const weight = calculateTotalWeight(project.objects);
  if (weight.warning) issues.push(weight.warning);
  const inputNums = /* @__PURE__ */ new Set();
  for (const i of project.inputs) {
    if (inputNums.has(i.number)) issues.push(`Duplicate input channel ${i.number}.`);
    inputNums.add(i.number);
  }
  const outputNums = /* @__PURE__ */ new Set();
  for (const o of project.outputs) {
    if (outputNums.has(o.number)) issues.push(`Duplicate output channel ${o.number}.`);
    outputNums.add(o.number);
  }
  const dmx = validateDMX(project);
  issues.push(...dmx);
  const foh = project.objects.filter((o) => o.type === "foh");
  if (foh.length > 1) issues.push("Multiple FOH positions defined.");
  return issues;
}
function validateDMX(project) {
  const issues = [];
  const used = /* @__PURE__ */ new Map();
  for (const f of project.lighting || []) for (let i = 0; i < f.channels; i++) {
    const address = f.address + i;
    if (address > 512) issues.push(`${f.model || f.type}: DMX address exceeds 512.`);
    const key = `${f.universe}:${address}`;
    const previous = used.get(key);
    if (previous) issues.push(`DMX conflict U${f.universe} A${address}: ${previous} / ${f.model || f.type}`);
    else used.set(key, f.model || f.type);
  }
  return [...new Set(issues)];
}

// src/store/ProjectContext.tsx
import { jsx } from "react/jsx-runtime";
var rawInitialProject = getOrCreateProject();
var initialProject = { ...rawInitialProject, lighting: rawInitialProject.lighting || [], circuits: rawInitialProject.circuits || [] };
var initialState = {
  project: initialProject,
  viewMode: "2d",
  selectedObjectId: null,
  isDirty: false,
  lastSaved: null,
  validationIssues: validateProject(initialProject)
};
function reducer(state, action) {
  let next = { ...state };
  switch (action.type) {
    case "SET_PROJECT":
      next.project = { ...action.payload, lighting: action.payload.lighting || [], circuits: action.payload.circuits || [] };
      next.isDirty = true;
      break;
    case "UPDATE_META":
      next.project = {
        ...state.project,
        meta: { ...state.project.meta, ...action.payload, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }
      };
      next.isDirty = true;
      break;
    case "SET_STAGE":
      next.project = { ...state.project, stage: action.payload };
      next.isDirty = true;
      break;
    case "ADD_OBJECT":
      next.project = { ...state.project, objects: [...state.project.objects, action.payload] };
      next.isDirty = true;
      break;
    case "UPDATE_OBJECT": {
      const objects = state.project.objects.map(
        (o) => o.id === action.payload.id ? { ...o, ...action.payload.changes } : o
      );
      next.project = { ...state.project, objects };
      next.isDirty = true;
      break;
    }
    case "DELETE_OBJECT":
      next.project = {
        ...state.project,
        objects: state.project.objects.filter((o) => o.id !== action.payload)
      };
      if (state.selectedObjectId === action.payload) next.selectedObjectId = null;
      next.isDirty = true;
      break;
    case "DUPLICATE_OBJECT": {
      const src = state.project.objects.find((o) => o.id === action.payload);
      if (!src) return state;
      const dup = {
        ...src,
        id: crypto.randomUUID(),
        x: src.x + 0.5,
        y: src.y + 0.5,
        name: src.name + " (copy)"
      };
      next.project = { ...state.project, objects: [...state.project.objects, dup] };
      next.selectedObjectId = dup.id;
      next.isDirty = true;
      break;
    }
    case "SET_OBJECTS":
      next.project = { ...state.project, objects: action.payload };
      next.isDirty = true;
      break;
    case "ADD_INPUT":
      next.project = { ...state.project, inputs: [...state.project.inputs, action.payload] };
      next.isDirty = true;
      break;
    case "UPDATE_INPUT": {
      const inputs = state.project.inputs.map(
        (i) => i.id === action.payload.id ? { ...i, ...action.payload.changes } : i
      );
      next.project = { ...state.project, inputs };
      next.isDirty = true;
      break;
    }
    case "DELETE_INPUT":
      next.project = {
        ...state.project,
        inputs: state.project.inputs.filter((i) => i.id !== action.payload)
      };
      next.isDirty = true;
      break;
    case "SET_INPUTS":
      next.project = { ...state.project, inputs: action.payload };
      next.isDirty = true;
      break;
    case "ADD_OUTPUT":
      next.project = { ...state.project, outputs: [...state.project.outputs, action.payload] };
      next.isDirty = true;
      break;
    case "UPDATE_OUTPUT": {
      const outputs = state.project.outputs.map(
        (o) => o.id === action.payload.id ? { ...o, ...action.payload.changes } : o
      );
      next.project = { ...state.project, outputs };
      next.isDirty = true;
      break;
    }
    case "DELETE_OUTPUT":
      next.project = {
        ...state.project,
        outputs: state.project.outputs.filter((o) => o.id !== action.payload)
      };
      next.isDirty = true;
      break;
    case "ADD_MONITOR":
      next.project = { ...state.project, monitors: [...state.project.monitors, action.payload] };
      next.isDirty = true;
      break;
    case "DELETE_MONITOR":
      next.project = {
        ...state.project,
        monitors: state.project.monitors.filter((m) => m.id !== action.payload)
      };
      next.isDirty = true;
      break;
    case "ADD_PATCH":
      next.project = { ...state.project, patches: [...state.project.patches, action.payload] };
      next.isDirty = true;
      break;
    case "DELETE_PATCH":
      next.project = { ...state.project, patches: state.project.patches.filter((p) => p.id !== action.payload) };
      next.isDirty = true;
      break;
    case "ADD_LIGHTING":
      next.project = { ...state.project, lighting: [...state.project.lighting || [], action.payload] };
      next.isDirty = true;
      break;
    case "UPDATE_LIGHTING":
      next.project = { ...state.project, lighting: (state.project.lighting || []).map((l) => l.id === action.payload.id ? { ...l, ...action.payload.changes } : l) };
      next.isDirty = true;
      break;
    case "DELETE_LIGHTING":
      next.project = { ...state.project, lighting: (state.project.lighting || []).filter((l) => l.id !== action.payload) };
      next.isDirty = true;
      break;
    case "ADD_CIRCUIT":
      next.project = { ...state.project, circuits: [...state.project.circuits || [], action.payload] };
      next.isDirty = true;
      break;
    case "UPDATE_CIRCUIT":
      next.project = { ...state.project, circuits: (state.project.circuits || []).map((c) => c.id === action.payload.id ? { ...c, ...action.payload.changes } : c) };
      next.isDirty = true;
      break;
    case "DELETE_CIRCUIT":
      next.project = { ...state.project, circuits: (state.project.circuits || []).filter((c) => c.id !== action.payload) };
      next.isDirty = true;
      break;
    case "SET_VIEW":
      next.viewMode = action.payload;
      break;
    case "SELECT_OBJECT":
      next.selectedObjectId = action.payload;
      break;
    case "SET_GRID":
      next.project = {
        ...state.project,
        gridSize: action.payload.gridSize ?? state.project.gridSize,
        snapEnabled: action.payload.snapEnabled ?? state.project.snapEnabled
      };
      next.isDirty = true;
      break;
    case "SET_NOTES":
      next.project = { ...state.project, notes: action.payload };
      next.isDirty = true;
      break;
    case "NEW_PROJECT":
      next.project = createEmptyProject(action.payload || "New Project");
      next.selectedObjectId = null;
      next.isDirty = true;
      break;
    case "MARK_CLEAN":
      next.isDirty = false;
      next.lastSaved = (/* @__PURE__ */ new Date()).toISOString();
      break;
    default:
      return state;
  }
  next.validationIssues = validateProject(next.project);
  return next;
}
var ProjectContext = createContext(null);
function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const autosaveRef = useRef(null);
  const save = useCallback(() => {
    saveProject(state.project);
    dispatch({ type: "MARK_CLEAN" });
  }, [state.project]);
  useEffect(() => {
    if (autosaveRef.current) window.clearInterval(autosaveRef.current);
    autosaveRef.current = window.setInterval(() => {
      if (state.isDirty) {
        saveProject(state.project);
        dispatch({ type: "MARK_CLEAN" });
      }
    }, 3e4);
    return () => {
      if (autosaveRef.current) window.clearInterval(autosaveRef.current);
    };
  }, [state.isDirty, state.project]);
  useEffect(() => {
    const auto = loadAutosave();
    if (auto && auto.project.meta.id !== state.project.meta.id) {
    }
  }, []);
  const addEquipment = useCallback((templateId, x = 1, y = 1) => {
    const tpl = EQUIPMENT_LIBRARY.find((t) => t.id === templateId);
    if (!tpl) return;
    const obj = {
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
      channels: tpl.channels
    };
    dispatch({ type: "ADD_OBJECT", payload: obj });
    dispatch({ type: "SELECT_OBJECT", payload: obj.id });
  }, []);
  const selectedObject = state.project.objects.find((o) => o.id === state.selectedObjectId) || null;
  return /* @__PURE__ */ jsx(ProjectContext.Provider, { value: { ...state, dispatch, save, addEquipment, selectedObject }, children });
}
function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}

// src/components/Stage2D.tsx
import { useRef as useRef2, useEffect as useEffect2, useCallback as useCallback2, useState } from "react";

// src/utils/export.ts
function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
function exportCanvasAsJpeg(canvas, filename, quality = 0.92) {
  const url = canvas.toDataURL("image/jpeg", quality);
  downloadDataUrl(url, filename.endsWith(".jpg") || filename.endsWith(".jpeg") ? filename : `${filename}.jpg`);
}
function exportAsPdf() {
  window.print();
}
async function exportElementAsJpeg(el, filename, quality = 0.92) {
  const rect = el.getBoundingClientRect();
  const width = Math.max(el.scrollWidth, Math.ceil(rect.width), 320);
  const height = Math.max(el.scrollHeight, Math.ceil(rect.height), 200);
  const clone = el.cloneNode(true);
  clone.style.background = "#0b0f14";
  clone.style.color = "#e8eef7";
  clone.style.width = `${width}px`;
  clone.style.padding = "16px";
  clone.style.boxSizing = "border-box";
  const serializer = new XMLSerializer();
  const wrapped = document.createElement("div");
  wrapped.appendChild(clone);
  const style = document.createElement("style");
  style.textContent = `
    * { font-family: system-ui, sans-serif; box-sizing: border-box; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border-bottom: 1px solid #333; padding: 4px 6px; text-align: left; }
    h3 { margin: 0 0 8px; font-size: 14px; }
    .card { margin-bottom: 12px; padding: 10px; border: 1px solid #333; border-radius: 8px; }
  `;
  wrapped.insertBefore(style, wrapped.firstChild);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">${wrapped.innerHTML}</div>
    </foreignObject>
  </svg>`;
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  try {
    const img = await loadImage(svgUrl);
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0b0f14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(2, 2);
    ctx.drawImage(img, 0, 0, width, height);
    exportCanvasAsJpeg(canvas, filename, quality);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// src/components/Stage2D.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var SCALE = 40;
function Stage2D() {
  const canvasRef = useRef2(null);
  const { project, selectedObjectId, dispatch, selectedObject } = useProject();
  const [drag, setDrag] = useState(null);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [zoom, setZoom] = useState(1);
  const pointers = useRef2(/* @__PURE__ */ new Map());
  const lastPinch = useRef2(null);
  const toScreen = useCallback2((mx, my) => {
    return {
      x: pan.x + mx * SCALE * zoom,
      y: pan.y + my * SCALE * zoom
    };
  }, [pan, zoom]);
  const toWorld = useCallback2((sx, sy) => {
    return {
      x: (sx - pan.x) / (SCALE * zoom),
      y: (sy - pan.y) / (SCALE * zoom)
    };
  }, [pan, zoom]);
  const draw = useCallback2(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#06090d";
    ctx.fillRect(0, 0, w, h);
    if (project.gridSize > 0) {
      ctx.strokeStyle = "#1a222d";
      ctx.lineWidth = 1;
      const step = project.gridSize * SCALE * zoom;
      const startX = pan.x % step;
      const startY = pan.y % step;
      for (let x = startX; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = startY; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }
    const stageW = project.stage.widthM * SCALE * zoom;
    const stageD = project.stage.depthM * SCALE * zoom;
    const origin = toScreen(0, 0);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(origin.x, origin.y, stageW, stageD);
    ctx.fillStyle = "rgba(59,130,246,0.05)";
    ctx.fillRect(origin.x, origin.y, stageW, stageD);
    ctx.fillStyle = "#8b9bb0";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText(`${project.stage.widthM}m`, origin.x + stageW / 2 - 10, origin.y - 6);
    ctx.fillText(`${project.stage.depthM}m`, origin.x - 28, origin.y + stageD / 2);
    for (const obj of project.objects) {
      const pos = toScreen(obj.x, obj.y);
      const ow = obj.width * SCALE * zoom;
      const od = obj.depth * SCALE * zoom;
      ctx.save();
      ctx.translate(pos.x + ow / 2, pos.y + od / 2);
      ctx.rotate(obj.rotation * Math.PI / 180);
      ctx.fillStyle = obj.color || "#3b82f6";
      ctx.globalAlpha = selectedObjectId === obj.id ? 1 : 0.85;
      ctx.fillRect(-ow / 2, -od / 2, ow, od);
      if (selectedObjectId === obj.id) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(-ow / 2 - 2, -od / 2 - 2, ow + 4, od + 4);
      }
      ctx.globalAlpha = 1;
      if (zoom > 0.6) {
        ctx.fillStyle = "#fff";
        ctx.font = `${Math.max(9, 10 * zoom)}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(obj.name.slice(0, 12), 0, 4);
      }
      ctx.restore();
    }
  }, [project, selectedObjectId, pan, zoom, toScreen]);
  useEffect2(() => {
    draw();
  }, [draw]);
  useEffect2(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);
  const snap = (v) => {
    if (!project.snapEnabled) return v;
    const g = project.gridSize;
    return Math.round(v / g) * g;
  };
  const hitTest = (wx, wy) => {
    for (let i = project.objects.length - 1; i >= 0; i--) {
      const o = project.objects[i];
      if (wx >= o.x && wx <= o.x + o.width && wy >= o.y && wy <= o.y + o.depth) {
        return o;
      }
    }
    return null;
  };
  const onPointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const world = toWorld(sx, sy);
      const hit = hitTest(world.x, world.y);
      if (hit) {
        dispatch({ type: "SELECT_OBJECT", payload: hit.id });
        setDrag({ id: hit.id, offsetX: world.x - hit.x, offsetY: world.y - hit.y });
      } else {
        dispatch({ type: "SELECT_OBJECT", payload: null });
        setDrag(null);
      }
    }
  };
  const onPointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prev = pointers.current.get(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (lastPinch.current !== null) {
        const delta = dist / lastPinch.current;
        setZoom((z) => Math.min(4, Math.max(0.3, z * delta)));
      }
      lastPinch.current = dist;
      if (prev) {
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        setPan((p) => ({ x: p.x + dx / 2, y: p.y + dy / 2 }));
      }
      return;
    }
    if (drag && pointers.current.size === 1) {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const world = toWorld(sx, sy);
      const nx = snap(world.x - drag.offsetX);
      const ny = snap(world.y - drag.offsetY);
      dispatch({
        type: "UPDATE_OBJECT",
        payload: { id: drag.id, changes: { x: Math.max(0, nx), y: Math.max(0, ny) } }
      });
    } else if (!drag && pointers.current.size === 1 && prev) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    }
  };
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) lastPinch.current = null;
    if (pointers.current.size === 0) setDrag(null);
  };
  const rotateSelected = (deg) => {
    if (!selectedObject) return;
    dispatch({
      type: "UPDATE_OBJECT",
      payload: { id: selectedObject.id, changes: { rotation: (selectedObject.rotation + deg) % 360 } }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "stage-viewport", children: [
    /* @__PURE__ */ jsxs("div", { className: "toolbar", children: [
      /* @__PURE__ */ jsx2("button", { onClick: () => setZoom((z) => Math.min(4, z * 1.2)), children: "\uFF0B" }),
      /* @__PURE__ */ jsx2("button", { onClick: () => setZoom((z) => Math.max(0.3, z / 1.2)), children: "\uFF0D" }),
      /* @__PURE__ */ jsx2("button", { onClick: () => {
        setPan({ x: 40, y: 40 });
        setZoom(1);
      }, children: "Reset" }),
      /* @__PURE__ */ jsx2(
        "button",
        {
          className: project.snapEnabled ? "active" : "",
          onClick: () => dispatch({ type: "SET_GRID", payload: { snapEnabled: !project.snapEnabled } }),
          children: "Snap"
        }
      ),
      /* @__PURE__ */ jsx2("button", { onClick: () => rotateSelected(15), disabled: !selectedObject, children: "\u21BB 15\xB0" }),
      /* @__PURE__ */ jsx2("button", { onClick: () => rotateSelected(-15), disabled: !selectedObject, children: "\u21BA 15\xB0" }),
      /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: () => selectedObjectId && dispatch({ type: "DUPLICATE_OBJECT", payload: selectedObjectId }),
          disabled: !selectedObjectId,
          children: "Dup"
        }
      ),
      /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: () => selectedObjectId && dispatch({ type: "DELETE_OBJECT", payload: selectedObjectId }),
          disabled: !selectedObjectId,
          style: { color: "var(--danger)" },
          children: "Del"
        }
      ),
      /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: () => {
            const c = canvasRef.current;
            if (c) exportCanvasAsJpeg(c, "stage_plot.jpg");
          },
          title: "Export stage as JPEG",
          children: "JPEG"
        }
      )
    ] }),
    /* @__PURE__ */ jsx2(
      "canvas",
      {
        ref: canvasRef,
        className: "stage-canvas",
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        style: { touchAction: "none" }
      }
    )
  ] });
}

// src/components/Stage3D.tsx
import { useRef as useRef3, useEffect as useEffect3, useState as useState2 } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Stage3D() {
  const containerRef = useRef3(null);
  const { project, selectedObjectId, dispatch } = useProject();
  const [ready, setReady] = useState2(false);
  const sceneRef = useRef3(null);
  const cameraRef = useRef3(null);
  const rendererRef = useRef3(null);
  const meshesRef = useRef3(/* @__PURE__ */ new Map());
  const controlsState = useRef3({
    isDragging: false,
    selectedDragId: null,
    lastX: 0,
    lastY: 0,
    spherical: { theta: Math.PI / 4, phi: Math.PI / 3, radius: 15 },
    target: { x: 0, y: 0, z: 0 }
  });
  useEffect3(() => {
    if (window.THREE) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
    return () => {
    };
  }, []);
  useEffect3(() => {
    if (!ready || !containerRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(395533);
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    const amb = new THREE.AmbientLight(4210784, 0.8);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(16777215, 0.9);
    dir.position.set(5, 10, 7);
    scene.add(dir);
    const stageGeo = new THREE.PlaneGeometry(project.stage.widthM, project.stage.depthM);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 1712685,
      roughness: 0.9,
      metalness: 0.1
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.rotation.x = -Math.PI / 2;
    stageMesh.position.set(project.stage.widthM / 2, 0, project.stage.depthM / 2);
    scene.add(stageMesh);
    const grid = new THREE.GridHelper(
      Math.max(project.stage.widthM, project.stage.depthM) * 1.5,
      Math.ceil(Math.max(project.stage.widthM, project.stage.depthM) * 2),
      2766148,
      1712685
    );
    grid.position.set(project.stage.widthM / 2, 0.01, project.stage.depthM / 2);
    scene.add(grid);
    updateCamera();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    const onResize = () => {
      if (!containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [ready]);
  useEffect3(() => {
    if (!ready || !sceneRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const scene = sceneRef.current;
    const existing = meshesRef.current;
    for (const [id, mesh] of existing) {
      if (!project.objects.find((o) => o.id === id)) {
        scene.remove(mesh);
        mesh.geometry?.dispose();
        mesh.material?.dispose();
        existing.delete(id);
      }
    }
    for (const obj of project.objects) {
      let mesh = existing.get(obj.id);
      if (!mesh) {
        const geo = new THREE.BoxGeometry(obj.width, obj.height || 0.3, obj.depth);
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(obj.color || "#3b82f6"),
          roughness: 0.6
        });
        mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
        existing.set(obj.id, mesh);
      }
      mesh.position.set(
        obj.x + obj.width / 2,
        (obj.height || 0.3) / 2 + (obj.z || 0),
        obj.y + obj.depth / 2
      );
      mesh.rotation.y = obj.rotation * Math.PI / 180;
      if (mesh.material) {
        mesh.material.emissive = new THREE.Color(selectedObjectId === obj.id ? 2245734 : 0);
      }
    }
  }, [project.objects, selectedObjectId, ready]);
  function updateCamera() {
    const cam = cameraRef.current;
    if (!cam) return;
    const s = controlsState.current.spherical;
    const t = controlsState.current.target;
    cam.position.x = t.x + s.radius * Math.sin(s.phi) * Math.cos(s.theta);
    cam.position.y = t.y + s.radius * Math.cos(s.phi);
    cam.position.z = t.z + s.radius * Math.sin(s.phi) * Math.sin(s.theta);
    cam.lookAt(t.x, t.y, t.z);
  }
  const pickObject = (clientX, clientY) => {
    const el = containerRef.current, cam = cameraRef.current, renderer = rendererRef.current, THREE = window.THREE;
    if (!el || !cam || !renderer || !THREE) return null;
    const rect = el.getBoundingClientRect();
    const mouse = new THREE.Vector2((clientX - rect.left) / rect.width * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, cam);
    const hits = ray.intersectObjects(Array.from(meshesRef.current.values()));
    if (!hits.length) return null;
    const hit = hits[0].object;
    for (const [id, mesh] of meshesRef.current) if (mesh === hit) return id;
    return null;
  };
  useEffect3(() => {
    const el = containerRef.current;
    if (!el) return;
    const pointers = /* @__PURE__ */ new Map();
    let lastDist = 0;
    const onDown = (e) => {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      controlsState.current.isDragging = true;
      controlsState.current.lastX = e.clientX;
      controlsState.current.lastY = e.clientY;
      if (pointers.size === 1) {
        const id = pickObject(e.clientX, e.clientY);
        controlsState.current.selectedDragId = id;
        dispatch({ type: "SELECT_OBJECT", payload: id });
      }
    };
    const onMove = (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        const dx = e.clientX - controlsState.current.lastX;
        const dy = e.clientY - controlsState.current.lastY;
        const dragId = controlsState.current.selectedDragId;
        const dragObj = dragId ? project.objects.find((o) => o.id === dragId) : null;
        if (dragObj && !dragObj.locked && Math.abs(dx) + Math.abs(dy) > 2) {
          const scale = controlsState.current.spherical.radius / Math.max(el.clientWidth, 1) * 2.2;
          const snap = (v) => project.snapEnabled ? Math.round(v / project.gridSize) * project.gridSize : v;
          dispatch({ type: "UPDATE_OBJECT", payload: { id: dragObj.id, changes: { x: Math.max(0, snap(dragObj.x + dx * scale)), y: Math.max(0, snap(dragObj.y + dy * scale)) } } });
          controlsState.current.lastX = e.clientX;
          controlsState.current.lastY = e.clientY;
          return;
        }
        controlsState.current.spherical.theta -= dx * 0.01;
        controlsState.current.spherical.phi = Math.max(
          0.1,
          Math.min(Math.PI - 0.1, controlsState.current.spherical.phi + dy * 0.01)
        );
        controlsState.current.lastX = e.clientX;
        controlsState.current.lastY = e.clientY;
        updateCamera();
      } else if (pointers.size === 2) {
        const pts = Array.from(pointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (lastDist > 0) {
          const scale = lastDist / dist;
          controlsState.current.spherical.radius = Math.max(
            3,
            Math.min(40, controlsState.current.spherical.radius * scale)
          );
        }
        lastDist = dist;
        updateCamera();
      }
    };
    const onUp = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) lastDist = 0;
      if (pointers.size === 0) {
        controlsState.current.isDragging = false;
        controlsState.current.selectedDragId = null;
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [ready]);
  useEffect3(() => {
    const el = containerRef.current;
    if (!el || !ready || !window.THREE) return;
    const THREE = window.THREE;
    const onClick = (e) => {
      if (!cameraRef.current || !sceneRef.current || !rendererRef.current) return;
      const rect = el.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        (e.clientX - rect.left) / rect.width * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const meshes = Array.from(meshesRef.current.entries());
      const intersects = raycaster.intersectObjects(meshes.map((m) => m[1]));
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        for (const [id, mesh] of meshes) {
          if (mesh === hitMesh) {
            dispatch({ type: "SELECT_OBJECT", payload: id });
            return;
          }
        }
      } else {
        dispatch({ type: "SELECT_OBJECT", payload: null });
      }
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [ready, dispatch]);
  return /* @__PURE__ */ jsxs2("div", { className: "stage-viewport", children: [
    /* @__PURE__ */ jsxs2("div", { className: "toolbar", children: [
      /* @__PURE__ */ jsx3("span", { style: { fontSize: "0.75rem", color: "var(--text-muted)", padding: "0 8px" }, children: "1 finger: rotate \xB7 2 fingers: zoom" }),
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: () => {
            controlsState.current.spherical = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 15 };
            controlsState.current.target = {
              x: project.stage.widthM / 2,
              y: 0,
              z: project.stage.depthM / 2
            };
            updateCamera();
          },
          children: "Reset View"
        }
      )
    ] }),
    /* @__PURE__ */ jsx3("div", { ref: containerRef, className: "three-container", style: { flex: 1, touchAction: "none" } }),
    !ready && /* @__PURE__ */ jsx3("div", { className: "empty-state", style: { position: "absolute", inset: 0 }, children: "Loading 3D engine\u2026" })
  ] });
}

// src/components/EquipmentLibrary.tsx
import { useState as useState3 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var CATEGORIES = [
  { id: "all", label: "All" },
  { id: "speaker", label: "Speakers" },
  { id: "subwoofer", label: "Subs" },
  { id: "monitor", label: "Monitors" },
  { id: "microphone", label: "Mics" },
  { id: "stagebox", label: "Stageboxes" },
  { id: "console", label: "Consoles" },
  { id: "truss", label: "Truss" },
  { id: "lighting", label: "Lighting" },
  { id: "instrument", label: "Instruments" },
  { id: "foh", label: "FOH" },
  { id: "power", label: "Power" }
];
function EquipmentLibrary({ onClose }) {
  const { addEquipment } = useProject();
  const [cat, setCat] = useState3("all");
  const [search, setSearch] = useState3("");
  const filtered = EQUIPMENT_LIBRARY.filter((e) => {
    if (cat !== "all" && e.category !== cat) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  return /* @__PURE__ */ jsxs3("div", { className: "panel", style: { display: "flex", flexDirection: "column", height: "100%" }, children: [
    /* @__PURE__ */ jsxs3("div", { className: "sheet-header", children: [
      /* @__PURE__ */ jsx4("strong", { children: "Equipment Library" }),
      onClose && /* @__PURE__ */ jsx4("button", { className: "icon-btn", onClick: onClose, "aria-label": "Close", children: "\u2715" })
    ] }),
    /* @__PURE__ */ jsx4("div", { style: { padding: "8px 12px" }, children: /* @__PURE__ */ jsx4(
      "input",
      {
        placeholder: "Search equipment\u2026",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        "aria-label": "Search equipment"
      }
    ) }),
    /* @__PURE__ */ jsx4("div", { style: { display: "flex", gap: 6, padding: "0 8px 8px", overflowX: "auto" }, children: CATEGORIES.map((c) => /* @__PURE__ */ jsx4(
      "button",
      {
        className: cat === c.id ? "active" : "",
        style: {
          minHeight: 32,
          padding: "4px 10px",
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: cat === c.id ? "var(--accent)" : "var(--bg-card)",
          color: cat === c.id ? "#fff" : "var(--text)",
          fontSize: "0.75rem",
          whiteSpace: "nowrap"
        },
        onClick: () => setCat(c.id),
        children: c.label
      },
      c.id
    )) }),
    /* @__PURE__ */ jsxs3("div", { style: { flex: 1, overflowY: "auto" }, children: [
      filtered.map((item) => /* @__PURE__ */ jsxs3(
        "div",
        {
          className: "list-item",
          onClick: () => {
            addEquipment(item.id, 1 + Math.random() * 2, 1 + Math.random() * 2);
            onClose?.();
          },
          role: "button",
          tabIndex: 0,
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              addEquipment(item.id);
              onClose?.();
            }
          },
          children: [
            /* @__PURE__ */ jsx4("div", { className: "swatch", style: { background: item.color } }),
            /* @__PURE__ */ jsxs3("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsx4("div", { style: { fontWeight: 600, fontSize: "0.9rem" }, children: item.name }),
              /* @__PURE__ */ jsxs3("div", { style: { fontSize: "0.75rem", color: "var(--text-muted)" }, children: [
                item.defaultWidth,
                "\xD7",
                item.defaultDepth,
                "m",
                item.powerWatts ? ` \xB7 ${item.powerWatts}W` : "",
                item.channels ? ` \xB7 ${item.channels}ch` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsx4("span", { style: { fontSize: "1.2rem", color: "var(--accent)" }, children: "\uFF0B" })
          ]
        },
        item.id
      )),
      filtered.length === 0 && /* @__PURE__ */ jsx4("div", { className: "empty-state", children: "No equipment matches." })
    ] })
  ] });
}

// src/components/IOLists.tsx
import { useState as useState4 } from "react";
import { Fragment, jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function IOLists() {
  const { project, dispatch } = useProject();
  const [tab, setTab] = useState4("inputs");
  const addInput = () => {
    const nextNum = project.inputs.length ? Math.max(...project.inputs.map((i) => i.number)) + 1 : 1;
    const ch = {
      id: crypto.randomUUID(),
      number: nextNum,
      name: `Input ${nextNum}`,
      source: "",
      phantom: false
    };
    dispatch({ type: "ADD_INPUT", payload: ch });
  };
  const addOutput = () => {
    const nextNum = project.outputs.length ? Math.max(...project.outputs.map((o) => o.number)) + 1 : 1;
    const ch = {
      id: crypto.randomUUID(),
      number: nextNum,
      name: `Output ${nextNum}`,
      destination: "",
      type: "main"
    };
    dispatch({ type: "ADD_OUTPUT", payload: ch });
  };
  const addMonitor = () => {
    const m = {
      id: crypto.randomUUID(),
      name: `Mix ${project.monitors.length + 1}`,
      type: "wedge",
      channels: []
    };
    dispatch({ type: "ADD_MONITOR", payload: m });
  };
  return /* @__PURE__ */ jsxs4("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxs4("div", { className: "toolbar", children: [
      /* @__PURE__ */ jsxs4("button", { className: tab === "inputs" ? "active" : "", onClick: () => setTab("inputs"), children: [
        "Inputs (",
        project.inputs.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxs4("button", { className: tab === "outputs" ? "active" : "", onClick: () => setTab("outputs"), children: [
        "Outputs (",
        project.outputs.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxs4("button", { className: tab === "monitors" ? "active" : "", onClick: () => setTab("monitors"), children: [
        "Monitors (",
        project.monitors.length,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("div", { id: "io-lists-content", style: { flex: 1, overflowY: "auto", paddingBottom: 80 }, children: [
      tab === "inputs" && /* @__PURE__ */ jsxs4(Fragment, { children: [
        project.inputs.sort((a, b) => a.number - b.number).map((ch) => /* @__PURE__ */ jsxs4("div", { className: "card", style: { margin: 8 }, children: [
          /* @__PURE__ */ jsxs4("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx5(
              "input",
              {
                style: { width: 56 },
                type: "number",
                value: ch.number,
                onChange: (e) => dispatch({
                  type: "UPDATE_INPUT",
                  payload: { id: ch.id, changes: { number: +e.target.value } }
                })
              }
            ),
            /* @__PURE__ */ jsx5(
              "input",
              {
                style: { flex: 1 },
                value: ch.name,
                onChange: (e) => dispatch({
                  type: "UPDATE_INPUT",
                  payload: { id: ch.id, changes: { name: e.target.value } }
                }),
                placeholder: "Name"
              }
            ),
            /* @__PURE__ */ jsx5(
              "button",
              {
                className: "icon-btn",
                style: { color: "var(--danger)" },
                onClick: () => dispatch({ type: "DELETE_INPUT", payload: ch.id }),
                "aria-label": "Delete",
                children: "\u{1F5D1}"
              }
            )
          ] }),
          /* @__PURE__ */ jsx5(
            "input",
            {
              value: ch.source,
              onChange: (e) => dispatch({
                type: "UPDATE_INPUT",
                payload: { id: ch.id, changes: { source: e.target.value } }
              }),
              placeholder: "Source / instrument",
              style: { marginBottom: 6 }
            }
          ),
          /* @__PURE__ */ jsxs4("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
            /* @__PURE__ */ jsxs4("label", { style: { display: "flex", alignItems: "center", gap: 6, margin: 0 }, children: [
              /* @__PURE__ */ jsx5(
                "input",
                {
                  type: "checkbox",
                  checked: !!ch.phantom,
                  onChange: (e) => dispatch({
                    type: "UPDATE_INPUT",
                    payload: { id: ch.id, changes: { phantom: e.target.checked } }
                  })
                }
              ),
              "48V"
            ] }),
            /* @__PURE__ */ jsx5(
              "input",
              {
                value: ch.micType || "",
                onChange: (e) => dispatch({
                  type: "UPDATE_INPUT",
                  payload: { id: ch.id, changes: { micType: e.target.value } }
                }),
                placeholder: "Mic type",
                style: { flex: 1 }
              }
            )
          ] })
        ] }, ch.id)),
        project.inputs.length === 0 && /* @__PURE__ */ jsx5("div", { className: "empty-state", children: "No inputs yet. Add channels for your patch." })
      ] }),
      tab === "outputs" && /* @__PURE__ */ jsxs4(Fragment, { children: [
        project.outputs.sort((a, b) => a.number - b.number).map((ch) => /* @__PURE__ */ jsxs4("div", { className: "card", style: { margin: 8 }, children: [
          /* @__PURE__ */ jsxs4("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx5(
              "input",
              {
                style: { width: 56 },
                type: "number",
                value: ch.number,
                onChange: (e) => dispatch({
                  type: "UPDATE_OUTPUT",
                  payload: { id: ch.id, changes: { number: +e.target.value } }
                })
              }
            ),
            /* @__PURE__ */ jsx5(
              "input",
              {
                style: { flex: 1 },
                value: ch.name,
                onChange: (e) => dispatch({
                  type: "UPDATE_OUTPUT",
                  payload: { id: ch.id, changes: { name: e.target.value } }
                })
              }
            ),
            /* @__PURE__ */ jsx5(
              "button",
              {
                className: "icon-btn",
                style: { color: "var(--danger)" },
                onClick: () => dispatch({ type: "DELETE_OUTPUT", payload: ch.id }),
                children: "\u{1F5D1}"
              }
            )
          ] }),
          /* @__PURE__ */ jsx5(
            "input",
            {
              value: ch.destination,
              onChange: (e) => dispatch({
                type: "UPDATE_OUTPUT",
                payload: { id: ch.id, changes: { destination: e.target.value } }
              }),
              placeholder: "Destination",
              style: { marginBottom: 6 }
            }
          ),
          /* @__PURE__ */ jsxs4(
            "select",
            {
              value: ch.type,
              onChange: (e) => dispatch({
                type: "UPDATE_OUTPUT",
                payload: {
                  id: ch.id,
                  changes: { type: e.target.value }
                }
              }),
              children: [
                /* @__PURE__ */ jsx5("option", { value: "main", children: "Main" }),
                /* @__PURE__ */ jsx5("option", { value: "monitor", children: "Monitor" }),
                /* @__PURE__ */ jsx5("option", { value: "aux", children: "Aux" }),
                /* @__PURE__ */ jsx5("option", { value: "matrix", children: "Matrix" }),
                /* @__PURE__ */ jsx5("option", { value: "iem", children: "IEM" })
              ]
            }
          )
        ] }, ch.id)),
        project.outputs.length === 0 && /* @__PURE__ */ jsx5("div", { className: "empty-state", children: "No outputs defined." })
      ] }),
      tab === "monitors" && /* @__PURE__ */ jsxs4(Fragment, { children: [
        project.monitors.map((m) => /* @__PURE__ */ jsx5("div", { className: "card", style: { margin: 8 }, children: /* @__PURE__ */ jsxs4("div", { style: { display: "flex", gap: 8, marginBottom: 8 }, children: [
          /* @__PURE__ */ jsx5(
            "input",
            {
              style: { flex: 1 },
              value: m.name,
              onChange: (e) => {
                const updated = project.monitors.map(
                  (x) => x.id === m.id ? { ...x, name: e.target.value } : x
                );
                dispatch({ type: "DELETE_MONITOR", payload: m.id });
                dispatch({
                  type: "ADD_MONITOR",
                  payload: { ...m, name: e.target.value }
                });
              }
            }
          ),
          /* @__PURE__ */ jsxs4(
            "select",
            {
              value: m.type,
              onChange: (e) => {
                dispatch({ type: "DELETE_MONITOR", payload: m.id });
                dispatch({
                  type: "ADD_MONITOR",
                  payload: { ...m, type: e.target.value }
                });
              },
              children: [
                /* @__PURE__ */ jsx5("option", { value: "wedge", children: "Wedge" }),
                /* @__PURE__ */ jsx5("option", { value: "iem", children: "IEM" })
              ]
            }
          ),
          /* @__PURE__ */ jsx5(
            "button",
            {
              className: "icon-btn",
              style: { color: "var(--danger)" },
              onClick: () => dispatch({ type: "DELETE_MONITOR", payload: m.id }),
              children: "\u{1F5D1}"
            }
          )
        ] }) }, m.id)),
        project.monitors.length === 0 && /* @__PURE__ */ jsx5("div", { className: "empty-state", children: "No monitor mixes." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs4(
      "div",
      {
        style: {
          position: "sticky",
          bottom: 0,
          padding: 12,
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: 8,
          flexWrap: "wrap"
        },
        children: [
          tab === "inputs" && /* @__PURE__ */ jsx5("button", { className: "btn btn-primary", onClick: addInput, children: "\uFF0B Input" }),
          tab === "outputs" && /* @__PURE__ */ jsx5("button", { className: "btn btn-primary", onClick: addOutput, children: "\uFF0B Output" }),
          tab === "monitors" && /* @__PURE__ */ jsx5("button", { className: "btn btn-primary", onClick: addMonitor, children: "\uFF0B Monitor Mix" }),
          /* @__PURE__ */ jsx5("button", { className: "btn btn-ghost", onClick: exportAsPdf, children: "PDF / Print" }),
          /* @__PURE__ */ jsx5(
            "button",
            {
              className: "btn btn-ghost",
              onClick: async () => {
                const el = document.getElementById("io-lists-content");
                if (!el) return;
                try {
                  await exportElementAsJpeg(el, `${tab}_list.jpg`);
                } catch {
                  alert("JPEG export failed. Use PDF / Print.");
                }
              },
              children: "JPEG"
            }
          )
        ]
      }
    )
  ] });
}

// src/components/PatchPanel.tsx
import { useState as useState5 } from "react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function PatchPanel() {
  const { project, dispatch } = useProject();
  const [from, setFrom] = useState5("");
  const [to, setTo] = useState5("");
  const [cable, setCable] = useState5("XLR");
  const [length, setLength] = useState5("");
  const addPatch = () => {
    if (!from.trim() || !to.trim()) return;
    const p = {
      id: crypto.randomUUID(),
      from: from.trim(),
      to: to.trim(),
      cableType: cable,
      lengthM: length ? parseFloat(length) : void 0
    };
    dispatch({ type: "ADD_PATCH", payload: p });
    setFrom("");
    setTo("");
    setLength("");
  };
  return /* @__PURE__ */ jsxs5("div", { style: { display: "flex", flexDirection: "column", height: "100%" }, children: [
    /* @__PURE__ */ jsx6("div", { className: "sheet-header", children: /* @__PURE__ */ jsx6("strong", { children: "Patch / Cable Routing" }) }),
    /* @__PURE__ */ jsxs5("div", { style: { padding: 12, borderBottom: "1px solid var(--border)" }, children: [
      /* @__PURE__ */ jsxs5("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx6("label", { children: "From" }),
        /* @__PURE__ */ jsx6("input", { value: from, onChange: (e) => setFrom(e.target.value), placeholder: "e.g. Stage L Vocal" })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx6("label", { children: "To" }),
        /* @__PURE__ */ jsx6("input", { value: to, onChange: (e) => setTo(e.target.value), placeholder: "e.g. Console Ch 1" })
      ] }),
      /* @__PURE__ */ jsxs5("div", { style: { display: "flex", gap: 8, padding: "0 12px 12px" }, children: [
        /* @__PURE__ */ jsxs5("select", { value: cable, onChange: (e) => setCable(e.target.value), style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx6("option", { children: "XLR" }),
          /* @__PURE__ */ jsx6("option", { children: "TRS" }),
          /* @__PURE__ */ jsx6("option", { children: "Speakon" }),
          /* @__PURE__ */ jsx6("option", { children: "PowerCON" }),
          /* @__PURE__ */ jsx6("option", { children: "Cat6 / AES" }),
          /* @__PURE__ */ jsx6("option", { children: "DMX" }),
          /* @__PURE__ */ jsx6("option", { children: "Other" })
        ] }),
        /* @__PURE__ */ jsx6(
          "input",
          {
            style: { width: 80 },
            type: "number",
            placeholder: "m",
            value: length,
            onChange: (e) => setLength(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx6("button", { className: "btn btn-primary", onClick: addPatch, children: "Add" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs5("div", { style: { flex: 1, overflowY: "auto" }, children: [
      project.patches.length === 0 && /* @__PURE__ */ jsx6("div", { className: "empty-state", children: "No patch lines yet. Document cable runs here." }),
      project.patches.map((p) => /* @__PURE__ */ jsxs5("div", { className: "list-item", children: [
        /* @__PURE__ */ jsxs5("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsxs5("div", { style: { fontWeight: 600 }, children: [
            p.from,
            " \u2192 ",
            p.to
          ] }),
          /* @__PURE__ */ jsxs5("div", { style: { fontSize: "0.75rem", color: "var(--text-muted)" }, children: [
            p.cableType,
            p.lengthM ? ` \xB7 ${p.lengthM}m` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx6(
          "button",
          {
            className: "icon-btn",
            style: { color: "var(--danger)" },
            onClick: () => dispatch({ type: "DELETE_PATCH", payload: p.id }),
            children: "\u{1F5D1}"
          }
        )
      ] }, p.id))
    ] })
  ] });
}

// src/components/RiderGenerator.tsx
import { useMemo, useRef as useRef5 } from "react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function RiderGenerator() {
  const { project, validationIssues } = useProject();
  const contentRef = useRef5(null);
  const power = useMemo(() => calculateTotalPower(project.objects), [project.objects]);
  const weight = useMemo(() => calculateTotalWeight(project.objects), [project.objects]);
  const spl = useMemo(() => estimateRoughSPL(project.objects), [project.objects]);
  const equipmentSummary = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const o of project.objects) {
      map.set(o.name, (map.get(o.name) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [project.objects]);
  const baseName = (project.meta.name || "rider").replace(/\s+/g, "_");
  const onJpeg = async () => {
    if (!contentRef.current) return;
    try {
      await exportElementAsJpeg(contentRef.current, `${baseName}_rider.jpg`);
    } catch {
      alert("JPEG export failed in this browser. Use PDF / Print instead.");
    }
  };
  return /* @__PURE__ */ jsxs6("div", { style: { overflowY: "auto", height: "100%", paddingBottom: 24 }, children: [
    /* @__PURE__ */ jsxs6("div", { className: "sheet-header", children: [
      /* @__PURE__ */ jsx7("strong", { children: "Technical Rider" }),
      /* @__PURE__ */ jsxs6("div", { style: { display: "flex", gap: 6 }, children: [
        /* @__PURE__ */ jsx7("button", { className: "btn btn-ghost", onClick: exportAsPdf, style: { minHeight: 36, padding: "6px 12px" }, children: "PDF / Print" }),
        /* @__PURE__ */ jsx7("button", { className: "btn btn-primary", onClick: onJpeg, style: { minHeight: 36, padding: "6px 12px" }, children: "JPEG" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs6("div", { id: "rider-content", ref: contentRef, children: [
      validationIssues.length > 0 && /* @__PURE__ */ jsxs6("div", { className: "warning-box", children: [
        /* @__PURE__ */ jsx7("strong", { children: "Validation notes:" }),
        /* @__PURE__ */ jsx7("ul", { style: { margin: "6px 0 0", paddingLeft: 18 }, children: validationIssues.map((i, idx) => /* @__PURE__ */ jsx7("li", { children: i }, idx)) })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "card", children: [
        /* @__PURE__ */ jsx7("h3", { style: { margin: "0 0 8px", fontSize: "1rem" }, children: "Project Info" }),
        /* @__PURE__ */ jsx7("p", { style: { margin: 4 }, children: /* @__PURE__ */ jsx7("strong", { children: project.meta.name }) }),
        /* @__PURE__ */ jsxs6("p", { style: { margin: 4, color: "var(--text-muted)", fontSize: "0.9rem" }, children: [
          "Client: ",
          project.meta.client || "\u2014",
          " \xB7 Venue: ",
          project.meta.venue || "\u2014",
          /* @__PURE__ */ jsx7("br", {}),
          "Date: ",
          project.meta.date,
          " \xB7 Engineer: ",
          project.meta.engineer || "\u2014"
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "card", children: [
        /* @__PURE__ */ jsx7("h3", { style: { margin: "0 0 8px", fontSize: "1rem" }, children: "Stage" }),
        /* @__PURE__ */ jsxs6("p", { style: { margin: 0 }, children: [
          project.stage.widthM,
          " m (W) \xD7 ",
          project.stage.depthM,
          " m (D) \xD7 ",
          project.stage.heightM,
          " m (H)"
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "card", children: [
        /* @__PURE__ */ jsx7("h3", { style: { margin: "0 0 8px", fontSize: "1rem" }, children: "Equipment List" }),
        equipmentSummary.length === 0 ? /* @__PURE__ */ jsx7("p", { style: { color: "var(--text-muted)" }, children: "No equipment placed." }) : /* @__PURE__ */ jsx7("ul", { style: { margin: 0, paddingLeft: 18 }, children: equipmentSummary.map((e) => /* @__PURE__ */ jsxs6("li", { children: [
          e.count,
          "\xD7 ",
          e.name
        ] }, e.name)) })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "card", children: [
        /* @__PURE__ */ jsx7("h3", { style: { margin: "0 0 8px", fontSize: "1rem" }, children: "Power Estimate" }),
        /* @__PURE__ */ jsxs6("p", { style: { margin: 0 }, children: [
          "Total: ",
          /* @__PURE__ */ jsxs6("strong", { children: [
            power.totalWatts,
            " W"
          ] }),
          /* @__PURE__ */ jsx7("br", {}),
          "\u2248 ",
          power.estimatedAmps230V.toFixed(1),
          " A @ 230 V \xB7 \u2248 ",
          power.estimatedAmps120V.toFixed(1),
          " A @ 120 V"
        ] }),
        /* @__PURE__ */ jsx7("p", { style: { fontSize: "0.75rem", color: "var(--warning)", marginTop: 8 }, children: "\u26A0 PLANNING ESTIMATE ONLY. Not a certified electrical calculation. Verify with a qualified electrician." }),
        power.warning && /* @__PURE__ */ jsx7("p", { style: { fontSize: "0.8rem", color: "var(--danger)" }, children: power.warning })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "card", children: [
        /* @__PURE__ */ jsx7("h3", { style: { margin: "0 0 8px", fontSize: "1rem" }, children: "Weight / Rigging Note" }),
        /* @__PURE__ */ jsxs6("p", { style: { margin: 0 }, children: [
          "Estimated equipment mass: ",
          /* @__PURE__ */ jsxs6("strong", { children: [
            weight.totalKg.toFixed(0),
            " kg"
          ] })
        ] }),
        /* @__PURE__ */ jsx7("p", { style: { fontSize: "0.75rem", color: "var(--warning)", marginTop: 8 }, children: "\u26A0 NOT a structural or rigging calculation. All flown / elevated loads must be designed and signed off by a qualified rigger and structural engineer. Observe local safety regulations." }),
        weight.warning && /* @__PURE__ */ jsx7("p", { style: { fontSize: "0.8rem", color: "var(--danger)" }, children: weight.warning })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "card", children: [
        /* @__PURE__ */ jsx7("h3", { style: { margin: "0 0 8px", fontSize: "1rem" }, children: "Rough SPL Indicator" }),
        spl.value !== null ? /* @__PURE__ */ jsxs6("p", { style: { margin: 0 }, children: [
          "Approx. indicator: ",
          /* @__PURE__ */ jsxs6("strong", { children: [
            spl.value,
            " dB"
          ] }),
          " (very rough @1 m assumption)"
        ] }) : /* @__PURE__ */ jsx7("p", { style: { margin: 0, color: "var(--text-muted)" }, children: spl.note }),
        /* @__PURE__ */ jsx7("p", { style: { fontSize: "0.75rem", color: "var(--warning)", marginTop: 8 }, children: "\u26A0 NOT a predictive acoustic model. Coverage, array design and real SPL require measurement and professional design. This is a planning aid only." })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "card", children: [
        /* @__PURE__ */ jsxs6("h3", { style: { margin: "0 0 8px", fontSize: "1rem" }, children: [
          "Inputs (",
          project.inputs.length,
          ")"
        ] }),
        project.inputs.length === 0 ? /* @__PURE__ */ jsx7("p", { style: { color: "var(--text-muted)" }, children: "None defined." }) : /* @__PURE__ */ jsxs6("table", { style: { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }, children: [
          /* @__PURE__ */ jsx7("thead", { children: /* @__PURE__ */ jsxs6("tr", { style: { textAlign: "left", color: "var(--text-muted)" }, children: [
            /* @__PURE__ */ jsx7("th", { children: "Ch" }),
            /* @__PURE__ */ jsx7("th", { children: "Name" }),
            /* @__PURE__ */ jsx7("th", { children: "Source" }),
            /* @__PURE__ */ jsx7("th", { children: "48V" })
          ] }) }),
          /* @__PURE__ */ jsx7("tbody", { children: project.inputs.sort((a, b) => a.number - b.number).map((i) => /* @__PURE__ */ jsxs6("tr", { children: [
            /* @__PURE__ */ jsx7("td", { children: i.number }),
            /* @__PURE__ */ jsx7("td", { children: i.name }),
            /* @__PURE__ */ jsx7("td", { children: i.source }),
            /* @__PURE__ */ jsx7("td", { children: i.phantom ? "Y" : "" })
          ] }, i.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "card", children: [
        /* @__PURE__ */ jsx7("h3", { style: { margin: "0 0 8px", fontSize: "1rem" }, children: "Notes" }),
        /* @__PURE__ */ jsx7("p", { style: { whiteSpace: "pre-wrap", margin: 0 }, children: project.notes || "\u2014" })
      ] }),
      /* @__PURE__ */ jsx7("div", { className: "warning-box", style: { marginTop: 16 }, children: "StageForge is a planning and documentation tool. Electrical, structural, acoustic and safety designs must be performed and approved by qualified professionals according to applicable regulations and standards." })
    ] })
  ] });
}

// src/components/SettingsPanel.tsx
import { useRef as useRef6 } from "react";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
function SettingsPanel() {
  const { project, dispatch, save, isDirty, lastSaved, validationIssues } = useProject();
  const fileRef = useRef6(null);
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const p = await importProjectJSON(file);
      dispatch({ type: "SET_PROJECT", payload: p });
      alert("Project imported successfully.");
    } catch (err) {
      alert("Import failed: invalid file.");
    }
    e.target.value = "";
  };
  const applyTemplate = (tplId) => {
    const tpl = TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;
    if (!confirm(`Apply template "${tpl.name}"? Current stage size will be replaced.`)) return;
    dispatch({ type: "SET_STAGE", payload: tpl.stage });
  };
  return /* @__PURE__ */ jsxs7("div", { style: { overflowY: "auto", height: "100%", paddingBottom: 24 }, children: [
    /* @__PURE__ */ jsx8("div", { className: "sheet-header", children: /* @__PURE__ */ jsx8("strong", { children: "Project & Settings" }) }),
    /* @__PURE__ */ jsxs7("div", { className: "card", children: [
      /* @__PURE__ */ jsx8("h3", { style: { margin: "0 0 12px", fontSize: "0.95rem" }, children: "Project Info" }),
      /* @__PURE__ */ jsxs7("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx8("label", { children: "Name" }),
        /* @__PURE__ */ jsx8(
          "input",
          {
            value: project.meta.name,
            onChange: (e) => dispatch({ type: "UPDATE_META", payload: { name: e.target.value } })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx8("label", { children: "Client" }),
        /* @__PURE__ */ jsx8(
          "input",
          {
            value: project.meta.client,
            onChange: (e) => dispatch({ type: "UPDATE_META", payload: { client: e.target.value } })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx8("label", { children: "Venue" }),
        /* @__PURE__ */ jsx8(
          "input",
          {
            value: project.meta.venue,
            onChange: (e) => dispatch({ type: "UPDATE_META", payload: { venue: e.target.value } })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx8("label", { children: "Date" }),
        /* @__PURE__ */ jsx8(
          "input",
          {
            type: "date",
            value: project.meta.date,
            onChange: (e) => dispatch({ type: "UPDATE_META", payload: { date: e.target.value } })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx8("label", { children: "Engineer" }),
        /* @__PURE__ */ jsx8(
          "input",
          {
            value: project.meta.engineer,
            onChange: (e) => dispatch({ type: "UPDATE_META", payload: { engineer: e.target.value } })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "card", children: [
      /* @__PURE__ */ jsx8("h3", { style: { margin: "0 0 12px", fontSize: "0.95rem" }, children: "Stage Dimensions (m)" }),
      /* @__PURE__ */ jsxs7("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsxs7("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx8("label", { children: "Width" }),
          /* @__PURE__ */ jsx8(
            "input",
            {
              type: "number",
              step: "0.5",
              min: "1",
              value: project.stage.widthM,
              onChange: (e) => dispatch({
                type: "SET_STAGE",
                payload: { ...project.stage, widthM: +e.target.value }
              })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs7("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx8("label", { children: "Depth" }),
          /* @__PURE__ */ jsx8(
            "input",
            {
              type: "number",
              step: "0.5",
              min: "1",
              value: project.stage.depthM,
              onChange: (e) => dispatch({
                type: "SET_STAGE",
                payload: { ...project.stage, depthM: +e.target.value }
              })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs7("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx8("label", { children: "Height" }),
          /* @__PURE__ */ jsx8(
            "input",
            {
              type: "number",
              step: "0.5",
              min: "1",
              value: project.stage.heightM,
              onChange: (e) => dispatch({
                type: "SET_STAGE",
                payload: { ...project.stage, heightM: +e.target.value }
              })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "card", children: [
      /* @__PURE__ */ jsx8("h3", { style: { margin: "0 0 12px", fontSize: "0.95rem" }, children: "Grid" }),
      /* @__PURE__ */ jsxs7("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs7("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx8("label", { children: "Grid size (m)" }),
          /* @__PURE__ */ jsx8(
            "input",
            {
              type: "number",
              step: "0.25",
              min: "0.25",
              value: project.gridSize,
              onChange: (e) => dispatch({ type: "SET_GRID", payload: { gridSize: +e.target.value } })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs7("label", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 18 }, children: [
          /* @__PURE__ */ jsx8(
            "input",
            {
              type: "checkbox",
              checked: project.snapEnabled,
              onChange: (e) => dispatch({ type: "SET_GRID", payload: { snapEnabled: e.target.checked } })
            }
          ),
          "Snap"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "card", children: [
      /* @__PURE__ */ jsx8("h3", { style: { margin: "0 0 12px", fontSize: "0.95rem" }, children: "Templates" }),
      /* @__PURE__ */ jsx8("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: TEMPLATES.map((t) => /* @__PURE__ */ jsxs7("button", { className: "btn btn-ghost", onClick: () => applyTemplate(t.id), children: [
        t.name,
        " (",
        t.stage.widthM,
        "\xD7",
        t.stage.depthM,
        "m)"
      ] }, t.id)) })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "card", children: [
      /* @__PURE__ */ jsx8("h3", { style: { margin: "0 0 12px", fontSize: "0.95rem" }, children: "Notes" }),
      /* @__PURE__ */ jsx8(
        "textarea",
        {
          rows: 4,
          value: project.notes,
          onChange: (e) => dispatch({ type: "SET_NOTES", payload: e.target.value }),
          placeholder: "Production notes, special requirements\u2026"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "card", children: [
      /* @__PURE__ */ jsx8("h3", { style: { margin: "0 0 12px", fontSize: "0.95rem" }, children: "Save / Backup" }),
      /* @__PURE__ */ jsxs7("p", { style: { fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 12 }, children: [
        "Status: ",
        isDirty ? "Unsaved changes" : "Saved",
        lastSaved ? ` \xB7 Last: ${new Date(lastSaved).toLocaleTimeString()}` : "",
        /* @__PURE__ */ jsx8("br", {}),
        "Autosave every 30s \xB7 Offline-capable (localStorage)"
      ] }),
      /* @__PURE__ */ jsxs7("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: [
        /* @__PURE__ */ jsx8("button", { className: "btn btn-primary", onClick: save, children: "Save Now" }),
        /* @__PURE__ */ jsx8("button", { className: "btn btn-ghost", onClick: () => fileRef.current?.click(), children: "Import Project" }),
        /* @__PURE__ */ jsx8("input", { ref: fileRef, type: "file", accept: ".json,application/json", hidden: true, onChange: handleImport }),
        /* @__PURE__ */ jsx8(
          "button",
          {
            className: "btn btn-ghost",
            style: { color: "var(--danger)" },
            onClick: () => {
              if (confirm("Create a new empty project? Unsaved data may be lost.")) {
                dispatch({ type: "NEW_PROJECT", payload: "New Project" });
              }
            },
            children: "New Project"
          }
        )
      ] })
    ] }),
    validationIssues.length > 0 && /* @__PURE__ */ jsxs7("div", { className: "warning-box", children: [
      /* @__PURE__ */ jsx8("strong", { children: "Checks:" }),
      /* @__PURE__ */ jsx8("ul", { style: { margin: "4px 0 0", paddingLeft: 18 }, children: validationIssues.map((v, i) => /* @__PURE__ */ jsx8("li", { children: v }, i)) })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "card", style: { fontSize: "0.8rem", color: "var(--text-muted)" }, children: [
      /* @__PURE__ */ jsx8("strong", { children: "StageForge v1.0" }),
      /* @__PURE__ */ jsx8("br", {}),
      "Mobile-first stage planning \xB7 Offline PWA \xB7 Planning estimates only",
      /* @__PURE__ */ jsx8("br", {}),
      "Package: com.stageforge.app"
    ] })
  ] });
}

// src/components/PlanningPanel.tsx
import { useMemo as useMemo2 } from "react";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
function PlanningPanel() {
  const { project, dispatch } = useProject();
  const power = useMemo2(() => calculateTotalPower(project.objects), [project.objects]);
  const weight = useMemo2(() => calculateTotalWeight(project.objects), [project.objects]);
  const dmxConflicts = useMemo2(() => {
    const seen = /* @__PURE__ */ new Set(), out = [];
    for (const f of project.lighting || []) for (let ch = 0; ch < f.channels; ch++) {
      const k = `${f.universe}:${f.address + ch}`;
      if (seen.has(k)) out.push(`DMX conflict: U${f.universe} address ${f.address + ch}`);
      seen.add(k);
    }
    return [...new Set(out)];
  }, [project.lighting]);
  const addLight = () => dispatch({ type: "ADD_LIGHTING", payload: { id: crypto.randomUUID(), brand: "", model: "", type: "Moving Head", mode: "Standard", universe: 1, address: 1, channels: 16, quantity: 1, position: "" } });
  const addCircuit = () => dispatch({ type: "ADD_CIRCUIT", payload: { id: crypto.randomUUID(), name: `Circuit ${(project.circuits || []).length + 1}`, voltage: 230, capacityA: 16, phase: "L1", objectIds: [] } });
  return /* @__PURE__ */ jsxs8("div", { style: { overflowY: "auto", height: "100%", paddingBottom: 24 }, children: [
    /* @__PURE__ */ jsx9("div", { className: "sheet-header", children: /* @__PURE__ */ jsx9("strong", { children: "Planning & Engineering Tools" }) }),
    /* @__PURE__ */ jsxs8("div", { className: "card", children: [
      /* @__PURE__ */ jsx9("h3", { children: "Power" }),
      /* @__PURE__ */ jsxs8("p", { children: [
        "Total: ",
        /* @__PURE__ */ jsxs8("strong", { children: [
          power.totalWatts.toLocaleString(),
          " W"
        ] }),
        " \xB7 ",
        power.estimatedAmps230V.toFixed(1),
        " A @230V"
      ] }),
      /* @__PURE__ */ jsx9("p", { style: { fontSize: ".75rem", color: "var(--warning)" }, children: "Planning estimate only. Circuit protection, diversity, phase balance and cable selection require qualified electrical design." }),
      (project.circuits || []).map((c) => {
        const load = c.objectIds.reduce((s, id) => s + (project.objects.find((o) => o.id === id)?.powerWatts || 0), 0);
        const amps = load / (c.voltage || 230);
        return /* @__PURE__ */ jsxs8("div", { className: "card", children: [
          /* @__PURE__ */ jsxs8("div", { style: { display: "flex", gap: 6 }, children: [
            /* @__PURE__ */ jsx9("input", { value: c.name, onChange: (e) => dispatch({ type: "UPDATE_CIRCUIT", payload: { id: c.id, changes: { name: e.target.value } } }) }),
            /* @__PURE__ */ jsx9("button", { className: "btn btn-ghost", onClick: () => dispatch({ type: "DELETE_CIRCUIT", payload: c.id }), children: "\xD7" })
          ] }),
          /* @__PURE__ */ jsxs8("p", { children: [
            load,
            " W \xB7 ",
            amps.toFixed(1),
            " A / ",
            c.capacityA,
            " A \xB7 ",
            c.voltage,
            " V \xB7 ",
            c.phase
          ] }),
          /* @__PURE__ */ jsx9("select", { multiple: true, style: { width: "100%", minHeight: 80 }, value: c.objectIds, onChange: (e) => dispatch({ type: "UPDATE_CIRCUIT", payload: { id: c.id, changes: { objectIds: Array.from(e.target.selectedOptions).map((o) => o.value) } } }), children: project.objects.filter((o) => (o.powerWatts || 0) > 0).map((o) => /* @__PURE__ */ jsxs8("option", { value: o.id, children: [
            o.name,
            " \xB7 ",
            o.powerWatts,
            "W"
          ] }, o.id)) }),
          amps > c.capacityA && /* @__PURE__ */ jsx9("div", { className: "warning-box", children: "Circuit overload warning." })
        ] }, c.id);
      }),
      /* @__PURE__ */ jsx9("button", { className: "btn btn-primary", onClick: addCircuit, children: "Add circuit" })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "card", children: [
      /* @__PURE__ */ jsx9("h3", { children: "Lighting / DMX Patch" }),
      /* @__PURE__ */ jsx9("button", { className: "btn btn-primary", onClick: addLight, children: "Add fixture" }),
      (project.lighting || []).map((f) => /* @__PURE__ */ jsxs8("div", { className: "card", children: [
        /* @__PURE__ */ jsxs8("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }, children: [
          /* @__PURE__ */ jsx9("input", { placeholder: "Brand", value: f.brand, onChange: (e) => dispatch({ type: "UPDATE_LIGHTING", payload: { id: f.id, changes: { brand: e.target.value } } }) }),
          /* @__PURE__ */ jsx9("input", { placeholder: "Model", value: f.model, onChange: (e) => dispatch({ type: "UPDATE_LIGHTING", payload: { id: f.id, changes: { model: e.target.value } } }) }),
          /* @__PURE__ */ jsx9("input", { placeholder: "Type", value: f.type, onChange: (e) => dispatch({ type: "UPDATE_LIGHTING", payload: { id: f.id, changes: { type: e.target.value } } }) }),
          /* @__PURE__ */ jsx9("input", { placeholder: "Mode", value: f.mode, onChange: (e) => dispatch({ type: "UPDATE_LIGHTING", payload: { id: f.id, changes: { mode: e.target.value } } }) }),
          /* @__PURE__ */ jsx9("input", { type: "number", min: "1", max: "64", value: f.universe, onChange: (e) => dispatch({ type: "UPDATE_LIGHTING", payload: { id: f.id, changes: { universe: +e.target.value } } }) }),
          /* @__PURE__ */ jsx9("input", { type: "number", min: "1", max: "512", value: f.address, onChange: (e) => dispatch({ type: "UPDATE_LIGHTING", payload: { id: f.id, changes: { address: +e.target.value } } }) }),
          /* @__PURE__ */ jsx9("input", { type: "number", min: "1", max: "512", value: f.channels, onChange: (e) => dispatch({ type: "UPDATE_LIGHTING", payload: { id: f.id, changes: { channels: +e.target.value } } }) }),
          /* @__PURE__ */ jsx9("input", { type: "number", min: "1", value: f.quantity, onChange: (e) => dispatch({ type: "UPDATE_LIGHTING", payload: { id: f.id, changes: { quantity: +e.target.value } } }) })
        ] }),
        /* @__PURE__ */ jsx9("button", { className: "btn btn-ghost", onClick: () => dispatch({ type: "DELETE_LIGHTING", payload: f.id }), children: "Delete fixture" })
      ] }, f.id)),
      dmxConflicts.map((x) => /* @__PURE__ */ jsx9("div", { className: "warning-box", children: x }, x))
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "card", children: [
      /* @__PURE__ */ jsx9("h3", { children: "Rigging / Load" }),
      /* @__PURE__ */ jsxs8("p", { children: [
        "Estimated total equipment mass: ",
        /* @__PURE__ */ jsxs8("strong", { children: [
          weight.totalKg.toFixed(1),
          " kg"
        ] })
      ] }),
      /* @__PURE__ */ jsx9("p", { style: { fontSize: ".75rem", color: "var(--warning)" }, children: "Planning estimate only. Suspended loads, anchor points, truss, motors and venue structures require certified rigging calculations and inspection." })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "card", children: [
      /* @__PURE__ */ jsx9("h3", { children: "Project validation" }),
      validateProject(project).length ? validateProject(project).map((x, i) => /* @__PURE__ */ jsx9("div", { className: "warning-box", children: x }, i)) : /* @__PURE__ */ jsx9("p", { children: "\u2713 No basic validation issues detected." })
    ] })
  ] });
}

// src/App.tsx
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
function AppShell() {
  const { viewMode, dispatch, project, selectedObject, isDirty } = useProject();
  const [showLibrary, setShowLibrary] = useState6(false);
  const [online, setOnline] = useState6(navigator.onLine);
  useEffect4(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  const setView = (v) => dispatch({ type: "SET_VIEW", payload: v });
  return /* @__PURE__ */ jsxs9("div", { className: "app-shell", children: [
    /* @__PURE__ */ jsxs9("header", { className: "top-bar", children: [
      /* @__PURE__ */ jsxs9("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }, children: [
        /* @__PURE__ */ jsx10("h1", { children: "StageForge" }),
        /* @__PURE__ */ jsxs9("span", { className: "meta", children: [
          project.meta.name,
          isDirty ? " \u2022" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxs9("div", { style: { display: "flex", gap: 4 }, children: [
        !online && /* @__PURE__ */ jsx10("span", { className: "badge warning", children: "Offline" }),
        /* @__PURE__ */ jsx10(
          "button",
          {
            className: "icon-btn",
            onClick: () => setShowLibrary(true),
            "aria-label": "Add equipment",
            title: "Add equipment",
            children: "\uFF0B"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs9("main", { className: "main-content", children: [
      viewMode === "2d" && /* @__PURE__ */ jsx10(Stage2D, {}),
      viewMode === "3d" && /* @__PURE__ */ jsx10(Stage3D, {}),
      viewMode === "list" && /* @__PURE__ */ jsx10(IOLists, {}),
      viewMode === "patch" && /* @__PURE__ */ jsx10(PatchPanel, {}),
      viewMode === "rider" && /* @__PURE__ */ jsx10(RiderGenerator, {}),
      viewMode === "planning" && /* @__PURE__ */ jsx10(PlanningPanel, {}),
      viewMode === "settings" && /* @__PURE__ */ jsx10(SettingsPanel, {}),
      (viewMode === "2d" || viewMode === "3d") && selectedObject && /* @__PURE__ */ jsx10(
        "div",
        {
          className: "panel",
          style: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: "30%",
            zIndex: 10,
            borderTop: "1px solid var(--border)"
          },
          children: /* @__PURE__ */ jsxs9("div", { style: { padding: 12, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }, children: [
            /* @__PURE__ */ jsx10("strong", { style: { fontSize: "0.9rem" }, children: selectedObject.name }),
            /* @__PURE__ */ jsx10("span", { className: "badge", children: selectedObject.type }),
            /* @__PURE__ */ jsx10("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,minmax(70px,1fr))", gap: 6, width: "100%" }, children: ["x", "y", "z", "rotation"].map((k) => /* @__PURE__ */ jsxs9("label", { style: { fontSize: ".7rem" }, children: [
              k.toUpperCase(),
              /* @__PURE__ */ jsx10("input", { type: "number", step: "0.1", value: selectedObject[k], onChange: (e) => dispatch({ type: "UPDATE_OBJECT", payload: { id: selectedObject.id, changes: { [k]: +e.target.value } } }) })
            ] }, k)) }),
            /* @__PURE__ */ jsx10("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,minmax(70px,1fr))", gap: 6, width: "100%" }, children: ["width", "height", "depth"].map((k) => /* @__PURE__ */ jsxs9("label", { style: { fontSize: ".7rem" }, children: [
              k.toUpperCase(),
              /* @__PURE__ */ jsx10("input", { type: "number", min: "0.01", step: "0.05", value: selectedObject[k], onChange: (e) => dispatch({ type: "UPDATE_OBJECT", payload: { id: selectedObject.id, changes: { [k]: Math.max(0.01, +e.target.value) } } }) })
            ] }, k)) }),
            /* @__PURE__ */ jsxs9("label", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: ".75rem" }, children: [
              /* @__PURE__ */ jsx10("input", { type: "checkbox", checked: !!selectedObject.locked, onChange: (e) => dispatch({ type: "UPDATE_OBJECT", payload: { id: selectedObject.id, changes: { locked: e.target.checked } } }) }),
              " Lock"
            ] }),
            selectedObject.powerWatts ? /* @__PURE__ */ jsxs9("span", { style: { fontSize: "0.8rem" }, children: [
              selectedObject.powerWatts,
              "W"
            ] }) : null
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs9("nav", { className: "bottom-nav", role: "navigation", "aria-label": "Main", children: [
      /* @__PURE__ */ jsxs9(
        "button",
        {
          className: `nav-item ${viewMode === "2d" ? "active" : ""}`,
          onClick: () => setView("2d"),
          "aria-current": viewMode === "2d" ? "page" : void 0,
          children: [
            /* @__PURE__ */ jsx10("span", { className: "icon", children: "\u25A3" }),
            "2D"
          ]
        }
      ),
      /* @__PURE__ */ jsxs9(
        "button",
        {
          className: `nav-item ${viewMode === "3d" ? "active" : ""}`,
          onClick: () => setView("3d"),
          children: [
            /* @__PURE__ */ jsx10("span", { className: "icon", children: "\u25A6" }),
            "3D"
          ]
        }
      ),
      /* @__PURE__ */ jsxs9(
        "button",
        {
          className: `nav-item ${viewMode === "list" ? "active" : ""}`,
          onClick: () => setView("list"),
          children: [
            /* @__PURE__ */ jsx10("span", { className: "icon", children: "\u2630" }),
            "I/O"
          ]
        }
      ),
      /* @__PURE__ */ jsxs9(
        "button",
        {
          className: `nav-item ${viewMode === "patch" ? "active" : ""}`,
          onClick: () => setView("patch"),
          children: [
            /* @__PURE__ */ jsx10("span", { className: "icon", children: "\u21C4" }),
            "Patch"
          ]
        }
      ),
      /* @__PURE__ */ jsxs9(
        "button",
        {
          className: `nav-item ${viewMode === "rider" ? "active" : ""}`,
          onClick: () => setView("rider"),
          children: [
            /* @__PURE__ */ jsx10("span", { className: "icon", children: "\u{1F4C4}" }),
            "Rider"
          ]
        }
      ),
      /* @__PURE__ */ jsxs9(
        "button",
        {
          className: `nav-item ${viewMode === "planning" ? "active" : ""}`,
          onClick: () => setView("planning"),
          children: [
            /* @__PURE__ */ jsx10("span", { className: "icon", children: "\u26A1" }),
            "Plan"
          ]
        }
      ),
      /* @__PURE__ */ jsxs9(
        "button",
        {
          className: `nav-item ${viewMode === "settings" ? "active" : ""}`,
          onClick: () => setView("settings"),
          children: [
            /* @__PURE__ */ jsx10("span", { className: "icon", children: "\u2699" }),
            "More"
          ]
        }
      )
    ] }),
    showLibrary && /* @__PURE__ */ jsx10("div", { className: "overlay", onClick: () => setShowLibrary(false), children: /* @__PURE__ */ jsx10("div", { className: "sheet", onClick: (e) => e.stopPropagation(), style: { height: "75vh" }, children: /* @__PURE__ */ jsx10(EquipmentLibrary, { onClose: () => setShowLibrary(false) }) }) })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx10(ProjectProvider, { children: /* @__PURE__ */ jsx10(AppShell, {}) });
}

// src/registerSW.ts
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((err) => {
        console.warn("SW registration failed", err);
      });
    });
  }
}

// src/main.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
registerServiceWorker();
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx11(StrictMode, { children: /* @__PURE__ */ jsx11(App, {}) })
);
