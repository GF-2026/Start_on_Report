// ======================
// VARIABLES GLOBALES
// ======================
let currentSignatureField = null;
let signatureDataCus = '';
let signatureDataEsp = '';
const storageKey = 'records_arranque';

// Control de borrado
const enableDeleteButton = true;

// ======================
// INICIALIZACIÓN
// ======================
document.addEventListener('DOMContentLoaded', () => {
  loadRecords();
  setupSignatureModal();
  document.getElementById('saveBtn').addEventListener('click', saveRecord);
  document.getElementById('clearBtn').addEventListener('click', clearForm);
  document.getElementById('exportBtn').addEventListener('click', exportToExcel);
  document.getElementById('downloadCsvBtn').addEventListener('click', exportToCSV);
  document.getElementById('deleteAllBtn').addEventListener('click', deleteAllRecords);

  // Abrir firmas
  document.getElementById('openSignatureCus').addEventListener('click', () => openSignature('cus'));
  document.getElementById('openSignatureEsp').addEventListener('click', () => openSignature('esp'));
});

// ======================
// FIRMA DIGITAL
// ======================
function setupSignatureModal() {
  const modal = document.getElementById('signatureModal');
  const canvas = document.getElementById('signatureCanvas');
  const ctx = canvas.getContext('2d');
  const clearBtn = document.getElementById('clearSignature');
  const saveBtn = document.getElementById('saveSignature');
  const closeBtn = document.getElementById('closeSignature');

  let drawing = false;
  let rect = canvas.getBoundingClientRect();

  // Funciones de dibujo
  function startDraw(e) {
    drawing = true;
    ctx.beginPath();
    const { x, y } = getPosition(e);
    ctx.moveTo(x, y);
  }

  function draw(e) {
    if (!drawing) return;
    const { x, y } = getPosition(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDraw() {
    drawing = false;
  }

  function getPosition(e) {
    const touch = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  // Eventos mouse y touch
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseout', stopDraw);
  canvas.addEventListener('touchstart', startDraw);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDraw);

  // Botones del modal
  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  saveBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    if (currentSignatureField === 'cus') {
      signatureDataCus = dataUrl;
      document.getElementById('signaturePreviewCus').getContext('2d').drawImage(canvas, 0, 0);
    } else if (currentSignatureField === 'esp') {
      signatureDataEsp = dataUrl;
      document.getElementById('signaturePreviewEsp').getContext('2d').drawImage(canvas, 0, 0);
    }
    modal.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

function openSignature(type) {
  currentSignatureField = type;
  const modal = document.getElementById('signatureModal');
  const canvas = document.getElementById('signatureCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  modal.style.display = 'flex';
}

// ======================
// FUNCIONES DE FORMULARIO
// ======================
function clearForm() {
  document.getElementById('reportForm').reset();
  signatureDataCus = '';
  signatureDataEsp = '';
  document.getElementById('signaturePreviewCus').getContext('2d').clearRect(0, 0, 300, 150);
  document.getElementById('signaturePreviewEsp').getContext('2d').clearRect(0, 0, 300, 150);
}

function saveRecord() {
  const record = {
    OT: document.getElementById('OT').value,
    datetime: document.getElementById('datetime').value,
    company: document.getElementById('company').value,
    engineer: document.getElementById('engineer').value,
    phone: document.getElementById('phone').value,
    city: document.getElementById('city').value,
    description: document.getElementById('description').value,
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value,
    serial: document.getElementById('serial').value,
    controlnum: document.getElementById('controlnum').value,
    status: document.getElementById('status').value,
    ubication: document.getElementById('ubication').value,
    temperature: document.getElementById('temperature').value,
    humidity: document.getElementById('humidity').value,
    notes: document.getElementById('notes').value,
    name_esp: document.getElementById('name_esp').value,
    name_cus: document.getElementById('name_cus').value,
    signatureDataEsp,
    signatureDataCus,
  };

  if (!record.OT || !record.datetime) {
    alert('Por favor completa los campos obligatorios: OT y Fecha/Hora.');
    return;
  }

  let records = JSON.parse(localStorage.getItem(storageKey) || '[]');
  records.push(record);
  localStorage.setItem(storageKey, JSON.stringify(records));
  loadRecords();
  clearForm();
  alert('Registro guardado correctamente.');
}

// ======================
// TABLA Y ALMACENAMIENTO
// ======================
function loadRecords() {
  const tableHead = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableBody');
  tableHead.innerHTML = '';
  tableBody.innerHTML = '';

  const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (records.length === 0) return;

  const columns = Object.keys(records[0]);
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    tableHead.appendChild(th);
  });

  records.forEach(record => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      if (col.includes('signatureData')) {
        const img = document.createElement('img');
        img.src = record[col];
        img.width = 100;
        td.appendChild(img);
      } else {
        td.textContent = record[col];
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

// ======================
// EXPORTAR Y BORRAR
// ======================
function exportToExcel() {
  const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (records.length === 0) return alert('No hay registros para exportar.');

  const ws = XLSX.utils.json_to_sheet(records);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Registros');
  XLSX.writeFile(wb, 'reporte_arranque.xlsx');
}

function exportToCSV() {
  const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (records.length === 0) return alert('No hay registros para exportar.');

  const headers = Object.keys(records[0]).join(',');
  const rows = records.map(r => Object.values(r).join(','));
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reporte_arranque.csv';
  a.click();
}

function deleteAllRecords() {
  if (!enableDeleteButton) return alert('El borrado está deshabilitado.');
  if (!confirm('¿Seguro que deseas borrar todos los registros?')) return;
  localStorage.removeItem(storageKey);
  loadRecords();
  alert('Todos los registros han sido eliminados.');
}
