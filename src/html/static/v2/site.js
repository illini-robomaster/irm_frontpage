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
    const lineupImg = lineup && lineup.querySelector('img, video');

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

    // Scroll-scrubbed media: inside a `.scrub-media` block, the still image
    // hands over to a <video data-scrub> whose playhead follows the scroll.
    // Encode the video with short keyframe spacing (e.g. ffmpeg -g 5) so
    // seeking stays smooth.
    document.querySelectorAll('.scrub-media').forEach(media => {
        const video = media.querySelector('video[data-scrub]');
        if (!video) return;

        if (reduceMotion) {
            // No scroll-driven motion: show the clip as a plain loop
            media.classList.add('is-playing');
            video.loop = true;
            video.play().catch(() => {});
            return;
        }

        // Fetch the full clip only once the tile is getting close
        new IntersectionObserver((entries, io) => {
            if (entries[0].isIntersecting) {
                video.preload = 'auto';
                // load() resets the playhead, so only kick off a fetch that hasn't started
                if (video.readyState === 0) video.load();
                io.disconnect();
            }
        }, { rootMargin: '100% 0px' }).observe(media);

        let target = 0;

        const seek = () => {
            media.classList.toggle('is-playing', target > 0);
            if (!video.duration) return;
            const t = target * (video.duration - 0.05);
            if (Math.abs(video.currentTime - t) > 0.02) video.currentTime = t;
        };

        // `data-scrub-track="<selector>"` drives the clip from another element's
        // scroll position — used when the media itself is sticky
        const track = media.dataset.scrubTrack && document.querySelector(media.dataset.scrubTrack);

        const onScroll = () => {
            const vh = window.innerHeight;
            if (track) {
                // Runs from the track's top entering the bottom of the screen until its bottom reaches 50%
                const r = track.getBoundingClientRect();
                target = Math.min(Math.max((vh - r.top) / (r.height + vh * 0.5), 0), 1);
            } else {
                // Starts once the media's top passes 45% of the screen, ends when
                // its bottom reaches 45% — the photo shows while the tile scrolls in
                const rect = media.getBoundingClientRect();
                target = Math.min(Math.max((vh * 0.45 - rect.top) / rect.height, 0), 1);
            }
            seek();
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        ['loadedmetadata', 'loadeddata'].forEach(e => video.addEventListener(e, onScroll));
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
