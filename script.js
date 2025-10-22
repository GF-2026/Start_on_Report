// ======================
// VARIABLES GLOBALES
// ======================
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null; // 'esp' o 'cus'
const enableDeleteButton = true;   // true = activo, false = desactivado
const storageKey = 'records';

// ======================
// AUXILIARES
// ======================
function get(id){ return document.getElementById(id).value.trim(); }
function chk(id){ return document.getElementById(id).checked ? 'Sí' : 'No'; }

/**
 * Función auxiliar segura para obtener el dataURL de un elemento canvas.
 * Evita que el script falle si el elemento no se encuentra o no es un canvas.
 */
function getSignatureData(id) {
    const canvasElement = document.getElementById(id);
    // Verifica que el elemento exista y sea un CANVAS antes de llamar a toDataURL()
    if (canvasElement && canvasElement.tagName === 'CANVAS') {
        return canvasElement.toDataURL();
    }
    return ''; // Devuelve cadena vacía si falla
}

// ======================
// FOLIO AUTOMÁTICO
// ======================
function generateFolio(){
    const company = get('company') || 'SinEmpresa';
    const now = new Date();
    const y = now.getFullYear(), m = String(now.getMonth()+1).padStart(2,'0'), d = String(now.getDate()).padStart(2,'0');
    const h = String(now.getHours()).padStart(2,'0'), min = String(now.getMinutes()).padStart(2,'0');
    return `StartReport-${company}-${y}${m}${d}-${h}${min}`;
}

/// ======================
// GUARDAR REGISTRO (¡CORRECCIÓN FINAL!)
// ======================
document.getElementById('saveBtn').addEventListener('click', ()=>{
        const record = {
        folio: generateFolio(),
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
        // Aseguramos que la captura de firma use la función segura getSignatureData (si la tienes)
        // O si no la usas, nos aseguramos de que los IDs del canvas existan en el HTML.
        // YA CONFIRMAMOS QUE signaturePreviewEsp y signaturePreviewCus EXISTEN en el HTML.
        signatureEsp: document.getElementById('signaturePreviewEsp').toDataURL(),
        signatureCus: document.getElementById('signaturePreviewCus').toDataURL(),
        
        // =======================================================
        //   CORRECCIÓN DE CAMPOS DE MEDICIÓN
        // =======================================================
        
        // 1. Presiones Estáticas: SOLO tienen 1 input en HTML (ID: static_ls, static_hs)
        static_ls: [get('static_ls')], // Capturar solo el ID simple
        static_hs: [get('static_hs')], // Capturar solo el ID simple
        
        // 2. Resistencias (Estos SÍ están bien, tienen _1, _2, _3 en HTML)
        resistance_hs: [get('resistance_hs_1'), get('resistance_hs_2'), get('resistance_hs_3')],
        resistance_ls: [get('resistance_ls_1'), get('resistance_ls_2'), get('resistance_ls_3')],
        resistance_circ: [get('resistance_circ_1'), get('resistance_circ_2'), get('resistance_circ_3')],
        resistance_heat: [get('resistance_heat_1'), get('resistance_heat_2'), get('resistance_heat_3')],
        resistance_hum: [get('resistance_hum_1'), get('resistance_hum_2'), get('resistance_hum_3')],
        
        // 3. Voltajes: to_ground SOLO tiene 1 input en HTML
        voltaje_hs: [get('voltaje_hs_1'), get('voltaje_hs_2'), get('voltaje_hs_3')],
        voltaje_ls: [get('voltaje_ls_1'), get('voltaje_ls_2'), get('voltaje_ls_3')],
        to_ground: [get('to_ground')], // Capturar solo el ID simple
        
        // 4. Amperajes (Estos SÍ están bien)
        current_hs: [get('current_hs_1'), get('current_hs_2'), get('current_hs_3')],
        current_ls: [get('current_ls_1'), get('current_ls_2'), get('current_ls_3')],
        current_circ: [get('current_circ_1'), get('current_circ_2'), get('current_circ_3')],
        current_heat: [get('current_heat_1'), get('current_heat_2'), get('current_heat_3')],
        current_hum: [get('current_hum_1'), get('current_hum_2'), get('current_hum_3')],
        
        // 5. Presiones de Compresor: Tienen _1 y _2 en HTML, pero en JS pedías _3
        // Usaremos solo _1 y _2 que son los que existen: pressures_hs_3 y pressures_ls_3 NO EXISTEN
        pressures_hs: [get('pressures_hs_1'), get('pressures_hs_2')], 
        pressures_ls: [get('pressures_ls_1'), get('pressures_ls_2')]
    };
    records.push(record);
    localStorage.setItem(storageKey, JSON.stringify(records));
    renderTable();
    alert('✅ Registro guardado correctamente');
});

