# Agent Notes

This repository is a personal portfolio website for Aditya Jhaveri. Future agents should treat it as a production-facing personal site: keep copy accurate, avoid unnecessary redesign churn, and preserve recruiter-facing consistency.

## Architecture

- `index.html` is the main page and contains most CSS inline in the `<style>` block.
- `main.js` controls site interactions:
  - animated stars
  - smooth anchor scrolling
  - section reveal behavior
  - custom cursor and cursor trails
  - profile image reveal fallback
  - PDF.js resume rendering and pagination
  - EmailJS contact form and rocket launch feedback
  - theme toggle and mobile menu
  - career orbit map console updates
- `assets/portfolio-bot.js` is a self-contained Shadow DOM chatbot widget.
- `api/chat.php` is the Gemini chatbot API. It chunks local markdown files, ranks relevant context, builds a grounded prompt, and returns an answer.
- `api/log.php` and `api/_logger.php` handle bounded logging to `logs/portfolio-bot.log`.
- `data/*.md` is the chatbot knowledge base.

## Important Consistency Rule

Visible portfolio content and chatbot knowledge are separate. If you change professional facts, metrics, role descriptions, skills, project descriptions, links, dates, work authorization wording, or recruiter-facing positioning, update both:

- the visible page in `index.html`
- the relevant markdown file under `data/`

Do not assume the chatbot reads the HTML.

## Local Development

The static page can be opened directly, but chatbot API testing needs a PHP server:

```sh
php -S localhost:8080
```

Then test:

```text
http://localhost:8080/
http://localhost:8080/api/chat.php
```

The chatbot requires a Gemini API key from `api/chat.config.php` or `GEMINI_API_KEY`. Do not commit real secrets. Use `api/chat.config.example.php` only as a shape/reference.

## Editing Guidance

- Keep edits scoped. This site is mostly hand-authored HTML/CSS/JS.
- Use existing class/style patterns in `index.html` before adding new abstractions.
- Avoid moving large CSS blocks unless the task explicitly asks for a refactor.
- Preserve the two-theme design unless the user asks to remove or redesign it.
- Preserve accessibility affordances such as skip link, labels, ARIA attributes, and keyboard handling.
- Keep `data/*.md` written in clear recruiter/interviewer-friendly language because the chatbot uses it directly.
- Avoid adding dependencies unless there is a concrete need. There is no package manager setup in the repo.
- Use `rg` for search and `apply_patch` for manual edits.

## Verification Checklist

For copy-only changes:

- Search for duplicated facts across `index.html` and `data/*.md`.
- Run `git diff --check`.

For frontend behavior changes:

- Open the page locally and check desktop/mobile layout.
- Check theme toggle, mobile menu, anchor scrolling, resume preview, and contact form area.
- Check browser console for errors.

For chatbot changes:

- Start a PHP server from the repo root.
- Check `GET /api/chat.php`.
- Ask at least one question for the touched source file, such as projects, experience, skills, courses, or professional profile.
- Review `logs/portfolio-bot.log` only if debugging errors; do not commit log noise.
