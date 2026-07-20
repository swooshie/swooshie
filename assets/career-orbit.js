const careerData = {
    bits: {
        name: "BITS Pilani",
        type: "Education / Foundation",
        role: "B.E. Computer Science + Data Science minor | 2018 - 2022",
        years: "2018 - 2022",
        summary: "The foundation phase combined core computer science, a data science minor, and the first opportunities to apply analytics and machine learning in industry.",
        metrics: [["B.E.", "Computer Science"], ["Minor", "Data Science"]],
        highlights: [
            "Built the algorithms, systems, and data foundation that later supported platform engineering work.",
            "Completed focused coursework in data mining, deep learning, machine learning, and natural language processing.",
            "Used the undergraduate period to bridge academic work with PayPal and AiDash internships."
        ],
        stack: ["Computer Science", "Data Science", "Algorithms", "Machine Learning", "NLP"],
        color: 0xb51f2e,
        secondary: 0xf2b134,
        accent: "#f2b134"
    },
    paypal: {
        name: "PayPal",
        type: "Internship / Forecasting",
        role: "Data Analyst Intern | May 2020 - Jun 2020",
        years: "2020",
        summary: "An early applied analytics role focused on customer-demand forecasting, regression behavior, and translating model results into business-facing findings.",
        metrics: [["10+", "Demand trends identified"], ["0.98", "Top reported R-squared"]],
        highlights: [
            "Developed forecasting models with R-squared values near 0.9 across multiple loss settings.",
            "Reported scores of 0.98, 0.91, and 0.85 across squared, absolute, and infinite loss functions.",
            "Collaborated in a four-person team to present customer-demand findings."
        ],
        stack: ["Python", "Forecasting", "Linear Regression", "Statistics", "Model Evaluation"],
        color: 0x1769aa,
        secondary: 0xf7fbff,
        accent: "#70bfff"
    },
    aidash: {
        name: "AiDash",
        type: "Internship / GeoAI",
        role: "Data Science Intern | Jan 2022 - Jun 2022",
        years: "2022",
        summary: "Applied geospatial machine learning to vegetation and LANDSAT classification, combining satellite imagery, computer vision, and operational data preparation.",
        metrics: [["95%", "Classification accuracy"], ["80%", "Less manual labeling time"]],
        highlights: [
            "Built a ResNet, Keras, and TensorFlow LANDSAT pipeline that reduced image-processing time by 40% while maintaining 95% accuracy.",
            "Created a grassland classification method with 78% accuracy that ranked first among peer solutions.",
            "Automated satellite-image labeling in QGIS and reduced manual processing time by 80%."
        ],
        stack: ["Python", "TensorFlow", "Keras", "ResNet", "LANDSAT", "QGIS", "GeoPandas", "PostgreSQL"],
        color: 0x082b62,
        secondary: 0x2f80ed,
        accent: "#4f9cff"
    },
    sainapse: {
        name: "Sainapse",
        type: "Production / Data Platforms",
        role: "Software Development Engineer | Jul 2022 - May 2024",
        years: "2022 - 2024",
        summary: "The systems phase: high-volume ingestion, Kafka-based transfer flows, platform optimization, and cross-language infrastructure under production constraints.",
        metrics: [["3B+", "Daily records supported"], ["37%", "Average performance gain"], ["2B+", "Rows transferred on demand"], ["10+", "Microservices supported"]],
        highlights: [
            "Optimized Kafka file transfers with byte-level serialization and parallel distribution, reducing time complexity by 50% and space complexity by 33%.",
            "Spearheaded Java and HDFS ingestion supporting 3B+ daily records with Hive across 10+ microservices.",
            "Designed a BigQuery batch adapter for on-demand transfer of 2B+ rows into downstream ML workflows.",
            "Mentored four university interns on product architecture and the platform stack."
        ],
        stack: ["Java", "Apache Kafka", "HDFS", "Hive", "AWS Linux", "BigQuery", "Apache Thrift", "Python", "Scala"],
        color: 0x149f91,
        secondary: 0x8af3dc,
        accent: "#58dfc7"
    },
    nyu: {
        name: "NYU Tandon",
        type: "Education / Graduate",
        role: "M.S. Computer Science | 2024 - 2026",
        years: "2024 - 2026",
        summary: "Graduate study extends the systems foundation through algorithms, big data, search, and quantitative coursework while overlapping directly with internal software delivery at NYU.",
        metrics: [["M.S.", "Computer Science"], ["NYC", "Graduate engineering"]],
        highlights: [
            "Focused coursework on algorithms, big data, search engines, and stochastic calculus.",
            "Connected graduate systems work with production-facing internal tools through GEMSS.",
            "Continued developing a backend and platform profile while expanding applied computer science depth."
        ],
        stack: ["Algorithms", "Big Data", "Search Engines", "Computer Science", "Systems"],
        color: 0x57068c,
        secondary: 0x9a55c7,
        accent: "#b878df"
    },
    gemss: {
        name: "NYU GEMSS",
        type: "Completed Role / Internal Software",
        role: "Software Engineer | Feb 2025 - May 2026",
        years: "2025 - 2026",
        summary: "Internal product engineering delivered for enrollment operations, staff communications, asset workflows, and service processes used by campus administrators.",
        metrics: [["8,000+", "Devices managed"], ["300+", "Employees supported"], ["50%", "Faster record lookup"], ["40%", "Fewer retry failures"]],
        highlights: [
            "Serve as sole engineer for the production Asset Management System, owning the codebase, infrastructure, CI/CD, and Dockerized deployment.",
            "Drive phased migration from Google Apps Script to Node.js, Express, TypeScript, MongoDB, and an MVC REST API with 10+ endpoints.",
            "Built concurrency-safe form delivery and a set-theory-backed compound filtering engine for production workflows.",
            "Preserve operational continuity through real-time sync and transitional Google Sheets access."
        ],
        stack: ["TypeScript", "Node.js", "Express", "MongoDB", "Google Apps Script", "Docker", "CI/CD", "OAuth", "MVC"],
        color: 0x7137a8,
        secondary: 0xf4efff,
        accent: "#d8c3ef"
    }
};

