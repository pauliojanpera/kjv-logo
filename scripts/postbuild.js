#!/usr/bin/env node
const { randomUUID } = require('crypto');
const fs = require('fs');

// Ensure public/kjv-logo exists
const outputDir = 'public/kjv-logo';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a UUID
const uuid = randomUUID();

// Paths to input and output files
const swInputPath = 'public/kjv-logo/dist/service-worker.mjs'; // Updated path
const swOutputPath = 'public/kjv-logo/service-worker.js';      // Updated path
const kjvInputPath = 'public/kjv-logo/dist/kjv-logo.mjs';     // Updated path
const kjvOutputPath = 'public/kjv-logo/dist/kjv-logo.mjs';    // Updated path

// Read and process service-worker.mjs
const swContent = fs.readFileSync(swInputPath, 'utf8').replace('CACHE_UUID', uuid);
fs.writeFileSync(swOutputPath, swContent);

// Read and process kjv-logo.mjs
const kjvContent = fs.readFileSync(kjvInputPath, 'utf8').replace('CACHE_UUID', uuid);
fs.writeFileSync(kjvOutputPath, kjvContent);

// Clean up the export statement in service-worker.js
const finalSwContent = fs.readFileSync(swOutputPath, 'utf8').replace(/export {};/, '');
fs.writeFileSync(swOutputPath, finalSwContent);

console.log(`Post-build complete with UUID: ${uuid}`);