import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useProject } from '../store/ProjectContext';
import { exportCanvasAsJpeg, exportCanvasAsPdf } from '../utils/export';

// Three.js is bundled (npm dependency) rather than pulled from a CDN at
// runtime. This is a deliberate size-vs-reliability tradeoff: the Capacitor
// APK build has no network guarantee, so a runtime CDN <script> tag left the
// entire 3D view (and anything relying on it) broken offline / on first
// launch before the OS webview had cached it. Bundling adds ~600KB to the
// build, which is fine per the project's own size constraints.

/** Professional procedural meshes – recognizable silhouettes (MA / EaseFocus / SketchUp style, mobile-safe) */
function createObjectMesh(
  THREE: any,
  obj: { type: string; name?: string; width: number; height?: number; depth: number; color?: string }
) {
  const h = obj.height || 0.3;
  const w = obj.width;
  const d = obj.depth;
  const baseColor = new THREE.Color(obj.color || '#3b82f6');
  const name = (obj.name || '').toLowerCase();

  const mat = (color: any, roughness = 0.5, metalness = 0.2) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });

  const group = new THREE.Group();
  (group as any).userData = { type: obj.type };

  const add = (geo: any, material: any, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    group.add(m);
    return m;
  };

  // ---------- LINE ARRAY / SPEAKER ----------
  if (obj.type === 'speaker') {
    if (name.includes('empty') || name.includes('frame')) {
      // Empty flying frame – open rectangular frame
      const frameMat = mat(0x64748b, 0.4, 0.6);
      const t = 0.04;
      add(new THREE.BoxGeometry(w, t, d), frameMat, 0, h / 2 - t / 2, 0);
      add(new THREE.BoxGeometry(w, t, d), frameMat, 0, -h / 2 + t / 2, 0);
      add(new THREE.BoxGeometry(t, h, d), frameMat, -w / 2 + t / 2, 0, 0);
      add(new THREE.BoxGeometry(t, h, d), frameMat, w / 2 - t / 2, 0, 0);
    } else if (name.includes('hang') || h > 1.0) {
      // Stacked line array hang (4 boxes) with a slight progressive splay –
      // this is the recognizable curved "banana" rig shape seen in
      // EASE Focus / rigging-plot renders, rather than a flat stack.
      const boxCount = name.includes('8x') || name.includes('(8') ? 8 : name.includes('3x') ? 3 : 4;
      const boxH = h / (boxCount + 0.2);
      const boxMat = mat(baseColor, 0.45, 0.25);
      const grilleMat = mat(0x111827, 0.8, 0.1);
      const handleMat = mat(0x1e293b, 0.5, 0.4);
      let cursorY = h / 2;
      let cursorZ = 0;
      let splay = 0;
      for (let i = 0; i < boxCount; i++) {
        const boxSplay = 0.035 + i * 0.012; // wider splay lower in the hang
        const boxD = d * 0.9;
        const y = cursorY - boxH / 2;
        add(new THREE.BoxGeometry(w * 0.95, boxH * 0.98, boxD), boxMat, 0, y, cursorZ, splay, 0, 0);
        add(
          new THREE.BoxGeometry(w * 0.7, boxH * 0.7, 0.02),
          grilleMat,
          0,
          y,
          cursorZ + Math.cos(splay) * boxD * 0.45,
          splay,
          0,
          0
        );
        // rigging link plates between boxes
        add(new THREE.BoxGeometry(0.05, 0.03, 0.05), handleMat, -w * 0.42, cursorY, cursorZ);
        add(new THREE.BoxGeometry(0.05, 0.03, 0.05), handleMat, w * 0.42, cursorY, cursorZ);
        splay += boxSplay;
        cursorY -= boxH * Math.cos(splay);
        cursorZ -= boxH * Math.sin(splay);
      }
      // flying frame/bumper on top
      add(new THREE.BoxGeometry(w * 1.05, 0.05, d * 0.6), handleMat, 0, h / 2 + 0.03, 0);
    } else {
      // Single line array element or point source
      const bodyMat = mat(baseColor, 0.4, 0.3);
      add(new THREE.BoxGeometry(w, h, d), bodyMat);
      add(new THREE.BoxGeometry(w * 0.75, h * 0.7, 0.02), mat(0x0f172a, 0.9, 0), 0, 0, d / 2 + 0.01);
    }
    return group;
  }

  // ---------- SUBWOOFER ----------
  if (obj.type === 'subwoofer') {
    const bodyMat = mat(baseColor, 0.55, 0.15);
    const grilleMat = mat(0x0a0a0a, 0.85, 0.05);
    if (name.includes('dual') || w > 1.0) {
      // Dual 18" – two cabinets side by side
      const halfW = w * 0.47;
      add(new THREE.BoxGeometry(halfW, h, d), bodyMat, -w * 0.26, 0, 0);
      add(new THREE.BoxGeometry(halfW, h, d), bodyMat, w * 0.26, 0, 0);
      // circular grilles suggestion
      add(new THREE.CylinderGeometry(halfW * 0.32, halfW * 0.32, 0.03, 16), grilleMat, -w * 0.26, 0, d / 2 + 0.01, Math.PI / 2, 0, 0);
      add(new THREE.CylinderGeometry(halfW * 0.32, halfW * 0.32, 0.03, 16), grilleMat, w * 0.26, 0, d / 2 + 0.01, Math.PI / 2, 0, 0);
    } else {
      add(new THREE.BoxGeometry(w, h, d), bodyMat);
      add(new THREE.CylinderGeometry(Math.min(w, d) * 0.35, Math.min(w, d) * 0.35, 0.03, 16), grilleMat, 0, 0, d / 2 + 0.01, Math.PI / 2, 0, 0);
    }
    return group;
  }

  // ---------- WEDGE / MONITOR / IEM ----------
  if (obj.type === 'monitor') {
    if (name.includes('iem') || name.includes('transmitter') || name.includes('rack')) {
      // IEM transmitter rack – flat 19" rack unit, not a wedge
      const rackMat = mat(0x1f2937, 0.5, 0.4);
      const faceMat = mat(baseColor, 0.4, 0.3);
      add(new THREE.BoxGeometry(w, h, d), rackMat);
      add(new THREE.BoxGeometry(w * 0.97, h * 0.7, 0.015), faceMat, 0, 0, d / 2 + 0.008);
      // channel LED strip + antenna suggestion
      const chCount = Math.min(8, Math.max(2, obj.type ? 8 : 4));
      for (let i = 0; i < chCount; i++) {
        const x = -w * 0.42 + (i / (chCount - 1)) * w * 0.84;
        add(new THREE.BoxGeometry(0.015, 0.015, 0.005), mat(0x22d3ee, 0.2, 0.1), x, h * 0.15, d / 2 + 0.02);
      }
      add(new THREE.CylinderGeometry(0.006, 0.006, h * 1.6, 6), mat(0x94a3b8, 0.3, 0.7), -w * 0.35, h * 0.6, d / 2 - 0.02);
      add(new THREE.CylinderGeometry(0.006, 0.006, h * 1.6, 6), mat(0x94a3b8, 0.3, 0.7), w * 0.35, h * 0.6, d / 2 - 0.02);
      return group;
    }
    const bodyMat = mat(baseColor, 0.5, 0.2);
    // Angled wedge silhouette
    add(new THREE.BoxGeometry(w, h * 0.7, d), bodyMat, 0, -h * 0.1, 0);
    // Front grille face tilted
    const grille = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.9, h * 0.55, 0.03),
      mat(0x111827, 0.9, 0)
    );
    grille.position.set(0, h * 0.05, d * 0.35);
    grille.rotation.x = -0.45;
    group.add(grille);
    // driver cone suggestion
    add(new THREE.CylinderGeometry(w * 0.18, w * 0.18, 0.02, 14), mat(0x374151, 0.6, 0.2), 0, h * 0.02, d * 0.36, Math.PI / 2, 0, 0);
    return group;
  }

  // ---------- CONSOLE (audio + lighting) ----------
  if (obj.type === 'console') {
    const isLighting = name.includes('ma') || name.includes('avolites') || name.includes('etc') ||
      name.includes('eos') || name.includes('hedgehog') || name.includes('elation') || name.includes('light');
    const bodyMat = mat(baseColor, 0.35, 0.45);
    const darkMat = mat(0x1a1a1a, 0.6, 0.3);
    const bodyH = Math.min(h, 0.22);
    add(new THREE.BoxGeometry(w, bodyH, d), bodyMat, 0, -h / 2 + bodyH / 2, 0);
    // Meter bridge / screen(s)
    add(new THREE.BoxGeometry(w * 0.9, h * 0.35, d * 0.12), darkMat, 0, bodyH * 0.6, -d * 0.35);
    add(new THREE.BoxGeometry(w * 0.86, h * 0.3, 0.01), mat(0x0ea5e9, 0.2, 0.1), 0, bodyH * 0.6, -d * 0.28);
    // Side panels
    add(new THREE.BoxGeometry(0.04, bodyH * 1.1, d), darkMat, -w / 2 + 0.02, -h / 2 + bodyH / 2, 0);
    add(new THREE.BoxGeometry(0.04, bodyH * 1.1, d), darkMat, w / 2 - 0.02, -h / 2 + bodyH / 2, 0);

    if (isLighting) {
      // Lighting console: rows of round encoder knobs + playback fader wing
      add(new THREE.BoxGeometry(w * 0.85, 0.03, d * 0.5), mat(0x222222, 0.5, 0.2), 0, bodyH * 0.55, d * 0.05);
      const cols = 10;
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < cols; c++) {
          const x = -w * 0.4 + (c / (cols - 1)) * w * 0.8;
          add(
            new THREE.CylinderGeometry(0.012, 0.012, 0.015, 10),
            mat(0x64748b, 0.4, 0.5),
            x,
            bodyH * 0.57,
            d * 0.02 + r * d * 0.14
          );
        }
      }
      // playback fader strip at front edge
      for (let c = 0; c < 6; c++) {
        const x = -w * 0.35 + (c / 5) * w * 0.7;
        add(new THREE.BoxGeometry(0.02, 0.02, d * 0.15), mat(0xf59e0b, 0.3, 0.2), x, bodyH * 0.57, d * 0.38);
      }
    } else {
      // Audio console: bank of long linear fader caps
      const faders = 16;
      for (let i = 0; i < faders; i++) {
        const x = -w * 0.42 + (i / (faders - 1)) * w * 0.84;
        add(new THREE.BoxGeometry(0.015, 0.02, d * 0.35), mat(0x0f172a, 0.4, 0.3), x, bodyH * 0.56, d * 0.1);
        add(new THREE.BoxGeometry(0.02, 0.03, 0.05), mat(0xe2e8f0, 0.3, 0.2), x, bodyH * 0.58, d * 0.05);
      }
    }
    return group;
  }

  // ---------- TRUSS ----------
  if (obj.type === 'truss') {
    const metal = mat(0x94a3b8, 0.3, 0.75);
    const chord = 0.045;
    const isLong = w >= 1.5;
    const len = isLong ? w : Math.max(w, d);
    const cross = Math.min(h, d, 0.35);

    // Main chords (4 tubes)
    const offsets = [
      [-cross / 2, -cross / 2],
      [cross / 2, -cross / 2],
      [-cross / 2, cross / 2],
      [cross / 2, cross / 2],
    ];
    for (const [oy, oz] of offsets) {
      add(new THREE.CylinderGeometry(chord / 2, chord / 2, len, 8), metal, 0, oy, oz, 0, 0, Math.PI / 2);
    }
    // Diagonal braces every ~0.5m
    const steps = Math.max(2, Math.floor(len / 0.5));
    for (let i = 0; i <= steps; i++) {
      const x = -len / 2 + (i / steps) * len;
      add(new THREE.CylinderGeometry(chord * 0.35, chord * 0.35, cross, 6), metal, x, 0, 0);
      add(new THREE.CylinderGeometry(chord * 0.35, chord * 0.35, cross, 6), metal, x, 0, 0, 0, Math.PI / 2, 0);
    }
    return group;
  }

  // ---------- LIGHTING (moving head / wash / beam / par) ----------
  if (obj.type === 'lighting') {
    const bodyMat = mat(baseColor, 0.35, 0.5);
    const darkMat = mat(0x1f2937, 0.5, 0.4);
    const headR = Math.min(w, d) * 0.38;

    if (name.includes('bar') || name.includes('batten')) {
      add(new THREE.BoxGeometry(w, h, d), bodyMat);
      return group;
    }
    if (name.includes('haze') || name.includes('fog')) {
      add(new THREE.BoxGeometry(w, h * 0.7, d), bodyMat, 0, -h * 0.1, 0);
      add(new THREE.CylinderGeometry(w * 0.15, w * 0.2, h * 0.4, 10), darkMat, 0, h * 0.25, d * 0.2);
      return group;
    }
    // Moving head style: base + yoke + head
    add(new THREE.CylinderGeometry(headR * 0.9, headR * 1.05, h * 0.22, 12), darkMat, 0, -h / 2 + h * 0.11, 0);
    // Yoke arms
    add(new THREE.BoxGeometry(0.04, h * 0.55, 0.04), darkMat, -headR * 0.85, 0, 0);
    add(new THREE.BoxGeometry(0.04, h * 0.55, 0.04), darkMat, headR * 0.85, 0, 0);
    // Head
    add(new THREE.SphereGeometry(headR * 0.85, 12, 10), bodyMat, 0, h * 0.15, 0);
    // Lens
    add(new THREE.CylinderGeometry(headR * 0.45, headR * 0.5, 0.06, 12), mat(0x93c5fd, 0.2, 0.8), 0, h * 0.15, headR * 0.7, Math.PI / 2, 0, 0);
    return group;
  }

  // ---------- MICROPHONE ----------
  if (obj.type === 'microphone') {
    if (name.includes('stand')) {
      const standMat = mat(0x6b7280, 0.4, 0.6);
      add(new THREE.CylinderGeometry(0.015, 0.02, h * 0.85, 8), standMat, 0, 0, 0);
      add(new THREE.CylinderGeometry(0.12, 0.14, 0.03, 12), standMat, 0, -h / 2 + 0.02, 0);
      if (name.includes('boom')) {
        add(new THREE.CylinderGeometry(0.01, 0.01, w * 0.7, 6), standMat, w * 0.25, h * 0.3, 0, 0, 0, Math.PI / 2);
      }
      return group;
    }
    // Mic body
    const micMat = mat(baseColor, 0.3, 0.5);
    add(new THREE.CylinderGeometry(w * 0.35, w * 0.4, h * 0.7, 10), micMat, 0, -h * 0.1, 0);
    add(new THREE.SphereGeometry(w * 0.45, 10, 8), mat(0x374151, 0.6, 0.2), 0, h * 0.3, 0);
    return group;
  }

  // ---------- DRUM KIT / INSTRUMENTS ----------
  if (obj.type === 'instrument') {
    if (name.includes('drum') || w > 1.5) {
      const shell = mat(0x78716c, 0.55, 0.15);
      const head = mat(0xe7e5e4, 0.7, 0.05);
      // Bass drum
      add(new THREE.CylinderGeometry(0.35, 0.35, 0.55, 16), shell, 0, -h * 0.15, -d * 0.15, 0, 0, Math.PI / 2);
      add(new THREE.CylinderGeometry(0.34, 0.34, 0.02, 16), head, 0.28, -h * 0.15, -d * 0.15, 0, 0, Math.PI / 2);
      // Snare
      add(new THREE.CylinderGeometry(0.2, 0.2, 0.18, 12), shell, -0.35, 0.15, 0.25);
      // Toms
      add(new THREE.CylinderGeometry(0.16, 0.16, 0.2, 10), shell, 0.25, 0.25, 0.15);
      add(new THREE.CylinderGeometry(0.18, 0.18, 0.22, 10), shell, 0.45, 0.2, -0.05);
      // Floor tom
      add(new THREE.CylinderGeometry(0.22, 0.22, 0.4, 12), shell, -0.5, -0.05, 0.45);
      // Cymbal suggestion
      add(new THREE.CylinderGeometry(0.28, 0.28, 0.02, 16), mat(0xfbbf24, 0.3, 0.7), 0.6, 0.55, 0.2);
      return group;
    }
    // Amp / keys generic
    add(new THREE.BoxGeometry(w, h * 0.85, d), mat(baseColor, 0.5, 0.2));
    return group;
  }

  // ---------- STAGEBOX ----------
  if (obj.type === 'stagebox') {
    const bodyMat = mat(baseColor, 0.4, 0.35);
    add(new THREE.BoxGeometry(w, Math.min(h, 0.14), d), bodyMat);
    // Front connectors strip
    add(new THREE.BoxGeometry(w * 0.9, 0.04, 0.02), mat(0x111827, 0.7, 0.2), 0, 0, d / 2 + 0.01);
    return group;
  }

  // ---------- DEFAULT ----------
  add(new THREE.BoxGeometry(w, h, d), mat(baseColor, 0.5, 0.2));
  return group;
}

