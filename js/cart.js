let cart = [];

function addToCart(item) {
    const existingItem = cart.find(i => i.name === item.name);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
    saveCartToLocalStorage();
    
    // Show feedback to user
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    offcanvas.show();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    saveCartToLocalStorage();
}

function updateQuantity(index, delta) {
    const item = cart[index];
    const newQuantity = (item.quantity || 1) + delta;
    
    if (newQuantity < 1) {
        removeFromCart(index);
    } else {
        item.quantity = newQuantity;
        updateCartUI();
        saveCartToLocalStorage();
    }
}

// Update the updateCartUI function to handle both mobile and desktop cart counts
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Update both mobile and desktop cart counts
    [cartCount, cartCountMobile].forEach(element => {
        if (element) {
            if (totalQuantity > 0) {
                element.textContent = totalQuantity;
                element.style.display = 'inline-block';
            } else {
                element.style.display = 'none';
            }
        }
    });

    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item d-flex justify-content-between align-items-center mb-3';
        itemDiv.innerHTML = `
            <div>
                <h6 class="mb-0">${item.name}</h6>
                <small>$${item.price.toFixed(2)}</small>
            </div>
            <div class="d-flex align-items-center">
                <div class="quantity-controls me-3">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="mx-2">${item.quantity || 1}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <span class="me-2">$${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    const cartTotal = document.getElementById('cart-total');
    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function saveCartToLocalStorage() {
    localStorage.setItem('brewHavenCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('brewHavenCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Create a form for customer information
    const customerInfo = {
        name: prompt('Please enter your name:'),
        email: prompt('Please enter your email:'),
        phone: prompt('Please enter your phone number:')
    };

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        alert('Please provide all required information');
        return;
    }

    const orderData = {
        items: cart,
        customerInfo: customerInfo,
        total: cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    };

    fetch('order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Order placed successfully! Order ID: ${data.orderId}`);
            cart = [];
            saveCartToLocalStorage();
            updateCartUI();
            // Close the cart offcanvas
            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
            offcanvas.hide();
        } else {
            alert('Error placing order: ' + (data.message || 'Please try again.'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error placing order. Please try again.');
    });
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    // Initialize tooltips and popovers if needed
    if (typeof bootstrap !== 'undefined') {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
    }
});