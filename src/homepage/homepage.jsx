import React from "react";

import { Controlled as CodeMirror } from "react-codemirror2";

import "../../node_modules/codemirror/lib/codemirror";
import "../../node_modules/codemirror/mode/javascript/javascript";

import "../../node_modules/codemirror/addon/edit/closebrackets";
import "../../node_modules/codemirror/addon/selection/active-line";
import "../../node_modules/codemirror/addon/lint/lint";
import "../../node_modules/codemirror/addon/lint/javascript-lint";

import { JSHINT } from "jshint";

import { PopupWelcome, PopupAlert } from "../components/popup/popup.component";

import checkFormat from "../functions/check-format";
import parsedCode from "../functions/parsed-code";
import unsortedCode from "../functions/unsorted-code";
import sortFunction from "../functions/sort-function";
import sortCallStack from "../functions/sort-call-stack";
import callStackParser from "../functions/call-stack-parser";
import unhighlightAllText from "../functions/unhighlight-all-text";

import "./homepage.styles.scss";

import "../../node_modules/codemirror/lib/codemirror.css";
import "../../node_modules/codemirror/theme/dracula.css";
import "../../node_modules/codemirror/addon/lint/lint.css";

window.JSHINT = JSHINT;

class HomePage extends React.Component {
  constructor() {
    super();

    this.editor = React.createRef();
    this.callStackPlayground = React.createRef();
    this.webApiPlayground = React.createRef();
    this.callbackQueuePlayground = React.createRef();
    this.dropdownSpeed = React.createRef();
    this.dropdownExample = React.createRef();

    this.state = {
      popupWelcome: true,
      popupAlert: false,
      value: "",
      unsortedCallStack: [],
      unsortedFunction: [],
      isCallStack: [],
      isFunction: [],
      isWebApi: [],
      isCallbackQueue: [],
      speed: "Fast",
      example: 1,
      isSpeedOpen: false,
      isExampleOpen: false,
    };
  }

  componentDidMount() {
    const markup1 = `function three() {
  console.log("three");

  setTimeout(function () {
    console.log("last");
  }, 1000);
}

function two() {
  console.log("two");
  three();
}

function one() {
  console.log("one");
  two();
}

one();`;

    this.setState({ value: markup1 });
  }

  clearState = () => {
    // REF VARIABLES
    const editor = this.editor.current.editor;
    let callStackPlayground = this.callStackPlayground.current;
    let webApiPlayground = this.webApiPlayground.current;
    let callbackQueuePlayground = this.callbackQueuePlayground.current;

    this.setState({
      unsortedCallStack: [],
      unsortedFunction: [],
      isCallStack: [],
      isFunction: [],
      isWebApi: [],
      isCallbackQueue: [],
    });

    callStackPlayground.innerHTML = "";
    webApiPlayground.innerHTML = "";
    callbackQueuePlayground.innerHTML = "";

    // UNHIGHLIGHTING ALL TEXT
    unhighlightAllText(editor.doc.size, editor);

    // CLEAR ALL SETTIMEOUT
    var id = window.setTimeout(function () {}, 0);

    while (id--) {
      window.clearTimeout(id);
    }
  };

  onClick = () => {
    // STATE VARIABLES
    let {
      value,
      unsortedCallStack,
      unsortedFunction,
      isCallStack,
      isFunction,
      isWebApi,
      isCallbackQueue,
      speed,
    } = this.state;

    // REF VARIABLES
    const editor = this.editor.current.editor;
    let callStackPlayground = this.callStackPlayground.current;
    let webApiPlayground = this.webApiPlayground.current;
    let callbackQueuePlayground = this.callbackQueuePlayground.current;

    // CLEAR STATE
    this.clearState();

    // INTERVAL
    let interval = 800;

    if (speed === "Very Fast") {
      interval = 600;
    } else if (speed === "Fast") {
      interval = 800;
    } else if (speed === "Average") {
      interval = 1100;
    } else if (speed === "Slow") {
      interval = 1500;
    } else if (speed === "Very Slow") {
      interval = 3000;
    }

    document.documentElement.style.setProperty(
      "--interval",
      `${interval - 100}ms`
    );

    // CHECK FORMAT SPELLING
    const success = checkFormat(JSHINT, value);

    // IF NO FORMAT ERROR
    if (success) {
      // PARSING CODE TREE
      const parsedCodeTree = parsedCode(value);

      // UNSORTING CODE
      unsortedCode(parsedCodeTree, unsortedCallStack, unsortedFunction);

      // SORTING FUNCTION
      sortFunction(unsortedFunction, isFunction);

      // SORTING CALL STACK
      sortCallStack(unsortedCallStack, isCallStack, isFunction);

      // PARSE CALL STACK
      callStackParser(
        editor,
        interval,
        unsortedCallStack,
        unsortedFunction,
        isCallStack,
        isFunction,
        isWebApi,
        isCallbackQueue,
        callStackPlayground,
        webApiPlayground,
        callbackQueuePlayground
      );
    } else if (!success) {
      this.setState({ popupAlert: true });
    }
  };

