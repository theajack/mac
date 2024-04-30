/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-09 21:29:58
 * @Description: Coding something
 */
const { resolve } = require('path');
const { buildSinglePkg } = require('./utils');
const fs = require('fs');

function main () {
    const pkgName = process.argv[2];

    if (!pkgName) {throw new Error('package name is Required');}
    const list = fs.readdirSync(resolve(__dirname, '../packages'));
    if (!list.includes(pkgName)) {
        throw new Error(`package not exist [${pkgName}]`);
    } else {
        buildSinglePkg(pkgName);
    }
}

main();
