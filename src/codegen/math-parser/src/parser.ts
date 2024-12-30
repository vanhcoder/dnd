import { Token, TypeExpr } from "./lexer";

export class Parser {
  private tokens: Token[];
  private current: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  private check(type: string): boolean {
    return (
      this.current < this.tokens.length &&
      this.tokens[this.current].type === type
    );
  }

  private currToken(){
    return this.tokens[this.current]
  }

  private nextToken(): { type: string; value: string } {
    const token = this.tokens[this.current++];
    return token;
  }

  private prevToken(): { type: string; value: string } {
    return this.tokens[this.current - 1];
  }

  private expectToken(type: string): void {
    if (this.check(type)) {
      this.nextToken();
    } else {
      throw new Error(`Expected token type: ${type}`);
    }
  }

  private match(...types: string[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.nextToken();
        return true;
      }
    }
    return false;
  }

  private matchOperator(...operators: string[]): boolean {
    for (const op of operators) {
      if (this.check(TypeExpr.Operator) && this.currToken().value === op) {
        this.nextToken();
        return true;
      }
    }
    return false;
  }


  // implement

  parse(): ASTNode {
    const program: Program = {
      type: ASTNodeType.Program,
      body: [this.parseComparison()],
    };
    return program;
  }

  private parseComparison(): ASTNode {
    let node = this.parseAddition(); // Xử lý toán tử số học trước
  
    while (this.matchOperator(">", "<", ">=", "<=", "==", "!=")) {
      const operator = this.prevToken().value; // Lấy toán tử so sánh
      const right = this.parseAddition(); // Tiếp tục xử lý toán tử số học bên phải
      node = {
        type: ASTNodeType.BinaryExpression,
        left: node,
        operator: operator,
        right: right,
      } as BinaryExpression;
    }
  
    return node;
  }

  private parseAddition(): ASTNode {
    let node = this.parseMultiplication();

    while (this.matchOperator("+", "-")) {
      const operator = this.prevToken().value;
      const right = this.parseMultiplication();
      node = {
        type: ASTNodeType.BinaryExpression,
        left: node,
        operator: operator,
        right: right,
      } as BinaryExpression;
    }

    return node;
  }


  private parseMultiplication(): ASTNode {
    let node = this.parsePrimary();

    while (this.matchOperator("*", "/")) {
      const operator = this.prevToken().value;
      const right = this.parsePrimary();
      node = {
        type: ASTNodeType.BinaryExpression,
        left: node,
        operator: operator,
        right: right,
      } as BinaryExpression;
    }

    return node;
  }

  private parsePrimary(): ASTNode {

    if (this.match(TypeExpr.Number)) {
      return {
        type: ASTNodeType.Literal,
        value: this.prevToken().value,
        literalType: "number",
      } as LiteralExpression;
    }

    if (this.match(TypeExpr.String)) {
      return {
        type: ASTNodeType.Literal,
        value: this.prevToken().value,
        raw: this.prevToken().value,
        literalType: "string",
      } as LiteralExpression;
    }
    
    if (this.match(TypeExpr.Identifier)) {
      // Nếu token là tên biến hoặc tên hàm
      const name = this.prevToken().value; // Lấy giá trị của tên biến/hàm
      if (this.check(TypeExpr.OpenParen)) {
        // Kiểm tra xem tiếp theo có phải dấu mở ngoặc (
        return this.parseCallExpression(name); // Phân tích cú pháp lời gọi hàm
      }

      // Nếu không phải gọi hàm, trả về biểu thức biến
      return {
        type: ASTNodeType.Variable,
        name: name,
      } as VariableExpression;
    }

    if (this.match(TypeExpr.OpenParen)) {
      const node = this.parseComparison(); // Phân tích cú pháp biểu thức bên trong ngoặc
      this.expectToken(TypeExpr.CloseParen); // Tiêu thụ ')'
      return node; // Trả về biểu thức đã phân tích
    }

    throw new Error("Unexpected token");
  }

  private parseCallExpression(caller: string): CallExpression {
    this.expectToken(TypeExpr.OpenParen); // Đảm bảo dấu ')'
    const args = this.arguments(); // Phân tích danh sách tham số
    this.expectToken(TypeExpr.CloseParen); // Đảm bảo dấu ')'
    return {
      type: ASTNodeType.CallExpression,
      caller,
      arguments: args,
    };
  }

  private arguments(): ASTNode[] {
    const args: ASTNode[] = [];

    // Nếu gặp ')' ngay sau '(', trả về danh sách tham số rỗng
    if (this.check(TypeExpr.CloseParen)) {
      return args;
    }

    do {
      args.push(this.parseComparison()); // Phân tích từng tham số
    } while (this.match(TypeExpr.Comma)); // Phân biệt các tham số bằng dấu ','

    return args;
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

export interface BinaryExpression extends Expr {
  type: ASTNodeType.BinaryExpression;
  left: ASTNode;
  operator: string;
  right: ASTNode;
}

export interface CallExpression extends Expr {
  type: ASTNodeType.CallExpression;
  caller: string;
  arguments: ASTNode[];
}

export interface LiteralExpression extends Expr {
  type: ASTNodeType.Literal;
  value: string;
  raw?: string;
  literalType: "string" | "number";
}

export interface VariableExpression extends Expr {
  type: ASTNodeType.Variable;
  name: string;
}
