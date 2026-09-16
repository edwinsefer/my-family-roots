(()=>{
  if(window.__MFR_PHOTO_GALLERY_V3)return;
  window.__MFR_PHOTO_GALLERY_V3=true;
  const LS='mfr_photo_gallery_v1',DB='mfr_photo_gallery_db',STORE='photos';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const members=()=>window.FAMILY_MEMBERS_STATIC||[];
  const nameOf=id=>{const x=members().find(p=>String(p[0]).toLowerCase()===String(id).toLowerCase());return x?.[1]||'Unnamed'};
  let dbp,photos=[],pendingFiles=[],editingId=null;
  const db=()=>dbp||(dbp=new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'id',autoIncrement:true});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)}));
  const all=()=>db().then(d=>new Promise((res,rej)=>{const q=d.transaction(STORE,'readonly').objectStore(STORE).getAll();q.onsuccess=()=>res(q.result||[]);q.onerror=()=>rej(q.error)}));
  const add=x=>db().then(d=>new Promise((res,rej)=>{const q=d.transaction(STORE,'readwrite').objectStore(STORE).add(x);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)}));
  const update=x=>db().then(d=>new Promise((res,rej)=>{const q=d.transaction(STORE,'readwrite').objectStore(STORE).put(x);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)}));
  const del=id=>db().then(d=>new Promise((res,rej)=>{const q=d.transaction(STORE,'readwrite').objectStore(STORE).delete(id);q.onsuccess=()=>res();q.onerror=()=>rej(q.error)}));
  const compress=f=>new Promise((resolve,reject)=>{
    const type=(f.type||'').toLowerCase(),name=(f.name||'').toLowerCase();
    const isImage=type.startsWith('image/')||/\.(jpe?g|png|webp|gif|bmp|heic|heif|avif)$/i.test(name);
    if(!isImage)return reject(new Error('not-image'));
    const r=new FileReader();
    r.onload=()=>{
      const im=new Image();
      im.onload=()=>{try{const max=1600,s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*s));c.height=Math.max(1,Math.round(im.height*s));c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?resolve(b):resolve(f), 'image/jpeg',.86)}catch{resolve(f)}};
      im.onerror=()=>resolve(f);
      im.src=r.result;
    };
    r.onerror=()=>resolve(f);
    r.readAsDataURL(f);
  });
  const legacy=()=>{try{return JSON.parse(localStorage.getItem(LS)||'[]')||[]}catch{return[]}};
  async function load(){try{photos=await all();if(!photos.length){for(const p of legacy()){try{const blob=await (await fetch(p.data)).blob();await add({member:p.member,caption:p.caption,date:p.date,blob})}catch{}}if(legacy().length)localStorage.removeItem(LS);photos=await all()}}catch{photos=legacy().map((p,i)=>({...p,id:'legacy-'+i}))}}
  function open(){
    document.getElementById('mfrGalleryOverlay')?.remove(); pendingFiles=[]; editingId=null;
    const o=document.createElement('div');o.id='mfrGalleryOverlay';o.style='position:fixed;inset:0;background:#24170bcc;z-index:100;overflow:auto;padding:12px';
    const opts=members().map(p=>'<option value="'+esc(p[0])+'">'+esc(p[1]||'Unnamed')+' ['+esc(p[0])+']</option>').join('');
    o.innerHTML='<div style="max-width:900px;margin:auto;background:#fffdf9;border:1px solid #dfd2bf;border-radius:18px;padding:16px"><div style="display:flex;align-items:center;gap:8px"><h2 style="margin:0">📷 Family Photos & Gallery</h2><button id="mfrClose3" style="margin-left:auto;padding:9px 12px;border-radius:10px;border:1px solid #dfd2bf;background:#fff">✕ Close</button></div><p style="color:#756a5e;font-size:13px">Photos stay on this device for now. JPG, JPEG, PNG, WEBP and phone gallery image files are supported; shared cloud gallery will come with database sync later.</p><label>Family member</label><select id="mfrM3" style="width:100%;padding:10px;border:1px solid #dfd2bf;border-radius:10px">'+opts+'</select><label>Caption</label><input id="mfrC3" placeholder="e.g. Wedding day" style="width:100%;padding:10px;border:1px solid #dfd2bf;border-radius:10px"><label>Date</label><input id="mfrD3" type="date" style="width:100%;padding:10px;border:1px solid #dfd2bf;border-radius:10px"><label>Photo</label><button id="mfrPick3" style="width:100%;padding:13px;border-radius:10px;border:1px solid #dfd2bf;background:#fff;font:inherit;text-align:left">📱 Choose from Photos / Gallery</button><input id="mfrF3" type="file" accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.heic,.heif,.avif" multiple style="display:none"><div id="mfrH3" style="margin-top:7px;color:#756a5e;font-size:12px">Select one or more photos.</div><div id="mfrActions3" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button id="mfrSave3" style="padding:10px 14px;border-radius:10px;border:1px solid #7b6a55;background:#f4eadc;font-weight:700">💾 Save Photo</button><button id="mfrCancel3" style="display:none;padding:10px 14px;border-radius:10px;border:1px solid #dfd2bf;background:#fff">Cancel Edit</button></div><div id="mfrG3" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-top:16px"></div></div>';
    document.body.appendChild(o);
    const M=o.querySelector('#mfrM3'),C=o.querySelector('#mfrC3'),D=o.querySelector('#mfrD3'),F=o.querySelector('#mfrF3'),H=o.querySelector('#mfrH3'),save=o.querySelector('#mfrSave3'),cancel=o.querySelector('#mfrCancel3');
    o.querySelector('#mfrClose3').onclick=()=>o.remove();
    o.querySelector('#mfrPick3').onclick=()=>F.click();
    const reset=()=>{editingId=null;pendingFiles=[];save.textContent='💾 Save Photo';cancel.style.display='none';C.value='';D.value='';F.value='';H.textContent='Select one or more photos.'};
    cancel.onclick=reset;
    F.onchange=e=>{pendingFiles=[...e.target.files||[]];H.textContent=pendingFiles.length?'📷 '+pendingFiles.length+' photo'+(pendingFiles.length>1?'s':'')+' selected. Press Save Photo.':'Select one or more photos.'};
    const render=()=>{const g=o.querySelector('#mfrG3');g.innerHTML=photos.length?photos.map((p,i)=>{const src=p.blob?URL.createObjectURL(p.blob):p.data;return '<div style="background:#fff;border:1px solid #dfd2bf;border-radius:14px;padding:8px"><img src="'+src+'" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px" onerror="this.style.display=\'none\'"><b>'+esc(nameOf(p.member))+'</b><div style="font-size:12px;color:#756a5e">'+esc(p.caption||'')+(p.date?' · '+esc(p.date):'')+'</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><button data-edit="'+i+'" style="padding:6px 9px;border-radius:8px;border:1px solid #dfd2bf;background:#fff">✏️ Edit</button><button data-del="'+i+'" style="padding:6px 9px;border-radius:8px;border:1px solid #dfd2bf;background:#fff">Delete</button></div></div>'}).join(''):'<div style="color:#756a5e">No photos yet. Add the first family photo above.</div>';g.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const p=photos[+b.dataset.edit];if(!p)return;editingId=p.id;M.value=p.member;C.value=p.caption||'';D.value=p.date||'';pendingFiles=[];F.value='';H.textContent='Optional: choose a new photo to replace this one.';save.textContent='💾 Save Changes';cancel.style.display='inline-block';o.querySelector('#mfrM3').scrollIntoView({behavior:'smooth',block:'start'})});g.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{const p=photos[+b.dataset.del];if(!p)return;if(!confirm('Delete this family photo?'))return;try{if(typeof p.id==='number')await del(p.id);photos.splice(+b.dataset.del,1);if(editingId===p.id)reset();render()}catch{H.textContent='⚠️ Could not delete. Try again.'}})};
    save.onclick=async()=>{if(!M.value)return;H.textContent='⏳ Saving…';try{if(editingId!=null){const old=photos.find(p=>String(p.id)===String(editingId));if(!old)throw new Error('missing');let blob=old.blob;if(pendingFiles.length)blob=await compress(pendingFiles[0]);const item={id:old.id,member:M.value,caption:C.value.trim(),date:D.value,blob};await update(item);photos=photos.map(p=>String(p.id)===String(editingId)?item:p);H.textContent='✅ Changes saved.';render();reset()}else{if(!pendingFiles.length){H.textContent='⚠️ Choose at least one photo first.';return}let saved=0;for(const f of pendingFiles){try{const blob=await compress(f),item={member:M.value,caption:C.value.trim(),date:D.value,blob};item.id=await add(item);photos.unshift(item);saved++}catch{}}if(!saved)throw new Error('no-photo-saved');H.textContent='✅ '+saved+' photo'+(saved>1?'s':'')+' saved. Add more if needed.';render();C.value='';D.value='';pendingFiles=[];F.value=''}}catch(e){H.textContent=e?.message==='not-image'?'⚠️ Please choose an image file (JPG/JPEG/PNG/WEBP or a phone photo).':'⚠️ Could not save this photo. Try one photo first.'}};
    load().then(render);
  }
  const replace=()=>{const buttons=[...document.querySelectorAll('.bar .btn')].filter(b=>b.textContent.trim()==='📷 Photos & Gallery');if(!buttons.length)return;buttons.forEach(b=>b.remove());const b=document.createElement('button');b.className='btn';b.textContent='📷 Photos & Gallery';b.onclick=open;document.querySelector('.bar')?.appendChild(b)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',replace);else replace();setTimeout(replace,300);setTimeout(replace,1000);
})();