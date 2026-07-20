const starsContainer = document.getElementById('stars');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animeTools = window.anime || {};
const animeAnimate = typeof animeTools.animate === 'function' ? animeTools.animate : null;
const animeStagger = typeof animeTools.stagger === 'function' ? animeTools.stagger : null;
const animeCreateTimeline = typeof animeTools.createTimeline === 'function' ? animeTools.createTimeline : null;

if (starsContainer && !prefersReducedMotion) {
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
const observerOptions = {
    // On mobile, very tall sections can fail a high threshold and stay invisible.
    threshold: isSmallScreen ? 0.02 : 0.1,
    rootMargin: isSmallScreen ? '0px 0px -40px 0px' : '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.dataset.revealed === 'true') {
            return;
        }

        entry.target.dataset.revealed = 'true';

        if (animeAnimate) {
            animeAnimate(entry.target, {
                opacity: 1,
                translateY: 0,
                duration: 700,
                ease: 'out(3)',
                onComplete: () => {
                    entry.target.style.willChange = '';
                }
            });
        } else {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }

        observer.unobserve(entry.target);
    });
}, observerOptions);

const shouldAnimateSections = !window.matchMedia('(max-width: 768px)').matches && !prefersReducedMotion;
document.querySelectorAll('section').forEach(section => {
    if (!shouldAnimateSections) {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        return;
    }
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.willChange = 'opacity, transform';
    if (!animeAnimate) {
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    observer.observe(section);
});

const motionTargets = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const canUseAnimeMotion = Boolean(animeAnimate) && !prefersReducedMotion;

const runIntroMotion = () => {
    if (!canUseAnimeMotion) return;

    document.body.classList.add('motion-enhanced');

    const navTargets = motionTargets('.logo, .nav-links li, .theme-toggle, .mobile-menu-toggle');
    animeAnimate(navTargets, {
        opacity: [0, 1],
        translateY: [-12, 0],
        duration: 620,
        delay: animeStagger ? animeStagger(55) : 0,
        ease: 'out(3)'
    });

    const heroTargets = motionTargets(
        '.hero-kicker, .hero-headline h1, .hero-headline h2, .hero-summary, .hero-signal, .hero-actions .btn, .impact-console-card'
    );
    animeAnimate(heroTargets, {
        opacity: [0, 1],
        translateY: [34, 0],
        scale: [0.98, 1],
        duration: 850,
        delay: animeStagger ? animeStagger(70, { start: 180 }) : 180,
        ease: 'out(4)'
    });

    animeAnimate('.hero-headline h1 strong', {
        opacity: [0.72, 1],
        textShadow: [
            '0 0 0 rgba(var(--accent-rgb), 0)',
            '0 0 24px rgba(var(--accent-rgb), 0.34)'
        ],
        duration: 1100,
        delay: animeStagger ? animeStagger(120, { start: 620 }) : 620,
        ease: 'out(3)'
    });

    animeAnimate('.orbit-container', {
        translateY: [-8, 8],
        duration: 3600,
        loop: true,
        alternate: true,
        ease: 'inOut(2)'
    });

    animeAnimate('.profile-image-wrapper', {
        scale: [1, 1.035],
        boxShadow: [
            '0 0 40px rgba(var(--accent-rgb), 0.28)',
            '0 0 58px rgba(var(--accent-rgb), 0.42)'
        ],
        duration: 2400,
        loop: true,
        alternate: true,
        ease: 'inOut(2)'
    });

};

const bindMagneticButtons = () => {
    if (!canUseAnimeMotion) return;

    motionTargets('.btn, .project-link, .resume-btn, #send-btn').forEach((button) => {
        button.addEventListener('mouseenter', () => {
            animeAnimate(button, {
                translateY: -4,
                scale: 1.035,
                duration: 320,
                ease: 'out(3)'
            });
        });

        button.addEventListener('mouseleave', () => {
            animeAnimate(button, {
                translateY: 0,
                translateX: 0,
                scale: 1,
                duration: 360,
                ease: 'out(3)'
            });
        });

        button.addEventListener('mousemove', (event) => {
            const rect = button.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * 7;
            animeAnimate(button, {
                translateX: x,
                translateY: y - 4,
                duration: 260,
                ease: 'out(3)'
            });
        });
    });
};

const bindCardMotion = () => {
    if (!canUseAnimeMotion) return;

    motionTargets('.project-card, .experience-card, .education-card, .about-story, .journey-console').forEach((card) => {
        card.addEventListener('mouseenter', () => {
            animeAnimate(card, {
                translateY: -8,
                scale: 1.012,
                duration: 380,
                ease: 'out(3)'
            });

            const childTargets = motionTargets('.project-metric, .project-detail, .project-stack-inline span, .experience-block, .education-pill', card);
            if (childTargets.length) {
                animeAnimate(childTargets, {
                    translateY: [-2, -7],
                    scale: [1, 1.025],
                    duration: 340,
                    delay: animeStagger ? animeStagger(18) : 0,
                    ease: 'out(3)'
                });
            }

            const svgTargets = motionTargets('.arch-node, .arch-chip, .arch-link, .arch-bus', card);
            if (svgTargets.length) {
                animeAnimate(svgTargets, {
                    opacity: [0.68, 1],
                    scale: [0.98, 1.035],
                    duration: 460,
                    delay: animeStagger ? animeStagger(24) : 0,
                    ease: 'out(4)'
                });
            }
        });

        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 3.5;
            const rotateX = (((event.clientY - rect.top) / rect.height - 0.5) * -3.5);
            animeAnimate(card, {
                rotateX,
                rotateY,
                duration: 280,
                ease: 'out(3)'
            });
        });

        card.addEventListener('mouseleave', () => {
            animeAnimate(card, {
                translateY: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 460,
                ease: 'out(3)'
            });

            const childTargets = motionTargets('.project-metric, .project-detail, .project-stack-inline span, .experience-block, .education-pill', card);
            if (childTargets.length) {
                animeAnimate(childTargets, {
                    translateY: 0,
                    scale: 1,
                    duration: 360,
                    ease: 'out(3)'
                });
            }

            const svgTargets = motionTargets('.arch-node, .arch-chip, .arch-link, .arch-bus', card);
            if (svgTargets.length) {
                animeAnimate(svgTargets, {
                    opacity: 1,
                    scale: 1,
                    duration: 360,
                    ease: 'out(3)'
                });
            }
        });
    });
};

