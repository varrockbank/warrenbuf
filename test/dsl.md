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

## Syntax Rules

### Single Keypress

**Base predicate:** `press <key>`

Represents a single keypress.

#### Valid key formats:
- `press a` - unquoted single character
- `press 'a'` - single-quoted single character
- `press Backspace` - key constant (unquoted)
- `press Enter` - key constant (unquoted)
- `press ArrowLeft` - key constant (unquoted)

#### Invalid:
- ~~`press "a"`~~ - double quotes not allowed for keys

### Quantification

The number of times a key is pressed can be specified after the key.

**Pattern:** `press <key> [N time(s)|once]`

#### Examples:
- `press a` - once (implicit)
- `press a once` - once (explicit)
- `press a 1 time` - once
- `press a 3 times` - three times
- `press Backspace 5 times` - five times
- `press Enter 1 time` - once

If quantification is not specified, the key is pressed **once**.

### Qualifications

Modifiers can be applied to keypresses using `with` clause.

**Pattern:** `press <key> [quantification] [with <modifiers>]` or `press <key> [with <modifiers>] [quantification]`

Order does not matter - quantification and modifiers can appear in any order.

#### Supported modifiers:
- `shift` - Shift key modifier
- `meta` - Meta/Command key modifier

#### Examples:
- `press ArrowRight with shift` - shift + arrow right, once
- `press ArrowLeft with meta` - meta + arrow left, once
- `press ArrowRight 5 times with shift` - shift + arrow right, five times
- `press ArrowRight with shift 5 times` - shift + arrow right, five times (same as above)
- `press a with meta` - meta + 'a', once
- `press ArrowRight with shift, meta` - shift + meta + arrow right
- `press ArrowRight with meta, shift` - meta + shift + arrow right

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
