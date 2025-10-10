// ----- REGISTROS Y FIRMAS -----
let records = JSON.parse(localStorage.getItem('records') || '[]');
let signatureData1 = ''; // Firma especialista
let signatureData2 = ''; // Firma cliente
let currentSignatureTarget = ''; // 'esp' o 'cus'

// ----- FUNCIONES AUXILIARES -----
const get = id => document.getElementById(id).value.trim();
const chk = id => document.getElementById(id).checked ? 'YES' : 'NO';

// ----- GENERAR FOLIO ÚNICO -----
function generateFolio() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `FOL-${y}${m}${d}-${h}${min}${s}`;
}

// ----- OBTENER DATOS DEL FORMULARIO -----
function getFormData() {
  const folio = generateFolio();
  return {
    folio,
    report: get('report'),
    OT: get('OT'),
    datetime: get('datetime'),
    company: get('company'),
    engineer: get('engineer'),
    phone: get('phone'),
    city: get('city'),
    ubication: get('ubication'),
    description: get('description'),
    brand: get('brand'),
    model: get('model'),
    serial: get('serial'),
    controlnum: get('controlnum'),
    status: get('status'),
    temperature: get('temperature'),
    humidity: get('humidity'),
    specs_available: chk('specs_available'),
    voltage_plate: chk('voltage_plate'),
    manuals: chk('manuals'),
    refrigerant: chk('refrigerant'),
    shock_free: chk('shock_free'),
    supplies_installed: chk('supplies_installed'),
    static_ls: get('static_ls'),
    static_hs: get('static_hs'),
    resistance_hs: get('resistance_hs'),
    resistance_ls: get('resistance_ls'),
    voltaje_hs: get('voltaje_hs'),
    voltaje_ls: get('voltaje_ls'),
    to_ground: get('to_ground'),
    current_hs: get('current_hs'),
    current_ls: get('current_ls'),
    current_circ: get('current_circ'),
    pressures_hs: get('pressures_hs'),
    pressures_ls: get('pressures_ls'),
    
    notes: get('notes'),
    name_esp: get('name_esp'),
    name_cus: get('name_cus'),
    signature_esp: signatureData1,
    signature_cus: signatureData2
    marking: chk('marking'),
    pallets: chk('pallets'),
    unpack: get('unpack'),
    resistance_circ: get('resistance_circ'),
    resistance_heat: get('resistance_heat'),
    resistance_hum: get('resistance_hum'),
    current_heat: get('current_heat'),
    current_hum: get('current_hum'),
    hum_from: get('hum_from'),
    hum_target: get('hum_target'),
    hum_low: get('hum_low'),
    hum_hig: get('hum_hig'),
    pulldown: get('pulldown'),
    temp_hig: get('temp_hig'),
    temp_low: get('temp_low'),
    main_switch: chk('main_switch'),
switch_covers: chk('switch_covers'),
tighting: chk('tighting'),
headfan: chk('headfan'),
balance: chk('balance'),
fuses_ok: chk('fuses_ok'),
faseado: chk('faseado'),
crankcase: chk('crankcase'),
grounded: chk('grounded'),
fans_ok: chk('fans_ok'),
coils_ok: chk('coils_ok'),
armafles_ok: chk('armafles_ok'),
inyection_ok: chk('inyection_ok'),
oil_ok: chk('oil_ok'),
sights_ok: chk('sights_ok'),
acid_ok: chk('acid_ok'),
noleaks: chk('noleaks'),
hilow: chk('hilow'),
lowoil: chk('lowoil'),
rotalocks: chk('rotalocks'),
capillaries: chk('capillaries'),
frosty: chk('frosty'),
heat_test: chk('heat_test'),
hum_test: chk('hum_test'),
cold_test: chk('cold_test'),
  };
}

// ----- AGREGAR REGISTRO -----
function addRecord() {
  const data = getFormData();
  if (!data.report || !data.datetime || !data.OT) {
    alert('Completa los campos obligatorios.');
    return;
  }
  records.push(data);
  localStorage.setItem('records', JSON.stringify(records));
  renderTable();
  alert(`Registro guardado correctamente.\nFolio: ${data.folio}`);
  clearForm();
}

// ----- LIMPIAR FORMULARIO -----
function clearForm() {
  document.getElementById('reportForm').reset();
  const c1 = document.getElementById('signaturePreviewEsp').getContext('2d');
  const c2 = document.getElementById('signaturePreviewCus').getContext('2d');
  c1.clearRect(0, 0, 300, 150);
  c2.clearRect(0, 0, 300, 150);
  signatureData1 = '';
  signatureData2 = '';
}

// ----- BORRAR TODOS LOS REGISTROS -----
function deleteAllRecords() {
  if (confirm('¿Eliminar todos los registros?')) {
    localStorage.removeItem('records');
    records = [];
    renderTable();
  }
}

