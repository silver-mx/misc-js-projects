#! /usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { Level, WordFinder } from './word-finder.js';

const sleep = (ms = 1000) => new Promise(callback => setTimeout(callback, ms));

async function welcome() {
  console.clear();
  console.log(`\n\n${chalk.bgBlue('HOW TO PLAY')}\n`);
  const rainbowTitle = chalkAnimation.neon(
    chalk.greenBright('Guess the secret word!!!') +
    ' otherwise you ' +
    chalk.redBright('lose') +
    '\n'
  );

  await sleep();
  rainbowTitle.stop();
}

async function askChar(
  wordToGuess: string,
  guessedChars: Array<string>,
  intents: number
): Promise<string> {
  const answer = await inquirer.prompt({
    name: 'char',
    type: 'input',
    message: 'Guess a character in the word',
    default() {
      const wordLength = wordToGuess.length;
      return (
        wordToGuess
          .split('')
          .map(c => (guessedChars.includes(c) ? `${c} ` : '_ '))
          .reduce((a, b) => a + b)
        + `[${wordLength} chars, ${intents} intents left]`
      );
    },
  });

  return answer.char;
}

async function playAgain(): Promise<boolean> {
  const answer = await inquirer.prompt({
    name: 'playAgain',
    type: 'input',
    message: 'Do you want to play again?',
    default() {
      return 'y/n';
    },
  });

  return ['y', 'Y'].includes(answer.playAgain);
}

function isGuessComplete(wordToGuess: string, guessedChars: string[]): boolean {
  const charSet = new Set(wordToGuess.split(''));
  return (
    Array.from(charSet).filter(c => !guessedChars.includes(c)).length === 0
  );
}

async function showResult(intents: number, wordToGuess: string) {
  let msg = chalkAnimation.neon(
    '\n' + chalk.bgGreenBright('You WON!!!') + '\n'
  );

  if (intents === 0) {
    msg = chalkAnimation.neon(
      '\n' +
      chalk.bgRedBright('You lOST!!!') +
      chalk.bgYellowBright(' ===> ') +
      chalk.bgGreenBright(`Word: ${wordToGuess}`) +
      '\n'
    );
  }

  await sleep();
  msg.stop();
}

function getInitialGuessedChars(level: Level, wordToGuess: string): Array<string> {
  if (level === Level.EASY) {
    return (wordToGuess.length <= 5 ? ['', ''] : ['', '', ''])
      .map(() => Math.floor(Math.random() * (wordToGuess.length - 1)))
      .map(randomVal => wordToGuess.at(randomVal)!);
  }

  return [];
}

const level = process.env.LEVEL === '1' ? Level.HARD : Level.EASY;
const wordFinder = new WordFinder(level);
let again = false;

do {
  await welcome();
  const wordToGuess = wordFinder.findRandomWord();
  const guessedChars: Array<string> = getInitialGuessedChars(level, wordToGuess);
  let intents = wordToGuess.length * 2;

  while (!isGuessComplete(wordToGuess, guessedChars) && --intents) {
    const chars = await askChar(wordToGuess, guessedChars, intents);
    chars.split('').forEach(c => guessedChars.push(c));
  }

  await showResult(intents, wordToGuess);
  again = await playAgain();
} while (again);
