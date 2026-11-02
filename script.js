const $ = (s) => document.querySelector(s);
const store = {
  get(key, fallback){ try { return JSON.parse(localStorage.getItem('nvd_'+key)) ?? fallback; } catch { return fallback; } },
  set(key, value){ localStorage.setItem('nvd_'+key, JSON.stringify(value)); }
};
let viewDate = new Date(); viewDate.setDate(1);
let selectedDate = new Date(); selectedDate.setHours(0,0,0,0);
let notes = store.get('notes', {});
let events = store.get('events', []);
let photos = store.get('photos', []);
let messages = store.get('messages', []);

const dateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const prettyDate = d => new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(d);
const monthName = d => new Intl.DateTimeFormat('id-ID',{month:'long',year:'numeric'}).format(d);
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2400)}
function renderCalendar(){
  $('#monthLabel').textContent=monthName(viewDate);
  const first=new Date(viewDate.getFullYear(),viewDate.getMonth(),1);
  const start=new Date(first); start.setDate(1-first.getDay());
  const today=dateKey(new Date());
  $('#calendarDays').innerHTML='';
  for(let i=0;i<42;i++){
    const d=new Date(start);d.setDate(start.getDate()+i);
    const key=dateKey(d), b=document.createElement('button');
    b.className='day'+(d.getMonth()!==viewDate.getMonth()?' outside':'')+(key===today?' today':'')+(key===dateKey(selectedDate)?' selected':'')+(notes[key]?' has-note':'');
    b.textContent=d.getDate();b.type='button';b.setAttribute('aria-label',prettyDate(d));
    b.addEventListener('click',()=>{selectedDate=d;renderCalendar();renderNote()});
    $('#calendarDays').appendChild(b);
  }
}
function renderNote(){$('#selectedDateLabel').textContent=prettyDate(selectedDate);$('#dayNote').value=notes[dateKey(selectedDate)]||''}
$('#prevMonth').onclick=()=>{viewDate.setMonth(viewDate.getMonth()-1);renderCalendar()};
$('#nextMonth').onclick=()=>{viewDate.setMonth(viewDate.getMonth()+1);renderCalendar()};
$('#todayBtn').onclick=()=>{viewDate=new Date();viewDate.setDate(1);selectedDate=new Date();selectedDate.setHours(0,0,0,0);renderCalendar();renderNote()};
$('#saveNote').onclick=()=>{const key=dateKey(selectedDate),value=$('#dayNote').value.trim();if(value)notes[key]=value;else delete notes[key];store.set('notes',notes);renderCalendar();toast('Note berhasil disimpan di perangkat ini.')};

function renderEvents(){
 const list=$('#eventList');list.innerHTML='';
 const sorted=[...events].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 if(!sorted.length){list.innerHTML='<div class="empty-events">Belum ada event. Tambahkan agenda pertama angkatan kalian ✨</div>';return}
 sorted.forEach(ev=>{
  const d=new Date(ev.date+'T00:00:00');
  const card=document.createElement('article');card.className='event-card';
  const datebox=document.createElement('div');datebox.className='event-datebox';datebox.innerHTML=`<b>${d.getDate()}</b><small>${new Intl.DateTimeFormat('id-ID',{month:'short'}).format(d).toUpperCase()}</small>`;
  const info=document.createElement('div');info.className='event-info';
  const time=document.createElement('div');time.className='event-time';time.textContent=`${prettyDate(d)}${ev.time?' · '+ev.time:''}`;
  const title=document.createElement('h3');title.textContent=ev.title;
  const desc=document.createElement('p');desc.textContent=ev.description||'Belum ada keterangan tambahan.';
  info.append(time,title,desc);
  if(ev.location){const loc=document.createElement('div');loc.className='event-location';loc.textContent='⌖ '+ev.location;info.append(loc)}
  const del=document.createElement('button');del.className='delete-event';del.type='button';del.textContent='×';del.title='Hapus event';del.onclick=()=>{if(confirm('Hapus event ini?')){events=events.filter(x=>x.id!==ev.id);store.set('events',events);renderEvents();toast('Event dihapus.')}};
  card.append(datebox,info,del);list.append(card);
 });
}
$('#eventForm').addEventListener('submit',e=>{e.preventDefault();events.push({id:Date.now(),title:$('#eventTitle').value.trim(),date:$('#eventDate').value,time:$('#eventTime').value,location:$('#eventLocation').value.trim(),description:$('#eventDescription').value.trim()});store.set('events',events);e.target.reset();renderEvents();toast('Event berhasil ditambahkan!')});
$('#addEventBtn').onclick=()=>{$('#eventTitle').focus();$('#eventFormCard').scrollIntoView({behavior:'smooth',block:'center'})};
$('#closeEventForm').onclick=()=>{$('#eventFormCard').classList.toggle('form-collapsed');$('#eventForm').hidden=!$('#eventForm').hidden};

function renderGallery(){
 const grid=$('#galleryGrid');grid.innerHTML='';
 if(!photos.length){grid.innerHTML='<div class="gallery-empty"><span>✳</span><h3>Every picture tells a story.</h3><p>Unggah foto pertama untuk mulai mengisi galeri angkatan.</p></div>';return}
 photos.forEach((src,index)=>{const item=document.createElement('div');item.className='gallery-item';const img=document.createElement('img');img.src=src;img.alt='Dokumentasi angkatan '+(index+1);const del=document.createElement('button');del.className='gallery-delete';del.textContent='×';del.title='Hapus foto';del.onclick=()=>{photos.splice(index,1);store.set('photos',photos);renderGallery();toast('Foto dihapus.')};item.append(img,del);grid.append(item)});
}
$('#galleryUpload').addEventListener('change',async e=>{
 const files=[...e.target.files].filter(f=>f.type.startsWith('image/'));
 if(photos.length+files.length>24){toast('Maksimal 24 foto pada demo ini.');e.target.value='';return}
 for(const file of files){const data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file)});photos.push(data)}
 try{store.set('photos',photos);renderGallery();toast(files.length+' foto ditambahkan.')}catch(err){toast('Penyimpanan penuh. Coba unggah foto lebih sedikit atau ukuran lebih kecil.')}
 e.target.value='';
});
function renderMessages(){
 const box=$('#chatMessages');box.innerHTML='';
 if(!messages.length){const s=document.createElement('div');s.className='system-message';s.textContent='Selamat datang di ruang obrolan NAVOELA. Mulai percakapan yang positif ✨';box.append(s);return}
 messages.forEach(m=>{const el=document.createElement('div');el.className='message';const name=document.createElement('b');name.textContent=m.name;const p=document.createElement('p');p.textContent=m.text;const time=document.createElement('time');time.textContent=m.time;el.append(name,p,time);box.append(el)});
 box.scrollTop=box.scrollHeight;
}
$('#chatForm').addEventListener('submit',e=>{e.preventDefault();messages.push({name:$('#chatName').value.trim(),text:$('#chatInput').value.trim(),time:new Intl.DateTimeFormat('id-ID',{hour:'2-digit',minute:'2-digit'}).format(new Date())});messages=messages.slice(-80);store.set('messages',messages);$('#chatInput').value='';renderMessages()});
$('#menuToggle').onclick=()=>{const nav=$('#mainNav'),open=nav.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(open))};
$('#mainNav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{$('#mainNav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false')}));
$('#year').textContent=new Date().getFullYear();
renderCalendar();renderNote();renderEvents();renderGallery();renderMessages();