  clearPlayground = () => {
    this.setState({ value: "" });
    this.clearState();
  };

  // DROPDOWN
  dropdownToggleSpeed = () => {
    const dropdownSpeed = this.dropdownSpeed.current;
    let { isSpeedOpen } = this.state;

    if (!isSpeedOpen) {
      dropdownSpeed.style.display = "block";
      dropdownSpeed.parentNode.classList.add("dropdown__active");
      this.setState({ isSpeedOpen: true });
    } else if (isSpeedOpen) {
      dropdownSpeed.style.display = "none";
      dropdownSpeed.parentNode.classList.remove("dropdown__active");
      this.setState({ isSpeedOpen: false });
    }

    const array = Array.from(dropdownSpeed.children[0].children);

    const eventHandle = (event) => {
      let childElement = true;

      array.forEach((child) => {
        if (event.target === child) {
          childElement = false;
        }
      });

      if (event.target === dropdownSpeed.parentNode && childElement) {
        document.documentElement.removeEventListener("click", eventHandle);
      }

      if (event.target !== dropdownSpeed.parentNode && childElement) {
        dropdownSpeed.style.display = "none";
        dropdownSpeed.parentNode.classList.remove("dropdown__active");
        this.setState({ isSpeedOpen: false });

        document.documentElement.removeEventListener("click", eventHandle);
      }
    };

    document.documentElement.addEventListener("click", eventHandle);
  };

  dropdownToggleExample = () => {
    const dropdownExample = this.dropdownExample.current;
    let { isExampleOpen } = this.state;

    if (!isExampleOpen) {
      dropdownExample.style.display = "block";
      dropdownExample.parentNode.classList.add("dropdown__active");
      this.setState({ isExampleOpen: true });
    } else if (isExampleOpen) {
      dropdownExample.style.display = "none";
      dropdownExample.parentNode.classList.remove("dropdown__active");
      this.setState({ isExampleOpen: false });
    }

    const array = Array.from(dropdownExample.children[0].children);

    const eventHandle = (event) => {
      let childElement = true;

      array.forEach((child) => {
        if (event.target === child) {
          childElement = false;
        }
      });

      if (event.target === dropdownExample.parentNode && childElement) {
        document.documentElement.removeEventListener("click", eventHandle);
      }

      if (event.target !== dropdownExample.parentNode && childElement) {
        dropdownExample.style.display = "none";
        dropdownExample.parentNode.classList.remove("dropdown__active");
        this.setState({ isExampleOpen: false });

        document.documentElement.removeEventListener("click", eventHandle);
      }
    };

    document.documentElement.addEventListener("click", eventHandle);
  };

  // SPEED
  speedVeryFast = () => {
    this.setState({ speed: "Very Fast" });
  };

  speedFast = () => {
    this.setState({ speed: "Fast" });
  };

  speedAverage = () => {
    this.setState({ speed: "Average" });
  };

  speedSlow = () => {
    this.setState({ speed: "Slow" });
  };

  verySlow = () => {
    this.setState({ speed: "Very Slow" });
  };

  // EXAMPLE
  example1 = () => {
    this.setState({ example: 1 });

    const markup1 = `function three() {
  console.log("three");

  setTimeout(function () {
    console.log("last");
  }, 1000);
}

function two() {
  console.log("two");
  three();
}

function one() {
  console.log("one");
  two();
}

one();`;

    this.setState({ value: markup1 });
    this.clearState();
  };

