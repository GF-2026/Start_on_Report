// Datos y columnas
let records = JSON.parse(localStorage.getItem('records')||'[]');
const columns = [
  'report','datetime','company','engineer','phone','city','ubication',
  'description','brand','model','serial','controlnum','status',
  'temperature','humidity','specs_available','voltage_plate','manuals',
  'refrigerant','shock_free','supplies_installed','static_ls','static_hs',
  'resistance','t1_t2','t1_t3','t2_t3','to_ground','notes','signature'
];

const sigPreview = document.getElementById('signaturePreview');
let signatureData='';

// Funciones auxiliares
const get=id=>document.getElementById(id).value;
const chk=id=>document.getElementById(id).checked?'YES':'NO';

function getFormData(){
  return {
    report:get('report'), datetime:get('datetime'), company:get('company'),
    engineer:get('engineer'), phone:get('phone'), city:get('city'),
    ubication:get('ubication'), description:get('description'), brand:get('brand'),
    model:get('model'), serial:get('serial'), controlnum:get('controlnum'),
    status:get('status'), temperature:get('temperature'), humidity:get('humidity'),
    specs_available:chk('specs_available'), voltage_plate:chk('voltage_plate'),
    manuals:chk('manuals'), refrigerant:chk('refrigerant'), shock_free:chk('shock_free'),
    supplies_installed:chk('supplies_installed'), static_ls:get('static_ls'),
    static_hs:get('static_hs'), resistance:get('resistance'),
    t1_t2:get('t1_t2'), t1_t3:get('t1_t3'), t2_t3:get('t2_t3'), to_ground:get('to_ground'),
    notes:get('notes'), signature:signatureData
  };
}

// Guardar registro
function addRecord(){
  const data=getFormData();
  if(!data.report||!data.datetime){alert('Completa los campos obligatorios.');return;}
  records.push(data);
  localStorage.setItem('records',JSON.stringify(records));
  renderTable();
  alert('Registro guardado.');
}

// Limpiar formulario
function clearForm(){
  document.getElementById('reportForm').reset();
  sigPreview.getContext('2d').clearRect(0,0,sigPreview.width,sigPreview.height);
  signatureData='';
}

// Borrar todos
function deleteAllRecords(){
  if(confirm('¿Eliminar todos los registros?')){
    localStorage.removeItem('records'); records=[]; renderTable();
  }
}

// Render tabla
function renderTable(){
  const head=document.getElementById('tableHead');
  const body=document.getElementById('tableBody');
  head.innerHTML=''; body.innerHTML='';
  columns.forEach(c=>{const th=document.createElement('th');th.textContent=c.replace(/_/g,' ');head.appendChild(th);});
  records.forEach(r=>{
    const tr=document.createElement('tr');
    columns.forEach(c=>{
      const td=document.createElement('td');
      if(c==='signature' && r[c]){
        const img=document.createElement('img'); img.src=r[c]; img.width=80; td.appendChild(img);
      } else td.textContent=r[c]||'';
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}

// Export CSV
function exportCSV(){
  if(records.length===0){alert('No hay registros'); return;}
  const rows=[columns.join(',')];
  records.forEach(r=>{
    const vals=columns.map(c=>{const v=String(r[c]||'').replace(/"/g,'""'); return v.includes(',')?`"${v}"`:v;});
    rows.push(vals.join(','));
  });
  const blob=new Blob([rows.join('\n')],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='reportes.csv'; a.click();
}

// Export XLSX con firma incrustada
function exportXLSX(){
  if(records.length===0){alert('No hay registros'); return;}
  const wb=XLSX.utils.book_new();
  const ws_data=[columns];
  const ws=XLSX.utils.aoa_to_sheet(ws_data);

  records.forEach((r,rowIndex)=>{
    columns.forEach((c,colIndex)=>{
      const cell=XLSX.utils.encode_cell({r:rowIndex+1,c:colIndex});
      if(c==='signature' && r[c]){
        // Insertar imagen en celda usando drawing
        XLSX.utils.sheet_add_aoa(ws,[[{t:'s',v:''}]],{origin:{r:rowIndex+1,c:colIndex}});
        if(!ws['!images']) ws['!images']=[];
        ws['!images'].push({
          name:`sig${rowIndex}`, data:r[c].split(',')[1], type:'png',
          position:{sheet:'Sheet1', type:'twoCellAnchor', from:{col:colIndex,row:rowIndex+1}, to:{col:colIndex+1,row:rowIndex+2}}
        });
      } else {
        ws[cell]={t:'s',v:r[c]||''};
      }
    });
  });

  XLSX.utils.book_append_sheet(wb,ws,'Reportes');
  XLSX.writeFile(wb,'reportes.xlsx');
}

// Firma manuscrita
const modal=document.getElementById('signatureModal');
const canvas=document.getElementById('signatureCanvas');
const ctx=canvas.getContext('2d'); let drawing=false;

function pos(e){const r=canvas.getBoundingClientRect(); return e.touches?[e.touches[0].clientX-r.left,e.touches[0].clientY-r.top]:[e.clientX-r.left,e.clientY-r.top];}
canvas.addEventListener('mousedown',e=>{drawing=true;ctx.beginPath();ctx.moveTo(...pos(e));});
canvas.addEventListener('mousemove',e=>{if(!drawing)return;ctx.lineWidth=2;ctx.lineCap='round';ctx.lineTo(...pos(e));ctx.stroke();});
canvas.addEventListener('mouseup',()=>drawing=false); canvas.addEventListener('mouseout',()=>drawing=false);
canvas.addEventListener('touchstart',e=>{drawing=true;ctx.beginPath();ctx.moveTo(...pos(e));});
canvas.addEventListener('touchmove',e=>{if(!drawing)return;e.preventDefault();ctx.lineWidth=2;ctx.lineCap='round';ctx.lineTo(...pos(e));ctx.stroke();});
canvas.addEventListener('touchend',()=>drawing=false);

document.getElementById('openSignature').onclick=()=>modal.style.display='flex';
document.getElementById('closeSignature').onclick=()=>modal.style.display='none';
document.getElementById('clearSignature').onclick=()=>ctx.clearRect(0,0,canvas.width,canvas.height);
document.getElementById('saveSignature').onclick=()=>{
  signatureData=canvas.toDataURL('image/png');
  const sigCtx=sigPreview.getContext('2d');
  sigCtx.clearRect(0,0,sigPreview.width,sigPreview.height);
  const img=new Image(); img.onload=()=>sigCtx.drawImage(img,0,0,sigPreview.width,sigPreview.height); img.src=signatureData;
  modal.style.display='none';
};

// Botones
document.getElementById('saveBtn').onclick=addRecord;
document.getElementById('clearBtn').onclick=clearForm;
document.getElementById('deleteAllBtn').onclick=deleteAllRecords;
document.getElementById('downloadCsvBtn').onclick=exportCSV;
document.getElementById('exportBtn').onclick=exportXLSX;

// Inicialización
window.onload=()=>{
  const dt=new Date();
  const tz=dt.getTimezoneOffset()*60000;
  document.getElementById('datetime').value=new Date(dt-tz
