// ===================================
// VINALINK LANDING PAGE - MAIN JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // ===================================
    // STICKY HEADER
    // ===================================
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            backToTop.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            backToTop.classList.remove('show');
        }
    });
    
    // ===================================
    // BACK TO TOP
    // ===================================
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
    
    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for sticky header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // FAQ ACCORDION
    // ===================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // ===================================
    // CONTACT FORM HANDLING
    // ===================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                fullname: document.getElementById('fullname').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                package: document.getElementById('package').value,
                message: document.getElementById('message').value
            };
            
            // Basic validation
            if (!formData.fullname || !formData.phone || !formData.email) {
                showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showNotification('Email không hợp lệ!', 'error');
                return;
            }
            
            // Phone validation (Vietnam phone numbers)
            const phoneRegex = /^(0|\+84)[0-9]{9}$/;
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
                showNotification('Số điện thoại không hợp lệ!', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                console.log('Form Data:', formData);
                
                // Show success message
                showNotification('Cảm ơn bạn đã đăng ký! Vinalink sẽ liên hệ trong 24h.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Restore button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                
                // Track conversion event (if GA4 is set up)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'engagement',
                        'event_label': 'Contact Form - YOLA Proposal',
                        'value': formData.package
                    });
                }
            }, 2000);
        });
    }
    
    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles if not exists
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .notification-success {
                    border-left: 4px solid #4CAF50;
                }
                
                .notification-error {
                    border-left: 4px solid #F44336;
                }
                
                .notification-info {
                    border-left: 4px solid #2196F3;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }
                
                .notification-content i {
                    font-size: 1.5rem;
                }
                
                .notification-success .notification-content i {
                    color: #4CAF50;
                }
                
                .notification-error .notification-content i {
                    color: #F44336;
                }
                
                .notification-info .notification-content i {
                    color: #2196F3;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #999;
                    font-size: 1.25rem;
                    padding: 0;
                    transition: color 0.2s;
                }
                
                .notification-close:hover {
                    color: #333;
                }
                
                @media (max-width: 768px) {
                    .notification {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // ===================================
    // ANALYTICS TRACKING
    // ===================================
    
    // Track CTA button clicks
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'CTA',
                    'event_label': buttonText,
                    'value': 1
                });
            }
            console.log('CTA Click:', buttonText);
        });
    });
    
    // Track phone number clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_hotline', {
                    'event_category': 'engagement',
                    'event_label': 'Phone Click',
                    'value': 1
                });
            }
            console.log('Phone Click');
        });
    });
    
    // Track section visibility (scroll depth)
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.5
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id || 'unnamed';
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'section_view', {
                        'event_category': 'engagement',
                        'event_label': sectionId,
                        'value': 1
                    });
                }
                console.log('Section viewed:', sectionId);
                // Unobserve after first view
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // ===================================
    // PRICING TABLE - HIGHLIGHT ON HOVER
    // ===================================
    const pricingRows = document.querySelectorAll('.pricing-table tbody tr');
    
    pricingRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // ===================================
    // LAZY LOAD IMAGES (if needed)
    // ===================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===================================
    // COPY TO CLIPBOARD (for phone/email)
    // ===================================
    function copyToClipboard(text, message) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification(message || 'Đã sao chép!', 'success');
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    }
    
    // Add double-click to copy for phone/email
    document.querySelectorAll('.hotline, .footer-contact a').forEach(element => {
        element.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const text = this.textContent.trim();
            copyToClipboard(text, `Đã sao chép: ${text}`);
        });
    });
    
    // ===================================
    // PERFORMANCE MONITORING
    // ===================================
    window.addEventListener('load', function() {
        // Log page load time
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
        
        // Track page load performance
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                'name': 'load',
                'value': loadTime,
                'event_category': 'Page Performance'
            });
        }
    });
    
    // ===================================
    // CONSOLE BRANDING
    // ===================================
    console.log('%c🚀 VINALINK MEDIA', 'color: #E31E24; font-size: 24px; font-weight: bold;');
    console.log('%cĐề xuất SEO Chuyển Đổi cho YOLA', 'color: #333; font-size: 16px;');
    console.log('%cLiên hệ: 028 3997 0399 | info@vinalink.com', 'color: #777; font-size: 14px;');
    
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format number with thousand separators
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Animate counter (for stats)
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(Math.floor(target));
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}