export function Stage3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { project, selectedObjectId, dispatch } = useProject();
  const [ready, setReady] = useState(false);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const meshesRef = useRef<Map<string, any>>(new Map());
  const controlsState = useRef({
    isDragging: false,
    selectedDragId: null as string | null,
    lastX: 0,
    lastY: 0,
    spherical: { theta: Math.PI / 4, phi: Math.PI / 3, radius: 15 },
    target: { x: 0, y: 0, z: 0 },
  });

  // THREE is now a static import, always available — just mark ready on mount.
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06090d);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    cameraRef.current = camera;

    // preserveDrawingBuffer is required so the canvas can be captured for
    // JPEG/PDF snapshot export — without it the WebGL buffer is cleared
    // right after each frame and toDataURL() silently returns a blank image.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // lights – stronger key + fill for professional silhouettes
    const amb = new THREE.AmbientLight(0x556677, 0.55);
    scene.add(amb);
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(6, 12, 8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xaabbcc, 0.45);
    fill.position.set(-5, 6, -4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x88aaff, 0.25);
    rim.position.set(0, 4, -10);
    scene.add(rim);

    // floor / stage
    const stageGeo = new THREE.PlaneGeometry(project.stage.widthM, project.stage.depthM);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x1a222d,
      roughness: 0.9,
      metalness: 0.1,
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.rotation.x = -Math.PI / 2;
    stageMesh.position.set(project.stage.widthM / 2, 0, project.stage.depthM / 2);
    scene.add(stageMesh);

    // grid helper
    const grid = new THREE.GridHelper(
      Math.max(project.stage.widthM, project.stage.depthM) * 1.5,
      Math.ceil(Math.max(project.stage.widthM, project.stage.depthM) * 2),
      0x2a3544,
      0x1a222d
    );
    grid.position.set(project.stage.widthM / 2, 0.01, project.stage.depthM / 2);
    scene.add(grid);

    // initial camera
    updateCamera();

    let animId: number;
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
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [ready]);

  // Helper: dispose a mesh or group recursively
  const disposeObject = (obj: any) => {
    obj.traverse?.((child: any) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m: any) => m.dispose());
        else child.material.dispose();
      }
    });
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
      else obj.material.dispose();
    }
  };

  // Sync objects
  useEffect(() => {
    if (!ready || !sceneRef.current) return;
    const scene = sceneRef.current;
    const existing = meshesRef.current;

    // remove deleted
    for (const [id, mesh] of existing) {
      if (!project.objects.find(o => o.id === id)) {
        scene.remove(mesh);
        disposeObject(mesh);
        existing.delete(id);
      }
    }

    for (const obj of project.objects) {
      let mesh = existing.get(obj.id);
      if (!mesh) {
        mesh = createObjectMesh(THREE, obj);
        scene.add(mesh);
        existing.set(obj.id, mesh);
      }
      const h = obj.height || 0.3;
      mesh.position.set(
        obj.x + obj.width / 2,
        h / 2 + (obj.z || 0),
        obj.y + obj.depth / 2
      );
      mesh.rotation.y = (obj.rotation * Math.PI) / 180;

      // highlight selected – walk group children
      const emissive = selectedObjectId === obj.id ? 0x224466 : 0x000000;
      mesh.traverse?.((child: any) => {
        if (child.material && child.material.emissive) {
          child.material.emissive.setHex(emissive);
        }
      });
      if (mesh.material && mesh.material.emissive) {
        mesh.material.emissive.setHex(emissive);
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

  const pickObject = (clientX: number, clientY: number) => {
    const el = containerRef.current;
    const cam = cameraRef.current;
    if (!el || !cam) return null;
    const rect = el.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, cam);
    const roots = Array.from(meshesRef.current.values());
    const hits = ray.intersectObjects(roots, true);
    if (!hits.length) return null;
    const hitObj = hits[0].object;
    for (const [id, root] of meshesRef.current) {
      if (root === hitObj) return id;
      let found = false;
      root.traverse?.((c: any) => {
        if (c === hitObj) found = true;
      });
      if (found) return id;
    }
    return null;
  };

  // Touch / pointer controls: one finger rotate, two finger pan+zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let lastDist = 0;

    const onDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      controlsState.current.isDragging = true;
      controlsState.current.lastX = e.clientX;
      controlsState.current.lastY = e.clientY;
      if (pointers.size === 1) {
        const id = pickObject(e.clientX, e.clientY);
        controlsState.current.selectedDragId = id;
        dispatch({ type: 'SELECT_OBJECT', payload: id });
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 1) {
        const dx = e.clientX - controlsState.current.lastX;
        const dy = e.clientY - controlsState.current.lastY;
        const dragId = controlsState.current.selectedDragId;
        const dragObj = dragId ? project.objects.find(o=>o.id===dragId) : null;
        if (dragObj && !dragObj.locked && Math.abs(dx)+Math.abs(dy)>2) {
          const scale = controlsState.current.spherical.radius / Math.max(el.clientWidth, 1) * 2.2;
          const snap=(v:number)=>project.snapEnabled?Math.round(v/project.gridSize)*project.gridSize:v;
          dispatch({type:'UPDATE_OBJECT',payload:{id:dragObj.id,changes:{x:Math.max(0,snap(dragObj.x+dx*scale)),y:Math.max(0,snap(dragObj.y+dy*scale))}}});
          controlsState.current.lastX=e.clientX; controlsState.current.lastY=e.clientY;
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

    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) lastDist = 0;
      if (pointers.size === 0) { controlsState.current.isDragging = false; controlsState.current.selectedDragId = null; }
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [ready]);

  // simple selection via raycast on click (single pointer)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !ready) return;

    const onClick = (e: PointerEvent) => {
      if (!cameraRef.current || !sceneRef.current || !rendererRef.current) return;
      const rect = el.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const id = pickObject(e.clientX, e.clientY);
      dispatch({ type: 'SELECT_OBJECT', payload: id });
    };

    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [ready, dispatch]);

  return (
    <div className="stage-viewport">
      <div className="toolbar">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 8px' }}>
          1 finger: rotate · 2 fingers: zoom
        </span>
        <button
          onClick={() => {
            controlsState.current.spherical = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 15 };
            controlsState.current.target = {
              x: project.stage.widthM / 2,
              y: 0,
              z: project.stage.depthM / 2,
            };
            updateCamera();
          }}
        >
          Reset View
        </button>
        <button
          onClick={() => {
            const renderer = rendererRef.current;
            const scene = sceneRef.current;
            const camera = cameraRef.current;
            if (!renderer || !scene || !camera) return;
            renderer.render(scene, camera); // force a fresh frame into the buffer before capture
            exportCanvasAsJpeg(renderer.domElement as HTMLCanvasElement, 'stage_3d.jpg');
          }}
          title="Export 3D view as JPEG"
        >
          JPEG
        </button>
        <button
          onClick={() => {
            const renderer = rendererRef.current;
            const scene = sceneRef.current;
            const camera = cameraRef.current;
            if (!renderer || !scene || !camera) return;
            renderer.render(scene, camera);
            exportCanvasAsPdf(renderer.domElement as HTMLCanvasElement, 'stage_3d.pdf');
          }}
          title="Export 3D view as PDF"
        >
          PDF
        </button>
      </div>
      <div ref={containerRef} className="three-container" style={{ flex: 1, touchAction: 'none' }} />
      {!ready && (
        <div className="empty-state" style={{ position: 'absolute', inset: 0 }}>
          Loading 3D engine…
        </div>
      )}
    </div>
  );
}
