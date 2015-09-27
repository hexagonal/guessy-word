import {AppAction} from "../common";
import AppDispatcher from "../dispatcher/AppDispatcher";

export class GuessLetterAction implements AppAction
{
	constructor(public letter: string) {
    AppDispatcher.dispatch(this);
  }
}
