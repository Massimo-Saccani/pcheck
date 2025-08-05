#!/usr/bin/env node
import { checkPackageJson } from './index.js';
import ora from 'ora';

const args = process.argv.slice(2);
const jsonFlag = args.includes('--json');

const spinner = ora('🔍 Checking package.json...').start();

try {
  spinner.text = '📦 Checking dependencies...';
  const result = await checkPackageJson({ outputJson: jsonFlag });

  spinner.succeed('✅ Analysis complete');

  if (jsonFlag) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result);
  }

} catch (err) {
  spinner.fail(`❌ Error: ${err.message}`);
  process.exit(1);
}
