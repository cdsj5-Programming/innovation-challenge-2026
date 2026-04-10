# 本機 AI 評分工作流

這份文件用於之後在本機使用 Codex，從 `學生作品/` 資料夾讀取學生作品並輸出評分 CSV。

## 建議格式選擇

最適合的準備方式不是單一 `.txt`，而是以下組合：

1. `Skill`
   - 給 Codex 固定流程與評分規則
2. `.md`
   - 給人看得懂的工作流與資料夾規格
3. `.csv`
   - 作為最終評分輸出格式

## 為甚麼不用單純 `.txt`

- 結構不穩定，不利後續重複使用
- 欄位定義不清楚時，容易每次輸出格式不同
- 無法像 CSV 一樣直接匯入 Google Sheet 或 Excel

## 建議資料夾結構

```text
學生作品/
├── README.md
├── ai_grading_results.csv
├── F2A_G01_單車安全監察系統/
│   ├── submission.md
│   ├── science_poster.jpg
│   └── generated_submission.pdf
└── F2A_G02_智慧垃圾分類箱/
    ├── submission.md
    └── science_poster.jpg
```

## 每組作品最少需要的檔案

- `submission.md`
- `science_poster.jpg`

`submission.md` 建議包含：

- `project_title`
- `problem_statement`
- `design_concept`
- `solution_details`
- `ai_usage`

## 建議輸出 CSV 欄位

- `submission_id`
- `class_name`
- `group_key`
- `student_names`
- `project_title`
- `source_folder`
- `submission_text_file`
- `science_poster_file`
- `score_problem_importance`
- `score_creativity_originality`
- `score_feasibility_execution`
- `score_expression_visual`
- `score_ai_usage`
- `score_total`
- `summary_comment`
- `strengths`
- `improvements`
- `risk_flags`
- `confidence`
- `review_needed`
- `reviewed_at`

## 建議工作流程

1. 把每組學生作品放到 `學生作品/` 內，一組一個資料夾
2. 讓 Codex 掃描所有組別資料夾
3. 先讀 `submission.md`
4. 再讀 `science_poster.jpg`
5. 按官方 100 分制產出結構化評分
6. 匯出 `學生作品/ai_grading_results.csv`
7. 對 `review_needed = true` 的作品做人手覆核

## 日後建議指令

之後你可以直接對 Codex 說：

`請讀取 學生作品/，按 macau-innovation-screening skill 評分，並輸出 ai_grading_results.csv。`
