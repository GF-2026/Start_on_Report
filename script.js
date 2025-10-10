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
  return `FOL StartReport-${y}${m}${d}-${h}${min}${s}`;
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
    signature_cus: signatureData2, // ← coma agregada AQUÍ
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
