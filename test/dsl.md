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
- `press ArrowLeft` or `press left` - arrow key (verbose or short form)
- `press ArrowRight` or `press right` - arrow key (verbose or short form)
- `press ArrowUp` or `press up` - arrow key (verbose or short form)
- `press ArrowDown` or `press down` - arrow key (verbose or short form)

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
- `press right with shift` - shift + arrow right, once
- `press left with meta` - meta + arrow left, once
- `press right 5 times with shift` - shift + arrow right, five times
- `press right with shift 5 times` - shift + arrow right, five times (same as above)
- `press a with meta` - meta + 'a', once
- `press right with shift, meta` - shift + meta + arrow right
- `press right with meta, shift` - meta + shift + arrow right

---

## Proposals (Claude's)

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

---

## Proposals (User's)

### v1.0.0 - Basic keypress

**Syntax:** `press <key>`

**Example:**
```
press a
press Backspace
press Enter
```

---

### v1.1.0 - Quantification

**Syntax:** `press <key> [N time(s)|once]`

**Example:**
```
press Backspace 5 times
press Enter once
press a 3 times
```

---

### v1.2.0 - Qualifications

**Syntax:** `press <key> [quantification] [with <modifiers>]`

**Example:**
```
press ArrowRight with shift
press ArrowLeft 5 times with meta
```

---

### v1.3.0 - Arrow shortcuts

**Syntax:** Arrow keys support short forms: `left`, `right`, `up`, `down`

**Example:**
```
press right with shift
press left 5 times with meta
press right 5 times with shift
```

---

### v1.4.0 - Omit "press" for special keys

**Syntax:** The `press` keyword can be omitted for Backspace, Enter, and arrow keys

**Example:**
```
Backspace
Backspace 5 times
Enter once
left with meta
right 5 times with shift
```

---

### v1.5.0 - Case insensitive special keys

**Syntax:** Special keys (Backspace, Enter, ArrowLeft, Left, etc.) are case insensitive

**Example:**
```
backspace
BACKSPACE 5 times
enter once
LEFT with meta
right 5 times with SHIFT
```

---

### v1.6.0 - Normalized forms

**Rules:**
1. Special keys are lowercase (`backspace`, `enter`, `left`)
2. Exclude `press` keyword for special keys only (keep `PRESS` for single characters)
3. Use arrow shortcuts (`left`, `right`, `up`, `down`)
4. Standard order: `<key> <quantification> <qualification>`
5. Action keywords are capitalized (`PRESS`, `TYPE`)
6. `TYPE` strings use double quotes; escape sequences follow JavaScript
7. `PRESS` character omits single quotes around the character

**Example:**
```
PRESS a
PRESS a 3 times
TYPE "hello world"
TYPE "hello\nworld"
TYPE "say \"hello\""
backspace
backspace 5 times
enter once
left with meta
right 5 times with shift
```
