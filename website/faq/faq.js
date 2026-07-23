  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if(!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Filter & Search Logic
  const faqSearch = document.getElementById('faqSearch');
  const faqCategorySelect = document.getElementById('faqCategorySelect');
  const faqSelectWrap = document.getElementById('faqSelectWrap');

  function filterFAQ() {
    const query = faqSearch.value.toLowerCase();
    const selectedCategory = faqCategorySelect.value;

    faqItems.forEach(item => {
      const matchesCat = (selectedCategory === 'all' || item.getAttribute('data-cat') === selectedCategory);
      const matchesQuery = item.textContent.toLowerCase().includes(query);

      if (matchesCat && matchesQuery) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  faqSearch.addEventListener('input', filterFAQ);

  // LOGIKA DROPDOWN STATE (NO-BUG FOCUS RESET)
  let isDropdownOpen = false;

  faqCategorySelect.addEventListener('focus', () => {
    isDropdownOpen = true;
    faqSelectWrap.classList.add('is-open');
  });

  faqCategorySelect.addEventListener('blur', () => {
    isDropdownOpen = false;
    faqSelectWrap.classList.remove('is-open');
  });

  faqCategorySelect.addEventListener('change', () => {
    filterFAQ();
    faqCategorySelect.blur();
  });

  faqCategorySelect.addEventListener('mousedown', () => {
    if (document.activeElement === faqCategorySelect && isDropdownOpen) {
      setTimeout(() => {
        faqCategorySelect.blur();
      }, 10);
    }
  });