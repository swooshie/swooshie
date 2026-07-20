const THEME_STORAGE_KEY = "preferred-theme";
const themeToggle = document.getElementById("theme-toggle");
const themeToggleText = document.getElementById("theme-toggle-text");
const brand = document.querySelector(".brand");

const applyTheme = (theme) => {
    const isMatrix = theme === "matrix";
    document.body.classList.toggle("theme-matrix", isMatrix);
    themeToggle?.setAttribute("aria-pressed", String(isMatrix));
    if (themeToggleText) themeToggleText.textContent = isMatrix ? "Matrix" : "Modern";
    if (brand) brand.textContent = isMatrix ? "<SWSH />" : "<AJ />";
};

applyTheme(localStorage.getItem(THEME_STORAGE_KEY) === "matrix" ? "matrix" : "modern");

themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-matrix") ? "modern" : "matrix";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});
