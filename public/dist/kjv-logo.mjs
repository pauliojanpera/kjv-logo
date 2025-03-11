/// <reference lib="dom" />
const DATA_URL = "./data/kjv-logo.svg";
// Define the fixed set of 7 colors (including white and transparent)
const COLORS = [
    "#434b72ff", // Dark blue
    "#bfd5e2ff", // Light blue
    "#00000000", // Transparent
    "#231f20ff", // Black
    "#f3df59ff", // Yellow
    "#689674ff", // Green
    "#ffffffff" // White (new)
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
// Create the element list and color picker UI
function createColorControls(svg) {
    const controls = document.getElementById("color-controls");
    controls.innerHTML = ""; // Clear existing controls
    const list = document.createElement("ul");
    list.className = "element-list";
    Object.keys(COLOR_GROUPS).forEach((id) => {
        const listItem = document.createElement("li");
        listItem.textContent = id;
        listItem.className = "element-item";
        listItem.addEventListener("click", () => showColorPicker(id, svg));
        list.appendChild(listItem);
    });
    controls.appendChild(list);
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
}
// Show the color picker for a specific element
function showColorPicker(id, svg) {
    const dialog = document.getElementById("color-picker");
    const optionsContainer = dialog.querySelector(".color-options");
    optionsContainer.innerHTML = "";
    COLORS.forEach((color) => {
        const option = document.createElement("div");
        option.className = "color-option";
        if (color === "#00000000") {
            // Create a checkerboard pattern using nested divs
            option.style.position = "relative";
            option.style.backgroundColor = "#ffffff"; // White base
            // Create checkerboard grid (2x2 pattern)
            for (let i = 0; i < 4; i++) {
                const square = document.createElement("div");
                square.style.position = "absolute";
                square.style.width = "50%";
                square.style.height = "50%";
                // Position squares in checkerboard pattern
                if (i === 0) {
                    square.style.top = "0";
                    square.style.left = "0";
                    square.style.backgroundColor = "#808080"; // Gray squares
                }
                else if (i === 1) {
                    square.style.top = "50%";
                    square.style.left = "50%";
                    square.style.backgroundColor = "#808080"; // Gray squares
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
        });
        optionsContainer.appendChild(option);
    });
    dialog.classList.remove("hidden");
    // Position dialog near the clicked element
    const items = document.querySelectorAll(".element-item");
    const clickedItem = Array.from(items).find((item) => item.textContent === id);
    if (clickedItem) {
        const rect = clickedItem.getBoundingClientRect();
        dialog.style.top = `${rect.bottom + window.scrollY}px`;
        dialog.style.left = `${rect.left + window.scrollX}px`;
    }
}
// Initialize the application
async function initialize() {
    try {
        svgElement = await loadSVG();
        updateElementColors(svgElement); // Initial render
        createColorControls(svgElement); // Build UI once
    }
    catch (error) {
        console.error("Error initializing:", error);
        const container = document.getElementById("svg-container");
        container.innerText = "Failed to load SVG.";
    }
}
document.addEventListener("DOMContentLoaded", initialize);
export {};
