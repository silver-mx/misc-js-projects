#! /usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient, { rainbow } from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

let playerName;

const sleep = (ms = 2000) => new Promise(callback => setTimeout(callback, ms));

async function welcome() {
    const rainbowTitle = chalkAnimation.glitch(chalk.greenBright('Guess the secret word!!!') + ' otherwise you ' + chalk.redBright('lose'));

    await sleep();
    rainbowTitle.stop;

    console.log(`
    ${chalk.bgBlue('HOW TO PLAY')}
    Adivina todas las letras de la palabra secreta, sino ${chalk.bgRed('pierdes')}
    `
    );
}

welcome();


