/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 11:46:57
 * @Description: Coding something
 */
const { resolveRootPath, writeJsonIntoFile, resolvePackagePath, traverseDirectory, buildPackageName, isNodeExec } = require('./utils');
const rootPkg = require('../package.json');
const fs = require('fs');


function initPackageInfo (isDev, version = '') {


    if (version) {
        const path = resolveRootPath('package.json');
        const package = require(path);
        if (version[0] === 'v') version = version.substring(1);
        package.version = version;
        writeJsonIntoFile(package, path);
    } else {
        version = rootPkg.version;
    }

    traverseDirectory(resolveRootPath('packages'), (info) => {
        if (info.isDir) {
            initSinglePackageInfo(info.filename, version, isDev);
        }
    });

}

function initSinglePackageInfo (dir, version, isDev = false) {
    const packagePath = resolvePackagePath(`${dir}/package.json`);
    const package = require(packagePath);
    const packageName = buildPackageName(dir);

    package.version = version;
    if (isDev) {
        package.main = package.module =
            package.typings = package.types = 'src/index.ts';
    } else {
        package.main = package.module = `dist/${packageName}.esm.js`;
        package.typings = package.types = `dist/${packageName}.d.ts`;
        package.unpkg = package.jsdelivr = `dist/${packageName}.iife.min.js`;


        [ 'description', 'author', 'repository', 'license' ].forEach(name => {
            package[name] = rootPkg[name];
        });
        package.publishConfig = {
            registry: 'https://registry.npmjs.org/',
        };
        fs.copyFileSync(resolveRootPath('README.md'), resolvePackagePath(`${dir}/README.md`));
        fs.copyFileSync(resolveRootPath('LICENSE'), resolvePackagePath(`${dir}/LICENSE`));
        fs.copyFileSync(resolveRootPath('build/.npmignore'), resolvePackagePath(`${dir}/.npmignore`));
    }
    writeJsonIntoFile(package, packagePath);

    // const tsconfig = require(resolveRootPath('tsconfig.json'));
    // tsconfig.include = [ 'src/**/*' ];
    // tsconfig.compilerOptions.rootDir = '../..';
    // writeJsonIntoFile(tsconfig, resolvePackagePath(`${dir}/tsconfig.json`));
}

module.exports = {
    initPackageInfo
};

if (isNodeExec()) {
    initPackageInfo(process.argv[2] === 'dev');
}