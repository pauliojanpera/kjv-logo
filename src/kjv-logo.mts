/// <reference lib="dom" />

const DATA_URL: string = "./data/kjv-logo.svg";

// Define the fixed set of 7 colors (including white and transparent)
const COLORS: string[] = [
    "#434b72ff", // Dark blue
    "#bfd5e2ff", // Light blue
    "#00000000", // Transparent
    "#231f20ff", // Black
    "#f3df59ff", // Yellow
    "#689674ff", // Green
    "#ffffffff"  // White (new)
];

// Define initial color assignments for SVG elements
interface ColorGroups {
    [id: string]: string; // Map element IDs to colors
}

const COLOR_GROUPS: ColorGroups = {
    "#waves": "#434b72ff",           // Dark blue
    "#sky": "#bfd5e2ff",             // Light blue
    "#lettergap": "#00000000",       // Transparent
    "#garlandgap": "#00000000",      // Transparent
    "#letterborder": "#231f20ff",    // Black
    "#garlandborder": "#231f20ff",   // Black
    "#arcborder": "#231f20ff",       // Black
    "#yearbackground": "#f3df59ff",  // Yellow
    "#higherarc": "#f3df59ff",       // Yellow
    "#lowerarc": "#f3df59ff",        // Yellow
    "#letters": "#f3df59ff",         // Yellow
    "#leaves": "#689674ff"           // Green
};

// Persistent state for color assignments
let colorGroups: ColorGroups = { ...COLOR_GROUPS }; // Mutable copy of initial state
let svgElement: SVGSVGElement | null = null; // Store SVG for updates

// Load and display the SVG
async function loadSVG(): Promise<SVGSVGElement> {
    const response: Response = await fetch(DATA_URL);
    if (!response.ok) throw new Error("Failed to fetch SVG");
    const svgText: string = await response.text();
    const parser: DOMParser = new DOMParser();
    const svgDoc: Document = parser.parseFromString(svgText, "image/svg+xml");
    const svg = svgDoc.documentElement as unknown as SVGSVGElement;

    // Remove fill and stroke from style attributes of managed elements
    Object.keys(COLOR_GROUPS).forEach((id: string) => {
        const element: SVGElement | null = svg.querySelector(id);
        if (element && element.hasAttribute("style")) {
            const style = element.getAttribute("style")!;
            const styleMap = new Map(
                style.split(";").map((rule) => {
                    const [key, value] = rule.split(":").map((s) => s.trim());
                    return [key, value];
                })
            );
            styleMap.delete("fill");
            styleMap.delete("stroke");
            const newStyle = Array.from(styleMap.entries())
                .map(([key, value]) => `${key}:${value}`)
                .join(";");
            if (newStyle) {
                element.setAttribute("style", newStyle);
            } else {
                element.removeAttribute("style");
            }
        }
    });

    const container: HTMLElement = document.getElementById("svg-container")!;
    container.appendChild(svg);

    // Ensure SVG scales properly
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    return svg;
}

// Update SVG element colors based on colorGroups
function updateElementColors(svg: SVGSVGElement): void {
    Object.entries(colorGroups).forEach(([id, color]: [string, string]) => {
        const element: SVGElement | null = svg.querySelector(id);
        if (element) {
            element.setAttribute("fill", color);
            element.setAttribute("stroke", color);
        } else {
            console.warn(`Element ${id} not found in SVG`);
        }
    });
}

// Create the element list and color picker UI
function createColorControls(svg: SVGSVGElement): void {
    const controls: HTMLElement = document.getElementById("color-controls")!;
    const list: HTMLUListElement = controls.querySelector(".element-list")!; // Updated selector
    list.innerHTML = ""; // Clear existing controls

    Object.keys(COLOR_GROUPS).forEach((id: string) => {
        const listItem: HTMLLIElement = document.createElement("li");
        listItem.textContent = id;
        listItem.className = "element-item";
        listItem.addEventListener("click", () => showColorPicker(id, svg));
        list.appendChild(listItem);
    });

    // Add toggle functionality
    const toggleButton: HTMLButtonElement = controls.querySelector("#toggle-controls")!;
    toggleButton.addEventListener("click", () => {
        const isVisible = list.classList.contains("visible");
        list.classList.toggle("visible");
        toggleButton.textContent = isVisible ? "Show Colors" : "Hide Colors";
    });

    // Create the color picker dialog (hidden by default)
    const dialog: HTMLDivElement = document.createElement("div");
    dialog.id = "color-picker";
    dialog.className = "color-picker hidden";
    dialog.innerHTML = `
        <div class="color-options"></div>
        <button id="close-picker">Close</button>
    `;
    document.body.appendChild(dialog);

    const closeButton: HTMLButtonElement = dialog.querySelector("#close-picker")!;
    closeButton.addEventListener("click", () => dialog.classList.add("hidden"));
}

