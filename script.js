
// ======================
// VARIABLES GLOBALES
// ======================
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null; // 'esp' o 'cus'
const enableDeleteButton = true;   // true = activo, false = desactivado
const storageKey = 'records';
let estados = { 1: '', 2: '', 3: '' }; // 👈 estados de semáforos
// ======================
// AUXILIARES
// ======================
function get(id){ return document.getElementById(id).value.trim(); }
function chk(id){ return document.getElementById(id).checked ? '1' : '0'; }

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
    return `Startup_Report-${company}-${y}${m}${d}-${h}${min}`;
}

// ======================
// GUARDAR REGISTRO (CAMPOS SEPARADOS POR COLUMNA)
// ======================
document.getElementById('saveBtn').addEventListener('click', () => {
const record = {
folio: generateFolio(),
// ======================
// GETTERS AUTOMÁTICOS
// ======================

function get(id) {
  return document.getElementById(id)?.value.trim() || '';
}
 // 1️⃣ Datos de cliente
const data = {
  OT: get('OT'),
  datetime: get('datetime'),
  company: get('company'),
  engineer: get('engineer'),
  phone: get('phone'),
  city: get('city'),
      // 2️⃣ Datos del equipo
  description: get('description'),
  brand: get('brand'),
  model: get('model'),
  serial: get('serial'),
  controlnum: get('controlnum'),
  status_test: get('status_test'),
    // 3️⃣ Condiciones ambientales
  ubication: get('ubication'),
  temperature: get('temperature'),
  humidity: get('humidity'),
  specs_available: get('specs_available'),
  manuals: get('manuals'),
  shock_free: get('shock_free'),
  supplies_installed: get('supplies_installed'),
  correspon_voltage: get('correspon_voltage'),
  refrigerant: get('refrigerant'),
  static_ls: get('static_ls'),
  static_hs: get('static_hs'),
  marking: chk('marking'),
  pallets: chk('pallets'),
  unpack: chk('unpack'),

  resistance_hs_1: get('resistance_hs_1'),
  resistance_hs_2: get('resistance_hs_2'),
  resistance_hs_3: get('resistance_hs_3'),
  res_hs_to_ground: get('res_hs_to_ground'),

  resistance_ls_1: get('resistance_ls_1'),
  resistance_ls_2: get('resistance_ls_2'),
  resistance_ls_3: get('resistance_ls_3'),
  res_ls_to_ground: get('res_ls_to_ground'),

  resistance_heat_1: get('resistance_heat_1'),
  resistance_heat_2: get('resistance_heat_2'),
  resistance_heat_3: get('resistance_heat_3'),

  resistance_hum_1: get('resistance_hum_1'),
  resistance_hum_2: get('resistance_hum_2'),
  resistance_hum_3: get('resistance_hum_3'),
  res_hum_to_ground: get('res_hum_to_ground'),

  resistance_circ_1: get('resistance_circ_1'),
  resistance_circ_2: get('resistance_circ_2'),
  resistance_circ_3: get('resistance_circ_3'),

  main_switch: chk('main_switch'),
  highvolt_cables_ok: chk('highvolt_cables_ok'),
  switch_covers: chk('switch_covers'),
  fuses_ok: chk('fuses_ok'),
  tighting: chk('tighting'),
  faseado: chk('faseado'),
  headfan: chk('headfan'),
  crankcase: get('crankcase'),
  balance: chk('balance'),
  grounded: chk('grounded'),
  control_voltage: chk('control_voltage'),

  voltaje_hs_1: get('voltaje_hs_1'),
  voltaje_hs_2: get('voltaje_hs_2'),
  voltaje_hs_3: get('voltaje_hs_3'),

  voltaje_ls_1: get('voltaje_ls_1'),
  voltaje_ls_2: get('voltaje_ls_2'),
  voltaje_ls_3: get('voltaje_ls_3'),

  voltage_fase_to_neutral: get('voltage_fase_to_neutral'),
  plate_voltage: get('plate_voltage'),

  current_hs_1: get('current_hs_1'),
  current_hs_2: get('current_hs_2'),
  current_hs_3: get('current_hs_3'),

  current_ls_1: get('current_ls_1'),
  current_ls_2: get('current_ls_2'),
  current_ls_3: get('current_ls_3'),

  current_circ_1: get('current_circ_1'),
  current_circ_2: get('current_circ_2'),
  current_circ_3: get('current_circ_3'),

  overloads_config: chk('overloads_config'),

  current_cond_fan1: get('current_cond_fan1'),
  current_cond_fan2: get('current_cond_fan2'),
  current_cond_fan3: get('current_cond_fan3'),

  current_headfan_r: get('current_headfan_r'),
  current_headfan_s: get('current_headfan_s'),
  current_headfan_t: get('current_headfan_t'),

  current_heat_1: get('current_heat_1'),
  current_heat_2: get('current_heat_2'),
  current_heat_3: get('current_heat_3'),

  current_hum_1: get('current_hum_1'),
  current_hum_2: get('current_hum_2'),
  current_hum_3: get('current_hum_3'),

  low_pressures_hs_1: get('low_pressures_hs_1'),
  disch_pressures_hs_1: get('disch_pressures_hs_1'),
  low_pressures_ls_1: get('low_pressures_ls_1'),
  disch_pressures_ls_1: get('disch_pressures_ls_1'),

  channels_ok: chk('channels_ok'),
  overtem_cool_ok: chk('overtem_cool_ok'),
  calibrated_valide: chk('calibrated_valide'),
  sensors_ok: chk('sensors_ok'),
  static_press_ok: chk('static_press_ok'),
  temp_water_in_ok: chk('temp_water_in_ok'),
  temp_water_out_ok: chk('temp_water_out_ok'),
  press_watter_in_ok: chk('press_watter_in_ok'),
  press_watter_out_ok: chk('press_watter_out_ok'),

  fans_ok: chk('fans_ok'),
  coils_ok: chk('coils_ok'),
  armafles_ok: chk('armafles_ok'),
  inyection_ok: chk('inyection_ok'),
  temp_disch_ok: chk('temp_disch_ok'),
  oil_ok: chk('oil_ok'),
  bypass_cal_ok: chk('bypass_cal_ok'),
  sights_ok: chk('sights_ok'),
  frosty: chk('frosty'),
  hilow: chk('hilow'),
  low_press_oil: chk('low_press_oil'),
  rotalocks: chk('rotalocks'),
  capillaries: chk('capillaries'),
  acid_ok: chk('acid_ok'),
  noleaks: chk('noleaks'),

  hum_from: get('hum_from'),
  hum_target: get('hum_target'),
  heat_test: get('heat_test'),
  hum_low: get('hum_low'),
  hum_hig: get('hum_hig'),
  hum_test: get('hum_test'),
  temp_high: get('temp_high'),
  temp_low: get('temp_low'),
  cold_test: get('cold_test'),
  pulldown: get('pulldown'),

  estado_ref: get('estado_ref'),
  estado_heat: get('estado_heat'),
  estado_elec: get('estado_elec'),

  notes: get('notes'),
  name_esp: get('name_esp'),
  name_cus: get('name_cus'),
  signatureEsp: get('signatureEsp'),
  signatureCus: get('signatureCus')
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
  // 🔄 Reset semáforos
  estados = { 1: '', 2: '', 3: '' };
  ['1','2','3'].forEach(num => {
    ['roja','amarilla','verde'].forEach(c => 
      document.getElementById(c + num)?.classList.remove('activa')
    );
  });
// ======================
// RENDER TABLA
// ======================
function renderTable(){
    const head = document.getElementById('tableHead');
    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    const columns = [
  'OT', 
'datetime', 
        'company', 
        'engineer', 
        'phone', 
        'city',
  'description', 
        'brand', 
        'model', 
        'serial', 
        'controlnum', 
        'status_test',
        
  'ubication', 
        'temperature', 
        'humidity',
        
    'specs_available',      
  'manuals',
  'shock_free',
  'supplies_installed',        
'correspon_voltage',/* Crear lo neecsario*/        
  'refrigerant',
    'static_ls',       
        'static_hs',        
'marking',
  'pallets', 
 'unpack', 
        
  'resistance_hs_1', 'resistance_hs_2', 'resistance_hs_3', 'res_hs_to_ground',
  'resistance_ls_1', 'resistance_ls_2', 'resistance_ls_3', 'res_ls_to_ground',
  'resistance_heat_1', 'resistance_heat_2', 'resistance_heat_3',
    'resistance_hum_1', 'resistance_hum_2', 'resistance_hum_3', 'res_hum_to_ground',
  'resistance_circ_1', 'resistance_circ_2', 'resistance_circ_3', 

    'main_switch', 'highvolt_cables_ok','switch_covers','fuses_ok','tighting', 'faseado','headfan',
   'crankcase', 'balance','grounded', 'control_voltage',

  'voltaje_hs_1', 'voltaje_hs_2', 'voltaje_hs_3',
  'voltaje_ls_1', 'voltaje_ls_2', 'voltaje_ls_3',
  'voltage_fase_to_neutral', 'plate_voltage',

  'current_hs_1', 'current_hs_2', 'current_hs_3',
  'current_ls_1', 'current_ls_2', 'current_ls_3',
  'current_circ_1', 'current_circ_2', 'current_circ_3', 'overloads_config',
'current_cond_fan1', 'current_cond_fan2', 'current_cond_fan3',
   'current_headfan_r', 'current_headfan_s', 'current_headfan_t',     
  'current_heat_1', 'current_heat_2', 'current_heat_3',
  'current_hum_1', 'current_hum_2', 'current_hum_3',

  'low_pressures_hs_1', 'disch_pressures_hs_1', 'low_pressures_ls_1', 'disch_pressures_ls_1',

'channels_ok', 'overtem_cool_ok', 'calibrated_valide', 'sensors_ok', 'static_press_ok', 'temp_water_in_ok', '', '',
        'temp_water_out_ok', 'press_watter_in_ok','press_watter_out_ok',
        
  'fans_ok', 'coils_ok', 'armafles_ok', 'inyection_ok', 'temp_disch_ok', 'oil_ok',
  'bypass_cal_ok', 'sights_ok','frosty', 'hilow', 'low_press_oil', 'rotalocks','capillaries','acid_ok', 'noleaks',
  

  'hum_from', 'hum_target', 'heat_test', 'hum_low', 'hum_hig',
  'hum_test', 'temp_high', 'temp_low', 'cold_test', 'pulldown',

  'estado_ref', 'estado_heat', 'estado_elec',
  'notes', 'name_esp', 'name_cus', 'signatureEsp', 'signatureCus'
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
    XLSX.writeFile(wb, 'Startup_reports.xlsx');
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
const seccion = document.getElementById('section-headerx');
// Sección de semáforos
function setEstado(num, color) {
  const colores = ['roja', 'amarilla', 'verde'];
  colores.forEach(c => {
    document.getElementById(c + num)?.classList.remove('activa');
  });
  document.getElementById(color + num)?.classList.add('activa');

  // 🔄 Guardar el valor seleccionado en el objeto estados
  estados[num] = color;
}
