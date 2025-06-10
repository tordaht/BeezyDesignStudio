/**
 * BEEZY DESIGN STUDIO | Creative Web Application
 * Serial: BDS-001 | Version: v1.0.0
 * Istanbul Creative Design Agency
 * 
 * @description Modern, yaratıcı web uygulaması - Tasarım ajansı sitesi
 * @author Beezy Development Team
 * @version 1.0.0
 * @date 2024
 */

'use strict';

// ========== MAIN APPLICATION CLASS ==========
class BeezyApp {
    constructor() {
        this.version = 'BDS-001 | v1.0.0';
        this.init();
    }

    init() {
        try {
            console.log(`🐝 Beezy Design Studio ${this.version} initialized`);
            
            // Initialize all components
            this.initializeComponents();
            this.attachEventListeners();
            this.initializeCreativeEffects();
            
            console.log('✅ Beezy App successfully loaded');
        } catch (error) {
            this.handleError('App initialization failed', error);
        }
    }

    initializeComponents() {
        // Core components
        this.navigation = new NavigationController();
        this.formController = new FormController();
        this.scrollController = new ScrollController();
        this.portfolioController = new PortfolioController();
        
        // Creative effects
        this.particleSystem = new ParticleSystem();
        this.mouseFollower = new MouseFollower();
        this.glitchEffects = new GlitchEffects();
        this.parallaxController = new ParallaxController();
    }

    initializeCreativeEffects() {
        // Initialize scroll reveal animations
        this.initScrollReveal();
        
        // Initialize creative animations
        this.initFloatingElements();
        this.initMorphingShapes();
        this.initColorWaves();
        this.initTypewriterEffect();
    }

    initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    initFloatingElements() {
        const floatingBees = document.querySelectorAll('.floating-bee');
        floatingBees.forEach((bee, index) => {
            bee.style.animationDelay = `${index * 0.5}s`;
            bee.style.animationDuration = `${6 + index}s`;
        });
    }

    initMorphingShapes() {
        const morphShapes = document.querySelectorAll('.morph-shape');
        morphShapes.forEach((shape, index) => {
            const delay = index * 2;
            shape.style.animationDelay = `${delay}s`;
        });
    }

    initColorWaves() {
        const colorWaveBgs = document.querySelectorAll('.color-wave-bg');
        colorWaveBgs.forEach(bg => {
            bg.addEventListener('mouseenter', () => {
                bg.style.animationDuration = '8s';
            });
            bg.addEventListener('mouseleave', () => {
                bg.style.animationDuration = '15s';
            });
        });
    }

    initTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.width = '0';
            
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    element.style.width = ((i + 1) * 0.6) + 'em';
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 100);
        });
    }

    attachEventListeners() {
        // Global error handling
        window.addEventListener('error', (e) => {
            this.handleError('Global error', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleError('Unhandled promise rejection', e.reason);
        });

        // Performance monitoring
        window.addEventListener('load', () => {
            this.logPerformance();
        });
    }

    handleError(context, error) {
        console.error(`🚨 ${context}:`, error);
        
        // Add to error log
        const errorLog = {
            timestamp: new Date().toISOString(),
            context,
            error: error.message || error,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        localStorage.setItem('beezy_error_log', JSON.stringify(errorLog));
    }

    logPerformance() {
        const loadTime = performance.now();
        console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
        
        if (loadTime > 3000) {
            console.warn('⚠️ Slow loading detected. Consider optimization.');
        }
    }
}

// ========== NAVIGATION CONTROLLER ==========
class NavigationController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.attachEvents();
        this.handleScroll();
    }

    attachEvents() {
        // Hamburger menu toggle
        this.hamburger?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.smoothScrollTo(targetId);
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle scroll for navbar styling
        window.addEventListener('scroll', debounce(() => {
            this.handleScroll();
        }, 10));
    }

    toggleMobileMenu() {
        this.hamburger?.classList.toggle('active');
        this.navMenu?.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMobileMenu() {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }

        // Update active navigation link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                activeLink?.classList.add('active');
            }
        });
    }

    smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ========== CREATIVE EFFECTS CONTROLLERS ==========

// Mouse Follower
class MouseFollower {
    constructor() {
        this.follower = document.querySelector('.mouse-follower');
        this.init();
    }

    init() {
        if (!this.follower) return;

        document.addEventListener('mousemove', (e) => {
            this.follower.style.left = e.clientX + 'px';
            this.follower.style.top = e.clientY + 'px';
        });

        // Scale on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .magnetic-hover');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.follower.style.transform = 'scale(3)';
            });
            element.addEventListener('mouseleave', () => {
                this.follower.style.transform = 'scale(1)';
            });
        });
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            this.createParticle(e.clientX, e.clientY);
        });
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        
        document.body.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}

