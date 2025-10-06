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
        if (firstEdge.row !== row || firstEdge.col !== col) {
          throw new Error(`Expected cursor at {row: ${row}, col: ${col}}, got {row: ${firstEdge.row}, col: ${firstEdge.col}}`);
        }
      }
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
