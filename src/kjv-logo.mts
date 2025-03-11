/// <reference lib="dom" />

const DATA_URL: string = "./data/kjv-logo.svg";

// Define the color groups with their initial element IDs
interface ColorGroups {
    [color: string]: string[];
}

const COLOR_GROUPS: ColorGroups = {
    "#434b72ff": ["#waves"],           // Dark blue
    "#bfd5e2ff": ["#sky"],             // Light blue
    "#00000000": ["#lettergap", "#garlandgap"], // Transparent
    "#231f20ff": ["#letterborder", "#garlandborder", "#arcborder"], // Black
    "#f3df59ff": ["#yearbackground", "#higherarc", "#lowerarc", "#letters"], // Yellow
    "#689674ff": ["#leaves"]           // Green
};

// Persistent state for color assignments
let colorGroups: ColorGroups = { ...COLOR_GROUPS }; // Mutable copy of initial state
let colorSelects: Map<string, HTMLSelectElement> = new Map(); // Store select elements by color

// Load and display the SVG
async function loadSVG(): Promise<SVGSVGElement> {
    const response: Response = await fetch(DATA_URL);
    if (!response.ok) throw new Error("Failed to fetch SVG");
    const svgText: string = await response.text();
    const parser: DOMParser = new DOMParser();
    const svgDoc: Document = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement as unknown as SVGSVGElement;

    const container: HTMLElement = document.getElementById("svg-container")!;
    container.appendChild(svgElement);

    // Ensure SVG scales properly
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgElement.removeAttribute("width"); // Let CSS handle sizing
    svgElement.removeAttribute("height");

    return svgElement;
}

// Update the fill and stroke of SVG elements based on color groups
function updateElementColors(svg: SVGSVGElement, groups: ColorGroups = colorGroups): void {
    console.log("Updating SVG with color groups:", groups); // Log the current state
    Object.entries(groups).forEach(([color, ids]: [string, string[]]) => {
        ids.forEach((id: string) => {
            const element: SVGElement | null = svg.querySelector(id);
            if (element) {
                console.log(`Setting ${id} to color ${color}`); // Log each update
                element.setAttribute("fill", color);
                element.setAttribute("stroke", color);
            } else {
                console.warn(`Element ${id} not found in SVG`); // Warn if ID is missing
            }
        });
    });
}

// Update the UI to reflect current colorGroups state
function updateColorControls(): void {
    colorSelects.forEach((select: HTMLSelectElement, color: string) => {
        const currentIds: string[] = colorGroups[color] || [];
        Array.from(select.options).forEach((option: HTMLOptionElement) => {
            option.selected = currentIds.includes(option.value);
        });
    });
}

// Create the color reassignment UI (called only once)
function createColorControls(svg: SVGSVGElement): void {
    const controls: HTMLElement = document.getElementById("color-controls")!;
    controls.innerHTML = ""; // Clear existing controls

    const allIds: string[] = Object.values(COLOR_GROUPS).flat(); // All possible element IDs

    Object.entries(colorGroups).forEach(([color, ids]: [string, string[]]) => {
        const groupDiv: HTMLDivElement = document.createElement("div");
        groupDiv.className = "color-group";

        const colorSwatch: HTMLDivElement = document.createElement("div");
        colorSwatch.style.width = "20px";
        colorSwatch.style.height = "20px";
        colorSwatch.style.backgroundColor = color;
        colorSwatch.style.display = "inline-block";
        colorSwatch.style.marginRight = "10px";

        const select: HTMLSelectElement = document.createElement("select");
        select.multiple = true;
        select.size = 5;

        // Populate with all possible elements
        allIds.forEach((id: string) => {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = id;
            option.textContent = id;
            option.selected = ids.includes(id);
            select.appendChild(option);
        });

        // Store the select element
        colorSelects.set(color, select);

        // Update color group on change
        select.addEventListener("change", () => {
            const selectedIds: string[] = Array.from(select.selectedOptions).map((opt: HTMLOptionElement) => opt.value);
            console.log('selectedIds', JSON.stringify(selectedIds));
            // Update the current color's group
            colorGroups[color] = selectedIds;

            // Remove selected IDs from other groups to prevent overlap
            Object.keys(colorGroups).forEach((otherColor: string) => {
                if (otherColor !== color) {
                    colorGroups[otherColor] = colorGroups[otherColor].filter((id: string) => !selectedIds.includes(id));
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
async function initialize(): Promise<void> {
    try {
        const svg: SVGSVGElement = await loadSVG();
        updateElementColors(svg); // Initial render
        createColorControls(svg); // Build UI once
    } catch (error: unknown) {
        console.error("Error initializing:", error);
        const container: HTMLElement = document.getElementById("svg-container")!;
        container.innerText = "Failed to load SVG.";
    }
}

document.addEventListener("DOMContentLoaded", initialize);