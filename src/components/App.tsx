/// <reference path="../../typings/react/react.d.ts"/>

import * as React from "react"
import AppStore from "../stores/AppStore";
import {AppState, AppStateHelp} from "../stores/AppStore";
import ActionCreator from "../actions/AppActions";

interface AppStoreProps
{
  state: AppState
}

export class App extends React.Component<{},AppState>
{

  constructor () {
    super();
    this.state = AppStore.state;
  }

  componentDidMount()
  {
    AppStore.addChangeListener(this._onChange);
    ActionCreator.newGame();
  }

  componentWillUnmount()
  {
    AppStore.removeChangeListener(this._onChange);
  }

  private _onChange = () => { this.setState(AppStore.state); }

  render() {
    return (
      <div>
      <header>
        <Title title="Guessy Word" />
      </header>
      <main>
        <Puzzle state={this.state} />
        <AlphabetPanel state={this.state} />
      </main>
      <footer>
        <NewGameButton />
      </footer>
      </div>
    );
  }
}

interface TitleProps
{
  title: string
}

class Title extends React.Component<TitleProps,{}>
{
  render() { return <h1 className="title">{this.props.title}</h1>; }
}

class Puzzle extends React.Component<AppStoreProps,{}>
{
  render() {
    let help = new AppStateHelp(this.props.state);
    let puzzle: string[] = help.puzzle;
    let puzzleLetters: JSX.Element[] =
      puzzle.map((letter, i) =>
        <PuzzleLetter key={i} letter={letter} />
      );

    return <div className="puzzle">{puzzleLetters}</div>;
  }
}

interface PuzzleLetterProps extends React.Props<{}>
{
  letter: string
}

class PuzzleLetter extends React.Component<PuzzleLetterProps,{}>
{
  render() {
    let letter: string = this.props.letter;
    let classes: string[] = [];
    classes.push("letter");

    if (letter) { classes.push("revealed"); }
    let className: string = classes.join(" ");

    return (
      <div className={className}>
        {letter ? letter : "_"}
      </div>
    );
  }
}

class AlphabetPanel extends React.Component<AppStoreProps,{}>
{
  alphabet: string[]; // The characters from A to Z

  constructor() {
    super();
    this.alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
  }

  render() {
    let letterButtons: JSX.Element[] =
      this.alphabet.map((letter, i) =>
        <LetterButton key={i} letter={letter} state={this.props.state} />
      );

    return <div className="alphabetPanel">{letterButtons}</div>;
  }
}

interface LetterButtonProps extends React.Props<{}>
{
  state: AppState,
  letter: string
}

class LetterButton extends React.Component<LetterButtonProps,{}>
{
  render() {
    let help = new AppStateHelp(this.props.state);
    let classes: string[] = [];
    classes.push("letterButton");

    if (help.isCorrectGuess(this.props.letter)) {
      classes.push("correct");
    } else if (help.isIncorrectGuess(this.props.letter)) {
      classes.push("incorrect");
    }

    let className: string = classes.join(" ");

    return (
      <button className={className} onClick={this._onClick}>
        {this.props.letter}
      </button>
    );
  }

  private _onClick = () => { ActionCreator.guessLetter(this.props.letter); }
}

class NewGameButton extends React.Component<{},{}>
{
  render() {
    return (
      <button className="newGame" onClick={this._onClick}>+</button>
    );
  }

  private _onClick = () => { ActionCreator.newGame(); }
}
