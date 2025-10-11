// ======================
// MANEJO DE FIRMAS
// ======================
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentSignatureTarget = null; // 'esp' o 'cus'

// Abrir modal de firma
function openSignature(target) {
  currentSignatureTarget = target;
  modal.style.display = 'flex';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Cerrar modal de firma
document.getElementById('closeSignature').addEventListener('click', () => {
  modal.style.display = 'none';
});

// Limpiar el área de firma
document.getElementById('clearSignature').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Guardar la firma
document.getElementById('saveSignature').addEventListener('click', () => {
  const dataURL = canvas.toDataURL();
  const previewCanvas = currentSignatureTarget === 'esp'
    ? document.getElementById('signaturePreviewEsp')
    : document.getElementById('signaturePreviewCus');

  if (previewCanvas) {
    const pctx = previewCanvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      pctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      pctx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
    };
    img.src = dataURL;
  }

  modal.style.display = 'none';
});

// Eventos de dibujo con mouse
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
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

// Eventos de dibujo con toque (para dispositivos móviles)
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  drawing = true;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
});
canvas.addEventListener('touchend', () => drawing = false);
canvas.addEventListener('touchcancel', () => drawing = false);
