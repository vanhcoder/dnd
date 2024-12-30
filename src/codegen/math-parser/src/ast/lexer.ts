export enum TypeExpr {
  Identifier = "Identifier",
  Number = "Number",
  String = "String",
  Function = "Function",
  Operator = "Operator",
  OpenParen = "OpenParen",
  CloseParen = "CloseParen",
  Separator = "Separator",
  Comma = "Comma",
}

export interface Token {
  type: TypeExpr;
  value: string;
}

function token(value: string = "", type: TypeExpr) {
  return {
    value,
    type,
  };
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const src = input.split("");
  while (src.length > 0) {
    if (src[0] == '"') {
      let str = "";
      src.shift(); // bỏ dấu nháy kép đầu tiên
      while (src.length > 0 && src[0] != '"') {
        str += src.shift(); // lấy các ký tự trong chuỗi
      }
      src.shift(); // bỏ dấu nháy kép cuối cùng
      tokens.push(token(str, TypeExpr.String));
    } else if (src[0] == ",") {
      tokens.push(token(src.shift(), TypeExpr.Comma));
    } else if (isSingleOperator(src[0])) {
      if (src.length > 1 && isMulOperator(src[0] + src[1])) {
        const char1 = src?.shift() || "";
        const char2 = src?.shift() || "";
        tokens.push(token(char1 + char2, TypeExpr.Operator));
      } else if (
        src.length > 1 &&
        !isMulOperator(src[0] + src[1]) &&
        isSingleOperator(src[1])
      ) {
        throw new Error(`Unexpected token: '${src[0] + src[1]}'`);
      } else {
        tokens.push(token(src.shift(), TypeExpr.Operator));
      }
    } else if (src[0] == "(") {
      tokens.push(token(src.shift(), TypeExpr.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TypeExpr.CloseParen));
    } else if (isSkip(src[0])) {
      src.shift();
    } else {
      /** handle multiple char **/

      //build number
      if (isNumber(src[0])) {
        let number = "";
        let dotCount = 0;
        while (src.length > 0 && (isNumber(src[0]) || src[0] === ".")) {
          if (src[0] === ".") {
            dotCount++;
            if (dotCount > 1) {
              break; // chỉ cho phép một dấu chấm trong số
            }
          }
          number += src.shift();
        }
        tokens.push(token(number, TypeExpr.Number));
      }
      //build Identifier
      else if (isAlpha(src[0])) {
        let indent = "";
        while (src.length > 0 && isAlpha(src[0])) {
          indent += src.shift();
        }
        tokens.push(token(indent, TypeExpr.Identifier));
      } else {
        throw Error(`Not found keyword ${src.shift()}`);
      }
    }
  }
  return tokens;
}

function isAlpha(input: string) {
  return input.toUpperCase() != input.toLowerCase();
}

function isSingleOperator(input: string) {
  const so = ["+", "-", "/", "*", ">", "<", "=", "!"];
  return so.find((i) => i === input);
}

function isMulOperator(input: string) {
  const so = [">=", "==", "!=", "<="];
  return so.find((i) => i === input);
}

function isNumber(input: string): boolean {
  const c = input.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

function isSkip(input: string): boolean {
  return input == " " || input == "\n" || input == "\t";
}
