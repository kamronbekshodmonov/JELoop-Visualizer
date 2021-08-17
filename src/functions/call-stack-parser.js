import insertElement from "./insert-element";
import highlightText from "./highlight-text";
import unhighlightText from "./unhighlight-text";
import unsortedCode from "./unsorted-code";
import sortFunction from "./sort-function";
import sortCallStack from "./sort-call-stack";

function callStackParser(
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
) {
  let lastLine = false;

  const checkLastLine = function (line) {
    if (isCallStack[isCallStack.length - 1] === line) {
      lastLine = true;
      const isFunctionClone = [...isFunction];

      unsortedCallStack = [];
      unsortedFunction = [];
      isCallStack = [];
      isFunction = isFunctionClone;
      isCallbackQueue = [];
    }
  };

  isCallStack.forEach((line, index) => {
    setTimeout(() => {
      const currentCallStack = callStackPlayground.children[0];
      const prevStack = isCallStack[index - 1];

      //  CONSOLE.LOG || FUNCTION INVOCATION // SETTIMEOUT
      if (
        line.type === "console.log" ||
        line.type === "functionInvocation" ||
        line.type === "setTimeout"
      ) {
        insertElement(line, editor, callStackPlayground);
        highlightText(line, editor);
      }

      // REMOVE
      else if (line.type === "remove") {
        currentCallStack.classList.add("remove-content");

        setTimeout(() => {
          unhighlightText(prevStack, editor);
          currentCallStack.remove();

          // IF PREV STACK WAS SETTIMEOUT
          if (prevStack.type === "setTimeout") {
            // INSERT INTO WEB API PLAYGROUND
            insertElement(prevStack, editor, webApiPlayground);

            if (isWebApi.length > 0) {
              // CHECK IF LAST LINE
              checkLastLine(line);
            }

            // REMOVE ANIMATION FROM WEB API PLAYGROUND
            setTimeout(() => {
              webApiPlayground.children[
                webApiPlayground.children.length - 1
              ].classList.add("remove-content");

              // REMOVE ELEMENT
              setTimeout(() => {
                webApiPlayground.children[
                  webApiPlayground.children.length - 1
                ].remove();

                // INSERT INTO CALLBACK QUEUE PLAYGROUND
                insertElement(prevStack, editor, callbackQueuePlayground);

                setTimeout(() => {
                  // PUSHING STACK INTO WEB API
                  isWebApi.push(prevStack);

                  // CHECK IF LAST LINE
                  checkLastLine(line);
                }, interval);
              }, interval - 120);
            }, prevStack.value + interval - 100);
          } else {
            // CHECK IF LAST LINE
            checkLastLine(line);
          }
        }, interval - 120);
      }

      // END INVOCATION
      else if (line.type === "endInvocation") {
        currentCallStack.classList.add("remove-content");

        setTimeout(() => {
          unhighlightText(isCallStack[index], editor);
          currentCallStack.remove();

          // CHECK IF LAST LINE
          checkLastLine(line);
        }, interval - 120);
      }
    }, interval * index);
  });

  setInterval(() => {
    if (lastLine) {
      const currentCallbackQueue = callbackQueuePlayground.children[0];

      if (
        currentCallbackQueue &&
        isCallStack.length === 0 &&
        isWebApi.length !== 0
      ) {
        callbackQueuePlayground.children[
          callbackQueuePlayground.children.length - 1
        ].classList.add("remove-content");

        setTimeout(() => {
          callbackQueuePlayground.children[
            callbackQueuePlayground.children.length - 1
          ].remove();
        }, interval - 120);

        isWebApi[0].line.expression.arguments[0].body.body.forEach(
          (isWebApiLine) => {
            isCallbackQueue.push(isWebApiLine);
          }
        );

        // REMOVE EXECUTED WEB API STACK
        isWebApi.shift();

        // UNSORTING CODE
        unsortedCode(isCallbackQueue, unsortedCallStack, unsortedFunction);

        // SORTING FUNCTION
        sortFunction(unsortedFunction, isFunction);

        // SORTING CALL STACK
        sortCallStack(unsortedCallStack, isCallStack, isFunction);

        // PARSE CALL STACK
        setTimeout(() => {
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
        }, interval - 120);

        // LAST LINE FALSE
        lastLine = false;
      }
    }
  }, 100);
}

export default callStackParser;
