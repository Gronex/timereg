import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import json from '@rollup/plugin-json';
//import html from '@open-wc/rollup-plugin-html';
import htmlEntry from './plugins/rollup-plugin-html-entry/index';
import copy from 'rollup-plugin-copy';

const outDir = './dist';
const prodMode = process.env.BUILD === 'production'
const fileName = `[${prodMode ? 'hash' : 'name'}].js`;
const assetName = `[${prodMode ? 'hash' : 'name'}][extname]`;

export default {
    //input: './src/index.tsx',
    input: './src/index.html',
    output: {
        dir: outDir,
        entryFileNames: fileName,
        chunkFileNames: fileName,
        assetFileNames: assetName,
        format: 'es',
    },
    plugins: [
        json(),
        postcss({
            extract: true,
            name: ['index.css']
        }),
        importMetaAssets(),
        typescript(),
        // copy({
        //     targets: [
        //         { src: './public/**/*', dest: outDir },
        //     ]
        // }),
        htmlEntry(),
        // html({
        //     minify: prodMode,
        //     inject: true,
        //     template({ html, bundle }) {
        //         // const replacerRegex = /\{(?<name>\S+)\}/;
        //         // let replacable = html.match(replacerRegex);
        //         // while(replacable){
        //         //     const name = replacable.groups['name'];
        //         //     html = bundle.bundle[name] ? html.replace(`{${name}}`, `/${bundle.bundle[name].fileName}`) : html.replace(`{${name}}`, '');
        //         //     replacable = html.match(replacerRegex);
        //         // }
                
        //         return bundle.entrypoints.reduce((html, entrypoint) => {
        //             return html.replace(
        //               '</body>',
        //               `<script type="module" src="${entrypoint.importPath.replace(/^\./, '')}"></script></body>`,
        //             );
        //         }, html);

        //     }
        // }),
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