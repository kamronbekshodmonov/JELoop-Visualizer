const sortFunction = (unsortedFunction, isFunction) => {
  unsortedFunction.forEach((line) => {
    if (line.type === "FunctionDeclaration") {
      isFunction.push({
        line,
        type: "FunctionDeclaration",
        value: line.id.name,
        loc: line.loc,
        range: line.range,
      });
    } else if (line.type === "VariableDeclarator") {
      isFunction.push({
        line,
        type: "VariableDeclarator",
        value: line.id.name,
        loc: line.loc,
        range: line.range,
      });
    }
  });
};

export default sortFunction;
