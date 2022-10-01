/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:06:03
 * @Description: 文件内容解析器
 */
import { File } from './file';
import { BaseParser } from './parser/base-parser';
import { JsonParser } from './parser/json-parser';
import { TextParser } from './parser/text-parser';


// ! 类型体操 取 json键值的type
const SuffixTypeMap = {
    'txt': 'text',
    'json': 'json',
    // todo
} as const;

type TSuffixTypeMap = typeof SuffixTypeMap;

export type TSuffixType = keyof TSuffixTypeMap;

export type TFileType = TSuffixTypeMap[TSuffixType];

const ParserMap: {
    [prop in TFileType]: typeof BaseParser;
} & {
    'unknown': typeof TextParser;
} = {
    'json': JsonParser,
    'text': TextParser,
    'unknown': TextParser,
};

export class FilePaser {
    file: File;

    parser: BaseParser;

    fileType: TFileType | 'unknown' = 'unknown';
    suffix: TSuffixType | string = '';

    constructor (file: File) {
        this.file = file;
        this.geneSuffix();
        this.parser = new ParserMap[this.fileType]();
    }

    parse () {
        return this.parser.parse(this.file.content);
    }

    private geneSuffix () {
        const { name, mimetype } = this.file;
        const index = name.lastIndexOf('.');
        if (index !== -1) {
            this.suffix = name.substring(index + 1);
            this.fileType = SuffixTypeMap[this.suffix as TSuffixType] || '';
        } else {
            if (mimetype === 'text/plain') {
                this.fileType = 'text';
            }// todo 其它类型
        }
    }
}