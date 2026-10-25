// admin.js

const ALLOWED_ADMINS = [
    "omarosman20074@gmail.com"
];

function loginAdmin() {
    let emailInput = document.getElementById('admin-email');
    if (!emailInput) return;
    
    let email = emailInput.value.trim().toLowerCase();

    if (!email) {
        alert("الرجاء إدخال البريد الإلكتروني.");
        return;
    }

    if (ALLOWED_ADMINS.includes(email)) {
        localStorage.setItem('torathe_admin', email);
        checkSession();
    } else {
        alert("عذراً، هذا البريد غير مصرح له بفتح لوحة التحكم.");
    }
}

function logoutAdmin() {
    localStorage.removeItem('torathe_admin');
    checkSession();
}

function checkSession() {
    let savedEmail = localStorage.getItem('torathe_admin');
    let authBox = document.getElementById('auth-container');
    let dashBox = document.getElementById('dashboard-container');

    if (!authBox || !dashBox) return;

    if (savedEmail && ALLOWED_ADMINS.includes(savedEmail)) {
        authBox.style.display = 'none';
        dashBox.style.display = 'block';
        let emailLbl = document.getElementById('user-email-lbl');
        if (emailLbl) emailLbl.innerText = "المشرف: " + savedEmail;
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
    let imageFileInput = document.getElementById('new-p-img-file');
    let imageFile = imageFileInput ? imageFileInput.files[0] : null;

    if (!name || isNaN(price) || !imageFile) {
        alert("الرجاء إدخال اسم المنتج، السعر، واختيار صورة من الجهاز.");
        return;
    }

    // تحويل الصورة المرفوعة من الجهاز إلى Base64 محلياً (تجنب مشاكل التخزين والسيرفرات تماماً)
    let reader = new FileReader();
    reader.readAsDataURL(imageFile);
    
    reader.onload = async function () {
        let img = reader.result; // النتيجة عبارة عن رابط صورة محلي مشفر وآمن

        // حفظ بيانات المنتج والصورة معاً في جدول المنتجات
        let { error: insertError } = await supabaseClient.from('products').insert([{ name, price, stock, img }]);
        
        if (insertError) {
            alert("خطأ في حفظ المنتج في قاعدة البيانات: " + insertError.message);
        } else {
            alert("تم إضافة المنتج والصورة بنجاح وتحديث المتجر!");
            document.getElementById('new-p-name').value = '';
            document.getElementById('new-p-price').value = '';
            if (document.getElementById('new-p-stock')) document.getElementById('new-p-stock').value = '';
            imageFileInput.value = '';
            fetchAdminProducts();
        }
    };

    reader.onerror = function (error) {
        alert("حدث خطأ أثناء قراءة ملف الصورة.");
        console.error(error);
    };
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
