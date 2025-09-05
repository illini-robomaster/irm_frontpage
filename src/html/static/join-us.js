// Join Us Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
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
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Horizontal timeline animation functionality
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    // Initialize steps for animation
    timelineSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    
    // Timeline animation observer
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const steps = document.querySelectorAll('.timeline-step');
                
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.style.opacity = '1';
                        step.style.transform = 'translateY(0)';
                    }, index * 150);
                });
                
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe timeline
    const seasonTimeline = document.querySelector('.season-timeline');
    if (seasonTimeline) {
        timelineObserver.observe(seasonTimeline);
    }
    
    // Enhanced hover effects
    timelineSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 50px rgba(102, 126, 234, 0.4)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.2)';
        });
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
    document.querySelectorAll('.timeline-item, .step, .benefit').forEach(el => {
        observer.observe(el);
    });

    // Animate recruitment info section
    const recruitmentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const categories = entry.target.querySelectorAll('.recruit-category');
                categories.forEach((category, index) => {
                    setTimeout(() => {
                        category.style.opacity = '1';
                        category.style.transform = 'translateY(0)';
                    }, index * 150);
                });
                recruitmentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Initialize and observe recruitment section
    const recruitmentInfo = document.querySelector('.recruitment-info');
    if (recruitmentInfo) {
        const categories = recruitmentInfo.querySelectorAll('.recruit-category');
        categories.forEach(category => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(20px)';
            category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        recruitmentObserver.observe(recruitmentInfo);
    }

    // Add CSS keyframes for timeline animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: translateX(-50%) scale(1);
                opacity: 1;
            }
            50% {
                transform: translateX(-50%) scale(1.1);
                opacity: 0.8;
            }
        }
        
        .timeline-step::before {
            animation: pulse 2s infinite;
        }
        
        .timeline-step:hover::before {
            animation: pulse 1s infinite;
        }
    `;
    document.head.appendChild(style);
});
    document.head.appendChild(style);

    // Smooth scrolling for navigation
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
    
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Animate recruitment info section
    const recruitmentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const categories = entry.target.querySelectorAll('.recruit-category');
                categories.forEach((category, index) => {
                    setTimeout(() => {
                        category.style.opacity = '1';
                        category.style.transform = 'translateY(0)';
                    }, index * 150);
                });
                recruitmentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Initialize and observe recruitment section
    const recruitmentInfo = document.querySelector('.recruitment-info');
    if (recruitmentInfo) {
        const categories = recruitmentInfo.querySelectorAll('.recruit-category');
        categories.forEach(category => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(20px)';
            category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        recruitmentObserver.observe(recruitmentInfo);
    }
});