const runAmbientMotion = () => {
    if (!canUseAnimeMotion) return;

    animeAnimate('.journey-planet-dot', {
        scale: [1, 1.05],
        duration: 1800,
        delay: animeStagger ? animeStagger(180) : 0,
        loop: true,
        alternate: true,
        ease: 'inOut(2)'
    });

    animeAnimate('.star', {
        opacity: [0.25, 1],
        scale: [0.65, 1.35],
        duration: 1600,
        delay: animeStagger ? animeStagger(12) : 0,
        loop: true,
        alternate: true,
        ease: 'inOut(2)'
    });

};

const initSkillsTimer = () => {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const track = skillsSection.querySelector('.skill-timer-track');
    const prevButton = skillsSection.querySelector('.skill-timer-arrow.prev');
    const nextButton = skillsSection.querySelector('.skill-timer-arrow.next');
    const tabs = motionTargets('.skill-timer-tab', skillsSection);
    const panels = motionTargets('.skill-category', skillsSection);
    if (!track || !tabs.length || !panels.length) return;

    let activeIndex = -1;
    let scrollTimer = null;

    const centerTab = (index) => {
        const tab = tabs[index];
        if (!tab) return;
        const left = tab.offsetLeft - (track.clientWidth - tab.clientWidth) / 2;
        track.scrollTo({
            left,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    };

    const setActiveSkill = (index, shouldCenter = true) => {
        const nextIndex = Math.min(Math.max(index, 0), panels.length - 1);
        if (nextIndex === activeIndex) return;
        activeIndex = nextIndex;

        tabs.forEach((tab, tabIndex) => {
            const active = tabIndex === activeIndex;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', String(active));
        });

        panels.forEach((panel, panelIndex) => {
            const active = panelIndex === activeIndex;
            panel.classList.toggle('active', active);
            panel.setAttribute('aria-hidden', String(!active));
        });

        if (shouldCenter) {
            centerTab(activeIndex);
        }

        if (canUseAnimeMotion) {
            const activePanel = panels[activeIndex];
            const chips = motionTargets('.skill-list span', activePanel);

            if (animeCreateTimeline) {
                animeCreateTimeline()
                    .add(activePanel, {
                        opacity: [0, 1],
                        duration: 360,
                        ease: 'out(3)'
                    }, 0)
                    .add(chips, {
                        opacity: [0, 1],
                        duration: 300,
                        delay: animeStagger ? animeStagger(24) : 0,
                        ease: 'out(3)'
                    }, 120);
            } else {
                animeAnimate(activePanel, {
                    opacity: [0, 1],
                    duration: 360,
                    ease: 'out(3)'
                });
                animeAnimate(chips, {
                    opacity: [0, 1],
                    duration: 300,
                    delay: animeStagger ? animeStagger(24) : 0,
                    ease: 'out(3)'
                });
            }
        }
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => setActiveSkill(index));
        tab.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                setActiveSkill(index + 1);
                tabs[Math.min(index + 1, tabs.length - 1)]?.focus();
            }
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setActiveSkill(index - 1);
                tabs[Math.max(index - 1, 0)]?.focus();
            }
        });
    });

    prevButton?.addEventListener('click', () => setActiveSkill(activeIndex - 1));
    nextButton?.addEventListener('click', () => setActiveSkill(activeIndex + 1));

    track.addEventListener('scroll', () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
            const trackCenter = track.scrollLeft + track.clientWidth / 2;
            const nearestIndex = tabs.reduce((nearest, tab, index) => {
                const tabCenter = tab.offsetLeft + tab.clientWidth / 2;
                const nearestCenter = tabs[nearest].offsetLeft + tabs[nearest].clientWidth / 2;
                return Math.abs(tabCenter - trackCenter) < Math.abs(nearestCenter - trackCenter) ? index : nearest;
            }, 0);
            setActiveSkill(nearestIndex, false);
        }, 90);
    }, { passive: true });

    setActiveSkill(0);
};

