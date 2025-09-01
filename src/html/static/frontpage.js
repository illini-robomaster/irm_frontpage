// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.about-card, .team-card, .competition-info, .join-text, .contact-item').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for statistics
    function animateCounter(element, target, pfx, sfx, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = pfx + target + sfx;
                clearInterval(timer);
            } else {
                element.textContent = pfx + Math.floor(start) + sfx;
            }
        }, 16);
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.anim_stat h4');
                stats.forEach((stat, index) => {
                    const values = [200, 20_000, 420];
                    const prefixes = ['', '$', ''];
                    const suffixes = ['+', '+', 'm²'];
                    setTimeout(() => {
                        animateCounter(stat, values[index], prefixes[index],
                                       suffixes[index]);
                        stat.innerHTML = values[index] + suffixes[index] + '+';
                    }, index * 200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.competition-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        const speed = scrolled * 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero content on load
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroText && heroImage) {
            heroText.style.opacity = '0';
            heroText.style.transform = 'translateX(-50px)';
            heroImage.style.opacity = '0';
            heroImage.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                heroText.style.transition = 'all 0.8s ease';
                heroImage.style.transition = 'all 0.8s ease';
                heroText.style.opacity = '1';
                heroText.style.transform = 'translateX(0)';
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateX(0)';
            }, 300);
        }
    });

    // Add hover effects for cards
    document.querySelectorAll('.about-card, .team-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Form validation (if you add a contact form later)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Scroll to top functionality
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
    `;
    
    document.body.appendChild(scrollToTop);

    scrollToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTop.style.opacity = '1';
            scrollToTop.style.transform = 'translateY(0)';
        } else {
            scrollToTop.style.opacity = '0';
            scrollToTop.style.transform = 'translateY(10px)';
        }
    });

    // Add typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Trigger typing effect after page load
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-text h1');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 150);
        }
    }, 800);

    // Add click tracking for analytics (placeholder)
    document.querySelectorAll('.btn, .social-link').forEach(element => {
        element.addEventListener('click', function(e) {
            const action = this.textContent.trim() || this.querySelector('span')?.textContent || 'Unknown';
            console.log(`User clicked: ${action}`);
            // Here you would typically send data to your analytics service
        });
    });

    // Preload images (if you add any later)
    function preloadImages(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Apply debounce to scroll events
    const debouncedScroll = debounce(function() {
        // Scroll-dependent functions here
    }, 10);

    window.addEventListener('scroll', debouncedScroll);

    // Add focus styles for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });

    // Console welcome message
    console.log(`
    ╔══════════════════════════════════════╗
    ║        Illini RoboMaster             ║
    ║     Competitive Robotics Team        ║
    ║                                      ║
    ║  Interested in joining our team?     ║
    ║  Contact us: illini.robomaster@...   ║
    ╚══════════════════════════════════════╝
    `);
});

// Additional CSS for keyboard navigation
const keyboardCSS = `
    .using-keyboard *:focus {
        outline: 2px solid #e74c3c !important;
        outline-offset: 2px;
    }
`;

const style = document.createElement('style');
style.textContent = keyboardCSS;
document.head.appendChild(style);
