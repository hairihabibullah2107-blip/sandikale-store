const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const toast=$('#toast');let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)}
$('#year').textContent=new Date().getFullYear();
function scrollToTarget(selector){$(selector)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
$('#enterButton').addEventListener('click',()=>scrollToTarget('#studio'));
$$('[data-scroll]').forEach(button=>button.addEventListener('click',()=>scrollToTarget(button.dataset.scroll)));
$('#bagButton').addEventListener('click',()=>{scrollToTarget('#studio');notify('Rancanganmu dibuat di Custom Lab. Lanjutkan untuk mengirim pesanan.')});

let xp=0;const claimed=new Set();
function award(key,points,message){if(claimed.has(key))return;claimed.add(key);xp+=points;$('#xpValue').textContent=String(xp).padStart(3,'0');$('#xpBar').style.width=(xp%200)/2+'%';$('#levelLabel').textContent=xp>=200?'LEVEL 02 — STYLE BUILDER':xp>=100?'LEVEL 01 — CREATOR IN PROGRESS':'LEVEL 01 — ROOKIE CREATOR';notify(message+' +'+points+' XP')}
const shirt=$('#shirtShape'),art=$('#artworkLayer'),designText=$('#designText'),upload=$('#uploadedArt');
let currentColor='#242424',colorName='BLACK',objectUrl=null;const visitedColors=new Set(['BLACK']);
function setColor(button){currentColor=button.dataset.color;colorName=button.dataset.name;shirt.style.fill=currentColor;$('#previewColorName').textContent=colorName+' / BASE';$$('.swatch').forEach(b=>b.classList.toggle('active',b===button));visitedColors.add(colorName);if(visitedColors.size>=3)award('colors',30,'Color explorer selesai!')}
$$('.swatch').forEach(button=>button.addEventListener('click',()=>setColor(button)));
$('#designInput').addEventListener('input',e=>{designText.textContent=e.target.value.trim()||'YOUR IDEA'});
$('#placementSelect').addEventListener('change',e=>{art.classList.remove('position-chest','position-lower');if(e.target.value==='chest')art.classList.add('position-chest');if(e.target.value==='lower')art.classList.add('position-lower')});
$('#artUpload').addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp)$/.test(file.type)){notify('Format file harus PNG, JPG, atau WEBP.');e.target.value='';return}if(file.size>5*1024*1024){notify('Ukuran file maksimal 5 MB untuk preview.');e.target.value='';return}if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(file);upload.onload=()=>award('artwork',50,'Artwork berhasil dipasang pada mockup!');upload.src=objectUrl;art.classList.add('has-image')});
function quantity(){let n=Math.max(1,Math.min(20,parseInt($('#quantity').value||'1',10)));$('#quantity').value=n;return n}
$('#qtyMinus').addEventListener('click',()=>{$('#quantity').value=Math.max(1,quantity()-1);updatePrice()});
$('#qtyPlus').addEventListener('click',()=>{$('#quantity').value=Math.min(20,quantity()+1);updatePrice()});
$('#quantity').addEventListener('change',updatePrice);$('#sizeSelect').addEventListener('change',updatePrice);
function updatePrice(){const extra=['XXL','XXXL'].includes($('#sizeSelect').value)?10000:0;const total=(85000+extra)*quantity();$('#priceValue').textContent='Rp'+total.toLocaleString('id-ID')}
$('#orderButton').addEventListener('click',()=>{const size=$('#sizeSelect').value,qty=quantity(),placement=$('#placementSelect').selectedOptions[0].text,txt=$('#designInput').value.trim()||'Tanpa teks';const total=(85000+(['XXL','XXXL'].includes(size)?10000:0))*qty;const message=['Halo SANDIKALE, saya ingin konsultasi pesanan custom kaos.','','RANCANGAN SANDIKALE STORE','Produk: Classic Tee custom','Warna: '+colorName,'Ukuran: '+size,'Jumlah: '+qty+' pcs','Posisi desain: '+placement,'Teks desain: '+txt,'Estimasi awal: Rp'+total.toLocaleString('id-ID'),'Artwork: '+($('#artUpload').files?.[0]?.name||'Belum ada file'),'','Mohon konfirmasi harga final dan langkah pemesanan.'].join('\n');window.open('https://wa.me/6282266412844?text='+encodeURIComponent(message),'_blank','noopener');award('first-design',100,'Mission complete: First Tee!')});
$('#colorMission').addEventListener('click',()=>{scrollToTarget('#studio');notify('Pilih tiga warna kaos berbeda untuk menyelesaikan misi.')});
$('#resetButton').addEventListener('click',()=>{currentColor='#242424';colorName='BLACK';shirt.style.fill=currentColor;$$('.swatch').forEach(b=>b.classList.toggle('active',b.dataset.name==='BLACK'));$('#previewColorName').textContent='BLACK / BASE';$('#designInput').value='SANDIKALE';designText.textContent='SANDIKALE';$('#placementSelect').value='center';art.classList.remove('position-chest','position-lower','has-image');$('#artUpload').value='';if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null}upload.removeAttribute('src');$('#sizeSelect').value='M';$('#quantity').value=1;updatePrice();notify('Mockup dikembalikan ke pengaturan awal.')});
updatePrice();
window.addEventListener('beforeunload',()=>{if(objectUrl)URL.revokeObjectURL(objectUrl)});