const initScrollTopicRail = () => {
    const rail = document.getElementById('scroll-topic-rail');
    const aboutSection = document.getElementById('about');
    if (!rail || !aboutSection) return;

    const sectionConfigs = [
        { key: 'about', selector: '#about', label: 'About', childSelector: '.about-story, .journey-map-shell, .journey-console' },
        { key: 'experience', selector: '#experience', label: 'Experience', childSelector: '.experience-card' },
        { key: 'projects', selector: '#projects', label: 'Projects', childSelector: '.project-card' },
        { key: 'skills', selector: '#skills', label: 'Skills', childSelector: '.skill-category' },
        { key: 'education', selector: '#education', label: 'Education', childSelector: '.education-card' },
        { key: 'resume', selector: '#resume', label: 'Resume', children: [{ selector: '.resume-viewer', label: 'Resume Viewer' }] },
        { key: 'contact', selector: '#contact', label: 'Contact', children: [{ selector: '.contact-info', label: 'Contact Links' }, { selector: '#contact-form', label: 'Message Form' }] }
    ];

    const cleanLabel = (text) => text.replace(/[<>/]/g, '').replace(/\s+/g, ' ').trim();
    const getTitle = (element, fallback) => {
        const heading = element.matches('section') ? element.querySelector('h2') : element.querySelector('h3, h4');
        return cleanLabel(heading?.textContent || fallback);
    };

    const topicGroups = sectionConfigs.map((config) => {
        const section = document.querySelector(config.selector);
        if (!section) return null;
        if (!section.id) section.id = config.key;

        const childSources = config.children
            ? config.children.flatMap((childConfig) => (
                motionTargets(childConfig.selector, section).map((element) => ({ element, fallback: childConfig.label }))
            ))
            : motionTargets(config.childSelector, section).map((element, index) => ({ element, fallback: index === 0 ? config.label : `${config.label} ${index + 1}` }));

        const children = childSources
            .filter((source, index, list) => list.findIndex((candidate) => candidate.element === source.element) === index)
            .map((source, index) => {
                const { element, fallback } = source;
                if (!element.id) element.id = `topic-${config.key}-${index}`;
                return {
                    element,
                    title: getTitle(element, fallback)
                };
            });

        if (!children.length) {
            children.push({
                element: section,
                title: getTitle(section, config.label)
            });
        }

        return {
            ...config,
            element: section,
            title: getTitle(section, config.label),
            children
        };
    }).filter(Boolean);

    if (!topicGroups.length) return;

    rail.innerHTML = `
        <div class="scroll-topic-meter" aria-hidden="true">
            <div class="scroll-topic-meter-fill"></div>
        </div>
        <div class="scroll-topic-content">
            <div class="scroll-topic-label">Section timer</div>
            <div class="scroll-topic-wheel" aria-label="Section picker">
                <div class="scroll-topic-wheel-window" aria-hidden="true"></div>
                <div class="scroll-topic-wheel-track"></div>
            </div>
            <div class="scroll-topic-current" aria-live="polite">
                <span class="scroll-topic-section"></span>
                <span class="scroll-topic-title"></span>
            </div>
            <div class="scroll-topic-subtopics"></div>
        </div>
    `;

    const meterFill = rail.querySelector('.scroll-topic-meter-fill');
    const wheelTrack = rail.querySelector('.scroll-topic-wheel-track');
    const currentSection = rail.querySelector('.scroll-topic-section');
    const currentTitle = rail.querySelector('.scroll-topic-title');
    const subtopics = rail.querySelector('.scroll-topic-subtopics');

    const wheelButtons = topicGroups.map((group) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'scroll-topic-wheel-item';
        button.innerHTML = `<span>${group.label}</span>`;
        button.setAttribute('aria-label', `Jump to ${group.label}`);
        button.addEventListener('click', () => {
            group.element.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
        wheelTrack.appendChild(button);
        return button;
    });

    let activeGroupIndex = -1;
    let activeChildIndex = -1;
    let ticking = false;

    const renderSubtopics = (group, nextChildIndex) => {
        subtopics.innerHTML = '';
        return group.children.map((child, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'scroll-topic-subtopic';
            button.innerHTML = `<span>${child.title}</span>`;
            button.setAttribute('aria-label', `Jump to ${child.title}`);
            button.classList.toggle('active', index === nextChildIndex);
            button.setAttribute('aria-current', index === nextChildIndex ? 'location' : 'false');
            button.addEventListener('click', () => {
                child.element.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            });
            subtopics.appendChild(button);
            return button;
        });
    };

    const animateTopicChange = (groupChanged, subtopicButtons) => {
        if (!canUseAnimeMotion) return;

        if (animeCreateTimeline) {
            animeCreateTimeline()
                .add(wheelTrack, {
                    translateY: -activeGroupIndex * 56,
                    duration: 420,
                    ease: 'out(4)'
                }, 0)
                .add([currentSection, currentTitle], {
                    opacity: [0.35, 1],
                    translateY: [8, 0],
                    duration: 280,
                    delay: animeStagger ? animeStagger(35) : 0,
                    ease: 'out(3)'
                }, groupChanged ? 80 : 0)
                .add(subtopicButtons, {
                    opacity: [0, 1],
                    translateX: [-10, 0],
                    duration: 260,
                    delay: animeStagger ? animeStagger(30) : 0,
                    ease: 'out(3)'
                }, groupChanged ? 150 : 40);
            return;
        }

        animeAnimate(wheelTrack, {
            translateY: -activeGroupIndex * 56,
            duration: 420,
            ease: 'out(4)'
        });
        animeAnimate([currentSection, currentTitle], {
            opacity: [0.35, 1],
            translateY: [8, 0],
            duration: 280,
            delay: animeStagger ? animeStagger(35) : 0,
            ease: 'out(3)'
        });
        animeAnimate(subtopicButtons, {
            opacity: [0, 1],
            translateX: [-10, 0],
            duration: 260,
            delay: animeStagger ? animeStagger(30) : 0,
            ease: 'out(3)'
        });
    };

    const setActiveTopic = (nextGroupIndex, nextChildIndex) => {
        const group = topicGroups[nextGroupIndex];
        if (!group) return;
        const child = group.children[nextChildIndex] || group.children[0];
        const groupChanged = nextGroupIndex !== activeGroupIndex;
        const childChanged = nextChildIndex !== activeChildIndex;
        if (!groupChanged && !childChanged) return;

        activeGroupIndex = nextGroupIndex;
        activeChildIndex = nextChildIndex;

        currentSection.textContent = group.label;
        currentTitle.textContent = child.title;
        wheelButtons.forEach((button, index) => {
            const active = index === activeGroupIndex;
            button.classList.toggle('active', active);
            button.setAttribute('aria-current', active ? 'location' : 'false');
        });

        const subtopicButtons = groupChanged ? renderSubtopics(group, activeChildIndex) : Array.from(subtopics.children);
        subtopicButtons.forEach((button, index) => {
            const active = index === activeChildIndex;
            button.classList.toggle('active', active);
            button.setAttribute('aria-current', active ? 'location' : 'false');
        });

        if (!canUseAnimeMotion) {
            wheelTrack.style.transform = `translateY(${-activeGroupIndex * 56}px)`;
            return;
        }

        animateTopicChange(groupChanged, subtopicButtons);
    };

    const updateRail = () => {
        ticking = false;
        const aboutTop = aboutSection.getBoundingClientRect().top;
        const showRail = aboutTop <= window.innerHeight * 0.42;
        rail.classList.toggle('visible', showRail);

        const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(Math.max((window.scrollY / scrollable) * 100, 0), 100);
        meterFill.style.height = `${progress}%`;

        if (!showRail) return;

        const anchorLine = window.innerHeight * 0.38;
        const nextGroupIndex = topicGroups.reduce((active, group, index) => {
            const rect = group.element.getBoundingClientRect();
            return rect.top <= anchorLine ? index : active;
        }, 0);
        const activeGroup = topicGroups[nextGroupIndex];
        const nextChildIndex = activeGroup.children.reduce((active, child, index) => {
            const rect = child.element.getBoundingClientRect();
            return rect.top <= anchorLine ? index : active;
        }, 0);

        setActiveTopic(nextGroupIndex, nextChildIndex);
    };

    const requestRailUpdate = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateRail);
    };

    window.addEventListener('scroll', requestRailUpdate, { passive: true });
    window.addEventListener('resize', requestRailUpdate);
    updateRail();
};

