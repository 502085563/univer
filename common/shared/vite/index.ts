/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { InlineConfig } from 'vite';
import path from 'node:path';
import process from 'node:process';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import fs from 'fs-extra';
import { mergeConfig, build as viteBuild } from 'vite';
import dts from 'vite-plugin-dts';
import vitePluginExternal from 'vite-plugin-external';

import { autoDetectedExternalPlugin } from './auto-detected-external-plugin';

import { convertLibNameFromPackageName, obfuscator } from './utils';

interface IBuildExecuterOptions {
    pkg: Record<string, any>;
    entry: Record<string, string>;
    isPro: boolean;
}

async function buildESM(sharedConfig: InlineConfig, options: IBuildExecuterOptions) {
    const { entry, isPro } = options;

    return Promise.all(Object.keys(entry).map((key) => {
        const config: InlineConfig = mergeConfig(sharedConfig, {
            build: {
                emptyOutDir: false,
                outDir: 'lib',
                lib: {
                    entry: {
                        [key]: entry[key],
                    },
                    fileName: () => `es/${key}.js`,
                    formats: ['es'],
                },
                rollupOptions: {
                    output: {
                        inlineDynamicImports: true,
                    },
                },
            },
            plugins: [
                key === 'index'
                    ? dts({
                        entryRoot: 'src',
                        outDir: 'lib/types',
                        clearPureImport: false,
                        rollupTypes: isPro,
                    })
                    : null,
            ],
        });

        return viteBuild(config);
    }));
}

async function buildCJS(sharedConfig: InlineConfig, options: IBuildExecuterOptions) {
    const { entry } = options;

    return Promise.all(Object.keys(entry).map((key) => {
        const config: InlineConfig = mergeConfig(sharedConfig, {
            build: {
                emptyOutDir: false,
                outDir: 'lib',
                lib: {
                    entry: {
                        [key]: entry[key],
                    },
                    fileName: () => `cjs/${key}.js`,
                    formats: ['cjs'],
                },
            },
        });

        return viteBuild(config);
    }));
}

async function buildUMD(sharedConfig: InlineConfig, options: IBuildExecuterOptions) {
    const { pkg, entry } = options;

    return Promise.all(Object.keys(entry).map((key) => {
        const config: InlineConfig = mergeConfig(sharedConfig, {
            build: {
                emptyOutDir: false,
                outDir: 'lib',
                lib: {
                    entry: {
                        [key]: entry[key],
                    },
                    name: convertLibNameFromPackageName(pkg.name),
                    fileName: () => `umd/${key}.js`,
                    formats: ['umd'],
                },
            },
        });

        return viteBuild(config);
    }));
}

interface IBuildOptions {
    /**
     * Skip UMD build
     * @default false
     * @description If true, UMD build will be skipped. Useful for packages that run in Node.js environment.
     */
    skipUMD?: boolean;
}

export async function build(options?: IBuildOptions) {
    const { skipUMD = false } = options ?? {};

    const __dirname = process.cwd();

    const pkg = fs.readJsonSync(path.resolve(__dirname, 'package.json'));
    const isPro = pkg.name.startsWith('@univerjs-pro/');

    const entry: Record<string, string> = {
        index: path.resolve(__dirname, 'src/index.ts'),
    };
    const hasFacade = fs.existsSync(path.resolve(__dirname, 'src/facade/index.ts'));
    const hasLocales = fs.existsSync(path.resolve(__dirname, 'src/locale'));

    if (hasFacade) {
        entry.facade = path.resolve(__dirname, 'src/facade/index.ts');
    }
    if (hasLocales) {
        const locales = fs.readdirSync(path.resolve(__dirname, 'src/locale'));
        for (const file of locales) {
            if (fs.statSync(path.resolve(__dirname, 'src/locale', file)).isDirectory() || !file.includes('-')) {
                continue;
            }
            const localeValue = file.replace('.ts', '');
            entry[`locale/${localeValue}`] = path.resolve(__dirname, 'src/locale', file);
        }
    }

    const sharedConfig: InlineConfig = {
        configFile: false,
        build: {
            target: 'chrome70',
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.BUILD_TIMESTAMP': JSON.stringify(Math.floor(Date.now() / 1000)),
        },
        css: {
            modules: {
                localsConvention: 'camelCaseOnly',
                generateScopedName: 'univer-[local]',
            },
        },
        plugins: [
            react(),
            vue(),
            autoDetectedExternalPlugin(),
            vitePluginExternal({
                nodeBuiltins: true,
            }),
            isPro ? obfuscator() : null,
        ],
    };

    const buildExecuterOptions: IBuildExecuterOptions = {
        pkg,
        entry,
        isPro,
    };

    buildESM(sharedConfig, buildExecuterOptions);
    buildCJS(sharedConfig, buildExecuterOptions);
    !skipUMD && buildUMD(sharedConfig, buildExecuterOptions);
}