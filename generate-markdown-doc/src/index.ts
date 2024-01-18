#!/usr/bin/env node

import {exec, execSync} from 'child_process';
import * as os from 'node:os';
import path from 'path';
import fs from 'node:fs';

const targetRepo = process.argv[2];
const repoBasename = path.basename(targetRepo);
const clonedRepoTmpDir = `${os.tmpdir()}/${repoBasename}`;

// Be sure the repository does not exist
fs.rmSync(clonedRepoTmpDir, {recursive: true, force: true});

console.log(`Target repository: ${targetRepo}`);

execSync(`git clone ${targetRepo} ${clonedRepoTmpDir}`);

const fileLst = fs.readdirSync(clonedRepoTmpDir, {recursive: true});
const questionFiles = fileLst
  .filter(f => {
    const filename = path.basename(f.toString());
    return filename.startsWith('Q') && filename.endsWith('.txt');
  })
  .map(f => f.toString());

const questionMap = new Map<string, string[]>();
const answerMap = new Map<string, string[]>();

questionFiles.forEach(filePath => {
  const filename = path.basename(filePath);
  const title = buildTitle(filePath, filename);
  const absolutePath = path.join(clonedRepoTmpDir, filePath);

  console.log(`Processing file: ${absolutePath}`);

  if (filename.includes('-Explanation')) {
    const answerNum = filename.split('-')[0];
    const answer = fs.readFileSync(absolutePath, 'utf-8');
    const answerLst =
      answerMap.get(title) ?? answerMap.set(title, []).get(title);
    answerLst!.push(`**${answerNum}.** ${answer}\n\n`);
  } else {
    const questionNum = filename.split('.')[0];
    const question = fs.readFileSync(absolutePath, 'utf-8');
    const questionLst =
      questionMap.get(title) ?? questionMap.set(title, []).get(title);
    questionLst!.push(`**${questionNum}.** ${question}\n\n`);
  }
});

const markdownOutputDir = './markdownOutput';

if (!fs.existsSync(markdownOutputDir)) {
  fs.mkdirSync(markdownOutputDir);
}
createMarkdownFile(
  markdownOutputDir,
  `${repoBasename}-questions.md`,
  questionMap
);
createMarkdownFile(markdownOutputDir, `${repoBasename}-answers.md`, answerMap);

// Clean up the folder
fs.rmSync(clonedRepoTmpDir, {recursive: true, force: true});

function createMarkdownFile(
  dir: string,
  filename: string,
  dataMap: Map<string, string[]>
): void {
  fs.rmSync(filename, {force: true});

  const output = fs.createWriteStream(path.join(dir, filename));
  output.write(
    filename.includes('questions')
      ? `#QUESTIONS - ${filename}\n`
      : `#ANSWERS - ${filename}\n`
  );

  dataMap.forEach((valueLst, title) => {
    output.write(title);
    valueLst.forEach(value => output.write(value));
  });

  console.log(`The file: ${filename} has been created...`);

  output.end();
}

function buildTitle(filePath: string, filename: string): string {
  const lst = filePath.replace(filename, '').split('/');
  let markdownLevel = 2;
  let title = '';
  lst.forEach(value => (title += '#'.repeat(markdownLevel++) + value + '\n'));

  return title;
}
