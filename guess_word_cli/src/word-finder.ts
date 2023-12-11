import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export enum Level {
    EASY,
    HARD
}

export class WordFinder {

    private _words: Array<string>;

    constructor(level = Level.EASY) {
        let jsonPath = path.join(__dirname, '..', 'svenska-ord-easy.json');

        if (level === Level.HARD) {
            jsonPath = path.join(__dirname, '..', 'svenska-ord.json');
        }

        this._words = this.loadFile(jsonPath);
    }


    findRandomWord(): string {
        let randomWord;

        do {
            const randomNum = Math.floor(Math.random() * this._words.length);
            randomWord = this._words.at(randomNum)?.toLowerCase();
        } while (!this.isValidWord(randomWord));

        return randomWord!;
    }

    private loadFile(path: string) {
        console.log(`Loading words file from [${path}]`);

        const data = fs.readFileSync(path, 'utf-8');
        const jsonData = JSON.parse(data);
        console.log(`Loaded [${jsonData.length}] words.....`);

        return jsonData;
    }

    private isValidWord(randomWord: string | undefined): boolean {
        return !!randomWord && randomWord.match(/[\s-]/) === null;
    }


}
