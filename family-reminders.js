(()=>{
  const DAYS_AHEAD=2;
  const legacyAnniversaries=[
    {name:'Christy & Ebenezer',date:'2003-09-04'},
    {name:'Issac & Curie Priya',date:'2010-06-25'},
    {name:'Jenifer & Sudhar',date:'2015-07-03'},
    {name:'Emilyn & Viji',date:'2022-06-10'},
    {name:'Raja Stalin & Muthumani',date:'2012-05-26'},
    {name:'Esther Juliet Selvi & Prabhagar',date:'1998-05-29'},
    {name:'Jelsiya & David',date:'2016-08-29'},
    {name:'Cynthia & Daniel',date:'2023-08-21'},
    {name:'Shaffina & Joshua',date:'2021-08-21'},
    {name:'Edwin & Anbarasi',date:'1990-08-30'}
  ];
  const months={JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
  const pad=n=>String(n).padStart(2,'0');
  const parseBirth=s=>{
    s=String(s||'').trim().toUpperCase().replace(/\./g,' ');
    const m=s.match(/^(?:ABT\s+|BEF\s+|AFT\s+)?(\d{1,2})\s+([A-Z]{3})(?:\s+(\d{4}))?$/);
    if(!m||m[3]==null||months[m[2]]==null)return null;
    return {month:months[m[2]],day:Number(m[1])};
  };
  const parseISO=s=>{const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?{month:Number(m[2])-1,day:Number(m[3])}:null};
  const upcoming=(month,day,today)=>{
    const y=today.getFullYear();
    let d=new Date(y,month,day); d.setHours(0,0,0,0);
    const t=new Date(today); t.setHours(0,0,0,0);
    if(d<t)d=new Date(y+1,month,day);
    const diff=Math.round((d-t)/86400000);
    return diff>=0&&diff<=DAYS_AHEAD?diff:null;
  };
  const fmt=(month,day)=>new Date(2000,month,day).toLocaleDateString('en-IN',{day:'2-digit',month:'short'});
  function init(){
    if(document.getElementById('family-reminders'))return;
    const members=Array.isArray(window.FAMILY_MEMBERS_STATIC)?window.FAMILY_MEMBERS_STATIC:[];
    const today=new Date();
    today.setHours(0,0,0,0);
    const birthdays=[];
    members.forEach(a=>{
      const b=parseBirth(a[3]); if(!b)return;
      const days=upcoming(b.month,b.day,today); if(days!==null)birthdays.push({name:a[1]||'Unnamed',month:b.month,day:b.day,days});
    });
    const anniversaries=[];
    legacyAnniversaries.forEach(e=>{const d=parseISO(e.date);if(!d)return;const days=upcoming(d.month,d.day,today);if(days!==null)anniversaries.push({...e,...d,days});});
    const order=(a,b)=>a.days-b.days||a.month-b.month||a.day-b.day;
    birthdays.sort(order); anniversaries.sort(order);
    const box=document.createElement('section');
    box.id='family-reminders';
    box.className='panel';
    box.style.marginTop='14px';
    const line=(e,icon)=>{
      const when=e.days===0?'இன்று':e.days===1?'நாளை':'2 நாட்களில்';
      return `<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--line)"><span>${icon} <b>${esc(e.name)}</b></span><span><b>${fmt(e.month,e.day)}</b> · ${when}</span></div>`;
    };
    const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const bhtml=birthdays.length?birthdays.map(e=>line(e,'🎂')).join(''):'<div class="hint">அடுத்த 2 நாட்களில் Birthday இல்லை.</div>';
    const ahtml=anniversaries.length?anniversaries.map(e=>line(e,'💍')).join(''):'<div class="hint">அடுத்த 2 நாட்களில் Anniversary இல்லை.</div>';
    box.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><h3 style="margin:0">🔔 Family Reminders</h3><span class="hint" style="margin:0">அடுத்த 2 நாட்கள்</span></div><div style="margin-top:10px"><b>🎂 Birthdays</b>${bhtml}</div><div style="margin-top:14px"><b>💍 Anniversaries</b>${ahtml}</div>`;
    const main=document.querySelector('main.wrap');
    if(main)main.insertBefore(box,main.querySelector('#content'));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();