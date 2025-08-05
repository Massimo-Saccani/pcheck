# paudit

A tool to check:  
- **Duplicate** packages between dependencies and devDependencies  
- **Unused** packages (present in package.json but never imported)  
- **Outdated** packages compared to npm  

## Installation
```bash
npm install -g paudit
```

## Usage
From CLI (cd into your project folder first, where there is the package.json file):
```bash
paudit
```
Or with JSON output (for CI/CD):
```bash
paudit --json
```

## As a library
```js
import { checkPackageJson } from "paudit";

const result = await checkPackageJson({ outputJson: true });
console.log(result);
```

## CLI Output
```
⚠️  Duplicate packages:
  lodash

⬆️  Packages to update:
  express: ^4.17.0 → 4.18.2

🗑  Unused packages:
  moment
```

## License
MIT
