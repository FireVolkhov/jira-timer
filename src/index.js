import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

const body = document.getElementsByTagName("body");
let target = document.createElement("div");

body[0].appendChild(target);

ReactDOM.render(<App/>, target);
