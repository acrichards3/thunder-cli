/** @type {import("eslint").Rule.RuleModule} */
const noEmptyIt = {
  meta: {
    docs: {
      description:
        "Disallow it() blocks with empty bodies or no expect() calls. Every test must contain at least one assertion.",
    },
    messages: {
      emptyBody: "it() block has an empty body. Every test must contain at least one expect() assertion.",
      noAssertion: "it() block has no expect() call. Every test must contain at least one assertion.",
    },
    schema: [],
    type: "problem",
  },

  create(context) {
    const isItCall = (node) =>
      node.type === "CallExpression" &&
      node.callee.type === "Identifier" &&
      (node.callee.name === "it" || node.callee.name === "test");

    const getCallbackBody = (node) => {
      const cb = node.arguments[1];
      if (!cb) return null;
      if (cb.type === "ArrowFunctionExpression" || cb.type === "FunctionExpression") {
        return cb.body;
      }
      return null;
    };

    const hasExpectCall = (node) => {
      let found = false;

      const visit = (n) => {
        if (!n || typeof n !== "object" || found) return;
        if (n.type === "CallExpression" && n.callee.type === "Identifier" && n.callee.name === "expect") {
          found = true;
          return;
        }
        Object.values(n).forEach((child) => {
          if (Array.isArray(child)) {
            child.forEach(visit);
          } else if (child && typeof child === "object" && child.type) {
            visit(child);
          }
        });
      };

      visit(node);
      return found;
    };

    return {
      ExpressionStatement(node) {
        const expr = node.expression;
        if (!isItCall(expr)) return;

        const body = getCallbackBody(expr);
        if (!body) return;

        if (body.type === "BlockStatement" && body.body.length === 0) {
          context.report({ messageId: "emptyBody", node: expr });
          return;
        }

        if (!hasExpectCall(body)) {
          context.report({ messageId: "noAssertion", node: expr });
        }
      },
    };
  },
};

export default noEmptyIt;
