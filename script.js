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
// BORRAR REGISTROS
// ======================
const deleteBtn = document.getElementById('deleteAllBtn');
deleteBtn.style.display = enableDeleteButton ? 'inline-block' : 'none';
deleteBtn.onclick = () => {
  if(!enableDeleteButton) return;
  if(confirm('¿Borrar todos los registros guardados?')){
    localStorage.removeItem(storageKey);
    records=[];
    renderTable();
  }
}

// ======================
// MANEJO DE FIRMAS
// ======================
// MANEJO DE FIRMAS (modal)
// ======================
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentSignatureTarget = null; // 'esp' o 'cus'

// Abrir modal para firma
function openSignature(target) {
    currentSignatureTarget = target;
    modal.style.display = 'flex';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Botones de abrir modal
document.getElementById('openSignatureEsp').addEventListener('click', () => openSignature('esp'));
document.getElementById('openSignatureCus').addEventListener('click', () => openSignature('cus'));

// Cerrar y limpiar modal
document.getElementById('closeSignature').addEventListener('click', () => modal.style.display = 'none');
document.getElementById('clearSignature').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// Guardar firma en el canvas del formulario
document.getElementById('saveSignature').addEventListener('click', () => {
    const dataURL = canvas.toDataURL();
    let preview;
    if (currentSignatureTarget === 'esp') preview = document.getElementById('signaturePreviewEsp');
    else if (currentSignatureTarget === 'cus') preview = document.getElementById('signaturePreviewCus');

    if (preview) {
        const pctx = preview.getContext('2d');
        const img = new Image();
        img.onload = () => {
            pctx.clearRect(0, 0, preview.width, preview.height);
            pctx.drawImage(img, 0, 0, preview.width, preview.height);
        };
        img.src = dataURL;
    }

    modal.style.display = 'none';
    currentSignatureTarget = null;
});

// Dibujo dentro del modal
canvas.addEventListener('mousedown', e => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);
canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

// Para dispositivos táctiles
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!drawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
});
canvas.addEventListener('touchend', () => drawing = false);
canvas.addEventListener('touchcancel', () => drawing = false);

// ======================
/*const modal = document.getElementById('signatureModal');
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
  let preview = currentSignatureTarget==='esp' ? document.getElementById('signaturePreviewEsp') : document.getElementById('signaturePreviewCus');
  if(preview){
    const pctx = preview.getContext('2d');
    const img = new Image();
    img.onload=()=>{pctx.clearRect(0,0,300,150); pctx.drawImage(img,0,0,300,150)};
    img.src=dataURL;
  }
  modal.style.display='none';
});
*/
// DIBUJO EN CANVAS
canvas.addEventListener('mousedown',e=>{drawing=true; ctx.beginPath(); ctx.moveTo(e.offsetX,e.offsetY)});
canvas.addEventListener('mouseup',()=>drawing=false);
canvas.addEventListener('mouseout',()=>drawing=false);
canvas.addEventListener('mousemove',e=>{if(!drawing) return; ctx.lineWidth=2; ctx.lineCap='round'; ctx.strokeStyle='#000'; ctx.lineTo(e.offsetX,e.offsetY); ctx.stroke()});
