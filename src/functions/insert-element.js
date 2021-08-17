function insertElement(line, editor, playground) {
  if (line.loc) {
    let start = line.loc.start.line - 1;
    let end = line.loc.end.line - 1;

    if (start !== end) {
      let array = [];

      /// IF CODE 2 LINES
      if (end - start === 1) {
        let tokens = editor.getLine(start);
        array.push(tokens);

        tokens = editor.getLine(end);
        array.push(tokens);
      }
      // IF CODE MORE THAN 2 LINES
      else if (end - start > 1) {
        const middle = end - start;

        let tokens = editor.getLine(start);
        array.push(tokens);

        for (let i = 1; i < middle; i++) {
          let tokens = editor.getLine(start + i);
          array.push(tokens);
        }

        tokens = editor.getLine(end);
        array.push(tokens);
      }

      // ADDING CODE IF MORE THAN 2 LINES
      const addMarkup = function (code) {
        const markup = `
          <div class="event__text">
            ${code}
          </div>`;

        return markup;
      };

      // SAVING EACH LINE DATA
      let newParagraph = ``;

      // LOOPING OVER EACH LINE
      array.forEach(function (line) {
        newParagraph += `<p>${line}</p>`;
      });

      // INSERTING CODE INTO HTML
      playground.insertAdjacentHTML("afterbegin", addMarkup(newParagraph));
    } else if (start === end) {
      // IF CODE 1LINE
      const tokens = editor.getLine(start);

      const markup = `
        <div class="event__text">
          <p>${tokens}</p>
        </div>`;

      playground.insertAdjacentHTML("afterbegin", markup);
    }
  }
}

export default insertElement;
