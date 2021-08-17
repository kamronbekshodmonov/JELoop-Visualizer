import CodeMirror from "codemirror";

function unhighlightText(line, editor) {
  if (line.loc) {
    const start = line.loc.start.line - 1;
    const end = line.loc.end.line - 1;

    const tokensStart = editor.getLineTokens(start, true);
    const tokensEnd = editor.getLineTokens(end, true);

    function chooseLine(spot, lineSpot) {
      spot.forEach((line) => {
        let beginning = CodeMirror.Pos(lineSpot, line.start);
        let finish = CodeMirror.Pos(lineSpot, line.end);
        CodeMirror.Pos();
        let markOptions = {
          css: "background-color: transparent",
        };

        editor.markText(beginning, finish, markOptions);
      });
    }

    if (end - start === 1) {
      chooseLine(tokensStart, start);
      chooseLine(tokensEnd, end);
    } else if (end - start > 1) {
      const middle = end - start;

      chooseLine(tokensStart, start);

      for (let i = 1; i < middle; i++) {
        const start = line.loc.start.line + i - 1;
        const tokensStart = editor.getLineTokens(start, true);
        chooseLine(tokensStart, start);
      }

      chooseLine(tokensEnd, end);
    } else if (start === end) {
      chooseLine(tokensStart, start);
    }
  }
}

export default unhighlightText;
