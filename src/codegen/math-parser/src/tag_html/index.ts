import { EditorToken ,TypeExpr} from "./lexer_editor";

enum ClassName {
  Number = "number",
  Default = "default",
  Function = "function",
  String = "string",
}

class ParserToHtml {
  private tokens: EditorToken[];
  private current: number;

  constructor(tokens: EditorToken[]) {
    console.log('tokens', tokens)
    this.tokens = tokens;
    this.current = 0;
  }

  // Parse toàn bộ danh sách token sang HTMLToken[]
  parse(): string {
    const htmlTokens: string[] = [];

    while (!this.isAtEnd()) {
      const token = this.advance();
      htmlTokens.push(this.parseToHtml(token));
    }

    return htmlTokens.join("");
  }

  parseToHtml(token:EditorToken):string{
    switch (token.type) {
      case TypeExpr.Number:
        return this.makeTag(ClassName.Number, token.value)
      case TypeExpr.String:
        return this.makeTag(ClassName.String, token.value)
      case TypeExpr.Whitespace:
        return this.makeWhiteSpace()
      default:
        return this.makeTag(ClassName.Default, token.value)
    }
  }

  private makeTag(className:string , value:string){
    return `<span class="${className}">${value}</span>`
  }
  private makeWhiteSpace(){
    return `<span style="white-space: pre;"> </span>`;
  }
  // Chuyển đổi từng token sang HTMLToken
 

  // Tiến đến token tiếp theo
  private advance(): EditorToken {
    return this.tokens[this.current++];
  }

  // Kiểm tra kết thúc danh sách token
  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }
}


export default ParserToHtml