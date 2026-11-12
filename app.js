const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const toast=$('#toast');let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}
$('#year').textContent=new Date().getFullYear();
const waNumber='6282266412844';
const products={
 classic:{name:'Classic Tee',price:85000,category:'Produk custom',description:'Regular fit · Custom print'},
 oversized:{name:'Oversized Tee',price:null,category:'Produk pilihan',description:'Relaxed fit · Konfirmasi ketersediaan'},
 project:{name:'Custom Project',price:null,category:'Layanan custom',description:'Bawa desain dan ide sendiri'}
};
let cart=[];
function openCart(){$('body').classList.add('cart-open');$('#cartDrawer').setAttribute('aria-hidden','false')}
function closeCart(){$('body').classList.remove('cart-open');$('#cartDrawer').setAttribute('aria-hidden','true')}
$('#cartOpen').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);$('#drawerBackdrop').addEventListener('click',closeCart);
function updateCart(){const count=cart.reduce((n,x)=>n+x.qty,0);$('#cartCount').textContent=count;$('#drawerCount').textContent=count;const host=$('#cartItems');if(!cart.length){host.innerHTML='<p class="empty-cart">Belum ada item. Temukan produk yang kamu suka.</p>';return}host.innerHTML=cart.map((x,i)=>'<div class="cart-row"><div><strong>'+x.name+'</strong><small>'+x.details+' · '+x.qty+' item</small></div><button data-remove="'+i+'">REMOVE ×</button></div>').join('');$$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{cart.splice(Number(b.dataset.remove),1);updateCart()}))}
function addCart(id){const p=products[id];cart.push({name:p.name,details:p.description,qty:1});updateCart();openCart();notify(p.name+' ditambahkan ke bag.')}
$$('[data-product]').forEach(b=>b.addEventListener('click',()=>{const p=products[b.dataset.product];notify(p.name+' — '+p.description+'. Pilih opsi custom atau hubungi kami.')}));
$$('[data-custom]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.custom;if(id==='classic'){addCart(id);$('#designText').focus()}else{sendWhatsApp(['Halo SANDIKALE, saya ingin bertanya tentang '+products[id].name+'.','Mohon informasi model, harga, dan ketersediaannya.'].join('\n'))}}));
$$('.filter-tab').forEach(b=>b.addEventListener('click',()=>{$$('.filter-tab').forEach(x=>x.classList.toggle('active',x===b));applyFilters()}));
$('#catalogSearch').addEventListener('input',applyFilters);
function applyFilters(){const filter=$('.filter-tab.active').dataset.filter,query=$('#catalogSearch').value.trim().toLowerCase();$$('.product-card').forEach(card=>{const category=card.dataset.category,matchCategory=filter==='all'||category===filter,matchText=(card.dataset.search+' '+card.innerText).toLowerCase().includes(query);card.hidden=!(matchCategory&&matchText)})}
$$('[data-custom]').forEach(()=>{});
$('#menuToggle').addEventListener('click',()=>$('#mobileNav').classList.toggle('open'));
$$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>$('#mobileNav').classList.remove('open')));
function sendWhatsApp(message){window.open('https://wa.me/'+waNumber+'?text='+encodeURIComponent(message),'_blank','noopener')}
$('#checkoutCart').addEventListener('click',()=>{if(!cart.length){notify('Bag masih kosong.');return}const lines=cart.map((x,i)=>(i+1)+'. '+x.name+' — '+x.details+' — '+x.qty+' item');sendWhatsApp(['Halo SANDIKALE, saya ingin konsultasi pesanan dari katalog.','',...lines,'','Mohon konfirmasi harga dan ketersediaan.'].join('\n'))});
const shirtBody=$('#shirtBody'),mockupArt=$('#mockupArt'),mockupText=$('#mockupText'),artPreview=$('#artPreview');let colorName='BLACK',currentColor='#292929',objectUrl=null,currentView='front';
$$('.swatch').forEach(b=>b.addEventListener('click',()=>{currentColor=b.dataset.color;colorName=b.dataset.name;shirtBody.style.fill=currentColor;$$('.swatch').forEach(x=>x.classList.toggle('active',x===b))}));
$('#designText').addEventListener('input',e=>{mockupText.textContent=e.target.value.trim()||'YOUR DESIGN'});
$$('.view-button').forEach(b=>b.addEventListener('click',()=>{currentView=b.dataset.view;$$('.view-button').forEach(x=>x.classList.toggle('active',x===b));$('#viewLabel').textContent=currentView.toUpperCase()+' VIEW / 001';mockupText.textContent=currentView==='front'?($('#designText').value.trim()||'YOUR DESIGN'):'BACK DESIGN';mockupArt.classList.toggle('back-view',currentView==='back')}));
$('#artFile').addEventListener('change',e=>{const file=e.target.files&&e.target.files[0];if(!file)return;if(!/^image\/(png|jpeg|webp)$/.test(file.type)){notify('Gunakan file PNG, JPG, atau WEBP.');e.target.value='';return}if(file.size>5*1024*1024){notify('Ukuran file maksimal 5 MB.');e.target.value='';return}if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(file);artPreview.onload=()=>mockupArt.classList.add('has-image');artPreview.src=objectUrl});
function qty(){const n=Math.max(1,Math.min(20,parseInt($('#quantity').value||'1',10)));$('#quantity').value=n;return n}
function updatePrice(){const extra=['XXL','XXXL'].includes($('#shirtSize').value)?10000:0;$('#priceEstimate').textContent='Rp'+((85000+extra)*qty()).toLocaleString('id-ID')}
$('#qtyDown').addEventListener('click',()=>{$('#quantity').value=Math.max(1,qty()-1);updatePrice()});$('#qtyUp').addEventListener('click',()=>{$('#quantity').value=Math.min(20,qty()+1);updatePrice()});$('#quantity').addEventListener('change',updatePrice);$('#shirtSize').addEventListener('change',updatePrice);
$('#sendDesign').addEventListener('click',()=>{const size=$('#shirtSize').value,quantity=qty(),extra=['XXL','XXXL'].includes(size)?10000:0,total=(85000+extra)*quantity;const msg=['Halo SANDIKALE, saya ingin konsultasi custom kaos.','','RANCANGAN CUSTOM','Model: Custom Tee','Warna: '+colorName,'Ukuran: '+size,'Jumlah: '+quantity+' pcs','Tampilan mockup: '+currentView.toUpperCase(),'Teks desain: '+($('#designText').value.trim()||'Tidak ada'),'Artwork: '+($('#artFile').files[0]?.name||'Belum diunggah'),'Estimasi awal: Rp'+total.toLocaleString('id-ID'),'','Mohon konfirmasi harga final dan cara mengirim file artwork.'].join('\n');sendWhatsApp(msg)});
$('#resetCustom').addEventListener('click',()=>{currentColor='#292929';colorName='BLACK';shirtBody.style.fill=currentColor;$$('.swatch').forEach(b=>b.classList.toggle('active',b.dataset.name==='BLACK'));$('#designText').value='YOUR DESIGN';mockupText.textContent='YOUR DESIGN';$('#shirtSize').value='M';$('#quantity').value=1;currentView='front';$$('.view-button').forEach(b=>b.classList.toggle('active',b.dataset.view==='front'));mockupArt.classList.remove('back-view','has-image');$('#viewLabel').textContent='FRONT VIEW / 001';$('#artFile').value='';if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null}artPreview.removeAttribute('src');updatePrice();notify('Customizer dikembalikan ke pengaturan awal.')});
updatePrice();updateCart();window.addEventListener('beforeunload',()=>{if(objectUrl)URL.revokeObjectURL(objectUrl)});
