import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class WordFinder {

    private _words: Array<string>;

    constructor() {
        this._words = this.loadFile();
    }


    findRandomWord(): string {
        let randomWord;

        do {
            const randomNum = Math.floor(Math.random() * this._words.length);
            randomWord = this._words.at(randomNum);
        } while (!this.isValidWord(randomWord));

        return randomWord!;
    }

    private loadFile() {
        const jsonPath = path.join(__dirname, '..', 'svenska-ord.json');
        console.log(`Loading words file from [${jsonPath}]`);

        const data = fs.readFileSync(jsonPath, 'utf-8');
        const jsonData = JSON.parse(data);
        console.log(`Loaded [${jsonData.length}] words.....`);

        return jsonData;
    }

    private isValidWord(randomWord: string | undefined): boolean {
        return !!randomWord && randomWord.match(/[\s-]/) === null;
    }


}
