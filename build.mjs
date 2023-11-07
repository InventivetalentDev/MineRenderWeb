import * as esbuild from 'esbuild';
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import glob from "glob";

const replaceNodeBuiltIns = () => {
    const replace = {
        'path': import('path-browserify'),
        'fs': import('browserify-fs')
    }
    const filter = RegExp(`^(${Object.keys(replace).join("|")})$`);
    return {
        name: "replaceNodeBuiltIns",
        setup(build) {
            build.onResolve({ filter }, arg => ({
                path: replace[arg.path],
            }));
        },
    };
}

let files = await new Promise((resolve, reject) => {
    glob("./src/**/*.ts", (err, files_) => {
        resolve(files_);
    });
})
console.log(files);

await esbuild.build({
    platform: "browser",
    entryPoints: files,
    bundle: true,
    outdir: 'src',
     // external: ['canvas'],
    define: {
      'global': 'window',
    },
    outExtension:{
        '.js': '.bundle.js'
    },
    resolveExtensions: ['.tsc', '.ts', '.js'],
    loader: {
        ".node": "file"
    },
    plugins: [polyfillNode()],
});
setTimeout(() => process.exit(0), 100);