/**
 * DSL Spec Generator - Converts DSL files to complete test spec files
 *
 * Handles:
 * - Suite structure (# headers)
 * - Test structure (## headers)
 * - Test descriptions (### headers)
 * - Test framework boilerplate
 * - Delegates line-by-line DSL conversion to DSLTranspiler
 */

class SpecGenerator {
  constructor(transpiler) {
    this.transpiler = transpiler;
  }

  /**
   * Escape string for use in JavaScript string literals
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeString(str) {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
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
    output.push('// DSL source map for walkthrough');
    output.push('window.dslSourceMap = window.dslSourceMap || {};');
    output.push('');

    let currentSuite = null;
    let currentTest = null;
    let currentTestDescription = null;
    let currentTestDslLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Suite header: # Suite Name
      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
        // Close previous test
        if (currentTest !== null) {
          const descParam = currentTestDescription ? `, "${currentTestDescription}"` : '';
          output.push(`  }${descParam});`);
          output.push('');
          currentTest = null;
          currentTestDescription = null;
        }

        // Close previous suite
        if (currentSuite !== null) {
          output.push('});');
          output.push('');
        }

        currentSuite = trimmed.substring(2).trim();
        output.push(`// ${currentSuite}`);
        output.push(`runner.describe('${this.escapeString(currentSuite)}', () => {`);
        output.push('  let fixture;');
        output.push('');
        output.push('  runner.beforeEach(() => {');
        output.push('    fixture = FixtureFactory.forTest();');
        output.push('  });');
        output.push('');

      // Test header: ## Test Name
      } else if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
        // Close previous test
        if (currentTest !== null) {
          const descParam = currentTestDescription ? `, "${this.escapeString(currentTestDescription)}"` : '';
          output.push(`  }${descParam});`);

          // Store DSL source in map
          const dslSource = currentTestDslLines.join('\\n');
          output.push(`  window.dslSourceMap['${this.escapeString(currentSuite)}:${this.escapeString(currentTest)}'] = \`${dslSource}\`;`);
          output.push('');
        }

        currentTest = trimmed.substring(3).trim();
        currentTestDescription = null;
        currentTestDslLines = [];
        output.push(`  runner.it('${this.escapeString(currentTest)}', () => {`);

      // Test description: ### Description
      } else if (trimmed.startsWith('### ')) {
        currentTestDescription = trimmed.substring(4).trim();

      // Test body content
      } else if (currentTest !== null) {
        // Empty line
        if (trimmed === '') {
          output.push('');
          currentTestDslLines.push('');
        }
        // JavaScript pass-through (ends with semicolon or is a comment line)
        else if (trimmed.endsWith(';') || trimmed.startsWith('//')) {
          output.push(`    ${trimmed}`);
          currentTestDslLines.push(trimmed);
        }
        // DSL command - delegate to transpiler
        else {
          try {
            const jsLine = this.transpiler.transpileLine(trimmed);
            if (jsLine) {
              output.push(`    ${jsLine}`);
              currentTestDslLines.push(trimmed);
            }
          } catch (error) {
            // Include error as comment
            output.push(`    // Error transpiling: ${trimmed}`);
            output.push(`    // ${error.message}`);
            currentTestDslLines.push(`// Error: ${trimmed}`);
          }
        }
      }
      // Outside of any test - ignore
    }

    // Close last test
    if (currentTest !== null) {
      const descParam = currentTestDescription ? `, "${this.escapeString(currentTestDescription)}"` : '';
      output.push(`  }${descParam});`);

      // Store DSL source in map
      const dslSource = currentTestDslLines.join('\\n');
      output.push(`  window.dslSourceMap['${this.escapeString(currentSuite)}:${this.escapeString(currentTest)}'] = \`${dslSource}\`;`);
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
