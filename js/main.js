/*
 * Consortium Marocain - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initProductsSlider();
    initAnimations();
    initContactForm();
    initModals();
});

// ==================== HEADER ====================
function initHeader() {
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const menuItems = mainMenu.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                mainMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// ==================== PRODUCTS SLIDER ====================
function initProductsSlider() {
    const track = document.getElementById('sliderTrack');
    const container = document.getElementById('sliderContainer');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (!track || !container) return;

    const slides = track.querySelectorAll('.slide-item');
    if (slides.length === 0) return;

    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let totalSlides = slides.length;
    let maxIndex = Math.max(0, totalSlides - slidesPerView);
    let autoplayInterval = null;

    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';

        const dotsCount = maxIndex + 1;
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Update dots
    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Get slides per view based on screen width
    function getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    // Calculate slide width
    function getSlideWidth() {
        const slide = slides[0];
        const style = window.getComputedStyle(slide);
        const width = slide.offsetWidth;
        const marginRight = parseInt(style.marginRight) || 0;
        const gap = 25; // gap from CSS
        return width + gap;
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const slideWidth = getSlideWidth();
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }

    // Next slide
    function nextSlide() {
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0);
        }
    }

    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(maxIndex);
        }
    }

    // Start autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    // Stop autoplay
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        });
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            slidesPerView = getSlidesPerView();
            maxIndex = Math.max(0, totalSlides - slidesPerView);
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            createDots();
            goToSlide(currentIndex);
        }, 250);
    });

    // Pause on hover
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);

    // Initialize
    createDots();
    goToSlide(0);
    startAutoplay();
}

// ==================== ANIMATIONS ====================
function initAnimations() {
    // Animate elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Animate counters
                if (entry.target.classList.contains('figure-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.figure-item, .product-card, .partner-item, .timeline-item, .certification-card, .slide-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    document.querySelectorAll('.figure-number').forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[0-9]/g, '');

    if (isNaN(number)) return;

    let current = 0;
    const increment = number / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = number + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
}

// Add animation class
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>
`);

// ==================== CONTACT FORM ====================
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }

        // Show success message (in production, this would send to a server)
        alert('Merci pour votre message! Nous vous contacterons bientôt.');
        form.reset();
    });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== MODALS ====================
function initModals() {
    // Video Modal
    const videoCatalogBox = document.getElementById('videoCatalogBox');
    const videoModal = document.getElementById('videoModal');
    const closeVideoModal = document.getElementById('closeVideoModal');
    const modalVideo = document.getElementById('modalVideo');

    // Image Modal
    const imageCatalogBox = document.getElementById('imageCatalogBox');
    const imageModal = document.getElementById('imageModal');
    const closeImageModal = document.getElementById('closeImageModal');

    // Open Video Modal
    if (videoCatalogBox && videoModal) {
        videoCatalogBox.addEventListener('click', function() {
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (modalVideo) {
                modalVideo.currentTime = 0;
                modalVideo.play();
            }
        });
    }

    // Close Video Modal
    if (closeVideoModal && videoModal) {
        closeVideoModal.addEventListener('click', function() {
            closeModal(videoModal, modalVideo);
        });
    }

    // Open Image Modal
    if (imageCatalogBox && imageModal) {
        imageCatalogBox.addEventListener('click', function() {
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close Image Modal
    if (closeImageModal && imageModal) {
        closeImageModal.addEventListener('click', function() {
            closeModal(imageModal);
        });
    }

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                const video = this.querySelector('video');
                closeModal(this, video);
            }
        });
    });

    // Close modals on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (videoModal && videoModal.classList.contains('active')) {
                closeModal(videoModal, modalVideo);
            }
            if (imageModal && imageModal.classList.contains('active')) {
                closeModal(imageModal);
            }
        }
    });

    function closeModal(modal, video = null) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
