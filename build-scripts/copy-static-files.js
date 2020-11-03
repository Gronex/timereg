const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, "..");
const targetDir = path.join(baseDir, 'dist');


const assets = [
    "_redirects",
    "src/sw.js"
];

assets.forEach(async asset => {
    const src = path.join(baseDir, asset);
    const file = path.parse(src);
    const targetPath = path.join(targetDir, file.base);

    fs.copyFile(src, targetPath, (err) => {
        if(err){
            console.error(`Unable to copy file from ${src} to ${targetPath}`, err);
        } else {
            console.log(`Copied file from ${src} to ${targetPath}`)
        }
    });
});