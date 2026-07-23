  const WA_NUMBER = '6281234567890';

  // Elemen DOM
  const grid = document.getElementById('productGrid');
  const cards = Array.from(document.querySelectorAll('.product-card'));
  const searchInput = document.getElementById('searchInput');
  const resultCount = document.getElementById('resultCount');
  const paginationWrap = document.getElementById('paginationWrap');

  // Dropdown Kategori
  const catSelect = document.getElementById('catSelect');
  const catTrigger = document.getElementById('catTrigger');
  const catLabel = document.getElementById('catLabel');
  const catOptions = catSelect.querySelectorAll('.dropdown-option');

  // Dropdown Sort By
  const sortSelect = document.getElementById('sortSelect');
  const sortTrigger = document.getElementById('sortTrigger');
  const sortLabel = document.getElementById('sortLabel');
  const sortOptions = sortSelect.querySelectorAll('.dropdown-option');

  // State
  let currentCategory = 'all';
  let currentSort = 'popularity';
  let currentPage = 1;
  const itemsPerPage = 8;

  // Toggle Dropdown Kategori
  catTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    sortSelect.classList.remove('open');
    catSelect.classList.toggle('open');
  });

  // Toggle Dropdown Sort
  sortTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    catSelect.classList.remove('open');
    sortSelect.classList.toggle('open');
  });

  // Klik Luar Tutup Semua Dropdown
  document.addEventListener('click', (e) => {
    if (!catSelect.contains(e.target)) catSelect.classList.remove('open');
    if (!sortSelect.contains(e.target)) sortSelect.classList.remove('open');
  });

  // Pilih Kategori
  catOptions.forEach(option => {
    option.addEventListener('click', () => {
      catOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      currentCategory = option.dataset.value;
      catLabel.innerText = option.innerText;
      catSelect.classList.remove('open');
      currentPage = 1;
      updateProducts();
    });
  });

  // Pilih Sorting
  sortOptions.forEach(option => {
    option.addEventListener('click', () => {
      sortOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      currentSort = option.dataset.value;
      sortLabel.innerText = option.innerText;
      sortSelect.classList.remove('open');
      currentPage = 1;
      updateProducts();
    });
  });

  // Event Input Search
  searchInput.addEventListener('input', () => {
    currentPage = 1;
    updateProducts();
  });

  // Update Tampilan Produk & Pagination
  function updateProducts() {
    const query = searchInput.value.toLowerCase().trim();

    // 1. Filtering
    let filteredCards = cards.filter(card => {
      const matchCat = (currentCategory === 'all' || card.dataset.cat === currentCategory);
      const matchSearch = card.dataset.title.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    // 2. Sorting
    filteredCards.sort((a, b) => {
      const priceA = parseInt(a.dataset.price);
      const priceB = parseInt(b.dataset.price);
      const popA = parseInt(a.dataset.popularity);
      const popB = parseInt(b.dataset.popularity);
      const ratingA = parseFloat(a.dataset.rating);
      const ratingB = parseFloat(b.dataset.rating);
      const dateA = new Date(a.dataset.date);
      const dateB = new Date(b.dataset.date);

      if (currentSort === 'price-low') return priceA - priceB;
      if (currentSort === 'price-high') return priceB - priceA;
      if (currentSort === 'popularity') return popB - popA;
      if (currentSort === 'rating') return ratingB - ratingA;
      if (currentSort === 'latest') return dateB - dateA;
      return 0;
    });

    // 3. Pagination Logic
    const totalItems = filteredCards.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    cards.forEach(card => card.classList.remove('show'));

    const activePageCards = filteredCards.slice(startIndex, endIndex);
    activePageCards.forEach(card => {
      card.classList.add('show');
      grid.appendChild(card);
    });

    const displayStart = totalItems === 0 ? 0 : startIndex + 1;
    const displayEnd = Math.min(endIndex, totalItems);
    resultCount.textContent = `Showing ${displayStart}–${displayEnd} of ${totalItems} results`;

    renderPagination(totalPages);
  }

  // Render UI Pagination
  function renderPagination(totalPages) {
    paginationWrap.innerHTML = '';

    if (totalPages <= 1) return;

    // 1. Tombol Left Arrow '<'
    const prevBtn = document.createElement('div');
    prevBtn.className = `page-num ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6"/></svg>`;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateProducts();
        window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
      }
    });
    paginationWrap.appendChild(prevBtn);

    // 2. Tombol Angka (1, 2)
    for (let i = 1; i <= Math.max(totalPages, 2); i++) {
      const pageBtn = document.createElement('div');
      pageBtn.className = `page-num ${i === currentPage ? 'active' : ''}`;
      pageBtn.innerText = i;
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        updateProducts();
        window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
      });
      paginationWrap.appendChild(pageBtn);
    }

    // 3. Tombol Right Arrow '>'
    const nextBtn = document.createElement('div');
    nextBtn.className = `page-num ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18l6-6-6-6"/></svg>`;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        updateProducts();
        window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
      }
    });
    paginationWrap.appendChild(nextBtn);
  }

  // Direct Order WhatsApp
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('h4').innerText;
      const price = card.querySelector('.product-price').innerText.split(' ')[0];
      const text = encodeURIComponent(`Halo NOBLESSE Barber Co., saya mau order produk:\n\n*${name}*\nHarga: ${price}\n\nMohon info ketersediaannya, terima kasih!`);
      window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
    });
  });

  // Initial Load
  updateProducts();