(()=>{
  const STORE='mfr_relationship_edits_v2',PSTORE='mfr_person_edits_v1';
  let people=[],by=new Map(),open=new Set(),view='tree',edits={},pedits={};
  const key=v=>{let s=String(v??'').trim().replace(/^@|@$/g,'').toLowerCase(),m=s.match(/i\d+/i);return m?m[0].toLowerCase():s};
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const GP=window.GEDCOM_PARENTS||{},GS=window.GEDCOM_SPOUSES||{};
  const ged=(m,id)=>m[id]||m[key(id)]||m['@'+key(id)+'@']||m['@'+key(id)]||[];
  function load(){
    people=(window.FAMILY_MEMBERS_STATIC||[]).map(a=>({external_id:a[0],full_name:a[1],sex:a[2],birth_date:a[3],place:a[4],occupation:a[5]}));
    by=new Map(people.map(p=>[key(p.external_id),p]));
    try{edits=JSON.parse(localStorage.getItem(STORE)||'{}')||{};pedits=JSON.parse(localStorage.getItem(PSTORE)||'{}')||{}}catch{edits={};pedits={}}
    people.forEach(p=>open.add(key(p.external_id)));
  }
  function person(p){return Object.assign({},p,pedits[key(p.external_id)]||{})}
  function parents(p){let e=edits[key(p.external_id)];return people.filter(x=>(Array.isArray(e?.parents)?e.parents:ged(GP,p.external_id)).map(key).includes(key(x.external_id)))}
  function spouses(p){let e=edits[key(p.external_id)];return people.filter(x=>(Array.isArray(e?.spouses)?e.spouses:ged(GS,p.external_id)).map(key).includes(key(x.external_id)))}
  function children(p){let k=key(p.external_id);return people.filter(x=>parents(x).some(y=>key(y.external_id)===k))}
  function roots(){
    let hasParents=new Set();
    people.forEach(p=>{if(parents(p).length)hasParents.add(key(p.external_id));});
    let out=[];
    people.filter(p=>!hasParents.has(key(p.external_id))).forEach(p=>{
      let ps=spouses(p);
      if(ps.some(s=>hasParents.has(key(s.external_id))))return;
      let ids=[key(p.external_id),...ps.map(x=>key(x.external_id))];
      if(!out.some(x=>ids.includes(key(x.external_id))))out.push(p);
    });
    return out;
  }
  function matches(p,q){let x=person(p);return `${x.full_name||''} ${x.external_id||''} ${x.place||''} ${x.occupation||''}`.toLowerCase().includes(q)}
  function subtreeHas(p,q,seen=new Set()){
    let k=key(p.external_id);if(seen.has(k))return false;seen.add(k);
    if(matches(p,q))return true;
    return children(p).some(x=>subtreeHas(x,q,new Set(seen)));
  }
  function card(raw){let p=person(raw);return '<div class="person" onclick="profile(\''+esc(p.external_id)+'\')"><div class="name">'+esc(p.full_name||'Unnamed')+'</div><div class="meta">'+esc(p.external_id)+(p.birth_date?' · 🎂 '+esc(p.birth_date):'')+'</div>'+(p.place?'<div class="meta">📍 '+esc(p.place)+'</div>':'')+(p.occupation?'<div class="meta">💼 '+esc(p.occupation)+'</div>':'')+'</div>'}
  function branch(p,seen=new Set(),rendered=new Set()){
    let k=key(p.external_id);if(seen.has(k)||rendered.has(k))return'';
    let n=new Set(seen);n.add(k);rendered.add(k);
    let s=spouses(p),c=children(p);
    let h='<div class="family"><div class="couple">'+card(p)+(s[0]?'<span>💍</span>'+card(s[0]):'')+'</div>';
    if(open.has(k)&&c.length)h+='<div class="children">'+c.map(x=>'<div class="kid">'+branch(x,n,rendered)+'</div>').join('')+'</div>';
    return h+'</div>';
  }
  function listRender(q){
    let a=people.filter(x=>matches(x,q));
    document.getElementById('content').innerHTML='<div class="grid">'+a.map(card).join('')+(a.length?'':'<div class="meta" style="padding:16px">No family member found.</div>')+'</div>';
  }
  function treeRender(q){
    let rs=q?roots().filter(r=>subtreeHas(r,q)):roots();
    let note=q?(rs.length?'🔎 Showing the family branch containing your search.':'No family member found in the tree.'):'GEDCOM relationships are the starting source. Your saved edits override them. No Supabase or Login is required to view the tree.';
    let rendered=new Set();
    document.getElementById('content').innerHTML='<div class="tree"><div class="hint" style="text-align:center">'+note+'</div>'+rs.map(p=>branch(p,new Set(),rendered)).join('')+'</div>';
  }
  function render(){
    let q=(document.getElementById('search')?.value||'').trim().toLowerCase();
    if(view==='list'){listRender(q);return}
    treeRender(q);
  }
  function setView(v){view=v;['t','t2'].forEach(id=>document.getElementById(id)?.classList.toggle('active',v==='tree'));['l','l2'].forEach(id=>document.getElementById(id)?.classList.toggle('active',v==='list'));render()}
  function expandAll(){people.forEach(p=>open.add(key(p.external_id)));render()}
  function collapseAll(){open.clear();render()}
  window.setView=setView;window.render=render;window.expandAll=expandAll;window.collapseAll=collapseAll;
  load();render();
})();