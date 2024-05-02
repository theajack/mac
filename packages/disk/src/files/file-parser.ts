/*
 * @Author: tackchen
 * @Date: 2022-10-01 23:06:03
 * @Description: 文件内容解析器
 */
import type { BaseParser } from './parser/base-parser';
import { BinaryParser } from './parser/binary-parser';
import { JsonParser } from './parser/json-parser';
import { TextParser } from './parser/text-parser';


export class FileParser {

    parsers: BaseParser<any>[] = [];

    private binaryParser: BinaryParser;
    private textParser: TextParser;

    static instance: FileParser;

    constructor () {
        if (FileParser.instance) return FileParser.instance;
        this.binaryParser = new BinaryParser();
        this.textParser = new TextParser();
        this.parsers = [
            new JsonParser(),
            this.textParser,
            this.binaryParser,
        ];
        FileParser.instance = this;
    }

    addParser (Parser: any) {
        this.parsers.unshift(new Parser());
    }

    async read<T extends any = any> (data: Uint8Array, filename: string, type = ''): Promise<T> {
        const parser = this.parsers.find(item => {
            item.matcher(type, filename);
        }) || this.binaryParser;
        return parser.readParse(data);
    }
    async readText (data: Uint8Array): Promise<string> {
        return this.textParser.readParse(data);
    }


    async write<T extends any = any> (data: T, filename: string, type = ''): Promise<Uint8Array> {
        const parser = this.parsers.find(item => {
            item.matcher(type, filename);
        }) || this.binaryParser;

        return parser.writeParse(data);
    }
    async writeText (content: string): Promise<Uint8Array> {
        return this.textParser.writeParse(content);
    }
}

export const fileParser = new FileParser();