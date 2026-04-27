---
title: "Regex Cheat Sheet: Patterns, Flags, and Common Examples"
description: "Complete regex cheat sheet with syntax reference, flag explanations, and 15+ common patterns for email, URL, IP, date, phone number, and more. Free online regex tester included."
date: 2026-04-27
tags: [regex, tools, dev-tools, cheat-sheet]
---

Regular expressions are powerful but notoriously hard to read. This cheat sheet covers everything you need, from basic syntax to advanced patterns, with practical examples you can copy.

## Quick Reference

### Characters

| Pattern | Meaning |
|---------|---------|
| `.` | Any character except newline |
| `\d` | Digit `[0-9]` |
| `\w` | Word character `[a-zA-Z0-9_]` |
| `\s` | Whitespace (space, tab, newline) |
| `\D` | Not digit `[^0-9]` |
| `\W` | Not word character |
| `\S` | Not whitespace |
| `[abc]` | Any of a, b, c |
| `[a-z]` | Character range a to z |
| `[^abc]` | Not a, b, or c |

### Quantifiers

| Pattern | Meaning |
|---------|---------|
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 (optional) |
| `{n}` | Exactly n |
| `{n,}` | n or more |
| `{n,m}` | Between n and m |
| `*?` | 0 or more (lazy) |
| `+?` | 1 or more (lazy) |

### Anchors

| Pattern | Meaning |
|---------|---------|
| `^` | Start of string |
| `$` | End of string |
| `\b` | Word boundary |
| `\B` | Not word boundary |

### Groups & References

| Pattern | Meaning |
|---------|---------|
| `(abc)` | Capture group |
| `(?:abc)` | Non-capturing group |
| `(?<name>abc)` | Named capture group |
| `\1` | Backreference to group 1 |
| `(?=abc)` | Positive lookahead |
| `(?!abc)` | Negative lookahead |
| `(?<=abc)` | Positive lookbehind |
| `(?<!abc)` | Negative lookbehind |

### Flags

| Flag | Name | Effect |
|------|------|--------|
| `g` | Global | Find all matches, not just first |
| `i` | Case-insensitive | Match regardless of case |
| `m` | Multiline | `^` and `$` match line boundaries |
| `s` | Dotall | `.` matches newline |
| `u` | Unicode | Enable Unicode property escapes |
| `y` | Sticky | Match only at `lastIndex` |

## Common Patterns

### Email

```regex
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

Simple but covers 99% of cases. For full RFC 5322 compliance, use a dedicated library.

### URL

```regex
/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
```

### IPv4 Address

```regex
/\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/
```

### Date (YYYY-MM-DD)

```regex
/\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])/
```

### Phone Number (China)

```regex
/1[3-9]\d{9}/
```

### Phone Number (US)

```regex
/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
```

### Hex Color

```regex
/#[0-9a-fA-F]{3,8}\b/
```

### HTML Tag

```regex
/<\/?[a-zA-Z][^>]*>/
```

### Password Strength (8+ chars, uppercase, lowercase, digit, special)

```regex
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

### Slug (URL-safe string)

```regex
/^[a-z0-9]+(?:-[a-z0-9]+)*$/
```

### SemVer

```regex
/\d+\.\d+\.\d+(?:-[\w.]+)?(?:\+[\w.]+)?/
```

## Lazy vs Greedy

Regex quantifiers are **greedy** by default — they match as much as possible.

```javascript
const html = '<div>hello</div><div>world</div>';

// Greedy: matches entire string
html.match(/<div>.*<\/div>/)[0];  // '<div>hello</div><div>world</div>'

// Lazy: matches minimum
html.match(/<div>.*?<\/div>/g);    // ['<div>hello</div>', '<div>world</div>']
```

**Rule of thumb**: Use lazy (`*?`, `+?`) when matching between delimiters.

## Language Examples

### JavaScript

```javascript
// Test
/^\d+$/.test("123");  // true

// Match
"2024-01-15".match(/(\d{4})-(\d{2})-(\d{2})/);
// ["2024-01-15", "2024", "01", "15"]

// Replace
"hello world".replace(/\b\w/g, c => c.toUpperCase());
// "Hello World"

// Split
"one,two;three".split(/[,;]/);  // ["one", "two", "three"]
```

### Python

```python
import re

# Search
m = re.search(r'(\d{4})-(\d{2})-(\d{2})', '2024-01-15')
m.group(1)  # '2024'

# Find all
re.findall(r'\d+', 'abc123def456')  # ['123', '456']

# Substitute
re.sub(r'\b\w', lambda m: m.group().upper(), 'hello world')
# 'Hello World'
```

## Test Your Regex

Use the [free online regex tester](/tools/regex-tester/) to experiment with patterns in real time. It shows matches highlighted in the text and lists all capture groups.
