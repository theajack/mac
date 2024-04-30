const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
// const path = require('path');
const log = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _log (color, s) {
        console.log(`${color}%s\x1b[0m`, s);
    },
    red (s) { this._log('\x1b[31m', s); },
    green (s) { this._log('\x1b[32m', s); },
    yellow (s) { this._log('\x1b[33m', s); },
    blue (s) { this._log('\x1b[34m', s); },
    purple (s) { this._log('\x1b[35m', s); },
    cyan (s) { this._log('\x1b[36m', s); },
};

function upcaseFirstLetter (str) {
    return str.split('-').map(s => s[0].toUpperCase() + s.substring(1)).join('');
}

function buildCommon ({
    titleName,
    bundleCmd,
    dtsCmd,
    addon = '',
}) {
    log.blue(`Start Build ${titleName}`);
    let result = execSync(bundleCmd);
    log.blue(`Build ${addon}${titleName} Bundle Done:`);
    log.green(`${result.toString()}`);
    if (dtsCmd) {
        result = execSync(dtsCmd);
        log.blue(`Build ${addon}${titleName} DTS Done:`);
    }
    log.green(`${result.toString()}`);
}

function buildSinglePkg (pkgName) {
    buildCommon({
        titleName: pkgName,
        bundleCmd: `npx vite build -m=lib_${pkgName}`,
        // ! 暂时关掉dts
        // dtsCmd: `npx dts-bundle-generator -o packages/${pkgName}/dist/index.d.ts packages/${pkgName}/src/index.ts`,
    });
}

function resolveRootPath (str) {
    return path.resolve(__dirname, `../${str}`);
}
function resolveRelativePath (dirname, str) {
    return path.resolve(dirname, `./${str}`);
}
function resolvePackagePath (str) {
    return path.resolve(__dirname, `../packages/${str}`);
}

function writeJsonIntoFile (json, filePath) {
    fs.writeFileSync(checkPath(filePath), JSON.stringify(json, null, 4), 'utf-8');
}

function writeStringIntoFile (str, filePath) {
    fs.writeFileSync(checkPath(filePath), str, 'utf-8');
}

function copyFile ({
    src,
    dest = src,
    handler = null,
    json = false,
}) {
    src = checkPath(src);
    dest = checkPath(dest);

    if (handler) {
        let content = json
            ? require(checkPath(src))
            : readFile(src);
        content = handler(content);
        json
            ? writeJsonIntoFile(content, dest)
            : writeStringIntoFile(content, dest);
    } else {
        fs.copyFileSync(src, dest);
    }
}

function checkPath (filePath) {
    if (filePath[0] === '@') { return resolveRootPath(filePath.substring(1)); }
    if (filePath[0] === '#') { return resolvePackagePath(filePath.substring(1)); }
    return filePath;
}

function mkdir (filePath) {
    filePath = checkPath(filePath);
    if (!fs.existsSync(filePath)) {
        console.log('mkdirSync', filePath);
        fs.mkdirSync(filePath);
    }
}

function clearDirectory (dirPath) {
    dirPath = checkPath(dirPath);
    if (!fs.existsSync(dirPath)) {return;}
    clearDirectoryBase(dirPath);
}

function clearDirectoryBase (dirPath) {
    traverseDirectory(dirPath, ({ isDir, filepath }) => {
        if (isDir) {
            clearDirectoryBase(filepath);
            fs.rmdirSync(filepath);
        } else {
            fs.unlinkSync(filepath);
        }
    });
}

function traverseDirectory (dirPath, callback) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        const filePath = `${dirPath}/${file}`;
        const stat = fs.statSync(filePath);
        callback({
            isDir: stat.isDirectory(),
            filename: file,
            filePath,
        });
    });
}

function buildPackageJson (extract = {}) {
    const pkg = require(resolveRootPath('package.json'));

    const attrs = [
        'name', 'version', 'description', 'main', 'unpkg', 'jsdelivr', 'typings',
        'repository', 'keywords', 'author', 'license', 'bugs', 'homepage',
        'dependencies',
    ];

    const npmPkg = {};

    attrs.forEach(key => {
        npmPkg[key] = pkg[key] || '';
    });

    for (const key in extract) {
        npmPkg[key] = extract[key];
    }

    mkdir('@npm');
    writeJsonIntoFile(npmPkg, '@npm/package.json');
}

async function exec (cmd) {
    return new Promise((resolve) => {
        if (cmd instanceof Array) {
            cmd = cmd.join(' ');
        }
        childProcess.exec(cmd, (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
            if (error) {
                resolve({ success: false, stdout, stderr });
            } else {
                resolve({
                    success: true,
                    stdout,
                    stderr,
                });
            }
        }).stdout.on('data', data => {
            if (typeof data === 'string' && data.indexOf('sl:') === 0) {
                console.log(data.replace('sl:', ''));
            } else {
                console.log(data);
            }
        });
    });
}
function readFile (file) {
    return fs.readFileSync(checkPath(file), 'utf8');
}
function writeFile (file, txt) {
    fs.writeFileSync(checkPath(file), txt, 'utf8');
}

function execBin (name, cmd = name) {
    const npmPath = checkPath(`@node_modules/${name}`);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pkg = require(`${npmPath}/package.json`);

    if (!pkg.bin || !pkg.bin[cmd]) {
        throw new Error(`Wrong cmd: ${name} ${cmd}`);
    }

    const binPath = path.resolve(npmPath, pkg.bin[cmd]);

    return `node ${binPath}`;
}

function buildPackageName (dirName) {
    return `vm-${dirName}`; // todo 修改包命名规则
}

function isNodeExec () {
    return (process.argv[process.argv.length - 1] === 'EXEC');
}

module.exports = {
    execBin,
    exec,
    copyFile,
    resolveRootPath,
    resolveRelativePath,
    checkPath,
    upcaseFirstLetter,
    writeJsonIntoFile,
    writeStringIntoFile,
    resolvePackagePath,
    buildPackageJson,
    clearDirectory,
    traverseDirectory,
    mkdir,
    readFile,
    writeFile,
    log,
    buildSinglePkg,
    buildPackageName,
    isNodeExec,
};
