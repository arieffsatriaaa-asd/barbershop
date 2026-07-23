

  // ===== Hero slider (crossfade, autoplay 5s, arrows + dots, seamless loop) =====
  (function(){
    const slides = Array.from(document.querySelectorAll('#heroSlider .hero-slide'));
    const dots = Array.from(document.querySelectorAll('#heroDots .dot'));
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const total = slides.length;
    let current = 0;
    let timer = null;

    function goTo(i){
      const next = (i + total) % total;
      if(next === current) return;
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = next;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function startAuto(){
      clearInterval(timer);
      timer = setInterval(()=> goTo(current + 1), 5000);
    }

    nextBtn.addEventListener('click', ()=>{ goTo(current + 1); startAuto(); });
    prevBtn.addEventListener('click', ()=>{ goTo(current - 1); startAuto(); });
    dots.forEach(dot=>{
      dot.addEventListener('click', ()=>{ goTo(parseInt(dot.dataset.i, 10)); startAuto(); });
    });

    startAuto();
  })();

  // ===== Gallery carousel (true infinite loop, no long slide-back) =====
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const originals = Array.from(track.children);
  const N = originals.length;

  // Duplicate the full set before and after the real items, so wrapping
  // around always lands on a visually identical clone -> the "jump" back
  // to start/end is invisible instead of sliding all the way across.
  const cloneSetBefore = originals.map(el => el.cloneNode(true));
  const cloneSetAfter = originals.map(el => el.cloneNode(true));
  cloneSetBefore.reverse().forEach(el => track.insertBefore(el, track.firstChild));
  cloneSetAfter.forEach(el => track.appendChild(el));

  let index = N; // start on the first real item
  let animating = false;

  function step(){
    const item = track.children[0];
    const trackStyle = getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 0;
    return item.getBoundingClientRect().width + gap;
  }

  function update(withTransition = true){
    track.style.transition = withTransition ? '' : 'none';
    track.style.transform = `translateX(${-index * step()}px)`;
    if(!withTransition){
      // force reflow so the "none" transition actually applies before we restore it
      void track.offsetWidth;
      track.style.transition = '';
    }
  }

  function afterSlide(){
    animating = false;
    // Wrapped past the last real item into the trailing clone set -> snap back to the real start
    if(index >= N * 2){
      index -= N;
      update(false);
    }
    // Wrapped before the first real item into the leading clone set -> snap forward to the real end
    if(index < N){
      index += N;
      update(false);
    }
  }

  track.addEventListener('transitionend', afterSlide);

  nextBtn.addEventListener('click', ()=>{
    if(animating) return;
    animating = true;
    index++;
    update();
  });

  prevBtn.addEventListener('click', ()=>{
    if(animating) return;
    animating = true;
    index--;
    update();
  });

  window.addEventListener('resize', ()=> update(false));
  window.addEventListener('load', ()=> update(false));

  // ===== Premium services showcase (true crossfade, 4 dots, drag-to-swipe with no shift) =====
  (function(){
    const psCard = document.getElementById('psCard');
    const imgA = document.getElementById('psImgA');
    const imgB = document.getElementById('psImgB');
    const textA = document.getElementById('psTextA');
    const textB = document.getElementById('psTextB');
    const dotsWrap = document.getElementById('premiumDots');
    if(!imgA || !dotsWrap) return;

    const services = [
      {img:'https://images.unsplash.com/photo-1621605815971-fbc98d665033?fm=jpg&q=80&w=800&auto=format&fit=crop', title:'Hair Tattoo', desc:'Untuk kamu yang ingin mencari gaya rambut khas. Biarkan barberman kami yang terampil membentuk dan merancang gaya rambut-mu seperti hasil mahakaryanya.'},
      {img:'https://loremflickr.com/400/480/skin,fade/all?lock=102', title:'Skin Fade', desc:'Fade presisi dengan blending halus dari kulit kepala hingga ujung rambut, rapi di setiap sudut.'},
      {img:'https://loremflickr.com/400/480/hot,towel/all?lock=105', title:'Hot Towel Shave', desc:'Cukuran dengan pisau cukur klasik dan handuk hangat, memberikan hasil halus dan relaksasi penuh.'},
      {img:'https://loremflickr.com/400/480/beard,sculpt/all?lock=106', title:'Beard Sculpt', desc:'Membentuk dan mendefinisikan jenggot sesuai bentuk wajah, diakhiri dengan oil finishing.'}
    ];

    const FADE_MS = 800;
    let current = 0;
    let showingA = true; // which layer is currently visible
    let timer = null;
    let fading = false;
    const dots = [];

    services.forEach((s, i)=>{
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Show ' + s.title);
      dot.addEventListener('click', ()=>{ goTo(i); startAuto(); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function fillLayer(imgEl, textEl, s){
      imgEl.src = s.img;
      textEl.querySelector('h3').textContent = s.title;
      textEl.querySelector('p').textContent = s.desc;
    }

    function render(i){
      const s = services[i];
      fading = true;

      const nextImg = showingA ? imgB : imgA;
      const nextText = showingA ? textB : textA;
      const curImg = showingA ? imgA : imgB;
      const curText = showingA ? textA : textB;

      // Load the next slide's content into the hidden layer first, then
      // crossfade both layers together (true crossfade, no blank gap).
      fillLayer(nextImg, nextText, s);

      requestAnimationFrame(()=>{
        curImg.classList.remove('active');
        curText.classList.remove('active');
        nextImg.classList.add('active');
        nextText.classList.add('active');
        showingA = !showingA;
        setTimeout(()=>{ fading = false; }, FADE_MS);
      });
    }

    function goTo(i){
      if(fading) return;
      const next = (i + services.length) % services.length;
      if(next === current) return;
      dots[current].classList.remove('active');
      current = next;
      dots[current].classList.add('active');
      render(current);
    }

    function startAuto(){
      clearInterval(timer);
      timer = setInterval(()=> goTo(current + 1), 4500);
    }

    startAuto();

    // ----- Click-and-hold drag: gesture only, image/text never shift visually -----
    if(psCard){
      let isDown = false;
      let startX = 0;
      let dx = 0;

      function dragStart(x){
        isDown = true;
        dx = 0;
        startX = x;
        psCard.classList.add('dragging');
        clearInterval(timer);
      }
      function dragMove(x){
        if(!isDown) return;
        dx = x - startX;
      }
      function dragEnd(){
        if(!isDown) return;
        isDown = false;
        psCard.classList.remove('dragging');

        if(dx <= -50) goTo(current + 1);
        else if(dx >= 50) goTo(current - 1);
        startAuto();
      }

      psCard.addEventListener('mousedown', e=>{ dragStart(e.pageX); e.preventDefault(); });
      window.addEventListener('mousemove', e=> dragMove(e.pageX));
      window.addEventListener('mouseup', dragEnd);

      psCard.addEventListener('touchstart', e=> dragStart(e.touches[0].pageX), {passive:true});
      psCard.addEventListener('touchmove', e=> dragMove(e.touches[0].pageX), {passive:true});
      psCard.addEventListener('touchend', dragEnd);
    }
  })();