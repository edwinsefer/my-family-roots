(()=>{
  if(window.__MFR_BACKUP_V1)return; window.__MFR_BACKUP_V1=true;
  const DB='mfr_photo_gallery_db',STORE='photos',LS='mfr_photo_gallery_v1';
  const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const openDB=()=>new Promise((res,rej)=>{try{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id',autoIncrement:true})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}});
  const allPhotos=async()=>{const d=await openDB();return new Promise((res,rej)=>{const q=d.transaction(STORE,'readonly').objectStore(STORE).getAll();q.onsuccess=()=>res(q.result||[]);q.onerror=()=>rej(q.error)})};
  const dataURL=b=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(b)});
  const readFile=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(JSON.parse(r.result));r.onerror=()=>rej(r.error);r.readAsText(f)});
  const saveDownload=(name,text)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)};
  const addPhoto=async p=>{const d=await openDB();return new Promise((res,rej)=>{const q=d.transaction(STORE,'readwrite').objectStore(STORE).add(p);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})};
  const clearPhotos=async()=>{const d=await openDB();return new Promise((res,rej)=>{const q=d.transaction(STORE,'readwrite').objectStore(STORE).clear();q.onsuccess=()=>res();q.onerror=()=>rej(q.error)})};
  async function exportBackup(){
    const localStorageData={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);localStorageData[k]=localStorage.getItem(k)}
    let photos=[];try{for(const p of await allPhotos()){photos.push({...p,data:p.blob?await dataURL(p.blob):p.data||null});delete photos[photos.length-1].blob}}catch{}
    const backup={format:'MFR-BACKUP',version:1,createdAt:new Date().toISOString(),localStorage:localStorageData,photos};
    saveDownload('my-family-roots-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(backup));
    return `Backup created: ${Object.keys(localStorageData).length} local data items and ${photos.length} gallery photos.`;
  }
  async function importBackup(file,status){
    const b=await readFile(file);if(!b||b.format!=='MFR-BACKUP'||b.version!==1)throw new Error('Invalid My Family Roots backup file.');
    if(!confirm('Restore this backup? Existing local app data and photos on this device will be replaced by the backup.'))return;
    const ls=b.localStorage||{};Object.keys(ls).forEach(k=>localStorage.removeItem(k));Object.entries(ls).forEach(([k,v])=>{if(v!=null)localStorage.setItem(k,v)});
    try{await clearPhotos()}catch{}
    let restored=0;for(const p of (b.photos||[])){if(!p.data)continue;try{const blob=await (await fetch(p.data)).blob();const item={...p,blob};delete item.data;delete item.id;await addPhoto(item);restored++}catch{}}
    status.textContent=`✅ Restore complete. ${restored} gallery photos restored. Reloading…`;setTimeout(()=>location.reload(),900);
  }
  function open(){
    document.getElementById('mfrBackupOverlay')?.remove();
    const o=document.createElement('div');o.id='mfrBackupOverlay';o.style='position:fixed;inset:0;background:#24170bcc;z-index:200;overflow:auto;padding:12px';
    o.innerHTML='<div style="max-width:650px;margin:50px auto;background:#fffdf9;border:1px solid #dfd2bf;border-radius:18px;padding:18px;box-shadow:0 12px 40px #0003"><div style="display:flex;align-items:center;gap:8px"><h2 style="margin:0">💾 Family Data Backup</h2><button id="mfrBclose" style="margin-left:auto;padding:9px 12px;border-radius:10px;border:1px solid #dfd2bf;background:#fff">✕ Close</button></div><p style="color:#756a5e;line-height:1.5">Create a backup before installing a new Android version. This includes local app data and family gallery photos stored on this device.</p><button id="mfrBexport" style="width:100%;padding:13px;border-radius:10px;border:1px solid #7b6a55;background:#f4eadc;font-weight:700">⬇️ Create Backup</button><hr style="border:0;border-top:1px solid #eadfce;margin:18px 0"><label style="font-weight:700">Restore from backup</label><input id="mfrBfile" type="file" accept="application/json,.json" style="width:100%;margin-top:8px"><p id="mfrBstatus" style="color:#756a5e;font-size:13px">Keep the backup file somewhere safe (Google Drive, PC, etc.).</p><button id="mfrBrestore" disabled style="width:100%;padding:13px;border-radius:10px;border:1px solid #dfd2bf;background:#fff;font-weight:700">♻️ Restore Backup</button><p style="font-size:12px;color:#8a7d6d;margin-bottom:0">Important: Restore replaces the current device-local app data. Always keep the backup file until you have verified the restored tree and photos.</p></div>';
    document.body.appendChild(o);const file=o.querySelector('#mfrBfile'),restore=o.querySelector('#mfrBrestore'),status=o.querySelector('#mfrBstatus');let selected=null;
    o.querySelector('#mfrBclose').onclick=()=>o.remove();o.querySelector('#mfrBexport').onclick=async()=>{try{status.textContent='⏳ Creating backup…';status.textContent='✅ '+await exportBackup()}catch(e){status.textContent='⚠️ Backup failed: '+e.message}};
    file.onchange=()=>{selected=file.files?.[0]||null;restore.disabled=!selected;status.textContent=selected?'📄 '+selected.name+' selected.':'Keep the backup file somewhere safe.'};
    restore.onclick=async()=>{if(!selected)return;restore.disabled=true;try{await importBackup(selected,status)}catch(e){status.textContent='⚠️ '+e.message;restore.disabled=false}};
  }
  const replace=()=>{const bar=document.querySelector('.bar');if(!bar||bar.querySelector('[data-mfr-backup]'))return;const b=document.createElement('button');b.className='btn';b.dataset.mfrBackup='1';b.textContent='💾 Backup & Restore';b.onclick=open;bar.appendChild(b)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',replace);else replace();setTimeout(replace,400);setTimeout(replace,1200);
})();
