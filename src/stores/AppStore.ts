/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts"/>

import {EventEmitter} from "events";
import AppDispatcher from "../dispatcher/AppDispatcher";
import {GuessLetterAction} from "../actions/AppActions";
import {AppAction} from "../common";
import * as Immutable from "immutable";

export interface AppState
{
		wordLetters: Immutable.List<string>;
		correctGuesses: Immutable.Set<string>;
		incorrectGuesses: Immutable.Set<string>;
}

export class AppStateHelp
{
	constructor(private state: AppState) {}

	get word(): string { return this.state.wordLetters.join('');	}

	isCorrectGuess(letter: string): boolean {
		return this.state.correctGuesses.some((x) => x === letter)
	}

	isIncorrectGuess(letter: string): boolean {
		return this.state.incorrectGuesses.some((x) => x === letter)
	}
}

class AppStore
{
  private _ee: EventEmitter = new EventEmitter;

	private _state: AppState = {
		wordLetters: Immutable.List<string>('nostril'.split('')),
		correctGuesses: Immutable.Set<string>(),
		incorrectGuesses: Immutable.Set<string>()
	};

  get state(): AppState { return this._state; }

  constructor() {
    AppDispatcher.register((action: AppAction) => {

      if (action instanceof GuessLetterAction) {
				let letter = action.letter;
				let wordLetters = this.state.wordLetters;
				let correctGuesses = this.state.correctGuesses;
				let incorrectGuesses = this.state.incorrectGuesses;

				let isCorrectGuess: boolean = wordLetters.some((x) => x === letter);

				if(isCorrectGuess) {
					this.state.correctGuesses = correctGuesses.add(letter);
				} else {
					this.state.incorrectGuesses = incorrectGuesses.add(letter);
				}

				let isChanged: boolean =
					this.state.correctGuesses !== correctGuesses ||
					this.state.incorrectGuesses !== incorrectGuesses;

				if (isChanged) { this._ee.emit("change"); };
      }
    });
  }

	addChangeListener(callback: Function) {
		this._ee.on("change", callback);
	}

	removeChangeListener(callback: Function) {
		this._ee.removeListener("change", callback);
	}
}

export default new AppStore();