// ======================
// LIMPIAR FORMULARIO
// ======================
document.getElementById('clearBtn').addEventListener('click', ()=>{
    document.getElementById('reportForm').reset();
    
    // Los clearRect deben estar dentro de un chequeo de existencia si los ID no son seguros
    const espCtx = document.getElementById('signaturePreviewEsp')?.getContext('2d');
    const cusCtx = document.getElementById('signaturePreviewCus')?.getContext('2d');
    if (espCtx) espCtx.clearRect(0,0,300,150);
    if (cusCtx) cusCtx.clearRect(0,0,300,150);
});

// ======================
// RENDER TABLA
// ======================
function renderTable(){
    const head = document.getElementById('tableHead');
    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    
    const columns = [
        'folio', 'OT', 'datetime', 'company', 'engineer', 'city', 'description', 
        'status', 'temperature', 'humidity',
        
        'static_ls', 'static_hs',
        'resistance_hs', 'resistance_ls', 'resistance_circ', 'resistance_heat', 'resistance_hum',
        'voltaje_hs', 'voltaje_ls', 'to_ground',
        'current_hs', 'current_ls', 'current_circ', 'current_heat', 'current_hum',
        'pressures_hs', 'pressures_ls'
    ];
    
    head.innerHTML = columns.map(c => `<th>${c.toUpperCase().replace(/_/g, ' ')}</th>`).join('');
    
    records.forEach(r => {
        const row = `<tr>${columns.map(c => {
            let data = r[c] || '';
            
            if (Array.isArray(data)) {
                data = data.filter(val => val !== null && val !== undefined).join('<br>');
            }
            
            return `<td>${data}</td>`;
        }).join('')}</tr>`;
        
        body.insertAdjacentHTML('beforeend', row);
    });
}

renderTable();

