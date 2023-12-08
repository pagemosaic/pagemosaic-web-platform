import {readFileSync} from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs'
        },
        {
            file: pkg.module,
            format: 'es'
        }
    ],
    external: Object.keys(pkg.devDependencies || {}),
    plugins: [
        resolve({ preferBuiltins: true, exportConditions: ['node'] }),
        replace({
            preventAssignment: true,
            values: {
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.STACK_NAME': JSON.stringify(process.env.STACK_NAME || '')
            }
        }),
        commonjs(),
        typescript()
    ],
};
