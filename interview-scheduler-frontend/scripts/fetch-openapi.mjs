import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const OUTPUT_PATH = path.resolve(__dirname, '../openapi.json');

async function fetchOpenApiSpec() {
  try {
    console.log(`Fetching OpenAPI spec from ${BACKEND_URL}/openapi.json...`);
    const response = await fetch(`${BACKEND_URL}/openapi.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const spec = await response.json();
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(spec, null, 2), 'utf-8');
    console.log(`OpenAPI spec saved to ${OUTPUT_PATH}`);
    
    return spec;
  } catch (error) {
    console.error('Error fetching OpenAPI spec:', error.message);
    console.log('\nMake sure the backend server is running:');
    console.log('  cd interview-scheduler-backend && uvicorn main:app --reload');
    process.exit(1);
  }
}

fetchOpenApiSpec();
