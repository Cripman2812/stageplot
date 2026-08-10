import React, { useRef, useEffect, useState } from 'react';
import { useProject } from '../store/ProjectContext';

declare global {
  interface Window {
    THREE: any;
  }
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

  // Load Three.js from CDN if not present
  useEffect(() => {
    if (window.THREE) {
      setReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
    return () => {
      // keep script for session
    };
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06090d);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // lights
    const amb = new THREE.AmbientLight(0x404060, 0.8);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(5, 10, 7);
    scene.add(dir);

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

  // Sync objects
  useEffect(() => {
    if (!ready || !sceneRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const scene = sceneRef.current;
    const existing = meshesRef.current;

    // remove deleted
    for (const [id, mesh] of existing) {
      if (!project.objects.find(o => o.id === id)) {
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
          color: new THREE.Color(obj.color || '#3b82f6'),
          roughness: 0.6,
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
      mesh.rotation.y = (obj.rotation * Math.PI) / 180;
      // highlight
      if (mesh.material) {
        mesh.material.emissive = new THREE.Color(selectedObjectId === obj.id ? 0x224466 : 0x000000);
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

  const pickObject = (clientX:number, clientY:number) => {
    const el=containerRef.current, cam=cameraRef.current, renderer=rendererRef.current, THREE=window.THREE;
    if(!el||!cam||!renderer||!THREE) return null;
    const rect=el.getBoundingClientRect(); const mouse=new THREE.Vector2(((clientX-rect.left)/rect.width)*2-1,-((clientY-rect.top)/rect.height)*2+1);
    const ray=new THREE.Raycaster(); ray.setFromCamera(mouse,cam);
    const hits=ray.intersectObjects(Array.from(meshesRef.current.values()));
    if(!hits.length) return null; const hit=hits[0].object;
    for(const [id,mesh] of meshesRef.current) if(mesh===hit) return id; return null;
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
    if (!el || !ready || !window.THREE) return;
    const THREE = window.THREE;

    const onClick = (e: PointerEvent) => {
      if (!cameraRef.current || !sceneRef.current || !rendererRef.current) return;
      const rect = el.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const meshes = Array.from(meshesRef.current.entries());
      const intersects = raycaster.intersectObjects(meshes.map(m => m[1]));
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        for (const [id, mesh] of meshes) {
          if (mesh === hitMesh) {
            dispatch({ type: 'SELECT_OBJECT', payload: id });
            return;
          }
        }
      } else {
        dispatch({ type: 'SELECT_OBJECT', payload: null });
      }
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
