function joinLoyalty() {
    const modal = new bootstrap.Modal(document.getElementById('loyaltyModal'));
    modal.show();
}

function openCateringForm() {
    const modal = new bootstrap.Modal(document.getElementById('cateringModal'));
    modal.show();
}

function updatePrice(select) {
    const menuItem = select.closest('.menu-item-content');
    const priceElement = menuItem.querySelector('.price');
    const basePrice = parseFloat(priceElement.getAttribute('data-base-price'));
    
    if (select.value === 'double') {
        priceElement.textContent = `$${(basePrice + 1).toFixed(2)}`;
    } else {
        priceElement.textContent = `$${basePrice.toFixed(2)}`;
    }
}

// Loyalty points calculator
function calculatePoints(amount) {
    return Math.floor(amount);  // 1 point per dollar
}

// Handle catering form submission
document.addEventListener('DOMContentLoaded', function() {
    const cateringForm = document.getElementById('catering-form');
    if (cateringForm) {
        cateringForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission logic here
            alert('Thank you for your catering inquiry. We will contact you shortly!');
        });
    }
});
