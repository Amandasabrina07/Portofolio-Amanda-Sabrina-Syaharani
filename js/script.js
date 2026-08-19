/* ============================================================
   1) TAB DESKRIPSI PROYEK
   ============================================================ */
function showTab(descId, buttonElement) {
  const card = buttonElement.closest('.project-card');
  const descContent = card.querySelector('#' + descId);

  if (!descContent.classList.contains('active-desc')) {
    descContent.classList.add('active-desc');
    buttonElement.classList.add('active');
  } else {
    descContent.classList.remove('active-desc');
    buttonElement.classList.remove('active');
  }
}

/* ============================================================
   2) MENU MOBILE (HAMBURGER)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Tutup menu saat salah satu link diklik (khusus tampilan mobile)
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     3) SCROLL-SPY — MENANDAI MENU AKTIF SESUAI SECTION
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(sec => spyObserver.observe(sec));
  }

  /* ============================================================
     4) REVEAL ON SCROLL
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ============================================================
     5) TAHUN FOOTER OTOMATIS
     ============================================================ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     6) PERINGATAN JIKA TOMBOL "UNDUH CV" BELUM DIISI FILE ASLI
     ============================================================ */
  const cvBtn = document.getElementById('downloadCvBtn');
  if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      if (cvBtn.getAttribute('href') === '#') {
        e.preventDefault();
        alert('Tombol ini siap dipakai — tinggal ganti atribut href pada #downloadCvBtn di index.html dengan path file CV (PDF) kamu.');
      }
    });
  }

  /* ============================================================
     7) GALERI SLIDE PER PROJECT (project-frame[data-gallery])
     ============================================================ */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  let activeSlideList = [];
  let activeSlideIndex = 0;

  function openLightbox(images, startIndex) {
    activeSlideList  = images;
    activeSlideIndex = startIndex;
    updateLightboxImg();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  function updateLightboxImg() {
    const img = activeSlideList[activeSlideIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
  }
  function lightboxGo(step) {
    if (!activeSlideList.length) return;
    activeSlideIndex = (activeSlideIndex + step + activeSlideList.length) % activeSlideList.length;
    updateLightboxImg();
  }

  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => lightboxGo(-1));
    lightboxNext.addEventListener('click', () => lightboxGo(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxGo(-1);
      if (e.key === 'ArrowRight') lightboxGo(1);
    });
  }

  document.querySelectorAll('.project-frame[data-gallery]').forEach((frame) => {
    const track   = frame.querySelector('.gallery-track');
    const slides  = frame.querySelectorAll('.gallery-slide');
    const prevBtn = frame.querySelector('.gallery-nav.prev');
    const nextBtn = frame.querySelector('.gallery-nav.next');
    const dotsWrap = frame.querySelector('.gallery-dots');
    const images  = Array.from(slides).map(s => s.querySelector('img'));
    let index = 0;

    // Klik gambar untuk membuka lightbox (tetap aktif meski hanya 1 gambar)
    images.forEach((img, i) => {
      if (!img) return;
      img.addEventListener('click', () => openLightbox(images, i));
    });

    if (slides.length <= 1) return; // navigasi/dots tidak perlu jika cuma 1 gambar

    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('span');

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    // Beri isyarat visual (peek) sekali saat galeri ini pertama kali
    // masuk ke layar, supaya orang langsung tahu gambar bisa digeser.
    if ('IntersectionObserver' in window) {
      const peekObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            track.classList.add('peek-hint');
            obs.unobserve(frame);
          }
        });
      }, { threshold: 0.45 });
      peekObserver.observe(frame);
    } else {
      track.classList.add('peek-hint');
    }
  });

  /* ============================================================
     8) SERTIFIKASI — klik gambar buka lightbox, bisa navigasi
        antar semua sertifikat di section ini
     ============================================================ */
  /* ============================================================
     9) FOTO EXPERIENCE — otomatis tampil jika file sudah diunggah
        ke path yang tercantum di atribut data-photo-src.
     ============================================================ */
  document.querySelectorAll('.experience-photo-slot[data-photo-src]').forEach((slot) => {
    const img = slot.querySelector('img');
    const src = slot.dataset.photoSrc;
    if (!img || !src) return;
    img.addEventListener('load', () => slot.classList.add('has-photo'), { once: true });
    img.addEventListener('error', () => {
      slot.classList.remove('has-photo');
      img.removeAttribute('src');
    }, { once: true });
    img.src = src;
  });

  const certImages = Array.from(document.querySelectorAll('#certificates .cert-thumb img'));
  certImages.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(certImages, i));
  });


  /* ============================================================
     10) TAB PROYEK — beralih antara "Proyek Kuliah" dan "Proyek Magang"
     ============================================================ */
  const projectTabs = document.querySelectorAll('.project-tab');
  const projectContainers = document.querySelectorAll('#projects > .project-container');

  function activateProjectTab(targetId) {
    projectTabs.forEach(tab => {
      const isActive = tab.dataset.target === targetId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    projectContainers.forEach(container => container.classList.toggle('active', container.id === targetId));
  }

  projectTabs.forEach(tab => tab.addEventListener('click', () => activateProjectTab(tab.dataset.target)));

  const viewMagangBtn = document.getElementById('viewMagangProjectsBtn');
  if (viewMagangBtn) {
    viewMagangBtn.addEventListener('click', (e) => {
      e.preventDefault();
      activateProjectTab('projects-magang');
      const target = document.getElementById('projects-magang');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});
