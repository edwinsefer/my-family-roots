(()=>{
  function run(){
    const input=document.getElementById('search');
    if(!input)return;
    input.oninput=()=>window.render?.();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();