/**
 * Test DSL for WarrenBuf
 *
 * Object-oriented test environment that encapsulates a node and provides
 * literate methods for user interactions.
 *
 * Design Principles:
 * - Each test gets its own TestEditorEnvironment instance
 * - Literate syntax that reads like user actions
 * - Deferred execution (modifiers chain, execute on .once() or .times(n))
 *
 * Usage Example:
 *
 *   runner.beforeEach(() => {
 *     ({ wb, node, editor } = setupTestEditor());
 *   });
 *
 *   runner.it('should delete across line boundary', () => {
 *     editor.type('Hello');
 *     editor.press(Key.Enter).once();
 *     editor.type('World');
 *     editor.press(Key.ArrowLeft).withMetaKey().once();
 *     editor.press(Key.Backspace).once();
 *
 *     expect(wb.Model.lines).toEqual(['HelloWorld']);
 *   }, "Delete across boundaries");
 */

// DSL Constants
const Key = {
  Enter: 'Enter',
  Backspace: 'Backspace',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown'
};

// Valid key names for validation
const VALID_KEYS = new Set(Object.values(Key));

/**
 * Test environment for a single editor instance.
 * Provides literate methods for user interactions.
 *
 * @param {HTMLElement} [existingNode] - Optional DOM node to attach to. If not provided, creates new node in .editor-container
 */
class EditorFixture {
  constructor(existingNode = null) {
    let node;

    if (existingNode) {
      // Use provided node (for walkthrough panel)
      node = existingNode;
    } else {
      // Create new node in hidden container (for tests)
      const container = document.querySelector('.editor-container');
      node = document.createElement('div');
      node.className = 'wb no-select';
      node.innerHTML = `
        <textarea class="wb-clipboard-bridge" aria-hidden="true"></textarea>
        <div style="display: flex">
          <div class="wb-gutter"></div>
          <div class="wb-lines" style="flex: 1; overflow: hidden;"></div>
        </div>
        <div class="wb-status" style="display: flex; justify-content: space-between;">
          <div class="wb-status-left" style="display: flex;">
            <span class="wb-linecount"></span>
          </div>
          <div class="wb-status-right" style="display: flex;">
            <span class="wb-coordinate"></span>
            <span>|</span>
            <span class="wb-indentation"></span>
          </div>
        </div>
      `;

      container.innerHTML = '';
      container.appendChild(node);
    }

    this.node = node;
    this.wb = new WarrenBuf(node, null, null, 10);
    this.steps = []; // Record all steps for walkthrough

    // Store reference for test framework (only for test runs, not walkthrough)
    if (!existingNode) {
      window.currentTestFixture = this;
    }
  }

  _recordStep(description, metadata) {
    this.steps.push({
      description,
      metadata  // Store operation details, not closures
    });
  }

  // Replay a step on this fixture (used for walkthrough)
  replayStep(stepIndex) {
    const step = this.steps[stepIndex];
    const meta = step.metadata;

    if (meta.type === 'type') {
      for (const char of meta.text) {
        dispatchKey(this.node, char);
      }
    } else if (meta.type === 'press') {
      const count = meta.count || 1;
      for (let i = 0; i < count; i++) {
        dispatchKey(this.node, meta.key, meta.modifiers);
      }
    }
  }

  /**
   * Press a key with optional modifiers and repetition.
   *
   * @param {string} key - Single character or Key constant
   * @returns {Object} Builder with .withMetaKey(), .withShiftKey(), .once(), .times(n)
   *
   * @example
   *   editor.press(Key.Enter).once();
   *   editor.press(Key.Backspace).times(5);
   *   editor.press(Key.ArrowLeft).withMetaKey().once();
   *   editor.press(Key.ArrowRight).withShiftKey().withMetaKey().once();
   */
  press(key) {
    // Validate key
    if (key.length > 1 && !VALID_KEYS.has(key)) {
      throw new Error(`Invalid key: '${key}'. Use type() for typing text or use a Key constant.`);
    }

    const node = this.node;
    const fixture = this;
    const builder = {
      _key: key,
      _modifiers: {},

      withMetaKey() {
        this._modifiers.meta = true;
        return this;
      },

      withShiftKey() {
        this._modifiers.shift = true;
        return this;
      },

      once() {
        const modStr = Object.keys(this._modifiers).filter(k => this._modifiers[k]).join('+');
        const desc = modStr ? `press(${modStr}+${this._key})` : `press(${this._key})`;
        fixture._recordStep(desc, {
          type: 'press',
          key: this._key,
          modifiers: { ...this._modifiers },
          count: 1
        });
        dispatchKey(node, this._key, this._modifiers);
        return this;
      },

      times(count) {
        const modStr = Object.keys(this._modifiers).filter(k => this._modifiers[k]).join('+');
        const desc = modStr ? `press(${modStr}+${this._key}).times(${count})` : `press(${this._key}).times(${count})`;
        fixture._recordStep(desc, {
          type: 'press',
          key: this._key,
          modifiers: { ...this._modifiers },
          count: count
        });
        for (let i = 0; i < count; i++) {
          dispatchKey(node, this._key, this._modifiers);
        }
        return this;
      }
    };

    return builder;
  }

  /**
   * Type text into the editor.
   *
   * @param {string} text - Text to type
   *
   * @example
   *   editor.type('Hello World');
   */
  type(text) {
    this._recordStep(`type('${text}')`, {
      type: 'type',
      text: text
    });
    for (const char of text) {
      dispatchKey(this.node, char);
    }
  }
}
