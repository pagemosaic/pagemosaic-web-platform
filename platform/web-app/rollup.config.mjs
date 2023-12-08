import {readFileSync} from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
    input: 'adapter/index.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs'
        }
    ],
    external: Object.keys(pkg.devDependencies || {}),
    plugins: [
        resolve({ preferBuiltins: true, exportConditions: ['node'] }),
        commonjs(),
        terser()
    ],
};
