/* ============================================
   MAIN.JS - Portfolio Principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Nav scroll
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Reveal on scroll
    const reveals = document.querySelectorAll('.project-card, .about-grid, .section-title');
    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '-50px' });

    reveals.forEach(el => observer.observe(el));
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 100;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    // Elementos a animar
    const revealElements = document.querySelectorAll(`
        .section-header,
        .about-content,
        .skill-card,
        .project,
        .terminal,
        .contact-content,
        .contact-visual
    `);
    
    // Añadir clase reveal a todos
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    // Observer para detectar cuando entran en viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
    
    // Skills cards con stagger delay
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Projects con stagger delay
    const projects = document.querySelectorAll('.project');
    projects.forEach((project, index) => {
        project.style.transitionDelay = `${index * 0.15}s`;
    });
}

/* ============================================
   STATS COUNTER ANIMATION
   ============================================ */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-value[data-value]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const endValue = parseFloat(element.dataset.value);
    const isDecimal = element.dataset.decimal === 'true';
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        const currentValue = endValue * eased;
        
        if (isDecimal) {
            element.textContent = currentValue.toFixed(2);
        } else {
            element.textContent = Math.floor(currentValue);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Valor final exacto
            element.textContent = isDecimal ? endValue.toFixed(2) : endValue;
        }
    }
    
    requestAnimationFrame(update);
}

/* ============================================
   RESULTS COUNTER ANIMATION (para proyectos)
   ============================================ */
function initResultsCounter() {
    const counters = document.querySelectorAll('.result-value');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                animateResultCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateResultCounter(element) {
    element.dataset.counted = 'true';
    
    const text = element.textContent.trim();
    let finalValue = parseFloat(text.replace(/[^0-9.-]/g, ''));
    const hasDecimal = text.includes('.');
    const hasPercent = text.includes('%');
    const hasPlus = text.startsWith('+');
    const prefix = hasPlus ? '+' : '';
    const suffix = hasPercent ? '%' : '';
    
    const duration = 1500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const currentValue = finalValue * easeProgress;
        
        if (hasDecimal) {
            element.textContent = prefix + currentValue.toFixed(2) + suffix;
        } else {
            element.textContent = prefix + Math.round(currentValue) + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Valor final exacto
            element.textContent = text;
        }
    }
    
    requestAnimationFrame(update);
}

/* ============================================
   TERMINAL ANIMATION
   ============================================ */
function initTerminalAnimation() {
    const terminal = document.querySelector('.terminal');
    
    if (!terminal) return;
    
    const observerOptions = {
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observer.observe(terminal);
}

/* ============================================
   PARALLAX FLOATING ELEMENTS
   ============================================ */
document.addEventListener('mousemove', (e) => {
    const floatingElements = document.querySelectorAll('.floating-element');
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    floatingElements.forEach((el, index) => {
        const speed = (index + 1) * 0.3;
        el.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px) rotate(${moveX}deg)`;
    });
});

/* ============================================
   HOVER EFFECTS FOR CARDS
   ============================================ */
document.querySelectorAll('.skill-card, .project-screen').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Nav scroll
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Reveal on scroll
    const reveals = document.querySelectorAll('.project-card, .about-grid, .section-title, .contact-terminal');
    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '-50px' });

    reveals.forEach(el => observer.observe(el));
});

// Copy email (ofuscado - bots no pueden leerlo)
function copyEmail() {
    const p1 = 'felipeddiazcontacto';
    const p2 = 'gmail';
    const p3 = 'com';
    const email = p1 + '@' + p2 + '.' + p3;
    
    navigator.clipboard.writeText(email).then(() => {
        const btn = document.querySelector('.email-copy');
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
    });
}

// Console branding
console.log('%c Luis Felipe Portfolio ', 'background: #6b8afd; color: #000010; font-size: 16px; padding: 8px; border-radius: 4px;');
console.log('%c Sports Analytics & ML Engineer ', 'color: #8ea0b4; font-size: 12px;');

document.addEventListener('DOMContentLoaded', () => {
    // Nav scroll
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Reveal on scroll
    const reveals = document.querySelectorAll('.project-card, .about-grid, .section-title');
    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '-50px' });

    reveals.forEach(el => observer.observe(el));

    // Constellation line animation
    const lines = document.querySelectorAll('.constellation-lines line');
    lines.forEach((line, i) => {
        line.style.strokeDasharray = '200';
        line.style.strokeDashoffset = '200';
        line.style.animation = `drawLine 1s ease ${0.1 * i}s forwards`;
    });

    // Add draw line keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes drawLine {
            to { stroke-dashoffset: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Lightbox
function openLightbox(src) {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.querySelector('.lightbox-img').src = src;
        lightbox.classList.add('active');
    }
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Lightbox click handlers (nuevo ajuste)
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }
});
