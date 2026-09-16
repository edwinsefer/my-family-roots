(()=>{
  try{
    const key='mfr_custom_reminders_v1';
    const a=JSON.parse(localStorage.getItem(key)||'[]');
    const b=a.filter(x=>!(String(x?.member)==='@I125@' && String(x?.note).trim().toLowerCase()==='test'));
    if(b.length!==a.length)localStorage.setItem(key,JSON.stringify(b));
  }catch{}
})();