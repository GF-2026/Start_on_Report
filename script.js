// ======================
// VARIABLES GLOBALES
// ======================
let currentSignatureField = null;
let signatureDataCus = '';
let signatureDataEsp = '';
const modal = document.getElementById('signatureModal');
const signatureCanvas = document.getElementById('signatureCanvas');
const ctx = signatureCanvas.getContext('2d');
let drawing = false;

// ======================
// FUNCIONES
// ======================
function openSignature(field) {
  currentSignatureField = field;
  ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  modal.style.display = 'flex';
}

function closeSignature() {
  modal.style.display = 'none';
  currentSignatureField = null;
}

// ======================
// EVENTOS DE DIBUJO
// ======================
// Mouse
signatureCanvas.addEventListener('mousedown', e => {
  drawing = true;
  const rect = signatureCanvas.getBoundingClientRect();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});
signatureCanvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  const rect = signatureCanvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
});
signatureCanvas.addEventListener('mouseup', () => drawing = false);
signatureCanvas.addEventListener('mouseout', () => drawing = false);

// Touch
signatureCanvas.addEventListener('touchstart', e => {
  e.preventDefault();
  drawing = true;
  const rect = signatureCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
});
signatureCanvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!drawing) return;
  const rect = signatureCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
});
signatureCanvas.addEventListener('touchend', () => drawing = false);
signatureCanvas.addEventListener('touchcancel', () => drawing = false);

// ======================
// BOTONES FIRMA
// ======================
document.getElementById('clearSignature').onclick = () => {
  ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
};

document.getElementById('saveSignature').onclick = () => {
  const dataURL = signatureCanvas.toDataURL();
  let previewCanvas;
  if (currentSignatureField === 'cus') {
    signatureDataCus = dataURL;
    previewCanvas = document.getElementById('signaturePreviewCus');
  } else if (currentSignatureField === 'esp') {
    signatureDataEsp = dataURL;
    previewCanvas = document.getElementById('signaturePreviewEsp');
  }

  if (previewCanvas) {
    const previewCtx = previewCanvas.getContext('2d');
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    const img = new Image();
    img.onload = () => previewCtx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
    img.src = dataURL;
  }

  closeSignature();
};

document.getElementById('closeSignature').onclick = closeSignature;

// Abrir modal
document.getElementById('openSignatureCus').onclick = () => openSignature('cus');
document.getElementById('openSignatureEsp').onclick = () => openSignature('esp');
