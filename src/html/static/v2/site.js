(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile navigation
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    if (nav && toggle) {
        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
        nav.querySelectorAll('.nav-links a, .nav-actions a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // Reveal elements as they enter the viewport
    const revealed = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealed.forEach(el => el.classList.add('in'));
    } else {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
        revealed.forEach(el => io.observe(el));
    }

    // Scroll-linked effects: hero drift and lineup zoom-out
    const heroMedia = document.querySelector('.hero-media');
    const lineup = document.querySelector('.lineup');
    const lineupImg = lineup && lineup.querySelector('img');

    if (!reduceMotion) {
        let ticking = false;
        const update = () => {
            const vh = window.innerHeight;
            if (heroMedia) {
                const y = Math.min(window.scrollY, vh);
                heroMedia.style.transform = `translateY(${y * 0.35}px) scale(${1 + y / vh * 0.08})`;
            }
            if (lineupImg) {
                const rect = lineup.getBoundingClientRect();
                // 0 when the image enters from the bottom, 1 when its center reaches mid-screen
                const progress = Math.min(Math.max((vh - rect.top) / (vh / 2 + rect.height / 2), 0), 1);
                lineupImg.style.transform = `scale(${1.12 - progress * 0.12})`;
            }
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }

    // Gallery arrow buttons
    const gallery = document.querySelector('.gallery');
    document.querySelectorAll('[data-gallery]').forEach(btn => {
        btn.addEventListener('click', () => {
            const figure = gallery.querySelector('figure');
            const step = figure ? figure.getBoundingClientRect().width + 16 : 400;
            gallery.scrollBy({ left: btn.dataset.gallery === 'next' ? step : -step, behavior: 'smooth' });
        });
    });

    // Pause the hero video when it's off-screen
    const video = document.querySelector('.hero-media video');
    if (video && 'IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
        }).observe(video);
    }
})();
