(()=>{
  function addEditButtons(){
    document.querySelectorAll('#content .person').forEach(card=>{
      if(card.querySelector('.mfr-edit-btn')) return;
      const onclick=card.getAttribute('onclick')||'';
      const m=onclick.match(/profile\('([^']+)'\)/);
      if(!m) return;
      const id=m[1];
      const b=document.createElement('button');
      b.type='button'; b.className='mfr-edit-btn'; b.textContent='✏️ Edit';
      b.style.cssText='margin-top:8px;padding:6px 9px;border:1px solid #dfd2bf;border-radius:8px;background:#6b4f2f;color:#fff;cursor:pointer';
      b.onclick=e=>{e.stopPropagation();location.href='family-editor2.html?person='+encodeURIComponent(id)+'&v=20260916-2'};
      card.appendChild(b);
    });
  }
  const start=()=>{addEditButtons();new MutationObserver(addEditButtons).observe(document.getElementById('content')||document.body,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();