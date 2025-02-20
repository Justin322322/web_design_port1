function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.style.filter = 'blur(5px)';
                    const tempImage = new Image();
                    tempImage.src = img.dataset.src;
                    tempImage.onload = () => {
                        img.src = img.dataset.src;
                        img.style.filter = 'none';
                        img.style.transition = 'filter 0.3s';
                    };
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('.menu-item img').forEach(img => {
        const originalSrc = img.src;
        img.src = '/web_sys_activity/images/placeholder.jpg';
        img.dataset.src = originalSrc;
        imageObserver.observe(img);
    });
}

document.addEventListener('DOMContentLoaded', initializeLazyLoading);