const THEME_STORAGE_KEY = "preferred-theme";
const themeToggle = document.getElementById("orbit-theme");
const themeLabel = document.getElementById("orbit-theme-label");
const orbitBrand = document.querySelector(".orbit-brand");
let sync3DTheme = () => {};

const applyTheme = (theme) => {
    const isMatrix = theme === "matrix";
    document.body.classList.toggle("theme-matrix", isMatrix);
    themeToggle.setAttribute("aria-pressed", String(isMatrix));
    themeLabel.textContent = isMatrix ? "Matrix" : "Modern";
    orbitBrand.textContent = isMatrix ? "<SWSH />" : "<AJ />";
    sync3DTheme(isMatrix);
};

applyTheme(localStorage.getItem(THEME_STORAGE_KEY) === "matrix" ? "matrix" : "modern");
themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-matrix") ? "modern" : "matrix";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});

const order = ["bits", "paypal", "aidash", "sainapse", "nyu", "gemss"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const timelineList = document.getElementById("timeline-list");
const panel = document.getElementById("career-panel");
const panelTitle = document.getElementById("panel-title");
const panelKicker = document.getElementById("panel-kicker");
const panelRole = document.getElementById("panel-role");
const panelSummary = document.getElementById("panel-summary");
const panelMetrics = document.getElementById("panel-metrics");
const panelHighlights = document.getElementById("panel-highlights");
const panelStack = document.getElementById("panel-stack");
const sceneYear = document.getElementById("scene-year");
const sceneLabel = document.getElementById("scene-label");
const loadingState = document.getElementById("loading-state");
const fallbackSystem = document.getElementById("fallback-system");
const canvasShell = document.getElementById("career-canvas");
let careerSceneRevealed = false;

const revealCareerScene = () => {
    if (careerSceneRevealed) return;
    careerSceneRevealed = true;
    loadingState.classList.add("ready");
    if (!document.body.classList.contains("orbit-arriving")) return;
    document.body.classList.add("orbit-scene-ready");
    window.setTimeout(() => {
        document.body.classList.remove("orbit-arriving", "orbit-scene-ready");
    }, reducedMotion ? 20 : 900);
};

timelineList.innerHTML = order.map((key) => {
    const item = careerData[key];
    return `<button class="timeline-button" type="button" data-career-key="${key}"><span>${item.years}</span><strong>${item.name}</strong></button>`;
}).join("");

const timelineButtons = [...document.querySelectorAll(".timeline-button")];
let focusCareer = () => {};
let returnToOrbit = () => {};

const renderPanel = (key) => {
    const item = careerData[key];
    if (!item) return;

    panelKicker.textContent = item.type;
    panelTitle.textContent = item.name;
    panelRole.textContent = item.role;
    panelSummary.textContent = item.summary;
    panelMetrics.innerHTML = item.metrics.map(([value, label]) => `<div class="panel-metric"><strong>${value}</strong><span>${label}</span></div>`).join("");
    panelHighlights.innerHTML = item.highlights.map((highlight) => `<li>${highlight}</li>`).join("");
    panelStack.innerHTML = item.stack.map((technology) => `<span>${technology}</span>`).join("");
    panel.style.setProperty("--active-career-color", item.accent);
    timelineButtons.forEach((button) => button.classList.toggle("active", button.dataset.careerKey === key));
};

const openPanel = (key) => {
    renderPanel(key);
    document.body.classList.add("focused");
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
};

const closePanel = () => {
    document.body.classList.remove("focused");
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    timelineButtons.forEach((button) => button.classList.remove("active"));
};

timelineButtons.forEach((button) => {
    button.addEventListener("click", () => focusCareer(button.dataset.careerKey));
});

document.getElementById("orbit-back").addEventListener("click", () => returnToOrbit());
document.getElementById("orbit-close").addEventListener("click", () => returnToOrbit());
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("open")) returnToOrbit();
});

