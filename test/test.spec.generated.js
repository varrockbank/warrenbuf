// Test definitions
// Generated from specs.dsl
const runner = new TestRunner();

// Basic Typing
runner.describe('Basic Typing', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Insert single character 'a'', () => {
    fixture.press('a').once();
expect(fixture).toHaveLines('a');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 1 });
expect(SecondEdge).toEqual({ row: 0, col: 1 });

  }, "Insert single character 'a'");

  runner.it('should Insert 'Hello'', () => {
    fixture.type('Hello');
expect(fixture).toHaveLines('Hello');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "Insert 'Hello'");

  runner.it('should Insert 'Hello World' with spaces', () => {
    fixture.type('Hello World');
expect(fixture).toHaveLines('Hello World');

  }, "Insert 'Hello World' with spaces");

  runner.it('should Insert sentence 'The quick brown fox'', () => {
    fixture.type('The quick brown fox');
expect(fixture).toHaveLines('The quick brown fox');


  }, "Insert sentence 'The quick brown fox'");

});

// Backspace
runner.describe('Backspace', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Delete single char from 'Hello' → 'Hell'', () => {
    fixture.type('Hello');
    fixture.press(Key.Backspace).once();
expect(fixture).toHaveLines('Hell');

  }, "Delete single char from 'Hello' → 'Hell'");

  runner.it('should Delete 3 chars from 'Hello' → 'He'', () => {
    fixture.type('Hello');
    fixture.press(Key.Backspace).times(3);
expect(fixture).toHaveLines('He');

  }, "Delete 3 chars from 'Hello' → 'He'");

  runner.it('should Delete all chars from 'Hi' → ''', () => {
    fixture.type('Hi');
    fixture.press(Key.Backspace).times(2);
expect(fixture).toHaveLines('');

  }, "Delete all chars from 'Hi' → ''");

  runner.it('should Delete from middle: 'Hello' → 'Helo'', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).times(2);
    fixture.press(Key.Backspace).once();
expect(fixture).toHaveLines('Helo');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 2 });
expect(SecondEdge).toEqual({ row: 0, col: 2 });

  }, "Delete from middle: 'Hello' → 'Helo'");

  runner.it('should Delete 2 chars from middle', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(6);
    fixture.press(Key.Backspace).times(2);
expect(fixture).toHaveLines('Hel World');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 3 });
expect(SecondEdge).toEqual({ row: 0, col: 3 });

  }, "Delete 2 chars from middle");

  runner.it('should Backspace beyond line start', () => {
    fixture.type('Hi');
    fixture.press(Key.Backspace).times(5);
expect(fixture).toHaveLines('');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 0 });


  }, "Backspace beyond line start");

});

// Enter Key
runner.describe('Enter Key', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Create new line: 'Hello'[Enter] → 2 lines', () => {
    fixture.type('Hello');
    fixture.press(Key.Enter).once();
expect(fixture).toHaveLines('Hello', '');

  }, "Create new line: 'Hello'[Enter] → 2 lines");

  runner.it('should Create multiple lines: 'Line 1'[Enter]'Line 2'[Enter]'Line 3' → 3 lines', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.Enter).once();
    fixture.type('Line 3');
expect(fixture).toHaveLines('Line 1', 'Line 2', 'Line 3');

  }, "Create multiple lines: 'Line 1'[Enter]'Line 2'[Enter]'Line 3' → 3 lines");

  runner.it('should Split line: 'Hello'[ArrowLeft×2][Enter] → 'Hel' and 'lo'', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).once();
    fixture.press(Key.ArrowLeft).once();
    fixture.press(Key.Enter).once();
expect(fixture).toHaveLines('Hel', 'lo');

  }, "Split line: 'Hello'[ArrowLeft×2][Enter] → 'Hel' and 'lo'");

  runner.it('should Enter at end of file creates new line', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line');
    fixture.press(Key.Enter).once();
expect(fixture).toHaveLines('First line', 'Second line', '');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 2, col: 0 });
expect(SecondEdge).toEqual({ row: 2, col: 0 });

  }, "Enter at end of file creates new line");

  runner.it('should Create multiple empty lines from empty document', () => {
    fixture.press(Key.Enter).times(5);
expect(fixture).toHaveLines('', '', '', '', '', '');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 5, col: 0 });
expect(SecondEdge).toEqual({ row: 5, col: 0 });


  }, "Create multiple empty lines from empty document");

});

