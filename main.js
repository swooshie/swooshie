const starsContainer = document.getElementById('stars');
for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
}

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

const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
const observerOptions = {
    // On mobile, very tall sections can fail a high threshold and stay invisible.
    threshold: isSmallScreen ? 0.02 : 0.1,
    rootMargin: isSmallScreen ? '0px 0px -40px 0px' : '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const shouldAnimateSections = !window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('section').forEach(section => {
    if (!shouldAnimateSections) {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        return;
    }
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
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

    const interactiveElements = document.querySelectorAll('a, button');
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
} else {
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
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.classList.add("fire-particle");
        particle.style.left = Math.random() * window.innerWidth + "px";
        particle.style.width = 5 + Math.random() * 15 + "px";
        particle.style.height = particle.style.width;
        particle.style.animationDuration = 1 + Math.random() * 2 + "s";
        fireContainer.appendChild(particle);

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
    rocket.style.opacity = 1;
    const rocketImg = rocket.querySelector(".rocket");
    rocketImg.classList.add("launch");

    // Reset rocket after animation
    setTimeout(() => {
        rocket.style.opacity = 0;
        rocketImg.classList.remove("launch");
    }, 2500);
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
        ? "Tap a ring or planet to inspect that phase."
        : "Hover a ring or planet to inspect that phase.";
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
        kicker: "Mission Console / Current Orbit",
        title: "NYU",
        subtitle: "2024 - Now | Graduate study plus internal software delivery",
        copy: "NYU combines two layers at once: graduate-level computer science study and hands-on internal product work through GEMSS, where the focus shifted toward workflow modernization, operational software, and full-stack delivery.",
        bullets: [
            "Graduate coursework expands the systems and applied CS foundation.",
            "GEMSS role adds internal product delivery, modernization, and workflow reliability work.",
            "This is the current orbit where education and practical product engineering overlap directly."
        ],
        tags: ["MS CS", "GEMSS", "Workflow Modernization"]
    },
    gemss: {
        kicker: "Mission Console / Moon Orbit",
        title: "GEMSS",
        subtitle: "NYU role | Internal software delivery",
        copy: "GEMSS is the hands-on operational moon around the NYU phase. It is where the graduate study layer meets real internal software delivery, workflow improvement, and admin-facing tools.",
        bullets: [
            "Builds internal software for enrollment and student success operations.",
            "Focuses on workflow reliability, process modernization, and full-stack delivery.",
            "Represents the practical execution layer orbiting the broader NYU stage."
        ],
        tags: ["Internal Tools", "Workflow Ops", "SaaS Delivery"]
    }
};

if (journeyConsole && journeyTitle && journeyTriggers.length) {
    const journeyMap = document.querySelector(".journey-map");
    const journeyStages = document.querySelectorAll(".journey-stage");
    const journeyMoonGroups = document.querySelectorAll(".journey-moon-group");
    const defaultJourneyTarget = "profile";

    const renderJourney = (key) => {
        const details = journeyData[key];
        if (!details) return;

        journeyKicker.textContent = details.kicker;
        journeyTitle.textContent = details.title;
        journeySubtitle.textContent = details.subtitle;
        journeyCopy.textContent = details.copy;
        journeyList.innerHTML = details.bullets.map((bullet) => `<li>${bullet}</li>`).join("");
        journeyFooter.innerHTML = details.tags.map((tag) => `<span>${tag}</span>`).join("");

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
        trigger.addEventListener("focus", () => renderJourney(key));
        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                renderJourney(key);
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
