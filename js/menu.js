document.addEventListener('DOMContentLoaded', function() {
    // Initialize image lazy loading
    const images = document.querySelectorAll('.menu-item img');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-load');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => {
        img.classList.add('lazy-load');
        const originalSrc = img.src;
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Tiny placeholder
        img.dataset.src = originalSrc;
        imageObserver.observe(img);
    });

    // Add filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            const menuItems = document.querySelectorAll('.menu-item');

            menuItems.forEach(item => {
                let showItem = false;

                if (filter === 'all') {
                    showItem = true;
                } else {
                    const dietaryInfo = item.querySelector('.dietary-info');
                    if (dietaryInfo) {
                        const badges = dietaryInfo.querySelectorAll('.badge');
                        badges.forEach(badge => {
                            if (badge.textContent.toLowerCase().includes(filter.replace('-', ' '))) {
                                showItem = true;
                            }
                            if (filter === 'contains-nuts' && badge.textContent.toLowerCase().includes('nuts')) {
                                showItem = true;
                            }
                            if (filter === 'gluten-free' && !badge.textContent.toLowerCase().includes('gluten')) {
                                showItem = true;
                            }
                            if (filter === 'dairy-free' && !badge.textContent.toLowerCase().includes('dairy')) {
                                showItem = true;
                            }
                        });
                    }
                }

                if (showItem) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Update active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