// Complex Sequences
runner.describe('Complex Sequences', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Type, delete, retype', () => {
    fixture.type('Hello');
    fixture.press(Key.Backspace).times(2);
    fixture.type('y there');
expect(fixture).toHaveLines('Hely there');

  }, "Type, delete, retype");

  runner.it('should Create/delete line breaks', () => {
    fixture.type('Hello');
    fixture.press(Key.Enter).once();
    fixture.type('World');
    fixture.press(Key.Backspace).times(6);
expect(fixture).toHaveLines('Hello');

  }, "Create/delete line breaks");

  runner.it('should Multi-line editing', () => {
    fixture.type('First');
    fixture.press(Key.Enter).once();
    fixture.type('Second');
    fixture.press(Key.ArrowUp).once();
    fixture.type(' Line');
expect(fixture).toHaveLines('First Line', 'Second');

  }, "Multi-line editing");

  runner.it('should Delete across boundaries', () => {
    fixture.type('Hello');
    fixture.press(Key.Enter).once();
    fixture.type('World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.Backspace).once();
expect(fixture).toHaveLines('HelloWorld');
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "Delete across boundaries");

  runner.it('should Edit at end of middle line', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.Enter).once();
    fixture.type('Line 3');
    fixture.press(Key.ArrowUp).once();
    fixture.type(' edited');
expect(fixture).toHaveLines('Line 1', 'Line 2 edited', 'Line 3');

  }, "Edit at end of middle line");

  runner.it('should Edit at middle of middle line', () => {
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


  }, "Edit at middle of middle line");

});

// Selection
runner.describe('Selection', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Select one character with Shift+ArrowRight', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 1 });

  }, "Select one character with Shift+ArrowRight");

  runner.it('should Select one character with Shift+ArrowLeft', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 4 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "Select one character with Shift+ArrowLeft");

  runner.it('should Select multiple lines with Shift+ArrowDown', () => {
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

  }, "Select multiple lines with Shift+ArrowDown");

  runner.it('should Move cursor up without selection', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.ArrowUp).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 6 });
expect(SecondEdge).toEqual({ row: 0, col: 6 });

  }, "Move cursor up without selection");

  runner.it('should Select upward with Shift+ArrowUp', () => {
    fixture.type('Line 1');
    fixture.press(Key.Enter).once();
    fixture.type('Line 2');
    fixture.press(Key.ArrowUp).withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 6 });
expect(SecondEdge).toEqual({ row: 1, col: 6 });

  }, "Select upward with Shift+ArrowUp");

  runner.it('should Extend selection with multiple Shift+Arrow', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
expect(fixture.wb.Selection.isSelection).toBe(true);
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "Extend selection with multiple Shift+Arrow");

  runner.it('should Regression: Selection.ordered returns correct order for forward/backward selections', () => {
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


  }, "Regression: Selection.ordered returns correct order for forward/backward selections");

});

// Cursor movement - varying line lengths
runner.describe('Cursor movement - varying line lengths', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Long to short: cursor at end of short line', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('Much longer line');
    fixture.press(Key.ArrowUp).once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "Long to short: cursor at end of short line");

  runner.it('should Should restore original column when moving back', () => {
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

  }, "Should restore original column when moving back");

  runner.it('should Clamp to shorter line end', () => {
    fixture.type('A');
    fixture.press(Key.Enter).once();
    fixture.type('Very long line here');
    fixture.press(Key.ArrowUp).once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 1 });
expect(SecondEdge).toEqual({ row: 0, col: 1 });

  }, "Clamp to shorter line end");

  runner.it('should Multiple lines with varying lengths', () => {
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

  }, "Multiple lines with varying lengths");

  runner.it('should Move from middle of long line to end of short line', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('This is a much longer line');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).times(10);
    fixture.press(Key.ArrowUp).once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });

  }, "Move from middle of long line to end of short line");

  runner.it('should Navigate from medium line to short and long lines', () => {
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

  }, "Navigate from medium line to short and long lines");

  runner.it('should Navigate from medium line to short and long lines (natural typing)', () => {
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


  }, "Navigate from medium line to short and long lines (natural typing)");

});