initScrollTopicRail();
initSkillsTimer();
runIntroMotion();
bindMagneticButtons();
bindCardMotion();
runAmbientMotion();
const supportsCustomCursor = !window.siteCursorInitialized && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let cursor = null;
const trailCount = 8; // number of trail dots
const trails = [];
let moveTimeout;

const hideCustomCursor = () => {
    if (!cursor) return;
    cursor.style.opacity = '0';
    trails.forEach(trail => { trail.style.opacity = '0'; });
};

const showCustomCursor = () => {
    if (!cursor) return;
    cursor.style.opacity = '1';
};

if (supportsCustomCursor) {
    cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    for (let i = 0; i < trailCount; i++) {
        const t = document.createElement('div');
        t.classList.add('cursor-trail');
        t.style.opacity = '0'; // initially invisible
        document.body.appendChild(t);
        trails.push(t);
    }

    document.addEventListener('mousemove', e => {
        showCustomCursor();
        cursor.style.top = e.clientY + 'px';
        cursor.style.left = e.clientX + 'px';

        trails.forEach((trail, index) => {
            trail.style.opacity = '1'; // make trail visible
            setTimeout(() => {
                trail.style.top = e.clientY + 'px';
                trail.style.left = e.clientX + 'px';
            }, index * 20); // stagger trail positions
        });

        // Clear previous timeout
        if (moveTimeout) clearTimeout(moveTimeout);

        // Hide trails after 200ms of no movement
        moveTimeout = setTimeout(() => {
            trails.forEach(trail => {
                trail.style.opacity = '0';
            });
        }, 200);
    });

    document.addEventListener('mouseleave', hideCustomCursor);
    window.addEventListener('blur', hideCustomCursor);
    window.addEventListener('scroll', hideCustomCursor, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) hideCustomCursor();
    });
    document.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse') {
            hideCustomCursor();
        }
    });
    document.addEventListener('touchstart', hideCustomCursor, { passive: true });

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    const pdfInteractiveAreas = document.querySelectorAll('.pdf-scroll');
    pdfInteractiveAreas.forEach(area => {
        area.addEventListener('mouseenter', hideCustomCursor);
        area.addEventListener('mouseleave', showCustomCursor);
    });
} else if (!window.siteCursorInitialized) {
    document.body.classList.add('native-cursor');
}

const profileImage = document.querySelector('.profile-image');
const profilePlaceholder = document.querySelector('.profile-placeholder');
if (profileImage) {
    const revealProfileImage = () => {
        profileImage.classList.add('visible');
        profilePlaceholder?.classList.add('hidden');
    };
    if (profileImage.complete && profileImage.naturalWidth !== 0) {
        revealProfileImage();
    } else {
        profileImage.addEventListener('load', revealProfileImage);
        profileImage.addEventListener('error', () => {
            profilePlaceholder?.classList.remove('hidden');
        });
    }
}

const showPDFFallback = (container) => {
    const fallback = container.nextElementSibling;
    if (fallback && fallback.classList.contains('pdf-fallback')) {
        fallback.style.display = 'block';
    }
};

const PDF_WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
let pdfWorkerConfigured = false;
let pdfEngine = null;

const initPdfEngine = () => {
    if (pdfEngine) return pdfEngine;
    const globalPdf = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
    if (!globalPdf) return null;
    pdfEngine = globalPdf;
    if (!pdfWorkerConfigured) {
        pdfEngine.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
        pdfWorkerConfigured = true;
    }
    return pdfEngine;
};

const createPaginationControls = (container, totalPages) => {
    const controls = document.createElement('div');
    controls.classList.add('pdf-pagination');

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'resume-btn ghost pdf-nav';
    prevBtn.textContent = 'Previous';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'resume-btn ghost pdf-nav';
    nextBtn.textContent = 'Next';

    const pageIndicator = document.createElement('span');
    pageIndicator.className = 'pdf-page-indicator';

    controls.appendChild(prevBtn);
    controls.appendChild(pageIndicator);
    controls.appendChild(nextBtn);
    container.parentElement.appendChild(controls);

    return { controls, prevBtn, nextBtn, pageIndicator };
};

