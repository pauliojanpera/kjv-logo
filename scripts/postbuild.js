#!/usr/bin/env node
const { randomUUID } = require('crypto');
const fs = require('fs');

// Generate a UUID
const uuid = randomUUID();

// Paths to input and output files
const swInputPath = 'public/dist/service-worker.mjs';
const swOutputPath = 'public/service-worker.js';
const kjvInputPath = 'public/dist/kjv-logo.mjs';
const kjvOutputPath = 'public/dist/kjv-logo.mjs';

// Read and process service-worker.mjs
const swContent = fs.readFileSync(swInputPath, 'utf8').replace('CACHE_UUID', uuid);
fs.writeFileSync(swOutputPath, swContent);

// Read and process kjv-logo.mjs
const kjvContent = fs.readFileSync(kjvInputPath, 'utf8').replace('CACHE_UUID', uuid);
fs.writeFileSync(kjvOutputPath, kjvContent);

// Clean up the export statement in service-worker.js (equivalent to sed command)
const finalSwContent = fs.readFileSync(swOutputPath, 'utf8').replace(/export {};/, '');
fs.writeFileSync(swOutputPath, finalSwContent);

console.log(`Post-build complete with UUID: ${uuid}`);