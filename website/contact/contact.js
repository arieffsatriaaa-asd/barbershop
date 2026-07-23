  // ===== JS untuk peta Leaflet (lokasi cabang, marker, popup & scroll-zoom lock) =====
  document.addEventListener("DOMContentLoaded", function() {
    // 5 Titik Lokasi NOBLESSE di Batam
    const locations = [
      {
        id: 1,
        title: "NOBLESSE Barber Co. — Batam Center",
        address: "Jl. Sudirman No. 88, Batam Center, Batam, Riau Islands",
        desc: "Lounge utama kami dengan fasilitas VIP room & refreshment bar.",
        lat: 1.1301,
        lng: 104.0529,
        rating: "4.9",
        reviews: "(320)"
      },
      {
        id: 2,
        title: "NOBLESSE Studio — Nagoya",
        address: "Komplek Nagoya Hill Superblock Blok J No. 12, Nagoya, Batam",
        desc: "Cabang strategis di pusat kota dengan gaya modern industrial.",
        lat: 1.1438,
        lng: 104.0152,
        rating: "4.8",
        reviews: "(215)"
      },
      {
        id: 3,
        title: "NOBLESSE Express — Harbour Bay",
        address: "Harbour Bay Downtown Walk Promenade No. 05, Batu Ampar, Batam",
        desc: "Spesialis potongan cepat & rapi dekat Terminal Ferry Harbour Bay.",
        lat: 1.1553,
        lng: 103.9985,
        rating: "4.9",
        reviews: "(180)"
      },
      {
        id: 4,
        title: "NOBLESSE Reserve — Grand Batam",
        address: "Grand Batam Mall Lt. 1 No. 42, Penuwin, Batam",
        desc: "Pengalaman grooming eksklusif di dalam pusat perbelanjaan utama.",
        lat: 1.1385,
        lng: 104.0090,
        rating: "4.9",
        reviews: "(412)"
      },
      {
        id: 5,
        title: "NOBLESSE Coastal — Palm Spring",
        address: "Ruko Palm Spring Batam Center B3 No. 8, Batam",
        desc: "Suasana santai nan elegan, cocok untuk perawatan jenggot & rambut klasik.",
        lat: 1.1180,
        lng: 104.0350,
        rating: "4.7",
        reviews: "(150)"
      }
    ];

    // Inisialisasi Leaflet Map
    const map = L.map('noblesse-batam-map', {
      center: [1.1350, 104.0250],
      zoom: 12,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: false
    });

    // Dark Map Tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Zoom control di pojok kanan bawah
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const overlay = document.getElementById('ctrlScrollOverlay');
    const wrapper = document.getElementById('mapWrapper');
    let overlayTimeout;

    // Logika Ctrl + Scroll Zoom
    wrapper.addEventListener('wheel', function(e) {
      if (e.ctrlKey || e.metaKey) {
        map.scrollWheelZoom.enable();
        overlay.classList.remove('active');
      } else {
        map.scrollWheelZoom.disable();
        overlay.classList.add('active');
        clearTimeout(overlayTimeout);
        overlayTimeout = setTimeout(function() {
          overlay.classList.remove('active');
        }, 1400);
      }
    });

    wrapper.addEventListener('mouseleave', function() {
      overlay.classList.remove('active');
      map.scrollWheelZoom.disable();
    });

    // Custom Icon Pin
    function createPinIcon() {
      return L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="custom-map-pin"></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30]
      });
    }

    // Fungsi Update Card Kiri Bawah
    function updateCard(loc) {
      document.getElementById('cardTitle').textContent = loc.title;
      document.getElementById('cardAddress').textContent = loc.address;
      document.getElementById('cardDesc').textContent = loc.desc;
      document.getElementById('cardRating').textContent = loc.rating;
      document.getElementById('cardReviews').textContent = loc.reviews;
      
      const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
      document.getElementById('cardGmapsLink').href = gmapsUrl;
    }

    // Set lokasi awal
    updateCard(locations[0]);

    // Tambahkan 5 Marker ke Map
    locations.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], { icon: createPinIcon() }).addTo(map);
      const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;

      const popupContent = `
        <div style="font-family:'Poppins',sans-serif;">
          <h4 style="margin:0 0 4px; font-size:13.5px; font-weight:700; color:#efe8d9;">${loc.title}</h4>
          <p style="margin:0 0 8px; font-size:12px; color:#9c9384; line-height:1.4;">${loc.address}</p>
          <a href="${gmapsUrl}" target="_blank" style="display:inline-block; font-size:11px; font-weight:700; color:#161209; background:#e3b768; padding:5px 10px; border-radius:4px; text-decoration:none; text-transform:uppercase;">Petunjuk Arah &rarr;</a>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', function() {
        updateCard(loc);
        map.panTo([loc.lat, loc.lng]);
      });
    });
  });