/* ============================================
   NAVIGATION
   ============================================ */

class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.lastScrollY = 0;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        // Scroll handler for nav background
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.scrollY;
            
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                
                this.ticking = true;
            }
        });
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.nav.classList.contains('open')) {
                this.closeMobileMenu();
            }
        });
        
        // Active link highlighting
        this.initActiveLinks();
    }
    
    handleScroll() {
        if (this.lastScrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        // Hide/show nav on scroll direction
        if (this.lastScrollY > this.prevScrollY && this.lastScrollY > 500) {
            this.nav.style.transform = 'translateY(-100%)';
        } else {
            this.nav.style.transform = 'translateY(0)';
        }
        
        this.prevScrollY = this.lastScrollY;
    }
    
    toggleMobileMenu() {
        this.nav.classList.toggle('open');
        
        if (this.nav.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeMobileMenu() {
        this.nav.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    initActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        const options = {
            rootMargin: '-50% 0px -50% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const link = document.querySelector(`.nav-links a[href="#${id}"]`);
                
                if (link) {
                    if (entry.isIntersecting) {
                        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        }, options);
        
        sections.forEach(section => observer.observe(section));
    }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});
