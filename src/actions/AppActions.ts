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
		let wordsJson: string = localStorage.getItem('words');
		let words: string [] = wordsJson ?	JSON.parse(wordsJson) : [];

		if (words.length !== 0){
			console.log('Local storage found.');
		} else {
			console.log('Local storage not found. Downloading puzzle file...');

			// Download word list and then retry
			let xhr = new XMLHttpRequest();
			xhr.open('GET', encodeURI('words.txt'));

			xhr.onload = () => {
				if (xhr.status === 200) {
					let unshuffledWords: string[] = xhr.responseText.split(/\r?\n/);
					let words: string[] = shuffle(unshuffledWords);
					writeLocalWords(words);
					this.newGame();
				} else {
					console.log('Puzzle file not found.')
				}
			};

			xhr.send();
			return;
		}

		let word: string = words.pop();
		writeLocalWords(words);

		AppDispatcher.dispatch(new NewGameAction(word));
	}

	guessLetter(letter: string) {
		AppDispatcher.dispatch(new GuessLetterAction(letter));
	}
} // end ActionCreator

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
