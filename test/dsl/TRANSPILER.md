# DSL Transpiler

A transpiler that converts natural language test DSL to JavaScript code.

## Overview

The transpiler implements the DSL specification v2.2.0:
- v1.6.0 normalized forms
- v2.0.0 JavaScript interweaving (lines ending with `;`)
- v2.1.0 empty lines allowed
- v2.2.0 semicolon disambiguation

## Usage

```javascript
const transpiler = new DSLTranspiler();
const jsCode = transpiler.transpile(dslSource);
```

## Example

**Input DSL:**
```
TYPE "Hello World"
left with meta
right 5 times with shift
TYPE "X"
expect(fixture).toHaveLines('XWorld');
```

**Output JavaScript:**
```javascript
fixture.type('Hello World');
fixture.press(Key.ArrowLeft).withMetaKey().once();
fixture.press(Key.ArrowRight).withShiftKey().times(5);
fixture.type('X');
expect(fixture).toHaveLines('XWorld');
```

## Supported Commands

### TYPE
```
TYPE "text"  →  fixture.type('text');
```

### PRESS (single characters)
```
PRESS a      →  fixture.press('a').once();
PRESS " "    →  fixture.press(' ').once();
PRESS ";"    →  fixture.press(';').once();
```

### Special Keys
```
backspace                   →  fixture.press(Key.Backspace).once();
backspace 5 times           →  fixture.press(Key.Backspace).times(5);
enter                       →  fixture.press(Key.Enter).once();
left                        →  fixture.press(Key.ArrowLeft).once();
right with shift            →  fixture.press(Key.ArrowRight).withShiftKey().once();
up 2 times                  →  fixture.press(Key.ArrowUp).times(2);
down with meta, shift       →  fixture.press(Key.ArrowDown).withMetaKey().withShiftKey().once();
```

### JavaScript Pass-through

Any line ending with `;` is treated as JavaScript and passed through unchanged:

```
const text = fixture.wb.Model.lines[0];
expect(text).toBe("Hello");
```

### Empty Lines

Empty lines are preserved for readability.

## Testing

Open `test/transpiler-test.html` in a browser to run the transpiler test suite.

## Implementation

The transpiler is a simple line-by-line processor:
1. Detects line type (JavaScript, empty, DSL command)
2. Parses DSL commands using regex patterns
3. Generates corresponding JavaScript code

See `test/transpiler.js` for implementation details.
