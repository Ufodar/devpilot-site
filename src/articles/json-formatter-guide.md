---
title: "How to Format JSON: Online Tools, Command Line, and Editor Shortcuts"
description: "Complete guide to formatting JSON. Compare online tools, CLI commands (jq, python), and editor shortcuts for VS Code, JetBrains, and Vim. Free online formatter included."
date: 2026-04-27
tags: [json, tools, dev-tools, cli]
---

Working with messy, minified JSON is a daily reality for developers. Whether you're debugging an API response, editing a config file, or reading logs, you need to format JSON quickly. Here's every method, ranked by convenience.

## 1. Free Online JSON Formatter

The fastest option when you just need to format something quickly: [JSON Formatter & Validator](/tools/json-formatter/).

Paste your JSON, click Format, and get clean indented output with syntax highlighting. It also validates and shows exact error locations. All processing happens in your browser — nothing is sent to any server.

## 2. Command Line: jq

```bash
# Pretty-print JSON file
jq . data.json

# Format API response
curl -s https://api.example.com/data | jq .

# Extract a specific field
jq '.users[0].name' data.json

# Compact JSON
jq -c . data.json
```

Install: `brew install jq` (macOS), `apt install jq` (Ubuntu), or [download](https://stedolan.github.io/jq/).

## 3. Command Line: python

No installation needed if you have Python:

```bash
# Pretty-print JSON file
python3 -m json.tool data.json

# Format from clipboard (macOS)
pbpaste | python3 -m json.tool

# Format from stdin
echo '{"key":"value"}' | python3 -m json.tool

# Specify indentation
python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin), indent=4))" < data.json
```

## 4. VS Code

- **Format document**: `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (macOS)
- **Format on paste**: Set `"editor.formatOnPaste": true` in settings
- **Format on save**: Set `"editor.formatOnSave": true`
- **Minify**: Install "Minify" extension, then `Ctrl+Shift+P` → "Minify document"

VS Code has built-in JSON formatting. No extension needed.

## 5. JetBrains IDEs (IntelliJ, WebStorm, PyCharm)

- **Reformat**: `Ctrl+Alt+L` (Windows/Linux) or `Cmd+Option+L` (macOS)
- **Compact JSON**: Code → Reformat Code → uncheck "Keep line breaks"

## 6. Vim / Neovim

```vim
" Format JSON using python
:%!python3 -m json.tool

" Or with jq
:%!jq .

" Format visual selection
vip:!python3 -m json.tool
```

For automatic formatting, use `conform.nvim` or `formatter.nvim` with `prettierd` or `jq`.

## 7. Node.js

```javascript
// Pretty-print
const formatted = JSON.stringify(data, null, 2);

// Minify
const minified = JSON.stringify(data);

// Custom indentation (4 spaces)
const indented = JSON.stringify(data, null, 4);

// Sort keys
const sorted = JSON.stringify(data, Object.keys(data).sort(), 2);
```

## Common JSON Formatting Issues

### Trailing Commas

```json
{
  "key": "value",  // ← This comma is invalid in JSON
}
```

JSON does not allow trailing commas. Remove them.

### Single Quotes

```json
{'key': 'value'}  // ← Invalid. Use double quotes.
```

### Unquoted Keys

```json
{key: "value"}  // ← Invalid. Keys must be in double quotes.
```

### Comments

```json
{
  // This comment is invalid in standard JSON
  "key": "value"
}
```

Standard JSON (RFC 8259) does not support comments. Use JSONC if you need comments (supported by VS Code config files).

### Special Characters

```json
{
  "tab": "before\tafter",      // Tab
  "newline": "line1\nline2",   // Newline
  "unicode": "\u0041",         // Unicode escape
  "slash": "C:\\Users\\name"   // Escaped backslash
}
```

## When to Use Each Method

| Method | Best For |
|--------|----------|
| Online tool | Quick one-off formatting, no install needed |
| jq | Shell scripts, API debugging, data transformation |
| python -m json.tool | Quick formatting without installing tools |
| Editor shortcut | Editing JSON files in your project |
| Node.js | Formatting JSON in your application code |

## Try It Now

Paste your JSON into the [free online formatter](/tools/json-formatter/) — it validates, formats, and highlights syntax instantly, all in your browser.
