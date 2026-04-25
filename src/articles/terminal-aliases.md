---
title: "10 Terminal Aliases Every Developer Should Have"
description: "Save hours every week with these essential terminal aliases for Git, navigation, Docker, and daily workflows. Copy-paste ready for Bash and Zsh."
date: 2026-04-26
tags: [terminal, productivity, shell]
layout: article.njk
---

If you spend any significant time in the terminal, you are typing the same commands dozens of times per day. Each repetition is a few seconds lost, and those seconds compound into hours over a month. Terminal aliases are the simplest, highest-ROI productivity improvement available to any developer. Here are ten that will change your daily workflow.

## 1. Git Status at a Glance

```bash
alias gs='git status'
```

You check git status constantly. Between commits, before pulling, after branching -- it is one of the most frequently run commands in any developer's terminal. Shortening it to two characters saves more keystrokes per day than any other alias on this list.

## 2. Quick Commit

```bash
alias gc='git commit -m'
```

This alias removes the friction from committing. Instead of typing `git commit -m "fix: resolve null pointer in auth service"`, you type `gc "fix: resolve null pointer in auth service"`. It sounds trivial, but when you are making twenty commits a day, the time savings add up.

A word of caution: never alias `git commit` without the `-m` flag. Opening an editor mid-flow breaks your concentration. Always force the inline message.

## 3. Add and Commit Together

```bash
alias gac='git add -A && git commit -m'
```

This combines staging and committing into a single operation. Use it when you know exactly what has changed and want to commit everything at once. Be careful with the `-A` flag on projects with generated files -- make sure your `.gitignore` is comprehensive.

For a safer version that only stages tracked files:

```bash
alias gac='git add -u && git commit -m'
```

## 4. Push with Tracking

```bash
alias gps='git push -u origin HEAD'
```

This alias pushes your current branch and sets up tracking in one step. It eliminates the error you get when trying to push a new branch without the `-u` flag, then having to run the command again. Using `HEAD` instead of the branch name means it always pushes the current branch, regardless of what it is called.

## 5. Navigate to Projects

```bash
alias proj='cd ~/Projects'
alias work='cd ~/Work'
```

Customize these to match your directory structure. The goal is to have a two or three character command that takes you to the folder where you spend the most time. If you organize projects by client or category, create an alias for each:

```bash
alias client1='cd ~/Work/client1'
alias client2='cd ~/Work/client2'
```

## 6. Directory Navigation

```bash
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
```

These are universal. Every developer navigates up directory trees, and typing `cd ../../..` is unnecessarily verbose. The three-dot and four-dot versions save meaningful keystrokes when working in deeply nested project structures.

## 7. Docker Compose Shortcuts

```bash
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dcl='docker compose logs -f'
```

Docker Compose commands are long and frequently used. These three aliases cover the most common operations: starting services, stopping them, and tailing logs. The `-d` flag on `up` runs containers in the background, which is what you want 95% of the time during development.

For a more complete Docker setup, add:

```bash
alias dcps='docker compose ps'
alias dcr='docker compose restart'
```

## 8. Find and Kill Processes

```bash
alias killport='lsof -t -i'
```

Usage: `killport 3000` shows the process ID using port 3000. Combine it with kill for a complete solution:

```bash
alias kp='kill $(lsof -t -i'
```

Then `kp 3000)` kills whatever is running on port 3000. This is invaluable when a development server refuses to shut down cleanly and you need to free the port.

On Linux, replace `lsof -t -i` with `fuser` or `ss -tlnp` depending on your distribution.

## 9. Clear and Reset

```bash
alias c='clear'
alias cls='clear'
```

Both `c` and `cls` map to clear, accommodating muscle memory from different operating systems. Whether you come from a Unix or Windows background, one of these will feel natural.

## 10. Enhanced Listing

```bash
alias ll='ls -alFh'
alias la='ls -A'
```

The `ll` alias gives you a long-format listing with file sizes in human-readable form, type indicators, and hidden files. The `h` flag is the key addition -- it converts byte counts into KB, MB, and GB, which makes the output actually scannable.

On macOS, consider using `exa` or `eza` as a modern replacement:

```bash
alias ll='eza -alh --git'
alias la='eza -A'
```

These provide color-coded output, git status indicators, and better formatting than the traditional `ls`.

## How to Set Up Your Aliases

Add all aliases to your shell configuration file. For Zsh (the default on macOS), that is `~/.zshrc`. For Bash, use `~/.bashrc` or `~/.bash_aliases`:

```bash
# Open your shell config
nano ~/.zshrc

# Add your aliases at the end of the file
alias gs='git status'
alias gc='git commit -m'
# ... etc

# Reload the configuration
source ~/.zshrc
```

For aliases you want on every machine, consider storing them in a dotfiles repository and symlinking them into place. This makes it trivial to set up a new machine with your complete configuration.

## Bonus: Project-Specific Aliases

Use `direnv` to define aliases that only activate in specific project directories. Create a `.envrc` file in your project root:

```bash
# .envrc
alias run='npm run dev'
alias test='npm run test:watch'
alias build='npm run build'
```

When you `cd` into the project, these aliases become available. When you leave, they disappear. This prevents conflicts between projects that use different build systems or test runners.

## Conclusion

These ten aliases address the most common friction points in daily terminal usage. They take five minutes to set up and save hours every month. Start with the Git aliases -- they have the highest frequency of use -- and add the others as you encounter the need. The best aliases are the ones you create yourself based on the commands you run most often. Check your command history with `history | sort | uniq -c | sort -rn | head -20` to find your personal top candidates.
