document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

async function fetchProducts() {
    let { data, error } = await supabaseClient
        .from('products')
        .select('*');

    if (error) {
        console.error('خطأ في جلب المنتجات:', error);
    } else {
        renderProducts(data);
    }
}

function renderProducts(products) {
    const productGrid = document.getElementById('products-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        productGrid.innerHTML += `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card h-100">
                    <img src="${product.img}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">السعر: ${product.price} جنيه</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">إضافة للسلة</button>
                    </div>
                </div>
            </div>
        `;
    });
}

let cart = [];

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCartUI();
    alert(`تمت إضافة ${name} إلى السلة!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    cartCount.innerText = cart.length;
}

function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    let message = 'مرحباً، أرغب في شراء المنتجات التالية:\n';
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} بسعر ${item.price} جنيه\n`;
        total += item.price;
    });

    message += `\nالإجمالي: ${total} جنيه`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/201027710954?text=${encodedMessage}`;
    window.location.href = whatsappLink;
}