// Entry point
Expression
  = FunctionCall
  / IfStatement
  / AddSubtract
  / Comparison
  / Primary

// Function call (for handling functions like SUM, IF, etc.)
FunctionCall
  = name:[a-zA-Z0-9_]+ "(" _ args:Arguments _ ")" {
      console.log("Parsing FunctionCall:", name);
      return { type: "FunctionCall", name: name.join(""), arguments: args };
    }

// If statement
IfStatement
  = "IF" _ "(" _ condition:Expression _ "," _ trueBranch:Expression _ "," _ falseBranch:Expression _ ")" {
      return {
        type: "IfStatement",
        condition,
        trueBranch,
        falseBranch
      };
    }

// Comparison (for handling operators like >, <, ==, etc.)
Comparison
  = left:AddSubtract _ operator:(">" / "<" / ">=" / "<=" / "==" / "!=") _ right:Primary {
      return {
        type: "BinaryExpression",
        operator: operator,
        left,
        right
      };
    }
  / left:Primary _ operator:(">" / "<" / ">=" / "<=" / "==" / "!=") _ right:AddSubtract {
      return {
        type: "BinaryExpression",
        operator: operator,
        left,
        right
      };
    }


// Arguments for function calls
Arguments
  = head:Expression tail:(_ "," _ Expression)* {
      return [head].concat(tail.map(arg => arg[3]));
    }

// Addition and Subtraction
AddSubtract
  = left:MultiplyDivide _ operator:("+" / "-") _ right:AddSubtract {
      return { type: "BinaryExpression", operator: operator, left, right };
    }
  / MultiplyDivide

// Multiplication and Division
MultiplyDivide
  = left:Primary _ operator:("*" / "/") _ right:MultiplyDivide {
      return { type: "BinaryExpression", operator: operator, left, right };
    }
  / Primary

// Parentheses or Variables/Numbers
Primary
  = "(" _ expr:Expression _ ")" { return expr; }
  / Variable
  / Number

// Variable definition
Variable
  = name:[a-zA-Z0-9_]+ {
      console.log("Variable name:", name);
      return { type: "Variable", name: name.join("") };
    }

// Number definition
Number
  = digits:[0-9]+ ("." [0-9]+)? {
      return { type: "Literal", value: parseFloat(text()) };
    }

// Whitespace
_ "whitespace"
  = [ \t\r\n]*
