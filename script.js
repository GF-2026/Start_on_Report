// ======================
// MANEJO DE FIRMAS
// ======================
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentSignatureTarget = null;

// Abrir modal
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
  const preview = currentSignatureTarget === 'esp'
    ? document.getElementById('signaturePreviewEsp')
    : document.getElementById('signaturePreviewCus');
  const pctx = preview.getContext('2d');
  const img = new Image();
  img.onload = () => {
    pctx.clearRect(0, 0, preview.width, preview.height);
    pctx.drawImage(img, 0, 0, preview.width, preview.height);
  };
  img.src = dataURL;
  modal.style.display = 'none';
});

// ======================
// DIBUJO EN CANVAS (mouse + táctil)
// ======================
canvas.addEventListener('mousedown', e => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

canvas.addEventListener('mouseup', () => (drawing = false));
canvas.addEventListener('mouseout', () => (drawing = false));

// === Soporte táctil ===
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  ctx.beginPath();
  ctx.moveTo(t.clientX - rect.left, t.clientY - rect.top);
  drawing = true;
});

canvas.addEventListener('touchmove', e => {
  if (!drawing) return;
  e.preventDefault();
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
  ctx.lineTo(t.clientX - rect.left, t.clientY - rect.top);
  ctx.stroke();
});

canvas.addEventListener('touchend', () => (drawing = false));
