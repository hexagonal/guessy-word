/// <reference path="../../typings/flux/flux.d.ts"/>

import {Dispatcher} from "flux";
import {AppAction} from "../common";

export default new Dispatcher<AppAction>();
