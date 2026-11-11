const toast = document.getElementById('toast');
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('enterButton').addEventListener('click',()=>document.getElementById('catalog').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
document.getElementById('quickButton').addEventListener('click',()=>document.getElementById('catalog').scrollIntoView({behavior:'smooth'}));
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{const item=button.dataset.product;if(item==='Classic Tee'){notify('Classic Tee dipilih. Studio kustomisasi sedang disiapkan.')}else{notify(item+' akan tersedia pada tahap berikutnya.')}}));
document.getElementById('studioButton').addEventListener('click',()=>notify('Custom Lab: fitur upload dan live preview masuk tahap pengembangan berikutnya.'));
document.getElementById('bagButton').addEventListener('click',()=>notify('Keranjang akan aktif setelah katalog dan checkout terhubung ke database.'));
