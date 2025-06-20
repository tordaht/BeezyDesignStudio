document.addEventListener('DOMContentLoaded', () => {

    const SELECTORS = {
        cursor: '.cursor',
        heroTitle: '#hero-title',
        heroTitleChars: '.g-char',
        heroSubtitle: '#hero-subtitle',
        heroButton: '#hero-button',
        fadeUpElements: '.g-fade-up',
        processSteps: '.process-step',
        header: '#header',
        serviceCards: '.service-card',
        portfolioItems: '.portfolio-item',
        portfolioImages: '.portfolio-item img',
        mainHeader: '#main-header',
        links: 'a, button',
        portfolioGrid: '#portfolio-grid',
        filterButtons: '[data-filter]',
        navToggle: '#nav-toggle',
        navContent: '#nav-content',
        themeToggle: '#theme-toggle',
        themeToggleMobile: '#theme-toggle-mobile',
        darkIcon: '#theme-toggle-dark-icon',
        lightIcon: '#theme-toggle-light-icon',
    };

    const SETTINGS = {
        lenis: { lerp: 0.07 },
        hero: {
            chars: { y: 100, opacity: 0, stagger: 0.05, duration: 1.2 },
            subtitle: { y: 30, opacity: 0, stagger: 0.2, duration: 1 }
        },
        fadeUp: { y: 50, duration: 1, start: 'top 85%' },
        process: { start: 'top center', end: 'bottom center' },
        header: { start: 'top -80', end: 99999 },
        parallax: { yPercent: -10 }
    };

    function initSmoothScroll() {
        const lenis = new Lenis(SETTINGS.lenis);
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    function initCustomCursor() {
        const cursor = document.querySelector(SELECTORS.cursor);
        if (!cursor) return;
        
        window.addEventListener('mousemove', e => {
            // GSAP kaldırıldı, anlık pozisyon güncellemesi için doğrudan stil ataması yapıldı.
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Animation
        const heroTitle = document.getElementById(SELECTORS.heroTitle.substring(1));
        if(heroTitle) {
            const chars = heroTitle.querySelectorAll(SELECTORS.heroTitleChars);
            const heroSubtitle = document.querySelector(SELECTORS.heroSubtitle);
            const heroButton = document.querySelector(SELECTORS.heroButton);

            gsap.set(chars, { y: SETTINGS.hero.chars.y, opacity: SETTINGS.hero.chars.opacity });
            gsap.set([heroSubtitle, heroButton], { y: SETTINGS.hero.subtitle.y, opacity: SETTINGS.hero.subtitle.opacity });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.to(chars, {
                y: 0,
                opacity: 1,
                stagger: SETTINGS.hero.chars.stagger,
                duration: SETTINGS.hero.chars.duration
            })
            .to([heroSubtitle, heroButton], {
                opacity: 1,
                y: 0,
                stagger: SETTINGS.hero.subtitle.stagger,
                duration: SETTINGS.hero.subtitle.duration
            }, "-=0.8");
        }

        // Generic Fade Up Animations
        const fadeUpElements = gsap.utils.toArray(SELECTORS.fadeUpElements);
        fadeUpElements.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: SETTINGS.fadeUp.y },
                {
                    opacity: 1,
                    y: 0,
                    duration: SETTINGS.fadeUp.duration,
                    delay: parseFloat(el.style.getPropertyValue("--g-delay")) || 0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: SETTINGS.fadeUp.start,
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Process Steps Animation
        const processSteps = gsap.utils.toArray(SELECTORS.processSteps);
        processSteps.forEach(step => {
            ScrollTrigger.create({
                trigger: step,
                start: SETTINGS.process.start,
                end: SETTINGS.process.end,
                onToggle: self => self.isActive ? step.classList.add('is-active') : step.classList.remove('is-active')
            });
        });

        // Header Style on Scroll
        const header = document.querySelector(SELECTORS.header);
        if (header) {
            ScrollTrigger.create({
                start: SETTINGS.header.start,
                end: SETTINGS.header.end,
                toggleClass: { className: 'nav-blur', target: header }
            });
        }
        
        // Portfolio Parallax Effect
        const portfolioImages = gsap.utils.toArray(SELECTORS.portfolioImages);
        portfolioImages.forEach(img => {
            const item = img.closest(SELECTORS.portfolioItems);
            if (item) {
                 gsap.to(img, {
                    yPercent: SETTINGS.parallax.yPercent,
                    ease: "none",
                    scrollTrigger: {
                        trigger: item,
                        scrub: true
                    }
                });
            }
        });
    }

    function initInteractiveCards() {
        const cards = document.querySelectorAll(SELECTORS.serviceCards);
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    function initHeaderScrollEffect() {
        const header = document.querySelector(SELECTORS.mainHeader);
        if (!header) return;

        const scrollThreshold = 50; // 50px kaydırdıktan sonra efekt başlasın

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    function initPortfolioFilter() {
        const portfolioGrid = document.querySelector(SELECTORS.portfolioGrid);
        const filterButtons = document.querySelectorAll(SELECTORS.filterButtons);
        
        if (!portfolioGrid || filterButtons.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Aktif buton stilini ayarla
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');
                const items = portfolioGrid.querySelectorAll('.portfolio-card');

                items.forEach(item => {
                    if (filterValue === '*' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    function initNavigation() {
        const navToggle = document.querySelector(SELECTORS.navToggle);
        const navContent = document.querySelector(SELECTORS.navContent);

        if (navToggle && navContent) {
            navToggle.addEventListener('click', () => {
                navContent.classList.toggle('hidden');
            });
        }
    }

    function initThemeSwitcher() {
        const themeToggleBtn = document.querySelector(SELECTORS.themeToggle);
        const themeToggleMobileBtn = document.querySelector(SELECTORS.themeToggleMobile);
        const darkIcon = document.querySelector(SELECTORS.darkIcon);
        const lightIcon = document.querySelector(SELECTORS.lightIcon);

        if (!themeToggleBtn || !darkIcon || !lightIcon) return;
        
        const updateIcons = (isDark) => {
            // Dark moddayken, light moda geçiş için güneş ikonunu göster.
            // Light moddayken, dark moda geçiş için ay ikonunu göster.
            darkIcon.classList.toggle('hidden', isDark);
            lightIcon.classList.toggle('hidden', !isDark);
            
            if(themeToggleMobileBtn) {
                 // Mobil buton için de ikonları güncelle (ID çakışmasını önlemek için ID'yi kaldır)
                 themeToggleMobileBtn.innerHTML = isDark 
                    ? lightIcon.outerHTML.replace(/id="[^"]*"/, '') 
                    : darkIcon.outerHTML.replace(/id="[^"]*"/, '');
            }
        };

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
                updateIcons(true);
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
                updateIcons(false);
            }
        };
        
        // Tarayıcı hafızasında veya sistem tercihinde tema yoksa, varsayılan olarak 'dark' başla.
        const currentTheme = localStorage.theme || 'dark';
        applyTheme(currentTheme);

        const toggleFn = () => {
            const isDark = document.documentElement.classList.contains('dark');
            applyTheme(isDark ? 'light' : 'dark');
        };

        themeToggleBtn.addEventListener('click', toggleFn);
        if(themeToggleMobileBtn) {
            themeToggleMobileBtn.addEventListener('click', toggleFn);
        }
    }

    // --- INITIATE ALL SCRIPTS ---
    initSmoothScroll();
    initCustomCursor();
    initAnimations();
    initInteractiveCards();
    initHeaderScrollEffect();
    initPortfolioFilter();
    initNavigation();
    initThemeSwitcher();
}); 