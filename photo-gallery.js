/* My Family Roots — Photo & Gallery foundation (Stage 1) */
(()=>{
  if(window.__MFR_PHOTO_GALLERY_LOADED)return;
  window.__MFR_PHOTO_GALLERY_LOADED=true;
  document.addEventListener('DOMContentLoaded',()=>{
    const KEY='mfr_photo_gallery_v1';
    let photos=[];
    try{photos=JSON.parse(localStorage.getItem(KEY)||'[]')}catch{photos=[]}
    const save=()=>localStorage.setItem(KEY,JSON.stringify(photos));
    const members=()=>window.FAMILY_MEMBERS_STATIC||[];
    const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const nameOf=id=>{const x=members().find(p=>String(p[0]).toLowerCase()===String(id).toLowerCase());return x?.[1]||'Unnamed'};
    const open=()=>{
      let old=document.getElementById('mfrGalleryOverlay');if(old)old.remove();
      const o=document.createElement('div');o.id='mfrGalleryOverlay';
      o.style='position:fixed;inset:0;background:#24170bcc;z-index:100;overflow:auto;padding:12px';
      const opts=members().map(p=>'<option value="'+esc(p[0])+'">'+esc(p[1]||'Unnamed')+' ['+esc(p[0])+']</option>').join('');
      o.innerHTML='<div style="max-width:900px;margin:auto;background:#fffdf9;border:1px solid #dfd2bf;border-radius:18px;padding:16px"><div style="display:flex;align-items:center;gap:8px"><h2 style="margin:0">📷 Family Photos & Gallery</h2><button id="mfrClose" style="margin-left:auto;padding:9px 12px;border-radius:10px;border:1px solid #dfd2bf;background:#fff">✕ Close</button></div><p style="color:#756a5e;font-size:13px">Stage 1: photos are saved on this device. Shared cloud gallery will come with database sync later.</p><label>Family member</label><select id="mfrPhotoMember" style="width:100%;padding:10px;border:1px solid #dfd2bf;border-radius:10px">'+opts+'</select><label>Caption</label><input id="mfrPhotoCaption" placeholder="e.g. Wedding day" style="width:100%;padding:10px;border:1px solid #dfd2bf;border-radius:10px"><label>Date</label><input id="mfrPhotoDate" type="date" style="width:100%;padding:10px;border:1px solid #dfd2bf;border-radius:10px"><label>Choose photo</label><input id="mfrPhotoFile" type="file" accept="image/*" style="width:100%;padding:10px;border:1px solid #dfd2bf;border-radius:10px"><div id="mfrPhotoGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-top:16px"></div></div>';
      document.body.appendChild(o);
      document.getElementById('mfrClose').onclick=()=>o.remove();
      const render=()=>{const g=document.getElementById('mfrPhotoGrid');g.innerHTML=photos.length?photos.map((p,i)=>'<div style="background:#fff;border:1px solid #dfd2bf;border-radius:14px;padding:8px"><img src="'+p.data+'" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px"><b>'+esc(nameOf(p.member))+'</b><div style="font-size:12px;color:#756a5e">'+esc(p.caption||'')+(p.date?' · '+esc(p.date):'')+'</div><button data-i="'+i+'" style="margin-top:6px;padding:6px 9px;border-radius:8px;border:1px solid #dfd2bf;background:#fff">Delete</button></div>').join(''):'<div style="color:#756a5e">No photos yet. Add the first family photo above.</div>';g.querySelectorAll('button[data-i]').forEach(b=>b.onclick=()=>{photos.splice(Number(b.dataset.i),1);save();render()})};
      document.getElementById('mfrPhotoFile').onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>4*1024*1024){alert('Please choose a photo under 4 MB for device storage.');e.target.value='';return}const r=new FileReader();r.onload=()=>{photos.unshift({member:document.getElementById('mfrPhotoMember').value,caption:document.getElementById('mfrPhotoCaption').value.trim(),date:document.getElementById('mfrPhotoDate').value,data:r.result});save();render();e.target.value='';document.getElementById('mfrPhotoCaption').value='';document.getElementById('mfrPhotoDate').value=''};r.readAsDataURL(f)};
      render();
    };
    const b=document.createElement('button');b.className='btn';b.textContent='📷 Photos & Gallery';b.onclick=open;document.querySelector('.bar')?.appendChild(b);
  });
})();