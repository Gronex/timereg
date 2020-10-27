import fs from 'fs/promises';
import parse5 from 'parse5';
import { getAttribute, predicates, queryAll, removeAttribute, setAttribute } from 'dom5';
import path from 'path';

/**
 * 
 * @param {string} id
 */
async function resolve(id) {
    if(!id.endsWith(".html")){
        return null;
    }
    const htmlString = await fs.readFile(id, { encoding: "utf8" });
    const html = parse5.parse(htmlString);
    const scripts = queryAll(html, predicates.AND(predicates.hasTagName('script'), predicates.hasAttr('import')));
    const links = queryAll(html, predicates.AND(predicates.hasTagName('link'), predicates.hasAttr('import')));
    
    const scriptDependencies = scripts.map(x => ({src:  getAttribute(x, 'src'), type: 'script'}));
    const linkDependencies = links.map(x => ({src:  getAttribute(x, 'href'), type: 'link'}));
    const dependencies = [...scriptDependencies, ...linkDependencies];
    console.log(dependencies);
    return dependencies;
}

async function replaceImports({fileContents, imports}, options, bundle) {
    /**
     * 
     * @param {Array<T>} array 
     * @param {(T) => boolean} predicate 
     */
    const firstOrDefault = (array, predicate) => {
        for(const item of array) {
            if(predicate(item)){
                return item;
            }
        }
    }

    const setAttributes = (nodes, imports, attribute) => {
        nodes.forEach(node => {
            const ref = getAttribute(node, attribute);
            const imported = firstOrDefault(imports, x => x.src === ref);
            if(imported) {
                setAttribute(node, attribute, `/${imported.fileName}`);
                removeAttribute(node, 'import');
            }
        });
    }

    const html = parse5.parse(fileContents);

    const scripts = queryAll(html, predicates.AND(predicates.hasTagName('script'), predicates.hasAttr('import')));
    setAttributes(scripts, imports, 'src');

    const links = queryAll(html, predicates.AND(predicates.hasTagName('link'), predicates.hasAttr('import')));
    setAttributes(links, imports, 'href');

    return parse5.serialize(html);
}

export default function() {
    const htmlImports = new Map();
    return {
        name: "html Entry",
        async resolveId(source, importer) {
            if (!importer && source.endsWith(".html")) {
                const resolution = await this.resolve(source, undefined, { skipSelf: true });
                if(!resolution) return null;
                const dependencies = await resolve(resolution.id);
                console.log("resolveId", source);
                for (const moduleId of this.getModuleIds()){
                    
                    console.log("resolveId", moduleId);
                }
                // dependencies.forEach(dependency => {
                //     if(dependency.type !== 'link'){
                //         dependency.id = this.emitFile({
                //             type: 'chunk',
                //             id: path.join(path.dirname(source), dependency.src)
                //         });
                //     }
                //     return dependency;
                // });
                htmlImports.set(resolution.id, dependencies);
                return resolution;
            }
            return null;
        },
        async load(id){
            if(htmlImports.has(id)) {
                console.log("load", id);
                console.log("load", htmlImports.get(id));
                const moduleExport = htmlImports.get(id)
                    .reduce((js, dep) => (js + `export * from '${dep.src}';\n`), "");
                console.log("load", moduleExport);
                return moduleExport;
            }
            return null;
        },
        async generateBundle(options, bundle) {
            if(!htmlImports.size){
                return;
            }

            for(const html of htmlImports){
                console.log("generateBundle", html[0]);
                const filePath = html[0];
                const file = path.parse(filePath);
                const fileContents = await fs.readFile(filePath, { encoding: "utf8" })
                //console.log("generateBundle", this.getFileName(html[1][0].id));

                const entries = Object.keys(bundle).filter(fileName => bundle[fileName].type === 'asset').map(fileName => bundle[fileName]) //filter(fileName => bundle[fileName].isEntry);
                console.log(entries);
                // for(var entry of entries){
                //     console.log("generateBundle", entry)
                //     console.log("generateBundle", bundle[entry])
                // }

                // await html[1].forEach(async x => {
                //     //x.fileName = this.getFileName(x.id);
                // });
                
                this.emitFile({
                    type: 'asset',
                    fileName: file.base,
                    source: 
                        await replaceImports({
                            fileContents, 
                            imports: html[1]
                        }, options, bundle)
                });
            }
        }
    }
}