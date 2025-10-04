// Test definitions
// Generated from specs.dsl
const runner = new TestRunner();

// Basic Typing
runner.describe('Basic Typing', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should insert single character', () => {
    fixture.press('a').once();
expect(fixture).toHaveLines('a');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 1 });
expect(SecondEdge).toEqual({ row: 0, col: 1 });

  }, "should insert single character");

  runner.it('should should insert word 'Hello'', () => {
    fixture.type('Hello');
expect(fixture).toHaveLines('Hello');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "should insert word 'Hello'");

  runner.it('should should insert phrase with spaces', () => {
    fixture.type('Hello World');
expect(fixture).toHaveLines('Hello World');

  }, "should insert phrase with spaces");

  runner.it('should should insert sentence', () => {
    fixture.type('The quick brown fox');
expect(fixture).toHaveLines('The quick brown fox');


  }, "should insert sentence");

});

// Backspace
runner.describe('Backspace', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should delete single character', () => {
    fixture.type('Hello');
    fixture.press(Key.Backspace).once();
expect(fixture).toHaveLines('Hell');

  }, "should delete single character");

  runner.it('should should delete multiple characters', () => {
    fixture.type('Hello');
    fixture.press(Key.Backspace).times(3);
expect(fixture).toHaveLines('He');

  }, "should delete multiple characters");

  runner.it('should should delete all characters leaving empty line', () => {
    fixture.type('Hi');
    fixture.press(Key.Backspace).times(2);
expect(fixture).toHaveLines('');

  }, "should delete all characters leaving empty line");

  runner.it('should should delete from middle of text', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).times(2);
    fixture.press(Key.Backspace).once();
expect(fixture).toHaveLines('Helo');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 2 });
expect(SecondEdge).toEqual({ row: 0, col: 2 });

  }, "should delete from middle of text");

  runner.it('should should delete multiple characters from middle', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(6);
    fixture.press(Key.Backspace).times(2);
expect(fixture).toHaveLines('Hel World');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 3 });
expect(SecondEdge).toEqual({ row: 0, col: 3 });

  }, "should delete multiple characters from middle");

  runner.it('should should stop at line start when backspacing', () => {
    fixture.type('Hi');
    fixture.press(Key.Backspace).times(5);
expect(fixture).toHaveLines('');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 0 });


  }, "should stop at line start when backspacing");

});

// Enter Key
runner.describe('Enter Key', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should create new line', () => {
    fixture.type('Hello');
    fixture.press(Key.Enter).once();
expect(fixture).toHaveLines('Hello', '');

  }, "should create new line");

  runner.it('should should create multiple lines', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.Enter).once();
    fixture.type('Line 3');
expect(fixture).toHaveLines('Line 1', 'Line 2', 'Line 3');

  }, "should create multiple lines");

  runner.it('should should split line at cursor position', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).once();
    fixture.press(Key.ArrowLeft).once();
    fixture.press(Key.Enter).once();
expect(fixture).toHaveLines('Hel', 'lo');

  }, "should split line at cursor position");

  runner.it('should should create new line at end of file', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line');
    fixture.press(Key.Enter).once();
expect(fixture).toHaveLines('First line', 'Second line', '');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 2, col: 0 });
expect(SecondEdge).toEqual({ row: 2, col: 0 });

  }, "should create new line at end of file");

  runner.it('should should create multiple empty lines', () => {
    fixture.press(Key.Enter).times(5);
expect(fixture).toHaveLines('', '', '', '', '', '');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 5, col: 0 });
expect(SecondEdge).toEqual({ row: 5, col: 0 });


  }, "should create multiple empty lines");

});

