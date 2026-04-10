---
name: macau-innovation-screening
description: Evaluate or self-review submissions for 第一屆聖五中學生創意設計挑戰賽 and similar Macau school innovation events. Use when the task is to score student entries that contain structured text fields plus one science poster JPG, apply the official 100-point rubric, generate Traditional Chinese feedback, or design batch grading workflows for Google Sheet, Apps Script, or CSV exports.
---

# Macau Innovation Screening

Use this skill when the submission format is centered on:

- structured text fields
- one science poster image
- AI-assisted preliminary grading

This version is aligned to the local reference files for:

- `第一屆聖五中學生創意設計挑戰賽`
- `作品介紹文檔`
- `作品介紹文檔(範本)`

## Confirmed competition context

Treat the following as confirmed unless the user gives a newer local rule:

- competition: 第一屆聖五中學生創意設計挑戰賽
- stage: AI 初審 / 自評輔助
- team size: 2 至 3 人
- submission components:
  - 題目名稱
  - 問題說明
  - 設計理念
  - 解決方案細節
  - 人工智能使用情況
  - 科學海報 JPG
- languages allowed: 中文或英文

## Local integration defaults

When the task involves the deployed submission flow, Google Drive, Google Sheet, Apps Script, or the linked GitHub repository, load `references/local-service-config.md`.

Treat those IDs, URLs, sheet names, and repo coordinates as the default local integration targets unless the user gives newer values.

## Local folder grading mode

When the user wants to grade student works from the local `學生作品/` folder and export results to CSV:

- load `references/local-folder-grading.md`
- treat `學生作品/README.md` as the source-of-truth folder convention
- use `references/ai_grading_output_template.csv` as the default CSV column order

Prefer Markdown instructions and CSV templates over plain `.txt` notes so future Codex runs can reuse a stable structure.

## Official rubric

Use the official 100-point rubric in `references/rubric.md` unless the user explicitly asks for another one.

Do not replace it with the older 30-point research-style rubric.

## Core workflow

### 1. Gather the submission package

Collect or confirm these fields:

- `project_title`
- `problem_statement`
- `design_concept`
- `solution_details`
- `ai_usage`
- `science_poster` or `science_poster_url`
- optional metadata:
  - `class_name`
  - `group_key`
  - `student_names`

If one of the four text fields is missing, state which field is missing and lower confidence.

### 2. Read text first, then use the poster as supporting evidence

Default reading priority:

1. 問題說明
2. 設計理念
3. 解決方案細節
4. 人工智能使用情況
5. 科學海報

Use the poster to judge:

- whether the visual communication is clear
- whether the main ideas are consistent with the text
- whether the project summary is coherent

If the poster cannot be read clearly, mention that and reduce confidence instead of inventing details.

### 3. Score with the official five dimensions

Use the official weights:

1. 問題識別與重要性: 20
2. 創意與原創性: 25
3. 可行性與實施細節: 25
4. 表現與視覺傳達: 20
5. 人工智能的使用: 10

Scoring guidance:

- judge only from provided content
- do not add facts not present
- do not over-reward polished wording if the idea is thin
- do not over-penalize unfinished prototypes if the concept and implementation path are clear
- if no AI was used, score the AI section based on honesty and appropriateness, not on whether AI appears everywhere

### 4. Produce one of two output modes

#### A. Teacher screening mode

Use this when the result will go to Sheet, CSV, or a teacher dashboard.

Output:

- score per official dimension
- total score out of 100
- 1 concise overall comment
- 2 to 3 strengths
- 2 to 3 improvements
- `risk_flags`
- `confidence`
- `review_needed`

#### B. Student self-review mode

Use this when the goal is to help students improve before final submission.

Output:

- estimated score band
- what is already clear
- what is still too vague
- how to improve the science poster
- how to make AI usage disclosure more complete

Keep the tone constructive and specific.

### 5. Mark risk and uncertainty explicitly

Use `review_needed = true` when:

- the poster is missing or unreadable
- one or more required text fields are empty
- the solution details are too vague to assess feasibility
- the content appears inconsistent between text and poster
- there are signs of duplication, plagiarism, or fabricated AI usage notes

## Output patterns

### A. Teacher JSON

Use this shape for structured grading:

```json
{
  "submission_id": "",
  "scores": {
    "problem_importance": 0,
    "creativity_originality": 0,
    "feasibility_execution": 0,
    "expression_visual": 0,
    "ai_usage": 0
  },
  "total_score": 0,
  "summary_comment": "",
  "strengths": ["", ""],
  "improvements": ["", ""],
  "risk_flags": ["none"],
  "confidence": 0.0,
  "review_needed": false
}
```

### B. Student feedback

Use this shape when the user wants plain-language coaching:

- **預估分數帶**: 例如 70-79
- **目前做得好的地方**: 2-3 點
- **最需要補強的地方**: 2-3 點
- **海報建議**: 1-2 點
- **AI 使用說明建議**: 1-2 點

## Guardrails

- Always use Traditional Chinese for comments unless the user requests another language.
- If the user says local reference files are the latest source of truth, trust those local files over older public assumptions.
- Keep official rubric and recommended improvements clearly separated.
- If OCR or poster reading quality is poor, say so directly.
- Avoid long praise paragraphs. Comments should help teachers or students act.

## References

- official rubric: `references/rubric.md`
- prompt templates: `references/prompt-template.md`
- status handoff: `references/status-log-2026-04-10.md`
- local service config: `references/local-service-config.md`
- local folder grading: `references/local-folder-grading.md`
- CSV template: `references/ai_grading_output_template.csv`