// Glitch Effects
class GlitchEffects {
    constructor() {
        this.glitchElements = document.querySelectorAll('.glitch-text');
        this.init();
    }

    init() {
        this.glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.triggerGlitch(element);
            });
        });
    }

    triggerGlitch(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'glitch 0.3s ease-in-out infinite alternate';
        }, 10);

        setTimeout(() => {
            element.style.animation = 'none';
        }, 1000);
    }
}

// Parallax Controller
class ParallaxController {
    constructor() {
        this.parallaxElements = document.querySelectorAll('.parallax-element');
        this.init();
    }

    init() {
        window.addEventListener('scroll', debounce(() => {
            this.updateParallax();
        }, 16));
    }

    updateParallax() {
        const scrollY = window.scrollY;

        this.parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ========== FORM CONTROLLER ==========
class FormController {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.attachFormEvents();
            this.initFloatingLabels();
        }
    }

    attachFormEvents() {
        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(e.target);
        });

        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    initFloatingLabels() {
        const formGroups = this.contactForm.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('.form-input');
            const label = group.querySelector('.form-label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        group.classList.remove('focused');
                    }
                });
                
                // Check if input has value on load
                if (input.value) {
                    group.classList.add('focused');
                }
            }
        });
    }

    async handleFormSubmission(form) {
        try {
            this.showLoadingState(true);
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Validate all fields
            if (!this.validateForm(data)) {
                this.showLoadingState(false);
                return;
            }

            // Simulate API call
            await this.submitForm(data);
            
            this.showSuccessMessage();
            form.reset();
            
        } catch (error) {
            this.showErrorMessage();
            console.error('Form submission error:', error);
        } finally {
            this.showLoadingState(false);
        }
    }

    validateForm(data) {
        let isValid = true;
        const requiredFields = ['name', 'email', 'service', 'message'];
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                this.showFieldError(field, 'Bu alan zorunludur');
                isValid = false;
            }
        });

        // Email validation
        if (data.email && !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Geçerli bir e-posta adresi girin');
            isValid = false;
        }

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        
        if (input.required && !value) {
            this.showFieldError(fieldName, 'Bu alan zorunludur');
            return false;
        }
        
        if (fieldName === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(fieldName, 'Geçerli bir e-posta adresi girin');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }

    showFieldError(fieldName, message) {
        const field = this.contactForm.querySelector(`[name="${fieldName}"]`);
        const formGroup = field?.closest('.form-group');
        
        if (formGroup) {
            formGroup.classList.add('error');
            
            let errorElement = formGroup.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }
    }

    clearFieldError(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            const errorElement = formGroup.querySelector('.error-message');
            errorElement?.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async submitForm(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showLoadingState(isLoading) {
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.textContent = isLoading ? 'Gönderiliyor...' : 'Gönder';
        }
    }

    showSuccessMessage() {
        this.showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
    }

    showErrorMessage() {
        this.showNotification('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// ========== PORTFOLIO CONTROLLER ==========
class PortfolioController {
    constructor() {
        this.portfolioGrid = document.querySelector('.portfolio-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        
        this.init();
    }

    init() {
        this.attachFilterEvents();
        this.initPortfolioHover();
    }

    attachFilterEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterPortfolio(filter);
                this.updateActiveFilter(button);
            });
        });
    }

    filterPortfolio(filter) {
        this.portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    updateActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    initPortfolioHover() {
        this.portfolioItems.forEach(item => {
            const image = item.querySelector('img');
            
            item.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
            });
            
            item.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        });
    }
}

// ========== SCROLL CONTROLLER ==========
class ScrollController {
    constructor() {
        this.backToTopBtn = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        this.initBackToTop();
        this.initScrollProgress();
    }

    initBackToTop() {
        if (!this.backToTopBtn) return;

        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 300) {
                this.backToTopBtn.classList.add('visible');
            } else {
                this.backToTopBtn.classList.remove('visible');
            }
        }, 100));

        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    initScrollProgress() {
        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            z-index: 10000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }
}

// ========== UTILITY FUNCTIONS ==========

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

// ========== INITIALIZATION ==========

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BeezyApp();
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            // Uncomment when service worker is ready
            // const registration = await navigator.serviceWorker.register('/sw.js');
            // console.log('SW registered: ', registration);
        } catch (registrationError) {
            console.log('SW registration failed: ', registrationError);
        }
    });
}

// Console signature
console.log('%c🐝 BEEZY DESIGN STUDIO', 'font-size: 24px; font-weight: bold; color: #D4A574;');
console.log('%cIstanbul Creative Design Agency | BDS-001 v1.0.0', 'font-size: 12px; color: #666;');
console.log('%cLET THE HIVE DO THE WORK FOR YOU!', 'font-size: 14px; font-weight: bold; color: #F4B942;'); 