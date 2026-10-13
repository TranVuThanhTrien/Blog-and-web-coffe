/* =========================================================
   script.js — TOÀN BỘ TƯƠNG TÁC CỦA TRANG THE COZY BEAN
   Chia theo từng tính năng, mỗi phần độc lập, dễ chỉnh sửa.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. MENU DI ĐỘNG (hamburger) ---------- */
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Đóng menu khi bấm 1 link (trên di động)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 2. HIGHLIGHT MỤC NAV THEO VỊ TRÍ CUỘN ---------- */
  const sections = ['trang-chu', 'thuc-don', 'khuyen-mai', 'lien-he']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------- 3. TOAST THÔNG BÁO NHỎ ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- 4. GIỎ HÀNG (thêm/xóa/tăng giảm số lượng, lưu localStorage) ---------- */
  const CART_KEY = 'cozybean_cart';
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');

  function formatVND(n) {
    return n.toLocaleString('vi-VN') + 'đ';
  }

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function renderCart() {
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
      cartEmptyEl.style.display = 'block';
    } else {
      cartEmptyEl.style.display = 'none';
      cart.forEach((item, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-sub">${formatVND(item.price)} × ${item.qty}</div>
          </div>
          <div class="qty-controls">
            <button class="qty-minus" data-idx="${idx}" aria-label="Giảm số lượng">−</button>
            <span>${item.qty}</span>
            <button class="qty-plus" data-idx="${idx}" aria-label="Tăng số lượng">+</button>
            <button class="remove-item" data-idx="${idx}" aria-label="Xóa món"><i class="fa-solid fa-trash"></i></button>
          </div>`;
        cartItemsEl.appendChild(li);
      });
    }
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    cartTotalEl.textContent = formatVND(total);
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    cartCountEl.textContent = count;
    saveCart();
  }

  function addToCart(name, price, btn) {
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, qty: 1 });
    renderCart();
    showToast(`Đã thêm "${name}" vào giỏ`);

    if (btn) {
      const original = btn.textContent;
      btn.classList.add('added');
      btn.textContent = 'Đã thêm ✓';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.textContent = original;
      }, 1200);
    }
  }

  // CHỈ chọn nút "Đặt món" thật (có sẵn data-name/data-price trong thẻ món ăn).
  // Trước đây dùng document.querySelectorAll('.btn-order') sẽ vô tình bắt luôn
  // nút "Gửi yêu cầu đặt bàn" và "Xác nhận đặt món" (cũng mang class .btn-order
  // để dùng chung style), khiến chúng thêm một món "undefined" vào giỏ khi bấm.
  document.querySelectorAll('.food-card .btn-order[data-name]').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.name, Number(btn.dataset.price), btn);
    });
  });

  cartItemsEl.addEventListener('click', (e) => {
    const idx = e.target.closest('button')?.dataset.idx;
    if (idx === undefined) return;
    const i = Number(idx);
    if (e.target.closest('.qty-plus')) cart[i].qty += 1;
    if (e.target.closest('.qty-minus')) {
      cart[i].qty -= 1;
      if (cart[i].qty <= 0) cart.splice(i, 1);
    }
    if (e.target.closest('.remove-item')) cart.splice(i, 1);
    renderCart();
  });

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
  }
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
  }

  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.getElementById('cartCheckout').addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Giỏ hàng đang trống!');
      return;
    }
    showToast('Đã gửi đơn đặt món! Quán sẽ xác nhận sớm.');
    cart = [];
    renderCart();
    closeCart();
  });

  renderCart();

  /* ---------- 5. TÌM KIẾM + LỌC THEO DANH MỤC ---------- */
  const searchInput = document.getElementById('searchInput');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const foodCards = document.querySelectorAll('.food-card');
  const menuSections = document.querySelectorAll('.menu-section');
  const emptyState = document.getElementById('emptyState');
  let activeFilter = 'all';

  function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    let anyVisible = false;

    menuSections.forEach(section => {
      const sectionCategory = section.dataset.category;
      let sectionHasVisible = false;

      section.querySelectorAll('.food-card').forEach(card => {
        const matchesCategory = activeFilter === 'all' || activeFilter === sectionCategory;
        const matchesKeyword = card.dataset.name.includes(keyword);
        const visible = matchesCategory && matchesKeyword;
        card.style.display = visible ? '' : 'none';
        if (visible) { sectionHasVisible = true; anyVisible = true; }
      });

      section.style.display = sectionHasVisible ? '' : 'none';
    });

    emptyState.hidden = anyVisible;
  }

  searchInput.addEventListener('input', applyFilters);

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      applyFilters();
    });
  });

  /* ---------- 6. ĐỒNG HỒ ĐẾM NGƯỢC GIỜ KHUYẾN MÃI (14:00 - 17:00) ---------- */
  const timerText = document.getElementById('promoTimerText');

  function updatePromoTimer() {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    let target = new Date(now);

    if (h < 14) {
      target.setHours(14, 0, 0, 0);
      timerText.textContent = `Khuyến mãi bắt đầu sau ${diffText(target, now)}`;
    } else if (h < 17) {
      target.setHours(17, 0, 0, 0);
      timerText.textContent = `Đang khuyến mãi! Còn ${diffText(target, now)}`;
    } else {
      target.setDate(target.getDate() + 1);
      target.setHours(14, 0, 0, 0);
      timerText.textContent = `Hẹn gặp lại lúc 14:00 ngày mai`;
    }
  }

  function diffText(target, now) {
    const ms = target - now;
    const mins = Math.floor(ms / 60000);
    const hh = Math.floor(mins / 60);
    const mm = mins % 60;
    return `${hh > 0 ? hh + ' giờ ' : ''}${mm} phút`;
  }

  updatePromoTimer();
  setInterval(updatePromoTimer, 30000);

  /* ---------- 7. FORM ĐẶT BÀN NHANH ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const bookingFeedback = document.getElementById('bookingFeedback');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!bookingForm.checkValidity()) {
      bookingFeedback.textContent = 'Vui lòng điền đầy đủ và đúng thông tin.';
      bookingFeedback.classList.add('error');
      return;
    }
    const name = document.getElementById('bkName').value.trim();
    const time = document.getElementById('bkTime').value;
    bookingFeedback.classList.remove('error');
    bookingFeedback.textContent = `Cảm ơn ${name}! Quán đã nhận yêu cầu đặt bàn lúc ${new Date(time).toLocaleString('vi-VN')}.`;
    showToast('Đặt bàn thành công!');
    bookingForm.reset();
    document.getElementById('bkGuests').value = 2;
  });

  /* ---------- 8. NÚT LÊN ĐẦU TRANG ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