const renderPageToCanvas = async (page, scale) => {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.classList.add('pdf-page');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;
    return canvas;
};

const renderPDFPreview = async (container) => {
    const src = container?.dataset?.pdfSrc;
    if (!src) {
        showPDFFallback(container);
        return;
    }
    const engine = initPdfEngine();
    if (!engine) {
        showPDFFallback(container);
        return;
    }
    if (container.dataset.pdfLoaded === 'true') return;

    container.classList.add('loading');
    try {
        const pdf = await engine.getDocument(src).promise;
        const scale = parseFloat(container.dataset.pdfScale || '1.05');
        const preloadCount = parseInt(container.dataset.pdfPreload || '3', 10);
        // Show pagination for any multi-page PDF; preload count only controls eager rendering.
        const pagination = pdf.numPages > 1 ? createPaginationControls(container, pdf.numPages) : null;
        const state = {
            currentPage: 1,
            renderedPages: new Map()
        };

        const renderPage = async (pageNum) => {
            if (state.renderedPages.has(pageNum)) return state.renderedPages.get(pageNum);
            const page = await pdf.getPage(pageNum);
            const canvas = await renderPageToCanvas(page, scale);
            state.renderedPages.set(pageNum, canvas);
            return canvas;
        };

        const showPage = async (pageNum) => {
            container.innerHTML = '';
            const canvas = await renderPage(pageNum);
            container.appendChild(canvas);
            state.currentPage = pageNum;
            if (pagination) {
                pagination.pageIndicator.textContent = `Page ${pageNum} of ${pdf.numPages}`;
                pagination.prevBtn.disabled = pageNum === 1;
                pagination.nextBtn.disabled = pageNum === pdf.numPages;
            }
        };

        const pagesToPreload = Math.min(preloadCount, pdf.numPages);
        for (let i = 1; i <= pagesToPreload; i += 1) {
            await renderPage(i);
        }
        await showPage(1);

        if (pagination) {
            pagination.prevBtn.addEventListener('click', () => {
                if (state.currentPage > 1) {
                    showPage(state.currentPage - 1);
                }
            });
            pagination.nextBtn.addEventListener('click', () => {
                if (state.currentPage < pdf.numPages) {
                    showPage(state.currentPage + 1);
                }
            });
        }

        container.dataset.pdfLoaded = 'true';
    } catch (error) {
        console.error(`Failed to render PDF preview for ${src}`, error);
        showPDFFallback(container);
    } finally {
        container.classList.remove('loading');
    }
};

const pdfContainers = document.querySelectorAll('.pdf-scroll[data-pdf-src]');

const bootPdfRendering = () => {
    if (!pdfContainers.length) return;
    const engine = initPdfEngine();
    if (!engine) {
        console.warn('PDF.js library unavailable; falling back to download link.');
        pdfContainers.forEach(showPDFFallback);
        return;
    }
    pdfContainers.forEach(renderPDFPreview);
};

if (pdfContainers.length) {
    window.addEventListener('load', bootPdfRendering);
}

(function() {
    emailjs.init("K5YHHoBJEybkJKtUb");
})();

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const fireContainer = document.querySelector(".fire-container");
const rocket = document.querySelector(".rocket-container");

const getThemeColor = (variable) => getComputedStyle(document.body).getPropertyValue(variable).trim();

// Function to generate fire particles
function generateFire() {
    if (!fireContainer) return;
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.classList.add("fire-particle");
        particle.style.left = Math.random() * window.innerWidth + "px";
        particle.style.width = 5 + Math.random() * 15 + "px";
        particle.style.height = particle.style.width;
        particle.style.animationDuration = 1 + Math.random() * 2 + "s";
        fireContainer.appendChild(particle);

        if (canUseAnimeMotion) {
            animeAnimate(particle, {
                translateY: [0, -(160 + Math.random() * 280)],
                translateX: [0, (Math.random() - 0.5) * 90],
                scale: [1, 0.2],
                opacity: [0.9, 0],
                duration: 900 + Math.random() * 900,
                ease: 'out(2)'
            });
        }

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
}

function launchRocket() {
    // Create rocket element
    const rocket = document.createElement("div");
    rocket.classList.add("rocket");
    document.body.appendChild(rocket);

    // Create full-page fire effect
    const fireContainer = document.createElement("div");
    fireContainer.classList.add("fire-container");
    document.body.appendChild(fireContainer);

    // Generate multiple fire particles
    for (let i = 0; i < 100; i++) {
        const fire = document.createElement("div");
        fire.classList.add("fire-particle");
        fire.style.left = Math.random() * window.innerWidth + "px";
        fire.style.top = window.innerHeight + "px";
        fireContainer.appendChild(fire);

        // Animate fire particle
        const duration = 1000 + Math.random() * 1000;
        fire.animate([
            { transform: `translateY(0px) scale(1)`, opacity: 1 },
            { transform: `translateY(-${window.innerHeight}px) scale(0.5)`, opacity: 0 }
        ], { duration: duration, easing: "linear", iterations: 1 });
    }

    // Animate rocket going up
    rocket.style.left = window.innerWidth / 2 + "px";
    rocket.style.bottom = "0px";
    rocket.animate([
        { transform: "translateY(0)" },
        { transform: `translateY(-${window.innerHeight}px)` }
    ], { duration: 2500, easing: "ease-in" });

    // Remove rocket and fire after animation
    setTimeout(() => {
        rocket.remove();
        fireContainer.remove();
    }, 2600);
}


