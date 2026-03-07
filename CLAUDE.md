# Pelican Site Configuration and Rules

This is a Pelican static site generator project using Python.
Theme: [Mention your theme name]
Markdown Parser: [e.g., Markdown or Pandoc]

## Core Structure
- `content/`: Contains all Markdown/reStructuredText articles and pages.
- `content/pages/`: Static pages (About, Contact, etc.).
- `themes/`: Custom Pelican themes.
- `output/`: Generated HTML (do not manually edit this).
- `pelicanconf.py`: Local development configuration.
- `publishconf.py`: Production/Publishing configuration.

## Commands
- before python, make commands run `source ./venv/bin/activate`
- `make html`: Generate site locally.
- `make serve`: Serve site on localhost:8000.
- `make publish`: Generate site for production.
- `create_new_post.py`: create new post script.
- If tools required missing use `brew install`

## Rules for Claude
1. **Content Creation**: When creating new posts, always use Markdown (`.md`) format.
2. **Metadata**: Ensure all content files contain the necessary Pelican metadata header (Title, Date, Category, Tags, Slug).
3. **Drafts**: If not ready for publishing, set `Status: draft` in metadata.
4. **Links**: Use `|filename|` for internal linking to ensure correct paths.
5. **Images**: Store images in `content/images/` and reference them correctly.
6. **Themes**: Do not modify files inside `themes/` unless explicitly told to.
7. **Configuration**: When updating settings, prefer modifying `pelicanconf.py` over `publishconf.py`.

## Content Metadata Template
```markdown
Title: [Title]
Date: 2025-02-19
Category: [Category]
Tags: [Tag1, Tag2]
Slug: [slug-name]
Author: [Your Name]
Summary: [Short summary]

Body goes here.

