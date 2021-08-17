import CodeMirror from "codemirror";

function unhighlightAllText(line, editor) {
  for (let i = 0; i < line; i++) {
    const tokens = editor.getLineTokens(i, true);
    const tokensStart = 0;
    let tokensEnd = 0;

    if (tokens.length > 0) {
      tokensEnd = tokens[tokens.length - 1].end;
    }

    let beginning = CodeMirror.Pos(i, tokensStart);
    let finish = CodeMirror.Pos(i, tokensEnd);
    CodeMirror.Pos();
    let markOptions = {
      css: "background-color: transparent",
    };

    editor.markText(beginning, finish, markOptions);
  }
}

export default unhighlightAllText;
