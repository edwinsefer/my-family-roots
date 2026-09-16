(()=>{
  function ensureGalleryButton(){
    const bar=document.querySelector('.bar');
    if(!bar) return;
    const has=[...bar.querySelectorAll('button')].some(b=>b.textContent.trim()==='📷 Photos & Gallery');
    if(has) return;
    const b=document.createElement('button');
    b.className='btn';
    b.type='button';
    b.textContent='📷 Photos & Gallery';
    b.title='Open Family Photos & Gallery';
    bar.appendChild(b);
  }
  const run=()=>{ensureGalleryButton();setTimeout(ensureGalleryButton,100);setTimeout(ensureGalleryButton,400);setTimeout(ensureGalleryButton,1200)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
