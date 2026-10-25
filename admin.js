// admin.js

function loginAdmin() {
    // فتح لوحة التحكم مباشرة عند الضغط على الزرار
    localStorage.setItem('torathe_admin', 'logged_in');
    checkSession();
}

function logoutAdmin() {
    localStorage.removeItem('torathe_admin');
    checkSession();
}

function checkSession() {
    let isLoggedIn = localStorage.getItem('torathe_admin');
    let authBox = document.getElementById('auth-container');
    let dashBox = document.getElementById('dashboard-container');

    if (!authBox || !dashBox) return;

    if (isLoggedIn === 'logged_in') {
        authBox.style.display = 'none';
        dashBox.style.display = 'block';
        fetchAdminProducts();
    } else {
        authBox.style.display = 'block';
        dashBox.style.display = 'none';
    }
}

async function fetchAdminProducts() {
    let { data, error } = await supabaseClient.from('products').select('*').order('created_at', { ascending: false });
    let tbody = document.getElementById('admin-products-table');
    if (!tbody || error) return;
    tbody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">لا توجد منتجات مضافة.</td></tr>';
        return;
    }

    data.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${p.img}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%; margin-left: 10px;" onerror="this.src='https://via.placeholder.com/40'"> ${p.name}</td>
                <td>${p.price} جنيه</td>
                <td>${p.stock}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">حذف</button></td>
            </tr>`;
    });
}

async function addNewProduct() {
    let name = document.getElementById('new-p-name').value.trim();
    let price = parseFloat(document.getElementById('new-p-price').value);
    let stock = parseInt(document.getElementById('new-p-stock').value);
    let img = document.getElementById('new-p-img').value.trim();

    if (!name || isNaN(price) || !img) {
        alert("املأ الحقول المطلوبة.");
        return;
    }

    let { error } = await supabaseClient.from('products').insert([{ name, price, stock, img }]);
    if (error) {
        alert("خطأ في الإضافة: " + error.message);
    } else {
        alert("تمت الإضافة بنجاح وتحديث المتجر للجميع!");
        document.getElementById('new-p-name').value = '';
        document.getElementById('new-p-price').value = '';
        document.getElementById('new-p-img').value = '';
        fetchAdminProducts();
    }
}

async function deleteProduct(id) {
    if (confirm("هل أنت متأكد من الحذف؟")) {
        let { error } = await supabaseClient.from('products').delete().eq('id', id);
        if (error) {
            alert("خطأ في الحذف: " + error.message);
        } else {
            fetchAdminProducts();
        }
    }
}

window.addEventListener('load', () => {
    checkSession();
});
