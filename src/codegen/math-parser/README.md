# Math Parser

This project is a TypeScript-based lexer and parser for mathematical formulas. It tokenizes mathematical expressions and constructs an abstract syntax tree (AST) for further processing.

## Project Structure

```
math-parser
├── src
│   ├── lexer.ts        # Defines token types and tokenization functions
│   ├── parser.ts       # Contains the Parser class for processing tokens
│   ├── index.ts        # Entry point for the application
│   └── types
│       └── index.ts    # Exports types and interfaces for type safety
├── package.json        # npm configuration file
├── tsconfig.json       # TypeScript configuration file
└── README.md           # Project documentation
```

## Installation

To set up the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd math-parser
npm install
```

## Usage

To parse a mathematical expression, you can use the functions provided in the `index.ts` file. Here is a simple example:

```typescript
import { parseExpression } from './src/index';

const expression = "3 + 5 * (2 - 8)";
const ast = parseExpression(expression);
console.log(ast);
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.