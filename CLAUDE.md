# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Multi-purpose presentation and deck creation workspace. Each project lives in its own subdirectory under `projects/`. The repo supports multiple output formats (HTML slides, PPTX) and optional NotebookLM-powered research/synthesis as an input stage.

## Project Structure

```
deck_creator/
├── projects/                    # One subdirectory per project
│   └── <project-name>/         # e.g., "q1-investor-update"
│       ├── sources/            # Input content (text, PDFs, URLs list, notes)
│       ├── output/             # Generated deliverables (HTML, PPTX, exports)
│       └── assets/             # Project-specific images, logos, media
├── CLAUDE.md
└── pyproject.toml
```

### Naming Conventions

- Project directories: lowercase kebab-case (`quarterly-review`, `product-launch-2026`)
- Output files: `<project-name>-v<N>.<ext>` (e.g., `quarterly-review-v1.pptx`, `quarterly-review-v2.html`)
- Increment version number on each new generation within a project, never overwrite previous versions

## Tools & Skills

Three primary creation tools — use whichever the user requests, or recommend based on their needs:

### `/frontend-slides` — HTML Presentations
- Creates animation-rich HTML slide decks (Reveal.js-based)
- Best for: web-hosted presentations, visual/animated decks, converting from PPTX
- Outputs a self-contained HTML file to the project's `output/` directory
- Invoke this skill for any HTML slide creation or PPTX-to-web conversion

### `/powerpoint-creator` — PPTX Presentations
- Creates and edits `.pptx` files via python-pptx
- Best for: corporate/formal decks, offline sharing, editable deliverables
- Outputs to the project's `output/` directory
- Invoke this skill for any PowerPoint creation, editing, or analysis

### `/nlm-skill` + NotebookLM MCP — Research & Synthesis (Optional)
- Use when the user wants to research, synthesize, or generate content from sources before building slides
- Can create notebooks from source materials, run research queries, generate audio overviews, quizzes, mind maps
- CLI: `nlm` command available globally
- MCP: `mcp__notebooklm-mcp__*` tools for programmatic access
- Invoke this skill when NotebookLM workflows are needed
- Common pipeline: add sources → research/query → use findings as slide content

## Workflow

1. **Create or identify the project directory** under `projects/<project-name>/`
2. **Gather source content** into `projects/<project-name>/sources/` if applicable
3. **(Optional) Research with NotebookLM** — create a notebook, add sources, query for synthesis
4. **Generate the presentation** using the appropriate skill based on requested output format
5. **Save output** to `projects/<project-name>/output/` with versioned filename

Always ask the user which output format they want if not specified. Both HTML and PPTX are first-class outputs.

## Environment

- Python 3.12 via `uv` (use `uv add`, `uv pip install`, etc.)
- venv at `.venv/` — activate with `source .venv/bin/activate`
- Key packages available: `python-pptx`, `python-docx`, `PyPDF2`, `pillow`, `beautifulsoup4`, `httpx`, `pydantic`
- Install new dependencies with: `uv add <package>` or `uv pip install <package>`

## Important Rules

- NEVER overwrite a previous version of an output file — always increment the version number
- Always create the project subdirectory structure before generating output
- When a project involves both HTML and PPTX output, generate them independently (don't convert one to the other unless explicitly asked)
- For NotebookLM operations: if auth errors occur, run `nlm login` in terminal
- Source files in `sources/` are inputs — never modify or delete them
