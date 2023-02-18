# style-univer

English| [简体中文](./README-zh.md)

## Introduction

UniverSheet Plugin Collaboration

### Installation

```shell
npm i @univerjs/common-plugin-collaboration
```

### Usage

```js
import { Collaboration } from '@univerjs/common-plugin-collaboration';

const univerSheet = new UniverSheet();
univerSheet.installPlugin(new Collaboration());
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
# Current directory ./packages/common-plugin-collaboration/
npm run dev

# Or project root directory ./
pnpm run --filter  @univerjs/common-plugin-collaboration dev
```

### Package

```
# Current directory ./packages/common-plugin-collaboration/
npm run build

# Or root directory ./
pnpm run --filter  @univerjs/common-plugin-collaboration build
```
