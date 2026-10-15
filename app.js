const STORAGE_KEY = "ui1-spesa-v1";
const INITIAL = [
  {id:"dispensa",name:"Dispensa",icon:"📦",groups:[
    {id:"fondamentali",name:"Fondamentali",icon:"☷",items:["Olio d’oliva","Sale fino","Sale grosso","Pepe","Zucchero","Miele","Aceto bianco","Aceto rosso","Dado da brodo","Farina","Pan Grattato","Bicarbonato","Pan carré","Pane","Pasta lunga","Pasta corta","Alici sott’olio","Concentrato di pomodoro","Passata o pelati","Olive","Noci / Mandorle / Pinoli","Spezie / Erbe aromatiche secche","Aglio","Cipolla o scalogno","Patate"]},
    {id:"preferiti",name:"Preferiti",icon:"⭐",items:["Ceci","Tahini","Salsa di soia","Riso da risotto","Riso da fare al vapore","Purè in busta","Tonno in scatola","Basilico fresco"]},
    {id:"snack",name:"Snack",icon:"🍪",items:["Taralli"]},
    {id:"colazione",name:"Colazione",icon:"☕",items:["Cereali o Biscotti o Torta"]}
  ]},
  {id:"frigo",name:"Frigo",icon:"🧊",groups:[
    {id:"fondamentali",name:"Fondamentali",icon:"☷",items:["Uova","Parmigiano (Pezzo o grattuggiato)","Latte","Burro","Yogurt","Limoni scorza edibile","Zenzero","Capperi","Ketchup","Maionese","Senape"]},
    {id:"preferiti",name:"Preferiti",icon:"⭐",items:[]},
    {id:"snack",name:"Snack",icon:"🍪",items:["Salamino"]}
  ]},
  {id:"freezer",name:"Freezer",icon:"❄️",groups:[
    {id:"fondamentali",name:"Fondamentali",icon:"☷",items:["Ghiaccio pronto","Prezzemolo surgelato","Pizza","Patatine fritte"]},
    {id:"preferiti",name:"Preferiti",icon:"⭐",items:[]},
    {id:"snack",name:"Snack",icon:"🍪",items:[]}
  ]},
  {id:"quotidiane",name:"Compere quotidiane",icon:"🛍️",items:["Pane fresco","Latte fresco","Carne o pesce","Insalata"]}
];
let data = load();
let openLists = new Set();
let openGroups = new Set();
let shoppingMode = false;
let checked = new Set();

