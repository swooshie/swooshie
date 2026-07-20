(function initSiteCursor() {
    if (window.siteCursorInitialized) return;
    window.siteCursorInitialized = true;

    const supportsCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsCustomCursor) {
        document.body.classList.add("native-cursor");
        return;
    }

    const cursor = document.querySelector(".cursor") || document.body.appendChild(Object.assign(document.createElement("div"), { className: "cursor" }));
    const trails = [];
    let moveTimeout = null;

    for (let index = 0; index < 8; index++) {
        const trail = document.createElement("div");
        trail.className = "cursor-trail";
        document.body.appendChild(trail);
        trails.push(trail);
    }

    const hide = () => {
        cursor.style.opacity = "0";
        trails.forEach((trail) => { trail.style.opacity = "0"; });
    };

    document.addEventListener("mousemove", (event) => {
        cursor.style.opacity = "1";
        cursor.style.top = `${event.clientY}px`;
        cursor.style.left = `${event.clientX}px`;
        trails.forEach((trail, index) => {
            trail.style.opacity = "1";
            window.setTimeout(() => {
                trail.style.top = `${event.clientY}px`;
                trail.style.left = `${event.clientX}px`;
            }, index * 20);
        });
        window.clearTimeout(moveTimeout);
        moveTimeout = window.setTimeout(() => {
            trails.forEach((trail) => { trail.style.opacity = "0"; });
        }, 200);
    });

    document.addEventListener("mouseover", (event) => {
        if (event.target.closest?.("a, button, input, textarea, [role='button']")) cursor.classList.add("active");
    });
    document.addEventListener("mouseout", (event) => {
        if (event.target.closest?.("a, button, input, textarea, [role='button']")) cursor.classList.remove("active");
    });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", hide, { passive: true });
    document.addEventListener("visibilitychange", () => { if (document.hidden) hide(); });
    document.addEventListener("pointerdown", (event) => { if (event.pointerType !== "mouse") hide(); });
    document.addEventListener("touchstart", hide, { passive: true });
})();
