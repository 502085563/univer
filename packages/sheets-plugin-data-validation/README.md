# style-univer

English| [简体中文](./README-zh.md)

## Introduction

UniverSheet Plugin DataValidation

### Installation

```shell
npm i @univerjs/sheets-plugin-data-validation
```

### Usage

```js
import { DataValidation } from '@univerjs/sheets-plugin-data-validation';

const univerSheet = new UniverSheet();
univerSheet.installPlugin(new DataValidation());
```

## Local development

### Requirements

-   [Node.js](https://nodejs.org/en/) Version >= 10
-   [npm](https://www.npmjs.com/) Version >= 6

### Installation

```
pnpm install
```

### Development

```
# Current directory ./packages/sheets-plugin-data-validation/
npm run dev

# Or project root directory ./
pnpm run --filter  @univerjs/sheets-plugin-data-validation dev
```

### Package

```
# Current directory ./packages/sheets-plugin-data-validation/
npm run build

# Or root directory ./
pnpm run --filter  @univerjs/sheets-plugin-data-validation build
```
