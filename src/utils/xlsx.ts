import type { Project } from '../types';

// Minimal dependency-free XLSX writer. Uses uncompressed ZIP entries, valid for Excel/LibreOffice.
const enc = new TextEncoder();
const u16 = (n:number) => [n & 255, (n >>> 8) & 255];
const u32 = (n:number) => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];

function crc32(data: Uint8Array) {
  let c = 0xffffffff;
  for (const b of data) { c ^= b; for (let k=0;k<8;k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
  return (c ^ 0xffffffff) >>> 0;
}
function xml(s:string) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;'); }
function sheet(rows:string[][]) {
  const body = rows.map((r,ri)=>`<row r="${ri+1}">${r.map((v,ci)=>`<c r="${String.fromCharCode(65+Math.min(ci,25))}${ri+1}" t="inlineStr"><is><t>${xml(String(v ?? ''))}</t></is></c>`).join('')}</row>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}
function zip(entries:{name:string,data:Uint8Array}[]) {
  const chunks:Uint8Array[]=[]; const central:Uint8Array[]=[]; let offset=0;
  for (const e of entries) {
    const crc=crc32(e.data), name=enc.encode(e.name); const head=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(e.data.length),...u32(e.data.length),...u16(name.length),...u16(0),...name]);
    chunks.push(head,e.data);
    const ch=new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(e.data.length),...u32(e.data.length),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...name]);
    central.push(ch); offset += head.length + e.data.length;
  }
  const cdSize=central.reduce((n,c)=>n+c.length,0), cdOffset=offset;
  const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(cdSize),...u32(cdOffset),...u16(0)]);
  return new Blob([...chunks,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}

export function exportProjectXLSX(project: Project) {
  const sheets = [
    ['Project', 'Value'], ['Name',project.meta.name],['Client',project.meta.client],['Venue',project.meta.venue],['Date',project.meta.date],['Engineer',project.meta.engineer],['Stage Width (m)',project.stage.widthM.toString()],['Stage Depth (m)',project.stage.depthM.toString()],['Stage Height (m)',project.stage.heightM.toString()],
  ];
  const inputs=[['Ch','Name','Source','Mic/DI','Mic Type','48V','Notes'],...project.inputs.sort((a,b)=>a.number-b.number).map(i=>[i.number.toString(),i.name,i.source,i.micType?'Mic':'DI',i.micType||'',i.phantom?'Yes':'No',i.notes||''])];
  const outputs=[['Ch','Name','Destination','Type','Notes'],...project.outputs.sort((a,b)=>a.number-b.number).map(o=>[o.number.toString(),o.name,o.destination,o.type,o.notes||''])];
  const equipment=[['Name','Type','Qty','Width','Height','Depth','Weight kg','Power W'],...Array.from(new Map(project.objects.map(o=>[o.name,o])).values()).map(o=>[o.name,o.type,'1',o.width.toString(),o.height.toString(),o.depth.toString(),(o.weightKg||0).toString(),(o.powerWatts||0).toString()])];
  const lighting=[['Brand','Model','Type','Mode','Universe','Address','Channels','Qty'],...(project.lighting||[]).map(l=>[l.brand,l.model,l.type,l.mode,l.universe.toString(),l.address.toString(),l.channels.toString(),l.quantity.toString()])];
  const contentTypes='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet4.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet5.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>';
  const rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  const wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Project" sheetId="1" r:id="rId1"/><sheet name="Inputs" sheetId="2" r:id="rId2"/><sheet name="Outputs" sheetId="3" r:id="rId3"/><sheet name="Equipment" sheetId="4" r:id="rId4"/><sheet name="Lighting" sheetId="5" r:id="rId5"/></sheets></workbook>';
  const wbrels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet4.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet5.xml"/></Relationships>';
  const entries=[['[Content_Types].xml',contentTypes],['_rels/.rels',rels],['xl/workbook.xml',wb],['xl/_rels/workbook.xml.rels',wbrels],['xl/worksheets/sheet1.xml',sheet(sheets)],['xl/worksheets/sheet2.xml',sheet(inputs)],['xl/worksheets/sheet3.xml',sheet(outputs)],['xl/worksheets/sheet4.xml',sheet(equipment)],['xl/worksheets/sheet5.xml',sheet(lighting)]].map(([name,data])=>({name,data:enc.encode(data)}));
  const blob=zip(entries); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${project.meta.name.replace(/\s+/g,'_')||'project'}_stageforge.xlsx`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
