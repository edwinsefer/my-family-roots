(()=>{
  function fix(){
    const buttons=[...document.querySelectorAll('.bar .btn')].filter(b=>b.textContent.trim()==='📷 Photos & Gallery');
    buttons.slice(1).forEach(b=>b.remove());
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();
  setTimeout(fix,250);
})();
