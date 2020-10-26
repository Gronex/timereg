import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import json from '@rollup/plugin-json';
import html from '@open-wc/rollup-plugin-html';
import copy from 'rollup-plugin-copy';

const outDir = './dist';

export default {
    //input: './src/index.tsx',
    input: './src/index.html',
    output: {
        dir: outDir
    },
    plugins: [
        json(),
        postcss({
            extract: true,
        }),
        importMetaAssets(),
        typescript(),
        copy({
            targets: [
                { src: './public/**/*', dest: outDir },
            ]
        }),
        html({
            inject: true,
            minify: process.env.BUILD === 'production'
        }),
        resolve(),
        commonjs(),
        // If you don't patch this the "process" symbol required by react will
        // not be defined. All you need to do here is set that string to either 
        // 'development' or 'production' depending on which kind of build you
        // are making.
        replace({
            'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV )
        }),
    ]
}