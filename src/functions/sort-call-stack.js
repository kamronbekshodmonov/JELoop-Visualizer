let level = 1;

function deepStack(arg, isCallStack, cloneIsFunction) {
  if (arg.expression.callee) {
    if (arg.expression.callee.type === "MemberExpression") {
      const value = [];

      if (arg.expression.arguments[0].value) {
        value.push(arg.expression.arguments[0].value);
      } else if (arg.expression.arguments[0].arguments) {
        arg.expression.arguments[0].arguments.forEach((line) => {
          value.push(line.value);
        });
      }

      isCallStack.push({
        type: "console.log",
        value: value,
        loc: arg.loc,
        range: arg.range,
        level,
      });

      isCallStack.push({
        type: "remove",
      });
    } else if (arg.expression.callee.type === "Identifier") {
      // SETTIMEOUT
      if (arg.expression.callee.name === "setTimeout")
        arg.expression.arguments.forEach((argument) => {
          if (argument.type === "Literal") {
            isCallStack.push({
              line: arg,
              type: "setTimeout",
              value: argument.value,
              loc: arg.loc,
              range: arg.range,
              level,
            });

            isCallStack.push({
              type: "remove",
            });
          }
        });
      else {
        // FUNCTION INVOCATION
        isCallStack.push({
          type: "functionInvocation",
          value: arg.expression.callee.name,
          loc: arg.loc,
          range: arg.range,
          level,
        });

        const cloneLevel = level;

        cloneIsFunction.forEach((functionLine) => {
          if (arg.expression.callee.name === functionLine.value) {
            functionLine.line.body.body.forEach((functionArgument) => {
              level = level + 1;
              deepStack(functionArgument, isCallStack, cloneIsFunction);
              level = cloneLevel;
            });
          }
        });

        level = cloneLevel;

        isCallStack.push({
          type: "endInvocation",
          loc: arg.loc,
          range: arg.range,
        });
      }
    }
  } else if (arg.type === "FunctionDeclaration") {
    cloneIsFunction.push({
      line: arg,
      type: "FunctionDeclaration",
      value: arg.id.name,
      loc: arg.loc,
      range: arg.range,
    });
  } else if (arg.type === "VariableDeclarator") {
    cloneIsFunction.push({
      line: arg,
      type: "VariableDeclarator",
      value: arg.id.name,
      loc: arg.loc,
      range: arg.range,
    });
  }
}

const sortCallStack = (unsortedCallStack, isCallStack, isFunction) => {
  unsortedCallStack.forEach((line) => {
    let cloneIsFunction = [...isFunction];

    // CONSOLE.LOG
    if (line.expression.callee) {
      if (line.expression.callee.type === "MemberExpression") {
        const value = [];

        if (line.expression.arguments[0].value) {
          value.push(line.expression.arguments[0].value);
        } else if (line.expression.arguments[0].arguments) {
          line.expression.arguments[0].arguments.forEach((line) => {
            value.push(line.value);
          });
        }

        isCallStack.push({
          type: "console.log",
          value: value,
          loc: line.loc,
          range: line.range,
          level,
        });

        isCallStack.push({
          type: "remove",
        });
      } else if (line.expression.callee.type === "Identifier") {
        // SETTIMEOUT
        if (line.expression.callee.name === "setTimeout")
          line.expression.arguments.forEach((argument) => {
            if (argument.type === "Literal") {
              isCallStack.push({
                line,
                type: "setTimeout",
                value: argument.value,
                loc: line.loc,
                range: line.range,
                level,
              });

              isCallStack.push({
                type: "remove",
              });
            }
          });
        else {
          // FUNCTION INVOCATION
          isCallStack.push({
            type: "functionInvocation",
            value: line.expression.callee.name,
            loc: line.loc,
            range: line.range,
            level,
          });

          const cloneLevel = level;

          cloneIsFunction.forEach((functionLine) => {
            if (line.expression.callee.name === functionLine.value) {
              functionLine.line.body.body.forEach((functionArgument) => {
                level = level + 1;
                deepStack(functionArgument, isCallStack, cloneIsFunction);
                level = cloneLevel;
              });
            }
          });

          level = cloneLevel;

          isCallStack.push({
            type: "endInvocation",
            loc: line.loc,
            range: line.range,
          });

          cloneIsFunction = [...isFunction];
        }
      }
    } else if (line.type === "FunctionDeclaration") {
      cloneIsFunction.push({
        line,
        type: "FunctionDeclaration",
        value: line.id.name,
        loc: line.loc,
        range: line.range,
      });
    } else if (line.type === "VariableDeclarator") {
      cloneIsFunction.push({
        line,
        type: "VariableDeclarator",
        value: line.id.name,
        loc: line.loc,
        range: line.range,
      });
    }
  });
};

export default sortCallStack;