// Complex Sequences
runner.describe('Complex Sequences', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should handle type, delete, retype sequence', () => {
    fixture.type('Hello');
    fixture.press(Key.Backspace).times(2);
    fixture.type('y there');
expect(fixture).toHaveLines('Hely there');

  }, "should handle type, delete, retype sequence");

  runner.it('should should create and delete line breaks', () => {
    fixture.type('Hello');
    fixture.press(Key.Enter).once();
    fixture.type('World');
    fixture.press(Key.Backspace).times(6);
expect(fixture).toHaveLines('Hello');

  }, "should create and delete line breaks");

  runner.it('should should support multi-line editing', () => {
    fixture.type('First');
    fixture.press(Key.Enter).once();
    fixture.type('Second');
    fixture.press(Key.ArrowUp).once();
    fixture.type(' Line');
expect(fixture).toHaveLines('First Line', 'Second');

  }, "should support multi-line editing");

  runner.it('should should delete across line boundaries', () => {
    fixture.type('Hello');
    fixture.press(Key.Enter).once();
    fixture.type('World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.Backspace).once();
expect(fixture).toHaveLines('HelloWorld');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "should delete across line boundaries");

  runner.it('should should edit at end of middle line', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.Enter).once();
    fixture.type('Line 3');
    fixture.press(Key.ArrowUp).once();
    fixture.type(' edited');
expect(fixture).toHaveLines('Line 1', 'Line 2 edited', 'Line 3');

  }, "should edit at end of middle line");

  runner.it('should should edit at middle of middle line', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.Enter).once();
    fixture.type('Line 3');
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(3);
    fixture.type('X');
expect(fixture).toHaveLines('Line 1', 'LinXe 2', 'Line 3');


  }, "should edit at middle of middle line");

});

// Selection
runner.describe('Selection', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should select one character forward', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 1 });

  }, "should select one character forward");

  runner.it('should should select one character backward', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 4 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "should select one character backward");

  runner.it('should should select multiple lines downward', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowDown).withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 1, col: 0 });

  }, "should select multiple lines downward");

  runner.it('should should move cursor up without creating selection', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.ArrowUp).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 6 });
expect(SecondEdge).toEqual({ row: 0, col: 6 });

  }, "should move cursor up without creating selection");

  runner.it('should should select upward with Shift+ArrowUp', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.ArrowUp).withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 6 });
expect(SecondEdge).toEqual({ row: 1, col: 6 });

  }, "should select upward with Shift+ArrowUp");

  runner.it('should should extend selection with multiple Shift+Arrow keys', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
expect(fixture.wb.Selection.isSelection).toBe(true);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "should extend selection with multiple Shift+Arrow keys");

  runner.it('should should return correct order for forward and backward selections', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
expect(fixture.wb.Selection.isForwardSelection).toBe(true);
let [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });
    fixture.press(Key.ArrowRight).withMetaKey().once();
    fixture.press(Key.ArrowLeft).withShiftKey().times(5);
expect(fixture.wb.Selection.isForwardSelection).toBe(false);
[firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 6 });
expect(SecondEdge).toEqual({ row: 0, col: 11 });


  }, "should return correct order for forward and backward selections");

});

// Cursor movement - varying line lengths
runner.describe('Cursor movement - varying line lengths', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should clamp cursor to end of shorter line', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('Much longer line');
    fixture.press(Key.ArrowUp).once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "should clamp cursor to end of shorter line");

  runner.it('should should restore original column when moving back', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('Much longer line');
let [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 1, col: 16 });
expect(SecondEdge).toEqual({ row: 1, col: 16 });
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowDown).once();
[firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 1, col: 16 });
expect(SecondEdge).toEqual({ row: 1, col: 16 });

  }, "should restore original column when moving back");

  runner.it('should should clamp to shorter line end', () => {
    fixture.type('A');
    fixture.press(Key.Enter).once();
    fixture.type('Very long line here');
    fixture.press(Key.ArrowUp).once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 1 });
expect(SecondEdge).toEqual({ row: 0, col: 1 });

  }, "should clamp to shorter line end");

  runner.it('should should navigate multiple lines with varying lengths', () => {
    fixture.type('Line one');
    fixture.press(Key.Enter).once();
    fixture.type('Two');
    fixture.press(Key.Enter).once();
    fixture.type('Line three is longest');
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowUp).once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 8 });
expect(SecondEdge).toEqual({ row: 0, col: 8 });

  }, "should navigate multiple lines with varying lengths");

  runner.it('should should move from middle of long line to end of short line', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('This is a much longer line');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(10);
    fixture.press(Key.ArrowUp).once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "should move from middle of long line to end of short line");

  runner.it('should should navigate from medium line to short and long lines', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('Medium!!');
    fixture.press(Key.Enter).once();
    fixture.type('Longest!!!');
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(8);
    fixture.press(Key.ArrowUp).once();
let [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });
    fixture.press(Key.ArrowDown).once();
    fixture.press(Key.ArrowDown).once();
[firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 2, col: 8 });
expect(SecondEdge).toEqual({ row: 2, col: 8 });

  }, "should navigate from medium line to short and long lines");

  runner.it('should should navigate from medium line to short and long lines with natural typing', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('Medium!!');
    fixture.press(Key.Enter).once();
    fixture.type('Longest!!!');
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowRight).withMetaKey().once();
    fixture.press(Key.ArrowUp).once();
let [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });
    fixture.press(Key.ArrowDown).once();
    fixture.press(Key.ArrowDown).once();
[firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 2, col: 8 });
expect(SecondEdge).toEqual({ row: 2, col: 8 });


  }, "should navigate from medium line to short and long lines with natural typing");

});

// Meta+Arrow navigation
runner.describe('Meta+Arrow navigation', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should move to end of line with Meta+Right', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
let [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 0 });
    fixture.press(Key.ArrowRight).withMetaKey().once();
[firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 11 });
expect(SecondEdge).toEqual({ row: 0, col: 11 });

  }, "should move to end of line with Meta+Right");

  runner.it('should should move to start of line with Meta+Left from middle', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(3);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 0 });

  }, "should move to start of line with Meta+Left from middle");

  runner.it('should should move to end of line with Meta+Right from middle', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(3);
    fixture.press(Key.ArrowRight).withMetaKey().once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 11 });
expect(SecondEdge).toEqual({ row: 0, col: 11 });

  }, "should move to end of line with Meta+Right from middle");

  runner.it('should should use Meta+Left and Meta+Right on second line', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line here');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
let [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 1, col: 0 });
expect(SecondEdge).toEqual({ row: 1, col: 0 });
    fixture.press(Key.ArrowRight).withMetaKey().once();
[firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 1, col: 16 });
expect(SecondEdge).toEqual({ row: 1, col: 16 });

  }, "should use Meta+Left and Meta+Right on second line");

  runner.it('should should use Meta+Right after moving between lines', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('Much longer line');
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowRight).withMetaKey().once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });


  }, "should use Meta+Right after moving between lines");

});

// Shift+Meta+Arrow selection
runner.describe('Shift+Meta+Arrow selection', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should select to end of line with Shift+Meta+Right', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 11 });

  }, "should select to end of line with Shift+Meta+Right");

  runner.it('should should select to start of line with Shift+Meta+Left', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 11 });

  }, "should select to start of line with Shift+Meta+Left");

  runner.it('should should select from middle to end with Shift+Meta+Right', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(3);
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 8 });
expect(end).toEqual({ row: 0, col: 11 });

  }, "should select from middle to end with Shift+Meta+Right");

  runner.it('should should select from middle to start with Shift+Meta+Left', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(3);
    fixture.press(Key.ArrowLeft).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 8 });

  }, "should select from middle to start with Shift+Meta+Left");

  runner.it('should should select to start of second line with Shift+Meta+Left', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line here');
    fixture.press(Key.ArrowLeft).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 1, col: 0 });
expect(end).toEqual({ row: 1, col: 16 });

  }, "should select to start of second line with Shift+Meta+Left");

  runner.it('should should extend selection to end with Shift+Meta+Right', () => {
    fixture.type('Hello World Here');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(2);
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 16 });


  }, "should extend selection to end with Shift+Meta+Right");

});

// Multi-line selections
runner.describe('Multi-line selections', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should select 3 rows from middle to middle', () => {
    fixture.type('First line here');
    fixture.press(Key.Enter).once();
    fixture.type('Second line here');
    fixture.press(Key.Enter).once();
    fixture.type('Third line here');
    fixture.press(Key.Enter).once();
    fixture.type('Fourth line here');
    fixture.press(Key.ArrowUp).times(3);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(6);
    fixture.press(Key.ArrowDown).withShiftKey().times(2);
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 6 });
expect(end).toEqual({ row: 2, col: 6 });

  }, "should select 3 rows from middle to middle");

  runner.it('should should select 3 rows from beginning to end', () => {
    fixture.type('First line here');
    fixture.press(Key.Enter).once();
    fixture.type('Second line here');
    fixture.press(Key.Enter).once();
    fixture.type('Third line here');
    fixture.press(Key.ArrowUp).times(2);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowDown).withShiftKey().times(2);
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 2, col: 15 });

  }, "should select 3 rows from beginning to end");

  runner.it('should should select 3 rows from end of line to middle', () => {
    fixture.type('First');
    fixture.press(Key.Enter).once();
    fixture.type('Second line here');
    fixture.press(Key.Enter).once();
    fixture.type('Third line here');
    fixture.press(Key.ArrowUp).times(2);
    fixture.press(Key.ArrowRight).withMetaKey().once();
    fixture.press(Key.ArrowDown).withShiftKey().times(2);
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 5 });
expect(end).toEqual({ row: 2, col: 5 });

  }, "should select 3 rows from end of line to middle");

  runner.it('should should select 3 rows from middle to beginning', () => {
    fixture.type('First line here');
    fixture.press(Key.Enter).once();
    fixture.type('Second line here');
    fixture.press(Key.Enter).once();
    fixture.type('Third line here');
    fixture.press(Key.ArrowUp).times(2);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(6);
    fixture.press(Key.ArrowDown).withShiftKey().times(2);
    fixture.press(Key.ArrowLeft).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 6 });
