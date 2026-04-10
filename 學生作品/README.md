# 學生作品資料夾說明

這個資料夾給之後本機使用 Codex 做 AI 評分。

## 放檔方式

每一組作品請放在自己的資料夾內。

建議命名：

- `班級_組別_作品簡稱`

例如：

- `F2A_G01_單車安全監察系統`
- `F2B_G03_智慧垃圾分類箱`

## 每組資料夾建議內容

- `submission.md`
- `science_poster.jpg`
- optional:
  - `generated_submission.pdf`
  - `notes.txt`

## submission.md 建議格式

```md
# project_title
單車安全監察系統

## class_name
F2A

## group_key
G01

## student_names
陳大文、李小明、王美儀

## problem_statement
...

## design_concept
...

## solution_details
...

## ai_usage
...
```

## AI 評分輸出

之後 Codex 會把結果輸出為：

- `學生作品/ai_grading_results.csv`

如果某組缺檔、海報看不到、內容矛盾，CSV 內的 `review_needed` 會標成 `true`。
