/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts"/>

import {EventEmitter} from "events";
import * as Immutable from "immutable";
import AppDispatcher from "../dispatcher/AppDispatcher";
import {AppAction} from "../common";
import {GuessLetterAction, NewGameAction} from "../actions/AppActions";

export interface AppState
{
    word: string;
    correctGuesses: Immutable.Set<string>;
    incorrectGuesses: Immutable.Set<string>;
}

export class AppStateHelp
{
  constructor(private state: AppState) {}

  isCorrectGuess(letter: string): boolean {
    return this.state.correctGuesses.some(x => x === letter)
  }

  isIncorrectGuess(letter: string): boolean {
    return this.state.incorrectGuesses.some(x => x === letter)
  }

  get puzzle(): string[] {
    let letters: string[] = this.state.word.split('');

    let puzzle: string[] =
      letters.map(letter =>
        this.isCorrectGuess(letter) ? letter : null
      );

    return puzzle;
  }
}

class AppStore
{
  private _ee: EventEmitter = new EventEmitter;

  private _state: AppState = {
    word: '',
    correctGuesses: Immutable.Set<string>(),
    incorrectGuesses: Immutable.Set<string>()
  };

  get state(): AppState { return this._state; }

  constructor() {
    AppDispatcher.register((action: AppAction) => {

      if (action instanceof NewGameAction) {
        this.newGame(action.word);
      } else if (action instanceof GuessLetterAction) {
        this.guessLetter(action.letter);
      }
    });
  }

  newGame(word: string)
  {
    this._state = {
      word: word,
      correctGuesses: Immutable.Set<string>(),
      incorrectGuesses: Immutable.Set<string>()
    }

    this.raiseChangeEvent();
  }

  guessLetter(letter: string){
    let wordLetters: string[] = this.state.word.split('');
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

    if (isChanged) { this.raiseChangeEvent(); }
  }

  raiseChangeEvent()
  {
    this._ee.emit("change");
  }

  addChangeListener(callback: Function) {
    this._ee.on("change", callback);
  }

  removeChangeListener(callback: Function) {
    this._ee.removeListener("change", callback);
  }
}

export default new AppStore();
