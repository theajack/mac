/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 11:08:00
 * @Description: Coding something
 */
import { buildSinglePkg } from './utils';

function main () {
    const pkgName = process.argv[2];

    if (!pkgName) {throw new Error('package name is Required');}
    const list = fs.readdirSync(resolve(__dirname, '../packages'));

    for (let i = 0; i < list.length; i++) {
        buildSinglePkg(list[i]);
    }
}

main();