// Meta+Arrow navigation
runner.describe('Meta+Arrow navigation', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Meta+Right moves to end of line', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
let [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 0 });
    fixture.press(Key.ArrowRight).withMetaKey().once();
[firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 11 });
expect(SecondEdge).toEqual({ row: 0, col: 11 });

  }, "Meta+Right moves to end of line");

  runner.it('should Meta+Left from middle of line', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(3);
    fixture.press(Key.ArrowLeft).withMetaKey().once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 0 });
expect(SecondEdge).toEqual({ row: 0, col: 0 });

  }, "Meta+Left from middle of line");

  runner.it('should Meta+Right from middle of line', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(3);
    fixture.press(Key.ArrowRight).withMetaKey().once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 11 });
expect(SecondEdge).toEqual({ row: 0, col: 11 });

  }, "Meta+Right from middle of line");

  runner.it('should Meta+Left/Right on second line', () => {
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

  }, "Meta+Left/Right on second line");

  runner.it('should Meta+Right after moving between lines', () => {
    fixture.type('Short');
    fixture.press(Key.Enter).once();
    fixture.type('Much longer line');
    fixture.press(Key.ArrowUp).once();
    fixture.press(Key.ArrowRight).withMetaKey().once();
const [firstEdge, SecondEdge] = fixture.wb.Selection.ordered;
expect(firstEdge).toEqual({ row: 0, col: 5 });
expect(SecondEdge).toEqual({ row: 0, col: 5 });


  }, "Meta+Right after moving between lines");

});

// Shift+Meta+Arrow selection
runner.describe('Shift+Meta+Arrow selection', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Shift+Meta+Right selects to end of line', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 11 });

  }, "Shift+Meta+Right selects to end of line");

  runner.it('should Shift+Meta+Left selects to start of line', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 11 });

  }, "Shift+Meta+Left selects to start of line");

  runner.it('should Shift+Meta+Right from middle selects to end', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(3);
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 8 });
expect(end).toEqual({ row: 0, col: 11 });

  }, "Shift+Meta+Right from middle selects to end");

  runner.it('should Shift+Meta+Left from middle selects to start', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).times(3);
    fixture.press(Key.ArrowLeft).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 8 });

  }, "Shift+Meta+Left from middle selects to start");

  runner.it('should Shift+Meta+Left on second line', () => {
    fixture.type('First line');
    fixture.press(Key.Enter).once();
    fixture.type('Second line here');
    fixture.press(Key.ArrowLeft).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 1, col: 0 });
expect(end).toEqual({ row: 1, col: 16 });

  }, "Shift+Meta+Left on second line");

  runner.it('should Extend selection to end with Shift+Meta+Right', () => {
    fixture.type('Hello World Here');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(2);
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
expect(fixture.wb.Selection.isSelection).toBe(true);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 16 });


  }, "Extend selection to end with Shift+Meta+Right");

});

// Multi-line selections
runner.describe('Multi-line selections', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Select 3 rows: middle to middle', () => {
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

  }, "Select 3 rows: middle to middle");

  runner.it('should Select 3 rows: beginning to end', () => {
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

  }, "Select 3 rows: beginning to end");

  runner.it('should Select 3 rows: end of line to middle', () => {
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

  }, "Select 3 rows: end of line to middle");

  runner.it('should Select 3 rows: middle to beginning', () => {
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

  }, "Select 3 rows: middle to beginning");

  runner.it('should Select from last character and extend down', () => {
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

  }, "Select from last character and extend down");

  runner.it('should Select down 4 rows from beginning', () => {
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

  }, "Select down 4 rows from beginning");

  runner.it('should Select right 3 columns', () => {
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

  }, "Select right 3 columns");

  runner.it('should Select down 4 rows then right 3 columns', () => {
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

  }, "Select down 4 rows then right 3 columns");

  runner.it('should Select from middle down 4 rows then right 3 columns', () => {
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


  }, "Select from middle down 4 rows then right 3 columns");

});

