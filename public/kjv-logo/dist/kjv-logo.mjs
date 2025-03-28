/// <reference lib="dom" />
const DATA_URL = "data/kjv-logo.svg";
// Define the fixed set of 7 colors (including white and transparent)
const COLORS = [
    "#434b72ff", // Dark blue
    "#bfd5e2ff", // Light blue
    "#00000000", // Transparent
    "#231f20ff", // Black
    "#f3df59ff", // Yellow
    "#689674ff", // Green
    "#ffffffff" // White
];
const COLOR_GROUPS = {
    "#waves": "#434b72ff", // Dark blue
    "#sky": "#bfd5e2ff", // Light blue
    "#lettergap": "#00000000", // Transparent
    "#garlandgap": "#00000000", // Transparent
    "#letterborder": "#231f20ff", // Black
    "#garlandborder": "#231f20ff", // Black
    "#arcborder": "#231f20ff", // Black
    "#yearbackground": "#f3df59ff", // Yellow
    "#higherarc": "#f3df59ff", // Yellow
    "#lowerarc": "#f3df59ff", // Yellow
    "#letters": "#f3df59ff", // Yellow
    "#leaves": "#689674ff" // Green
};
// Persistent state for color assignments
let colorGroups = { ...COLOR_GROUPS }; // Mutable copy of initial state
let svgElement = null; // Store SVG for updates
// Load and display the SVG
async function loadSVG() {
    const response = await fetch(DATA_URL);
    if (!response.ok)
        throw new Error("Failed to fetch SVG");
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svg = svgDoc.documentElement;
    // Remove fill and stroke from style attributes of managed elements
    Object.keys(COLOR_GROUPS).forEach((id) => {
        const element = svg.querySelector(id);
        if (element && element.hasAttribute("style")) {
            const style = element.getAttribute("style");
            const styleMap = new Map(style.split(";").map((rule) => {
                const [key, value] = rule.split(":").map((s) => s.trim());
                return [key, value];
            }));
            styleMap.delete("fill");
            styleMap.delete("stroke");
            const newStyle = Array.from(styleMap.entries())
                .map(([key, value]) => `${key}:${value}`)
                .join(";");
            if (newStyle) {
                element.setAttribute("style", newStyle);
            }
            else {
                element.removeAttribute("style");
            }
        }
    });
    const container = document.getElementById("svg-container");
    container.appendChild(svg);
    // Ensure SVG scales properly
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    return svg;
}
// Update SVG element colors based on colorGroups
function updateElementColors(svg) {
    Object.entries(colorGroups).forEach(([id, color]) => {
        const element = svg.querySelector(id);
        if (element) {
            element.setAttribute("fill", color);
            element.setAttribute("stroke", color);
        }
        else {
            console.warn(`Element ${id} not found in SVG`);
        }
    });
}
// Set up color picker and SVG click handlers
function setupColorPicker(svg) {
    // Create the color picker dialog (hidden by default)
    const dialog = document.createElement("div");
    dialog.id = "color-picker";
    dialog.className = "color-picker hidden";
    dialog.innerHTML = `
        <div class="color-options"></div>
        <button id="close-picker">Close</button>
    `;
    document.body.appendChild(dialog);
    const closeButton = dialog.querySelector("#close-picker");
    closeButton.addEventListener("click", () => dialog.classList.add("hidden"));
    // Add click event listeners to SVG elements
    Object.keys(COLOR_GROUPS).forEach((id) => {
        const element = svg.querySelector(id);
        if (element) {
            element.style.cursor = "pointer"; // Visual feedback
            element.addEventListener("click", () => showColorPicker(id, svg));
        }
        else {
            console.warn(`Element ${id} not found in SVG for click listener`);
        }
    });
}
let currentlyHighlightedElement = null; // Track the highlighted element
function showColorPicker(id, svg) {
    const dialog = document.getElementById("color-picker");
    const optionsContainer = dialog.querySelector(".color-options");
    optionsContainer.innerHTML = "";
    // Remove highlight from previously highlighted element
    if (currentlyHighlightedElement) {
        currentlyHighlightedElement.classList.remove("highlight-pulse");
    }
    // Add highlight to the current target element
    const targetElement = svg.querySelector(id);
    if (targetElement) {
        targetElement.classList.add("highlight-pulse");
        currentlyHighlightedElement = targetElement; // Update tracking
    }
    else {
        console.warn(`Element ${id} not found in SVG for highlighting`);
    }
    COLORS.forEach((color) => {
        const option = document.createElement("div");
        option.className = "color-option";
        if (color === "#00000000") {
            option.style.position = "relative";
            option.style.backgroundColor = "#ffffff";
            for (let i = 0; i < 4; i++) {
                const square = document.createElement("div");
                square.style.position = "absolute";
                square.style.width = "50%";
                square.style.height = "50%";
                if (i === 0) {
                    square.style.top = "0";
                    square.style.left = "0";
                    square.style.backgroundColor = "#808080";
                }
                else if (i === 1) {
                    square.style.top = "50%";
                    square.style.left = "50%";
                    square.style.backgroundColor = "#808080";
                }
                else if (i === 2) {
                    square.style.top = "50%";
                    square.style.left = "0";
                }
                else {
                    square.style.top = "0";
                    square.style.left = "50%";
                }
                option.appendChild(square);
            }
        }
        else {
            option.style.backgroundColor = color;
        }
        option.addEventListener("click", () => {
            colorGroups[id] = color;
            updateElementColors(svg);
            dialog.classList.add("hidden");
            if (currentlyHighlightedElement) {
                currentlyHighlightedElement.classList.remove("highlight-pulse");
                currentlyHighlightedElement = null;
            }
        });
        optionsContainer.appendChild(option);
    });
    dialog.classList.remove("hidden");
    // Position dialog near the SVG element
    if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        dialog.style.top = `${rect.bottom + window.scrollY}px`;
        dialog.style.left = `${rect.left + window.scrollX}px`;
    }
    else {
        dialog.style.top = "50%";
        dialog.style.left = "50%";
        dialog.style.transform = "translate(-50%, -50%)";
    }
    const closeButton = dialog.querySelector("#close-picker");
    closeButton.onclick = () => {
        dialog.classList.add("hidden");
        if (currentlyHighlightedElement) {
            currentlyHighlightedElement.classList.remove("highlight-pulse");
            currentlyHighlightedElement = null;
        }
    };
}
// Cache name with UUID placeholder (replaced at build time)
const CACHE_NAME = "kjv-logo-24464152-bd36-486c-8ee9-783268b782a5";
// Register service worker with force update
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/kjv-logo/service-worker.js', {
                scope: './'
            });
            // Force update on new service worker
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            newWorker.postMessage({ action: 'skipWaiting' });
                        }
                    });
                }
            });
            console.log('Service Worker registered with scope:', registration.scope);
        }
        catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
    else {
        console.warn('Service Workers not supported in this browser');
    }
}
// Initialize the application
async function initialize() {
    try {
        await registerServiceWorker();
        svgElement = await loadSVG();
        updateElementColors(svgElement);
        setupColorPicker(svgElement);
    }
    catch (error) {
        console.error("Error initializing:", error);
        const container = document.getElementById("svg-container");
        container.innerText = "Failed to load SVG.";
    }
}
document.addEventListener("DOMContentLoaded", initialize);
export {};
