/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 14:19:32
 * @Description: Coding something
 */
const { execSync } = require('child_process');
const { resolveRootPath, traverseDirectory, isNodeExec, log } = require('./utils');
const { initPackageInfo } = require('./init-package-info');

function publish () {

    initPackageInfo(false);

    traverseDirectory(resolveRootPath('packages'), (info) => {
        if (info.isDir) {
            log.blue(`Publish ${info.filename}`);
            execSync(`cd ${info.filePath} && npm publish`);
        }
    });
    log.green('Done');


    initPackageInfo(true);
}

module.exports = {
    publish
};

if (isNodeExec()) {
    publish();
}