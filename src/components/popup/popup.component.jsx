import React from "react";

import logo from "../../assets/logo.png";

import "./popup.styles.scss";

export const PopupWelcome = ({ closePopup }) => (
  <div className="popup">
    <div className="popup__content popup__welcome">
      <div>
        <h1 className="title">Welcome to JELoop Visualizer!</h1>
        <h2 className="description">
          This application visualizes how JavaScript Event Loop works.
        </h2>
      </div>

      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <h3 className="source-code">
        If you want to see the source code for this application, check out my
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/kamronbekshodmonov/JELoop-Visualizer"
        >
          {" "}
          github
        </a>
        .
      </h3>

      <div onClick={closePopup} className="close">
        &#10005;
      </div>
    </div>
  </div>
);

export class PopupAlert extends React.Component {
  constructor(props) {
    super(props);

    this.typos = React.createRef();
  }

  componentDidMount() {
    const typos = this.typos.current;

    let outputArray = [];
    let output = "";

    output = "Check format error:\n\n";

    for (let i in this.props.JSHINT.errors) {
      let err = this.props.JSHINT.errors[i];

      if (null != err) {
        output = err.line + "[" + err.character + "]: " + err.reason + "\n";
        outputArray.unshift(output);
      } else {
        output = "Check format unknown error:\n";
        outputArray.push(output);
      }
    }

    outputArray.forEach((output) => {
      const markup = `
        <p>${output}</p>
      `;

      typos.insertAdjacentHTML("afterbegin", markup);
    });
  }

  render() {
    return (
      <div className="popup">
        <div className="popup__content popup__alert">
          <h1 className="title">Alert!</h1>
          <h2 className="description">
            Please, make sure you don't have any typos.
          </h2>

          <div ref={this.typos} className="typos"></div>

          <div onClick={this.props.closePopup} className="close">
            &#10005;
          </div>
        </div>
      </div>
    );
  }
}
