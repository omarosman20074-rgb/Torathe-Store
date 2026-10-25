// store.js
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

    if (!products || products.length === 0) {
        productGrid.innerHTML = '<p class="text-center text-muted">لا توجد منتجات مضافة حالياً.</p>';
        return;
    }

    products.forEach(product => {
        productGrid.innerHTML += `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card product-card h-100 shadow-sm">
                    <img src="${product.img}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/300'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text mt-2">السعر: ${product.price} جنيه</p>
                        <p class="card-text text-white-50 small">الكمية المتاحة: ${product.stock}</p>
                        <button class="btn btn-custom-gold mt-auto" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">إضافة للسلة</button>
                    </div>
                </div>
            </div>
        `;
    });
}

let cart = [];

function addToCart(id, name, price) {
    let existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
    alert(`تمت إضافة ${name} إلى السلة!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsBody = document.getElementById('cart-items-body');
    const grandTotalLbl = document.getElementById('grand-total');

    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemsBody.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartItemsBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
                <td>${item.quantity}</td>
                <td>${itemTotal} جنيه</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;
    });

    grandTotalLbl.innerText = `${total} جنيه`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    let message = 'مرحباً، أرغب في شراء المنتجات التالية:\n';
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} (الكمية: ${item.quantity}) بسعر ${item.price * item.quantity} جنيه\n`;
        total += item.price * item.quantity;
    });

    message += `\nالإجمالي الكلي: ${total} جنيه`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/201027710954?text=${encodedMessage}`;
    window.location.href = whatsappLink;
}
