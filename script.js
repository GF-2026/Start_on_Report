// ======================
// FUNCIONES AUXILIARES
// ======================
function getRecords() {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

// ======================
// DESCARGAR EXCEL
// ======================
document.getElementById('downloadButton').addEventListener('click', () => {
  const records = getRecords();
  if (records.length === 0) {
    alert('No hay registros guardados para descargar');
    return;
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(records);
  XLSX.utils.book_append_sheet(wb, ws, 'Registros');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `Registros_Arranque_${new Date().toISOString().slice(0,19).replace(/[-T:]/g,'')}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // mensaje visual opcional
  // alert('✅ Archivo Excel descargado. Puedes adjuntarlo manualmente al correo.');
});

// ======================
// ENVIAR CORREO (SIN ADJUNTO)
// ======================
document.getElementById('sendButton').addEventListener('click', () => {
  const records = getRecords();
  if (records.length === 0) {
    alert('No hay registros guardados para enviar');
    return;
  }

  const destinatario = "tck@olimp0.com"; // Cambia si es necesario
  const asunto = encodeURIComponent("Reportes de arranque guardados");
  const cuerpo = encodeURIComponent(
`Hola,

Aquí te envío los registros técnicos guardados.
Si lo requieres, puedes adjuntar manualmente el archivo Excel que acabas de descargar.

Saludos.`
  );

  window.location.href = `mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`;
});
