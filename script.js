// ----- REGISTROS Y FIRMA -----
let records = JSON.parse(localStorage.getItem('records')||'[]');
let signatureData='';

// ----- FUNCIONES AUXILIARES -----
const get=id=>document.getElementById(id).value;
const chk=id=>document.getElementById(id).checked?'YES':'NO';

// ----- GENERAR FOLIO ÚNICO -----
function generateFolio(){
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth()+1).padStart(2,'0');
  const day = String(now.getDate()).padStart(2,'0');
  const hour = String(now.getHours()).padStart(2,'0');
  const minute = String(now.getMinutes()).padStart(2,'0');
  const second = String(now.getSeconds()).padStart(2,'0');
  return `FOL-${year}${month}${day}-${hour}${minute}${second}`;
}

// ----- OBTENER DATOS DEL FORMULARIO -----
function getFormData(){
  const folio = generateFolio();
  return {
    folio: folio,
    report:get('report'), datetime:get('datetime'), company:get('company'),
    engineer:get('engineer'), phone:get('phone'), city:get('city'),
    ubication:get('ubication'), description:get('description'), brand:get('brand'),
    model:get('model'), serial:get('serial'), controlnum:get('controlnum'),
    status:get('status'), temperature:get('temperature'), humidity:get('humidity'),
    specs_available:chk('specs_available'), voltage_plate:chk('voltage_plate'),
    manuals:chk('manuals'), refrigerant:chk('refrigerant'), shock_free:chk('shock_free'),
    supplies_installed:chk('supplies_installed'), static_ls:get('static_ls'),
    static_hs:get('static_hs'), resistance_hs:get('resistance_hs'), resistance_ls:get('resistance_ls'),
    t1_t2:get('t1_t2'), t1_t3:get('t1_t3'), t2_t3:get('t2_t3'), to_ground:get('to_ground'),
    notes:get('notes'), signature:signatureData
  };
}

// ----- AÑADIR REGISTRO -----
function addRecord(){
  const data=getFormData();
  if(!data.report||!data.datetime){alert('Completa los campos obligatorios.');return;}
  records.push(data);
  localStorage.setItem('records',JSON.stringify(records));
  renderTable();
  alert(`Registro guardado. Folio: ${data.folio}`);
}

// ----- LIMPIAR FORMULARIO -----
function clearForm(){
  document.getElementById('reportForm').reset();
  const preview=document.getElementById('signaturePreview');
  preview.getContext('2d').clearRect(0,0,preview.width,preview.height);
  signatureData='';
}

// ----- BORRAR TODOS LOS REGISTROS -----
function deleteAllRecords(){
  if(confirm('¿Eliminar todos los registros?')){
    localStorage.removeItem('records'); records=[]; renderTable();
  }
}

// ----- COLUMNAS PARA TABLA Y EXCEL -----
const columns = [
  'folio','report','datetime','company','engineer','phone','city','ubication',
  'description','brand','model','serial','controlnum','status',
  'temperature','humidity','specs_available','voltage_plate','manuals',
  'refrigerant','shock_free','supplies_installed','static_ls','static_hs',
  'resistance','t1_t2','t1_t3','t2_t3','to_ground','notes','signature'
];

// ----- RENDERIZAR TABLA -----
function renderTable(){
  const head=document.getElementById('tableHead');
  const body=document.getElementById('tableBody');
  head.innerHTML=''; body.innerHTML='';
  columns.forEach(c=>{
    const th=document.createElement('th'); th.textContent=c.replace(/_/g,' '); head.appendChild(th);
  });
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

// ----- EXPORTAR CSV -----
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

// ----- EXPORTAR XLSX -----
function exportXLSX(){
  if(records.length===0){alert('No hay registros'); return;}
  const wb=XLSX.utils.book_new();
  const ws_data=[columns];
  records.forEach(r=>{
    const row=columns.map(c=>r[c]||'');
    ws_data.push(row);
  });
  const ws=XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb,ws,'Reportes');
  XLSX.writeFile(wb,'reportes.xlsx');
}

// ----- FIRMA -----
const modal=document.getElementById('signatureModal');
const canvas=document.getElementById('signatureCanvas');
const ctx=canvas.getContext('2d');
let drawing=false;

function getPos(e){
  const rect=canvas.getBoundingClientRect();
  if(e.touches) return [e.touches[0].clientX-rect.left,e.touches[0].clientY-rect.top];
  return [e.clientX-rect.left,e.clientY-rect.top];
}

canvas.addEventListener('mousedown',e=>{drawing=true;ctx.beginPath();ctx.moveTo(...getPos(e));});
canvas.addEventListener('mousemove',e=>{if(!drawing)return;ctx.lineWidth=2;ctx.lineCap='round';ctx.lineTo(...getPos(e));ctx.stroke();});
canvas.addEventListener('mouseup',()=>drawing=false);
canvas.addEventListener('mouseout',()=>drawing=false);
canvas.addEventListener('touchstart',e=>{drawing=true;ctx.beginPath();ctx.moveTo(...getPos(e));});
canvas.addEventListener('touchmove',e=>{if(!drawing)return;e.preventDefault();ctx.lineWidth=2;ctx.lineCap='round';ctx.lineTo(...getPos(e));ctx.stroke();});
canvas.addEventListener('touchend',()=>drawing=false);

document.getElementById('openSignature').onclick=()=>modal.style.display='flex';
document.getElementById('closeSignature').onclick=()=>modal.style.display='none';
document.getElementById('clearSignature').onclick=()=>ctx.clearRect(0,0,canvas.width,canvas.height);
document.getElementById('saveSignature').onclick=()=>{
  signatureData=canvas.toDataURL('image/png');
  const sigPreview=document.getElementById('signaturePreview');
  const previewCtx=sigPreview.getContext('2d');
  previewCtx.clearRect(0,0,sigPreview.width,sigPreview.height);
  const img=new Image();
  img.onload=()=>previewCtx.drawImage(img,0,0,sigPreview.width,sigPreview.height);
  img.src=signatureData;
  modal.style.display='none';
};

// ----- BOTONES -----
document.getElementById('saveBtn').onclick=addRecord;
document.getElementById('clearBtn').onclick=clearForm;
document.getElementById('exportBtn').onclick=exportXLSX;
document.getElementById('downloadCsvBtn').onclick=exportCSV;
document.getElementById('deleteAllBtn').onclick=deleteAllRecords;

// ----- INICIALIZACIÓN -----
window.onload=()=>{
  const dt=new Date();
  const tz=dt.getTimezoneOffset()*60000;
  document.getElementById('datetime').value=(new Date(dt-tz)).toISOString().slice(0,16);
  renderTable();
};