form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
    status.textContent = "Please fill out all required fields.";
    status.style.color = "orange";
    return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    status.textContent = "Invalid email address.";
    status.style.color = "orange";
    return;
    }

    status.textContent = "Sending message...";
    status.style.color = getThemeColor("--form-status-color") || "#00ff99";

    emailjs.send("service_do57gr2", "template_b6i4nff", {
        name: name,
        email: email,
        message: message
    })
    .then(() => {
    status.textContent = "Message sent successfully! Launching rocket...";
    status.style.color = getThemeColor("--form-status-color") || "#00ff99";
    form.reset();

    // Trigger rocket animation
    if (rocket) {
        rocket.style.opacity = 1;
        const rocketImg = rocket.querySelector(".rocket");
        generateFire();

        if (canUseAnimeMotion && rocketImg) {
            animeAnimate(rocketImg, {
                translateY: [0, -window.innerHeight * 0.92],
                translateX: [0, -18, 14, 0],
                rotate: [0, -4, 5, 0],
                scale: [1, 1.12],
                opacity: [1, 0],
                duration: 2300,
                ease: 'in(3)'
            });

            animeAnimate('.fire-particle', {
                translateY: [0, -window.innerHeight],
                translateX: () => (Math.random() - 0.5) * 180,
                scale: [1, 0.25],
                opacity: [1, 0],
                duration: () => 900 + Math.random() * 900,
                delay: animeStagger ? animeStagger(10) : 0,
                ease: 'out(2)'
            });
        } else if (rocketImg) {
            rocketImg.classList.add("launch");
        }

        // Reset rocket after animation
        setTimeout(() => {
            rocket.style.opacity = 0;
            if (rocketImg) {
                rocketImg.classList.remove("launch");
                rocketImg.style.transform = '';
                rocketImg.style.opacity = '';
            }
        }, 2500);
    }
    })
    .catch((error) => {
    console.error("EmailJS Error:", error);
    status.textContent = "Something went wrong. Please try again later.";
    status.style.color = "red";
    });
});

const resumeToggle = document.getElementById("resume-toggle");
const resumeFrame = document.getElementById("resume-frame");
const transcriptToggles = document.querySelectorAll(".transcript-toggle");

if (resumeToggle && resumeFrame) {
    resumeToggle.addEventListener("click", () => {
        const expanded = resumeFrame.classList.toggle("expanded");
        resumeToggle.textContent = expanded ? "Collapse Viewer" : "Expand Viewer";
        resumeToggle.setAttribute("aria-pressed", expanded);
    });
}

if (transcriptToggles.length) {
    transcriptToggles.forEach((button) => {
        const panelId = button.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : button.closest(".transcript-viewer")?.querySelector(".transcript-panel");
        if (!panel) return;

        button.addEventListener("click", () => {
            const expanded = panel.classList.toggle("open");
            panel.setAttribute("aria-hidden", String(!expanded));
            button.textContent = expanded ? "Hide Transcript" : "View Transcript";
            button.setAttribute("aria-pressed", expanded);
        });
    });
}

const themeToggle = document.getElementById("theme-toggle");
const themeToggleText = document.getElementById("theme-toggle-text");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileNavPanel = document.getElementById("mobile-nav-panel");
const logoEl = document.querySelector(".logo");
const profilePlaceholderText = document.querySelector(".profile-placeholder span");
const THEME_STORAGE_KEY = "preferred-theme";

const applyTheme = (theme) => {
    const isMatrix = theme === "matrix";
    document.body.classList.toggle("theme-matrix", isMatrix);
    if (themeToggle) {
        themeToggle.classList.toggle("active", isMatrix);
        themeToggle.setAttribute("aria-pressed", String(isMatrix));
    }
    if (themeToggleText) {
        themeToggleText.textContent = isMatrix ? "Matrix" : "Modern";
    }
    if (logoEl) {
        logoEl.textContent = isMatrix ? "<SWSH />" : "<AJ />";
    }
    if (profilePlaceholderText) {
        profilePlaceholderText.textContent = isMatrix ? "SWSH" : "AJ";
    }
    if (status && status.textContent) {
        status.style.color = getThemeColor("--form-status-color") || status.style.color;
    }
};

const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
applyTheme(storedTheme === "matrix" ? "matrix" : "modern");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("theme-matrix") ? "modern" : "matrix";
        applyTheme(nextTheme);
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    });
}

if (mobileMenuToggle && mobileNavPanel) {
    const setMobileMenu = (open) => {
        mobileMenuToggle.classList.toggle("active", open);
        mobileMenuToggle.setAttribute("aria-expanded", String(open));
        mobileNavPanel.classList.toggle("open", open);
        mobileNavPanel.setAttribute("aria-hidden", String(!open));
        document.body.classList.toggle("mobile-menu-open", open);
    };

    mobileMenuToggle.addEventListener("click", () => {
        const nextOpen = mobileMenuToggle.getAttribute("aria-expanded") !== "true";
        setMobileMenu(nextOpen);
    });

    mobileNavPanel.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", () => setMobileMenu(false));
    });

    document.addEventListener("click", (event) => {
        if (!mobileNavPanel.classList.contains("open")) return;
        if (mobileNavPanel.contains(event.target) || mobileMenuToggle.contains(event.target)) return;
        setMobileMenu(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobileNavPanel.classList.contains("open")) {
            setMobileMenu(false);
            mobileMenuToggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (!window.matchMedia("(max-width: 768px)").matches) {
            setMobileMenu(false);
        }
    });
}

const journeyConsole = document.getElementById("journey-console");
const journeyMapHint = document.getElementById("journey-map-hint");
const journeyKicker = document.getElementById("journey-console-kicker");
const journeyTitle = document.getElementById("journey-console-title");
const journeySubtitle = document.getElementById("journey-console-subtitle");
const journeyCopy = document.getElementById("journey-console-copy");
const journeyList = document.getElementById("journey-console-list");
const journeyFooter = document.getElementById("journey-console-footer");
const journeyTriggers = document.querySelectorAll("[data-journey-target]");