expect(end).toEqual({ row: 2, col: 0 });

  }, "should select 3 rows from middle to beginning");

  runner.it('should should select from last character and extend down', () => {
    fixture.type('First');
    fixture.press(Key.Enter).once();
    fixture.type('Second');
    fixture.press(Key.Enter).once();
    fixture.type('Third');
    fixture.press(Key.ArrowUp).times(2);
    fixture.press(Key.ArrowLeft).once();
    fixture.press(Key.ArrowRight).withShiftKey().once();
    fixture.press(Key.ArrowDown).withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 4 });
expect(end).toEqual({ row: 2, col: 0 });

  }, "should select from last character and extend down");

  runner.it('should should select down 4 rows from beginning', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.Enter).once();
    fixture.type('Line 3');
    fixture.press(Key.Enter).once();
    fixture.type('Line 4');
    fixture.press(Key.Enter).once();
    fixture.type('Line 5');
    fixture.press(Key.Enter).once();
    fixture.type('Line 6');
    fixture.press(Key.ArrowUp).times(5);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowDown).withShiftKey().times(4);
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 4, col: 0 });

  }, "should select down 4 rows from beginning");

  runner.it('should should select right 3 columns', () => {
    fixture.type('Hello World');
    fixture.press(Key.Enter).once();
    fixture.type('Second line');
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(3);
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 3 });

  }, "should select right 3 columns");

  runner.it('should should select down 4 rows then right 3 columns', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.Enter).once();
    fixture.type('Line 3');
    fixture.press(Key.Enter).once();
    fixture.type('Line 4');
    fixture.press(Key.Enter).once();
    fixture.type('Line 5 with more text');
    fixture.press(Key.ArrowUp).times(4);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowDown).withShiftKey().times(4);
    fixture.press(Key.ArrowRight).withShiftKey().times(3);
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 4, col: 3 });

  }, "should select down 4 rows then right 3 columns");

  runner.it('should should select from middle down 4 rows then right 3 columns', () => {
    fixture.type('Line 1 text');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2 text');
    fixture.press(Key.Enter).once();
    fixture.type('Line 3 text');
    fixture.press(Key.Enter).once();
    fixture.type('Line 4 text');
    fixture.press(Key.Enter).once();
    fixture.type('Line 5 with more text');
    fixture.press(Key.ArrowUp).times(4);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(5);
    fixture.press(Key.ArrowDown).withShiftKey().times(4);
    fixture.press(Key.ArrowRight).withShiftKey().times(3);
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 5 });
expect(end).toEqual({ row: 4, col: 8 });


  }, "should select from middle down 4 rows then right 3 columns");

});

// Deleting selections
runner.describe('Deleting selections', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should delete partial text from line', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
    fixture.press(Key.Backspace).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('World');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 0 });

  }, "should delete partial text from line");

  runner.it('should should delete entire line', () => {
    fixture.type('Delete me');
    fixture.press(Key.ArrowLeft).withMetaKey().withShiftKey().once();
    fixture.press(Key.Backspace).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 0 });

  }, "should delete entire line");

  runner.it('should should delete two full lines plus first character', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line');
    fixture.press(Key.Enter).once();
    fixture.type('Third line');
    fixture.press(Key.ArrowUp).times(2);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowDown).withShiftKey().times(2);
    fixture.press(Key.Backspace).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('hird line');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 0 });

  }, "should delete two full lines plus first character");

  runner.it('should should delete partial multi-line selection', () => {
    fixture.type('First line here');
    fixture.press(Key.Enter).once();
    fixture.type('Second line here');
    fixture.press(Key.Enter).once();
    fixture.type('Third line here');
    fixture.press(Key.ArrowUp).times(2);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(6);
    fixture.press(Key.ArrowDown).withShiftKey().times(2);
    fixture.press(Key.Backspace).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('First ine here');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 6 });
