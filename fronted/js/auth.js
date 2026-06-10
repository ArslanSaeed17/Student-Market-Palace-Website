// ============================================================
//  Auth helpers — Student Market Palace
// ============================================================

function checkAuthNav() {
  const token = localStorage.getItem('token');
  const authNav = document.getElementById('authNav');
  const userNav = document.getElementById('userNav');

  // Validate token expiry before showing user nav
  let loggedIn = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp * 1000 > Date.now()) {
        loggedIn = true;
      } else {
        localStorage.removeItem('token'); // expired — clear it
      }
    } catch(e) {
      localStorage.removeItem('token'); // malformed — clear it
    }
  }

  if (loggedIn) {
    if (authNav) authNav.style.display = 'none';
    if (userNav) userNav.style.display = 'inline-flex';
  } else {
    if (authNav) authNav.style.display = 'inline-flex';
    if (userNav) userNav.style.display = 'none';
  }
}

function requireAuth() {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// ── Shared navbar HTML ──────────────────────────────────────
function renderNavbar(activePage) {
  const pages = { home: 'index.html', browse: 'products.html', login: 'login.html', register: 'register.html', sell: 'sell.html', profile: 'profile.html' };
  return `
  <nav class="navbar">
    <a class="nav-brand" href="index.html">🎓 Student Market Palace</a>
    <div class="nav-links">
      <a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a>
      <a href="products.html" ${activePage==='browse'?'class="active"':''}>Browse</a>
      <span id="authNav">
        <a href="login.html" ${activePage==='login'?'class="active"':''}>Login</a>
        <a href="register.html" class="btn-nav ${activePage==='register'?'active':''}">Register</a>
      </span>
      <span id="userNav" style="display:none">
        <a href="sell.html" class="btn-nav-sell ${activePage==='sell'?'active':''}">+ Sell Item</a>
        <a href="profile.html" ${activePage==='profile'?'class="active"':''}>My Profile</a>
        <a href="#" onclick="logout()" class="btn-logout">Logout</a>
      </span>
    </div>
  </nav>`;
}

// ── Shared footer HTML ──────────────────────────────────────
function renderFooter(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
  <footer class="footer">
    <div class="footer-grid">
      <div>
        <div class="footer-brand">🎓 Student Market Palace</div>
        <p class="footer-desc">The trusted campus marketplace for UMT students — buy, sell, and trade academic goods with ease.</p>
        <div class="footer-contact">
          <a href="mailto:arslanbrall@gmail.com"><span class="icon">📧</span> arslanbrall@gmail.com</a>
          <a href="https://wa.me/923008971489" target="_blank"><span class="icon">💬</span> WhatsApp: +92 300 8971489</a>
          <a href="tel:+923079193634"><span class="icon">📞</span> Helpline: +92 307 9193634</a>
        </div>
      </div>
      <div>
        <div class="footer-heading">Quick Links</div>
        <div class="footer-links">
          <a href="index.html">Home</a>
          <a href="products.html">Browse Products</a>
          <a href="sell.html">Sell an Item</a>
          <a href="login.html">Login</a>
          <a href="register.html">Register</a>
        </div>
      </div>
      <div>
        <div class="footer-heading">Information</div>
        <div class="footer-links">
          <a href="index.html#about">About Us</a>
          <a href="index.html#terms">Terms of Service</a>
          <a href="mailto:arslanbrall@gmail.com">Contact Us</a>
          <a href="https://wa.me/923008971489" target="_blank">WhatsApp Support</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Student Market Palace — Built for UMT Students. All rights reserved.</p>
      <p style="font-size:0.78rem;color:var(--text3);margin-top:4px;">Developed by Arslan Saeed · arslanbrall@gmail.com</p>
    </div>
  </footer>`;
}

// ── Shared product card renderer ────────────────────────────
const CATEGORY_ICONS = {
  'Books': '📚', 'Electronics': '💻', 'Furniture': '🛋️',
  'Clothing': '👕', 'Sports': '⚽', 'Other': '📦'
};

function renderProductCard(product, showOwnerBadge = false) {
  const icon = CATEGORY_ICONS[product.category] || '📦';
  const img = product.image_url
    ? `<img src="${product.image_url}" alt="${product.title}" class="card-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
       <div class="card-img-placeholder" style="display:none">${icon}</div>`
    : `<div class="card-img-placeholder">${icon}</div>`;
  const statusClass = product.status !== 'available' ? 'card-sold' : '';
  return `
    <div class="product-card ${statusClass}" onclick="window.location.href='product.html?id=${product.product_id}'">
      <div class="card-img-wrap">${img}
        ${product.status !== 'available' ? `<div class="sold-overlay">${product.status.toUpperCase()}</div>` : ''}
      </div>
      <div class="card-body">
        <div class="card-category">${icon} ${product.category} · ${product.condition}</div>
        <h3 class="card-title">${product.title}</h3>
        <p class="card-desc">${(product.description||'').substring(0,80)}${product.description&&product.description.length>80?'…':''}</p>
        <div class="card-price">PKR ${parseFloat(product.price).toLocaleString()}</div>
        <div class="card-date">${new Date(product.created_at).toLocaleDateString()}</div>
      </div>
    </div>`;
}