// ======================
// EXPORTAR EXCEL
// ======================
document.getElementById('exportBtn').addEventListener('click', ()=>{
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
deleteBtn.style.display = enableDeleteButton?'inline-block':'none';
deleteBtn.onclick = ()=>{
    if(!enableDeleteButton) return;
    if(confirm('¿Borrar todos los registros guardados?')){
        localStorage.removeItem(storageKey);
        records=[];
        renderTable();
    }
}

// ======================
// FIRMA
// ======================
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function openSignature(target){
    currentSignatureTarget = target;
    modal.classList.add('active');
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

document.getElementById('openSignatureEsp').addEventListener('click',()=>openSignature('esp'));
document.getElementById('openSignatureCus').addEventListener('click',()=>openSignature('cus'));

document.getElementById('closeSignature').addEventListener('click',()=>modal.classList.remove('active'));
document.getElementById('clearSignature').addEventListener('click',()=>ctx.clearRect(0,0,canvas.width,canvas.height));
document.getElementById('saveSignature').addEventListener('click',()=>{
    const dataURL = canvas.toDataURL();
    let preview = currentSignatureTarget==='esp'?document.getElementById('signaturePreviewEsp'):document.getElementById('signaturePreviewCus');
    // Se agrega una verificación si 'preview' existe antes de obtener el contexto
    if (!preview) {
        console.error("No se encontró el canvas de vista previa para la firma.");
        modal.classList.remove('active');
        return;
    }
    
    const pctx = preview.getContext('2d');
    const img = new Image();
    img.onload = ()=>{pctx.clearRect(0,0,300,150); pctx.drawImage(img,0,0,300,150)};
    img.src = dataURL;
    modal.classList.remove('active');
});

// ======================
// DIBUJO CANVAS
// ======================
const getTouchPos = (canvasDom, touchEvent) => {
    const rect = canvasDom.getBoundingClientRect();
    // Obtiene la posición del primer toque (touch) y ajusta por el scroll y la posición del canvas
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
};

// Eventos del Mouse
canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    drawing = true; 
    ctx.beginPath(); 
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mouseup', () => { drawing = false; });
canvas.addEventListener('mouseout', () => { drawing = false; });
canvas.addEventListener('mousemove', e => {
    if (!drawing) return; 
    ctx.lineWidth = 2; 
    ctx.lineCap = 'round'; 
    ctx.strokeStyle = '#000'; 
    ctx.lineTo(e.offsetX, e.offsetY); 
    ctx.stroke();
});

// Eventos Táctiles (para móviles)
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    drawing = true;
    const touch = getTouchPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(touch.x, touch.y);
}, false);

canvas.addEventListener('touchend', () => { drawing = false; });

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!drawing) return;
    const touch = getTouchPos(canvas, e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(touch.x, touch.y);
    ctx.stroke();
}, false);

// Sección de semáforos
function setEstado(num, color) {
  const colores = ['roja', 'amarilla', 'verde'];
  colores.forEach(c => {
    document.getElementById(c + num).classList.remove('activa');
  });
  document.getElementById(color + num).classList.add('activa');
}
:root{
    --bg:#f7fafc;
    --card:#fff;
    --accent:#2b6cb0;
    --muted:#6b7280;
    --border:#0713f5;
}
body{
    font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;
    background:var(--bg);
    margin:0;
    padding:24px;
    color:#0f172a;
}
.container{
    max-width:1100px;
    margin:0 auto;
}
header{
    display:flex;
    align-items:center;
    gap:12px;
    margin-bottom:24px;
}
header img{
    height:50px;
}
h1{
    margin:0;
    font-size:1.5rem;
}
.muted{
    color:var(--muted);
    font-size:0.85rem;
}
.card{
    background:var(--card);
    padding:16px;
    border-radius:12px;
    box-shadow:0 2px 8px rgba(0,0,0,0.1);
    margin-bottom:24px;
}
.grid{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
    gap:12px;
}
.fullwidth{
    grid-column:1/-1;
}
.grid input[type="text"],
.grid input[type="number"],
.grid input[type="datetime-local"],
textarea{
    width:100%;
    padding:6px 8px;
    border:1px solid var(--border);
    border: radius 20px;
    box-sizing:border-box;
    border-radius: 10px;  
}
textarea{
    width:100%;
    min-height:80px;
}
.checkboxes label{
    display:flex;
    align-items:center;
    gap:6px;
    font-size:0.9rem;
    
    /* --- Borde y Relleno --- */
    border:none;
    padding: 6px 10px;               
    border-radius: 6px;              
    margin-bottom: 8px;              
    
    /* 1. Opción: Color de fondo gris muy claro */
    /* background-color: #f0f0f0; */ 
    
    /* 2. Opción: Color de fondo blanco (si necesitas forzarlo) */
    background-color: rgba(100, 200, 256);
    margin-top:16px;
    display:flex;
    gap:8px;
}
button{
    padding:8px 16px;
    border:none;
    border-radius:6px;
    background:var(--accent);
    color:#fbfcfc;
    cursor:pointer;
}
button.secondary{
    background:#ccc;
    color:#000;
}

