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

    // Scroll-scrubbed clips: the video's position follows the page scroll.
    // Add `data-scrub` to any <video>; encode it with short keyframe intervals
    // (e.g. ffmpeg -g 5) so seeking stays smooth.
    document.querySelectorAll('video[data-scrub]').forEach(video => {
        const bar = video.parentElement.querySelector('.clip-progress span');

        if (reduceMotion) {
            // No scroll-driven motion: just loop the clip
            video.loop = true;
            video.autoplay = true;
            video.play().catch(() => {});
            return;
        }

        let target = 0;
        let pending = false;

        const seek = () => {
            pending = false;
            if (!video.duration) return;
            const t = target * (video.duration - 0.05);
            if (Math.abs(video.currentTime - t) > 0.02) video.currentTime = t;
            if (bar) bar.style.transform = `scaleX(${target})`;
        };

        const onScroll = () => {
            const rect = video.getBoundingClientRect();
            const vh = window.innerHeight;
            // 0 when the clip's center is 85% down the screen, 1 when it reaches 25%
            const center = rect.top + rect.height / 2;
            target = Math.min(Math.max((vh * 0.85 - center) / (vh * 0.6), 0), 1);
            if (!pending) {
                pending = true;
                requestAnimationFrame(seek);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        video.addEventListener('loadedmetadata', onScroll);
        // iOS Safari won't render seeks until the video has been played once
        const unlock = () => {
            video.play().then(() => { video.pause(); onScroll(); }).catch(() => {});
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('touchstart', unlock, { passive: true });
        onScroll();
    });

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
