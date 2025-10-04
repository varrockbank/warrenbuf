# Test DSL - Natural Language Specification

## Introduction

**Goal:** Describe all test specs in a high-level natural language-like DSL without all the syntactical artifacts of a programming language.

### User Prompt
> "Earlier in the test walkthrough, you derived a natural language summary of the corresponding spec code. I was thinking in the same lines of having a DSL and specifying the spec in plaintext"
>
> "Yes. Let's walk through some examples of the declarative specs first."
>
> "Let's name each of your examples as 'Proposals'. Dump them out to a file test/dsl.org. I want us to iterate on the DSL together and capture the evolution of the DSL. Also DSL.org, add a short intro that I want to describe all the test specs in a high-level natural language like DSL without all the syntical artifacts of a programming language. Include this prompt in the dsl.org"

---

## Proposals

### Proposal 1: Simple typing

**Current (Imperative):**
```javascript
fixture.type('Hello');
fixture.press(Key.Backspace).once();
expect(fixture).toHaveLines('Hell');
```

**Declarative:**
```
type "Hello"
press Backspace
expect lines ["Hell"]
```

---

### Proposal 2: Multiple repetitions

**Current (Imperative):**
```javascript
fixture.type('Hello');
fixture.press(Key.Backspace).times(3);
expect(fixture).toHaveLines('He');
```

**Declarative:**
```
type "Hello"
press Backspace 3 times
expect lines ["He"]
```

---

### Proposal 3: Navigation with modifiers

**Current (Imperative):**
```javascript
fixture.type('Hello');
fixture.press(Key.ArrowLeft).withMetaKey().once();
expect(fixture).toHaveLines('Hello');
```

**Declarative:**
```
type "Hello"
press Meta+ArrowLeft
expect lines ["Hello"]
```

---

### Proposal 4: Selection with shift

**Current (Imperative):**
```javascript
fixture.press(Key.ArrowRight).withShiftKey().times(5);
const [start, end] = fixture.wb.Selection.ordered;
expect(start).toEqual({ row: 0, col: 0 });
expect(end).toEqual({ row: 0, col: 5 });
```

**Declarative:**
```
press Shift+ArrowRight 5 times
expect selection from (0, 0) to (0, 5)
```

---

### Proposal 5: Multi-line editing

**Current (Imperative):**
```javascript
fixture.type('First');
fixture.press(Key.Enter).once();
fixture.type('Second');
expect(fixture).toHaveLines('First', 'Second');
```

**Declarative:**
```
type "First"
press Enter
type "Second"
expect lines ["First", "Second"]
```