if (journeyMapHint) {
    const prefersTapHint = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    journeyMapHint.textContent = prefersTapHint
        ? "Tap a ring or planet to enter that phase."
        : "Hover to inspect. Select to enter that phase.";
}

const journeyData = {
    profile: {
        kicker: "Mission Console / Engineering Profile",
        title: "Engineering Profile",
        subtitle: "Systems, internal platforms, and AI-enabled workflows",
        copy: "I work best at the intersection of messy operations and technical systems. The throughline across the journey is turning unclear, high-friction processes into software that is more reliable, easier to operate, and faster for teams to use.",
        bullets: [
            "Strongest in backend-heavy products, internal tools, and distributed data workflows.",
            "Comfortable moving between systems engineering, product delivery, and applied AI workflow design.",
            "The orbit map shows how that profile formed across education, internships, and production engineering roles."
        ],
        tags: ["Backend Systems", "Internal Platforms", "AI Workflows"]
    },
    bits: {
        kicker: "Mission Console / Foundation",
        title: "BITS Pilani",
        subtitle: "2018 - 2022 | Undergraduate base layer",
        copy: "This is the foundation phase: computer science fundamentals, data science coursework, and the period where parallel internships started shaping the profile before full-time systems work.",
        bullets: [
            "Built the base layer in computer science and a data science minor.",
            "Created the time window where internships orbited around a larger academic phase.",
            "Set up the transition from coursework into backend, analytics, and ML execution."
        ],
        tags: ["Computer Science", "Data Science Minor", "Foundation Layer"]
    },
    paypal: {
        kicker: "Mission Console / Moon Orbit",
        title: "PayPal",
        subtitle: "Internship | Forecasting and analytics",
        copy: "PayPal was one of the early applied industry signals during undergrad. The work focused on demand-side analytics, forecasting logic, and model evaluation under real business constraints.",
        bullets: [
            "Worked on forecasting-oriented analytics problems in a production business context.",
            "Strengthened the bridge between academic ML concepts and practical decision support.",
            "Added one side of the parallel internship layer around the BITS phase."
        ],
        tags: ["Forecasting", "Analytics", "Business Modeling"]
    },
    aidash: {
        kicker: "Mission Console / Moon Orbit",
        title: "AiDash",
        subtitle: "Internship | GeoAI and remote sensing",
        copy: "AiDash added a very different applied layer: geospatial ML, satellite imagery workflows, and LANDSAT-based classification work. It pushed the profile toward computer vision and data-heavy ML systems.",
        bullets: [
            "Worked with LANDSAT imagery and geospatial classification tasks.",
            "Added GeoAI and remote sensing exposure beyond traditional analytics work.",
            "Rounded out the internship period with a more ML- and data-pipeline-heavy track."
        ],
        tags: ["GeoAI", "LANDSAT", "Computer Vision"]
    },
    sainapse: {
        kicker: "Mission Console / Systems Stage",
        title: "Sainapse",
        subtitle: "2022 - 2024 | Distributed systems and data platforms",
        copy: "This is the phase where the profile became much more systems-heavy: Kafka-based transfer flows, HDFS-scale ingestion, platform optimization, and data infrastructure work under real production constraints.",
        bullets: [
            "Built and improved distributed data workflows across ingestion, transfer, and analytics paths.",
            "Worked on Kafka, HDFS, Hive, and large-scale platform engineering problems.",
            "This stage is where the distributed systems identity became concrete."
        ],
        tags: ["Kafka", "HDFS", "Platform Engineering"]
    },
    nyu: {
        kicker: "Mission Console / Graduate Orbit",
        title: "NYU",
        subtitle: "2024 - 2026 | Graduate study plus internal software delivery",
        copy: "The NYU phase combined graduate-level computer science study with hands-on internal product work through GEMSS, where the focus shifted toward workflow modernization, operational software, and full-stack delivery.",
        bullets: [
            "Graduate coursework expanded the systems and applied CS foundation.",
            "The GEMSS role added internal product delivery, modernization, and workflow reliability work.",
            "This phase is where education and practical product engineering overlapped directly."
        ],
        tags: ["MS CS", "GEMSS", "Workflow Modernization"]
    },
    gemss: {
        kicker: "Mission Console / Completed Role",
        title: "GEMSS",
        subtitle: "Feb 2025 - May 2026 | Software Engineer",
        copy: "GEMSS was the hands-on operational moon around the NYU phase, where graduate study overlapped with internal software delivery, workflow improvement, and admin-facing tools.",
        bullets: [
            "Built internal software for enrollment and student success operations.",
            "Focused on workflow reliability, process modernization, and full-stack delivery.",
            "Represented the practical execution layer orbiting the broader NYU stage."
        ],
        tags: ["Internal Tools", "Workflow Ops", "SaaS Delivery"]
    }
};

