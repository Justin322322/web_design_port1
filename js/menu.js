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

    // Enhance menu navigation scrolling
    const menuNav = document.querySelector('.menu-nav');
    const filterButtons = document.querySelector('.filter-buttons');

    // Function to scroll active button into view
    function scrollActiveButtonIntoView(container, activeButton) {
        if (!activeButton) return;
        
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        const isFullyVisible = (
            buttonRect.left >= containerRect.left &&
            buttonRect.right <= containerRect.right
        );

        if (!isFullyVisible) {
            const scrollLeft = buttonRect.left - containerRect.left - 
                             (containerRect.width - buttonRect.width) / 2;
            container.parentElement.scrollLeft += scrollLeft;
        }
    }

    // Handle menu tab changes
    document.querySelectorAll('.menu-nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.menu-nav-btn').forEach(btn => 
                btn.classList.remove('active'));
            this.classList.add('active');
            scrollActiveButtonIntoView(menuNav, this);
        });
    });

    // Enhanced filter functionality
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(btn => 
                btn.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll filter button into view
            scrollActiveButtonIntoView(filterButtons, this);

            // Filter items with animation
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    const shouldShow = shouldShowItem(item, filter);
                    item.style.display = shouldShow ? 'block' : 'none';
                    
                    if (shouldShow) {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }
                }, 300);
            });
        });
    });

    // Helper function to determine if item should be shown
    function shouldShowItem(item, filter) {
        if (filter === 'all') return true;

        const dietaryInfo = item.querySelector('.dietary-info');
        if (!dietaryInfo) return false;

        const badges = dietaryInfo.querySelectorAll('.badge');
        let matches = false;

        badges.forEach(badge => {
            const text = badge.textContent.toLowerCase();
            if (filter === 'contains-nuts' && text.includes('nuts')) {
                matches = true;
            } else if (filter === 'gluten-free' && !text.includes('gluten')) {
                matches = true;
            } else if (filter === 'dairy-free' && !text.includes('dairy')) {
                matches = true;
            } else if (text.includes(filter.replace('-', ' '))) {
                matches = true;
            }
        });

        return matches;
    }
});
