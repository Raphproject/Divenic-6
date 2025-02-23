document.addEventListener("DOMContentLoaded", function () {
  const intro = document.querySelector('.intro');
  const mainContent = document.querySelector('.main-content');
  const nav = document.querySelector('nav');
  const slides = document.querySelectorAll('.slide');
  // const nextBtn = document.querySelector('.next');
  // const prevBtn = document.querySelector('.prev');
  const dots = document.querySelectorAll('.dot');
  const sections = document.querySelectorAll('#home, #bout, #blog');
  const navLinks = document.querySelectorAll('.nav-link');
  // const navbar = document.querySelectorAll('nav');
  const logo = document.getElementById("logo");
  const introShown = localStorage.getItem("introShown");

  if (!introShown) {
    // Jika intro belum pernah ditampilkan, tampilkan intro
    intro.style.display = "flex";
    mainContent.style.display = "none";
    nav.style.opacity = 0;

    // Tambahkan event listener pada akhir animasi intro
    intro.addEventListener("animationend", () => {
      intro.style.opacity = 0; // Fade out intro
      setTimeout(() => {
        intro.style.display = "none"; // Hilangkan intro dari layar
        mainContent.style.display = "block"; // Tampilkan main content
        nav.style.opacity = 1; // Tampilkan navbar
        setTimeout(() => {
          mainContent.style.opacity = 1; // Fade in main content
        }, 100);

        // Simpan status bahwa intro sudah ditampilkan
        localStorage.setItem("introShown", "true");
      }, 1000); // Beri jeda agar transisi halus
    });
  } else {
    // Jika intro sudah ditampilkan, langsung tampilkan main content
    intro.style.display = "none";
    mainContent.style.display = "block";
    nav.style.opacity = 1;
    mainContent.style.opacity = 1;
  }

  // Tambahkan event listener untuk reset intro saat logo diklik
  logo.addEventListener("click", () => {
    localStorage.removeItem("introShown"); // Hapus status intro
    location.reload(); // Refresh halaman untuk mengaktifkan ulang intro
  });

  window.addEventListener("scroll", scrollNavbar);

  function scrollNavbar() {
    const navbar = document.querySelector("nav");
    const scrollHeight = window.scrollY;

    if (scrollHeight > 30) {
      navbar.classList.add("Scrolled");
    } else {
      navbar.classList.remove("Scrolled");
    }
  }

  // Function untuk update active link berdasarkan scroll
  function updateActiveLink() {
    let currentSection = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      // Cek apakah posisi scroll ada dalam jangkauan section
      if (window.scrollY >= sectionTop - sectionHeight / 3 && window.scrollY < sectionTop + sectionHeight - sectionHeight / 3) {
        currentSection = section.getAttribute('id');
      }
    });

    // Update active class untuk navbar
    navLinks.forEach((link) => {
      link.classList.remove('active'); // Hapus semua active
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active'); // Tambahkan active ke link yang sesuai
      }
    });
  }

  // Tambahkan event listener saat halaman di-scroll
  window.addEventListener("scroll", updateActiveLink);

  // Tambahkan smooth scrolling dan active state saat diklik
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Mencegah lompat default

      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      // Update active state secara manual
      navLinks.forEach(nav => nav.classList.remove('active'));
      link.classList.add('active');

      // Scroll ke target dengan efek smooth
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
  }

  // Slider logic
  let currentSlideIndex = 0;
  const totalSlides = slides.length;

  // Fungsi untuk menampilkan slide berdasarkan indeks
  function showSlide(index) {
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${index * 100}%)`;

    // Hapus dan tambahkan class 'active' pada dot
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Fungsi untuk berpindah slide
  function moveSlide(n) {
    currentSlideIndex = (currentSlideIndex + n + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
  }

  // Auto-slide setiap 5 detik
  let autoSlide = setInterval(() => {
    moveSlide(1);
  }, 5000);

  // Fungsi untuk menghentikan sementara auto-slide
  function pauseAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      moveSlide(1);
    }, 5000); // Lanjutkan auto-slide setelah 5 detik
  }

  // Event listener untuk tombol Next dan Prev
  document.querySelector('.next').addEventListener('click', () => {
    moveSlide(1);
    pauseAutoSlide(); // Hentikan sementara auto-slide
  });

  document.querySelector('.prev').addEventListener('click', () => {
    moveSlide(-1);
    pauseAutoSlide(); // Hentikan sementara auto-slide
  });

  // Event listener untuk dot navigasi
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlideIndex = index;
      showSlide(index);
      pauseAutoSlide(); // Hentikan sementara auto-slide
    });
  });

  // Tampilkan slide pertama saat halaman dimuat
  showSlide(currentSlideIndex);

  // Fungsi untuk memuat konten dari file HTML lain
  function loadContent(file) {
    fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Gagal memuat ${file}`);
        }
        return response.text();
      })
      .then((html) => {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = html; // Masukkan HTML yang dimuat ke dalam div konten
      })
      .catch((error) => {
        console.error('Error saat memuat file:', error);
      });
  }

  // Tambahkan event listener ke link navigasi
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Hentikan perilaku default link
      const file = link.getAttribute('data-file'); // Ambil nama file yang akan dimuat
      loadContent(file); // Muat konten
    });
  });
});