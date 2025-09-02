// Sponsorship Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation functionality
    initNavigation();
    
    // Initialize sponsor logo animations
    initSponsorAnimations();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize sponsorship tier dropdowns
    initSponsorshipTiers();
});

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

function initSponsorAnimations() {
    const sponsorLogos = document.querySelectorAll('.sponsor-logo-large');
    
    // Add intersection observer for fade-in animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sponsorLogos.forEach(logo => {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(30px)';
        logo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(logo);
    });
}

function initScrollEffects() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.sponsorship-hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Utility function for smooth animations
function animateOnScroll(selector, animationClass) {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animationClass);
                }
            });
        },
        { threshold: 0.1 }
    );
    
    elements.forEach(element => observer.observe(element));
}

function initSponsorshipTiers() {
    const tierHeaders = document.querySelectorAll('.tier-header');
    
    tierHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tier = this.getAttribute('data-tier');
            const dropdown = document.getElementById(`${tier}-dropdown`);
            const isActive = this.classList.contains('active');
            
            // Close all other dropdowns
            tierHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    otherHeader.classList.remove('active');
                    const otherTier = otherHeader.getAttribute('data-tier');
                    const otherDropdown = document.getElementById(`${otherTier}-dropdown`);
                    if (otherDropdown) {
                        otherDropdown.classList.remove('active');
                    }
                }
            });
            
            // Toggle current dropdown
            if (isActive) {
                this.classList.remove('active');
                dropdown.classList.remove('active');
            } else {
                this.classList.add('active');
                dropdown.classList.add('active');
            }
        });
    });
}