// Deleting selections
runner.describe('Deleting selections', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Delete 'Hello ' from 'Hello World'', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
    fixture.press(Key.Backspace).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('World');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 0 });

  }, "Delete 'Hello ' from 'Hello World'");

  runner.it('should Delete entire line', () => {
    fixture.type('Delete me');
    fixture.press(Key.ArrowLeft).withMetaKey().withShiftKey().once();
    fixture.press(Key.Backspace).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 0 });

  }, "Delete entire line");

  runner.it('should Delete two full lines plus first character', () => {
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

  }, "Delete two full lines plus first character");

  runner.it('should Delete partial multi-line selection', () => {
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

  }, "Delete partial multi-line selection");

  runner.it('should Delete from middle to end across lines', () => {
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

  }, "Delete from middle to end across lines");

  runner.it('should Delete backward selection', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withShiftKey().times(5);
    fixture.press(Key.Backspace).once();
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('Hello ');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 6 });
expect(end).toEqual({ row: 0, col: 6 });


  }, "Delete backward selection");

});

// Replacing selections
runner.describe('Replacing selections', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should Replace 'Hello ' with 'X'', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
    fixture.type('X');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('XWorld');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 1 });
expect(end).toEqual({ row: 0, col: 1 });

  }, "Replace 'Hello ' with 'X'");

  runner.it('should Replace 'Hello ' with 'Goodbye'', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(5);
    fixture.type('Goodbye');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('GoodbyeWorld');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 7 });
expect(end).toEqual({ row: 0, col: 7 });

  }, "Replace 'Hello ' with 'Goodbye'");

  runner.it('should Replace entire line', () => {
    fixture.type('Old text');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withMetaKey().withShiftKey().once();
    fixture.type('New');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('New');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 3 });
expect(end).toEqual({ row: 0, col: 3 });

  }, "Replace entire line");

  runner.it('should Replace multi-line selection with 'X'', () => {
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

  }, "Replace multi-line selection with 'X'");

  runner.it('should Replace partial multi-line with text', () => {
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

  }, "Replace partial multi-line with text");

  runner.it('should Replace backward selection', () => {
    fixture.type('Hello World');
    fixture.press(Key.ArrowLeft).withShiftKey().times(5);
    fixture.type('Everyone');
expect(fixture.wb.Selection.isSelection).toBe(false);
expect(fixture).toHaveLines('Hello Everyone');
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 14 });
expect(end).toEqual({ row: 0, col: 14 });

  }, "Replace backward selection");

  runner.it('should Replace 'World' with space', () => {
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


  }, "Replace 'World' with space");

});

// Regression: Selection.ordered and isForwardSelection
runner.describe('Regression: Selection.ordered and isForwardSelection', () => {
  let fixture;

  runner.beforeEach(() => {
    fixture = FixtureFactory.forTest();
  });

  runner.it('should isForwardSelection true when tail < head', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).withMetaKey().once();
    fixture.press(Key.ArrowRight).withShiftKey().times(3);
expect(fixture.wb.Selection.isForwardSelection).toBe(true);

  }, "isForwardSelection true when tail < head");

  runner.it('should isForwardSelection false when head < tail', () => {
    fixture.type('Hello');
    fixture.press(Key.ArrowLeft).withShiftKey().times(3);
expect(fixture.wb.Selection.isForwardSelection).toBe(false);

  }, "isForwardSelection false when head < tail");

  runner.it('should Uses head.row when clamping column after moving head', () => {
    fixture.type('a');
    fixture.press(Key.Enter).once();
    fixture.type('bar');
    fixture.press(Key.ArrowLeft).withShiftKey().times(3);
    fixture.press(Key.ArrowUp).withShiftKey().once();
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({row: 0, col: 0});
expect(end).toEqual({row: 1, col: 3});

  }, "Uses head.row when clamping column after moving head");

  runner.it('should Clamps using head.row when head moves to shorter line', () => {
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
  }, "Clamps using head.row when head moves to shorter line");

});

