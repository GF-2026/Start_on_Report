// ======================
// VARIABLES GLOBALES
// ======================
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null; // 'esp' o 'cus'
const enableDeleteButton = false;   // true = activo, false = desactivado
const storageKey = 'records';

// ======================
// FUNCIONES AUXILIARES
// ======================
function get(id) { return document.getElementById(id).value.trim(); }
function set(id, val) { document.getElementById(id).value = val || ''; }
function chk(id) { return document.getElementById(id).checked ? 'Sí' : 'No'; }
function setChk(id, val) { document.getElementById(id).checked = (val==='Sí'); }

// ======================
// GENERAR FOLIO AUTOMÁTICO
// ======================
function generateFolio() {
  const company = get('company') || 'SinEmpresa';
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth()+1).padStart(2,'0');
  const day = String(now.getDate()).padStart(2,'0');
  const hours = String(now.getHours()).padStart(2,'0');
  const minutes = String(now.getMinutes()).padStart(2,'0');
  return `StartReport-${company}-${year}${month}${day}-${hours}${minutes}`;
}

function updateFolioField() {
  const folioField = document.getElementById('folio');
  if(folioField) folioField.value = generateFolio();
}

// Actualizar al cargar y al cambiar empresa
window.addEventListener('load', updateFolioField);
document.getElementById('company').addEventListener('input', updateFolioField);

// ======================
// GUARDAR REGISTRO
// ======================
document.getElementById('saveBtn').addEventListener('click', () => {
  const folio = generateFolio();
  const record = {
    folio: folio,
    OT: get('OT'),
    datetime: get('datetime'),
    company: get('company'),
    engineer: get('engineer'),
    phone: get('phone'),
    city: get('city'),
    description: get('description'),
    brand: get('brand'),
    model: get('model'),
    serial: get('serial'),
    controlnum: get('controlnum'),
    status: get('status'),
    ubication: get('ubication'),
    temperature: get('temperature'),
    humidity: get('humidity'),
    marking: chk('marking'),
    voltage_plate: chk('voltage_plate'),
    shock_free: chk('shock_free'),
    pallets: chk('pallets'),
    unpack: chk('unpack'),
    supplies_installed: chk('supplies_installed'),
    specs_available: chk('specs_available'),
    refrigerant: chk('refrigerant'),
    manuals: chk('manuals'),
    // Mediciones
    static_ls: get('static_ls'),
    static_hs: get('static_hs'),
    resistance_hs: get('resistance_hs'),
    resistance_ls: get('resistance_ls'),
    resistance_circ: get('resistance_circ'),
    resistance_heat: get('resistance_heat'),
    resistance_hum: get('resistance_hum'),
    voltaje_hs: get('voltaje_hs'),
    voltaje_ls: get('voltaje_ls'),
    to_ground: get('to_ground'),
    current_hs: get('current_hs'),
    current_ls: get('current_ls'),
    current_circ: get('current_circ'),
    current_heat: get('current_heat'),
    current_hum: get('current_hum'),
    pressures_hs: get('pressures_hs'),
    pressures_ls: get('pressures_ls'),
    // Pruebas
    hum_from: get('hum_from'),
    hum_target: get('hum_target'),
    heat_test: chk('heat_test'),
    hum_low: get('hum_low'),
    hum_hig: get('hum_hig'),
    hum_test: chk('hum_test'),
    temp_hig: get('temp_hig'),
    temp_low: get('temp_low'),
    cold_test: chk('cold_test'),
    pulldown: get('pulldown'),
    // Observaciones y firmas
    notes: get('notes'),
    name_esp: get('name_esp'),
    name_cus: get('name_cus'),
    signatureEsp: document.getElementById('signaturePreviewEsp').toDataURL(),
    signatureCus: document.getElementById('signaturePreviewCus').toDataURL()
  };

  records.push(record);
  localStorage.setItem(storageKey, JSON.stringify(records));
  renderTable();
  alert('✅ Registro guardado correctamente');
});

// ======================
// LIMPIAR FORMULARIO
// ======================
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('reportForm').reset();
  document.getElementById('signaturePreviewEsp').getContext('2d').clearRect(0,0,300,150);
  document.getElementById('signaturePreviewCus').getContext('2d').clearRect(0,0,300,150);
  updateFolioField();
});

// ======================
// RENDERIZAR TABLA
// ======================
function renderTable() {
  const head = document.getElementById('tableHead');
  const body = document.getElementById('tableBody');
  body.innerHTML = '';
  const columns = ['folio','OT','datetime','company','engineer','city','description','status','temperature','humidity'];
  head.innerHTML = columns.map(c=>`<th>${c}</th>`).join('');
  records.forEach(r=>{
    const row = `<tr>${columns.map(c=>`<td>${r[c]||''}</td>`).join('')}</tr>`;
    body.insertAdjacentHTML('beforeend',row);
  });
}
renderTable();

// ======================
// EXPORTAR EXCEL
// ======================
document.getElementById('exportBtn').addEventListener('click', () => {
  if(!records.length) return alert('No hay registros para exportar.');
  const ws = XLSX.utils.json_to_sheet(records);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
  XLSX.writeFile(wb, 'Registro_de_arranques.xlsx');
});

// ======================
// BORRAR REGISTROS (controlable)
// ======================
const deleteBtn = document.getElementById('deleteAllBtn');
if(deleteBtn){
  deleteBtn.style.display = enableDeleteButton ? 'inline-block' : 'none';
  deleteBtn.onclick = () => {
    if(!enableDeleteButton) return;
    if(confirm('¿Borrar todos los registros guardados?')){
      localStorage.removeItem(storageKey);
      records=[];
      renderTable();
    }
  }
}

// ======================
// MANEJO DE FIRMAS
// ======================
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

document.getElementById('openSignatureEsp').addEventListener('click',()=>openSignature('esp'));
document.getElementById('openSignatureCus').addEventListener('click',()=>openSignature('cus'));

function openSignature(target){
  currentSignatureTarget = target;
  modal.style.display = 'flex';
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

document.getElementById('closeSignature').addEventListener('click',()=>modal.style.display='none');
document.getElementById('clearSignature').addEventListener('click',()=>ctx.clearRect(0,0,canvas.width,canvas.height));

document.getElementById('saveSignature').addEventListener('click',()=>{
  const dataURL = canvas.toDataURL();
  let preview;
  if(currentSignatureTarget==='esp') preview = document.getElementById('signaturePreviewEsp');
  else if(currentSignatureTarget==='cus') preview = document.getElementById('signaturePreviewCus');
  if(preview){
    const pctx = preview.getContext('2d');
    const img = new Image();
    img.onload=()=>{pctx.clearRect(0,0,300,150); pctx.drawImage(img,0,0,300,150)};
    img.src=dataURL;
  }
  modal.style.display='none';
});

// DIBUJO EN CANVAS
canvas.addEventListener('mousedown', e=>{drawing=true; ctx.beginPath(); ctx.moveTo(e.offsetX,e.offsetY)});
canvas.addEventListener('mouseup', ()=>drawing=false);
canvas.addEventListener('mouseout', ()=>drawing=false);
canvas.addEventListener('mousemove', e=>{if(!drawing) return; ctx.lineWidth=2; ctx.lineCap='round'; ctx.strokeStyle='#000'; ctx.lineTo(e.offsetX,e.offsetY); ctx.stroke()});

// ======================
// BOTÓN MAIL PRECONFIGURADO
// ======================
function sendMail() {
  const mailto = 'mailto:correo@ejemplo.com?subject=Reporte de arranque&body=Adjunto el reporte generado';
  window.location.href = mailto;
}
