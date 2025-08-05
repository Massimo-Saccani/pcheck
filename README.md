# package-json-check

A tool to check:  
- **Duplicate** packages between dependencies and devDependencies  
- **Unused** packages (present in package.json but never imported)  
- **Outdated** packages compared to npm  

## Installation
```bash
npm install -g package-json-check
```

## Usage
From CLI:
```bash
package-json-check
```
Or with JSON output (for CI/CD):
```bash
package-json-check --json
```

## As a library
```js
import { checkPackageJson } from "package-json-check";

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
