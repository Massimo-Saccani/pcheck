#!/usr/bin/env node
import { checkPackageJson } from './index.js';

const args = process.argv.slice(2);
const jsonFlag = args.includes('--json');

try {
  const result = await checkPackageJson({ outputJson: jsonFlag });
  if (jsonFlag) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result);
  }
} catch (err) {
  console.error(`Errore: ${err.message}`);
  process.exit(1);
}
