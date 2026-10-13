/* =========================================================
   script.js — TOÀN BỘ TƯƠNG TÁC CỦA TRANG BLOG CÁ NHÂN
   Chia theo từng tính năng, mỗi phần độc lập, dễ chỉnh sửa.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. CHUYỂN GIAO DIỆN SÁNG / TỐI (lưu lựa chọn) ---------- */
  const THEME_KEY = 'nva_theme';
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    applyTheme(isLight ? 'dark' : 'light');
  });

  /* ---------- 2. MENU DI ĐỘNG (hamburger) ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. HIGHLIGHT MỤC NAV THEO VỊ TRÍ CUỘN ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = ['hero', 'about', 'skills', 'projects', 'journey', 'blog']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------- 4. THANH TIẾN TRÌNH CUỘN TRANG ---------- */
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = pct + '%';
  });

  /* ---------- 5. ĐẾM SỐ LIỆU KHI CUỘN TỚI (about section) ---------- */
  const statNumbers = document.querySelectorAll('.stat-item strong');
  let statsAnimated = false;

  function animateStats() {
    statNumbers.forEach(el => {
      const target = Number(el.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
    });
  }

  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateStats();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(aboutSection);
  }

  /* ---------- 6. HIỆU ỨNG XUẤT HIỆN CHO DÒNG THỜI GIAN ---------- */
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.3 });
  timelineItems.forEach(item => timelineObserver.observe(item));

  /* ---------- 7. MODAL CHI TIẾT (dự án + bài viết) ---------- */
  const modalContent = {
    'modal-coffee': {
      title: 'Website Thực Đơn Quán Cà Phê',
      body: `<p>Trang thực đơn cho quán The Cozy Bean, xây dựng bằng HTML5 + CSS3 thuần, có giỏ hàng, tìm kiếm/lọc món, đặt bàn nhanh và đồng hồ đếm ngược khuyến mãi.</p>
             <p><strong>Công nghệ:</strong> HTML5, CSS3 (Flexbox, Grid), JavaScript (DOM, localStorage).</p>`
    },
    'modal-todo': {
      title: 'Bản Đồ Tìm Đường Thông Minh',
      body: `<p>Ứng dụng hỗ trợ tìm tuyến đường ngắn nhất trong khuôn viên trường học, tích hợp giao diện chọn điểm đến trực quan.</p>
             <p><strong>Công nghệ:</strong> JavaScript ES6+, Local Storage API, Thuật toán dijkstra,.....</p>`
    },
    'modal-blog': {
      title: 'Blog Cá Nhân Trần Vũ Thanh Triển',
      body: `<p>Chính là trang bạn đang xem — bố cục responsive, menu di động, chế độ sáng/tối, và các hiệu ứng chuyển động khi cuộn trang.</p>
             <p><strong>Công nghệ:</strong> HTML5 semantic, CSS Variables, IntersectionObserver.</p>`
    },
    'modal-post1': {
      title: 'Cốt lõi để làm chủ CSS Grid & Flexbox trong năm 2026',
      body: `<p>Flexbox phù hợp cho bố cục một chiều (hàng hoặc cột), còn Grid mạnh khi cần chia lưới hai chiều rõ ràng.</p>
             <p>Quy tắc mình luôn áp dụng: bắt đầu từ mobile trước, dùng <em>minmax()</em> và <em>auto-fit/auto-fill</em> để lưới tự co giãn mà không cần viết nhiều media query.</p>`
    },
    'modal-post2': {
      title: '5 mẹo tối ưu hiệu năng JavaScript cho người mới',
      body: `<p>1. Debounce các sự kiện scroll/input.<br>2. Lazy-load ảnh với thuộc tính loading="lazy".<br>3. Tránh truy cập DOM nhiều lần trong vòng lặp.<br>4. Dùng requestAnimationFrame cho animation.<br>5. Gộp các thay đổi CSS để giảm reflow.</p>`
    },
    'modal-post3': {
      title: 'Vì sao mình chọn thiết kế Dark Mode làm mặc định',
      body: `<p>Dark mode giảm mỏi mắt khi làm việc buổi tối và làm nổi bật các điểm nhấn màu xanh cyan trên trang. Mình vẫn giữ chế độ sáng cho người dùng thích nền trắng truyền thống.</p>`
    }
  };

  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  function openModal(key) {
    const data = modalContent[key];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;
    modalOverlay.classList.add('open');
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
  }

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modal));
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- 8. FORM ĐĂNG KÝ NHẬN TIN ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!validEmail) {
      newsletterFeedback.textContent = 'Vui lòng nhập email hợp lệ.';
      newsletterFeedback.classList.add('error');
      return;
    }
    newsletterFeedback.classList.remove('error');
    newsletterFeedback.textContent = `Đã đăng ký thành công với ${email}!`;
    newsletterForm.reset();
  });

});
