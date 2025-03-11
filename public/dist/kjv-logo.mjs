/// <reference lib="dom" />
const DATA_URL = "./data/kjv-logo.svg";
const COLOR_GROUPS = {
    "#434b72ff": ["#waves"], // Dark blue
    "#bfd5e2ff": ["#sky"], // Light blue
    "#00000000": ["#lettergap", "#garlandgap"], // Transparent
    "#231f20ff": ["#letterborder", "#garlandborder", "#arcborder"], // Black
    "#f3df59ff": ["#yearbackground", "#higherarc", "#lowerarc", "#letters"], // Yellow
    "#689674ff": ["#leaves"] // Green
};
// Persistent state for color assignments
let colorGroups = { ...COLOR_GROUPS }; // Mutable copy of initial state
let colorSelects = new Map(); // Store select elements by color
// Load and display the SVG
async function loadSVG() {
    const response = await fetch(DATA_URL);
    if (!response.ok)
        throw new Error("Failed to fetch SVG");
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    // Remove fill and stroke from style attributes of managed elements
    Object.values(COLOR_GROUPS).flat().forEach((id) => {
        const element = svgElement.querySelector(id);
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
    container.appendChild(svgElement);
    // Ensure SVG scales properly
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgElement.removeAttribute("width"); // Let CSS handle sizing
    svgElement.removeAttribute("height");
    return svgElement;
}
// Update the fill and stroke of SVG elements based on color groups
function updateElementColors(svg, groups = colorGroups) {
    console.log("Updating SVG with color groups:", groups); // Log the current state
    Object.entries(groups).forEach(([color, ids]) => {
        ids.forEach((id) => {
            const element = svg.querySelector(id);
            if (element) {
                console.log(`Setting ${id} to color ${color}`); // Log each update
                element.setAttribute("fill", color);
                element.setAttribute("stroke", color);
            }
            else {
                console.warn(`Element ${id} not found in SVG`); // Warn if ID is missing
            }
        });
    });
}
// Update the UI to reflect current colorGroups state
function updateColorControls() {
    colorSelects.forEach((select, color) => {
        const currentIds = colorGroups[color] || [];
        Array.from(select.options).forEach((option) => {
            option.selected = currentIds.includes(option.value);
        });
    });
}
// Create the color reassignment UI (called only once)
function createColorControls(svg) {
    const controls = document.getElementById("color-controls");
    controls.innerHTML = ""; // Clear existing controls
    const allIds = Object.values(COLOR_GROUPS).flat(); // All possible element IDs
    Object.entries(colorGroups).forEach(([color, ids]) => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "color-group";
        const colorSwatch = document.createElement("div");
        colorSwatch.style.width = "20px";
        colorSwatch.style.height = "20px";
        colorSwatch.style.backgroundColor = color;
        colorSwatch.style.display = "inline-block";
        colorSwatch.style.marginRight = "10px";
        const select = document.createElement("select");
        select.multiple = true;
        select.size = 5;
        // Populate with all possible elements
        allIds.forEach((id) => {
            const option = document.createElement("option");
            option.value = id;
            option.textContent = id;
            option.selected = ids.includes(id);
            select.appendChild(option);
        });
        // Store the select element
        colorSelects.set(color, select);
        // Update color group on change
        select.addEventListener("change", () => {
            const selectedIds = Array.from(select.selectedOptions).map((opt) => opt.value);
            console.log('selectedIds', JSON.stringify(selectedIds));
            // Update the current color's group
            colorGroups[color] = selectedIds;
            // Remove selected IDs from other groups to prevent overlap
            Object.keys(colorGroups).forEach((otherColor) => {
                if (otherColor !== color) {
                    colorGroups[otherColor] = colorGroups[otherColor].filter((id) => !selectedIds.includes(id));
                }
            });
            // Update the SVG and UI
            updateElementColors(svg);
            updateColorControls(); // Update dropdowns without rebuilding
        });
        groupDiv.appendChild(colorSwatch);
        groupDiv.appendChild(select);
        controls.appendChild(groupDiv);
    });
}
// Initialize the application
async function initialize() {
    try {
        const svg = await loadSVG();
        updateElementColors(svg); // Initial render
        createColorControls(svg); // Build UI once
    }
    catch (error) {
        console.error("Error initializing:", error);
        const container = document.getElementById("svg-container");
        container.innerText = "Failed to load SVG.";
    }
}
document.addEventListener("DOMContentLoaded", initialize);
export {};