// ----- COLUMNAS -----
const columns = [
  'folio', 'report', 'OT', 'datetime', 'company', 'engineer', 'phone', 'city', 'ubication',
  'description', 'brand', 'model', 'serial', 'controlnum', 'status',
  'temperature', 'humidity', 'specs_available', 'voltage_plate', 'manuals',
  'refrigerant', 'shock_free', 'supplies_installed', 'static_ls', 'static_hs',
  'resistance_hs', 'resistance_ls', 'voltaje_hs', 'voltaje_ls', 'to_ground',
  'notes', 'name_esp', 'name_cus', 'signature_esp', 'signature_cus', 'current_hs',
  'current_ls', 'current_circ', 'pressures_hs', 'pressures_ls', 'marking', 'pallets',
  'unpack', 'resistance_circ', 'resistance_heat', 'resistance_hum', 'current_heat',
  'current_hum', 'hum_from', 'hum_target', 'hum_low', 'hum_hig', 'pulldown', 'temp_hig',
  'temp_low', 'main_switch', 'switch_covers', 'tighting', 'headfan', 'balance', 'fuses_ok',
  'faseado', 'crankcase', 'grounded', 'fans_ok', 'coils_ok', 'armafles_ok', 'inyection_ok',
  'oil_ok', 'sights_ok', 'acid_ok', 'noleaks', 'hilow', 'lowoil', 'rotalocks', 'capillaries',
  'frosty', 'heat_test', 'hum_test', 'cold_test'
];

// ----- RENDERIZAR TABLA -----
function renderTable() {
  const head = document.getElementById('tableHead');
  const body = document.getElementById('tableBody');
  head.innerHTML = '';
  body.innerHTML = '';

  columns.forEach(c => {
    const th = document.createElement('th');
    th.textContent = c.replace(/_/g, ' ');
    head.appendChild(th);
  });

  records.forEach(r => {
    const tr = document.createElement('tr');
    columns.forEach(c => {
      const td = document.createElement('td');
      if ((c === 'signature_esp' || c === 'signature_cus') && r[c]) {
        const img = document.createElement('img');
        img.src = r[c];
        img.width = 80;
        td.appendChild(img);
      } else {
        td.textContent = r[c] || '';
      }
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}

// ----- EXPORTAR CSV -----
function exportCSV() {
  if (records.length === 0) {
    alert('No hay registros para exportar.');
    return;
  }
  const rows = [columns.join(',')];
  records.forEach(r => {
    const vals = columns.map(c => {
      const v = String(r[c] || '').replace(/"/g, '""');
      return v.includes(',') ? `"${v}"` : v;
    });
    rows.push(vals.join(','));
  });
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'reportes.csv';
  a.click();
}

// ----- EXPORTAR XLSX -----
function exportXLSX() {
  if (records.length === 0) {
    alert('No hay registros para exportar.');
    return;
  }
  const wb = XLSX.utils.book_new();
  const ws_data = [columns];
  records.forEach(r => ws_data.push(columns.map(c => r[c] || '')));
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
  XLSX.writeFile(wb, 'reportes.xlsx');
}

// ----- FIRMA -----
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
  return [e.clientX - rect.left, e.clientY - rect.top];
}

canvas.addEventListener('mousedown', e => { drawing = true; ctx.beginPath(); ctx.moveTo(...getPos(e)); });
canvas.addEventListener('mousemove', e => { if (!drawing) return; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineTo(...getPos(e)); ctx.stroke(); });
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);
canvas.addEventListener('touchstart', e => { drawing = true; ctx.beginPath(); ctx.moveTo(...getPos(e)); });
canvas.addEventListener('touchmove', e => { if (!drawing) return; e.preventDefault(); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineTo(...getPos(e)); ctx.stroke(); });
canvas.addEventListener('touchend', () => drawing = false);

document.getElementById('openSignatureEsp').onclick = () => {
  currentSignatureTarget = 'esp';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  modal.style.display = 'flex';
};
document.getElementById('openSignatureCus').onclick = () => {
  currentSignatureTarget = 'cus';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  modal.style.display = 'flex';
};
document.getElementById('closeSignature').onclick = () => modal.style.display = 'none';
document.getElementById('clearSignature').onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

document.getElementById('saveSignature').onclick = () => {
  const dataUrl = canvas.toDataURL('image/png');
  if (currentSignatureTarget === 'esp') {
    signatureData1 = dataUrl;
    const prev = document.getElementById('signaturePreviewEsp').getContext('2d');
    const img = new Image();
    img.onload = () => { prev.clearRect(0, 0, 300, 150); prev.drawImage(img, 0, 0, 300, 150); };
    img.src = dataUrl;
  } else if (currentSignatureTarget === 'cus') {
    signatureData2 = dataUrl;
    const prev = document.getElementById('signaturePreviewCus').getContext('2d');
    const img = new Image();
    img.onload = () => { prev.clearRect(0, 0, 300, 150); prev.drawImage(img, 0, 0, 300, 150); };
    img.src = dataUrl;
  }
  modal.style.display = 'none';
};

// ----- BOTONES -----
document.getElementById('saveBtn').onclick = addRecord;
document.getElementById('clearBtn').onclick = clearForm;
document.getElementById('exportBtn').onclick = exportXLSX;
document.getElementById('downloadCsvBtn').onclick = exportCSV;
document.getElementById('deleteAllBtn').onclick = deleteAllRecords;

// ----- INICIALIZACIÓN -----
window.onload = () => {
  const dt = new Date();
  const tz = dt.getTimezoneOffset() * 60000;
  document.getElementById('datetime').value = (new Date(dt - tz)).toISOString().slice(0, 16);
  renderTable();
};
