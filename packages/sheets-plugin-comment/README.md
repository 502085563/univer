# style-univer

English| [简体中文](./README-zh.md)

## Introduction

UniverSheet Plugin Comment

### Installation

```shell
npm i @univerjs/sheets-plugin-comment
```

### Usage

```js
import { Comment } from '@univerjs/sheets-plugin-comment';

const univerSheet = new UniverSheet();
univerSheet.installPlugin(new Comment());
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
# Current directory ./packages/sheets-plugin-comment/
npm run dev

# Or project root directory ./
pnpm run --filter  @univerjs/sheets-plugin-comment dev
```

### Package

```
# Current directory ./packages/sheets-plugin-comment/
npm run build

# Or root directory ./
pnpm run --filter  @univerjs/sheets-plugin-comment build
```
