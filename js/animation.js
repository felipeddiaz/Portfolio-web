/* ============================================
   CUSTOM CURSOR
   ============================================ */

class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        
        if (!this.cursor || !this.cursorDot) return;
        
        this.cursorX = 0;
        this.cursorY = 0;
        this.dotX = 0;
        this.dotY = 0;
        
        this.init();
    }
    
    init() {
        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        });
        
        // Click handlers
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('click');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('click');
        });
        
        // Hover handlers for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .skill-card, .social-link, .project, input, textarea');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorDot.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorDot.style.opacity = '1';
        });
        
        // Start animation loop
        this.animate();
    }
    
    animate() {
        // Smooth follow for main cursor
        this.dotX += (this.cursorX - this.dotX) * 0.2;
        this.dotY += (this.cursorY - this.dotY) * 0.2;
        
        // Position elements
        this.cursor.style.left = `${this.cursorX - 12}px`;
        this.cursor.style.top = `${this.cursorY - 12}px`;
        
        this.cursorDot.style.left = `${this.dotX - 2.5}px`;
        this.cursorDot.style.top = `${this.dotY - 2.5}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
        new CustomCursor();
    }
});

-- CURSOR

/* ============================================
   ANIMATIONS & SCROLL REVEAL
   ============================================ */

class ScrollAnimations {
    constructor() {
        this.revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        this.sections = document.querySelectorAll('section');
        this.skillCards = document.querySelectorAll('.skill-card');
        this.projects = document.querySelectorAll('.project');
        this.terminal = document.querySelector('.terminal');
        
        this.init();
    }
    
    init() {
        // Create intersection observer for reveal animations
        this.createRevealObserver();
        
        // Create observer for skill cards stagger
        this.createSkillsObserver();
        
        // Create observer for projects
        this.createProjectsObserver();
        
        // Create observer for terminal
        this.createTerminalObserver();
        
        // Initialize parallax
        this.initParallax();
        
        // Stats counter animation
        this.initStatsCounter();
    }
    
    createRevealObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        this.revealElements.forEach(el => observer.observe(el));
    }
    
    createSkillsObserver() {
        const options = {
            threshold: 0.2
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add stagger animation to children
                    const cards = entry.target.querySelectorAll('.skill-card');
                    cards.forEach((card, index) => {
                        card.style.transitionDelay = `${index * 0.1}s`;
                        card.classList.add('visible');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        const skillsGrid = document.querySelector('.skills-grid');
        if (skillsGrid) observer.observe(skillsGrid);
    }
    
    createProjectsObserver() {
        const options = {
            threshold: 0.2
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);
        
        this.projects.forEach(project => {
            project.classList.add('reveal');
            observer.observe(project);
        });
    }
    
    createTerminalObserver() {
        if (!this.terminal) return;
        
        const options = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        observer.observe(this.terminal);
    }
    
    initParallax() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            
            floatingElements.forEach((el, index) => {
                const speed = (index + 1) * 0.5;
                el.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
            });
        });
    }
    
    initStatsCounter() {
        const stats = document.querySelectorAll('.stat-value[data-value]');
        
        const options = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        stats.forEach(stat => observer.observe(stat));
    }
    
    animateValue(element) {
        const endValue = parseFloat(element.dataset.value);
        const isDecimal = element.dataset.decimal === 'true';
        const duration = 2000;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = endValue * easeOutQuart;
            
            if (isDecimal) {
                element.textContent = currentValue.toFixed(2);
            } else {
                element.textContent = Math.floor(currentValue);
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = isDecimal ? endValue.toFixed(2) : endValue;
            }
        };
        
        requestAnimationFrame(update);
    }
}

// Smooth scroll for anchor links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Text typing effect
class TypeWriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }
    
    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new SmoothScroll();
});

