// ======================
// VARIABLES GLOBALES
// ======================
let currentSignatureField = null;
let signatureDataCus = '';
let signatureDataEsp = '';
const storageKey = 'records_arranque';

// ======================
// FUNCIONES DE UTILIDAD
// ======================
function get(id) {
  return document.getElementById(id)?.value || '';
}

function chk(id) {
  return document.getElementById(id)?.checked ? 'Sí' : 'No';
}

function set(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || '';
}

function setChk(id, value) {
  const el = document.getElementById(id);
  if (el) el.checked = value === 'Sí';
}

// ======================
// FIRMA DIGITAL
// ======================
const modal = document.getElementById('signatureModal');
const signatureCanvas = document.getElementById('signatureCanvas');
const ctx = signatureCanvas.getContext('2d');
let drawing = false;

function openSignature(field) {
  currentSignatureField = field;
  ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  modal.style.display = 'flex';
}

function closeSignature() {
  modal.style.display = 'none';
  currentSignatureField = null;
}

signatureCanvas.addEventListener('mousedown', () => drawing = true);
signatureCanvas.addEventListener('mouseup', () => drawing = false);
signatureCanvas.addEventListener('mouseout', () => drawing = false);
signatureCanvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  const rect = signatureCanvas.getBoundingClientRect();
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

document.getElementById('clearSignature').onclick = () => {
  ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
};

document.getElementById('saveSignature').onclick = () => {
  const dataURL = signatureCanvas.toDataURL();
  if (currentSignatureField === 'cus') {
    signatureDataCus = dataURL;
    document.getElementById('signaturePreviewCus').getContext('2d')
      .drawImage(signatureCanvas, 0, 0);
  } else if (currentSignatureField === 'esp') {
    signatureDataEsp = dataURL;
    document.getElementById('signaturePreviewEsp').getContext('2d')
      .drawImage(signatureCanvas, 0, 0);
  }
  closeSignature();
};

document.getElementById('closeSignature').onclick = closeSignature;

document.getElementById('openSignatureCus').onclick = () => openSignature('cus');
document.getElementById('openSignatureEsp').onclick = () => openSignature('esp');

// ======================
// GUARDAR REGISTRO
// ======================
document.getElementById('saveBtn').onclick = () => {
  const record = {
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

    // CHECKBOXES
    marking: chk('marking'),
    voltage_plate: chk('voltage_plate'),
    shock_free: chk('shock_free'),
    pallets: chk('pallets'),
    unpack: chk('unpack'),
    supplies_installed: chk('supplies_installed'),
    specs_available: chk('specs_available'),
    refrigerant: chk('refrigerant'),
    manuals: chk('manuals'),

    // MEDICIONES
    static_hs: get('static_hs'),
    static_ls: get('static_ls'),
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

    // FIRMAS Y OBSERVACIONES
    name_cus: get('name_cus'),
    name_esp: get('name_esp'),
    notes: get('notes'),
    signature_cus: signatureDataCus,
    signature_esp: signatureDataEsp
  };

  let records = JSON.parse(localStorage.getItem(storageKey) || '[]');
  records.push(record);
  localStorage.setItem(storageKey, JSON.stringify(records));
  loadTable();
  alert('✅ Registro guardado correctamente.');
};

// ======================
// LIMPIAR FORMULARIO
// ======================
document.getElementById('clearBtn').onclick = () => {
  document.querySelector('form').reset();
  signatureDataCus = '';
  signatureDataEsp = '';
  document.getElementById('signaturePreviewCus').getContext('2d').clearRect(0, 0, 300, 150);
  document.getElementById('signaturePreviewEsp').getContext('2d').clearRect(0, 0, 300, 150);
};

// ======================
// CARGAR TABLA
// ======================
function loadTable() {
  const tableHead = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableBody');
  const records = JSON.parse(localStorage.getItem(storageKey) || '[]');

  tableHead.innerHTML = '';
  tableBody.innerHTML = '';

  if (records.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">No hay registros aún</td></tr>';
    return;
  }

  const headers = Object.keys(records[0]);
  tableHead.innerHTML = headers.map(h => `<th>${h}</th>`).join('');

  for (const r of records) {
    const row = document.createElement('tr');
    row.innerHTML = headers.map(h =>
      h.includes('signature')
        ? `<td><canvas width="100" height="50"></canvas></td>`
        : `<td>${r[h] || ''}</td>`
    ).join('');
    tableBody.appendChild(row);

    // Mostrar miniaturas de firma
    headers.forEach((h, i) => {
      if (h.includes('signature') && r[h]) {
        const canvas = row.children[i].querySelector('canvas');
        const img = new Image();
        img.onload = () => canvas.getContext('2d').drawImage(img, 0, 0, 100, 50);
        img.src = r[h];
      }
    });
  }
}
loadTable();

// ======================
// EXPORTAR A EXCEL / CSV
// ======================
document.getElementById('exportBtn').onclick = () => {
  const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (!records.length) return alert('No hay registros para exportar.');
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(records);
  XLSX.utils.book_append_sheet(wb, ws, 'Registros');
  XLSX.writeFile(wb, 'RegistrosArranque.xlsx');
};

document.getElementById('downloadCsvBtn').onclick = () => {
  const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (!records.length) return alert('No hay registros para exportar.');
  const ws = XLSX.utils.json_to_sheet(records);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'RegistrosArranque.csv';
  a.click();
};

// ======================
// BORRAR REGISTROS
// ======================
document.getElementById('deleteAllBtn').onclick = () => {
  if (confirm('¿Seguro que deseas borrar todos los registros?')) {
    localStorage.removeItem(storageKey);
    loadTable();
  }
};
