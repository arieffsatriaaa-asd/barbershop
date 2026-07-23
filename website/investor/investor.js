  const WA_NUMBER = '6281234567890'; // TODO: ganti dengan nomor WhatsApp admin/investor relations asli

  const investorForm = document.getElementById('investorForm');
  if(investorForm){
    investorForm.addEventListener('submit', function(e){
      e.preventDefault();

      const name = document.getElementById('ivName').value.trim();
      const wa = document.getElementById('ivWa').value.trim();
      const email = document.getElementById('ivEmail').value.trim();
      const city = document.getElementById('ivCity').value.trim();
      const tierSelect = document.getElementById('ivTier');
      const tier = tierSelect.options[tierSelect.selectedIndex].text;
      const modalSelect = document.getElementById('ivModal');
      const modal = modalSelect.options[modalSelect.selectedIndex].text;
      const msg = document.getElementById('ivMsg').value.trim();

      const lines = [
        'Halo Noblesse Barber Co., saya tertarik untuk berinvestasi/waralaba:',
        '',
        `Nama: ${name}`,
        `WhatsApp: ${wa}`,
        `Email: ${email}`,
        `Lokasi Target: ${city}`,
        `Tier Investasi: ${tier}`,
        `Estimasi Modal Ready: ${modal}`,
        msg ? `Pesan: ${msg}` : null
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      const btn = document.getElementById('ivSubmit');
      btn.classList.add('loading');
      btn.innerHTML = 'Redirecting...';

      setTimeout(()=>{
        investorForm.style.display = 'none';
        document.getElementById('investorSuccess').style.display = 'block';
        window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
      }, 900);
    });
  }