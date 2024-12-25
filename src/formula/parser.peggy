// Entry point
Expression
  = IF
  / COUNTIF
  / MAX
  / MIN
  / Comparison
  / Number
  / Variable
  / Primary

IF
  = "IF(" _ args:Arguments _ ")" {
      return { type: "FunctionCall", name: name.join(""), arguments: args };
    }

MAX
  = "MAX(" _ list:ArgumentList _ ")" {
      return { type: "FunctionCall", name: "MAX", arguments: [list] };
    }

MIN
  = "MIN(" _ list:ArgumentList _ ")" {
      return { type: "FunctionCall", name: "MIN", arguments: [list] };
    }

COUNTIF
  = "COUNTIF(" _ list:ArgumentList _ "," _ condition:Condition _ ")" {
      return { type: "FunctionCall", name: "COUNTIF", arguments: [list, condition] };
    }

Condition
  = operator:"'" _ operatorValue:(">" / "<" / ">=" / "<=" / "==" / "!=") _ value:Argument _ "'" {
     return { type: "Condition", operator: operatorValue, value: value };
  }

// Định nghĩa "Literal" để nhận mảng
Literal
  = "[" _ values:ValueList _ "]" {
      return { type: "Literal", value: values };
    }


// Danh sách giá trị trong mảng
ValueList
  = head:Expression tail:(_ "," _ Expression)* {
      return [head].concat(tail.map(arg => arg[3]));
    }


// Comparison (e.g., A1 > 10)
Comparison
  = left:Primary _ operator:(">" / "<" / ">=" / "<=" / "==" / "!=" / "+" / "-" / "/") _ right:Primary {
      return {
        type: "BinaryExpression",
        operator,
        left,
        right
      };
    }


// Primary expressions
Primary
  = "(" _ expr:Expression _ ")" { return expr; }
  / IF
  / Variable
  / Number

ArgumentList
  = head:Argument tail:(_ "," _ Argument)* {
      return [head].concat(tail)[0];
    }

Argument
  = Variable
  / Number

// Arguments
Arguments
  = head:Expression tail:(_ "," _ Expression)* {
      return [head].concat(tail.map(arg => arg[3]));
    }


// Numbers
Number
  = digits:[0-9]+ ("." [0-9]+)? {
      return { type: "Literal", value: parseFloat(text()) };
    }

// Variables
Variable
  = name:[a-z]+[a-z0-9_]* {  // Tên biến viết thường
      return { type: "Variable", name: name.join("") };
    }

// Whitespace
_ "whitespace"
  = [ \t\r\n]*
