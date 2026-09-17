(()=>{
  if(window.__MFR_UI_POLISH_V1)return;
  window.__MFR_UI_POLISH_V1=true;
  const css=`
  :root{--mfr-ink:#3d3024;--mfr-muted:#756a5e;--mfr-border:#dfd2bf;--mfr-paper:#fffdf9;--mfr-accent:#7b5a36}
  html,body{background:#f7f1e7!important;color:var(--mfr-ink)}
  body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
  button,.btn,input,select,textarea{font:inherit}
  button,.btn{border-radius:12px!important;min-height:42px;transition:transform .12s ease,box-shadow .12s ease,background .12s ease}
  button:active,.btn:active{transform:scale(.98)}
  input,select,textarea{border-radius:12px!important;border-color:var(--mfr-border)!important;background:var(--mfr-paper)!important;color:var(--mfr-ink)!important}
  .bar{gap:8px!important;align-items:center!important;flex-wrap:wrap!important;padding:10px!important}
  .person,.kidcard,.person-card{border-radius:18px!important;border-color:var(--mfr-border)!important;background:rgba(255,253,249,.96)!important;box-shadow:0 4px 14px rgba(61,48,36,.08)!important}
  .person .name,.kidcard .name,.person-card .name{line-height:1.2!important}
  .meta{color:var(--mfr-muted)!important}
  .mfr-tree-photo{box-shadow:0 3px 10px rgba(61,48,36,.16)!important}
  @media(max-width:600px){.bar .btn,button{min-height:44px}.person,.kidcard,.person-card{margin-bottom:10px!important}.bar{padding:8px!important}}
  `;
  const add=()=>{if(document.getElementById('mfrUiPolishV1'))return;const s=document.createElement('style');s.id='mfrUiPolishV1';s.textContent=css;document.head.appendChild(s)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();