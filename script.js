document.addEventListener('DOMContentLoaded', () => {
    // ================================================
    // Mobile nav toggle
    // ================================================
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const expanded = navLinks.classList.contains('open');
            toggle.setAttribute('aria-expanded', expanded);
            toggle.classList.toggle('open', expanded);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // ================================================
    // Smooth scroll for anchor links
    // ================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ================================================
    // Typing effect for hero tagline
    // ================================================
    const tagline = document.querySelector('.hero-tagline');
    if (tagline) {
        const fullText = tagline.textContent;
        tagline.innerHTML = '<span class="cursor"></span>';

        let charIndex = 0;
        const typeSpeed = 45;
        const startDelay = 600;

        function typeChar() {
            if (charIndex < fullText.length) {
                tagline.innerHTML = fullText.slice(0, charIndex + 1) + '<span class="cursor"></span>';
                charIndex++;
                setTimeout(typeChar, typeSpeed);
            } else {
                // Remove cursor after a pause
                setTimeout(() => {
                    tagline.innerHTML = fullText;
                }, 2000);
            }
        }

        setTimeout(typeChar, startDelay);
    }

    // ================================================
    // Staggered fade-in with IntersectionObserver
    // ================================================
    const fadeSelectors = [
        '.service-card',
        '.project-card',
        '.about-layout',
        '.contact-link',
        '.section-title',
        '.hero-sub',
        '.hero-ctas',
        '.skills-list'
    ];

    const fadeEls = document.querySelectorAll(fadeSelectors.join(', '));
    fadeEls.forEach(el => el.classList.add('fade-in'));

    // Group elements by their parent for staggered delays
    const staggerGroups = new Map();

    fadeEls.forEach(el => {
        const parent = el.parentElement;
        if (!staggerGroups.has(parent)) {
            staggerGroups.set(parent, []);
        }
        staggerGroups.get(parent).push(el);
    });

    // Assign stagger delay based on position within parent
    staggerGroups.forEach((children) => {
        children.forEach((el, index) => {
            el.style.transitionDelay = `${index * 100}ms`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });

    fadeEls.forEach(el => observer.observe(el));

    // ================================================
    // Header background on scroll
    // ================================================
    const header = document.querySelector('.site-header');

    function updateHeader() {
        if (window.scrollY > 50) {
            header.style.borderBottomColor = 'rgba(99, 102, 241, 0.1)';
        } else {
            header.style.borderBottomColor = '';
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });

    // ================================================
    // Subtle parallax fade on hero
    // ================================================
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroContainer = hero.querySelector('.container');
        window.addEventListener('scroll', () => {
            const heroHeight = hero.offsetHeight;
            if (window.scrollY < heroHeight && heroContainer) {
                const opacity = 1 - (window.scrollY / heroHeight) * 0.4;
                heroContainer.style.opacity = Math.max(opacity, 0.6);
            }
        }, { passive: true });
    }

    // ================================================
    // Skill pills hover glow follows mouse
    // ================================================
    const skillPills = document.querySelectorAll('.skill-pill');
    skillPills.forEach(pill => {
        pill.addEventListener('mouseenter', () => {
            pill.style.transition = 'all 0.3s ease';
        });
    });

    // ================================================
    // Active nav highlight on scroll
    // ================================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(item => {
                    item.style.color = '';
                    if (item.getAttribute('href') === `#${id}`) {
                        item.style.color = '#e8eaf0';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
});
