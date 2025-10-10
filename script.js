// ======== Variables globales ========
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null; // 'esp' o 'cus'

// ======== Funciones auxiliares ========
function get(id) {
  return document.getElementById(id).value.trim();
}

function set(id, value) {
  document.getElementById(id).value = value || '';
}

function chk(id) {
  return document.getElementById(id).checked ? 'Sí' : 'No';
}

function setChk(id, val) {
  document.getElementById(id).checked = (val === 'Sí');
}

// ======== Guardar registro ========
document.getElementById('saveBtn').addEventListener('click', () => {
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
  localStorage.setItem('records', JSON.stringify(records));
  renderTable();
  alert('✅ Registro guardado correctamente');
});

// ======== Limpiar formulario ========
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('reportForm').reset();
  document.getElementById('signaturePreviewEsp').getContext('2d').clearRect(0, 0, 300, 150);
  document.getElementById('signaturePreviewCus').getContext('2d').clearRect(0, 0, 300, 150);
});

// ======== Renderizar tabla ========
function renderTable() {
  const head = document.getElementById('tableHead');
  const body = document.getElementById('tableBody');
  body.innerHTML = '';

  const columns = [
    'OT','datetime','company','engineer','city','description','status','temperature','humidity'
  ];

  head.innerHTML = columns.map(c => `<th>${c}</th>`).join('');

  records.forEach(r => {
    const row = `<tr>${columns.map(c => `<td>${r[c] || ''}</td>`).join('')}</tr>`;
    body.insertAdjacentHTML('beforeend', row);
  });
}

renderTable();

// ======== Descargar Excel ========
document.getElementById('downloadButton').addEventListener('click', () => {
  if (!records.length) return alert('No hay registros para exportar.');

  const ws = XLSX.utils.json_to_sheet(records);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
  XLSX.writeFile(wb, 'Reportes_Fixser.xlsx');
});

// ======== Enviar correo ========
document.getElementById('sendButton').addEventListener('click', () => {
  const subject = encodeURIComponent('📋 Reportes de Arranque FIXSER');
  const body = encodeURIComponent(
    'Hola,\n\nAdjunto encontrarás el archivo Excel con los reportes de arranque.\n\nSaludos,\n'
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});

// ======== Eliminar registros ========
document.getElementById('deleteAllBtn').addEventListener('click', () => {
  if (confirm('¿Borrar todos los registros guardados?')) {
    localStorage.removeItem('records');
    records = [];
    renderTable();
  }
});

// ======== MANEJO DE FIRMAS ========
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Abrir modal de firma
document.getElementById('openSignatureEsp').addEventListener('click', () => openSignature('esp'));
document.getElementById('openSignatureCus').addEventListener('click', () => openSignature('cus'));

function openSignature(target) {
  currentSignatureTarget = target;
  modal.style.display = 'flex';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Cerrar modal
document.getElementById('closeSignature').addEventListener('click', () => {
  modal.style.display = 'none';
});

// Limpiar firma
document.getElementById('clearSignature').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Guardar firma
document.getElementById('saveSignature').addEventListener('click', () => {
  const dataURL = canvas.toDataURL();
  if (currentSignatureTarget === 'esp') {
    const preview = document.getElementById('signaturePreviewEsp');
    const pctx = preview.getContext('2d');
    const img = new Image();
    img.onload = () => {
      pctx.clearRect(0, 0, 300, 150);
      pctx.drawImage(img, 0, 0, 300, 150);
    };
    img.src = dataURL;
  } else if (currentSignatureTarget === 'cus') {
    const preview = document.getElementById('signaturePreviewCus');
    const pctx = preview.getContext('2d');
    const img = new Image();
    img.onload = () => {
      pctx.clearRect(0, 0, 300, 150);
      pctx.drawImage(img, 0, 0, 300, 150);
    };
    img.src = dataURL;
  }
  modal.style.display = 'none';
});

// Dibujo en canvas
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousemove', draw);

function startDrawing(e) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function stopDrawing() {
  drawing = false;
}

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}
// ====================== // GENERAR FOLIO AUTOMÁTICO // ====================== 
function generateFolio() { const company = get('company') || 'SinEmpresa'; const now = new Date(); // Fecha YYYYMMDD
const year = now.getFullYear(); const month = String(now.getMonth() + 1).padStart(2, '0'); const day = String(now.getDate()).padStart(2, '0');
// Hora HHMM
const hours = String(now.getHours()).padStart(2, '0'); const minutes = String(now.getMinutes()).padStart(2, '0'); return StartReport-${company}-${year}${month}${day}-${hours}${minutes}; }
