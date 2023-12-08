import {readFileSync} from 'fs';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
        }
    ],
    external: [
        'util',
        'tty',
        'string_decoder',
        'fs',
        'http',
        'https',
        'path',
        'net',
        'async_hooks',
        'crypto',
        'stream',
        'zlib',
        ...Object.keys(pkg.devDependencies || {})
    ],
    plugins: [
        json(),
        resolve({preferBuiltins: true, exportConditions: ['node']}),
        commonjs(),
        typescript(),
    ],
};