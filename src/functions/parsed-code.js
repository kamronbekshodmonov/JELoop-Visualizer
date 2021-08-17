const parsedCode = (value) => {
  const esprima = require("esprima");

  const parsedCode = esprima.parseScript(value, {
    tokens: true,
    range: true,
    loc: true,
  });

  const parsedCodeTree = parsedCode.body;

  return parsedCodeTree;
};

export default parsedCode;
