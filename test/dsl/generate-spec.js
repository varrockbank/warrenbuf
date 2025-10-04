/**
 * DSL Spec Generator - Converts DSL files to complete test spec files
 *
 * Handles:
 * - Suite structure (# headers)
 * - Test structure (## headers)
 * - Test framework boilerplate
 * - Delegates line-by-line DSL conversion to DSLTranspiler
 */

class SpecGenerator {
  constructor(transpiler) {
    this.transpiler = transpiler;
  }

  /**
   * Generate complete spec.js from DSL source
   * @param {string} dslSource - Complete DSL source
   * @returns {string} Complete JavaScript spec file
   */
  generate(dslSource) {
    const lines = dslSource.split('\n');
    const output = [];

    // File header
    output.push('// Test definitions');
    output.push('// Generated from DSL');
    output.push('const runner = new TestRunner();');
    output.push('');

    let currentSuite = null;
    let currentTest = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Suite header: # Suite Name
      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
        // Close previous test
        if (currentTest !== null) {
          output.push(`  }, "${currentTest}");`);
          output.push('');
          currentTest = null;
        }

        // Close previous suite
        if (currentSuite !== null) {
          output.push('});');
          output.push('');
        }

        currentSuite = trimmed.substring(2).trim();
        output.push(`// ${currentSuite}`);
        output.push(`runner.describe('${currentSuite}', () => {`);
        output.push('  let fixture;');
        output.push('');
        output.push('  runner.beforeEach(() => {');
        output.push('    fixture = FixtureFactory.forTest();');
        output.push('  });');
        output.push('');

      // Test header: ## Test Name
      } else if (trimmed.startsWith('## ')) {
        // Close previous test
        if (currentTest !== null) {
          output.push(`  }, "${currentTest}");`);
          output.push('');
        }

        currentTest = trimmed.substring(3).trim();
        output.push(`  runner.it('should ${currentTest}', () => {`);

      // Test body content
      } else if (currentTest !== null) {
        // Empty line
        if (trimmed === '') {
          output.push('');
        }
        // JavaScript pass-through (ends with semicolon)
        else if (trimmed.endsWith(';')) {
          output.push(`    ${trimmed}`);
        }
        // DSL command - delegate to transpiler
        else {
          try {
            const jsLine = this.transpiler.transpileLine(trimmed);
            if (jsLine) {
              output.push(`    ${jsLine}`);
            }
          } catch (error) {
            // Include error as comment
            output.push(`    // Error transpiling: ${trimmed}`);
            output.push(`    // ${error.message}`);
          }
        }
      }
      // Outside of any test - ignore
    }

    // Close last test
    if (currentTest !== null) {
      output.push(`  }, "${currentTest}");`);
      output.push('');
    }

    // Close last suite
    if (currentSuite !== null) {
      output.push('});');
      output.push('');
    }

    return output.join('\n');
  }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpecGenerator };
}
