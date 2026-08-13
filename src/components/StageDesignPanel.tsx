import React, { useState } from 'react';
import { Stage2D } from './Stage2D';
import { Stage3D } from './Stage3D';
import { EquipmentLibrary } from './EquipmentLibrary';
import { useProject } from '../store/ProjectContext';

type DesignMode = '2d' | '3d';

export function StageDesignPanel() {
  const { selectedObject, selectedObjectId, dispatch } = useProject();
  const [mode,setMode] = useState<DesignMode>('2d');
  const [showLibrary,setShowLibrary] = useState(false);

  const update=(changes:any)=>{
    if(!selectedObjectId) return;
    dispatch({type:'UPDATE_OBJECT',payload:{id:selectedObjectId,changes}});
  };

  return <div style={{height:'100%',display:'flex',flexDirection:'column',background:'#070b10'}}>
    <div style={{display:'flex',alignItems:'center',gap:8,padding:10,borderBottom:'1px solid #202936',background:'#0d131c'}}>
      <strong style={{marginRight:10}}>Sahne Tasarımı</strong>
      <button onClick={()=>setMode('2d')} style={{background:mode==='2d'?'#2563eb':'#111827',color:'#fff'}}>▣ 2D</button>
      <button onClick={()=>setMode('3d')} style={{background:mode==='3d'?'#2563eb':'#111827',color:'#fff'}}>◈ 3D</button>
      <button onClick={()=>setShowLibrary(true)} style={{marginLeft:'auto'}}>＋ Ekipman</button>
    </div>

    <div style={{position:'relative',flex:1,minHeight:0}}>
      {mode==='2d' ? <Stage2D/> : <Stage3D/>}

      {selectedObject && <div style={{position:'absolute',right:12,top:12,width:280,maxHeight:'calc(100% - 24px)',overflowY:'auto',background:'rgba(10,15,23,.96)',border:'1px solid #334155',borderRadius:8,padding:12,zIndex:20}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}><strong>{selectedObject.name}</strong><span>{selectedObject.type}</span></div>

        <label>İsim<input value={selectedObject.name} onChange={e=>update({name:e.target.value})}/></label>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginTop:8}}>
          {(['x','y','z','rotation','width','depth','height'] as const).map(k=><label key={k}>{k.toUpperCase()}<input type="number" step="0.1" value={selectedObject[k] ?? 0} onChange={e=>update({[k]:Number(e.target.value)})}/></label>)}
        </div>

        <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid #263142'}}>
          <strong>2D Görsel</strong>
          <input value={selectedObject.image2d || ''} onChange={e=>update({image2d:e.target.value})} placeholder="https://.../equipment.png"/>
          {selectedObject.image2d && <img src={selectedObject.image2d} alt={selectedObject.name} style={{width:'100%',height:100,objectFit:'contain',background:'#020617',marginTop:7}}/>}
        </div>

        <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid #263142'}}>
          <strong>3D Model</strong>
          <input value={selectedObject.model3d || ''} onChange={e=>update({model3d:e.target.value})} placeholder="https://.../equipment.glb"/>
          <small style={{display:'block',color:'#64748b',marginTop:5}}>GLB / GLTF model yolu</small>
        </div>

        <label style={{display:'flex',gap:7,marginTop:14}}><input type="checkbox" checked={!!selectedObject.locked} onChange={e=>update({locked:e.target.checked})}/> Objeyi kilitle</label>
        <button style={{width:'100%',marginTop:12,color:'#ef4444'}} onClick={()=>dispatch({type:'DELETE_OBJECT',payload:selectedObject.id})}>🗑 Objeyi Sil</button>
      </div>}
    </div>

    {showLibrary && <div onClick={()=>setShowLibrary(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:100}}>
      <div onClick={e=>e.stopPropagation()} style={{height:'75vh',margin:'10vh auto 0',maxWidth:1000,background:'#0d131c',borderRadius:10,overflow:'auto'}}>
        <EquipmentLibrary onClose={()=>setShowLibrary(false)}/>
      </div>
    </div>}
  </div>;
}
