

  // ===== Review photo upload (show selected filename) =====
  const rvPhoto = document.getElementById('rvPhoto');
  const fName = document.getElementById('fName');
  if(rvPhoto){
    rvPhoto.addEventListener('change', function(){
      fName.textContent = this.files.length ? '✓ ' + this.files[0].name : '';
    });
  }

  // ===== Star rating input =====
  const starEls = Array.from(document.querySelectorAll('#ratingStars svg'));
  const rvRating = document.getElementById('rvRating');
  const ratingHint = document.getElementById('ratingHint');
  function paintStars(val){
    starEls.forEach(s=>{
      s.classList.toggle('active', parseInt(s.dataset.v,10) <= val);
    });
  }
  starEls.forEach(star=>{
    star.addEventListener('click', ()=>{
      const v = star.dataset.v;
      rvRating.value = v;
      paintStars(parseInt(v,10));
      ratingHint.textContent = v + ' out of 5 stars';
      ratingHint.classList.remove('err');
    });
  });

  const reviewForm = document.getElementById('reviewForm');
  if(reviewForm){
    reviewForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(!rvRating.value){
        ratingHint.textContent = 'Please select a star rating before sending';
        ratingHint.classList.add('err');
        document.getElementById('ratingStars').scrollIntoView({behavior:'smooth', block:'center'});
        return;
      }
      const btn = document.getElementById('rvSubmit');
      btn.classList.add('loading');
      btn.innerHTML = 'Sending...';
      setTimeout(()=>{
        reviewForm.style.display = 'none';
        document.getElementById('reviewSuccess').style.display = 'block';
      }, 1300);
    });
  }

  // ===== Testimonial star icons =====
  const STAR_PATH = 'M12 2.5l3 6.2 6.7.9-4.9 4.7 1.2 6.7L12 17.8l-6 3.2 1.2-6.7L2.3 9.6l6.7-.9z';
  document.querySelectorAll('.testi-card').forEach(card=>{
    const count = parseInt(card.dataset.stars, 10) || 5;
    const holder = card.querySelector('.testi-stars');
    for(let i=1;i<=5;i++){
      holder.insertAdjacentHTML('beforeend',
        `<svg viewBox="0 0 24 24" class="${i<=count?'':'off'}"><path d="${STAR_PATH}"/></svg>`);
    }
  });

  // ===== Testimonials carousel (infinite loop, autoplay 5s + manual arrows) =====
  (function(){
    const track = document.getElementById('testiTrack');
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');
    if(!track) return;
    const originals = Array.from(track.children);
    const N = originals.length;

    const cloneSetBefore = originals.map(el => el.cloneNode(true));
    const cloneSetAfter = originals.map(el => el.cloneNode(true));
    cloneSetBefore.reverse().forEach(el => track.insertBefore(el, track.firstChild));
    cloneSetAfter.forEach(el => track.appendChild(el));

    let index = N;
    let animating = false;
    let timer = null;

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
        void track.offsetWidth;
        track.style.transition = '';
      }
    }

    function afterSlide(){
      animating = false;
      if(index >= N * 2){ index -= N; update(false); }
      if(index < N){ index += N; update(false); }
    }
    track.addEventListener('transitionend', afterSlide);

    function goNext(){
      if(animating) return;
      animating = true;
      index++;
      update();
    }
    function goPrev(){
      if(animating) return;
      animating = true;
      index--;
      update();
    }
    function startAuto(){
      clearInterval(timer);
      timer = setInterval(goNext, 5000);
    }

    nextBtn.addEventListener('click', ()=>{ goNext(); startAuto(); });
    prevBtn.addEventListener('click', ()=>{ goPrev(); startAuto(); });

    window.addEventListener('resize', ()=> update(false));
    window.addEventListener('load', ()=> update(false));
    update(false);
    startAuto();
  })();