import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useProject } from '../store/ProjectContext';
import type { StageObject } from '../types';
import { exportCanvasAsJpeg } from '../utils/export';

const SCALE = 40; // pixels per meter base

export function Stage2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { project, selectedObjectId, dispatch, selectedObject } = useProject();
  const [drag, setDrag] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [zoom, setZoom] = useState(1);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastPinch = useRef<number | null>(null);

  const toScreen = useCallback((mx: number, my: number) => {
    return {
      x: pan.x + mx * SCALE * zoom,
      y: pan.y + my * SCALE * zoom,
    };
  }, [pan, zoom]);

  const toWorld = useCallback((sx: number, sy: number) => {
    return {
      x: (sx - pan.x) / (SCALE * zoom),
      y: (sy - pan.y) / (SCALE * zoom),
    };
  }, [pan, zoom]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // background
    ctx.fillStyle = '#06090d';
    ctx.fillRect(0, 0, w, h);

    // grid
    if (project.gridSize > 0) {
      ctx.strokeStyle = '#1a222d';
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

    // stage boundary
    const stageW = project.stage.widthM * SCALE * zoom;
    const stageD = project.stage.depthM * SCALE * zoom;
    const origin = toScreen(0, 0);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(origin.x, origin.y, stageW, stageD);
    ctx.fillStyle = 'rgba(59,130,246,0.05)';
    ctx.fillRect(origin.x, origin.y, stageW, stageD);

    // labels
    ctx.fillStyle = '#8b9bb0';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`${project.stage.widthM}m`, origin.x + stageW / 2 - 10, origin.y - 6);
    ctx.fillText(`${project.stage.depthM}m`, origin.x - 28, origin.y + stageD / 2);

    // objects
    for (const obj of project.objects) {
      const pos = toScreen(obj.x, obj.y);
      const ow = obj.width * SCALE * zoom;
      const od = obj.depth * SCALE * zoom;
      ctx.save();
      ctx.translate(pos.x + ow / 2, pos.y + od / 2);
      ctx.rotate((obj.rotation * Math.PI) / 180);
      ctx.fillStyle = obj.color || '#3b82f6';
      ctx.globalAlpha = selectedObjectId === obj.id ? 1 : 0.85;
      ctx.fillRect(-ow / 2, -od / 2, ow, od);
      if (selectedObjectId === obj.id) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-ow / 2 - 2, -od / 2 - 2, ow + 4, od + 4);
      }
      ctx.globalAlpha = 1;
      // label
      if (zoom > 0.6) {
        ctx.fillStyle = '#fff';
        ctx.font = `${Math.max(9, 10 * zoom)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(obj.name.slice(0, 12), 0, 4);
      }
      ctx.restore();
    }
  }, [project, selectedObjectId, pan, zoom, toScreen]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  const snap = (v: number) => {
    if (!project.snapEnabled) return v;
    const g = project.gridSize;
    return Math.round(v / g) * g;
  };

  const hitTest = (wx: number, wy: number): StageObject | null => {
    // reverse order for top-most
    for (let i = project.objects.length - 1; i >= 0; i--) {
      const o = project.objects[i];
      if (wx >= o.x && wx <= o.x + o.width && wy >= o.y && wy <= o.y + o.depth) {
        return o;
      }
    }
    return null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
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
        dispatch({ type: 'SELECT_OBJECT', payload: hit.id });
        setDrag({ id: hit.id, offsetX: world.x - hit.x, offsetY: world.y - hit.y });
      } else {
        dispatch({ type: 'SELECT_OBJECT', payload: null });
        setDrag(null);
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prev = pointers.current.get(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      // pinch zoom + pan
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (lastPinch.current !== null) {
        const delta = dist / lastPinch.current;
        setZoom(z => Math.min(4, Math.max(0.3, z * delta)));
      }
      lastPinch.current = dist;
      // simple pan with average movement
      if (prev) {
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        setPan(p => ({ x: p.x + dx / 2, y: p.y + dy / 2 }));
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
        type: 'UPDATE_OBJECT',
        payload: { id: drag.id, changes: { x: Math.max(0, nx), y: Math.max(0, ny) } },
      });
    } else if (!drag && pointers.current.size === 1 && prev) {
      // pan
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) lastPinch.current = null;
    if (pointers.current.size === 0) setDrag(null);
  };

  const rotateSelected = (deg: number) => {
    if (!selectedObject) return;
    dispatch({
      type: 'UPDATE_OBJECT',
      payload: { id: selectedObject.id, changes: { rotation: (selectedObject.rotation + deg) % 360 } },
    });
  };

  return (
    <div className="stage-viewport">
      <div className="toolbar">
        <button onClick={() => setZoom(z => Math.min(4, z * 1.2))}>＋</button>
        <button onClick={() => setZoom(z => Math.max(0.3, z / 1.2))}>－</button>
        <button onClick={() => { setPan({ x: 40, y: 40 }); setZoom(1); }}>Reset</button>
        <button
          className={project.snapEnabled ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_GRID', payload: { snapEnabled: !project.snapEnabled } })}
        >
          Snap
        </button>
        <button onClick={() => rotateSelected(15)} disabled={!selectedObject}>↻ 15°</button>
        <button onClick={() => rotateSelected(-15)} disabled={!selectedObject}>↺ 15°</button>
        <button
          onClick={() => selectedObjectId && dispatch({ type: 'DUPLICATE_OBJECT', payload: selectedObjectId })}
          disabled={!selectedObjectId}
        >
          Dup
        </button>
        <button
          onClick={() => selectedObjectId && dispatch({ type: 'DELETE_OBJECT', payload: selectedObjectId })}
          disabled={!selectedObjectId}
          style={{ color: 'var(--danger)' }}
        >
          Del
        </button>
        <button
          onClick={() => {
            const c = canvasRef.current;
            if (c) exportCanvasAsJpeg(c, 'stage_plot.jpg');
          }}
          title="Export stage as JPEG"
        >
          JPEG
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="stage-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