let currentlyHighlightedElement: SVGElement | null = null; // Track the highlighted element

function showColorPicker(id: string, svg: SVGSVGElement): void {
    const dialog: HTMLDivElement = document.getElementById("color-picker")! as HTMLDivElement;
    const optionsContainer: HTMLDivElement = dialog.querySelector(".color-options")!;
    optionsContainer.innerHTML = "";

    // Remove highlight from previously highlighted element
    if (currentlyHighlightedElement) {
        currentlyHighlightedElement.classList.remove("highlight-pulse");
    }

    // Add highlight to the current target element
    const targetElement: SVGElement | null = svg.querySelector(id);
    if (targetElement) {
        targetElement.classList.add("highlight-pulse");
        currentlyHighlightedElement = targetElement; // Update tracking
    } else {
        console.warn(`Element ${id} not found in SVG for highlighting`);
    }

    COLORS.forEach((color: string) => {
        const option: HTMLDivElement = document.createElement("div");
        option.className = "color-option";
        
        if (color === "#00000000") {
            // Existing transparent checkerboard logic remains unchanged
            option.style.position = "relative";
            option.style.backgroundColor = "#ffffff";
            for (let i = 0; i < 4; i++) {
                const square: HTMLDivElement = document.createElement("div");
                square.style.position = "absolute";
                square.style.width = "50%";
                square.style.height = "50%";
                if (i === 0) {
                    square.style.top = "0";
                    square.style.left = "0";
                    square.style.backgroundColor = "#808080";
                } else if (i === 1) {
                    square.style.top = "50%";
                    square.style.left = "50%";
                    square.style.backgroundColor = "#808080";
                } else if (i === 2) {
                    square.style.top = "50%";
                    square.style.left = "0";
                } else {
                    square.style.top = "0";
                    square.style.left = "50%";
                }
                option.appendChild(square);
            }
        } else {
            option.style.backgroundColor = color;
        }
        
        option.addEventListener("click", () => {
            colorGroups[id] = color;
            updateElementColors(svg);
            dialog.classList.add("hidden");
            // Remove highlight when color is selected
            if (currentlyHighlightedElement) {
                currentlyHighlightedElement.classList.remove("highlight-pulse");
                currentlyHighlightedElement = null;
            }
        });
        optionsContainer.appendChild(option);
    });

    dialog.classList.remove("hidden");

    // Position dialog near the clicked element (existing logic)
    const items = document.querySelectorAll(".element-item");
    const clickedItem = Array.from(items).find((item) => item.textContent === id);
    if (clickedItem) {
        const rect = clickedItem.getBoundingClientRect();
        dialog.style.top = `${rect.bottom + window.scrollY}px`;
        dialog.style.left = `${rect.left + window.scrollX}px`;
    }

    // Add cleanup when closing via the close button
    const closeButton: HTMLButtonElement = dialog.querySelector("#close-picker")!;
    closeButton.onclick = () => {
        dialog.classList.add("hidden");
        if (currentlyHighlightedElement) {
            currentlyHighlightedElement.classList.remove("highlight-pulse");
            currentlyHighlightedElement = null;
        }
    };
}

// Initialize the application
async function initialize(): Promise<void> {
    try {
        svgElement = await loadSVG();
        updateElementColors(svgElement); // Initial render
        createColorControls(svgElement); // Build UI once
    } catch (error: unknown) {
        console.error("Error initializing:", error);
        const container: HTMLElement = document.getElementById("svg-container")!;
        container.innerText = "Failed to load SVG.";
    }
}

document.addEventListener("DOMContentLoaded", initialize);