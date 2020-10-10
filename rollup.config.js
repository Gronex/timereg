import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import json from '@rollup/plugin-json';
const html = require('@rollup/plugin-html');

export default {
    input: './src/index.tsx',
    output: {
        dir: './dist',
        format: 'iife'
    },
    plugins: [
        json(),
        postcss({
            extract: true,
        }),
        importMetaAssets(),
        typescript(),
        html({
            title: 'Timereg',
            meta: [
                {name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover'},
                {name: 'name', content: 'Quick timeregistration app. To help remember what you did.'}
            ]
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