expect(end).toEqual({ row: 0, col: 6 });

  }, "should delete partial multi-line selection");

  runner.it('should should delete from middle to end across lines', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line');
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(6);
    fixture.press(Key.ArrowDown).withShiftKey().once();
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
    fixture.press(Key.Backspace).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('First ');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 6 });
expect(end).toEqual({ row: 0, col: 6 });

  }, "should delete from middle to end across lines");

  runner.it('should should delete backward selection', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withShiftKey().times(5);
    fixture.press(Key.Backspace).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('Hello ');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 6 });
expect(end).toEqual({ row: 0, col: 6 });


  }, "should delete backward selection");

});

// Replacing selections
runner.describe('Replacing selections', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should replace partial text with single character', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
    fixture.type('X');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('XWorld');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 1 });
expect(end).toEqual({ row: 0, col: 1 });

  }, "should replace partial text with single character");

  runner.it('should should replace partial text with word', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
    fixture.type('Goodbye');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('GoodbyeWorld');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 7 });
expect(end).toEqual({ row: 0, col: 7 });

  }, "should replace partial text with word");

  runner.it('should should replace entire line', () => {
    fixture.type('Old text');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
    fixture.type('New');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('New');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 3 });
expect(end).toEqual({ row: 0, col: 3 });

  }, "should replace entire line");

  runner.it('should should replace multi-line selection with single character', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line');
    fixture.press(Key.Enter).once();
    fixture.type('Third line');
    fixture.press(Key.ArrowUp).times(2);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowDown).withShiftKey().times(2);
    fixture.type('X');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('Xhird line');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 1 });
expect(end).toEqual({ row: 0, col: 1 });

  }, "should replace multi-line selection with single character");

  runner.it('should should replace partial multi-line with text', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line');
    fixture.press(Key.Enter).once();
    fixture.type('Third line');
    fixture.press(Key.ArrowUp).times(2);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(6);
    fixture.press(Key.ArrowDown).withShiftKey().times(2);
    fixture.type('REPLACED');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('First REPLACEDine');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 14 });
expect(end).toEqual({ row: 0, col: 14 });

  }, "should replace partial multi-line with text");

  runner.it('should should replace backward selection', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withShiftKey().times(5);
    fixture.type('Everyone');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('Hello Everyone');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 14 });
expect(end).toEqual({ row: 0, col: 14 });

  }, "should replace backward selection");

  runner.it('should should replace selection with space', () => {
    fixture.type('HelloWorld');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(5);
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
    fixture.press(' ').once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('Hello ');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 6 });
expect(end).toEqual({ row: 0, col: 6 });


  }, "should replace selection with space");

});

// Regression: Selection.ordered and isForwardSelection
runner.describe('Regression: Selection.ordered and isForwardSelection', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should return true for isForwardSelection when tail is before head', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(3);
expect(fixture.wb.Selection.isForwardSelection).toBe(true);

  }, "should return true for isForwardSelection when tail is before head");

  runner.it('should should return false for isForwardSelection when head is before tail', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).withShiftKey().times(3);
expect(fixture.wb.Selection.isForwardSelection).toBe(false);

  }, "should return false for isForwardSelection when head is before tail");

  runner.it('should should use head.row when clamping column after moving head', () => {
    fixture.type('a');
    fixture.press(Key.Enter).once();
    fixture.type('bar');
    fixture.press(Key.ArrowLeft).withShiftKey().times(3);
    fixture.press(Key.ArrowUp).withShiftKey().once();
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({row: 0, col: 0});
expect(end).toEqual({row: 1, col: 3});

  }, "should use head.row when clamping column after moving head");

  runner.it('should should use head.row not tail.row when moving head down', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('A');
    fixture.press(Key.Enter).once();
    fixture.type('Long line');
    fixture.press(Key.ArrowUp).times(2);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
    fixture.press(Key.ArrowDown).withShiftKey().once();
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({row: 2, col: 0});


  }, "should use head.row not tail.row when moving head down");

});

// Walkthrough feature - regression tests
runner.describe('Walkthrough feature - regression tests', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should should demonstrate interleaved success and failure expects', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
  }, "should demonstrate interleaved success and failure expects");

});

