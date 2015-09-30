/// <reference path="../typings/react/react.d.ts"/>

import * as React from "react";
import AppStore from "./stores/AppStore";
import {App} from "./components/App";

React.render(<App />, document.getElementById('main'));
