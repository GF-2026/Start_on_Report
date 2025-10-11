:root{--bg:#f7fafc;--card:#ffffff;--accent:#2b6cb0;--muted:#6b7280;--danger:#ef4444}
*{box-sizing:border-box}
body{font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;background:var(--bg);margin:0;padding:24px;color:#0f172a}
.container{max-width:1100px;margin:0 auto}
header{display:flex;align-items:center;gap:16px;margin-bottom:18px}
h1{font-size:20px;margin:0}
.card{background:var(--card);border-radius:12px;padding:18px;box-shadow:0 6px 18px rgba(2,6,23,0.06)}
form .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.section{margin-bottom:14px}
.section h2{font-size:14px;margin:0 0 10px}
label{display:block;font-size:13px;margin-bottom:6px;color:var(--muted)}
input[type=text],input[type=number],select,textarea{width:100%;padding:8px;border-radius:8px;border:1px solid #e6eef7;background:#fbfeff}
textarea{min-height:68px;resize:vertical}
.row{display:flex;gap:12px;align-items:center}
.left-checkbox label{display:flex;align-items:center;gap:8px;cursor:pointer}
.left-checkbox input[type=checkbox]{order:-1;margin-right:6px}
.controls{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
button{background:var(--accent);color:#fff;padding:8px 12px;border-radius:8px;border:0;cursor:pointer}
button.secondary{background:#e6eef7;color:var(--accent)}
button.danger{background:var(--danger)}
table{width:100%;border-collapse:collapse;margin-top:12px}
th,td{padding:8px;border:1px solid #e6eef7;text-align:left;font-size:13px}
.small{font-size:12px;color:var(--muted)}
.signature-preview{height:60px;border:1px dashed #cbd5e1;border-radius:6px;display:flex;align-items:center;justify-content:center;background:#fcfeff}
.flex{display:flex;gap:10px;align-items:center}
@media (max-width:820px){.grid{grid-template-columns:1fr}.container{padding:12px}}

/* Firma */
#sigModal{display:none;position:fixed;inset:0;background:rgba(2,6,23,0.6);align-items:center;justify-content:center;padding:20px}
#sigModal.active{display:flex}
.sigBox{background:#fff;border-radius:12px;padding:14px;max-width:700px;width:100%;box-shadow:0 10px 30px rgba(2,6,23,0.2)}
.sigHeader{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
#sigCanvas{border:1px solid #e6eef7;border-radius:8px;width:100%;height:240px}
.sigControls{display:flex;gap:8px;margin-top:8px;justify-content:flex-end}