  example2 = () => {
    this.setState({ example: 2 });

    const markup2 = `setTimeout(function () {
  console.log("hello");
}, 1000);

function a() {
  console.log("a");

  function b() {
    console.log("b");
  }

  b();
}

console.log("hey");

setTimeout(function () {
  console.log("setTimeout");
}, 1600);

a();`;

    this.setState({ value: markup2 });
    this.clearState();
  };

  example3 = () => {
    this.setState({ example: 3 });

    const markup3 = `console.log("one");
console.log("two");

function noInvocation() {
  console.log("no invocation");
}

function three() {
  console.log("three");

  function block() {
    console.log("block");
  }
}

three();

console.log("last");

block();`;

    this.setState({ value: markup3 });
    this.clearState();
  };

  closePopupWelcome = () => {
    this.setState({ popupWelcome: false });
  };

  closePopupAlert = () => {
    this.setState({ popupAlert: false });
  };

  render() {
    let { popupWelcome, popupAlert, speed, example } = this.state;

    return (
      <div className="homepage">
        {popupWelcome ? (
          <PopupWelcome closePopup={this.closePopupWelcome} />
        ) : null}
        {popupAlert ? (
          <PopupAlert JSHINT={JSHINT} closePopup={this.closePopupAlert} />
        ) : null}

        <div className="navbar">
          <div className="left">
            <div className="btn">
              <button className="visualize" onClick={this.onClick}>
                Visualize
              </button>
            </div>
            <div
              onClick={this.dropdownToggleSpeed}
              className="nav secondary select speed"
            >
              Speed: {speed}
              <div
                ref={this.dropdownSpeed}
                className="speed__dropdown dropdown"
              >
                <ul>
                  <li onClick={this.speedVeryFast}>Very Fast</li>
                  <li onClick={this.speedFast}>Fast</li>
                  <li onClick={this.speedAverage}>Average</li>
                  <li onClick={this.speedSlow}>Slow</li>
                  <li onClick={this.verySlow}>Very Slow</li>
                </ul>
              </div>
            </div>
            <div
              onClick={this.dropdownToggleExample}
              className="nav secondary select example"
            >
              Example: {example}
              <div
                ref={this.dropdownExample}
                className="speed__dropdown dropdown"
              >
                <ul>
                  <li onClick={this.example1}>Demo: 1</li>
                  <li onClick={this.example2}>Demo: 2</li>
                  <li onClick={this.example3}>Demo: 3</li>
                </ul>
              </div>
            </div>
            <div onClick={this.clearPlayground} className="nav secondary">
              Clear playground
            </div>
          </div>

          <div className="right">
            <a
              className="nav title"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/kamronbekshodmonov/JELoop-Visualizer"
            >
              JELoop Visualizer
            </a>
          </div>
        </div>
        <div className="main">
          <div className="main__left">
            <CodeMirror
              ref={this.editor}
              className="playground"
              value={this.state.value}
              options={{
                lineNumbers: true,
                firstLineNumber: 1,
                lineWrapping: true,
                mode: "javascript",
                theme: "dracula",
                styleActiveLine: true,
                autoCloseBrackets: true,
                tabSize: 2,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-lint-markers"],
                lint: true,
              }}
              onBeforeChange={(editor, data, value) => {
                this.setState({ value });

                // CLEAR STATE
                if (data.origin) {
                  this.clearState();
                }
              }}
              onChange={(editor, data, value) => {}}
            />
          </div>
          <div className="main__right">
            <div className="call-stack event">
              <div className="event__title">Call Stack</div>

              <div className="event__border">
                <div
                  ref={this.callStackPlayground}
                  className="call-stack__content event__content"
                ></div>
              </div>
            </div>

            <div className="web-api event">
              <div className="event__title">Web Api</div>

              <div className="event__border">
                <div
                  ref={this.webApiPlayground}
                  className="web-api__content event__content"
                ></div>
              </div>
            </div>

            <div className="callback-queue event">
              <div className="event__title">Callback Queue</div>

              <div className="event__border">
                <div
                  ref={this.callbackQueuePlayground}
                  className="callback-queue__content event__content"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
