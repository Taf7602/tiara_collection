// Product Data
const products = [
    {
        id: 1,
        name: "Gamis Rompi Modern",
        description: "Gamis modern dengan desain rompi yang elegan, cocok untuk berbagai acara formal maupun kasual.",
        price: 90000,
        image: "baju rompi.jpg",
        category: "gamis",
        badge: "Terlaris",
        inStock: true
    },
    {
        id: 2,
        name: "Gamis Borkat Mewah",
        description: "Gamis berbahan premium dengan hiasan borkat yang mewah, sempurna untuk acara spesial dan pernikahan.",
        price: 100000,
        image: "bis borkat.jpg",
        category: "gamis",
        badge: "Baru",
        inStock: true
    },
    {
        id: 3,
        name: "Kebaya Songket Etnik",
        description: "Kebaya cantik berbahan songket asli dengan desain modern, menghadirkan kesan elegan dan tradisional.",
        price: 150000,
        image: "BORKAT.jpg",
        category: "kebaya",
        inStock: true
    },
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const testimonialsGrid = document.getElementById('testimonialsGrid');
const cartModal = document.getElementById('cartModal');
const searchModal = document.getElementById('searchModal');
const cartBtn = document.getElementById('cartBtn');
const searchBtn = document.getElementById('searchBtn');
const closeCart = document.getElementById('closeCart');
const closeSearch = document.getElementById('closeSearch');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const newsletterEmail = document.getElementById('newsletterEmail');
const subscribeBtn = document.getElementById('subscribeBtn');
const contactForm = document.getElementById('contactForm');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    displayTestimonials();
    updateCartCount();
    setupEventListeners();
    setupMobileMenu();
});

// Display Products
function displayProducts(productsToShow = products.slice(0, 6)) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">Rp ${product.price.toLocaleString()}</span>
                <button class="add-to-cart" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? '+ Keranjang' : 'Stok Habis'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Display Testimonials
function displayTestimonials() {
    testimonialsGrid.innerHTML = '';
    
    testimonials.forEach(testimonial => {
        const testimonialCard = createTestimonialCard(testimonial);
        testimonialsGrid.appendChild(testimonialCard);
    });
}

// --- KERANJANG ---
// Tambah ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    updateCartModal();
}

// Update jumlah di ikon keranjang
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count') || document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((a, b) => a + b.quantity, 0);
    }
}

// Tampilkan isi keranjang di modal
function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartItems) return;
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500">Keranjang kosong</p>';
        if (cartTotal) cartTotal.textContent = '0';
    } else {
        cartItems.innerHTML = cart.map(item =>
            `<div style='margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;'>
                <span>${item.name} x${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString()}</span>
                <button onclick="removeFromCart(${item.id})" style="background:none;border:none;color:#e11d1d;font-size:1.2em;cursor:pointer;">&times;</button>
            </div>`
        ).join('');
        // Hitung total
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (cartTotal) cartTotal.textContent = total.toLocaleString();
    }
}

// Buka modal keranjang
if (cartBtn) {
    cartBtn.onclick = function() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            updateCartModal();
            modal.style.display = 'block';
        }
    };
}

// Tutup modal keranjang
if (closeCart) {
    closeCart.onclick = function() {
        const modal = document.getElementById('cartModal');
        if (modal) modal.style.display = 'none';
    };
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Produk dihapus dari keranjang!');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCart();
        }
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

function displayCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500">Keranjang belanja kosong</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style.cssText = 'display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e5e7eb;';
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${item.name}</h4>
                <p style="margin: 0; color: #c53030; font-weight: 600;">Rp ${item.price.toLocaleString()}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" style="background: #f3f4f6; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">-</button>
                <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" style="background: #c53030; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem;">×</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toLocaleString();
}

// Search Functionality
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(filteredProducts);
}

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="text-center text-gray-500">Tidak ada produk yang ditemukan</p>';
        return;
    }
    
    results.forEach(product => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.style.cssText = 'display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e5e7eb; cursor: pointer;';
        
        resultItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
            <div>
                <h4 style="margin: 0 0 0.25rem 0; font-size: 1rem;">${product.name}</h4>
                <p style="margin: 0; color: #c53030; font-weight: 600;">Rp ${product.price.toLocaleString()}</p>
            </div>
        `;
        
        resultItem.addEventListener('click', () => {
            closeModal(searchModal);
            // Scroll to products section
            document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
        });
        
        searchResults.appendChild(resultItem);
    });
}

// Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    // Cart modal
    // The cartBtn.addEventListener('click', ...) and closeCart.addEventListener('click', ...)
    // are now handled directly in the DOMContentLoaded listener.
    
    // Search modal
    searchBtn.addEventListener('click', () => openModal(searchModal));
    closeSearch.addEventListener('click', () => closeModal(searchModal));
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 0) {
            searchProducts(query);
        } else {
            searchResults.innerHTML = '';
        }
    });
    
    // Newsletter subscription
    subscribeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = newsletterEmail.value.trim();
        if (email && isValidEmail(email)) {
            showNotification('Terima kasih telah berlangganan newsletter kami!');
            newsletterEmail.value = '';
        } else {
            showNotification('Mohon masukkan alamat email yang valid!');
        }
    });
    
    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = contactForm.querySelector('input[placeholder="Nama Lengkap"]').value.trim();
        const email = contactForm.querySelector('input[placeholder="Alamat Email"]').value.trim();
        const subjek = contactForm.querySelector('input[placeholder="Subjek"]').value.trim();
        const pesan = contactForm.querySelector('textarea').value.trim();
        
        // Format pesan WhatsApp
        const waNumber = '6282284968057';
        const waText =
            `Halo, saya ingin menghubungi Tiara Collection.%0A` +
            `Nama: ${nama}%0A` +
            `Email: ${email}%0A` +
            `Subjek: ${subjek}%0A` +
            `Pesan: ${pesan}`;
        const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
        window.open(waUrl, '_blank');
    });
    
    // Checkout ke WhatsApp
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            if (cart.length === 0) return;
            let pesan = 'Halo, saya ingin memesan:\n';
            cart.forEach(item => {
                pesan += `- ${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString()}\n`;
            });
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            pesan += `Total: Rp ${total.toLocaleString()}`;
            const waNumber = '6282284968057';
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(pesan)}`;
            window.open(waUrl, '_blank');
        };
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) closeModal(cartModal);
        if (e.target === searchModal) closeModal(searchModal);
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Menu
function setupMobileMenu() {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style); 