function clone(x){return JSON.parse(JSON.stringify(x))}
function load(){
  try { const s=localStorage.getItem(STORAGE_KEY); if(s){const parsed=JSON.parse(s);if(Array.isArray(parsed))return parsed;} } catch(e){}
  return clone(INITIAL);
}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));const s=document.getElementById("status");s.textContent="Salvato";s.style.background="#edf1e9";}
function notify(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.remove("hidden");clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.classList.add("hidden"),2300);}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function key(l,g,item){return l+"::"+g+"::"+item;}
function total(l){return l.groups?l.groups.reduce((n,g)=>n+g.items.length,0):l.items.length;}
function render(){
 const root=document.getElementById("lists");
 root.innerHTML=data.map((l,li)=>{
   const isOpen=openLists.has(l.id);
   const body=l.groups?l.groups.map((g,gi)=>{
     const gkey=l.id+"::"+g.id,go=openGroups.has(gkey);
     return `<section class="group-card"><button class="group-head" type="button" data-toggle-group="${esc(gkey)}"><span class="group-icon">${g.icon}</span><strong>${esc(g.name)}</strong><span class="count">${g.items.length} elementi</span><span class="chevron">${go?"⌃":"⌄"}</span></button>${go?`<div class="group-body">${itemsHtml(l.id,g.id,g.items)}${addHtml(l.id,g.id)}</div>`:""}</section>`;
   }).join(""):`<div class="group-body">${itemsHtml(l.id,"__daily",l.items)}${addHtml(l.id,"__daily")}</div>`;
   return `<article class="list-card"><button class="list-head" type="button" data-toggle-list="${esc(l.id)}"><span class="list-icon">${l.icon}</span><span class="head-text"><strong>${esc(l.name)}</strong><span class="count">${total(l)} elementi</span></span><span class="chevron">${isOpen?"⌃":"⌄"}</span></button>${isOpen?`<div class="list-body">${body}</div>`:""}</article>`;
 }).join("");
 root.querySelectorAll("[data-toggle-list]").forEach(b=>b.onclick=()=>{const k=b.dataset.toggleList;openLists.has(k)?openLists.delete(k):openLists.add(k);render();});
 root.querySelectorAll("[data-toggle-group]").forEach(b=>b.onclick=()=>{const k=b.dataset.toggleGroup;openGroups.has(k)?openGroups.delete(k):openGroups.add(k);render();});
 root.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addItem(b.dataset.list,b.dataset.group));
 root.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteItem(b.dataset.list,b.dataset.group,Number(b.dataset.index)));
 root.querySelectorAll("[data-move]").forEach(b=>b.onclick=()=>moveItem(b.dataset.list,b.dataset.group,Number(b.dataset.index),Number(b.dataset.delta)));
 root.querySelectorAll("[data-check]").forEach(c=>c.onchange=()=>{c.checked?checked.add(c.dataset.check):checked.delete(c.dataset.check);c.closest(".item").classList.toggle("done",c.checked);});
 document.getElementById("shoppingMode").classList.toggle("active",shoppingMode);
 document.getElementById("shoppingMode").textContent=shoppingMode?"✓ Modalità spesa attiva":"☑ Modalità spesa";
 document.getElementById("resetChecks").classList.toggle("hidden",!shoppingMode);
}
function itemsHtml(li,gi,items){
 if(!items.length)return '<div class="empty">Nessun elemento.</div>';
 return items.map((item,i)=>{
   const k=key(li,gi,item),done=checked.has(k);
   return `<div class="item ${done?"done":""}">${shoppingMode?`<label><input type="checkbox" data-check="${esc(k)}" ${done?"checked":""}><span class="item-name">${esc(item)}</span></label>`:`<span class="item-name" style="flex:1">${esc(item)}</span>`}<button class="icon-btn" aria-label="Sposta su" title="Sposta su" data-move data-list="${esc(li)}" data-group="${esc(gi)}" data-index="${i}" data-delta="-1" ${i===0?"disabled":""}>↑</button><button class="icon-btn" aria-label="Sposta giù" title="Sposta giù" data-move data-list="${esc(li)}" data-group="${esc(gi)}" data-index="${i}" data-delta="1" ${i===items.length-1?"disabled":""}>↓</button><button class="icon-btn delete" aria-label="Elimina" title="Elimina" data-delete data-list="${esc(li)}" data-group="${esc(gi)}" data-index="${i}">×</button></div>`;
 }).join("");
}
function addHtml(li,gi){return `<div class="add-row"><input id="add-${esc(li)}-${esc(gi)}" type="text" placeholder="Nuovo elemento…" maxlength="100"><button class="add-btn" data-add data-list="${esc(li)}" data-group="${esc(gi)}">Aggiungi</button></div>`;}
function locate(li,gi){const l=data.find(x=>x.id===li);if(!l)return null;if(gi==="__daily")return {l,items:l.items};const g=l.groups?.find(x=>x.id===gi);return g?{l,g,items:g.items}:null;}
function addItem(li,gi){const input=document.getElementById(`add-${li}-${gi}`);const val=input.value.trim();if(!val){input.focus();return;}const loc=locate(li,gi);if(!loc)return;loc.items.push(val);save();render();openLists.add(li);if(gi!=="__daily")openGroups.add(li+"::"+gi);render();notify("Elemento aggiunto");}
function deleteItem(li,gi,i){const loc=locate(li,gi);if(!loc)return;const item=loc.items[i];if(!confirm(`Eliminare “${item}” dalla lista?`))return;loc.items.splice(i,1);checked.delete(key(li,gi,item));save();render();notify("Elemento eliminato");}
function moveItem(li,gi,i,delta){const loc=locate(li,gi);if(!loc)return;const j=i+delta;if(j<0||j>=loc.items.length)return;[loc.items[i],loc.items[j]]=[loc.items[j],loc.items[i]];save();render();openLists.add(li);if(gi!=="__daily")openGroups.add(li+"::"+gi);render();}
document.getElementById("shoppingMode").onclick=()=>{shoppingMode=!shoppingMode;render();};
document.getElementById("resetChecks").onclick=()=>{if(confirm("Azzero tutte le spunte della modalità spesa?")){checked.clear();render();}};
document.getElementById("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({version:1,data},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="backup-liste-spesa.json";a.click();URL.revokeObjectURL(a.href);notify("Backup esportato");};
document.getElementById("importBtn").onclick=()=>document.getElementById("importFile").click();
document.getElementById("importFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text());const arr=Array.isArray(obj)?obj:obj.data;if(!Array.isArray(arr)||!arr.every(x=>x&&typeof x.name==="string"))throw Error("Formato non valido");if(confirm("Importare il backup e sostituire le liste attuali?")){data=arr;save();openLists.clear();openGroups.clear();render();notify("Backup importato");}}catch(err){alert("Impossibile importare il file. Verifica che sia un backup di questa app.");}e.target.value="";};
document.getElementById("resetBtn").onclick=()=>{if(confirm("Ripristinare le liste iniziali? Le modifiche attuali verranno sostituite.")){data=clone(INITIAL);checked.clear();save();openLists.clear();openGroups.clear();render();notify("Liste iniziali ripristinate");}};
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