/* Tabla */
.table-wrap{
    overflow-x:auto;
}
table{
    width:100%;
    border-collapse:collapse;
}
th,td{
    border:1px solid var(--border);
    padding:6px 8px;
    text-align:left;
}

/* MODAL FIRMA */
#signatureModal{
    display:none;
    position:fixed;
    top:0; left:0;
    width:100%; height:100%;
    background:rgba(0,0,0,0.4);
    justify-content:center;
    align-items:center;
    z-index:1000;
}
#signatureModal.active{
    display:flex;
}
#signatureBox{
    background:var(--card);
    padding:24px;
    border-radius:25px;
    width:360px;
    max-width:90%;
    text-align:center;
    position:relative;
}
#signatureBox canvas{
    border:1px solid var(--border);
    margin:12px 0;
    border-radius:6px;
}
.signature-actions{
    display:flex;
    justify-content:center;
    gap:8px;
}
/* Agrega este bloque al final de tu styles.css */
hr {
    border: none; /* Elimina el borde 3D predeterminado del navegador */
    height: 1px; /* Define el grosor de la línea */
    background-color: var(--border); /* Usa el gris claro de tu variable --border */
    margin: 16px 0; /* Espaciado arriba y abajo para separarlo de las secciones */
}
.section-header {
    /* Agrega un poco de espacio debajo del encabezado para separarlo de los campos */
    margin-bottom: 12px; 
    
    /* Hace que el texto sea un poco más grande y usa negrita para destacarlo */
    font-size: 1.1rem;
    font-weight: 600; 
    
    /* Asegura que el texto y el texto 'muted' a su lado estén alineados */
    display: flex;
    justify-content: space-between; /* Mueve el texto 'muted' al extremo derecho */
    align-items: center;
}

/* Opcional: Estilo para el número de sección */
.section-header strong {
    color: var(--accent); /* Podrías usar el color azul de tu formulario */
}
/* Para el nombre del ingeniero/especialista */
#name_esp {
    border: 1px solid rgb(5, 29, 250); /* Borde verde de 2px */
    border-radius: 5cqi;      /* Puedes añadir un radio si lo deseas */
    margin-left:5px;
}

/* Para el nombre del cliente/usuario */
#name_cus {
    border: 1px solid rgb(5, 29, 250); /* Borde de guiones (dashed) y naranja */
    border-radius: 5px;  
    margin-left:5px;
}
/* Este selector asume la anidación: .grid > * > .mediciones > div > input */
.grid .mediciones > div input[type="number"] {
    /* Mantenemos el ancho para 5-6 dígitos */
    width: 60px; 
    box-sizing: border-box; 
    padding: 2px 5px; 
    
    /* Nota: Si esto no funciona, prueba añadir !important TEMPORALMENTE 
       al final de la línea 'width' para confirmar que el problema es la especificidad. */
}
  .contenedor {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    font-family: sans-serif;
  }

  .seccion {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 15px;
    width: 200px;
    text-align: center;
    background: #f9f9f9;
  }

  .titulo {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .semaforo {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    background: #333;
    border-radius: 15px;
    padding: 10px;
    margin: 0 auto;
    box-shadow: 0 0 10px #0006 inset;
  }

  .luz {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin: 5px 0;
    background-color: #222;
    opacity: 0.3;
    transition: 0.3s;
  }

  .luz.activa {
    opacity: 1;
    box-shadow: 0 0 15px 5px currentColor;
  }

  .roja { color: red; background-color: red; }
  .amarilla { color: yellow; background-color: yellow; }
  .verde { color: limegreen; background-color: limegreen; }

  .botones {
    margin-top: 8px;
  }

  .botones button {
    margin: 2px;
    padding: 4px 8px;
  }
// Sección de semáforos
function setEstado(num, color) {
  const colores = ['roja', 'amarilla', 'verde'];
  colores.forEach(c => {
    document.getElementById(c + num).classList.remove('activa');
  });
  document.getElementById(color + num).classList.add('activa');
}