let THREE;
try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.min.js");
} catch (error) {
    console.error("Career orbit renderer failed to load", error);
    revealCareerScene();
    fallbackSystem.hidden = false;
    focusCareer = (key) => {
        openPanel(key);
        history.replaceState(null, "", `?focus=${key}`);
    };
    returnToOrbit = () => {
        closePanel();
        history.replaceState(null, "", window.location.pathname);
    };
}

if (THREE) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050a12, 0.022);

    const mobileViewport = window.matchMedia("(max-width: 760px)").matches;
    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 120);
    const overviewPosition = mobileViewport ? new THREE.Vector3(0, 0.5, 25) : new THREE.Vector3(0, 1.2, 18);
    const overviewLook = new THREE.Vector3(0, 0.2, -1.5);
    camera.position.copy(overviewPosition);
    camera.lookAt(overviewLook);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.tabIndex = 0;
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.setAttribute("aria-label", "Rotatable 3D career orbit");
    canvasShell.appendChild(renderer.domElement);

    const worldRoot = new THREE.Group();
    scene.add(worldRoot);

    scene.add(new THREE.HemisphereLight(0x7ca9ff, 0x08101d, 1.4));
    const keyLight = new THREE.PointLight(0xffffff, 55, 50, 1.4);
    keyLight.position.set(0, 8, 12);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x39d8ff, 36, 45, 1.6);
    rimLight.position.set(-10, -3, 5);
    scene.add(rimLight);

    const seededRandom = (() => {
        let seed = 9031;
        return () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };
    })();

    const starCanvas = document.createElement("canvas");
    starCanvas.width = 64;
    starCanvas.height = 64;
    const starContext = starCanvas.getContext("2d");
    const starGradient = starContext.createRadialGradient(32, 32, 0, 32, 32, 32);
    starGradient.addColorStop(0, "rgba(255,255,255,1)");
    starGradient.addColorStop(0.14, "rgba(255,255,255,0.96)");
    starGradient.addColorStop(0.42, "rgba(255,255,255,0.42)");
    starGradient.addColorStop(1, "rgba(255,255,255,0)");
    starContext.fillStyle = starGradient;
    starContext.fillRect(0, 0, 64, 64);
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const createStarLayer = (count, minRadius, range, size, opacity, color) => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < positions.length; i += 3) {
            const radius = minRadius + seededRandom() * range;
            const theta = seededRandom() * Math.PI * 2;
            const phi = Math.acos(2 * seededRandom() - 1);
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.cos(phi);
            positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return new THREE.Points(geometry, new THREE.PointsMaterial({
            color,
            size,
            map: starTexture,
            transparent: true,
            alphaTest: 0.025,
            opacity,
            sizeAttenuation: true,
            depthWrite: false,
            fog: false,
            blending: THREE.AdditiveBlending
        }));
    };

    const stars = createStarLayer(3200, 38, 58, 0.18, 0.5, 0xbcd4ff);
    const brightStars = createStarLayer(520, 34, 52, 0.38, 0.78, 0xf5fbff);
    scene.add(stars);
    scene.add(brightStars);

    sync3DTheme = (isMatrix) => {
        const background = isMatrix ? 0x020504 : 0x050a12;
        renderer.setClearColor(background, 1);
        scene.fog.color.setHex(background);
        stars.material.color.setHex(isMatrix ? 0x81f5b8 : 0xbcd4ff);
        brightStars.material.color.setHex(isMatrix ? 0xd8ffe9 : 0xf5fbff);
    };
    sync3DTheme(document.body.classList.contains("theme-matrix"));

    const radii = { bits: 0.86, paypal: 0.32, aidash: 0.37, sainapse: 0.96, nyu: 1.04, gemss: 0.38 };
    const interactive = [];
    const planetEntries = new Map();
    const orbitalPivots = [];
    const labelLayer = document.getElementById("world-label-layer");
    const labelEntries = new Map();
    const sunRadius = 1.38;

    worldRoot.position.set(mobileViewport ? 0 : 0.7, mobileViewport ? -0.45 : 0, -4);
    worldRoot.scale.setScalar(mobileViewport ? 0.46 : 0.76);
    worldRoot.rotation.x = mobileViewport ? -0.08 : -0.17;

    const createWorldLabel = (key, label, color, isSun = false) => {
        const element = document.createElement("span");
        element.className = `world-label${isSun ? " sun-label" : ""}`;
        element.textContent = label;
        element.style.setProperty("--world-color", color);
        labelLayer.appendChild(element);
        labelEntries.set(key, { element, object: null, radius: isSun ? sunRadius : radii[key] });
    };

    const createTexture = (primaryColor, secondaryColor, seedOffset) => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext("2d");
        const primary = new THREE.Color(primaryColor);
        const secondary = new THREE.Color(secondaryColor);
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `#${secondary.getHexString()}`);
        gradient.addColorStop(0.35, `#${primary.getHexString()}`);
        gradient.addColorStop(0.7, `#${primary.clone().multiplyScalar(0.62).getHexString()}`);
        gradient.addColorStop(1, `#${secondary.clone().multiplyScalar(0.76).getHexString()}`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 34; i++) {
            const y = (i * 31 + seedOffset * 23) % canvas.height;
            context.fillStyle = i % 3 === 0
                ? `rgba(255,255,255,${0.08 + (i % 5) * 0.025})`
                : `#${secondary.clone().multiplyScalar(0.72 + (i % 4) * 0.08).getHexString()}55`;
            context.fillRect(0, y, canvas.width, 2 + (i % 8));
        }

        for (let i = 0; i < 48; i++) {
            const x = (i * 83 + seedOffset * 47) % canvas.width;
            const y = (i * 53 + seedOffset * 31) % canvas.height;
            context.beginPath();
            context.fillStyle = `rgba(255,255,255,${0.025 + (i % 5) * 0.012})`;
            context.ellipse(x, y, 8 + (i % 22), 3 + (i % 9), 0.3, 0, Math.PI * 2);
            context.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    };

    const sunUniforms = { time: { value: 0 } };
    const sunMaterial = new THREE.ShaderMaterial({
        uniforms: sunUniforms,
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                float warp = sin(vPosition.x * 2.7 + time * 0.9) * 0.9;
                warp += sin(vPosition.z * 3.3 - time * 0.72) * 0.65;
                float ribbons = sin(vPosition.y * 5.2 + warp + time * 1.65);
                ribbons += sin((vPosition.x - vPosition.z) * 2.8 - time * 0.8) * 0.28;
                float heat = smoothstep(-1.05, 1.05, ribbons);
                vec3 deep = vec3(1.0, 0.58, 0.04);
                vec3 orange = vec3(1.0, 0.88, 0.28);
                vec3 hot = vec3(1.0, 1.0, 0.92);
                vec3 color = mix(deep, orange, heat);
                color = mix(color, hot, smoothstep(0.42, 0.9, heat));
                float fresnel = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
                gl_FragColor = vec4(color + fresnel * vec3(1.0, 0.55, 0.08), 1.0);
            }
        `
    });
    const sun = new THREE.Mesh(new THREE.SphereGeometry(sunRadius, 72, 52), sunMaterial);
    worldRoot.add(sun);

    const coronaMaterial = new THREE.ShaderMaterial({
        uniforms: sunUniforms,
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vNormal;
            void main() {
                float edge = pow(1.0 - abs(vNormal.z), 2.4);
                float pulse = 0.68 + sin(time * 3.0) * 0.12;
                gl_FragColor = vec4(1.0, 0.62, 0.08, edge * pulse);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false
    });
    const corona = new THREE.Mesh(new THREE.SphereGeometry(sunRadius * 1.25, 56, 40), coronaMaterial);
    worldRoot.add(corona);

    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const glowContext = glowCanvas.getContext("2d");
    const glowGradient = glowContext.createRadialGradient(128, 128, 8, 128, 128, 128);
    glowGradient.addColorStop(0, "rgba(255,255,235,0.95)");
    glowGradient.addColorStop(0.22, "rgba(255,232,96,0.72)");
    glowGradient.addColorStop(0.5, "rgba(255,154,40,0.3)");
    glowGradient.addColorStop(1, "rgba(255,96,8,0)");
    glowContext.fillStyle = glowGradient;
    glowContext.fillRect(0, 0, 256, 256);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    sunGlow.scale.set(7.4, 7.4, 1);
    worldRoot.add(sunGlow);

    const flameShape = new THREE.Shape();
    flameShape.moveTo(-0.24, 0);
    flameShape.bezierCurveTo(-0.34, 0.42, -0.18, 0.9, -0.08, 1.18);
    flameShape.bezierCurveTo(0.03, 1.5, -0.08, 1.78, 0, 2.05);
    flameShape.bezierCurveTo(0.22, 1.6, 0.12, 1.2, 0.24, 0.78);
    flameShape.bezierCurveTo(0.32, 0.46, 0.3, 0.2, 0.24, 0);
    flameShape.lineTo(-0.24, 0);
    const flameGeometry = new THREE.ShapeGeometry(flameShape, 18);
    const flameMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = vec2(position.x / 0.68 + 0.5, position.y / 2.05);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            void main() {
                float baseFade = smoothstep(0.0, 0.14, vUv.y);
                float tipFade = 1.0 - smoothstep(0.68, 1.0, vUv.y);
                float alpha = baseFade * tipFade * 0.9;
                vec3 hot = vec3(1.0, 1.0, 0.68);
                vec3 orange = vec3(1.0, 0.24, 0.01);
                vec3 color = mix(hot, orange, smoothstep(0.1, 1.0, vUv.y));
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const flameTongues = [];
    const upAxis = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < 22; i++) {
        const direction = new THREE.Vector3(
            seededRandom() * 2 - 1,
            seededRandom() * 2 - 1,
            seededRandom() * 2 - 1
        ).normalize();
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.quaternion.setFromUnitVectors(upAxis, direction);
        flame.position.copy(direction).multiplyScalar(sunRadius - 0.08);
        worldRoot.add(flame);
        flameTongues.push({
            mesh: flame,
            direction,
            phase: seededRandom() * Math.PI * 2,
            width: 0.9 + seededRandom() * 0.68,
            length: 0.35 + seededRandom() * 0.4
        });
    }

    const sunLight = new THREE.PointLight(0xffa34d, 92, 42, 1.45);
    worldRoot.add(sunLight);
    createWorldLabel("sun", "Career Core", "#ff9d2e", true);
    labelEntries.get("sun").object = sun;

    const createOrbitRing = (parent, orbitRadius, color, opacity = 0.28) => {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(orbitRadius, 0.014, 8, 220),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
        );
        ring.rotation.x = Math.PI / 2;
        parent.add(ring);
    };

    const createPlanetBody = (key, parent, localPosition, seedOffset) => {
        const data = careerData[key];
        const radius = radii[key];
        const group = new THREE.Group();
        group.position.copy(localPosition);
        parent.add(group);

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 64, 44),
            new THREE.MeshStandardMaterial({
                map: createTexture(data.color, data.secondary, seedOffset),
                color: 0xffffff,
                roughness: 0.68,
                metalness: 0.03
            })
        );
        mesh.userData.careerKey = key;
        group.add(mesh);

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 1.09, 44, 30),
            new THREE.MeshBasicMaterial({ color: data.secondary, transparent: true, opacity: 0.13, side: THREE.BackSide, depthWrite: false })
        );
        group.add(atmosphere);

        createWorldLabel(key, data.name, data.accent);
        labelEntries.get(key).object = group;
        interactive.push(mesh);
        planetEntries.set(key, { key, group, mesh, atmosphere, radius });
        return group;
    };

    const createSolarOrbit = (key, orbitRadius, inclination, phase, speed, seedOffset) => {
        const inclined = new THREE.Group();
        inclined.rotation.z = inclination;
        inclined.rotation.x = inclination * 0.34;
        worldRoot.add(inclined);
        createOrbitRing(inclined, orbitRadius, careerData[key].color, 0.27);
        const pivot = new THREE.Group();
        pivot.rotation.y = phase;
        inclined.add(pivot);
        const body = createPlanetBody(key, pivot, new THREE.Vector3(orbitRadius, 0, 0), seedOffset);
        orbitalPivots.push({ pivot, speed });
        return body;
    };

    const createMoonOrbit = (key, parentPlanet, orbitRadius, inclination, phase, speed, seedOffset) => {
        const inclined = new THREE.Group();
        inclined.rotation.z = inclination;
        inclined.rotation.x = 0.25 + inclination * 0.5;
        parentPlanet.add(inclined);
        createOrbitRing(inclined, orbitRadius, careerData[key].secondary, 0.38);
        const pivot = new THREE.Group();
        pivot.rotation.y = phase;
        inclined.add(pivot);
        const moon = createPlanetBody(key, pivot, new THREE.Vector3(orbitRadius, 0, 0), seedOffset);
        orbitalPivots.push({ pivot, speed });
        return moon;
    };

    const bitsGroup = createSolarOrbit("bits", 6.4, -0.28, 3.45, 0.12, 1);
    createMoonOrbit("paypal", bitsGroup, 2.3, 0.2, 0.15, 0.42, 2);
    createMoonOrbit("aidash", bitsGroup, 3.1, -0.18, 3.2, 0.3, 3);
    createSolarOrbit("sainapse", 10.0, 0.24, 3.9, 0.075, 4);
    const nyuGroup = createSolarOrbit("nyu", 13.6, -0.11, 5.72, 0.052, 5);
    createMoonOrbit("gemss", nyuGroup, 2.8, 0.22, 2.15, 0.34, 6);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(2, 2);
    let hoveredKey = null;
    let focusedKey = null;
    let cameraTween = null;
    let pointerDown = null;
    let dragging = false;
    const activePointers = new Map();
    let multiGesture = null;
    const dragYaw = new THREE.Quaternion();
    const dragPitch = new THREE.Quaternion();
    const dragRoll = new THREE.Quaternion();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const lookTarget = overviewLook.clone();
    camera.userData.lookTarget = lookTarget;
    const returnViewPosition = overviewPosition.clone();
    const returnViewLook = overviewLook.clone();
    const returnViewUp = camera.up.clone();

    const captureCamera = () => ({
        position: camera.position.clone(),
        up: camera.up.clone(),
        direction: camera.getWorldDirection(new THREE.Vector3())
    });

    const orbitCamera = (base, yaw, pitch, zoom = 1, roll = 0) => {
        const offset = base.position.clone().sub(lookTarget);
        const right = new THREE.Vector3().crossVectors(base.direction, base.up).normalize();
        dragYaw.setFromAxisAngle(worldUp, yaw);
        right.applyQuaternion(dragYaw);
        dragPitch.setFromAxisAngle(right, pitch);
        offset.applyQuaternion(dragYaw).applyQuaternion(dragPitch).multiplyScalar(zoom);
        camera.position.copy(lookTarget).add(offset);
        camera.up.copy(base.up).applyQuaternion(dragYaw).applyQuaternion(dragPitch);
        if (roll) {
            const viewDirection = lookTarget.clone().sub(camera.position).normalize();
            dragRoll.setFromAxisAngle(viewDirection, roll);
            camera.up.applyQuaternion(dragRoll);
        }
        camera.lookAt(lookTarget);
    };

    const beginMultiGesture = () => {
        const points = [...activePointers.values()];
        if (points.length < 2) {
            multiGesture = null;
            return;
        }
        const [first, second] = points;
        multiGesture = {
            midpointX: (first.x + second.x) / 2,
            midpointY: (first.y + second.y) / 2,
            distance: Math.max(1, Math.hypot(second.x - first.x, second.y - first.y)),
            angle: Math.atan2(second.y - first.y, second.x - first.x),
            camera: captureCamera()
        };
    };

    const setHover = (key) => {
        if (hoveredKey === key || focusedKey) return;
        hoveredKey = key;
        planetEntries.forEach((entry, entryKey) => {
            const targetScale = entryKey === key ? 1.09 : 1;
            entry.group.scale.setScalar(targetScale);
        });
        if (key) {
            sceneYear.textContent = careerData[key].years;
            sceneLabel.textContent = careerData[key].name;
        } else {
            sceneYear.textContent = "2018 - 2026";
            sceneLabel.textContent = "Engineering trajectory";
        }
    };

    const tweenCamera = (toPosition, toLook, duration, onProgress, onComplete) => {
        const fromPosition = camera.position.clone();
        const fromLook = camera.userData.lookTarget ? camera.userData.lookTarget.clone() : overviewLook.clone();
        const startedAt = performance.now();
        cameraTween = { fromPosition, fromLook, toPosition, toLook, duration, startedAt, onProgress, onComplete };
    };

    focusCareer = (key) => {
        const entry = planetEntries.get(key);
        if (!entry || focusedKey === key) return;
        returnViewPosition.copy(camera.position);
        returnViewLook.copy(lookTarget);
        returnViewUp.copy(camera.up);
        focusedKey = key;
        setHover(null);
        const worldPosition = new THREE.Vector3();
        const worldScale = new THREE.Vector3();
        entry.group.getWorldPosition(worldPosition);
        entry.group.getWorldScale(worldScale);
        const focusRadius = entry.radius * worldScale.x;
        const mobile = window.matchMedia("(max-width: 760px)").matches;
        const viewDirection = camera.getWorldDirection(new THREE.Vector3());
        const destination = worldPosition.clone()
            .addScaledVector(viewDirection, -(mobile ? focusRadius * 5 : focusRadius * 3.9))
            .addScaledVector(camera.up, focusRadius * (mobile ? 0.42 : 0.3));
        const duration = reducedMotion ? 1 : 1450;
        let panelOpened = false;
        tweenCamera(destination, worldPosition, duration, (progress) => {
            if (!panelOpened && progress > 0.58) {
                panelOpened = true;
                openPanel(key);
            }
        }, () => {
            if (!panelOpened) openPanel(key);
        });
        history.replaceState(null, "", `?focus=${key}`);
    };

    returnToOrbit = () => {
        if (!focusedKey && !panel.classList.contains("open")) return;
        closePanel();
        focusedKey = null;
        camera.up.copy(returnViewUp);
        tweenCamera(returnViewPosition, returnViewLook, reducedMotion ? 1 : 1250);
        history.replaceState(null, "", window.location.pathname);
    };

    const updatePointer = (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    renderer.domElement.addEventListener("pointermove", (event) => {
        updatePointer(event);
        if (activePointers.has(event.pointerId)) {
            activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        }
        if (activePointers.size >= 2 && multiGesture && !focusedKey) {
            const [first, second] = [...activePointers.values()];
            const midpointX = (first.x + second.x) / 2;
            const midpointY = (first.y + second.y) / 2;
            const distance = Math.max(1, Math.hypot(second.x - first.x, second.y - first.y));
            const angle = Math.atan2(second.y - first.y, second.x - first.x);
            const dx = midpointX - multiGesture.midpointX;
            const dy = midpointY - multiGesture.midpointY;
            dragging = true;
            orbitCamera(
                multiGesture.camera,
                -dx * 0.0034,
                dy * 0.0034,
                Math.max(0.55, Math.min(1.8, multiGesture.distance / distance)),
                angle - multiGesture.angle
            );
        } else if (pointerDown && !focusedKey) {
            const dx = event.clientX - pointerDown.x;
            const dy = event.clientY - pointerDown.y;
            if (Math.abs(dx) + Math.abs(dy) > 5) dragging = true;
            if (dragging) {
                orbitCamera(pointerDown.camera, -dx * 0.0042, dy * 0.0042);
            }
        }
    });

    renderer.domElement.addEventListener("pointerdown", (event) => {
        if (cameraTween && !focusedKey) cameraTween = null;
        activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        pointerDown = { x: event.clientX, y: event.clientY, camera: captureCamera() };
        if (activePointers.size >= 2) beginMultiGesture();
        dragging = false;
        renderer.domElement.focus({ preventScroll: true });
        try {
            renderer.domElement.setPointerCapture?.(event.pointerId);
        } catch {
            // Some browsers cancel touch capture while a second gesture is starting.
        }
    });

    renderer.domElement.addEventListener("pointerup", (event) => {
        updatePointer(event);
        const wasMultiTouch = activePointers.size > 1;
        if (!dragging && !wasMultiTouch && !focusedKey) {
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects(interactive, false)[0];
            if (hit?.object.userData.careerKey) focusCareer(hit.object.userData.careerKey);
        }
        activePointers.delete(event.pointerId);
        if (activePointers.size === 1) {
            const [remaining] = activePointers.values();
            pointerDown = { x: remaining.x, y: remaining.y, camera: captureCamera() };
            multiGesture = null;
            dragging = false;
        } else {
            pointerDown = null;
            multiGesture = null;
            dragging = false;
        }
    });

    renderer.domElement.addEventListener("pointercancel", (event) => {
        activePointers.delete(event.pointerId);
        if (activePointers.size === 1) {
            const [remaining] = activePointers.values();
            pointerDown = { x: remaining.x, y: remaining.y, camera: captureCamera() };
            multiGesture = null;
            dragging = false;
        } else if (!activePointers.size) {
            pointerDown = null;
            multiGesture = null;
            dragging = false;
        }
    });

    renderer.domElement.addEventListener("wheel", (event) => {
        if (focusedKey) return;
        event.preventDefault();
        if (cameraTween) cameraTween = null;
        const base = captureCamera();
        if (event.ctrlKey) {
            orbitCamera(base, 0, 0, Math.exp(Math.max(-80, Math.min(80, event.deltaY)) * 0.004));
        } else {
            orbitCamera(base, -event.deltaX * 0.0025, event.deltaY * 0.0018);
        }
    }, { passive: false });

    renderer.domElement.addEventListener("keydown", (event) => {
        if (focusedKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        const step = event.shiftKey ? 0.28 : 0.12;
        const base = captureCamera();
        if (event.key === "ArrowLeft") orbitCamera(base, step, 0);
        if (event.key === "ArrowRight") orbitCamera(base, -step, 0);
        if (event.key === "ArrowUp") orbitCamera(base, 0, step);
        if (event.key === "ArrowDown") orbitCamera(base, 0, -step);
    });

    renderer.domElement.addEventListener("pointerleave", () => {
        if (!activePointers.size) {
            pointer.set(2, 2);
            setHover(null);
        }
    });

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const updateWorldLabels = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const exclusionZones = [
            document.querySelector(".orbit-title"),
            document.querySelector(".timeline-dock"),
            document.querySelector(".scene-readout")
        ].filter(Boolean).map((element) => {
            const rect = element.getBoundingClientRect();
            return {
                left: rect.left - 18,
                right: rect.right + 18,
                top: rect.top - 14,
                bottom: rect.bottom + 14
            };
        });
        const projectedLabels = [];
        labelEntries.forEach((entry) => {
            if (!entry.object) return;
            const position = new THREE.Vector3();
            const scale = new THREE.Vector3();
            entry.object.getWorldPosition(position);
            entry.object.getWorldScale(scale);
            position.y += entry.radius * scale.y + (mobileViewport ? 0.28 : 0.42);
            position.project(camera);
            const visible = position.z > -1 && position.z < 1;
            projectedLabels.push({
                entry,
                visible,
                x: Math.max(46, Math.min(viewportWidth - 46, (position.x * 0.5 + 0.5) * viewportWidth)),
                y: Math.max(82, Math.min(viewportHeight - 102, (-position.y * 0.5 + 0.5) * viewportHeight))
            });
        });

        const placed = [];
        projectedLabels.sort((a, b) => a.y - b.y).forEach((label) => {
            let adjustedY = label.y;
            const width = label.entry.element.offsetWidth || 84;
            for (let attempts = 0; attempts < 7; attempts++) {
                const collision = placed.find((other) =>
                    Math.abs(other.x - label.x) < (other.width + width) * 0.52 &&
                    Math.abs(other.y - adjustedY) < 25
                );
                if (!collision) break;
                adjustedY = Math.min(viewportHeight - 102, collision.y + 27);
            }
            placed.push({ x: label.x, y: adjustedY, width });
            label.entry.element.style.left = `${label.x}px`;
            label.entry.element.style.top = `${adjustedY}px`;
            const blockedByInterface = exclusionZones.some((zone) =>
                label.x + width / 2 > zone.left &&
                label.x - width / 2 < zone.right &&
                adjustedY + 14 > zone.top &&
                adjustedY - 14 < zone.bottom
            );
            label.entry.element.style.opacity = label.visible && !blockedByInterface ? "1" : "0";
        });
    };

    const clock = new THREE.Clock();

    const render = (time) => {
        const delta = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.elapsedTime;
        stars.rotation.y = elapsed * 0.004;
        stars.rotation.x = Math.sin(elapsed * 0.025) * 0.035;
        brightStars.rotation.y = -elapsed * 0.007;
        brightStars.rotation.z = elapsed * 0.002;
        brightStars.material.opacity = 0.72 + Math.sin(elapsed * 1.35) * 0.08;
        sunUniforms.time.value = elapsed;
        corona.scale.setScalar(1 + Math.sin(elapsed * 2.6) * 0.018);
        const glowPulse = 1 + Math.sin(elapsed * 2.1) * 0.035;
        sunGlow.scale.set(7.4 * glowPulse, 7.4 * glowPulse, 1);
        sunGlow.material.opacity = 0.86 + Math.sin(elapsed * 2.7) * 0.06;
        flameTongues.forEach(({ mesh, direction, phase, width, length }, index) => {
            const flicker = 0.88 + Math.sin(elapsed * (3.4 + (index % 5) * 0.24) + phase) * 0.2;
            const flare = Math.max(0, Math.sin(elapsed * 2.45 + phase)) * 0.28;
            const sway = Math.sin(elapsed * 2.8 + phase) * 0.07;
            mesh.scale.set(width * (1 - flare * 0.18), length * (flicker + flare), width);
            mesh.position.copy(direction).multiplyScalar(sunRadius - 0.08 + flare * 0.18);
            mesh.rotateOnAxis(direction, sway * delta);
        });

        if (!focusedKey && !dragging && !reducedMotion) {
            orbitalPivots.forEach(({ pivot, speed }) => { pivot.rotation.y += speed * delta; });
        }
        planetEntries.forEach((entry, key) => {
            entry.mesh.rotation.y += key === "sainapse" || key === "nyu" ? 0.0014 : 0.0022;
            entry.atmosphere.rotation.y -= 0.0008;
        });

        if (!focusedKey && !dragging) {
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects(interactive, false)[0];
            setHover(hit?.object.userData.careerKey || null);
        }

        if (cameraTween) {
            const progress = Math.min(1, (time - cameraTween.startedAt) / cameraTween.duration);
            const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            camera.position.lerpVectors(cameraTween.fromPosition, cameraTween.toPosition, eased);
            lookTarget.lerpVectors(cameraTween.fromLook, cameraTween.toLook, eased);
            camera.lookAt(lookTarget);
            cameraTween.onProgress?.(progress);
            if (progress >= 1) {
                const complete = cameraTween.onComplete;
                cameraTween = null;
                complete?.();
            }
        } else {
            camera.lookAt(lookTarget);
        }

        updateWorldLabels();
        renderer.render(scene, camera);
        revealCareerScene();
        if (window.__careerOrbitMaxPixel === undefined) {
            const gl = renderer.getContext();
            const pixel = new Uint8Array(4);
            let maxChannel = 0;
            for (let x = 1; x < 8; x++) {
                for (let y = 1; y < 8; y++) {
                    gl.readPixels(
                        Math.floor(renderer.domElement.width * x / 8),
                        Math.floor(renderer.domElement.height * y / 8),
                        1,
                        1,
                        gl.RGBA,
                        gl.UNSIGNED_BYTE,
                        pixel
                    );
                    maxChannel = Math.max(maxChannel, pixel[0], pixel[1], pixel[2]);
                }
            }
            window.__careerOrbitMaxPixel = maxChannel;
        }
    };
    renderer.setAnimationLoop(render);

    const requestedFocus = new URLSearchParams(window.location.search).get("focus");
    if (requestedFocus && careerData[requestedFocus]) {
        const continuingTransition = document.body.dataset.orbitArrival === requestedFocus;
        window.setTimeout(() => focusCareer(requestedFocus), reducedMotion ? 0 : (continuingTransition ? 90 : 550));
    }
}
