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
      saveWords(words);
      AppDispatcher.dispatch(new NewGameAction(word));
    };

    let words: string[] = loadWords();

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

function loadWords(): string[] {
  let words: string[] = readFromLocalStorage('words');
  return (words !== null) ? words : [];
}

function saveWords(words: string[]) {
  writeToLocalStorage('words', words);
}

function readFromLocalStorage(key: string): any {
  let json: string = localStorage.getItem(key);
  return json ? JSON.parse(json) : null;
}

function writeToLocalStorage(key: string, value: any) {
  let json: string = JSON.stringify(value);
  localStorage.setItem(key, json);
}

// A pure shuffle: returns a shuffled copy of an array
function shuffle<T>(arr: T[]): T[] {
	let arr2: T[] = arr.slice(); // i.e. copy
	impureShuffle(arr2);
	return arr2;
}

// An efficient but impure shuffle: shuffles an array
// Implementation taken from: stackoverflow.com/questions/962802
function impureShuffle<T>(arr: T[]): void {
    let top: number = arr.length;

    if(top) while(--top) {
      let current: number = Math.floor(Math.random() * (top + 1));
      let item: T = arr[current];
      arr[current] = arr[top];
      arr[top] = item;
    }
}

export default new ActionCreator;
