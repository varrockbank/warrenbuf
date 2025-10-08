// Assertion library for WarrenBuf tests

function expect(actual) {
  // Check if actual is an EditorTestHarness instance
  if (typeof EditorTestHarness !== 'undefined' && actual instanceof EditorTestHarness) {
    return {
      toHaveLines(...expectedLines) {
        if (actual.wb.Model.lines.length !== expectedLines.length) {
          throw new Error(`Expected ${expectedLines.length} lines, got ${actual.wb.Model.lines.length}`);
        }
        expectedLines.forEach((expected, i) => {
          if (actual.wb.Model.lines[i] !== expected) {
            throw new Error(`Expected line ${i} to be "${expected}", got "${actual.wb.Model.lines[i]}"`);
          }
        });
      },
      toHaveCursorAt(row, col) {
        const [firstEdge, secondEdge] = actual.wb.Selection.ordered;
        const isSelectionByReference = firstEdge !== secondEdge;

        // Check consistency between reference check and isSelection property
        if (isSelectionByReference !== actual.wb.Selection.isSelection) {
          throw new Error(`REGRESSION: Selection.isSelection (${actual.wb.Selection.isSelection}) is inconsistent with reference check (${isSelectionByReference})`);
        }

        // Check it's a cursor (firstEdge === secondEdge by reference)
        if (isSelectionByReference) {
          throw new Error(`Expected cursor but found selection`);
        }

        // Check coordinates
        if (firstEdge.row !== (row-1) || firstEdge.col !== (col-1)) {
          throw new Error(`Expected cursor at {row: ${row}, col: ${col}}, got {row: ${firstEdge.row + 1}, col: ${firstEdge.col + 1}}`);
        }
      },
      toHaveSelectionAt(startRow, startCol, endRow, endCol) {
        const [firstEdge, secondEdge] = actual.wb.Selection.ordered;
        const isSelectionByReference = firstEdge !== secondEdge;

        // Check consistency between reference check and isSelection property
        if (isSelectionByReference !== actual.wb.Selection.isSelection) {
          throw new Error(`REGRESSION: Selection.isSelection (${actual.wb.Selection.isSelection}) is inconsistent with reference check (${isSelectionByReference})`);
        }

        // Check it's a selection (firstEdge !== secondEdge by reference)
        if (!isSelectionByReference) {
          throw new Error(`Expected selection but found cursor`);
        }

        // Check coordinates
        if (firstEdge.row !== (startRow-1) || firstEdge.col !== (startCol-1) ||
            secondEdge.row !== (endRow-1) || secondEdge.col !== (endCol-1)) {
          throw new Error(`Expected selection at {row: ${startRow }, col: ${startCol}} to {row: ${endRow}, col: ${endCol}}, got {row: ${firstEdge.row + 1 }, col: ${firstEdge.col + 1}} to {row: ${secondEdge.row + 1}, col: ${secondEdge.col + 1 }}`);
        }
      },
      toHaveViewportAt(firstLine, lastLine) {
        const actualViewportStartLine = actual.wb.Viewport.start + 1;
        if(actualViewportStartLine != firstLine) {
          throw new Error(`Expected first viewport line to be ${firstLine} but was ${actualViewportStartLine}`);
        }
        const actualViewportEndLine = actual.wb.Viewport.start + actual.wb.Viewport.size;
        if(actualViewportEndLine != lastLine) {
          throw new Error(`Expected last viewport line to be ${lastLine} but was ${actualViewportEndLine}`);
        }
      },
    };
  }

  // Standard matchers for non-fixture values
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
      }
    },
    toHaveLength(expected) {
      if (actual.length !== expected) {
        throw new Error(`Expected length: ${expected}\nActual length: ${actual.length}\nActual value: ${JSON.stringify(actual)}`);
      }
    }
  };
}
