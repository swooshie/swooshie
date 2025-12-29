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

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

const trailCount = 8; // number of trail dots
const trails = [];

const hideCustomCursor = () => {
    cursor.style.opacity = '0';
    trails.forEach(trail => { trail.style.opacity = '0'; });
};

const showCustomCursor = () => {
    cursor.style.opacity = '1';
};

for (let i = 0; i < trailCount; i++) {
    const t = document.createElement('div');
    t.classList.add('cursor-trail');
    t.style.opacity = '0'; // initially invisible
    document.body.appendChild(t);
    trails.push(t);
}

let moveTimeout;

document.addEventListener('mousemove', e => {
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
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.classList.add('pdf-page');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            container.appendChild(canvas);
            await page.render({ canvasContext: context, viewport }).promise;
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
