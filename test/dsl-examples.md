# DSL Examples - Extracted from test.spec.js

## Basic Typing (4 specs)

### 1. Insert single character 'a'
```
PRESS a
expect(fixture).toHaveLines('a');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 1 });
expect(SecondEdge).toEqual({ row: 0, col: 1 });
```

### 2. Insert 'Hello'
```
TYPE "Hello"
expect(fixture).toHaveLines('Hello');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });
```

### 3. Insert 'Hello World' with spaces
```
TYPE "Hello World"
expect(fixture).toHaveLines('Hello World');
```

### 4. Insert sentence 'The quick brown fox'
```
TYPE "The quick brown fox"
expect(fixture).toHaveLines('The quick brown fox');
```


## Replacing selections (7 specs)

### 1. Replace 'Hello ' with 'X'
```
TYPE "Hello World"
left with meta

right 5 times with shift

TYPE "X"

expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('XWorld');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 1 });
expect(end).toEqual({ row: 0, col: 1 });
```

### 2. Replace 'Hello ' with 'Goodbye'
```
TYPE "Hello World"
left with meta

right 5 times with shift

TYPE "Goodbye"

expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('GoodbyeWorld');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 7 });
expect(end).toEqual({ row: 0, col: 7 });
```

### 3. Replace entire line
```
TYPE "Old text"
left with meta
right with meta, shift

TYPE "New"

expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('New');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 3 });
expect(end).toEqual({ row: 0, col: 3 });
```

### 4. Replace multi-line selection with 'X'
```
TYPE "First line"
enter
TYPE "Second line"
enter
TYPE "Third line"

up 2 times
left with meta
down 2 times with shift

TYPE "X"

expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('Xhird line');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 1 });
expect(end).toEqual({ row: 0, col: 1 });
```

### 5. Replace partial multi-line with text
```
TYPE "First line"
enter
TYPE "Second line"
enter
TYPE "Third line"

up 2 times
left with meta
right 6 times
down 2 times with shift

TYPE "REPLACED"

expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('First REPLACEDine');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 14 });
expect(end).toEqual({ row: 0, col: 14 });
```

### 6. Replace backward selection
```
TYPE "Hello World"

left 5 times with shift

TYPE "Everyone"

expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('Hello Everyone');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 14 });
expect(end).toEqual({ row: 0, col: 14 });
```

### 7. Replace 'World' with space
```
TYPE "HelloWorld"
left with meta
right 5 times
right 5 times with shift

PRESS " "

expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('Hello ');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 6 });
expect(end).toEqual({ row: 0, col: 6 });
```
