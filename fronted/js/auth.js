// Auth helpers shared across all pages

function checkAuthNav() {
  const token = localStorage.getItem('token');
  const authNav = document.getElementById('authNav');
  const userNav = document.getElementById('userNav');
  if (token) {
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

// Shared product card renderer used across all pages
function renderProductCard(product, showOwnerBadge = false) {
  const img = product.image_url
    ? `<img src="${product.image_url}" alt="${product.title}" class="card-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div class="card-img-placeholder" style="display:none">📦</div>`
    : `<div class="card-img-placeholder">📦</div>`;
  const statusClass = product.status !== 'available' ? 'card-sold' : '';
  return `
    <div class="product-card ${statusClass}" onclick="window.location.href='product.html?id=${product.product_id}'">
      <div class="card-img-wrap">${img}
        ${product.status !== 'available' ? `<div class="sold-overlay">${product.status.toUpperCase()}</div>` : ''}
      </div>
      <div class="card-body">
        <div class="card-category">${product.category} · ${product.condition}</div>
        <h3 class="card-title">${product.title}</h3>
        <div class="card-price">PKR ${parseFloat(product.price).toLocaleString()}</div>
        <div class="card-date">${new Date(product.created_at).toLocaleDateString()}</div>
      </div>
    </div>`;
}
