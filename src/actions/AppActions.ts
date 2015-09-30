import {AppAction} from "../common";
import AppDispatcher from "../dispatcher/AppDispatcher";

export class GuessLetterAction implements AppAction
{
	constructor(public letter: string) {}
}

export class LoadNextPuzzleAction implements AppAction
{
	constructor(public word: string) {}
}

class ActionCreator
{
	loadNextPuzzle() {
		console.log('Load next puzzle...');

		let xhr = new XMLHttpRequest();
		xhr.open('GET', encodeURI('words.txt'));

		xhr.onload = () => {
			if (xhr.status === 200) {
				let word = xhr.responseText.substr(0, 6);
				AppDispatcher.dispatch(new LoadNextPuzzleAction(word));
			} else {
				console.log('Puzzle file not found.')
			}
		};

		xhr.send();
	}

	guessLetter(letter: string) {
		AppDispatcher.dispatch(new GuessLetterAction(letter));
	}
}

export default new ActionCreator;
