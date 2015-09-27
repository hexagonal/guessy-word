/// <reference path="../../typings/react/react.d.ts"/>

import * as React from "react"
import AppStore from "../stores/AppStore";
import {AppState, AppStateHelp} from "../stores/AppStore";
import {GuessLetterAction} from "../actions/AppActions";

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
  }

  componentWillUnmount()
  {
    AppStore.removeChangeListener(this._onChange);
  }

  private _onChange = () => { this.setState(AppStore.state); }

  render() {
    return (
      <div>
      <Title title="Guessy Word" />
      <WordPanel state={this.state} />
      <AlphabetPanel state={this.state} />
      </div>
    );
  }
}

class WordPanel extends React.Component<AppStoreProps,{}>
{
  render() {
    let help = new AppStateHelp(this.props.state);

    return (
      <div className="word">{help.word}</div>
    );
  }
}

interface TitleProps
{
  title: string
}

class Title extends React.Component<TitleProps,{}>
{
  render() {
    return <div className="title">{this.props.title}</div>;
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
    let letterButtons =
      this.alphabet.map((letter) =>
      <LetterButton key={letter} letter={letter} state={this.props.state} />);
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
      <div className={className} onClick={this._onClick}>
        {this.props.letter}
      </div>
    );
  }

  private _onClick = () => { new GuessLetterAction(this.props.letter); }
}
