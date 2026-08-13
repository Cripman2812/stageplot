import React, { useMemo, useState } from 'react';
import { useProject } from '../store/ProjectContext';
import type { InputChannel, OutputChannel } from '../types';

type Tab = 'inputs' | 'outputs' | 'monitors' | 'patch' | 'lighting';

export function ChannelManagementPanel() {
  const { project, dispatch } = useProject();
  const [tab, setTab] = useState<Tab>('inputs');
  const [search, setSearch] = useState('');

  const inputs = useMemo(
    () => project.inputs.filter(ch =>
      `${ch.number} ${ch.name} ${ch.source} ${ch.micType || ''}`.toLowerCase().includes(search.toLowerCase())
    ).slice().sort((a,b) => a.number-b.number),
    [project.inputs, search]
  );

  const outputs = useMemo(
    () => project.outputs.filter(ch =>
      `${ch.number} ${ch.name} ${ch.destination} ${ch.type}`.toLowerCase().includes(search.toLowerCase())
    ).slice().sort((a,b) => a.number-b.number),
    [project.outputs, search]
  );

  const addInput = () => {
    const number = project.inputs.length ? Math.max(...project.inputs.map(x=>x.number))+1 : 1;
    const channel: InputChannel = {
      id: crypto.randomUUID(), number, name:`Input ${number}`, source:'',
      micType:'', phantom:false, notes:''
    };
    dispatch({ type:'ADD_INPUT', payload:channel });
  };

  const addOutput = () => {
    const number = project.outputs.length ? Math.max(...project.outputs.map(x=>x.number))+1 : 1;
    const channel: OutputChannel = {
      id: crypto.randomUUID(), number, name:`Output ${number}`,
      destination:'', type:'main', notes:''
    };
    dispatch({ type:'ADD_OUTPUT', payload:channel });
  };

  const input = (value:string|number, onChange:(v:any)=>void, type='text', placeholder='') => (
    <input type={type} value={value ?? ''} placeholder={placeholder}
      onChange={e=>onChange(type==='number' ? Number(e.target.value) : e.target.value)}
      style={{width:'100%',boxSizing:'border-box',background:'#0b1220',color:'#fff',border:'1px solid #303b4b',borderRadius:5,padding:'7px'}} />
  );

  return <div style={{height:'100%',display:'flex',flexDirection:'column',background:'#080c12',color:'#e5e7eb'}}>
    <div style={{padding:16,borderBottom:'1px solid #202936',display:'flex',alignItems:'center',gap:12}}>
      <div><h2 style={{margin:0}}>Kanal Yönetimi</h2><small style={{color:'#7f8ea3'}}>I/O • Monitor • Patch • Lighting</small></div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Kanal ara..."
        style={{marginLeft:'auto',width:220,background:'#111827',color:'#fff',border:'1px solid #303b4b',borderRadius:6,padding:'9px 12px'}} />
    </div>
    <div style={{display:'flex',gap:5,padding:10,borderBottom:'1px solid #202936'}}>
      {([['inputs','INPUT'],['outputs','OUTPUT'],['monitors','MONITOR'],['patch','PATCH'],['lighting','LIGHTING']] as const).map(([id,label])=>
        <button key={id} onClick={()=>setTab(id)} style={{padding:'9px 14px',borderRadius:6,border:'1px solid #303b4b',background:tab===id?'#2563eb':'#111827',color:'#fff'}}>{label}</button>
      )}
    </div>
    <div style={{flex:1,overflow:'auto',padding:12}}>
      {tab==='inputs' && <>
        <button onClick={addInput} style={{marginBottom:10}}>＋ Input Ekle</button>
        {inputs.map(ch=><div key={ch.id} style={{display:'grid',gridTemplateColumns:'55px 1.2fr 1.2fr 1fr 70px 40px',gap:7,alignItems:'center',padding:8,marginBottom:6,background:'#111827',border:'1px solid #263142',borderRadius:6}}>
          {input(ch.number,v=>dispatch({type:'UPDATE_INPUT',payload:{id:ch.id,changes:{number:v}}}),'number')}
          {input(ch.name,v=>dispatch({type:'UPDATE_INPUT',payload:{id:ch.id,changes:{name:v}}}),'text','Kanal adı')}
          {input(ch.source,v=>dispatch({type:'UPDATE_INPUT',payload:{id:ch.id,changes:{source:v}}}),'text','Kaynak / Enstrüman')}
          {input(ch.micType||'',v=>dispatch({type:'UPDATE_INPUT',payload:{id:ch.id,changes:{micType:v}}}),'text','Mikrofon')}
          <label style={{fontSize:12}}><input type="checkbox" checked={!!ch.phantom} onChange={e=>dispatch({type:'UPDATE_INPUT',payload:{id:ch.id,changes:{phantom:e.target.checked}}})}/> 48V</label>
          <button onClick={()=>dispatch({type:'DELETE_INPUT',payload:ch.id})}>🗑</button>
        </div>)}
      </>}
      {tab==='outputs' && <>
        <button onClick={addOutput} style={{marginBottom:10}}>＋ Output Ekle</button>
        {outputs.map(ch=><div key={ch.id} style={{display:'grid',gridTemplateColumns:'55px 1fr 1fr 130px 40px',gap:7,alignItems:'center',padding:8,marginBottom:6,background:'#111827',border:'1px solid #263142',borderRadius:6}}>
          {input(ch.number,v=>dispatch({type:'UPDATE_OUTPUT',payload:{id:ch.id,changes:{number:v}}}),'number')}
          {input(ch.name,v=>dispatch({type:'UPDATE_OUTPUT',payload:{id:ch.id,changes:{name:v}}}),'text','Kanal adı')}
          {input(ch.destination,v=>dispatch({type:'UPDATE_OUTPUT',payload:{id:ch.id,changes:{destination:v}}}),'text','Destination')}
          <select value={ch.type} onChange={e=>dispatch({type:'UPDATE_OUTPUT',payload:{id:ch.id,changes:{type:e.target.value as OutputChannel['type']}}})}><option value="main">Main</option><option value="monitor">Monitor</option><option value="aux">Aux</option><option value="matrix">Matrix</option><option value="iem">IEM</option></select>
          <button onClick={()=>dispatch({type:'DELETE_OUTPUT',payload:ch.id})}>🗑</button>
        </div>)}
      </>}
      {tab==='monitors' && <div>{project.monitors.map(m=><div key={m.id} style={{padding:14,marginBottom:8,background:'#111827',border:'1px solid #263142',borderRadius:7}}><strong>{m.name}</strong><div style={{color:'#94a3b8',marginTop:6}}>Tip: {m.type}</div><div>Kanallar: {m.channels.join(', ') || 'Yok'}</div></div>)}</div>}
      {tab==='patch' && <div>{project.patches.map(p=><div key={p.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr 130px 70px',gap:8,padding:10,marginBottom:6,background:'#111827',border:'1px solid #263142',borderRadius:7}}><div><small>FROM</small><div>{p.from}</div></div><div><small>TO</small><div>{p.to}</div></div><div><small>CABLE</small><div>{p.cableType}</div></div><button onClick={()=>dispatch({type:'DELETE_PATCH',payload:p.id})}>🗑</button></div>)}</div>}
      {tab==='lighting' && <div>{project.lighting.map(l=><div key={l.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr 100px 80px 50px',gap:8,padding:10,marginBottom:6,background:'#111827',border:'1px solid #263142',borderRadius:7}}>{input(l.brand,v=>dispatch({type:'UPDATE_LIGHTING',payload:{id:l.id,changes:{brand:v}}}),'text','Marka')}{input(l.model,v=>dispatch({type:'UPDATE_LIGHTING',payload:{id:l.id,changes:{model:v}}}),'text','Model')}{input(l.universe,v=>dispatch({type:'UPDATE_LIGHTING',payload:{id:l.id,changes:{universe:v}}}),'number')}{input(l.address,v=>dispatch({type:'UPDATE_LIGHTING',payload:{id:l.id,changes:{address:v}}}),'number')}<button onClick={()=>dispatch({type:'DELETE_LIGHTING',payload:l.id})}>🗑</button></div>)}</div>}
    </div>
  </div>;
}
