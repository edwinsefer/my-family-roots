(()=>{
  if(window.__MFR_TREE_PHOTO_PREVIEW)return;
  window.__MFR_TREE_PHOTO_PREVIEW=true;
  const DB='mfr_photo_gallery_db',STORE='photos';
  const key=v=>String(v??'').trim().replace(/^@|@$/g,'').toLowerCase();
  const openDb=()=>new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
  const all=()=>openDb().then(d=>new Promise((res,rej)=>{const q=d.transaction(STORE,'readonly').objectStore(STORE).getAll();q.onsuccess=()=>res(q.result||[]);q.onerror=()=>rej(q.error)}));
  function style(){if(document.getElementById('mfrTreePhotoStyle'))return;const s=document.createElement('style');s.id='mfrTreePhotoStyle';s.textContent='.mfr-tree-photo{width:64px;height:64px;object-fit:cover;object-position:center;border-radius:50%;display:block;margin:0 auto 7px;border:2px solid #dfd2bf;background:#f7f1e7}.mfr-tree-photo-wrap{text-align:center}.mfr-tree-photo-label{font-size:10px;color:#756a5e;margin-top:-4px;margin-bottom:5px}';document.head.appendChild(s)}
  function memberMap(){const out=new Map();(window.FAMILY_MEMBERS_STATIC||[]).forEach(p=>out.set(key(p[0]),p[1]));return out}
  function cardId(card,names){
    const onclick=card.getAttribute('onclick')||'';
    const m=onclick.match(/(?:profile|openPerson)\(\s*['\"]([^'\"]+)['\"]\s*\)/i);
    if(m)return key(m[1]);
    const meta=[...card.querySelectorAll('.meta')].map(x=>x.textContent||'').join(' ');
    const id=meta.match(/@I\d+@/i);if(id)return key(id[0]);
    const n=card.querySelector('.name');const text=n?.textContent?.replace(/^👤\s*/,'').trim();
    if(text)for(const [k,v] of names)if(String(v).trim().toLowerCase()===text.toLowerCase())return k;
    return '';
  }
  async function apply(){try{
    const photos=await all();if(!photos.length)return;style();
    const byMember=new Map();photos.forEach(p=>{const k=key(p.member);if(k&&!byMember.has(k))byMember.set(k,p)});
    const names=memberMap();
    document.querySelectorAll('.person,.kidcard,.person-card').forEach(card=>{
      if(card.querySelector('.mfr-tree-photo'))return;
      const memberKey=cardId(card,names),p=byMember.get(memberKey);if(!p)return;
      const img=document.createElement('img');img.className='mfr-tree-photo';img.alt='Family photo';
      if(p.blob)img.src=URL.createObjectURL(p.blob);else if(p.data)img.src=p.data;else return;
      const n=card.querySelector('.name');if(n){const wrap=document.createElement('div');wrap.className='mfr-tree-photo-wrap';wrap.title='Family photo';n.parentNode.insertBefore(wrap,n);wrap.appendChild(img)}
    });
  }catch(e){}}
  const run=()=>{apply();setTimeout(apply,250);setTimeout(apply,800);setTimeout(apply,1600);setTimeout(apply,3000)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  new MutationObserver(()=>{clearTimeout(window.__mfrTreePhotoTimer);window.__mfrTreePhotoTimer=setTimeout(apply,200)}).observe(document.body,{childList:true,subtree:true});
})();