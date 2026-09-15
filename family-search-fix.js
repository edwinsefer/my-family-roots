(()=>{
  function key(v){return String(v??'').trim().replace(/^@|@$/g,'').toLowerCase()}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function run(){
    const input=document.getElementById('search'),content=document.getElementById('content');
    if(!input||!content)return;
    input.oninput=()=>{
      const q=input.value.trim().toLowerCase();
      if(!q){ window.render?.(); return; }
      const people=(window.FAMILY_MEMBERS_STATIC||[]).map(a=>({external_id:a[0],full_name:a[1],sex:a[2],birth_date:a[3],place:a[4],occupation:a[5]}));
      const hits=people.filter(p=>`${p.full_name||''} ${p.external_id||''} ${p.place||''} ${p.occupation||''}`.toLowerCase().includes(q));
      content.innerHTML='<div class="grid">'+hits.map(p=>`<div class="person" onclick="profile('${esc(p.external_id)}')"><div class="name">${esc(p.full_name||'Unnamed')}</div><div class="meta">${esc(p.external_id)}${p.birth_date?' · 🎂 '+esc(p.birth_date):''}</div>${p.place?`<div class="meta">📍 ${esc(p.place)}</div>`:''}${p.occupation?`<div class="meta">💼 ${esc(p.occupation)}</div>`:''}</div>`).join('')+(hits.length?'':'<div class="meta" style="padding:16px">No family member found.</div>')+'</div>';
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();