# Local Folder Grading

Use this workflow when student submissions are collected into the local `學生作品/` folder and Codex needs to produce one CSV file with AI grading results.

## Recommended artifacts

Use these three artifacts together:

1. `學生作品/README.md`
2. `references/local-folder-grading.md`
3. `references/ai_grading_output_template.csv`

Do not rely on ad hoc `.txt` notes unless the user explicitly requests that format.

## Expected folder convention

Each team should have one folder under `學生作品/`.

Recommended folder name:

- `{class_name}_{group_key}_{short_title}`

Each team folder should contain:

- `submission.md` or `submission.txt`
- `science_poster.jpg`
- optional supporting files:
  - `generated_submission.pdf`
  - `notes.txt`

If `submission.md` is missing but the text is available in another file, extract the four required fields and note lower confidence.

## Required fields to read

- `project_title`
- `problem_statement`
- `design_concept`
- `solution_details`
- `ai_usage`
- `science_poster`

## CSV output rule

Write one row per team using the exact column order from `references/ai_grading_output_template.csv`.

Default output filename:

- `學生作品/ai_grading_results.csv`

## Review flags

Set `review_needed` to `true` when:

- the text fields are incomplete
- the poster file is missing or unreadable
- the folder contains conflicting versions
- the content appears duplicated or inconsistent
- confidence is below `0.70`

## Suggested future Codex prompt shape

When the user says "幫我評分學生作品並輸出 CSV", do this:

1. scan all team folders under `學生作品/`
2. read `submission.md` first
3. inspect `science_poster.jpg` if present
4. score by the official five-dimension rubric
5. generate `學生作品/ai_grading_results.csv`
6. summarize which folders need human review
