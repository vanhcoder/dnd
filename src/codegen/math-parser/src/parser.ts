import { Token, TypeExpr } from "./lexer";

export class Parser {
  private tokens: Token[];
  private current: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse(): ASTNode {
    const program: Program = {
      type: ASTNodeType.Program,
      body: [this.expression()],
    };
    return program;
  }

  private expression(): ASTNode {
    let node = this.term();

    while (this.match("Operator", "+", "-")) {
      const operator = this.previous().value;
      const right = this.term();
      node = {
        type: ASTNodeType.BinaryExpression,
        left: node,
        operator: operator,
        right: right,
      } as BinaryExpression;
    }

    return node;
  }

  private term(): ASTNode {
    let node = this.factor();

    while (this.match("Operator", "*", "/")) {
      const operator = this.previous().value;
      const right = this.factor();
      node = {
        type: ASTNodeType.BinaryExpression,
        left: node,
        operator: operator,
        right: right,
      } as BinaryExpression;
    }

    return node;
  }

  private factor(): ASTNode {
    if (this.match(TypeExpr.Number)) {
      return {
        type: ASTNodeType.Literal,
        value: this.previous().value,
        literalType: "number",
      } as LiteralExpression;
    }

    if (this.match(TypeExpr.String)) {
      return {
        type: ASTNodeType.Literal,
        value: this.previous().value,
        raw: this.previous().value,
        literalType: "string",
      } as LiteralExpression;
    }

    if (this.match(TypeExpr.Variable)) {
      return {
        type: ASTNodeType.Variable,
        name: this.previous().value,
      } as VariableExpression;
    }

    if (this.match(TypeExpr.CallExpression)) {
      const name = this.previous().value; // Lấy tên function
      this.consume("("); // Đảm bảo có dấu mở ngoặc

      const args: ASTNode[] = [];
      while (!this.check(")")) {
        args.push(this.parseExpression()); // Phân tích từng tham số
        if (!this.match(TypeExpr.Comma)) break; // Phân biệt các tham số bằng dấu phẩy
      }

      this.consume(")"); // Đảm bảo có dấu đóng ngoặc

      return {
        type: "CallExpression",
        caller: name,
        arguments: args,
      } as CallExpression;
    }

    if (this.match(TypeExpr.OpenParen)) {
      const node = this.expression(); // Phân tích cú pháp biểu thức bên trong ngoặc
      this.consume(TypeExpr.CloseParen); // Tiêu thụ ')'
      return node; // Trả về biểu thức đã phân tích
    }

    throw new Error("Unexpected token");
  }

  private arguments(): Array<ASTNode> {
    const args: Array<ASTNode> = [];
    if (!this.check(")")) {
      do {
        args.push(this.expression());
      } while (this.match("Operator", ","));
    }
    return args;
  }

  private match(...types: string[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: string): boolean {
    console.log("check", type);
    return (
      this.current < this.tokens.length &&
      this.tokens[this.current].type === type
    );
  }

  private advance(): { type: string; value: string } {
    return this.tokens[this.current++];
  }

  private previous(): { type: string; value: string } {
    return this.tokens[this.current - 1];
  }

  private consume(type: string): void {
    if (this.check(type)) {
      this.advance();
    } else {
      throw new Error(`Expected token type: ${type}`);
    }
  }
}

export interface ASTNode {
  type: ASTNodeType;
}

export interface Program extends ASTNode {
  type: ASTNodeType.Program;
  body: ASTNode[];
}

export enum ASTNodeType {
  BinaryExpression = "BinaryExpression",
  CallExpression = "CallExpression",
  Literal = "Literal",
  Variable = "Variable",
  Program = "Program",
}

export type Expr = ASTNode;

interface BinaryExpression extends Expr {
  type: ASTNodeType.BinaryExpression;
  left: ASTNode;
  operator: string;
  right: ASTNode;
}

interface CallExpression extends Expr {
  type: ASTNodeType.CallExpression;
  caller: string;
  arguments: ASTNode[];
}

interface LiteralExpression extends Expr {
  type: ASTNodeType.Literal;
  value: string | number;
  raw?: string;
  literalType: "string" | "number";
}

interface VariableExpression extends Expr {
  type: ASTNodeType.Variable;
  name: string;
}
