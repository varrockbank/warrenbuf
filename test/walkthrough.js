// Utility function for escaping HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Walkthrough - Handles step recording and interactive walkthrough UI
 */
class Walkthrough {
  constructor() {
    this.steps = [];
    this.currentTest = null;
    this.currentStep = 0;
    this.walkthroughHarness = null;
  }

  // Record a step (called by EditorTestHarness)
  recordStep(description, metadata) {
    this.steps.push({
      description,
      metadata
    });
  }

  // Replay a step on a harness
  replayStep(harness, stepIndex) {
    const step = this.steps[stepIndex];
    const meta = step.metadata;

    if (meta.type === 'type') {
      for (const char of meta.text) {
        dispatchKey(harness.node, char);
      }
    } else if (meta.type === 'press') {
      const count = meta.count || 1;
      for (let i = 0; i < count; i++) {
        dispatchKey(harness.node, meta.key, meta.modifiers);
      }
    }
  }

  // Open walkthrough UI for a test
  open(suiteName, testIndex) {
    const suite = runner.suites.find(s => s.name === suiteName);
    if (!suite) return;

    const test = suite.results[testIndex];
    if (!test || !test.fixture || !test.fixture.walkthrough) return;

    this.currentTest = test;
    this.currentStep = 0;
    this.steps = test.fixture.walkthrough.steps;

    // Update panel header
    document.getElementById('walkthrough-test-name').textContent = test.name;
    document.getElementById('walkthrough-test-desc').textContent = test.description || '';

    // Display test code with inline step markers
    const codeView = document.getElementById('walkthrough-code-js');

    // Extract just the function body, omitting the signature
    const fullSource = test.fnSource;
    const bodyMatch = fullSource.match(/^[^{]*\{\n?([\s\S]*)\n?\s*\}$/);
    const body = bodyMatch ? bodyMatch[1] : fullSource;
    const sourceLines = body.split('\n');

    // Map steps to source code lines by matching step descriptions
    const lineToStep = new Map();
    let stepIndex = 0;

    sourceLines.forEach((line, idx) => {
      if (stepIndex < this.steps.length) {
        const step = this.steps[stepIndex];
        if (line.includes(step.description.split('(')[0])) {
          lineToStep.set(idx, stepIndex);
          stepIndex++;
        }
      }
    });

    // Find error line if test failed
    let errorLineIndex = -1;
    if (test.status === 'fail' && test.error) {
      const stackToUse = test.error.expectCallStack || test.error.stack;

      if (stackToUse) {
        const stackLines = stackToUse.split('\n');
        for (const stackLine of stackLines) {
          const match = stackLine.match(/<anonymous>:(\d+):(\d+)/);
          if (match) {
            const lineNum = parseInt(match[1]);
            errorLineIndex = lineNum - 2;

            if (errorLineIndex >= 0 && errorLineIndex < sourceLines.length) {
              break;
            }
          }
        }

        if (errorLineIndex === -1 || errorLineIndex < 0 || errorLineIndex >= sourceLines.length) {
          const errorMsg = test.error.message || '';
          sourceLines.forEach((line, idx) => {
            if (line.includes('expect(') && errorLineIndex === -1) {
              errorLineIndex = idx;
            }
          });
        }
      }
    }

    // Find successful and failed expect lines using sequence numbers
    const successLineIndices = new Set();
    const failureLineIndices = new Set();

    const expectLines = [];
    sourceLines.forEach((line, idx) => {
      if (line.includes('expect(') && !line.trim().startsWith('//')) {
        expectLines.push(idx);
      }
    });

    const expectResults = test.expectResults || [];

    expectResults.forEach((result, i) => {
      if (i < expectLines.length) {
        const lineIdx = expectLines[i];
        if (result.success) {
          successLineIndices.add(lineIdx);
        } else {
          failureLineIndices.add(lineIdx);
        }
      }
    });

    // Store expect data for progressive revealing
    this.currentTest.expectData = {
      successLineIndices,
      failureLineIndices,
      lineToStep
    };

    // Process DSL source for display
    const dslCodeView = document.getElementById('walkthrough-code-dsl');
    const dslKey = `${suiteName}:${test.name}`;
    const dslData = window.dslSourceMap && window.dslSourceMap[dslKey];

    if (dslData) {
      const dslSource = dslData.source || dslData; // Support both old and new format
      const lineMap = dslData.lineMap || []; // Maps DSL line index -> JS line index
      const dslLines = dslSource.split('\n');

      // Create reverse map: JS line -> DSL line indices
      const jsToDslMap = new Map();
      lineMap.forEach((jsLineIdx, dslLineIdx) => {
        if (!jsToDslMap.has(jsLineIdx)) {
          jsToDslMap.set(jsLineIdx, []);
        }
        jsToDslMap.get(jsLineIdx).push(dslLineIdx);
      });

      // Map steps to DSL lines
      const lineToDslStep = new Map();
      lineToStep.forEach((stepIdx, jsLineIdx) => {
        const dslLineIndices = jsToDslMap.get(jsLineIdx) || [];
        dslLineIndices.forEach(dslLineIdx => {
          lineToDslStep.set(dslLineIdx, stepIdx);
        });
      });

      // Find error DSL line
      let errorDslLineIndex = -1;
      if (errorLineIndex >= 0) {
        const dslLineIndices = jsToDslMap.get(errorLineIndex) || [];
        errorDslLineIndex = dslLineIndices[0] || -1;
      }

      dslCodeView.innerHTML = dslLines.map((line, idx) => {
        const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const stepNum = lineToDslStep.get(idx);
        const isError = idx === errorDslLineIndex;
        const isStep = stepNum !== undefined;

        let className = 'code-line';
        let content = escaped || '&nbsp;';

        if (isError) {
          className += ' error-line';
          content = `<span class="error-marker">✗</span>${content}`;
        } else if (isStep) {
          className += ' step-line';
          content = `<span class="step-marker">${stepNum + 1}</span>${content}`;
        }

        return `<div class="${className}" data-step="${stepNum !== undefined ? stepNum : ''}">${content}</div>`;
      }).join('');

      // Store DSL-specific data for renderCode
      test.dslData = { dslLines, lineMap, jsToDslMap, lineToDslStep };
    } else {
      dslCodeView.innerHTML = '<div class="code-line" style="opacity: 0.5;">No DSL source available</div>';
    }

    // Render source with step markers (expects hidden initially)
    this.renderCode();

    // Create editor instance
    const editorNode = document.getElementById('walkthrough-editor');
    editorNode.className = 'wb no-select';
    editorNode.innerHTML = `
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

    this.walkthroughHarness = FixtureFactory.forWalkthrough(editorNode);

    // Copy steps from test fixture to walkthrough fixture
    this.walkthroughHarness.walkthrough.steps = this.steps;

    // Expose to window for console debugging
    window.__walkthroughFixture = this.walkthroughHarness;

    // Show panel and update display
    document.getElementById('walkthrough-panel').classList.add('active');
    this.updateDisplay();
  }

  close() {
    document.getElementById('walkthrough-panel').classList.remove('active');
    this.currentTest = null;
    this.currentStep = 0;
    this.walkthroughHarness = null;
  }

  renderCode() {
    if (!this.currentTest) return;

    const test = this.currentTest;
    const { successLineIndices, failureLineIndices, lineToStep } = test.expectData || {};
    if (!lineToStep) return;

    const codeView = document.getElementById('walkthrough-code-js');

    // Extract just the function body, omitting the signature
    const fullSource = test.fnSource;
    const bodyMatch = fullSource.match(/^[^{]*\{\n?([\s\S]*)\n?\s*\}$/);
    const body = bodyMatch ? bodyMatch[1] : fullSource;
    const sourceLines = body.split('\n');

    // Determine which expects should be revealed based on current step
    const totalSteps = this.steps.length;
    const isComplete = this.currentStep >= totalSteps;

    let maxRevealedLine = -1;
    if (this.currentStep > 0) {
      for (const [lineIdx, stepNum] of lineToStep.entries()) {
        if (stepNum < this.currentStep) {
          maxRevealedLine = Math.max(maxRevealedLine, lineIdx);
        }
      }
    }

    const codeHtml = sourceLines.map((line, lineIndex) => {
      const stepNum = lineToStep.get(lineIndex);
      const isStepLine = stepNum !== undefined;
      const isFailureLine = failureLineIndices?.has(lineIndex);
      const isSuccessLine = successLineIndices?.has(lineIndex);

      const shouldRevealExpect = isComplete || lineIndex <= maxRevealedLine;

      let classes = 'code-line';
      if (isFailureLine && shouldRevealExpect) classes += ' error-line';
      if (isSuccessLine && !isFailureLine && shouldRevealExpect) classes += ' success-line';
      if (isStepLine) classes += ' step-line';

      const onclick = isStepLine ? `onclick="walkthrough.jumpToStep(${stepNum})"` : '';

      let marker = '';
      if (isStepLine) {
        marker += `<span class="step-marker">${stepNum + 1}</span>`;
      }
      if (isFailureLine && shouldRevealExpect) {
        marker += `<span class="error-marker">✗</span>`;
      } else if (isSuccessLine && shouldRevealExpect) {
        marker += `<span class="success-marker">✓</span>`;
      }

      return `<div class="${classes}" data-step="${stepNum ?? ''}" ${onclick}>${marker}${escapeHtml(line)}</div>`;
    }).join('');

    codeView.innerHTML = codeHtml;

    // Also update DSL view if available
    if (test.dslData) {
      const dslCodeView = document.getElementById('walkthrough-code-dsl');
      const { dslLines, jsToDslMap, lineToDslStep } = test.dslData;

      // Map JS line indices to DSL line indices for success/failure
      const dslFailureIndices = new Set();
      const dslSuccessIndices = new Set();

      if (failureLineIndices) {
        failureLineIndices.forEach(jsLineIdx => {
          const dslIndices = jsToDslMap.get(jsLineIdx) || [];
          dslIndices.forEach(dslIdx => dslFailureIndices.add(dslIdx));
        });
      }

      if (successLineIndices) {
        successLineIndices.forEach(jsLineIdx => {
          const dslIndices = jsToDslMap.get(jsLineIdx) || [];
          dslIndices.forEach(dslIdx => dslSuccessIndices.add(dslIdx));
        });
      }

      // Find max revealed DSL line
      let maxRevealedDslLine = -1;
      if (this.currentStep > 0) {
        for (const [dslLineIdx, stepNum] of lineToDslStep.entries()) {
          if (stepNum < this.currentStep) {
            maxRevealedDslLine = Math.max(maxRevealedDslLine, dslLineIdx);
          }
        }
      }

      const dslCodeHtml = dslLines.map((line, lineIndex) => {
        const stepNum = lineToDslStep.get(lineIndex);
        const isStepLine = stepNum !== undefined;
        const isFailureLine = dslFailureIndices.has(lineIndex);
        const isSuccessLine = dslSuccessIndices.has(lineIndex);

        const shouldRevealExpect = isComplete || lineIndex <= maxRevealedDslLine;

        let classes = 'code-line';
        if (isFailureLine && shouldRevealExpect) classes += ' error-line';
        if (isSuccessLine && !isFailureLine && shouldRevealExpect) classes += ' success-line';
        if (isStepLine) classes += ' step-line';

        const onclick = isStepLine ? `onclick="walkthrough.jumpToStep(${stepNum})"` : '';

        let marker = '';
        if (isStepLine) {
          marker += `<span class="step-marker">${stepNum + 1}</span>`;
        }
        if (isFailureLine && shouldRevealExpect) {
          marker += `<span class="error-marker">✗</span>`;
        } else if (isSuccessLine && shouldRevealExpect) {
          marker += `<span class="success-marker">✓</span>`;
        }

        return `<div class="${classes}" data-step="${stepNum ?? ''}" ${onclick}>${marker}${escapeHtml(line)}</div>`;
      }).join('');

      dslCodeView.innerHTML = dslCodeHtml;
    }
  }

  stepNext() {
    if (!this.currentTest || this.currentStep >= this.steps.length) return;

    this.replayStep(this.walkthroughHarness, this.currentStep);
    this.currentStep++;
    this.updateDisplay();
  }

  stepPrev() {
    if (!this.currentTest || this.currentStep <= 0) return;

    // Reset editor and replay up to previous step
    const editorNode = document.getElementById('walkthrough-editor');
    editorNode.className = 'wb no-select';
    editorNode.innerHTML = `
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

    this.walkthroughHarness = FixtureFactory.forWalkthrough(editorNode);
    this.walkthroughHarness.walkthrough.steps = this.steps;
    window.__walkthroughFixture = this.walkthroughHarness;

    this.currentStep--;

    for (let i = 0; i < this.currentStep; i++) {
      this.replayStep(this.walkthroughHarness, i);
    }

    this.updateDisplay();
  }

  updateDisplay() {
    if (!this.currentTest) return;

    const totalSteps = this.steps.length;
    const stepInfo = document.getElementById('step-info');

    if (this.currentStep === 0) {
      stepInfo.textContent = `Ready to start (${totalSteps} steps)`;
    } else if (this.currentStep <= totalSteps) {
      const step = this.steps[this.currentStep - 1];
      stepInfo.textContent = `Step ${this.currentStep}/${totalSteps}: ${step.description}`;
    }

    document.getElementById('step-prev').disabled = this.currentStep === 0;
    document.getElementById('step-next').disabled = this.currentStep >= totalSteps;

    this.renderCode();

    const stepLines = document.querySelectorAll('.step-line');
    stepLines.forEach((lineEl) => {
      const stepNum = parseInt(lineEl.dataset.step);
      lineEl.classList.remove('current', 'completed');
      if (stepNum < this.currentStep - 1) {
        lineEl.classList.add('completed');
      } else if (stepNum === this.currentStep - 1) {
        lineEl.classList.add('current');
      }
    });
  }

  jumpToStep(targetStep) {
    if (!this.currentTest) return;

    const editorNode = document.getElementById('walkthrough-editor');
    editorNode.className = 'wb no-select';
    editorNode.innerHTML = `
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

    this.walkthroughHarness = FixtureFactory.forWalkthrough(editorNode);
    this.walkthroughHarness.walkthrough.steps = this.steps;
    window.__walkthroughFixture = this.walkthroughHarness;

    this.currentStep = targetStep + 1;

    for (let i = 0; i <= targetStep; i++) {
      this.replayStep(this.walkthroughHarness, i);
    }

    this.updateDisplay();
  }
}
