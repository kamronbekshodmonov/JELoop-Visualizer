const unsortedCode = (parsedCodeTree, unsortedCallStack, unsortedFunction) => {
  parsedCodeTree.forEach((line) => {
    if (line.expression) {
      unsortedCallStack.push(line);
    } else if (line.type === "FunctionDeclaration") {
      unsortedFunction.push(line);
    } else if (line.type === "VariableDeclaration") {
      line.declarations.forEach((line) => {
        if (line.init.type === "FunctionExpression") {
          unsortedFunction.push(line);
        }
      });
    }
  });
};

export default unsortedCode;