if (journeyConsole && journeyTitle && journeyTriggers.length) {
    const journeyMap = document.querySelector(".journey-map");
    const journeyStages = document.querySelectorAll(".journey-stage");
    const journeyMoonGroups = document.querySelectorAll(".journey-moon-group");
    const defaultJourneyTarget = "profile";
    const journeyVisuals = {
        bits: ".journey-planet-dot.bits",
        paypal: ".journey-moon-dot.paypal",
        aidash: ".journey-moon-dot.aidash",
        sainapse: ".journey-planet-dot.sainapse",
        nyu: ".journey-planet-dot.nyu",
        gemss: ".journey-moon-dot.gemss"
    };
    const journeyFlightPalettes = {
        bits: ["#b51f2e", "#f2b134"],
        paypal: ["#1769aa", "#f7fbff"],
        aidash: ["#082b62", "#2f80ed"],
        sainapse: ["#149f91", "#8af3dc"],
        nyu: ["#57068c", "#9a55c7"],
        gemss: ["#7137a8", "#f4efff"]
    };
    let orbitTransitioning = false;

    const prefetchCareerOrbit = () => {
        if (document.querySelector('link[data-career-orbit-prefetch]')) return;
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = "/experience/";
        link.dataset.careerOrbitPrefetch = "true";
        document.head.appendChild(link);
    };

    const enterCareerOrbit = (key) => {
        if (orbitTransitioning || !journeyData[key]) return;
        orbitTransitioning = true;
        const destination = `/experience/?focus=${encodeURIComponent(key)}`;
        try {
            sessionStorage.setItem("career-orbit-transition", JSON.stringify({ key, startedAt: Date.now() }));
        } catch (error) {
            // Navigation remains functional when storage is unavailable.
        }

        if (prefersReducedMotion || !journeyMap) {
            window.location.assign(destination);
            return;
        }

        prefetchCareerOrbit();
        const visualTarget = journeyMap.querySelector(journeyVisuals[key]);
        if (!visualTarget) {
            window.location.assign(destination);
            return;
        }

        const mapRect = journeyMap.getBoundingClientRect();
        const targetRect = visualTarget.getBoundingClientRect();
        const originX = ((targetRect.left + targetRect.width / 2 - mapRect.left) / mapRect.width) * 100;
        const originY = ((targetRect.top + targetRect.height / 2 - mapRect.top) / mapRect.height) * 100;
        const targetSize = Math.max(targetRect.width, targetRect.height, 8);
        const flightEndSize = Math.hypot(window.innerWidth, window.innerHeight) * 1.2;
        const palette = journeyFlightPalettes[key];
        const flight = document.createElement("div");
        flight.className = "orbit-flight";
        flight.setAttribute("aria-hidden", "true");
        flight.style.setProperty("--flight-start-x", `${targetRect.left + targetRect.width / 2}px`);
        flight.style.setProperty("--flight-start-y", `${targetRect.top + targetRect.height / 2}px`);
        flight.style.setProperty("--flight-start-size", `${targetSize}px`);
        flight.style.setProperty("--flight-end-size", `${flightEndSize}px`);
        flight.style.setProperty("--flight-primary", palette[0]);
        flight.style.setProperty("--flight-secondary", palette[1]);
        flight.innerHTML = '<span class="orbit-flight-body"></span>';
        document.body.appendChild(flight);
        const carrier = visualTarget.closest(".journey-moon-carrier");
        if (carrier) carrier.style.animationPlayState = "paused";
        visualTarget.classList.add("orbit-transition-target");
        journeyMap.style.setProperty("--orbit-origin-x", `${originX}%`);
        journeyMap.style.setProperty("--orbit-origin-y", `${originY}%`);
        journeyMap.classList.add("orbit-transition");
        document.body.classList.add("orbit-departing");
        flight.getBoundingClientRect();
        requestAnimationFrame(() => {
            flight.classList.add("active");
            journeyMap.classList.add("orbit-transition-active");
        });
        window.setTimeout(() => window.location.assign(destination), 800);
    };

    const renderJourney = (key) => {
        const details = journeyData[key];
        if (!details) return;

        if (canUseAnimeMotion) {
            animeAnimate([journeyKicker, journeyTitle, journeySubtitle, journeyCopy, journeyList, journeyFooter], {
                opacity: [1, 0],
                translateY: [0, -8],
                duration: 140,
                ease: 'in(2)'
            });
        }

        journeyKicker.textContent = details.kicker;
        journeyTitle.textContent = details.title;
        journeySubtitle.textContent = details.subtitle;
        journeyCopy.textContent = details.copy;
        journeyList.innerHTML = details.bullets.map((bullet) => `<li>${bullet}</li>`).join("");
        journeyFooter.innerHTML = details.tags.map((tag) => `<span>${tag}</span>`).join("");

        if (canUseAnimeMotion) {
            animeAnimate([journeyKicker, journeyTitle, journeySubtitle, journeyCopy], {
                opacity: [0, 1],
                translateY: [12, 0],
                duration: 360,
                delay: animeStagger ? animeStagger(45) : 0,
                ease: 'out(3)'
            });
            animeAnimate([...journeyList.children, ...journeyFooter.children], {
                opacity: [0, 1],
                translateX: [-10, 0],
                duration: 360,
                delay: animeStagger ? animeStagger(38, { start: 120 }) : 120,
                ease: 'out(3)'
            });
        }

        journeyStages.forEach((stage) => {
            stage.classList.toggle("active", stage.dataset.journeyTarget === key);
        });
        journeyMoonGroups.forEach((moon) => {
            moon.classList.toggle("active", moon.dataset.journeyTarget === key);
        });
    };

    renderJourney(defaultJourneyTarget);

    journeyTriggers.forEach((trigger) => {
        const key = trigger.dataset.journeyTarget;
        if (!key) return;

        trigger.addEventListener("mouseenter", () => renderJourney(key));
        trigger.addEventListener("mouseenter", prefetchCareerOrbit, { once: true });
        trigger.addEventListener("focus", () => renderJourney(key));
        trigger.addEventListener("focus", prefetchCareerOrbit, { once: true });
        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            enterCareerOrbit(key);
        });
        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                enterCareerOrbit(key);
            }
        });
    });

    journeyMap?.addEventListener("mouseleave", () => renderJourney(defaultJourneyTarget));
    journeyMap?.addEventListener("focusout", (event) => {
        if (!journeyMap.contains(event.relatedTarget)) {
            renderJourney(defaultJourneyTarget);
        }
    });
}
