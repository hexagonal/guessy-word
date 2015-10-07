/// <reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import {AppAction} from "../common";
import AppDispatcher from "../dispatcher/AppDispatcher";

export class GuessLetterAction implements AppAction
{
  constructor(public letter: string) {}
}

export class NewGameAction implements AppAction
{
  constructor(public word: string) {}
}

class ActionCreator
{
  newGame() {
    let useNextWord = (words: string[]) => {
      let word: string = words.pop();
      writeLocalWords(words);
      AppDispatcher.dispatch(new NewGameAction(word));
    };

    let words: string[] = loadLocalWords();

    if (words.length !== 0) {
      useNextWord(words);
    } else {
      ajaxGetText(encodeURI('words.txt'))
        .then(wordList => wordList.split(/\r?\n/))
        .then(shuffle)
        .then(useNextWord)
        .catch(error => console.log("newGame error: " + error));
    }
  }

  guessLetter(letter: string) {
    AppDispatcher.dispatch(new GuessLetterAction(letter));
  }
} // end ActionCreator

function ajaxGetText(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open('GET', url);

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.send();
  });
}

function loadLocalWords(): string[] {
  let wordsJson: string = localStorage.getItem('words');
  return wordsJson ? JSON.parse(wordsJson) : [];
}

function writeLocalWords(words: string[]) {
  let wordsJson: string = JSON.stringify(words);
  localStorage.setItem('words', wordsJson);
}

// Shuffles an array
// Implementation taken from: stackoverflow.com/questions/962802
function shuffle<T>(arr: T[]): T[] {
    let top: number = arr.length;

    if(top) while(--top) {
      let current: number = Math.floor(Math.random() * (top + 1));
      let item: T = arr[current];
      arr[current] = arr[top];
      arr[top] = item;
    }

    return arr;
}

// Returns a random item from an array
function getRandomItem<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length)];
}

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default new ActionCreator;
